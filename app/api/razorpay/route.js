import Razorpay from "razorpay";

export async function POST(req) {
  if (req.method !== "POST") {
    return Response.json({ message: "Method Not Allowed" }, { status: 405 });
  }

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  try {
    const body = await req.json();
    
    if (!body.amount) {
      return Response.json({ error: "Amount is required" }, { status: 400 });
    }
    
    // Ensure amount is a valid integer
    const amount = Math.max(100, Math.round(Number(body.amount)));
    
    if (isNaN(amount) || amount < 100) {
      return Response.json({ error: "Invalid amount. Minimum amount is 100 paise (1 INR)" }, { status: 400 });
    }
    
    const options = {
      amount: amount, // Amount in paise
      currency: "INR",
      receipt: `order_rcptid_${Math.random().toString(36).substring(2, 15)}`,
    };

    const order = await razorpay.orders.create(options);
    return Response.json(order);
  } catch (error) {
    console.error("Razorpay order creation error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}