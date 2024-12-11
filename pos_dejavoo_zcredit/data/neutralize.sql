UPDATE pos_payment_method
   SET dj_terminal_number = 'dummy_value',
       dj_terminal_pwd = 'dummy_value',
       dj_terminal_pinpad = 'dummy_value'
   WHERE dj_terminal_number IS NOT NULL;
