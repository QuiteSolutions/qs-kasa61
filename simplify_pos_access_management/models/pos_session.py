from odoo import fields, models, api

class pos_session(models.Model):
    _inherit="pos.session"

    def _loader_params_res_partner(self):
        vals = super()._loader_params_res_partner()
        vals['search_params']['fields'] += ['user_id']
        return vals
    