# -*- coding: utf-8 -*-
# Part of Creyox Technologies

from odoo import fields, models, _, api
from odoo.exceptions import ValidationError
import requests
import logging

_logger = logging.getLogger(__name__)


class PrintNodeConfig(models.Model):
    _name = "printnode.configuration"
    _description = "PrintNode Configuration"

    name = fields.Char()
    api_key = fields.Char(required=True)
    printer_line = fields.One2many("printer.printer", "printnode_config_id")

    @api.model
    def create(self, vals):
        """This method prevents user to create multiple records of PrintNode configuration."""
        config_ids = self.env["printnode.configuration"].search([])
        if len(config_ids) > 1:
            raise ValidationError(
                _("You can't create multiple records of PrintNode configuration!")
            )
        return super().create(vals)

    def action_test_connection(self):
        """This method check the connection with the PrintNode."""
        response = requests.get(
            url="https://api.printnode.com/whoami",
            auth=(self.api_key, ""),
        )
        if response.status_code == 200:
            return {
                "type": "ir.actions.client",
                "tag": "display_notification",
                "params": {
                    "type": "success",
                    "sticky": False,
                    "message": _("Connection Test Successful!"),
                },
            }
        else:
            raise ValidationError(
                _(
                    f"Connection Test Failed!\nError: \n{response.status_code}: {response.text}"
                )
            )

    def action_get_printers(self):
        """This method retrieves printers and their details."""
        response = requests.get(
            url="https://api.printnode.com/printers",
            auth=(self.api_key, ""),
            headers={"Content-Type": "application/json"},
        )

        # Handle the response
        if response.status_code == 200:
            printers = response.json()
            for line in self.printer_line:
                line.unlink()
            for printer in printers:
                printnode_printer_id = printer.get("id")
                printer_id = self.env["printer.printer"].search(
                    [("printnode_printer_id", "=", printnode_printer_id)], limit=1
                )
                vals = {
                    "name": printer.get("name") or "",
                    "computer": printer.get("computer").get("name") or "",
                    "printnode_printer_id": printnode_printer_id,
                    "active": True if printer.get("state") else False,
                    "printnode_config_id": self.id,
                }
                if printer_id:
                    printer_id.write(vals)
                else:
                    self.env["printer.printer"].create(vals)
            next_action = {"type": "ir.actions.client", "tag": "reload"}
            return {
                "type": "ir.actions.client",
                "tag": "display_notification",
                "params": {
                    "type": "success",
                    "sticky": False,
                    "message": _(f"{len(printers)} printers retrieved successfully!"),
                    "next": next_action,
                },
            }
        else:
            raise ValidationError(
                _(
                    f"Failed to retrieve printers.\nError: \n{response.status_code}: {response.text}"
                )
            )
