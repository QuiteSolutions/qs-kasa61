/** @odoo-module **/

import { patch } from "@web/core/utils/patch";
import { ActionpadWidget } from "@point_of_sale/app/screens/product_screen/action_pad/action_pad"; 
const { onWillStart, onMounted, useState } = owl; 
patch(ActionpadWidget.prototype, {
  setup() {
    super.setup(...arguments); 
    this.state = useState({
      isPaymentAvailable: true,
      isCustomerAvailable: true,
    });
    onWillStart(async () => {
      let res = {'hide_payment':true}; 
      if(this.pos.config.module_emp_acces_base){
        var employee_id = this.pos.cashier.id;
        var new_res = await this.env.services.orm.call("pos.config","get_unified_valid_employees",
          [this.pos.config.id, employee_id, ["hide_payment",]]);
        if(Object.keys(new_res).length){
          res = new_res;
        }
      }else{
        var user_id = this.pos.user.id;
        var new_res = await this.env.services.orm.call("pos.config","get_unified_valid_user",[this.pos.config.id, user_id, ["hide_payment"]]);
        if(Object.keys(new_res).length){
          res = new_res
        }
      } 
       
      this.state.isPaymentAvailable = Boolean(res.hide_payment);
    }); 
  },
});
