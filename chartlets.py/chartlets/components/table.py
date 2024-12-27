from dataclasses import dataclass
from typing import List, Literal, TypedDict, Optional, Dict, Union
from chartlets import Component


class TableCellProps(TypedDict, total=False):
    """Represents common properties of a table cell."""

    id: str | int | float
    """The unique identifier for the cell."""

    size: Literal['medium', 'small'] | str | None
    """The size of the cell."""

    align: Literal["inherit", "left", "center", "right", "justify"] | None
    """The alignment of the cell content."""


class TableColumn(TableCellProps):
    """Defines a column in the table."""

    label: str
    """The display label for the column header."""


class TableRowData(TableCellProps):
    """Defines a row in the table."""

    data: dict[str, Union[str, int, float, bool, None]]
    """The data for the row, as a dictionary where keys are the column ids."""


@dataclass(frozen=True)
class Table(Component):
    """A basic Table with configurable rows and columns."""

    columns: list[TableColumn] | None = None
    """The columns to display in the table."""

    rows: list[TableRowData] | None = None
    """The rows of data to display in the table."""

    hover: bool | None = None
    """A boolean indicating whether to highlight a row when hovered over"""
