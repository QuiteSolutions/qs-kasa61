/** @odoo-module **/

import { patch } from "@web/core/utils/patch"; 
import { ControlButtons } from "@point_of_sale/app/screens/product_screen/control_buttons/control_buttons";
const { onMounted, onWillStart, useState } = owl;

patch(ControlButtons.prototype, {
    setup() {
    super.setup(...arguments);
    // old + new state props
    this.access = useState({
      isInternnalNoteavailable: false,
      isCustomerNoteavailable: false,
      isGeneralNoteavailable: false,
      isRefundAvailable: false,
      isFiscalAvailable: false,
      isPriceListAvailable: false,
      isQuotationAvailable: false,
      isSplitavailable: false,
      isBillvailable: false,
      isGuestavailable: false,
      isTranferAvailable: false,
    });
    onWillStart(async () => { 
      let res = {'hide_split_button':true,'hide_bill_button':true,'hide_guest_button':true,'hide_transfer_button':true};
      let fields = ['hide_split_button','hide_bill_button','hide_guest_button','hide_transfer_button'];

      if(this.pos.config.module_emp_acces_base){
        var employee_id = this.pos.cashier.id;
        res = await this.env.services.orm.call(
          "pos.config",
          "get_unified_valid_employees",
          [this.pos.config.id, employee_id, fields]
        ); 
      }else{   
        var user_id = this.pos.user.id;
        res = await this.env.services.orm.call(
          "pos.config",
          "get_unified_valid_user",
          [this.pos.config.id, user_id, fields]
        );
      }   
      this.access.isSplitavailable = Boolean(res.hide_split_button);
      this.access.isBillvailable = Boolean(res.hide_bill_button);
      this.access.isGuestavailable = Boolean(res.hide_guest_button);
      this.access.isTranferAvailable = Boolean(res.hide_transfer_button); 
    });
  },
});