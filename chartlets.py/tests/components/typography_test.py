#  Copyright (c) 2019-2026 by Brockmann Consult Development team
#  Permissions are hereby granted under the terms of the MIT License:
#  https://opensource.org/licenses/MIT.

from chartlets.components import Typography
from tests.component_test import make_base


class TypographyTest(make_base(Typography)):

    def test_is_json_serializable(self):
        self.assert_is_json_serializable(
            self.cls(
                variant="subtitle2",
                gutterBottom=True,
                component="span",
                children=["Hello", "World"],
            ),
            {
                "type": "Typography",
                "variant": "subtitle2",
                "gutterBottom": True,
                "component": "span",
                "children": ["Hello", "World"],
            },
        )
