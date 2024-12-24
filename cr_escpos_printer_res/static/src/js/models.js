odoo.define('cr_pos_network_printer_res.models', function (require) {
"use strict";

var { PosGlobalState } = require('point_of_sale.models');
const Registries = require('point_of_sale.Registries');
var CrEscPosPrinter = require('cr_escpos_printer.Printer');

require('pos_restaurant.models');

const CrEscPosResPosGlobalState = (PosGlobalState) => class CrEscPosResPosGlobalState extends PosGlobalState {
    create_printer(config) {
        if (config.printer_type === "cr_escpos_printer") {
            return new CrEscPosPrinter(config.cr_printer_id[0], this);
        } else {
            return super.create_printer(...arguments);
        }
    }
}
Registries.Model.extend(PosGlobalState, CrEscPosResPosGlobalState);
});
