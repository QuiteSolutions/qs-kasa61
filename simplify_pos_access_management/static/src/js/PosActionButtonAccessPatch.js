/** @odoo-module **/

import { patch } from "@web/core/utils/patch"; 
import { ControlButtons } from "@point_of_sale/app/screens/product_screen/control_buttons/control_buttons";
const { onMounted, useState } = owl;

patch(ControlButtons.prototype, {
    setup() {
    super.setup(...arguments);
    this.access = useState({
      isInternnalNoteavailable: false,
      isCustomerNoteavailable: false,
      isGeneralNoteavailable: false,
      isRefundAvailable: false,
      isFiscalAvailable: false,
      isPriceListAvailable: false,
      isQuotationAvailable: false,
    });
    onMounted(async () => {
      let res = {'hide_internal_note_button':true,'hide_customer_note_button':true,'hide_general_note_button':true,'hide_refund_button':true,'hide_quotation_button':true,
        'hide_fiscal_button':true, 'hide_price_list_button':true};
      let fields = ['hide_customer_note_button','hide_refund_button','hide_quotation_button','hide_general_note_button','hide_internal_note_button',
      'hide_fiscal_button','hide_price_list_button']
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
      this.access.isInternnalNoteavailable = Boolean(res.hide_internal_note_button);
      this.access.isCustomerNoteavailable = Boolean(res.hide_customer_note_button);
      this.access.isGeneralNoteavailable = Boolean(res.hide_general_note_button);
      this.access.isRefundAvailable = Boolean(res.hide_refund_button);
      this.access.isFiscalAvailable = Boolean(res.hide_fiscal_button);
      this.access.isPriceListAvailable = Boolean(res.hide_price_list_button);
      this.access.isQuotationAvailable = Boolean(res.hide_quotation_button);
    });
  },
}); 