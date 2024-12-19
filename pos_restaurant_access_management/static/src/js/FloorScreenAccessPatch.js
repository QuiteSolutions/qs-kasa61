/** @odoo-module **/

import { patch } from "@web/core/utils/patch";
import { FloorScreen } from "@pos_restaurant/app/floor_screen/floor_screen";

const { onWillStart,onWillUpdateProps, useState } = owl; 

patch(FloorScreen.prototype, {
  setup() {
    super.setup(...arguments);
    this.access = useState({
      isCreateTableAvailable: false,
      rest_floor_ids:[]
    });
    onWillStart(async () => { 
      this.prepareAccess(); 
    });
    onWillUpdateProps(async () => {
      this.prepareAccess()
    });
  },
  onMounted() {
    super.onMounted(...arguments);
    if(!this.access.isCreateTableAvailable) {
        this.addFloorRef.el.style.display = "none";
    }
  },

  onPatched() {
    super.onPatched(...arguments); 
  },
  async prepareAccess(){
    let res = {'hide_create_floor_button': true,'hide_create_table_button': true,"pos_floor_ids": []};
    if (this.pos.config.module_emp_acces_base) {
        var employee_id = this.pos.cashier.id;
        let new_res = await this.env.services.orm.call("pos.config", "get_unified_valid_employees", [this.pos.config.id, employee_id, ["hide_create_floor_button", "pos_floor_ids","hide_create_table_button"]]);
        if(Object.keys(new_res).length){
          res =new_res
        }
    } else {
        var user_id = this.pos.user.id;
        let new_res = await this.env.services.orm.call("pos.config", "get_unified_valid_user", [this.pos.config.id, user_id, ["hide_create_floor_button", "pos_floor_ids","hide_create_table_button"]]);
        if(Object.keys(new_res).length){
          res = new_res
        }
    } 
    this.access.isCreateFloorAvailable = Boolean(res.hide_create_floor_button);
    this.access.isCreateTableAvailable = Boolean(res.hide_create_table_button);
    this.access.rest_floor_ids = res.pos_floor_ids; 
    // changes floor id if selected floor is restricted
    if(this.state.selectedFloorId && res.pos_floor_ids.includes(this.state.selectedFloorId)){
      this.state.selectedFloorId = this.pos.models['restaurant.floor'].getAll().filter((i)=>!res.pos_floor_ids.includes(i.id))[0]?.id
    } 
  }
});
