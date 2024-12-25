/** @odoo-module */

import { PosStore } from "@point_of_sale/app/store/pos_store";
import { CrPrintNodePrinter } from "@cr_escpos_printer/app/printers";
import { patch } from "@web/core/utils/patch";
import { rpc } from "@web/core/network/rpc";

patch(PosStore.prototype, {
    create_printer(config) {
        if (config.printer_type === "cr_escpos_printer") {
            return new CrPrintNodePrinter({rpc: rpc, printer_id: config.cr_printer_id });
        } else {
            return super.create_printer(...arguments);
        }
    },
});
