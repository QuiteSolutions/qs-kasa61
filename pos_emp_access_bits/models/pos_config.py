# -*- coding: utf-8 -*-

from odoo import models, fields, api
from odoo.osv.expression import AND


class PosConfig(models.Model):
    _inherit = 'pos.config'

    module_emp_acces_base = fields.Boolean('Manage Employee Based Access Rights', help='To manage access rights employee based')
    
    @api.onchange('module_pos_hr')
    def _onchange_module_pos_hr(self):
        self.module_emp_acces_base = self.module_pos_hr
