{
    "name": "pos_new_order_receipt",
    "version": "23.01",
    "category": "customization",
    "summary": "Wounded Souls General Customization",
    "author": "Odooistic",
    "depends": ['product'],
    "data": [],
    'assets': {
        'point_of_sale.assets': [
            'pos_new_order_receipt/static/src/js/**/*',
            'pos_new_order_receipt/static/src/xml/**/*',
        ],
    },
    "installable": True,
}