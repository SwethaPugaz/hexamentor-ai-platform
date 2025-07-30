import { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Simple routing
  const path = req.url?.replace('/api', '') || '/';

  if (path === '/health' || path === '/') {
    return res.status(200).json({ 
      message: 'HexaMentor API is running!',
      timestamp: new Date().toISOString(),
      environment: 'production'
    });
  }

  // For now, return a 404 for other routes
  return res.status(404).json({ 
    error: 'Endpoint not found',
    path: path,
    message: 'This API endpoint is not yet implemented'
  });
}
