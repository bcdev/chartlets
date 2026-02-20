#  Copyright (c) 2019-2026 by Brockmann Consult Development team
#  Permissions are hereby granted under the terms of the MIT License:
#  https://opensource.org/licenses/MIT.

from dataclasses import dataclass, field

from chartlets import Component


@dataclass(frozen=True)
class Tab(Component):
    """The tab element itself.
    Clicking on a tab displays its corresponding panel.
    """

    icon: str | None = None
    """The tab icon's name."""

    label: str | None = None
    """The tab label."""

    disabled: bool | None = None
    """Whether the tab is disabled."""


@dataclass(frozen=True)
class Tabs(Component):
    """Tabs make it easy to explore and switch between different views.
    Tabs organize and allow navigation between groups of content that
    are related and at the same level of hierarchy.
    """

    value: int | None = None
    """The currently selected tab index."""

    children: list[str | Tab] = field(default_factory=list)
    """The list of tab labels or `Tab` components."""
