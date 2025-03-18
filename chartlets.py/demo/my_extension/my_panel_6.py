import time

from chartlets import Component, Input, Output
from chartlets.components import Box, Typography, Table, Skeleton, Button

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

    table_skeleton = Skeleton(
        height="100%", width="100%", variant="rounded", animation="wave", opacity=0.1
    )

    table = Table(
        id="table",
        rows=rows,
        columns=columns,
        hover=True,
        skeletonProps=table_skeleton.to_dict(),
    )

    title_text = Typography(id="title_text", children=["Basic Table"])
    info_text = Typography(id="info_text", children=["Click on any row."])

    update_button = Button(id="update_button", text="Update Table")

    return Box(
        style={
            "display": "flex",
            "flexDirection": "column",
            "width": "100%",
            "height": "100%",
            "gap": "6px",
        },
        children=[title_text, table, update_button, info_text],
    )


# noinspection PyUnusedLocal
@panel.callback(
    Input("table"),
    Output("info_text", "children"),
)
def update_info_text(ctx: Context, table_row: int) -> list[str]:
    time.sleep(3)

    return [f"The clicked row value is {table_row}."]


@panel.callback(
    Input("update_button", "clicked"),
    Output("table", "rows"),
)
def update_table_rows(ctx: Context, update_button_clicked) -> TableRow:
    # simulate lag to show skeleton
    time.sleep(3)
    rows: TableRow = [
        ["1", "John", "Smith", 94],
        ["2", "Jane", "Jones", 5],
        ["3", "Peter", "Doe", 40.5],
    ]
    return rows
