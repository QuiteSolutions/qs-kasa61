/** @odoo-module */

import { PosStore } from "@point_of_sale/app/store/pos_store";
import { CrPrintNodePrinter } from "@cr_escpos_printer/app/printers";
import { patch } from "@web/core/utils/patch";
import { rpc } from "@web/core/network/rpc";

patch(PosStore.prototype, {
    afterProcessServerData() {
        var self = this;
        return super.afterProcessServerData(...arguments).then(function () {
            if (self.config.other_devices && self.config.id) {
                self.crprinter = self.config.printer_id
                self.hardwareProxy.printer = new CrPrintNodePrinter({rpc: rpc, printer_id: self.config.printer_id.id});
            }
        });
    },

    cashMove() {
        const res = super.cashMove(...arguments);
        this.hardwareProxy.printer.is_open_cashbox_receipt_print = true;
        return res;
    },
});
