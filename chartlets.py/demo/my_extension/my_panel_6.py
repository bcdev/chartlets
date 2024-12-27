from chartlets import Component, Input, State, Output
from chartlets.components import Box, Typography, Table

from server.context import Context
from server.panel import Panel

from chartlets.components.table import TableColumn, TableRowData

panel = Panel(__name__, title="Panel F")


# noinspection PyUnusedLocal
@panel.layout()
def render_panel(
    ctx: Context,
) -> Component:
    columns: list[TableColumn] = [
        {"id": "id", "label": "ID"},
        {"id": "firstName", "label": "First Name", "align": "left"},
        {"id": "lastName", "label": "Last Name", "align": "center"},
        {"id": "age", "label": "Age"},
    ]

    rows: list[TableRowData] = [
        {
            "id": 1,
            "data": {"id": "1", "firstName": "John", "lastName": "Doe", "age": 30},
        },
        {
            "id": 2,
            "data": {"id": "2", "firstName": "Jane", "lastName": "Smith", "age": 25},
        },
        {
            "id": 3,
            "data": {"id": "3", "firstName": "Peter", "lastName": "Jones", "age": 40},
        },
    ]

    table = Table(id="table", rows=rows, columns=columns, hover=True)

    title_text = Typography(id="title_text", children=["Basic Table"])
    info_text = Typography(id="info_text", children=["Click on any row."])

    return Box(
        style={
            "display": "flex",
            "flexDirection": "column",
            "width": "100%",
            "height": "100%",
            "gap": "6px",
        },
        children=[title_text, table, info_text],
    )


# noinspection PyUnusedLocal
@panel.callback(Input("table"), Output("info_text", "children"))
def update_info_text(
    ctx: Context,
    table_row: int,
) -> list[str]:
    return [f"The clicked row value is {table_row}."]
