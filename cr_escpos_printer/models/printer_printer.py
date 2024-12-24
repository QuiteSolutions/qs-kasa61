# -*- coding: utf-8 -*-
# Part of Creyox Technologies

from odoo import fields, models


class Printer(models.Model):
    _name = "printer.printer"
    _description = "Printers"

    name = fields.Char()
    computer = fields.Char()
    printnode_printer_id = fields.Char()
    active = fields.Boolean(default=True)
    printnode_config_id = fields.Many2one("printnode.configuration")
