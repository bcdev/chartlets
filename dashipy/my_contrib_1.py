import plotly.graph_objects as go
from plotly.graph_objs import Layout

from dashipy.components import Plot, Box, Dropdown
from dashipy.contribs import Panel
from dashipy.context import Context
from dashipy.lib import Output, Input, Component


panel = Panel()


@panel.layout(
    Input("context"),
    Input("selected_dataset"),
)
def layout(
    context: Context,
    selected_dataset: int = 0,
) -> Component:
    plot = Plot(
        id="plot",
        figure=make_figure(context, selected_dataset),
    )
    dropdown = Dropdown(
        id="selected_dataset",
        name="selected_dataset",
        options=[(f"DS #{i + 1}", i) for i in range(len(context.datasets))],
        value=selected_dataset,
    )
    control_group = Box(
        style={
            "display": "flex",
            "flexDirection": "row",
            "padding": 4,
            "justifyContent": "center",
            "gap": 4,
        },
        components=[dropdown],
    )
    return Box(
        style={
            "display": "flex",
            "flexDirection": "column",
        },
        components=[plot, control_group],
    )


@panel.callback(
    Input("context"),
    Input("selected_dataset"),
    Output("plot", "figure"),
)
def make_figure(context: Context, selected_dataset: int) -> go.Figure:
    dataset = context.datasets[selected_dataset]
    fig = go.Figure(layout=Layout(title=f"DS #{selected_dataset + 1}", autosize=True))
    fig.add_trace(go.Bar(x=["A", "B", "C"], y=dataset))
    return fig
