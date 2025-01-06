{
    "name": "pos_new_order_receipt",
    "version": "23.01",
    "category": "customization",
    "summary": "Wounded Souls General Customization",
    "author": "Odooistic",
    "depends": ['product'],
    "data": [
        'views/pos_customizations.xml',
    ],
    'assets': {
        'point_of_sale.assets': [
            'pos_new_order_receipt/static/src/js/client_name.js',
        ],
    },
    "installable": True,
}