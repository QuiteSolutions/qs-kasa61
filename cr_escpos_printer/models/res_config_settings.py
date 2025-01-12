# -*- coding: utf-8 -*-
# Part of Creyox Technologies

from odoo import fields, models, api


class ResConfigSettings(models.TransientModel):
    _inherit = "res.config.settings"

    printer_id = fields.Many2one(
        related="pos_config_id.printer_id", store=True, readonly=False
    )

    @api.depends('pos_iface_print_via_proxy', 'pos_config_id')
    def _compute_pos_iface_cashdrawer(self):
        res = super()._compute_pos_iface_cashdrawer()
        print('res11', res, self)
        for config in self:
            if config.pos_config_id.iface_cashdrawer:
                config.pos_iface_cashdrawer = True
        return res
