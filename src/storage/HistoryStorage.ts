import { HistoryRecord } from '../types';

// In a real application, this would use a database.
// Since this is a backend-only mock for Sprint 1/2, we'll use an in-memory array.
let historyStorage: HistoryRecord[] = [];

export class HistoryStorage {
  static async saveAnalysis(record: HistoryRecord): Promise<void> {
    historyStorage.push(record);
  }

  static async getHistory(): Promise<HistoryRecord[]> {
    return [...historyStorage].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  static async deleteHistory(id: string): Promise<void> {
    historyStorage = historyStorage.filter(record => record.id !== id);
  }

  static async filterHistory(scanType: string): Promise<HistoryRecord[]> {
    return historyStorage.filter(record => record.scanType === scanType);
  }
}
