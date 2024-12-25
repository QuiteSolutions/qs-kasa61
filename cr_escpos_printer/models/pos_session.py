# -*- coding: utf-8 -*-
# Part of Creyox Technologies

from odoo import fields, models, api


class PosSession(models.Model):
    _inherit = "pos.session"

    @api.model
    def _load_pos_data_models(self, config_id):
        data = super()._load_pos_data_models(config_id)
        data += ['printer.printer']
        return data
