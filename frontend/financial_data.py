import requests
from datetime import datetime, timedelta

# Your Finnhub API key
api_key = 'cqn3kd9r01qmbpok4i9gcqn3kd9r01qmbpok4ia0'

# API endpoint for earnings calendar
url = 'https://finnhub.io/api/v1/calendar/earnings'

# Get the current date
current_date = datetime.now().date()

# Set a range of 3 days before and after the current date for the earnings calendar
start_date = current_date - timedelta(days=3)
end_date = current_date + timedelta(days=3)

# Parameters
params = {
    'from': start_date.strftime('%Y-%m-%d'),  # Start date for the earnings calendar
    'to': end_date.strftime('%Y-%m-%d'),      # End date for the earnings calendar
    'symbol': 'TSLA',                         # Symbol for which to get the earnings
    'token': api_key                          # Your API key
}

# Make the API request
response = requests.get(url, params=params)

# Check if the request was successful
if response.status_code == 200:
    data = response.json()
    
    # Extract EPS information
    earnings = data.get('earningsCalendar', [])
    for entry in earnings:
        if entry['symbol'] == 'TSLA':
            # Print out the EPS and other relevant information
            eps_actual = entry.get('epsActual')
            eps_estimate = entry.get('epsEstimate')
            report_date = entry.get('date')
            print(f"Date: {report_date}, EPS Actual: {eps_actual}, EPS Estimate: {eps_estimate}")
else:
    print(f"Error: Unable to fetch data. Status code: {response.status_code}")
