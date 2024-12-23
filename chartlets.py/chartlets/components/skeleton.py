from dataclasses import dataclass
from typing import Literal

from chartlets import Component


@dataclass(frozen=True)
class Skeleton(Component):
    """Display a placeholder preview of your content before the data gets
    loaded to reduce load-time frustration."""

    variant: Literal["text", "rectangular", "circular", "rounded"] | str | None\
        = None
    """The type of skeleton to display."""

    width: str | int | None = None
    """Width of the skeleton. Can be a number (pixels) or a string (e.g., '100%')."""

    height: str | int | None = None
    """Height of the skeleton. Can be a number (pixels) or a string (e.g., '50px')."""

    animation: Literal["pulse", "wave", False] | None = None
    """The animation effect to use.
    - 'pulse': A subtle pulsing animation.
    - 'wave': A shimmering animation.
    - False: No animation.
    """
