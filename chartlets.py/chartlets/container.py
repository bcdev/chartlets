#  Copyright (c) 2019-2026 by Brockmann Consult Development team
#  Permissions are hereby granted under the terms of the MIT License:
#  https://opensource.org/licenses/MIT.

from abc import ABC
from dataclasses import dataclass, field

from .component import Component


@dataclass(frozen=True)
class Container(Component, ABC):
    """Base class for components that require child components to be useful."""

    children: list[Component] = field(default_factory=list)
    """The child components."""

    def add(self, component: Component):
        """Add a component.

        Args:
            component: the child component.
        """
        self.children.append(component)
