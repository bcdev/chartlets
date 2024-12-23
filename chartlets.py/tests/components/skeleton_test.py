from chartlets.components import Skeleton
from tests.component_test import make_base


class SkeletonTest(make_base(Skeleton)):

    def test_is_json_serializable(self):
        self.assert_is_json_serializable(
            self.cls(
                width=100,
                height=50,
                animation="pulse",
                id="my-skeleton",
                variant="rounded",
            ),
            {
                "type": "Skeleton",
                "width": 100,
                "height": 50,
                "animation": "pulse",
                "id": "my-skeleton",
                "variant": "rounded",
            },
        )
