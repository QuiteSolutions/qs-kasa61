# Part of Odoo. See LICENSE file for full copyright and licensing details.
from odoo import models


class PaymentRefundWizard(models.TransientModel):
    _inherit = 'payment.refund.wizard'

    def _loader_params_pos_payment_method(self):
        result = super()._loader_params_pos_payment_method()
        result['search_params']['fields'].append('dj_terminal_number')
        return result
