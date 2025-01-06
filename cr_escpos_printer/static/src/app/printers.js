/* @odoo-module */

import { BasePrinter } from "@point_of_sale/app/printer/base_printer";

export class CrPrintNodePrinter extends BasePrinter {
    setup({rpc, printer_id}) {
        super.setup(...arguments);
        this.rpc = rpc;
        this.printer_id = printer_id;
        this.setPrinterId(printer_id);
    }

    /**
     * @override
     */
    openCashbox () {
        if (this.is_manual_open_cashbox && this.printer_id) {
            this.is_manual_open_cashbox = false;
            return this.rpc('/open_cashbox',{'printer_id':this.printer_id})
        }
        else if (this.printer_id){
            console.log("Open Cashbox")
        }
        else {
            return super.openCashbox(...arguments)
        }
    }
    setPrinterId(printer_id) {
        this.printer_id = printer_id;
    }
    async sendPrintingJob(img) {
        if (!this.printer_id) {
            return false
        }
        var open_cashdrawer = false;
        open_cashdrawer = this.is_open_cashbox_receipt_print;
        if (open_cashdrawer) {
            this.is_open_cashbox_receipt_print = false;
        }
        let receipt = {
            'printer_id': this.printer_id,
            'img': img,
            'open_cashdrawer': open_cashdrawer,
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
