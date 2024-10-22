import altair as alt

from dashipy import (Component, Input, Output)
from dashipy.components import (Plot, Box, Dropdown)
from dashipy.demo.contribs import Panel
from dashipy.demo.context import Context


panel = Panel(__name__, title="Panel A")


@panel.layout()
def render_panel(ctx: Context) -> Component:
    selected_dataset: int = 0
    plot = Plot(
        id="plot", figure=make_figure(ctx, selected_dataset), style={"flexGrow": 1}
    )
    dropdown = Dropdown(
        id="selected_dataset",
        value=selected_dataset,
        label="Dataset",
        options=[(f"DS #{i + 1}", i) for i in range(len(ctx.datasets))],
        style={"flexGrow": 0, "minWidth": 120},
    )
    control_group = Box(
        style={
            "display": "flex",
            "flexDirection": "row",
            "padding": 4,
            "justifyContent": "center",
            "gap": 4,
        },
        children=[dropdown],
    )
    return Box(
        style={
            "display": "flex",
            "flexDirection": "column",
            "width": "100%",
            "height": "100%",
        },
        children=[plot, control_group],
    )


@panel.callback(
    Input("selected_dataset"),
    Output("plot", "figure"),
)
def make_figure(ctx: Context, selected_dataset: int = 0) -> alt.Chart:
    dataset = ctx.datasets[selected_dataset]
    corner_slider = alt.binding_range(min=0, max=50, step=1)
    corner_var = alt.param(bind=corner_slider, value=0, name="cornerRadius")
    click_param = alt.selection_point(on="click", name="onClick", fields=["a", "b"])
    fig = alt.Chart(dataset).mark_bar(cornerRadius=corner_var).encode(
        x=alt.X('a:N', title='a'),
        y=alt.Y('b:Q', title='b'),
        tooltip=[
            alt.Tooltip('a:N'),
            alt.Tooltip('b:Q'),
        ],
        color='b:Q',
    ).properties(
        width=300,
        height=300,
        title="Vega charts"
    ).add_params(corner_var, click_param)
    print(fig.to_json())
    return fig
