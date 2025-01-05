{
    'name': 'POS General Note Column',
    'version': '1.0',
    'summary': 'Add a General Note column to the POS orders list.',
    'category': 'Point of Sale',
    'author': 'Alexander Gotlib',
    'sequence': 6,
    'depends': ['point_of_sale'],
    'data': [],
    'assets': {
        'point_of_sale._assets_pos': [
            'pos_display_general_note/static/static/**/*',
        ],
    },
    'installable': True,
    'license': 'LGPL-3'
}