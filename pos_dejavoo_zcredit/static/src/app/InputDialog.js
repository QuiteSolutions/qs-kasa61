/** InputDialog.js */
import { Dialog } from "@web/core/dialog/dialog";
import { useState } from "@odoo/owl";
import { xml } from "@odoo/owl";

export class InputDialog extends Dialog {
    setup() {
        super.setup();
        this.state = useState({ inputValue: "" });
    }

    // Handle input change
    onInputChange(ev) {
        this.state.inputValue = ev.target.value;
    }

    // Confirm input and resolve the promise
    onConfirm() {
        this.props.resolve({ confirmed: true, value: this.state.inputValue });
        this.props.close();
    }

    // Cancel input and resolve the promise
    onCancel() {
        this.props.resolve({ confirmed: false });
        this.props.close();
    }
}

// Define the dialog's template with slots
InputDialog.template = xml`
    <Dialog>
        <div t-slot="body">
            <p><t t-esc="props.body"/></p>
            <input
                type="text"
                class="input"
                placeholder="Enter value"
                t-on-input="onInputChange"
            />
        </div>
        <div t-slot="footer">
            <button class="btn btn-primary" t-on-click="onConfirm">Confirm</button>
            <button class="btn btn-secondary" t-on-click="onCancel">Cancel</button>
        </div>
    </Dialog>
`;
