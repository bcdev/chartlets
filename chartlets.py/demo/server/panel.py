#  Copyright (c) 2019-2026 by Brockmann Consult Development team
#  Permissions are hereby granted under the terms of the MIT License:
#  https://opensource.org/licenses/MIT.

from chartlets import Contribution


class Panel(Contribution):
    """A Panel UI contribution.

    It is up to the application UI to render its UI contributions
    in an appropriate form.
    """

    def __init__(self, name: str, title: str | None = None):
        super().__init__(name, title=title)
