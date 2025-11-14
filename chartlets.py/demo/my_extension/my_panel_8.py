import altair as alt

from chartlets import Component, Input, State, Output
from chartlets.components import (Tabs, Tab, Typography, Box,
                                  VegaChart, Table)
from chartlets.components.table import TableColumn, TableRow

from server.context import Context
from server.panel import Panel


panel = Panel(__name__, title="Panel H")


@panel.layout(State("@app", "selectedDatasetId"))
def render_panel(
    ctx: Context,
    selected_dataset_id: str = "",
) -> Component:
    dataset = ctx.datasets.get(selected_dataset_id)

    columns: list[TableColumn] = [
        {"id": "id", "label": "ID", "sortDirection": "desc"},
        {
            "id": "firstName",
            "label": "First Name",
            "align": "left",
            "sortDirection": "desc",
        },
        {"id": "lastName", "label": "Last Name", "align": "center"},
        {"id": "age", "label": "Age"},
    ]

    rows: TableRow = [
        ["1", "John", "Doe", 30],
        ["2", "Jane", "Smith", 25],
        ["3", "Peter", "Jones", 40],
    ]

    table = Table(id="table", rows=rows, columns=columns, hover=True)

    info_text = Typography(id="info_text", children=["This is a text."])
    chart = VegaChart(
        id="chart", chart=(
        alt.Chart(dataset)
        .mark_bar()
        .encode(
            x=alt.X("x:N", title="x"),
            y=alt.Y("a:Q", title="a"))
        .properties(width=290, height=300, title="Vega charts")
    ), style={"flexGrow": 1}
    )

    tab1 = Tab(id = "tab1", label="Tab 1", children=[table])
    tab2 = Tab(id = "tab2", label="Tab 2", children=[info_text])
    tab3 = Tab(id="tab3", label="Tab 3", children=[chart])

    tabs = Tabs(id = "tabs", value = 0, children=[tab1,tab2,tab3])

    return Box(
        style={
            "display": "flex",
            "flexDirection": "column",
            "width": "100%",
            "height": "100%",
        },
        children=[ tabs ],
    )

