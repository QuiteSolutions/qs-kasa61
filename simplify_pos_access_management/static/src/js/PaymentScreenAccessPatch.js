/** @odoo-module **/

import { patch } from "@web/core/utils/patch";
import { PaymentScreen } from "@point_of_sale/app/screens/payment_screen/payment_screen";

const { onWillStart, useState } = owl;

patch(PaymentScreen.prototype, {
  setup() {
    super.setup();
    this.access = useState({
      isInvoiceAvailable: true,
      isTipAvailable: true,
      isShipLaterAvailable: true,
      isCustomerAvailable: true,
      isValidateAvailable: true,
      restPaymentMethods:[]
    });
    onWillStart(async () => {
      let res = {'hide_payment_invoice_button':true,'hide_payment_ship_later_button':true,'hide_payment_customer_button':true,'hide_open_cashbox_btn':true,
        'hide_payment_validate_button':true,'hide_payment_tip_button':true,'pos_payment_method_ids':[]}
      let fields = ["hide_payment_invoice_button","hide_payment_ship_later_button","hide_payment_customer_button","hide_payment_validate_button","hide_payment_tip_button",
        "pos_payment_method_ids","hide_open_cashbox_btn"]
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
      this.access.isInvoiceAvailable = Boolean(res.hide_payment_invoice_button);
      this.access.isShipLaterAvailable = Boolean(res.hide_payment_ship_later_button);
      this.access.isCustomerAvailable = Boolean(res.hide_payment_customer_button);
      this.access.isValidateAvailable = Boolean(res.hide_payment_validate_button);
      this.access.isTipAvailable = Boolean(res.hide_payment_tip_button);
      this.access.isCashboxAvailable = Boolean(res.hide_open_cashbox_btn);
      this.access.restPaymentMethods = res.pos_payment_method_ids;

    });
  },
});
