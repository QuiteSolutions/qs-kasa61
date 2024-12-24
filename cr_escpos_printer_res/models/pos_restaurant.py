# -*- coding: utf-8 -*-
# Part of Creyox Technologies

from odoo import fields, models


class RestaurantPrinter(models.Model):
    _inherit = 'restaurant.printer'

    printer_type = fields.Selection(selection_add=[('cr_escpos_printer', 'Use custom ESC/POS printer')])
    cr_printer_id = fields.Many2one("printer.printer")
