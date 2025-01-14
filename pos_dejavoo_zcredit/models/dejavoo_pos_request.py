import logging
import requests

_logger = logging.getLogger(__name__)


REQUEST_TIMEOUT = 60
ZCREDIT_API_ENDPOINT = 'https://pci.zcredit.co.il/ZCreditWS/api/Transaction/'


class DejavoPosRequest:
    def __init__(self, dj_terminal_number,dj_terminal_pwd,dj_terminal_pinpad):
        self.dejavoo_terminal_number = dj_terminal_number
        self.dejavoo_terminal_pwd = dj_terminal_pwd
        self.dejavoo_terminal_pinpad = dj_terminal_pinpad

    def call_dejavoo(self, endpoint, payload,is_refund=False):

        """ Make a request to Z-Credit API Gateway to interact with dejavoo terminal.
        :param endpoint: The endpoint to be reached by the request.
        :param payload: The payload of the request.
        :return The JSON-formatted content of the response.
        """
        
        payload["TerminalNumber"] = self.dejavoo_terminal_number
        payload["Password"] = self.dejavoo_terminal_pwd
        if not is_refund:
            payload["Track2"] = self.dejavoo_terminal_pinpad
        


        endpoint = ZCREDIT_API_ENDPOINT + endpoint
        header = {
            'Content-Type':'application/json'
        }
        try:
            response = requests.request('post', endpoint, headers=header, json=payload, timeout=REQUEST_TIMEOUT)
            return response.json()
        except requests.exceptions.RequestException as error:
            _logger.warning("Cannot connect with Dejavoo POS. Error: %s", error)
            return {'errorMessage': str(error)}
        except ValueError as error:
            _logger.warning("Cannot decode response json. Error: %s", error)
            return {'errorMessage': f"Cannot decode Dejavoo POS response. Error: {error}"}
