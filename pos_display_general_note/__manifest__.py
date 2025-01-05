{
    'name': 'POS General Note Column',
    'version': '1.0',
    'summary': 'Add a General Note column to the POS orders list.',
    'category': 'Point of Sale',
    'author': 'Alexander Gotlib',
    'sequence': 6,
    'depends': ['point_of_sale'],
    'data': [
    #   'static/src/xml/pos_templates.xml',
    ],
    'assets': {
        'point_of_sale.assets': [
            'pos_display_general_note/static/src/js/pos_general_note.js',
        ],
    },
    'installable': True,
    'license': 'LGPL-3'
}