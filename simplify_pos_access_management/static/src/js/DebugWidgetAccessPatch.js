/** @odoo-module **/

import { patch } from "@web/core/utils/patch";
import { DebugWidget } from "@point_of_sale/app/debug/debug_widget";
const { onWillStart, useState } = owl;

patch(DebugWidget.prototype, {
  setup() {
    super.setup(...arguments);
    this.access = useState({ debugWidgetIsShown: false });
    onWillStart(async () => {
      let res = {'hide_debug_window':true}
      if(this.pos.config.module_emp_acces_base){
        var employee_id = this.pos.cashier.id; 
        var new_res = await this.env.services.orm.call("pos.config","get_unified_valid_employees",
          [this.pos.config.id, employee_id, ["hide_debug_window"]]);
        if(Object.keys(new_res).length){
          res = new_res
        }
      }else{
        var user_id = this.pos.user.id;
        var new_res = await this.env.services.orm.call("pos.config","get_unified_valid_user",
          [this.pos.config.id, user_id, ["hide_debug_window"]]);
        if(Object.keys(new_res).length){
          res = new_res
        }
      } 
      this.access.debugWidgetIsShown = Boolean(res.hide_debug_window);
      this.state.isShown = this.access.debugWidgetIsShown && this.state.isShown;
    });
  },
});
