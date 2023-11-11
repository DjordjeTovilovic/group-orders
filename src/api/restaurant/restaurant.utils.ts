export function generateGlovoHeaders() {
  const headers = {
    'Referer': 'https://glovoapp.com/',
    'Cache-Control': 'private, max-age=600',
    'User-Agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
    'Host': 'api.glovoapp.com',
    'Origin': 'https://glovoapp.com',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Site': 'same-site',
    'Connection': 'keep-alive',
    'Accept-Language': 'en-GB,en;q=0.9',
    'Accept': 'application/json',
    'Accept-Encoding': 'gzip, deflate, br',
    'Sec-Fetch-Mode': 'cors',
    'Glovo-Delivery-Location-Timestamp': '1697820288046',
    'Glovo-Delivery-Location-Longitude': '19.8415327',
    'Glovo-Location-City-Code': 'QND',
    'Glovo-Language-Code': 'en',
    'Glovo-Device-Id': '1459929793',
    'Glovo-App-Type': 'customer',
    'Glovo-App-Development-State': 'Production',
    'Glovo-Delivery-Location-Latitude': '45.2598367',
    'Glovo-API-Version': '14',
    'Glovo-Delivery-Location-Accuracy': '0',
    'Glovo-App-Platform': 'web',
    'Glovo-App-Version': '7',
  };

  return headers;
}
