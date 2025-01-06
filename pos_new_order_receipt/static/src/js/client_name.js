/** @odoo-module **/
import { PosStore } from 'point_of_sale.PosStore';

PosStore.include({
    init: function () {
        this._super.apply(this, arguments);
        console.log("Custom POS Store initialized!");
    },
    // Override or extend methods as needed
});
