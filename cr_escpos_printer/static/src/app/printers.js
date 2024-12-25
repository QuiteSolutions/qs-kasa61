/* @odoo-module */

import { BasePrinter } from "@point_of_sale/app/printer/base_printer";

export class CrPrintNodePrinter extends BasePrinter {
    setup({rpc, printer_id}) {
        super.setup(...arguments);
        this.rpc = rpc;
        this.printer_id = printer_id;
    }

    async sendPrintingJob(img) {
        if (!this.printer_id) {
            return false
        }
        let receipt = {
            'printer_id': this.printer_id,
            'img': img
        }        
        let result;
        await this.rpc(
            '/cr_escpos_receipt',{
            receipt
        }).then(function (res) {
            result = res;
        }).catch(function (err) {
            console.error(err);
            result = false;
        });

        return { result ,printerErrorCode: false};
    }
}
