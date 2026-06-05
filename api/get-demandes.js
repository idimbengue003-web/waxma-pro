// WAXMA PRO — Get Demands API (CORS enabled for cross-domain)
let demands = [];

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'POST') {
    const demand = req.body;
    demand.id = demand.id || 'DEM-' + Date.now().toString(36).toUpperCase();
    demand.createdAt = demand.createdAt || new Date().toISOString();
    demand.status = demand.status || 'active';
    demand.source = 'pro';
    demands.unshift(demand);
    if (demands.length > 500) demands = demands.slice(0, 500);
    return res.status(200).json({ success: true, demand });
  }

  res.status(200).json({
    demands: demands.filter(d => d.status !== 'rejected'),
    total: demands.length,
  });
}
