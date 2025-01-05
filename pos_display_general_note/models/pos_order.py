from odoo import models, fields

class PosOrder(models.Model):
    _inherit = 'pos.order'

    general_note = fields.Text(string="General Note")