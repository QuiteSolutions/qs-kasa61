/** @odoo-module */
import { _t } from "@web/core/l10n/translation";
import { PaymentInterface } from "@point_of_sale/app/payment/payment_interface";
import { AlertDialog } from "@web/core/confirmation_dialog/confirmation_dialog";
import { InputDialog } from "./InputDialog";

export class PaymentDejavoo extends PaymentInterface {
    async create_payment_intent() {
        const order = this.pos.get_order();
        console.log("order", order.id);
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

    async create_refund_intent() {
        const order = this.pos.get_order();
    
        // Prompt user for the transaction ID
        const result = await this._showMsgWithInput(
            "Please enter the Transaction ID for the refund:",
            "Enter Transaction ID"
        );
    
        if (!result || !result.confirmed) {
            console.warn("Transaction ID input was canceled.");
            return false;
        }
    
        const transactionId = result.value;
        console.log("User entered Transaction ID:", transactionId);
    
        const line = order.get_selected_paymentline();
        if (!line) {
            throw new Error("No payment line is selected.");
        }
    
        // Build refund intent
        const infos = {
            TransactionSum: line.amount * -1,
            TransactionIdToCancelOrRefund: transactionId,
            additional_info: {
                external_reference: `${this.pos.config.current_session_id.id}_${line.payment_method_id.id}_${order.uuid}`,
                print_on_terminal: true,
            },
        };
    
        // Call the refund API
        return await this.env.services.orm.silent.call(
            "pos.payment.method",
            "dj_payment_refund_create",
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
            try{
                line.set_payment_status("waitingCapture");

                const data = await this.create_refund_intent();
                if (data.HasError) {
                    this._showMsg(data.ReturnMessage, "error");
                    line.set_payment_status("rejected");
                    return false;
                }
                line.set_payment_status("done");
                this._showMsg(_t("Payment has been processed successfully"), "info");
                return true;
            }catch (error) {
                this._showMsg(_t("An error occurred while processing the payment: ") + error.message, "error");
                line.set_payment_status("error");
                return false;
            }
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


        
            // Extract all <w> tags which contain <l> and <r>
            const regex = /<l>(.*?)<\/l><r>(.*?)<\/r>/g;
            let match;
            let formattedString = '';
            
            formattedString += `${"TransactionID"}: ${data?.ReferenceNumber}\n`;
            while ((match = regex.exec(data?.ClientRecieptPP)) !== null) {
                const key = match[1]; // Extracted key
                const value = match[2]; // Extracted value
                formattedString += `${key}: ${value}\n`; // Format key-value pair
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

    _showMsgWithInput(msg, title) {
        // return new Promise((resolve) => {
            this.env.services.dialog.add(InputDialog, {
                title: "Z-Credit v1 " + title,
                body: msg,
                 // Pass the resolve function to the dialog
            });
        // });
    }
}

