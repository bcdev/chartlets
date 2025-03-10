from chartlets.components.table import TableColumn, Table, TableRow
from tests.component_test import make_base


class TableTest(make_base(Table)):

    def test_is_json_serializable_empty(self):
        self.assert_is_json_serializable(
            self.cls(),
            {
                "type": "Table",
            },
        )

        columns: list[TableColumn] = [
            {"id": "id", "label": "ID"},
            {"id": "firstName", "label": "First Name"},
            {"id": "lastName", "label": "Last Name"},
            {"id": "age", "label": "Age"},
        ]
        rows: TableRow = [
            ["John", "Doe", 30],
            ["Jane", "Smith", 25],
            ["Johnie", "Undoe", 40],
        ]
        hover: bool = True
        style = {"background-color": "lightgray", "width": "100%"}

        self.assert_is_json_serializable(
            self.cls(columns=columns, rows=rows, style=style, hover=hover),
            {
                "type": "Table",
                "columns": columns,
                "rows": rows,
                "style": style,
                "hover": hover,
            },
        )
