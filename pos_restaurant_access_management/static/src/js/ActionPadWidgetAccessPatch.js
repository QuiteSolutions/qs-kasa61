/** @odoo-module **/

import { patch } from "@web/core/utils/patch";
import { ActionpadWidget } from "@point_of_sale/app/screens/product_screen/action_pad/action_pad";

const { onWillStart, onWillUpdateProps, onMounted, useState } = owl;

patch(ActionpadWidget.prototype, {
  setup() {
    super.setup(...arguments);
    this.access = useState({
      isOrderAvailable: false,
      isPaymentAvailable: false,
    });
    onWillStart(async () => { 
      this.prepareAccess(); 
    });
    onWillUpdateProps(async () => {
      this.prepareAccess()
    });  
  },
  async prepareAccess(){
    let res = {'hide_order_button':true,'hide_payment':true};
    if(this.pos.config.module_emp_acces_base){
      var employee_id = this.pos.cashier.id; 
      let new_res = await this.env.services.orm.call(
        "pos.config",
        "get_unified_valid_employees",
        [this.pos.config.id, employee_id, ["hide_order_button","hide_payment"]]
      ); 
      if(Object.keys(new_res).length){
        res = new_res
      }
    }else{   
      var user_id = this.pos.user.id;
      let new_res = await this.env.services.orm.call(
        "pos.config",
        "get_unified_valid_user",
        [this.pos.config.id, user_id, ["hide_order_button","hide_payment"]]
      );
      if(Object.keys(new_res).length){
        res = new_res
      }
    }
    this.access.isOrderAvailable = Boolean(res.hide_order_button); 
    this.access.isPaymentAvailable = Boolean(res.hide_payment);
  }
});
