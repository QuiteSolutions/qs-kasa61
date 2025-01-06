# -*- coding: utf-8 -*-
# Part of Creyox Technologies

from odoo import fields, models, api


class Printer(models.Model):
    _name = "printer.printer"
    _description = "Printers"

    name = fields.Char()
    computer = fields.Char()
    printnode_printer_id = fields.Char()
    active = fields.Boolean(default=True)
    printnode_config_id = fields.Many2one("printnode.configuration", ondelete="cascade")

    @api.model
    def _load_pos_data_fields(self, config_id):
        return ['id', 'name', 'active', 'printnode_printer_id']

    @api.model
    def _load_pos_data_domain(self, data):
        return []

    def _load_pos_data(self, data):
        domain = self._load_pos_data_domain(data)
        fields = self._load_pos_data_fields(data)
        return {
            'data': self.search_read(domain, fields, load=False),
            'fields': fields,
        }
