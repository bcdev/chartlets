from dataclasses import dataclass, field

from dashipy.lib import Component


@dataclass(frozen=True)
class Dropdown(Component):
    options: list[tuple[str, str | int | float]] = field(default_factory=list)