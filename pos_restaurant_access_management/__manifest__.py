{
    "name": "POS restaurant Access Management",
    "version": "18.0.1.0.0",
    "sequence": 5,
    "author": "Terabits Technolab",
    "license": "OPL-1",
    'category': 'Services',
    "website": "https://www.terabits.xyz/apps/18.0/pos_restaurant_access_management",
    "summary": """All In One POS Access Management App for setting the correct access rights for various pos features like related to order, product, customer, payment etc.
        All in one pos access management App. 
        """,
    "description": """
        All In One POS Access Management App for setting the correct access rights for various pos features like related to order, product, customer, payment etc.
        All in one pos access management App.
    """,
    "depends": ["pos_restaurant", "simplify_pos_access_management"],
    "data": [
        "views/point_of_sale_access_view.xml",
    ],
    "assets": {
        "point_of_sale._assets_pos": [ 
            "pos_restaurant_access_management/static/src/js/ActionPadWidgetAccessPatch.js",
            "pos_restaurant_access_management/static/src/xml/ActionPadWidgetAccessPatch.xml",
            "pos_restaurant_access_management/static/src/js/posControlButtons.js",
            "pos_restaurant_access_management/static/src/xml/posControlButtons.xml",
            "pos_restaurant_access_management/static/src/js/FloorScreenAccessPatch.js",
            'pos_restaurant_access_management/static/src/xml/FloorScreen.xml',
            'pos_restaurant_access_management/static/src/js/Navbar.js',
            'pos_restaurant_access_management/static/src/xml/Navbar.xml'
        ]
    },
    "price": "20",
    "currency": "USD",
    "installable": True,
    "application": True,
    "images": ["static/description/banner.gif"],
    "live_test_url": "https://www.terabits.xyz/request_demo?source=index&version=18&app=simplify_pos_access_management",
}
