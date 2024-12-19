/** @odoo-module **/

import { patch } from "@web/core/utils/patch";
import { PartnerList } from "@point_of_sale/app/screens/partner_list/partner_list";
import { PartnerLine } from "@point_of_sale/app/screens/partner_list/partner_line/partner_line";
const { onWillStart, onMounted, useState } = owl; 
patch(PartnerList.prototype, {
  setup() {
    super.setup(...arguments); 
    this.access = useState({
      isCreateAvailable: false,
      isEditAvailable: false,
      show_salesperson_customers: false,
    });
    onWillStart(async () => {
      let res = {'hide_create_customer':true,"hide_edit_customer":true,'show_salesperson_customers':true}
      if(this.pos.config.module_emp_acces_base){
        var employee_id = this.pos.cashier.id;  
        var new_res = await this.env.services.orm.call("pos.config","get_unified_valid_employees",
          [this.pos.config.id,employee_id,["hide_create_customer", "hide_edit_customer","show_salesperson_customers"]]
        );
        if(Object.keys(new_res).length){
          res = new_res
        }
      }else{
        var user_id = this.pos.user.id;
        var new_res = await this.env.services.orm.call("pos.config","get_unified_valid_user",
          [this.pos.config.id,user_id,["hide_create_customer", "hide_edit_customer","show_salesperson_customers"]]
        );
        if(Object.keys(new_res).length){
          res = new_res
        }
      }
      this.access.isCreateAvailable = Boolean(res.hide_create_customer);
      this.access.isEditAvailable = Boolean(res.hide_edit_customer); 
      this.access.show_salesperson_customers = Boolean(res.show_salesperson_customers);
    });
  },
});
patch(PartnerLine,{
  props: [
    ...PartnerLine.props,
    "Aaccessbits", 
],
});