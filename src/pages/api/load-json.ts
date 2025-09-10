import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { file } = req.query;

  if (!file || typeof file !== 'string') {
    return res.status(400).json({ message: 'File parameter is required' });
  }

  try {
    // Define the directory where JSON files are stored
    const dataDir = path.join(process.cwd(), 'data');
    
    // Check if the data directory exists, if not create it
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    const filePath = path.join(dataDir, file);
    
    // Security check: ensure the file is within the data directory
    const resolvedPath = path.resolve(filePath);
    if (!resolvedPath.startsWith(path.resolve(dataDir))) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Read and parse the file
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // Handle both JSON and JSONL files
    if (file.endsWith('.jsonl')) {
      // Parse JSONL (JSON Lines) format
      const lines = fileContent.split('\n').filter(line => line.trim() !== '');
      const jsonData = lines.map(line => {
        try {
          return JSON.parse(line);
        } catch (error) {
          console.error('Error parsing JSONL line:', error);
          return null;
        }
      }).filter(item => item !== null);
      
      res.status(200).json(jsonData);
    } else {
      // Parse regular JSON file
      const jsonData = JSON.parse(fileContent);
      res.status(200).json(jsonData);
    }
  } catch (error) {
    console.error('Error loading JSON file:', error);
    res.status(500).json({ message: 'Error loading file', error: error.message });
  }
}
