#  Copyright (c) 2019-2026 by Brockmann Consult Development team
#  Permissions are hereby granted under the terms of the MIT License:
#  https://opensource.org/licenses/MIT.

from typing import Any


class Response:
    def __init__(
        self,
        status: int = 200,
        data: dict[str, Any] | None = None,
        reason: str | None = None,
    ):
        self.status = status
        self.data = data
        self.reason = reason

    @property
    def ok(self) -> bool:
        return 200 <= self.status < 400

    @classmethod
    def success(cls, data: dict[str, Any] | list[Any]):
        return Response(status=200, data=data)

    @classmethod
    def failed(cls, status: int, reason: str):
        return Response(status=status, reason=reason)
