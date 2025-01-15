import { _t } from "@web/core/l10n/translation";
import { ControlButtons } from "@point_of_sale/app/screens/product_screen/control_buttons/control_buttons";
import { patch } from "@web/core/utils/patch";
import {
    makeAwaitable,
} from "@point_of_sale/app/store/make_awaitable_dialog";
import { SelectionPopup } from "@point_of_sale/app/utils/input_popups/selection_popup";

patch(ControlButtons.prototype, {
    get currentPrinterName(){
        const printer = this.pos.models['printer.printer'].find((printer) => printer.id === this.pos.hardwareProxy?.printer?.printer_id);
        debugger
        return printer ? printer.name : _t("No Printer");
    },
    async crSetPrinter(){
        const selectionList = this.pos.models['printer.printer'].map((printer) => ({
            id: printer.id,
            label: printer.name,
            isSelected: this.pos.hardwareProxy.printer && printer.id === this.pos.hardwareProxy.printer?.printer_id,
            item: printer,
        }));
        const payload = await makeAwaitable(this.dialog, SelectionPopup, {
            title: _t("Select Printer"),
            list: selectionList,
        });
        if (payload) {
            this.pos.crprinter = payload;
            this.pos.hardwareProxy.printer.setPrinterId(payload.id);
        }
    }
});
