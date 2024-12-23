from chartlets.components import Dialog, Button
from tests.component_test import make_base


class DialogTest(make_base(Dialog)):

    def test_is_json_serializable(self):
        self.assert_is_json_serializable(
            self.cls(
                open=True,
                title="My Dialog",
                content="This is the content",
                maxWidth="md",
                scroll="body",
            ),
            {
                "type": "Dialog",
                "open": True,
                "title": "My Dialog",
                "content": "This is the content",
                "maxWidth": "md",
                "scroll": "body",
                "children": [],
            },
        )

        self.assert_is_json_serializable(
            self.cls(
                open=True,
                title="My Dialog",
                content="This is the content",
                maxWidth="md",
                scroll="body",
                children=[Button(id="button")],
            ),
            {
                "type": "Dialog",
                "open": True,
                "title": "My Dialog",
                "content": "This is the content",
                "maxWidth": "md",
                "scroll": "body",
                "children": [{"id": "button", "type": "Button"}],
            },
        )
