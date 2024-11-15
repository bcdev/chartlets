import inspect
import types
from typing import Any, Callable

from chartlets.channel import (
    Input,
    Output,
    State,
)


class Callback:
    """A callback is a server-side function
    whose 1st parameter is always a context object.
    All other parameters must be described by
    input objects.
    """

    @classmethod
    def from_decorator(
        cls,
        decorator_name: str,
        decorator_args: tuple[Any, ...],
        function: Any,
        outputs_allowed: bool = False,
    ) -> "Callback":
        try:
            signature = inspect.signature(function)
        except TypeError:
            raise TypeError(
                f"decorator {decorator_name!r} must be"
                f" used with a callable, but got"
                f" {function.__class__.__name__!r}"
            )

        function_name = function.__qualname__

        if len(signature.parameters) == 0:
            raise TypeError(
                f"function {function_name!r} decorated with"
                f" {decorator_name!r} must have at least one"
                f" context parameter"
            )

        inputs: list[Input | State] = []
        outputs: list[Output] = []
        for arg in decorator_args:
            if isinstance(arg, (Input, State)):
                inputs.append(arg)
            elif outputs_allowed and isinstance(arg, Output):
                outputs.append(arg)
            elif outputs_allowed:
                raise TypeError(
                    f"arguments for decorator {decorator_name!r}"
                    f" must be of type Input, State, Output, AppInput,"
                    f" or AppOutput, but got {arg.__class__.__name__!r}"
                )
            else:
                raise TypeError(
                    f"arguments for decorator {decorator_name!r}"
                    f" must be of type Input,"
                    f" but got {arg.__class__.__name__!r}"
                )

        num_params = len(signature.parameters) - 1
        num_inputs = len(inputs)
        delta = num_inputs - num_params
        if delta != 0:
            raise TypeError(
                f"too {'few' if delta < 0 else 'many'} inputs"
                f" in decorator {decorator_name!r} for"
                f" function {function_name!r}:"
                f" expected {num_params},"
                f" but got {num_inputs}"
            )

        return Callback(function, inputs, outputs, signature=signature)

    def __init__(
        self,
        function: Callable,
        inputs: list[Input | State],
        outputs: list[Output],
        signature: inspect.Signature | None = None,
    ):
        """Private constructor.
        Use `from_decorator` to instantiate callback objects.
        """
        signature = signature if signature is not None else inspect.signature(function)
        self.function = function
        self.signature = signature
        self.param_names = tuple(signature.parameters.keys())
        self.inputs = inputs
        self.outputs = outputs

    def invoke(self, context: Any, input_values: list | tuple):
        args, kwargs = self.make_function_args(context, input_values)
        return self.function(*args, **kwargs)

    def to_dict(self) -> dict[str, Any]:
        # skip ctx parameter:
        parameters = list(self.signature.parameters.values())[1:]
        d = {
            "function": {
                "name": self.function.__qualname__,
                "parameters": [_parameter_to_dict(p) for p in parameters],
                "returnType": _annotation_to_json_schema(
                    self.signature.return_annotation
                ),
            }
        }
        if self.inputs:
            d.update({"inputs": [inp.to_dict() for inp in self.inputs]})
        if self.outputs:
            d.update({"outputs": [out.to_dict() for out in self.outputs]})
        return d

    def make_function_args(
        self, context: Any, values: tuple | list
    ) -> tuple[tuple, dict]:
        num_inputs = len(self.inputs)
        num_values = len(values)
        delta = num_inputs - num_values
        if delta != 0:
            message = (
                f"too {'few' if delta > 0 else 'many'} input values"
                f" given for function {self.function.__qualname__!r}:"
                f" expected {num_inputs},"
                f" but got {num_values}"
            )
            if delta > 0:
                values = (*values, *(delta * (None,)))
                print(f"WARNING: {message}")  # TODO use logging
            else:
                raise TypeError(message)

        param_names = self.param_names[1:]
        args = [context]
        kwargs = {}
        for i, param_value in enumerate(values):
            param_name = param_names[i]
            param = self.signature.parameters[param_name]
            if param.kind == param.POSITIONAL_ONLY:
                args.append(param_value)
            else:
                kwargs[param_name] = param_value

        return tuple(args), kwargs


def _parameter_to_dict(parameter: inspect.Parameter) -> dict[str, Any]:
    empty = inspect.Parameter.empty
    d = {"name": parameter.name}
    if parameter.annotation is not empty:
        d |= {"type": _annotation_to_json_schema(parameter.annotation)}
    if parameter.default is not empty:
        d |= {"default": parameter.default}
    return d


_scalar_types = {
    "None": "null",
    "NoneType": "null",
    "bool": "boolean",
    "int": "integer",
    "float": "number",
    "str": "string",
    "object": "object",
}

_object_types = {"Component": "Component", "Chart": "Chart"}


def _annotation_to_json_schema(annotation: Any) -> dict:
    if isinstance(annotation, types.UnionType):
        return {"type": list(map(_annotation_to_json_schema, annotation.__args__))}
    elif isinstance(annotation, types.GenericAlias):
        if annotation.__origin__ is tuple:
            return {
                "type": "array",
                "items": list(map(_annotation_to_json_schema, annotation.__args__)),
            }
        elif annotation.__origin__ is list:
            if annotation.__args__:
                return {
                    "type": "array",
                    "items": _annotation_to_json_schema(annotation.__args__[0]),
                }
            else:
                return {
                    "type": "array",
                }
    else:
        type_name = (
            annotation.__name__ if hasattr(annotation, "__name__") else str(annotation)
        )
        try:
            return {"type": _scalar_types[type_name]}
        except KeyError:
            pass
        try:
            return {"type": "object", "class": _object_types[type_name]}
        except KeyError:
            pass
    raise TypeError(f"unsupported type annotation: {annotation}")
