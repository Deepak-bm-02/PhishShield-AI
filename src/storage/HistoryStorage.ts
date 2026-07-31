import { HistoryRecord } from '../types';

export interface IHistoryRepository {
  saveAnalysis(record: HistoryRecord): Promise<void>;
  getHistory(): Promise<HistoryRecord[]>;
  deleteHistory(id: string): Promise<void>;
  filterHistory(scanType: string): Promise<HistoryRecord[]>;
}

class InMemoryHistoryRepository implements IHistoryRepository {
  private storage: HistoryRecord[] = [];

  async saveAnalysis(record: HistoryRecord): Promise<void> {
    this.storage.push(record);
  }

  async getHistory(): Promise<HistoryRecord[]> {
    return [...this.storage].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  async deleteHistory(id: string): Promise<void> {
    this.storage = this.storage.filter(record => record.id !== id);
  }

  async filterHistory(scanType: string): Promise<HistoryRecord[]> {
    return this.storage.filter(record => record.scanType === scanType);
  }
}

// Export a singleton instance. Future DBs will just replace this export.
export const HistoryStorage = new InMemoryHistoryRepository();
