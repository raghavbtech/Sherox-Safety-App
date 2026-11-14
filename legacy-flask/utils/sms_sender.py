import requests
import os

# You can optionally store your key as an environment variable and load like:
# FAST2SMS_API_KEY = os.getenv("FAST2SMS_API_KEY")

FAST2SMS_API_KEY = "ptdfMRlNvDbPf1tZM1Q9F9nYd1eLjEPmZZVyR3GQspJ4Uv12DVnGmzL5e7s0"  # Replace this with your valid key

def send_sms(to_numbers, message):
    """
    Sends an SMS via Fast2SMS API to one or more phone numbers.

    Args:
        to_numbers (str): Comma-separated phone numbers (e.g., "9999999999,8888888888").
        message (str): Message to send.

    Returns:
        dict: Response JSON from Fast2SMS API.
    """
    url = "https://www.fast2sms.com/dev/bulkV2"
    payload = {
        "route": "q",
        "message": message,
        "language": "english",
        "flash": 0,
        "numbers": to_numbers,
    }
    headers = {
        "authorization": FAST2SMS_API_KEY,
        "Content-Type": "application/x-www-form-urlencoded"
    }

    try:
        response = requests.post(url, data=payload, headers=headers)
        return response.json()
    except Exception as e:
        return {"error": str(e)}
