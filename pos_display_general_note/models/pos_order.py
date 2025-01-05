from odoo import models, fields

class PosOrder(models.Model):
    _inherit = 'pos.order'

    general_note = fields.Text(string='General Note')


class PosSession(models.Model):
    _inherit = 'pos.session'

    def _pos_ui_pos_order(self):
        result = super()._pos_ui_pos_order()
        result.append('pos.order')
        print("result", result)
        return result

    def _loader_params_pos_order(self):
        return {
            'search_params': {
            'fields': ['order_ref'],
            },
        }

    def _get_pos_ui_pos_order(self, params):
        return self.env['pos.order'].search_read(**params['search_params'])

