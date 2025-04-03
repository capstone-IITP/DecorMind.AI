# Razorpay API Integration

इस API route का उपयोग Razorpay के साथ ऑर्डर क्रिएट करने के लिए किया जाता है।

## सेटअप

1. `.env.local` फाइल में निम्नलिखित environment variables जोड़ें:

```
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

## उपयोग

API को POST request के साथ कॉल करें:

```javascript
const response = await fetch('/api/razorpay', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    amount: 500, // रुपये में राशि (500 INR)
  }),
});

const data = await response.json();
// data में Razorpay order details होंगे जिन्हें आप Razorpay checkout के लिए उपयोग कर सकते हैं
```

## रिस्पांस

सफल रिस्पांस में Razorpay order details शामिल होंगे:

```json
{
  "id": "order_JkVtugqGOJlLwX",
  "entity": "order",
  "amount": 50000,
  "amount_paid": 0,
  "amount_due": 50000,
  "currency": "INR",
  "receipt": "order_rcptid_11",
  "status": "created",
  "attempts": 0,
  "created_at": 1623927802
}
```