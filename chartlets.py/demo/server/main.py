#  Copyright (c) 2019-2026 by Brockmann Consult Development team
#  Permissions are hereby granted under the terms of the MIT License:
#  https://opensource.org/licenses/MIT.

import asyncio

from server.app import run_app


def main():
    asyncio.run(run_app())


if __name__ == "__main__":
    main()
