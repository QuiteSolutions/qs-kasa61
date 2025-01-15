import { Dialog } from "@web/core/dialog/dialog";
import { useState } from "@odoo/owl";
import { xml } from "@odoo/owl"; // Import the xml function

export class InputDialog extends Dialog {
    setup() {
        super.setup();
        this.state = useState({ inputValue: "" });
    }

    // Handle input changes
    onInputChange(event) {
        this.state.inputValue = event.target.value;
    }

    // Confirm action and return the input value
    onConfirm() {
        this.props.resolve({ confirmed: true, value: this.state.inputValue });
        this.props.close();
    }

    // Cancel action
    onCancel() {
        this.props.resolve({ confirmed: false });
        this.props.close();
    }
}
InputDialog.template = xml`
    <div>
        <div class="dialog-body">
            <p><t t-esc="props.body"/></p>
            <input
                type="text"
                class="input"
                placeholder="Enter value"
                t-on-input="onInputChange"
            />
        </div>
        <div class="dialog-footer">
            <button class="btn btn-primary" t-on-click="onConfirm">Confirm</button>
            <button class="btn btn-secondary" t-on-click="onCancel">Cancel</button>
        </div>
    </div>
`;
