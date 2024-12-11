{
    'name': 'POS Dejavoo',
    'version': '1.0',
    'category': 'Sales/Point of Sale',
    'sequence': 6,
    'summary': 'Integrate your POS with an Dejavoo payment terminal',
    'author':'Alexander Gotlib aka Spax',
    'data': [
        'views/pos_payment_method_views.xml',
    ],
    'depends': ['point_of_sale'],
    'installable': True,
    'assets': {
        'point_of_sale._assets_pos': [
            'pos_dejavoo_zcredit/static/**/*',
        ],
    },
    'license': 'LGPL-3',
}
