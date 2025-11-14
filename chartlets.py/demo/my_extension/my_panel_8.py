import altair as alt
import pandas as pd
from chartlets import Component, Input, State, Output
from chartlets.components import Tabs, Tab, Typography, Box, VegaChart

from server.context import Context
from server.panel import Panel


panel = Panel(__name__, title="Panel H")


@panel.layout(State("@app", "selectedDatasetId"))
def render_panel(
    ctx: Context,
    selected_dataset_id: str = "",
) -> Component:
    dataset = ctx.datasets.get(selected_dataset_id)

    c = (
        alt.Chart(dataset)
        .mark_bar()
        .encode(
            x=alt.X("x:N", title="x"),
            y=alt.Y("a:Q", title="a"))
    )

    chart = VegaChart(
        id="chart1", chart=c, style={"flexGrow": 1}
    )

    info_text = Typography(id="info_text", children=["hallo"])

    tab1=Tab(id = "tab1",label="Plot 1", children=["Hallo"])
    tab2=Tab(id = "tab2",label="Plot 2", children=[info_text])
    tab3 = Tab(id="tab3", label="Plot 3", children=[chart])

    select = Tabs(id = "tab", value = 0, children=[tab1,tab2,tab3])


    return Box(
        style={
            "display": "flex",
            "flexDirection": "column",
            "width": "100%",
            "height": "100%",
        },
        children=[chart, info_text, select,tab2],
    )

