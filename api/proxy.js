export default async function handler(req, res) {
  const EXTERNAL_API_BASE = 'https://platform.fintacharts.com';
  const apiUrl = `${EXTERNAL_API_BASE}${req.url.replace('/api/proxy', '')}`;
  const fetchOptions = {
    method: req.method,
    headers: { ...req.headers },
    body: ['GET', 'HEAD'].includes(req.method) ? undefined : req.body,
  };
  delete fetchOptions.headers.host;
  const apiRes = await fetch(apiUrl, fetchOptions);
  res.status(apiRes.status);
  apiRes.headers.forEach((value, key) => {
    res.setHeader(key, value);
  });
  const buffer = Buffer.from(await apiRes.arrayBuffer());
  res.send(buffer);
} 