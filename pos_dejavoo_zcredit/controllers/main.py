# Part of Odoo. See LICENSE file for full copyright and licensing details.
import hashlib
import hmac
import logging
import re

from odoo import http
from odoo.http import request

_logger = logging.getLogger(__name__)


class PosDejavooWebhook(http.Controller):
    @http.route('/pos_dejavoo/notification', methods=['POST'], type="http", auth="none", csrf=False)
    def notification(self):
        """ Process the notification sent by Dejavoo

        Notification format is always json
        """
        _logger.debug('POST message received on the Z-CREDIT end point')

        # Acknowledge Dejavoo message
        return http.Response('OK', status=200)
