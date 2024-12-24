# -*- coding: utf-8 -*-
# Part of Creyox Technologies

from odoo import models


class PosSession(models.Model):
    _inherit = 'pos.session'

    def _loader_params_restaurant_printer(self):
        result = super()._loader_params_restaurant_printer()
        result['search_params']['fields'].extend(['cr_printer_id'])
        return result
