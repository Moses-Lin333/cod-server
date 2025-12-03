export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  // 直接把前端传来的数据原样返回
  res.status(200).json({
    success: true,
    received: req.body
  });
}
