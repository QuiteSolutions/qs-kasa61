odoo.define('pos_display_general_note.OrderExtension', function (require) {
  'use strict';

  const { Order } = require('point_of_sale.models');
  const models = require('point_of_sale.models');
  console.log('POS General Note JS Loaded');
  // Extend the order model to include the general_note field
  models.Order = models.Order.extend({
    export_as_JSON() {
        const json = this._super();
        console.log('Exporting General Note:', this.general_note);
        json.general_note = this.general_note;
        return json;
    },
});
  // models.Order = models.Order.extend({
  //     initialize(attributes, options) {
  //         this.general_note = this.general_note || '';
  //         return this._super(attributes, options);
  //     },
  //     export_as_JSON() {
  //         const json = this._super();
  //         json.general_note = this.general_note;
  //         return json;
  //     },
  //     init_from_JSON(json) {
  //         this._super(json);
  //         this.general_note = json.general_note;
  //     },
  // });
});