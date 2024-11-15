import unittest

from chartlets.demo.contribs import Panel
from chartlets.callback import Input, Callback, Output


# noinspection PyUnusedLocal
def my_callback_1(ctx):
    pass


# noinspection PyUnusedLocal
def my_callback_2(ctx, a: int = 0, b: str = "", c: bool = False) -> str:
    return f"{a}-{b}-{c}"


# noinspection PyMethodMayBeStatic
class DecoratorsTest(unittest.TestCase):

    def test_layout(self):
        panel = Panel("p13")
        self.assertIsNone(panel.layout_callback)
        panel.layout()(my_callback_1)
        self.assertIsInstance(panel.layout_callback, Callback)
        self.assertIs(my_callback_1, panel.layout_callback.function)

    def test_callback(self):
        panel = Panel("p13")
        panel.callback()(my_callback_1)
        panel.callback(Input("a"), Input("b"), Input("c"), Output("d"))(my_callback_2)
        self.assertEqual(2, len(panel.callbacks))
        callback = panel.callbacks[0]
        self.assertIsInstance(callback, Callback)
        self.assertIs(my_callback_1, callback.function)
        self.assertEqual(0, len(callback.inputs))
        self.assertEqual(0, len(callback.outputs))
        callback = panel.callbacks[1]
        self.assertIsInstance(callback, Callback)
        self.assertIs(my_callback_2, callback.function)
        self.assertEqual(3, len(callback.inputs))
        self.assertEqual(1, len(callback.outputs))
        self.assertEqual("a", callback.inputs[0].id)
        self.assertEqual("value", callback.inputs[0].property)
        self.assertEqual("b", callback.inputs[1].id)
        self.assertEqual("value", callback.inputs[1].property)
        self.assertEqual("c", callback.inputs[2].id)
        self.assertEqual("value", callback.inputs[2].property)
