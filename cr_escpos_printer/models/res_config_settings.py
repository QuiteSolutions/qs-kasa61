# -*- coding: utf-8 -*-
# Part of Creyox Technologies

from odoo import fields, models, api


class ResConfigSettings(models.TransientModel):
    _inherit = "res.config.settings"

    printer_id = fields.Many2one(
        related="pos_config_id.printer_id", store=True, readonly=False
    )
