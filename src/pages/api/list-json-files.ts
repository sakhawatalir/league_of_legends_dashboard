import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Define the directory where JSON files are stored
    const dataDir = path.join(process.cwd(), 'data');
    
    // Check if the data directory exists
    if (!fs.existsSync(dataDir)) {
      return res.status(200).json([]);
    }

    // Read all files in the data directory
    const files = fs.readdirSync(dataDir);
    
    // Filter for JSON and JSONL files only
    const jsonFiles = files.filter(file => 
      (file.endsWith('.json') || file.endsWith('.jsonl')) && 
      file !== 'README.md' && 
      !file.startsWith('.')
    );

    res.status(200).json(jsonFiles);
  } catch (error) {
    console.error('Error listing JSON files:', error);
    res.status(500).json({ message: 'Error listing files', error: error.message });
  }
}
