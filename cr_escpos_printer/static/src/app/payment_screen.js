/** @odoo-module */

import { PaymentScreen } from "@point_of_sale/app/screens/payment_screen/payment_screen";
import { patch } from "@web/core/utils/patch";

patch(PaymentScreen.prototype, {

    openCashbox() {
        this.hardwareProxy.printer.is_manual_open_cashbox = true;
        this.hardwareProxy.openCashbox();
    },

    async _finalizeValidation() {
        const res = await super._finalizeValidation(...arguments);
        if (this.currentOrder.is_paid_with_cash() || this.currentOrder.get_change()) {
            this.hardwareProxy.printer.is_open_cashbox_receipt_print = true;
        }
        return res;
    },
});

