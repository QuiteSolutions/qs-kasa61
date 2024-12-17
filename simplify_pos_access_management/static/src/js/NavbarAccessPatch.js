/** @odoo-module **/

import { patch } from "@web/core/utils/patch";
import { Navbar } from "@point_of_sale/app/navbar/navbar";

const { useState ,onWillRender} = owl;

patch(Navbar.prototype, {
  setup() {
    super.setup(...arguments);
    this.access = useState({
      isCashInAvailable: false,
      isCloseAvailable: false,
      isDebugAvailable: false,
      isBackendAvailable: false,
      isCreateProductAvailable: false,
    });
    onWillRender(async () => {
      let res = {'hide_cash_in':true,'hide_close':true,'hide_debug_window':true,'hide_backend_pos':true,'hide_create_product_menu':true};
      let fields = ["hide_cash_in", "hide_close", "hide_debug_window","hide_backend_pos","hide_create_product_menu"]; 
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
      this.access.isCashInAvailable = Boolean(res.hide_cash_in);
      this.access.isCloseAvailable = Boolean(res.hide_close);
      this.access.isDebugAvailable = Boolean(res.hide_debug_window);
      this.access.isBackendAvailable = Boolean(res.hide_backend_pos);
      this.access.isCreateProductAvailable = Boolean(res.hide_create_product_menu);
    }); 
  }, 
  get showCashMoveButton() {
    const res = super.showCashMoveButton;
    return res && this.access.isCashInAvailable;
  },
  get showCreateProductButton() {
    const res = super.showCreateProductButton;
    return res && this.access.isCreateProductAvailable;
  },
  get showToggleProductView(){
    const res = super.showToggleProductView;
    return res && this.access.isCreateProductAvailable;
  }
});
