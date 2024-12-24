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

    @http.route("/cr_escpos_receipt", type="json", auth="none", cors="*")
    def cr_print_receipt(self, receipt):
        printer_id = False
        raw_image = receipt["img"]
        config = receipt.get("config")
        pos_config_id = request.env["pos.config"].sudo().browse(config)
        if pos_config_id:
            printer_id = pos_config_id.printer_id.printnode_printer_id if pos_config_id.printer_id else False
        image = Image.open(BytesIO(base64.b64decode(raw_image)))
        printer = Dummy()
        printer.image(image)
        printer.cut()
        escpos_commands = printer.output
        escpos_base64 = base64.b64encode(escpos_commands).decode("ascii")

        # Create payload for PrintNode
        payload = {
            "printerId": printer_id,
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
