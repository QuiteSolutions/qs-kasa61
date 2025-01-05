/** @odoo-module **/
import { registry } from '@web/core/registry';
import { TicketScreen } from '@point_of_sale/screens/ticket_screen/ticket_screen';

// export class TicketScreenWithGeneralNote extends TicketScreen {
//     getFilteredOrderList() {
//         const orders = super.getFilteredOrderList();
//         return orders.map(order => {
//             order.general_note = order.general_note || 'N/A';
//             return order;
//         });
//     }
// }

// registry.category('pos_screens').add('TicketScreen', TicketScreenWithGeneralNote, { replace: true });
odoo.define('pos_customizations.models', function(require) {
    'use strict';

    var {Order, OrderLine} = require('point_of_sale.models');
    const Registries = require('point_of_sale.Registries');

    const PosSaleOrder = (Order) => class PosSaleOrder extends Order {
        constructor() {
            super(...arguments);
            this.general_note = this.general_note || "NUN";
        }

        export_as_JSON() {
            const json = super.export_as_JSON(...arguments);
            json.general_note = this.general_note;
            return json;
        }

        init_from_JSON(json) {
            super.init_from_JSON(...arguments);
            this.general_note = json.general_note;
        }

        getFilteredOrderList() {
            const orders = super.getFilteredOrderList();
            return orders.map(order => {
                order.general_note = order.general_note || 'N/A';
                return order;
            });
        }
    };

    Registries.Model.extend(Order, PosSaleOrder);
});