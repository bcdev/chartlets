from chartlets.extensioncontext import ExtensionContext
from chartlets.response import Response
from chartlets.util.assertions import assert_is_not_none


def get_contributions(ext_ctx: ExtensionContext | None) -> Response:
    """Generate the response for the endpoint `GET /chartlets/contributions`.

    Args:
        ext_ctx: Extension context. If `None`,
            the function returns a 404 error response.
    Returns:
        A `Response` object.
        On success, the response is a dictionary that represents
        a JSON-serialized component tree.
    """
    assert_is_not_none("ext_ctx", ext_ctx)
    extensions = ext_ctx.extensions
    contributions = ext_ctx.contributions
    return Response.success(
        {
            "extensions": [e.to_dict() for e in extensions],
            "contributions": {
                cpk: [c.to_dict() for c in cpv] for cpk, cpv in contributions.items()
            },
        }
    )
