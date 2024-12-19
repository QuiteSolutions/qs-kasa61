/** @odoo-module **/

import { patch } from "@web/core/utils/patch";
import { Numpad } from "@point_of_sale/app/generic_components/numpad/numpad";
import { usePos } from "@point_of_sale/app/store/pos_hook"; 
const { onWillStart, useState } = owl;

patch(Numpad.prototype, {
  setup() {
    super.setup(...arguments);
    this.pos = usePos();
    this.access_state = useState({
      isNumpadAvailable: true, 
    });

    onWillStart(async () => {
      let res = {'hide_numpad': true}
      if(this.pos.config.module_emp_acces_base){
        var employee_id = this.pos.cashier.id;
        var new_res = await this.env.services.orm.call("pos.config","get_unified_valid_employees",
          [this.pos.config.id, employee_id, ["hide_numpad"]]);
        if(Object.keys(new_res).length){
          res = new_res
        }
      }else{
        var user_id = this.pos.user.id;
        var new_res = await this.env.services.orm.call("pos.config","get_unified_valid_user",
          [this.pos.config.id, user_id, ["hide_numpad"]]);
        if(Object.keys(new_res).length){
          res = new_res
        }
      } 
      this.access_state.isNumpadAvailable = Boolean(res.hide_numpad);  
    });
  },
});
