# -*- coding: utf-8 -*-

{
    'name': 'POS Kitchen Order Manager Validation',
    'version': '18.0.1.0.2',
    'category': 'product',
    'sequence': 6,
    'summary': 'POS Kitchen Order Manager Validation for remove order from kitchen screen',
    'description': """POS Kitchen Order Manager Validation for remove order from kitchen screen.""",
    'depends': ['pos_restaurant'],
    "data": [
        
    ],
    'assets': {
        'point_of_sale._assets_pos': [
            'cr_kitchen_order_validation/static/src/app/**/*',
            'cr_kitchen_order_validation/static/src/overrides/**/*',
        ],
    },
    'installable': True,
    'auto_install': False,
    'license': 'LGPL-3',
    'application': True,

}


