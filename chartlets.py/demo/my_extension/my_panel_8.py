#  Copyright (c) 2019-2026 by Brockmann Consult Development team
#  Permissions are hereby granted under the terms of the MIT License:
#  https://opensource.org/licenses/MIT.

import altair as alt

from chartlets import Component, Input, State, Output
from chartlets.components import (
    Tabs,
    Tab,
    Typography,
    Box,
    VegaChart,
    Table,
    Button,
)
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

    open_button = Button(
        id="open_button", text="Show component!", style={"margin": "20px"}
    )

    table = Table(
        id="table",
        rows=rows,
        columns=columns,
        hover=True,
        style={"width": "250px", "margin": "30px"},
    )

    info_text = Typography(
        id="info_text", children=["This is a text."], style={"color": "pink"}
    )

    chart = VegaChart(
        id="chart",
        chart=(
            alt.Chart(dataset)
            .mark_bar()
            .encode(x=alt.X("x:N", title="x"), y=alt.Y("a:Q", title="a"))
            .properties(width=290, height=300, title="Vega charts")
        ),
        style={"flexGrow": 1, "margin": "10px"},
    )

    tab1 = Tab(
        id="tab1",
        label="Tab 1",
        children=[table],
        style={"backgroundColor": "darkblue", "padding": "1px"},
    )
    tab2 = Tab(id="tab2", label="Tab 2", children=[info_text])
    tab3 = Tab(
        id="tab3",
        label="Tab 3",
        children=[chart],
        style={
            "color": "darkseagreen",
            "backgroundColor": "darkgreen",
            "padding": "1px",
        },
    )

    tabs = Tabs(
        id="tabs",
        value=0,
        children=[tab1, tab2, tab3],
        style={"visibility": "hidden"},
    )

    return Box(
        style={
            "display": "flex",
            "flexDirection": "column",
            "width": "100%",
            "height": "100%",
        },
        children=[open_button, tabs],
    )


# noinspection PyUnusedLocal
@panel.callback(
    Input("open_button", "clicked"),
    Input("tabs", "style"),
    Output("tabs", "style"),
    Output("open_button", "text"),
)
def tabs_on_open(ctx: Context, button, style) -> tuple[dict, str]:
    visibility = style["visibility"]

    if visibility == "hidden":
        return (
            {**style, "visibility": "visible"},
            "Hide component!",
        )
    else:
        return (
            {**style, "visibility": "hidden"},
            "Show component!",
        )
