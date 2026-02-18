#  Copyright (c) 2019-2026 by Brockmann Consult Development team
#  Permissions are hereby granted under the terms of the MIT License:
#  https://opensource.org/licenses/MIT.

from chartlets.components import Switch
from tests.component_test import make_base


class SwitchTest(make_base(Switch)):

    def test_is_json_serializable(self):
        self.assert_is_json_serializable(
            self.cls(value=True, label="Auto-safe"),
            {"type": "Switch", "value": True, "label": "Auto-safe"},
        )
