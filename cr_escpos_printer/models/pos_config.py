# -*- coding: utf-8 -*-
# Part of Creyox Technologies

from odoo import fields, models, api


class PosConfig(models.Model):
    _inherit = "pos.config"

    printer_id = fields.Many2one("printer.printer", store=True)
