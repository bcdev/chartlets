#  Copyright (c) 2019-2026 by Brockmann Consult Development team
#  Permissions are hereby granted under the terms of the MIT License:
#  https://opensource.org/licenses/MIT.

import logging
import unittest

from chartlets.util.logger import LOGGER


class LoggerTest(unittest.TestCase):

    def test_logger(self):
        self.assertIsInstance(LOGGER, logging.Logger)
        self.assertEqual("chartlets", LOGGER.name)
