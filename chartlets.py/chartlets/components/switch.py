#  Copyright (c) 2019-2026 by Brockmann Consult Development team
#  Permissions are hereby granted under the terms of the MIT License:
#  https://opensource.org/licenses/MIT.

from dataclasses import dataclass

from chartlets import Component


@dataclass(frozen=True)
class Switch(Component):
    """Switches toggle the state of a single setting on or off."""

    value: bool | None = None
    """The switch value."""

    label: str = ""
    """The switch label."""
