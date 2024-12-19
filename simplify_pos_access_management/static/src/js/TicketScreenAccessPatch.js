/** @odoo-module **/

import { patch } from "@web/core/utils/patch";
import { TicketScreen } from "@point_of_sale/app/screens/ticket_screen/ticket_screen";
const { onWillStart, useState } = owl;

patch(TicketScreen.prototype, {
  setup() {
    super.setup();
    this.access = useState({
      isDeleteAvailable: true,
      isFilterShown: true,
      isNewAvailable: true,
      show_salesperson_orders:true,
    });
    onWillStart(async () => {
      let res = {'hide_delete_order':true,'only_show_active_order':true,'show_salesperson_orders':true}
      let fields = ["hide_delete_order","only_show_active_order","show_salesperson_orders"]
      if(this.pos.config.module_emp_acces_base){
        var employee_id = this.pos.cashier.id;
        var new_res = await this.env.services.orm.call("pos.config","get_unified_valid_employees",
          [this.pos.config.id,employee_id,fields]
        );
        if(Object.keys(new_res).length){
          res = new_res
        }
      }else{
        var user_id = this.pos.user.id;
        var new_res = await this.env.services.orm.call("pos.config","get_unified_valid_user",
          [this.pos.config.id,user_id,fields]
        );
        if(Object.keys(new_res).length){
          res = new_res
        }
      }
      this.access.isDeleteAvailable = Boolean(res.hide_delete_order);
      this.access.isFilterShown = Boolean(res.only_show_active_order);
      this.access.show_salesperson_orders = Boolean(res.show_salesperson_orders);
    });
  },

  shouldHideDeleteButton(order) { 
    const res = super.shouldHideDeleteButton(...arguments);
    return !this.access.isDeleteAvailable || res;
  },

  getSearchBarConfig() {
    const res = super.getSearchBarConfig(...arguments);
    res.filter.show = this.access.isFilterShown;
    return res;
  },
  check_order_access(order){ 
    if(this.pos.config.module_emp_acces_base){
      return order.employee_id?.id == this.pos.cashier?.id;
    }else{
      return order.user_id == this.pos.user.id;
    }
  }
});
