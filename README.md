
# netopia-client

A fully-typed, TypeScript-based client for the Netopia payments API V2, designed to provide a clean, fluent API with schema validation and excellent developer experience.

## Installation

To install this package, use npm:

```bash
npm install netopia-client
```

## Usage

### Initialize the Client

```typescript
import NetopiaClient from 'netopia-client';

const client = new NetopiaClient({
  apiKey: 'your-api-key',
  notifyUrl: 'https://example.com/notify',
  redirectUrl: 'https://example.com/return',
});
```

### Setting Payment, Browser, and Order Data

Set the required data before starting a payment:

```typescript
client
  .setPaymentData({
    account: '1234',
    expMonth: 12,
    expYear: 2024,
    secretCode: 'XYZ'
  })
  .setBrowserInfo({
    userAgent: 'Mozilla/5.0',
    colorDepth: 24,
    language: 'en-US',
    screenWidth: 1080,
    screenHeight: 1920,
    timeZone: 'GMT',
    mobile: true,
  })
  .setOrderData({
    amount: 150.0,
    currency: 'RON',
    orderID: 'ORDER_12345',
    billing: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '123456789',
    },
  });
```

### Starting a Payment

Once all data is set, initiate the payment:

```typescript
client.startPayment()
  .then((response) => console.log('Payment started successfully:', response))
  .catch((error) => console.error('Payment initiation failed:', error.message));
```

## Configuration

The client can be configured with either environment variables or directly via the constructor:

- `NETOPIA_API_KEY`: Your API key for Netopia.
- `NETOPIA_CONFIRM_URL`: The URL Netopia will call to confirm payments.
- `NETOPIA_RETURN_URL`: The URL to which users will be redirected after payment.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
