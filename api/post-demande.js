// Wakhma PRO — Post Demand API (persistent JSON file)
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join('/tmp', 'wakhma-pro-demandes.json');

function readDemands() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    }
  } catch {}
  return [];
}

function writeDemands(demands) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(demands.slice(0, 500)));
  } catch {}
}

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const demand = req.body;
    if (!demand.title || !demand.whatsapp) return res.status(400).json({ error: 'Titre et WhatsApp obligatoires' });
    demand.id = demand.id || 'DEM-' + Date.now().toString(36).toUpperCase();
    demand.createdAt = demand.createdAt || new Date().toISOString();
    demand.status = demand.status || 'active';
    demand.source = 'pro';

    let demands = readDemands();
    demands.unshift(demand);
    if (demands.length > 500) demands = demands.slice(0, 500);
    writeDemands(demands);

    res.status(200).json({ success: true, demand });
  } catch { res.status(500).json({ error: 'Erreur serveur' }); }
}
