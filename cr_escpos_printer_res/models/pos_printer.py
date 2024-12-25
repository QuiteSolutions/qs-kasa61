# -*- coding: utf-8 -*-
# Part of Creyox Technologies

from odoo import fields, models, _, api


class PosPrinter(models.Model):
    _inherit = 'pos.printer'

    printer_type = fields.Selection(selection_add=[('cr_escpos_printer', 'Use custom ESC/POS printer')])
    cr_printer_id = fields.Many2one("printer.printer")

    @api.constrains('cr_network_printer_ip')
    def _constrains_cr_network_printer_ip(self):
        for record in self:
            if record.printer_type == 'cr_network_printer' and not record.cr_printer_id:
                raise ValidationError(_("Custom Printer cannot be empty."))

    @api.model
    def _load_pos_data_fields(self, config_id):
        params = super()._load_pos_data_fields(config_id)
        params += ['cr_printer_id']
        return params
