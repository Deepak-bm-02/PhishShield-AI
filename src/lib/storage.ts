import { HistoryRecord, ThreatReport } from '@/types';

class LocalStorageService {
  private STORAGE_KEY = 'phishshield_history';
  private EVENT_NAME = 'phishshield-storage';

  getHistory(): HistoryRecord[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (!data) return [];
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  saveAnalysis(report: ThreatReport, scanType: string): void {
    if (typeof window === 'undefined') return;
    const history = this.getHistory();
    const newId = report.requestId || crypto.randomUUID();
    const newRecord: HistoryRecord = {
      ...report,
      id: newId,
      requestId: newId,
      timestamp: report.timestamp || new Date().toISOString(),
      scanType,
    };
    
    // Unshift to put the newest at the top
    history.unshift(newRecord);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
    window.dispatchEvent(new Event(this.EVENT_NAME));
  }

  deleteAnalysis(id: string): void {
    if (typeof window === 'undefined') return;
    const history = this.getHistory();
    const updated = history.filter(r => r.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event(this.EVENT_NAME));
  }

  clearHistory(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.STORAGE_KEY);
    window.dispatchEvent(new Event(this.EVENT_NAME));
  }

  // Subscribe to storage changes. Returns a cleanup function.
  subscribe(callback: () => void): () => void {
    if (typeof window === 'undefined') return () => {};
    window.addEventListener(this.EVENT_NAME, callback);
    // Also listen to native storage event for multi-tab support
    
    const nativeStorageHandler = (e: StorageEvent) => {
      if (e.key === this.STORAGE_KEY) callback();
    };
    
    window.addEventListener('storage', nativeStorageHandler);
    
    return () => {
      window.removeEventListener(this.EVENT_NAME, callback);
      window.removeEventListener('storage', nativeStorageHandler);
    };
  }
}

export const StorageService = new LocalStorageService();
