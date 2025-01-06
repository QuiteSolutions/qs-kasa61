# -*- coding: utf-8 -*-
##############################################################################
#
# Copyright 2019 EquickERP
#
##############################################################################
#
from . import models
from odoo.release import serie
from odoo.exceptions import ValidationError

def module_install_hook(cr):
    if serie != '18.0':
        raise ValidationError("This module support in odoo version 18.")
    return 1

# vim:expandtab:smartindent:tabstop=4:softtabstop=4:shiftwidth=4: