import { HistoryRecord } from '../types';

export interface IHistoryRepository {
  saveAnalysis(record: HistoryRecord): Promise<void>;
  getHistory(): Promise<HistoryRecord[]>;
  deleteHistory(id: string): Promise<void>;
  filterHistory(scanType: string): Promise<HistoryRecord[]>;
}

import fs from 'fs';
import path from 'path';

class FileSystemHistoryRepository implements IHistoryRepository {
  private filePath = path.join(process.cwd(), 'data', 'history.json');

  constructor() {
    try {
      const dir = path.dirname(this.filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      if (!fs.existsSync(this.filePath)) {
        fs.writeFileSync(this.filePath, JSON.stringify([]));
      }
    } catch (e) {
      console.error('Failed to initialize history storage:', e);
    }
  }

  private read(): HistoryRecord[] {
    try {
      if (!fs.existsSync(this.filePath)) return [];
      const data = fs.readFileSync(this.filePath, 'utf-8');
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed to read history:', e);
      return [];
    }
  }

  private write(data: HistoryRecord[]) {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2));
    } catch (e) {
      console.error('Failed to write history:', e);
    }
  }

  async saveAnalysis(record: HistoryRecord): Promise<void> {
    const data = this.read();
    data.push(record);
    this.write(data);
  }

  async getHistory(): Promise<HistoryRecord[]> {
    const data = this.read();
    return data.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  async deleteHistory(id: string): Promise<void> {
    const data = this.read();
    this.write(data.filter(record => record.id !== id));
  }

  async filterHistory(scanType: string): Promise<HistoryRecord[]> {
    const data = this.read();
    return data.filter(record => record.scanType === scanType);
  }
}

// Export a singleton instance. Future DBs will just replace this export.
export const HistoryStorage = new FileSystemHistoryRepository();
