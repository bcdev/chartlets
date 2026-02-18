#  Copyright (c) 2019-2026 by Brockmann Consult Development team
#  Permissions are hereby granted under the terms of the MIT License:
#  https://opensource.org/licenses/MIT.

from chartlets.components import Button
from tests.component_test import make_base


class ButtonTest(make_base(Button)):

    def test_is_json_serializable(self):
        self.assert_is_json_serializable(
            self.cls(text="Update"),
            {"type": "Button", "text": "Update"},
        )
