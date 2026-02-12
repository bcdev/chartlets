#  Copyright (c) 2019-2026 by Brockmann Consult Development team
#  Permissions are hereby granted under the terms of the MIT License:
#  https://opensource.org/licenses/MIT.

from dataclasses import dataclass

from chartlets import Container


@dataclass(frozen=True)
class Box(Container):
    """The Box component is a generic container for grouping other components.
    It's a fundamental building block. Think of it as an HTML `<div>` element.

    Use the `style` attribute to layout the box and its child components.
    """

    component: str | None = None
    """The component to be used, e.g., `div` or `span`."""
