/** @odoo-module **/

import { patch } from "@web/core/utils/patch";
import { ProductScreen } from "@point_of_sale/app/screens/product_screen/product_screen";
import { usePos } from "@point_of_sale/app/store/pos_hook";

const { onWillStart, useState } = owl;

patch(ProductScreen.prototype, {
  setup() {
    super.setup(...arguments);
    this.pos = usePos();
    this.access = useState({
      isReleaseAvailable: false,
    });

    onWillStart(async () => {
      let res = {'hide_release_table_button':true};
      if(this.pos.config.module_emp_acces_base){
        var employee_id = this.pos.cashier.id; 
        res = await this.env.services.orm.call(
          "pos.config",
          "get_unified_valid_employees",
          [this.pos.config.id, employee_id, ["hide_release_table_button"]]
        ); 
      }else{   
        var user_id = this.pos.user.id;
        res = await this.env.services.orm.call(
          "pos.config",
          "get_unified_valid_user",
          [this.pos.config.id, user_id, ["hide_release_table_button"]]
        );
      }
      this.access.isReleaseAvailable = Boolean(res.hide_release_table_button);
    });
  },

  showReleaseBtn() {
    const data = super.showReleaseBtn(...arguments);
    return data && this.access.isReleaseAvailable;
  },
});
