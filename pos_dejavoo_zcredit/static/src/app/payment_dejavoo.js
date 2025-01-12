/** @odoo-module */
import { _t } from "@web/core/l10n/translation";
import { PaymentInterface } from "@point_of_sale/app/payment/payment_interface";
import { AlertDialog } from "@web/core/confirmation_dialog/confirmation_dialog";

export class PaymentDejavoo extends PaymentInterface {
    async create_payment_intent() {
        const order = this.pos.get_order();
        const line = order.get_selected_paymentline();
        // Build informations for creating a payment intend on Dejavoo.
        const infos = {
            TransactionSum: line.amount,
            additional_info: {
                external_reference: `${this.pos.config.current_session_id.id}_${line.payment_method_id.id}_${order.uuid}`,
                print_on_terminal: true,
            },
        };
        // dj_payment_intent_create will call the Z-Credit api gateway to interact with Dejavoo terminal
        return await this.env.services.orm.silent.call(
            "pos.payment.method",
            "dj_payment_intent_create",
            [[line.payment_method_id.id], infos]
        );
    }

    setup() {
        super.setup(...arguments);
        this.webhook_resolver = null;
        this.payment_intent = {};
    }

    async send_payment_request(cid) {
        await super.send_payment_request(...arguments);
        const line = this.pos.get_order().get_selected_paymentline();


        if (line.amount < 0) {
            this._show_error(_t("Cannot process transactions with negative amount."));
            return Promise.resolve();
        }

        try {
            // During payment creation, user can't cancel the payment intent
            line.set_payment_status("waitingCapture");
            // Call Dejavoo to create a payment intent
            const data = await this.create_payment_intent();
            if (data.HasError) {
                this._showMsg(data.ReturnMessage, "error");
                line.set_payment_status("rejected");
                return false;
            }

            const regex = /<l>(.*?)<\/l><r>(.*?)<\/r>/g;
            let match;
            let formattedString = '';

            while ((match = regex.exec(data?.ClientRecieptPP)) !== null) {
                const key = match[1];
                const value = match[2]; 
                formattedString += `${key}: ${value}\n`; 
            }
            
            this.payment_intent = data;
            line.payment_method_issuer_bank = data?.CardBIN;
            line.card_brand = data?.CardName;
            line.card_no = data?.Card4Digits
            line.transaction_id = data?.ReferenceNumber;
            line.set_receipt_info(formattedString.trim())
            line.set_payment_status("done");
            this._showMsg(_t("Payment has been processed successfully"), "info");
            return true;
        } catch (error) {
            this._showMsg(_t("An error occurred while processing the payment: ") + error.message, "error");
            line.set_payment_status("error");
            return false;
        }
    }

    parseClientRecieptPP(receiptString) {
        // Create a DOM parser
        const parser = new DOMParser();
        const doc = parser.parseFromString(receiptString, 'text/xml');
    
        // Extract all <w> tags which contain <l> and <r>
        const keyValuePairs = {};
        const entries = doc.getElementsByTagName('w');
    
        for (let entry of entries) {
            const key = entry.getElementsByTagName('l')[0]?.textContent?.trim();
            const value = entry.getElementsByTagName('r')[0]?.textContent?.trim();
            if (key && value) {
                keyValuePairs[key] = value;
            }
        }
    
        return keyValuePairs;
    }

    async send_payment_cancel(order, cid) {
        await super.send_payment_cancel(order, cid);
        if (!this.payment_intent.HasError) {
            return true;
        }
        const canceling_status = await this.cancel_payment_intent();
        if ("error" in canceling_status) {
            const message =
                canceling_status.status === 409
                    ? _t("Payment has to be canceled on terminal")
                    : _t("Payment not found (canceled/finished on terminal)");
            this._showMsg(message, "info");
            return canceling_status.status !== 409;
        }
        return true;
    }

    // private methods
    _showMsg(msg, title) {
        this.env.services.dialog.add(AlertDialog, {
            title: "Z-Credit v1 " + title,
            body: msg,
        });
    }
}

