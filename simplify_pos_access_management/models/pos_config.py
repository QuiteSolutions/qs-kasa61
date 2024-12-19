from odoo import models, fields,api

class pos_config(models.Model):
    _inherit = 'pos.config'

    pos_access_ids = fields.Many2many('pos.access', 'pos_access_config_rel', 'pos_config_id', 'pos_access_id', string='POS Access')
 
    @api.model
    def get_unified_valid_user(self, config_id, user_id, fields):
        return_data = {}
        res = self.browse(config_id).pos_access_ids.mapped("id")
        if not len(res):
            return return_data
        for field in fields:
            if res and len(res) < 0:
                return_data[field] = True
                continue
            if field not in ['pos_floor_ids','pos_payment_method_ids','pos_category_ids']:
                users_in_domain = self.browse(config_id).pos_access_ids.search([(field, '!=', False), ('is_multiemployee_pos','=',False),('active', '=', True), ('pos_config_ids', 'in', [config_id])]).mapped('user.id')
                return_data[field] = user_id not in users_in_domain
            else:
                vals_array = self.pos_access_ids.search([('id', 'in', res), ('active', '=', True),('is_multiemployee_pos','=',False), ('user', 'in', [user_id])]).mapped(field+'.id')
                return_data[field] = vals_array
        return return_data

    @api.model
    def get_unified_valid_employees(self, config_id, employee_id, fields):
        return_data = {}
        res = self.browse(config_id).pos_access_ids.mapped("id")
        if not len(res):
            return return_data
        for field in fields:
            if res and len(res) < 0:
                return_data[field] = True
                continue
            if field not in ['pos_payment_method_ids','pos_category_ids','pos_floor_ids']:
                employee_in_domain = self.browse(config_id).pos_access_ids.search([(field, '=', True),('is_multiemployee_pos','=',True),('active', '=', True), ('pos_config_ids', 'in', [config_id])]).mapped('employee_ids.id')
                return_data[field] = employee_id not in employee_in_domain
            else:
                vals_array = self.pos_access_ids.search([('id', 'in', res), ('active', '=', True),('is_multiemployee_pos','=',True), ('employee_ids', 'in', [employee_id])]).mapped(field+'.id')
                return_data[field] = vals_array
        return return_data
    
    # product category
    def get_matched_category(self, config_id, user_id):
        res = self.browse(config_id).pos_access_ids.mapped("id") 
        if res and len(res) < 0:
            return []
        arr = self.pos_access_ids.search([('id', 'in', res), ('active', '=', True),('is_multiemployee_pos','=',False), ('pos_config_ids', 'in', [config_id]), ('user', '=', user_id)]).mapped('pos_category_ids.id')
        for i in arr:
            self.env['pos.category'].get_all_child_nodes(i, arr)
        return arr
    
    def get_emp_matched_category(self, config_id, employee_id):
        res = self.browse(config_id).pos_access_ids.mapped("id")
        if res and len(res) < 0:
            return []
        arr = self.pos_access_ids.search([('id', 'in', res), ('active', '=', True),('is_multiemployee_pos','=',True), ('pos_config_ids', 'in', [config_id]), ('employee_ids', 'in', [employee_id])]).mapped('pos_category_ids.id')
        for i in arr:
            self.env['pos.category'].get_all_child_nodes(i, arr)
        return arr 
