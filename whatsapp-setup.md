# WhatsApp Business API Setup Guide

## 1. Prerequisites
- Business Account on Meta Business Manager
- Verified Business
- SSL Certificate for webhook endpoint
- n8n instance with public URL

## 2. WhatsApp Business API Setup Steps

### 2.1. Meta Business Manager Setup
1. Go to [Meta Business Manager](https://business.facebook.com/)
2. Create a new Business App or use existing one
3. Add WhatsApp product to your app
4. Complete business verification

### 2.2. Get API Credentials
1. Navigate to WhatsApp > API Setup
2. Note down:
   - Phone Number ID
   - WhatsApp Business Account ID
   - Access Token
   - Webhook Verify Token (create your own)

### 2.3. Webhook Configuration
```
Webhook URL Format:
https://your-n8n-instance.com/webhook/whatsapp-trigger

Required Events to Subscribe:
- messages
- message_status
- messaging_product_changes
```

## 3. n8n Webhook Configuration

### 3.1. WhatsApp Trigger Node Setup
```json
{
  "authentication": "webhook",
  "webhookEndpoint": "/webhook/whatsapp-trigger",
  "httpMethod": "POST",
  "responseMode": "onReceived",
  "responseCode": 200,
  "responseData": "success"
}
```

### 3.2. Message Processing
The WhatsApp node processes these message types:
- text
- image
- document
- location
- contacts
- interactive buttons
- list messages

### 3.3. Rate Limits
- 80 messages per second
- Maximum message size: 64KB
- Media file size limits:
  - Images: 5MB
  - Documents: 100MB
  - Audio: 16MB
  - Video: 16MB

## 4. Security Best Practices

### 4.1. Webhook Verification
```javascript
// Verification request handling
if (req.method === 'GET') {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === process.env.WEBHOOK_VERIFY_TOKEN) {
        return challenge;
    }
    throw new Error('Webhook verification failed');
}
```

### 4.2. Message Encryption
- All messages are encrypted end-to-end
- Store message hashes instead of content
- Implement message expiry

## 5. Error Handling

### 5.1. Common Error Codes
- 400: Invalid request
- 401: Authentication error
- 429: Rate limit exceeded
- 500: Internal server error

### 5.2. Retry Strategy
```json
{
  "maxRetries": 3,
  "retryDelay": 1000,
  "exponentialBackoff": true,
  "errorCodes": [429, 500, 503]
}
```
