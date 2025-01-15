// Part of Odoo. See LICENSE file for full copyright and licensing details.
import { PosOrderline } from "@point_of_sale/app/models/pos_order_line";
import { usePos } from "@point_of_sale/app/store/pos_hook";
import { getOrderChanges } from "@point_of_sale/app/models/utils/order_change";

import { _t } from "@web/core/l10n/translation";
import { patch } from "@web/core/utils/patch";

patch(PosOrderline.prototype, {
    // Check if cashiers remove the quantity of a product
    set_quantity(quantity, keep_price) {
        const isCashier = (window?.posmodel?.get_cashier()?._role || this.order_id?.user?.raw?.role) !== "manager";
        const quant =typeof quantity === "number" ? quantity : parseFloat("" + (quantity ? quantity : 0));
        if (isCashier) {
            const last_changes = this.order_id.last_order_preparation_change
            const lineKey = `${this.uuid} - ${this.getNote()}`;
            if(last_changes.lines[lineKey]){
                const lineChange = last_changes.lines[lineKey];
                if (lineChange.quantity > quant) {
                    return {
                        title: _t("Quantity error"),
                        body: _t("You cannot remove the quantity of a product, please contact a manager."),
                    };
                }
            }

        }

        return super.set_quantity(quantity, keep_price);
    },

});
