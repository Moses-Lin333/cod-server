import crypto from "crypto";

function sign(params, secret) {
  const sorted = Object.keys(params).sort();
  const str = sorted.map(k => `${k}=${params[k]}`).join("&");
  return crypto.createHmac("sha256", secret).update(str).digest("hex");
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const {
    name,
    phone,
    city,
    address,
    sku,
    quantity
  } = req.body;

  const STORE_DOMAIN = "你的store.myshoplaza.com";
  const APP_KEY = "你的_APP_KEY";
  const APP_SECRET = "你的_APP_SECRET";

  const timestamp = Math.floor(Date.now() / 1000);

  const signParams = {
    app_key: APP_KEY,
    timestamp
  };

  const signValue = sign(signParams, APP_SECRET);

  const apiUrl =
    `https://${STORE_DOMAIN}/openapi/2022-01/order/create` +
    `?app_key=${APP_KEY}&timestamp=${timestamp}&sign=${signValue}`;

  const body = {
    customer: {
      name,
      phone
    },
    shipping_address: {
      city,
      address1: address
    },
    items: [
      {
        sku,
        quantity
      }
    ],
    payment_method: "COD",
    note: "Single Page COD Order"
  };

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  const result = await response.json();
  res.status(200).json(result);
}
