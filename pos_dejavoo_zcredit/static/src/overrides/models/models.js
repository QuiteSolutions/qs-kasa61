/** @odoo-module */
import { register_payment_method } from "@point_of_sale/app/store/pos_store";
import { PaymentDejavoo } from "../../app/payment_dejavoo";
//!
register_payment_method("dejavoo", PaymentDejavoo);
