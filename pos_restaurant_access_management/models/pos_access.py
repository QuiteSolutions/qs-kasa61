from odoo import models, fields,api

class pos_access(models.Model):
    _inherit = 'pos.access'
    
    hide_split_button = fields.Boolean("Hide split button", help='Select this option to hide split from product screen')
    hide_bill_button = fields.Boolean("Hide bill button", help='Select this option to hide bill from product screen')  
    hide_guest_button = fields.Boolean("Hide guest button", help='Select this option to hide guest from product screen')
    hide_transfer_button = fields.Boolean("Hide transfer button", help='Select this option to hide transfer from product screen')
    # hide_release_table_button = fields.Boolean("Hide release table button", help='Select this option to hide release table from product screen')
    
    hide_create_floor_button = fields.Boolean("Hide create floor button", help='Select this option to hide create floor from product screen')
    hide_order_button = fields.Boolean("Hide order button", help='Select this option to hide order from product screen')
    pos_floor_ids = fields.Many2many('restaurant.floor', 'pos_access_floor_rel', 'pos_access_id', 'pos_floor_id', string="Restrict pos floors", help='Select the floors you want to restrict from selected users')
    hide_create_table_button = fields.Boolean("Hide create table button", help='Select this option to hide create table from product screen')
 
    hide_edit_plan_menu = fields.Boolean("Hide edit plan menu", help='Select this option to hide edit plan menu.')