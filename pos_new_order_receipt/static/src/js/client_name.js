odoo.define('pos_new_order_receipt', function (require) {

  'use strict';

  var {Order} = require
  var Registries = require('point_of_sale.Registries');

  const CustomOrder = (Order) => class CustomOrder extends Order {
    
    export_for_printing() {
      const res = super.export_for_printing(...arguments);
      res.client_name = this.get_partner();
      return res;
    }
  }

  Registries.Model.extend(Order, CustomOrder);
});