#  Copyright (c) 2019-2026 by Brockmann Consult Development team
#  Permissions are hereby granted under the terms of the MIT License:
#  https://opensource.org/licenses/MIT.


from dataclasses import dataclass, field

from chartlets import Component

@dataclass(frozen=True)
class Accordion(Component):
    """Accordion container."""

    label: str | None = None
    """Header of the accordion."""

    icon: str | None = None
    """Material icon name for the expand icon (e.g. 'expand_more')."""

    expanded: bool = field(default=False)
    """If set, controls whether the accordion is expanded."""

    disabled: bool | None = None
    """If set, controls whether the accordion is disabled."""

    children: list[Component] = field(default_factory=list)
    """Accordion content."""
