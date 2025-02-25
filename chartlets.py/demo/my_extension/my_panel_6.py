from chartlets import Component, Input, Output
from chartlets.components import Box, Typography, Table

from server.context import Context
from server.panel import Panel

from chartlets.components.table import TableColumn, TableRow

panel = Panel(__name__, title="Panel F")


# noinspection PyUnusedLocal
@panel.layout()
def render_panel(
    ctx: Context,
) -> Component:
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
