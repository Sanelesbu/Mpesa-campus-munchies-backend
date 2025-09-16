const axios = require("axios");
const getAccessToken = require("../utils/mpesaAuth");

exports.initiateStkPush = async (req, res) => {
  const { phone, amount } = req.body;

  try {
    const token = await getAccessToken();
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, "").slice(0,14);

    const password = Buffer.from(
      `${process.env.SHORTCODE}${process.env.PASSKEY}${timestamp}`
    ).toString("base64");

    const response = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        BusinessShortCode: process.env.SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: phone,
        PartyB: process.env.SHORTCODE,
        PhoneNumber: phone,
        CallBackURL: `${process.env.BASE_URL}/api/mpesa/callback`,
        AccountReference: "CampusLunches",
        TransactionDesc: "Meal Payment",
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    res.json(response.data);
  } catch (err) {
    console.error("Mpesa STK Error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to initiate STK push" });
  }
};

exports.handleCallback = (req, res) => {
  console.log("✅ Mpesa Callback:", JSON.stringify(req.body, null, 2));
  res.json({ message: "Callback received" });
};
