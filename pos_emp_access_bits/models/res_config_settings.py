# -*- coding: utf-8 -*-

from odoo import fields, models, api


class ResConfigSettings(models.TransientModel):
    _inherit = 'res.config.settings'

    # pos.config fields
    pos_module_emp_acces_base = fields.Boolean('Manage Employee Based Access Rights',related='pos_config_id.module_emp_acces_base', readonly=False,
        help='To manage access rights employee based.')
    
    
    @api.onchange('pos_module_pos_hr')
    def _onchange_pos_module_pos_hr(self):
        self.pos_module_emp_acces_base = self.pos_module_pos_hr
