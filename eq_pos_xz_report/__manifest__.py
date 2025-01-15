# -*- coding: utf-8 -*-
##############################################################################
#
# Copyright 2019 EquickERP
#
##############################################################################

{
    'name': "POS Reports (POS XZ Reports)",
    'category': 'Sales/Point Of Sale',
    'version': '18.0.1.0',
    'author': 'Equick ERP',
    'description': """
        This Module Allow users to print X and Z report.
        * User can see the Summary of sales, Top Selling product, Category wise sales.
        * X report will shows the data of open session, while Z report will shows the data of closed session.
    """,
    'summary': """X report | Z report | pos XZ report | pos sales summary report | pos sale summary report | point of sale report | point of sales report | point of sale summary""",
    'depends': ['point_of_sale'],
    'price': 14,
    'currency': 'EUR',
    'license': 'OPL-1',
    'website': "",
    'data': ['security/ir.model.access.csv',
             'report/report_view.xml',
             'report/x_report_template.xml',
             'report/z_report_template.xml',
             'views/xz_report_view.xml'
    ],
    'images': ['static/description/main_screenshot.png'],
    'installable': True,
    'auto_install': False,
    'application': False,
    'pre_init_hook': 'module_install_hook'
}

# vim:expandtab:smartindent:tabstop=4:softtabstop=4:shiftwidth=4: