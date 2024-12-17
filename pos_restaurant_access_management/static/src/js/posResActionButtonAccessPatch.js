/** @odoo-module **/

import { patch } from "@web/core/utils/patch";
import { OrderlineNoteButton } from "@pos_restaurant/app/control_buttons/orderline_note_button/orderline_note_button";
import { PrintBillButton } from "@pos_restaurant/app/control_buttons/print_bill_button/print_bill_button";
import { SplitBillButton } from "@pos_restaurant/app/control_buttons/split_bill_button/split_bill_button"; 
import { TableGuestsButton } from "@pos_restaurant/app/control_buttons/table_guests_button/table_guests_button";
import { TransferOrderButton } from "@pos_restaurant/app/control_buttons/transfer_order_button/transfer_order_button";

const { onWillStart, useState } = owl;

patch(OrderlineNoteButton.prototype, {
  setup() {
    super.setup(...arguments);
    this.access = useState({
      isInternalNoteAvaliable: false,
    });
    onWillStart(async () => {
      let res = {'hide_internal_note_button':true};
      if(this.pos.config.module_emp_acces_base){
        var employee_id = this.pos.cashier.id; 
        var new_res = await this.env.services.orm.call("pos.config", "get_unified_valid_employees", [this.pos.config.id, employee_id, ["hide_internal_note_button"]]); 
        if(Object.keys(new_res).length){
          res = new_res
        }
      }else{   
        var user_id = this.pos.user.id;
        var new_res = await this.env.services.orm.call("pos.config","get_unified_valid_user",[this.pos.config.id, user_id, ["hide_internal_note_button"]]);
        if(Object.keys(new_res).length){
          res = new_res
        }
      }
      this.access.isInternalNoteAvaliable = Boolean(res.hide_internal_note_button);
    });
  },
});

patch(PrintBillButton.prototype, {
  setup() {
    super.setup(...arguments);
    this.access = useState({
      isBillAvailable: false,
    });
    onWillStart(async () => {
      let res = {'hide_bill_button':true};
      if(this.pos.config.module_emp_acces_base){
        var employee_id = this.pos.cashier.id; 
        var new_res = await this.env.services.orm.call("pos.config", "get_unified_valid_employees", [this.pos.config.id, employee_id, ["hide_bill_button"]]); 
        if(Object.keys(new_res).length){
          res = new_res
        }
      }else{   
        var user_id = this.pos.user.id;
        var new_res = await this.env.services.orm.call("pos.config","get_unified_valid_user",[this.pos.config.id, user_id, ["hide_bill_button"]]);
        if(Object.keys(new_res).length){
          res = new_res
        }
      }
      this.access.isBillAvailable = Boolean(res.hide_bill_button);
    });
  },
});

patch(SplitBillButton.prototype, {
  setup() {
    super.setup(...arguments);
    this.access = useState({
      isSplitAvailable: false,
    });
    onWillStart(async () => {
      let res = {'hide_split_button':true};
      if(this.pos.config.module_emp_acces_base){
        var employee_id = this.pos.cashier.id; 
        var new_res = await this.env.services.orm.call( "pos.config", "get_unified_valid_employees",[this.pos.config.id, employee_id, ["hide_split_button"]]); 
        if(Object.keys(new_res).length){
          res = new_res
        }
      }else{   
        var user_id = this.pos.user.id;
        var new_res = await this.env.services.orm.call("pos.config","get_unified_valid_user",[this.pos.config.id, user_id, ["hide_split_button"]]);
        if(Object.keys(new_res).length){
          res = new_res
        }
      }
      this.access.isSplitAvailable = Boolean(res.hide_split_button); 
    });
  },
}); 

patch(TableGuestsButton.prototype, {
  setup() {
    super.setup(...arguments);
    this.access = useState({
      isGuestAvailable: false,
    });
    onWillStart(async () => {
      let res = {"hide_guest_button":true};
      if(this.pos.config.module_emp_acces_base){
        var employee_id = this.pos.cashier.id; 
        var new_res = await this.env.services.orm.call(
          "pos.config",
          "get_unified_valid_employees",
          [this.pos.config.id, employee_id, ["hide_guest_button"]]
        ); 
        if(Object.keys(new_res).length){
          res = new_res
        }
      }else{   
        var user_id = this.pos.user.id;
        var new_res = await this.env.services.orm.call(
          "pos.config",
          "get_unified_valid_user",
          [this.pos.config.id, user_id, ["hide_guest_button"]]
        );
        if(Object.keys(new_res).length){
          res = new_res
        }
      }
      this.access.isGuestAvailable = Boolean(res.hide_guest_button);  
    });
  },
});

patch(TransferOrderButton.prototype, {
  setup() {
    super.setup(...arguments);
    this.access = useState({
      isTransferAvailable: false,
    });
    onWillStart(async () => {
      let res = {'hide_transfer_button':true};
      if(this.pos.config.module_emp_acces_base){
        var employee_id = this.pos.cashier.id; 
        var new_res = await this.env.services.orm.call("pos.config","get_unified_valid_employees",[this.pos.config.id, employee_id, ["hide_transfer_button"]]);
        if(Object.keys(new_res).length){
          res = new_res
        } 
      }else{   
        var user_id = this.pos.user.id;
        var new_res = await this.env.services.orm.call("pos.config","get_unified_valid_user",[this.pos.config.id, user_id, ["hide_transfer_button"]]);
        if(Object.keys(new_res).length){
          res = new_res
        }
      }
      this.access.isTransferAvailable = Boolean(res.hide_transfer_button);
    });
  },
});
