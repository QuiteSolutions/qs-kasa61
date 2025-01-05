/** @odoo-module **/
import { registry } from '@web/core/registry';
import { TicketScreen } from '@point_of_sale/screens/ticket_screen/ticket_screen';

export class TicketScreenWithGeneralNote extends TicketScreen {
    getFilteredOrderList() {
        const orders = super.getFilteredOrderList();
        return orders.map(order => {
            order.general_note = order.general_note || 'N/A';
            return order;
        });
    }
}

registry.category('pos_screens').add('TicketScreen', TicketScreenWithGeneralNote, { replace: true });
