# -*- coding: utf-8 -*-
# Part of Creyox Technologies

from odoo import http, _
from odoo.exceptions import ValidationError
from escpos.printer import Dummy
from odoo.http import request
from PIL import Image
from io import BytesIO
import base64
import logging
import requests

_logger = logging.getLogger(__name__)


class CrEscPosPrinterController(http.Controller):

    def get_api_key(self):
        api_key = ""
        printnode_config_id = (
            request.env["printnode.configuration"].sudo().search([], limit=1)
        )
        if printnode_config_id:
            api_key = printnode_config_id.api_key
        return api_key

    @http.route("/open_cashbox", type="json", auth="none", cors="*")
    def open_cashbox(self,printer_id, **params):
        printer_id_obj = ''
        if printer_id:
            printer_id_obj = request.env["printer.printer"].sudo().browse(printer_id)
        printer = Dummy()
        if printer:
            cashbox_command = b'\x1B\x70\x00\x19\xFA'
            printer._raw(cashbox_command)
            escpos_commands = printer.output
            escpos_base64 = base64.b64encode(escpos_commands).decode("ascii")

            # Create payload for PrintNode
            payload = {
                "printerId": printer_id_obj.printnode_printer_id if printer_id else False,
                "contentType": "raw_base64",
                "content": escpos_base64,
                "title": "Thermal Print Job",
            }

            try:
                # Send request to PrintNode API
                response = requests.post(
                    url="https://api.printnode.com/printjobs",
                    json=payload,
                    auth=(self.get_api_key(), ""),
                    headers={"Content-Type": "application/json"},
                )

                # Handle the response
                if response.status_code == 201:
                    _logger.info("Cash box opened successfully!")
                else:
                    raise ValidationError(
                        _(
                            f"Failed to create print job to open cash drawer. Error: {response.status_code} - {response.text}"
                        )
                    )
            except Exception as error:
                raise ValidationError(_(f"Error: {error}"))

    @http.route("/cr_escpos_receipt", type="json", auth="none", cors="*")
    def cr_print_receipt(self, receipt):
        printnode_printer_id = False
        raw_image = receipt["img"]
        printer_id = int(receipt.get("printer_id")) or False
        open_cashdrawer = receipt.get("open_cashdrawer", False)
        if printer_id:
            printnode_printer_id = request.env["printer.printer"].sudo().browse(printer_id).printnode_printer_id if printer_id else False
        image = Image.open(BytesIO(base64.b64decode(raw_image)))
        printer = Dummy()
        if open_cashdrawer:
            cashbox_command = b'\x1B\x70\x00\x19\xFA'
            printer._raw(cashbox_command)
        printer.image(image)
        printer.cut()
        escpos_commands = printer.output
        escpos_base64 = base64.b64encode(escpos_commands).decode("ascii")

        # Create payload for PrintNode
        payload = {
            "printerId": printnode_printer_id,
            "contentType": "raw_base64",
            "content": escpos_base64,
            "title": "Thermal Print Job",
        }

        try:
            # Send request to PrintNode API
            response = requests.post(
                url="https://api.printnode.com/printjobs",
                json=payload,
                auth=(self.get_api_key(), ""),
                headers={"Content-Type": "application/json"},
            )

            # Handle the response
            if response.status_code == 201:
                _logger.info("Print job created successfully!")
            else:
                raise ValidationError(
                    _(
                        f"Failed to create print job. Error: {response.status_code} - {response.text}"
                    )
                )
        except Exception as error:
            raise ValidationError(_(f"Error: {error}"))
