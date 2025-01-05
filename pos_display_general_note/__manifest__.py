{
    'name': 'POS General Note Column',
    'version': '1.0',
    'summary': 'Add a General Note column to the POS orders list.',
    'category': 'Point of Sale',
    'author': 'Alexander Gotlib',
    'depends': ['point_of_sale'],
    'data': [],
    'assets': {
        'point_of_sale.assets': [
            'pos_display_general_note/static/src/js/pos_general_note.js',
            'pos_display_general_note/static/src/xml/pos_templates.xml',
        ],
    },
    'installable': True,
    'application': False,
    'license': 'LGPL-3'
}