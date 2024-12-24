# -*- coding: utf-8 -*-
# Part of Creyox Technologies
{
    "name": "Direct Print PoS Restaurant Order and Payment Receipt from Self-hosted Server & odoo.sh | Direct Print PoS Restaurant Receipt | PoS Direct Print | Odoo Direct Print",
    "author": "Creyox Technologies",
    "website": "https://www.creyox.com",
    "support": "support@creyox.com",
    "category": "Point of Sale",
    "summary": """
            This app is designed to streamline the printing process of PoS order receipts directly
            from Odoo, whether hosted on any server or on Odoo.sh, using the PrintNode API. The
            primary purpose of the app is to enable businesses to automate printing tasks and
            enhance the efficiency of PoS order fulfillment by directly sending print commands to
            thermal printers or any compatible printer.
            Network Printer,
            Network Printer in Odoo,
            Direct Print PoS Order Receipt from Self-hosted Server or odoo.sh,
            Direct Print PoS Order Receipt using PrintNode,
            Direct Print PoS Order Receipt using PrintNode in Odoo,
            Direct Print PoS Order Receipt,
            Direct Print PoS Order Receipt in Odoo,
            Direct Print PoS Receipt,
            Direct Print PoS Receipt in Odoo,
            Direct Print in Odoo,
            Direct Print,
            Direct Print PoS Receipt from Server,
            Direct Print PoS Receipt from Server in Odoo,
            Direct Print PoS Receipt from odoo.sh,
            PoS Direct Print,
            PoS Direct Print in Odoo,
            Odoo Direct Print,
            Odoo Direct Print in Odoo,
            Direct Print PoS Restaurant Receipt,
            Direct Print PoS Restaurant Receipt in Odoo,
            Direct Print PoS Restaurant Order Receipt,
            Direct Print PoS Restaurant Order and Payment Receipt,
            Direct Print PoS Restaurant Order and Payment Receipt in Odoo,
        """,
    "license": "LGPL-3",
    "version": "18.0.0.0",
    "description": """This app allows user to direct print PoS restaurant order and payment receipt from self-hosted server or odoo.sh""",
    "depends": ["cr_escpos_printer", "pos_restaurant"],
    "data": [
        "views/pos_restaurant_views.xml",
    ],
    "installable": True,
    "auto_install": False,
    "application": True,
    "external_dependencies": {
        "python": ["python-escpos"],
    },
    'assets': {
        'point_of_sale.assets': [
            "cr_escpos_printer_res/static/src/**/*",
        ],
    },
    "images": [
        "static/description/banner.png",
    ],
    "price": 35,
    "currency": "USD",
}
