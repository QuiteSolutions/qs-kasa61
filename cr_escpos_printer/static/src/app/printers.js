/* @odoo-module */

import { BasePrinter } from "@point_of_sale/app/printer/base_printer";

export class CrPrintNodePrinter extends BasePrinter {
    setup({rpc, config}) {
        super.setup(...arguments);
        this.rpc = rpc;
        this.config = config;
    }

    async sendPrintingJob(img) {
        if (!this.config) {
            return false
        }
        let receipt = {
            'config': this.config,
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
