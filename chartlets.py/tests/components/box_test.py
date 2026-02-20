#  Copyright (c) 2019-2026 by Brockmann Consult Development team
#  Permissions are hereby granted under the terms of the MIT License:
#  https://opensource.org/licenses/MIT.

from chartlets.components import Box
from tests.component_test import make_base


class BoxTest(make_base(Box)):

    def test_is_json_serializable(self):
        self.assert_is_json_serializable(
            self.cls(
                children=[
                    Box(id="b1"),
                    Box(id="b2"),
                ],
                style={"color": "grey", "display": "flex"},
            ),
            {
                "type": "Box",
                "children": [
                    {"children": [], "id": "b1", "type": "Box"},
                    {"children": [], "id": "b2", "type": "Box"},
                ],
                "style": {"color": "grey", "display": "flex"},
            },
        )
