#  Copyright (c) 2019-2026 by Brockmann Consult Development team
#  Permissions are hereby granted under the terms of the MIT License:
#  https://opensource.org/licenses/MIT.

from chartlets.components import Checkbox
from tests.component_test import make_base


class CheckboxTest(make_base(Checkbox)):

    def test_is_json_serializable(self):
        self.assert_is_json_serializable(
            self.cls(value=True, label="Auto-safe"),
            {"type": "Checkbox", "value": True, "label": "Auto-safe"},
        )
