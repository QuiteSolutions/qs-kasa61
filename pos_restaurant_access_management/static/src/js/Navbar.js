/** @odoo-module **/

import { patch } from "@web/core/utils/patch";
import { Navbar } from "@point_of_sale/app/navbar/navbar";

const { useState ,onWillRender} = owl;

patch(Navbar.prototype, {
  setup() {
    super.setup(...arguments);
    this.navbar_access = useState({
      isEditPlanAvailable: false,
    });
    onWillRender(async () => {
      let res = {'hide_edit_plan_menu':true,};
      let fields = ["hide_edit_plan_menu"]; 
      if(this.pos.config.module_emp_acces_base){
        var employee_id = this.pos.cashier.id;
        var new_res = await this.env.services.orm.call("pos.config","get_unified_valid_employees",
          [this.pos.config.id, employee_id, fields]);
        if(Object.keys(new_res).length){
          res = new_res
        }
      }else{
        var user_id = this.pos.user.id;
        var new_res = await this.env.services.orm.call("pos.config","get_unified_valid_user",
          [this.pos.config.id, user_id, fields]);
        if(Object.keys(new_res).length){
          res = new_res
        }
      } 
      this.navbar_access.isEditPlanAvailable = Boolean(res.hide_edit_plan_menu); 
    }); 
  }
});
