/** @odoo-module **/
import { Component } from "@odoo/owl";
import { registry } from "@web/core/registry";
import { TicketScreen } from "@point_of_sale/app/screens/ticket_screen/ticket_screen";
import { usePos } from "@point_of_sale/app/store/pos_hook";
import { useService } from "@web/core/utils/hooks";
import { useState } from "@odoo/owl";

class CustomALLOrdrScreen extends Component {
    static template = "pos_all_orders.CustomALLOrdrScreen";
    setup() {
        super.setup();
        this.pos = usePos();
        this.orm = useService("orm");
        this.state = useState({
            order: this.props.orders
        });
    }
    back() {
     // on clicking the back button it will redirected Product screen
        this.pos.showScreen('ProductScreen');
    }
    getTable(order) {
        if (order.table_id) {
            const tableMatch = order.table_id.match(/\((\d+),/);
            if (tableMatch) {
                return parseInt(tableMatch[1], 10); 
            }
        }
        return ''; 
    }
    getAmount(order) {
        if (order.amount_total) {
            return parseFloat(order.amount_total).toFixed(2); 
        }
        return ''; 
    }
}
registry.category("pos_screens").add("CustomALLOrdrScreen", CustomALLOrdrScreen);
