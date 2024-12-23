from odoo import models,fields

class PosAccess(models.Model):
    _inherit = 'pos.access'

    employee_ids = fields.Many2many('hr.employee', 'pos_access_hr_employee_rel', 'pos_access_id', 'employee_id')