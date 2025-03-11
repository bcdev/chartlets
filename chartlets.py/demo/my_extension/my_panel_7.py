import altair as alt
import pandas as pd
from chartlets import Component, Input, State, Output
from chartlets.components import VegaChart, Box, Select, Typography

from server.context import Context
from server.panel import Panel


panel = Panel(__name__, title="Panel G")


@panel.layout(State("@app", "selectedDatasetId"))
def render_panel(
    ctx: Context,
    selected_dataset_id: str = "",
) -> Component:
    dataset = ctx.datasets.get(selected_dataset_id)
    variable_names, selected_var_names = get_variable_names(dataset)

    select = Select(
        id="selected_variable_name",
        value=[],
        label="Variable",
        options=[(v, v) for v in variable_names],
        style={"flexGrow": 0, "minWidth": 120},
        multiple=True,
        tooltip="Select the variables of the test dataset",
    )
    control_group = Box(
        style={
            "display": "flex",
            "flexDirection": "row",
            "padding": 4,
            "justifyContent": "center",
            "gap": 4,
        },
        children=[select],
    )

    text = update_info_text(ctx, selected_dataset_id)
    info_text = Typography(id="info_text", children=text)

    return Box(
        style={
            "display": "flex",
            "flexDirection": "column",
            "width": "100%",
            "height": "100%",
        },
        children=[info_text, control_group],
    )


def get_variable_names(
    dataset: pd.DataFrame,
    prev_var_name: str | None = None,
) -> tuple[list[str], list[str]]:
    """Get the variable names and the selected variable name
    for the given dataset and previously selected variable name.
    """

    if dataset is not None:
        var_names = [v for v in dataset.keys() if v != "x"]
    else:
        var_names = []

    if prev_var_name and prev_var_name in var_names:
        var_name = prev_var_name
    elif var_names:
        var_name = var_names[0]
    else:
        var_name = ""

    return var_names, var_name


@panel.callback(
    Input("@app", "selectedDatasetId"),
    Input("selected_variable_name", "value"),
    Output("info_text", "children"),
)
def update_info_text(
    ctx: Context,
    dataset_id: str = "",
    selected_var_names: list[str] | None = None,
) -> list[str]:

    if selected_var_names is not None:
        text = ", ".join(map(str, selected_var_names))
        return [f"The dataset is {dataset_id} and the selected variables are: {text}"]
    else:
        return [f"The dataset is {dataset_id} and no variables are selected."]
