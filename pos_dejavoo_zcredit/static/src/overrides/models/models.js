/** @odoo-module */
import { register_payment_method } from "@point_of_sale/app/store/pos_store";
import { PaymentDejavoo } from "../../app/payment_dejavoo";
import { registry } from "@web/core/registry";
import { InputDialog } from "../../app/InputDialog";

//!
register_payment_method("dejavoo", PaymentDejavoo);
registry.category("dialog_components").add("InputDialog", InputDialog);

