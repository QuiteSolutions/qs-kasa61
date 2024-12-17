/** @odoo-module **/

import { patch } from "@web/core/utils/patch";
import { ProductScreen } from "@point_of_sale/app/screens/product_screen/product_screen";
import { usePos } from "@point_of_sale/app/store/pos_hook";

const { onWillStart, onMounted, useState } = owl;

patch(ProductScreen.prototype, {
  setup() {
    super.setup(...arguments);
    this.pos = usePos();
    this.state = useState({
      isPaymentAvailable: true,
      isPriceAvailable: true,
      isDiscountAvailable: true,
      isPlusMinusAvailable: true,
      isQtyAvailable: true,
      removableCategories:[]
    });

    onWillStart(async () => {
      let res = {'hide_payment':true,'hide_price':true,'hide_discount':true,'hide_plus_minus':true,'hide_qty':true,'pos_category_ids':[]};
      let fields = ["hide_payment", "hide_price", "hide_discount", "hide_plus_minus", "hide_qty","pos_category_ids"]
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
      this.state.isPaymentAvailable = Boolean(res.hide_payment);
      this.state.isPriceAvailable = Boolean(res.hide_price);
      this.state.isDiscountAvailable = Boolean(res.hide_discount);
      this.state.isPlusMinusAvailable = Boolean(res.hide_plus_minus);
      this.state.isQtyAvailable = Boolean(res.hide_qty);
      this.state.removableCategories = res.pos_category_ids;

      if (!this.state.isQtyAvailable) {
        if (this.state.isPriceAvailable) this.onNumpadClick("price");
        else if (this.state.isDiscountAvailable) {
          this.onNumpadClick("discount");
        }
      }
    });

    onMounted(() => {
      if(!this.state.isPaymentAvailable && this.ui.isSmall) {
        $(".switchpane.d-flex").find(".review-button").attr('style', 'width: 100% !important');
      }
    })
  },
  get productsToDisplay() { 
    const data = super.productsToDisplay;  
    const filteredData = data.filter((ele)=>ele.pos_categ_ids.some((cat)=>!this.state.removableCategories.includes(cat.id)))
    return filteredData;
  },
  getCategoriesAndSub() {  
    let res = super.getCategoriesAndSub();
    if (this.state.removableCategories.length) {
      let rcats =this.state.removableCategories
      res = res.filter((cat)=>!rcats.includes(cat.id));
    }
    return res 
  },
  getNumpadButtons() {
    let data = super.getNumpadButtons(); 
    return data.map((ele) => {
      if(ele.value == "discount") {
        ele.disabled = ele.disabled || !this.state.isDiscountAvailable;
      }
      if(ele.value == "quantity") {
        ele.disabled = ele.disabled || !this.state.isQtyAvailable;
      }
      if(ele.value == "price") {
        ele.disabled = ele.disabled || !this.state.isPriceAvailable;
      }
      if(ele.value == "-") {
        ele.disabled = ele.disabled || !this.state.isPlusMinusAvailable;
      }
      return ele;
    })
  },
});
