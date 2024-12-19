from odoo import models, fields,api

class pos_category(models.Model):
    _inherit = 'pos.category'

    @api.model
    def get_all_child_nodes(self, categ_id, arr):
        category = self.browse(categ_id)
        for categ in category.child_id:
            arr.append(categ.id)
            self.get_all_child_nodes(categ.id, arr)