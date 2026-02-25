#  Copyright (c) 2019-2026 by Brockmann Consult Development team
#  Permissions are hereby granted under the terms of the MIT License:
#  https://opensource.org/licenses/MIT.


from chartlets import Component, State
from chartlets.components import (
    Accordion,
    Typography,
    Box,
    Table
)
from chartlets.components.table import TableColumn, TableRow


from server.context import Context
from server.panel import Panel


panel = Panel(__name__, title="Panel I")


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

    info_text = Typography(id="info_text", children=["This is a text."])

    accordion1 = Accordion(
        id="accordion1",
        label="Accordion No.1",
        icon="arrow_drop_down",
        children=[info_text],
    )

    accordion2 = Accordion(
        id="accordion2",
        label="Accordion No.2",
        icon="arrow_drop_down",
        # expanded=True,
        # disabled=True
        children=[table],
    )

    return Box(
        style={
            "display": "flex",
            "flexDirection": "column",
            "width": "100%",
            "height": "100%",
        },
        children=[accordion1, accordion2],
    )
