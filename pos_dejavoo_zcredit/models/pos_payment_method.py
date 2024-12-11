import logging

from odoo import fields, models, _
from odoo.exceptions import AccessError, UserError

from .dejavoo_pos_request import DejavoPosRequest

_logger = logging.getLogger(__name__)

class PosPaymentMethod(models.Model):
    _inherit = 'pos.payment.method'

    dj_terminal_number = fields.Char(
        string="Dejavoo terminal Number",
        help='Enter here Dejavoo terminal number',
      )
    
    dj_terminal_pwd = fields.Char(
        string="Dejavoo terminal password",
        help='Conntact Z-Credit support to receive your terminal password.',
       )
    
    dj_terminal_pinpad = fields.Char(
        string="PinPad Id",
        help="Enter pinpad number of your terminal",
        )
 
    def _get_payment_terminal_selection(self):
        return super()._get_payment_terminal_selection() + [('dejavoo', 'Dejavoo')]
    def _check_special_access(self):
        if not self.env.user.has_group('point_of_sale.group_pos_user'):
            raise AccessError(_("Do not have access to fetch from Dejavoo"))

    def dj_payment_intent_create(self, infos):
        """
        Called from Dejavoo hardware for creating a payment intent
        """
        self._check_special_access()

        dejavoo_terminal_number = self.sudo().dj_terminal_number
        dejavoo_terminal_pwd = self.sudo().dj_terminal_pwd
        dejavoo_terminal_pinpad = self.sudo().dj_terminal_pinpad

        dejavoo = DejavoPosRequest(dejavoo_terminal_number, dejavoo_terminal_pwd, dejavoo_terminal_pinpad)
        # Triger Dejavoo terminal for payment intend creation
        resp = dejavoo.call_dejavoo(f"CommitFullTransaction", infos)
        _logger.debug("dj_payment_intent_create(), response from Dejavoo: %s", resp)
        return resp


