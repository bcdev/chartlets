#  Copyright (c) 2019-2026 by Brockmann Consult Development team
#  Permissions are hereby granted under the terms of the MIT License:
#  https://opensource.org/licenses/MIT.

import time

from chartlets import Component, Input, Output, State
from chartlets.components import (
    Box,
    Button,
    CircularProgress,
    CircularProgressWithLabel,
    LinearProgress,
    Typography,
)

from server.context import Context
from server.panel import Panel

panel = Panel(__name__, title="Panel J")


# noinspection PyUnusedLocal
@panel.layout()
def render_panel(ctx: Context) -> Component:
    button = Button(
        id="start_button",
        text="wait for 3 seconds",
        color="primary",
        variant="contained",
        style={"width": "fit-content"},
    )
    progress = CircularProgress(
        id="loading_progress",
        visible=False,
        size=32,
        style={"margin": "16px 0"},
    )
    result_text = Typography(
        id="result_text",
        text="",
        variant="body1",
    )

    return Box(
        style={
            "display": "flex",
            "flexDirection": "column",
            "alignItems": "flex-start",
            "gap": "8px",
            "padding": "16px",
        },
        children=[button, progress, result_text],
    )


# noinspection PyUnusedLocal
@panel.callback(
    Input("start_button", "clicked"),
    State("start_button", "text"),
    Output("loading_progress", "visible"),
    Output("result_text", "text"),
    Output("start_button", "text"),
    Output("start_button", "color"),
)
def run_calculation(
    ctx: Context, clicked: bool, button_text: str
) -> tuple[bool, str, str, str]:
    if button_text == "reset":
        return False, "", "wait for 3 seconds", "primary"

    time.sleep(3)
    return False, "Finished waiting after 3 seconds.", "reset", "inherit"
