#  Copyright (c) 2019-2026 by Brockmann Consult Development team
#  Permissions are hereby granted under the terms of the MIT License:
#  https://opensource.org/licenses/MIT.

from dataclasses import dataclass

from chartlets import Component


@dataclass(frozen=True)
class Checkbox(Component):
    """Checkboxes allow the user to select one or more items from a set.
    They can be used to turn an option on or off."""

    value: bool | None = None
    """The checkbox value."""

    label: str = ""
    """The checkbox label."""

    tooltip: str | None = None
    """Tooltip title. Optional."""
