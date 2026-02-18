#  Copyright (c) 2019-2026 by Brockmann Consult Development team
#  Permissions are hereby granted under the terms of the MIT License:
#  https://opensource.org/licenses/MIT.

from chartlets.components import Select
from tests.component_test import make_base


class SelectTest(make_base(Select)):

    def test_is_json_serializable(self):
        self.assert_is_json_serializable(
            self.cls(options=[1, 2, 3]),
            {"type": "Select", "options": [1, 2, 3]},
        )

        self.assert_is_json_serializable(
            self.cls(options=[[1, "red"], [2, "green"], [3, "blue"]]),
            {"type": "Select", "options": [[1, "red"], [2, "green"], [3, "blue"]]},
        )

        self.assert_is_json_serializable(
            self.cls(options=[(1, "red"), (2, "green"), (3, "blue")]),
            {"type": "Select", "options": [[1, "red"], [2, "green"], [3, "blue"]]},
        )
