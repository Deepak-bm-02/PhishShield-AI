class MetricsTracker {
  private totalRequests = 0;
  private totalScans = 0;
  private successfulScans = 0;
  private failedScans = 0;
  private scanDurations: number[] = [];
  private aiLatencies: number[] = [];
  private ocrLatencies: number[] = [];
  private qrLatencies: number[] = [];

  public recordRequest() {
    this.totalRequests++;
  }

  public recordScan(duration: number, success: boolean) {
    this.totalScans++;
    if (success) {
      this.successfulScans++;
    } else {
      this.failedScans++;
    }
    this.scanDurations.push(duration);
    if (this.scanDurations.length > 1000) this.scanDurations.shift();
  }

  public recordAiLatency(duration: number) {
    this.aiLatencies.push(duration);
    if (this.aiLatencies.length > 100) this.aiLatencies.shift();
  }

  public recordOcrLatency(duration: number) {
    this.ocrLatencies.push(duration);
    if (this.ocrLatencies.length > 100) this.ocrLatencies.shift();
  }

  public recordQrLatency(duration: number) {
    this.qrLatencies.push(duration);
    if (this.qrLatencies.length > 100) this.qrLatencies.shift();
  }

  private getAverage(arr: number[]) {
    if (arr.length === 0) return 0;
    return Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);
  }

  public getStats() {
    return {
      totalRequests: this.totalRequests,
      totalScans: this.totalScans,
      successRate: this.totalScans ? ((this.successfulScans / this.totalScans) * 100).toFixed(2) + '%' : '0%',
      failureRate: this.totalScans ? ((this.failedScans / this.totalScans) * 100).toFixed(2) + '%' : '0%',
      averageScanDurationMs: this.getAverage(this.scanDurations),
      averageAiLatencyMs: this.getAverage(this.aiLatencies),
      averageOcrLatencyMs: this.getAverage(this.ocrLatencies),
      averageQrLatencyMs: this.getAverage(this.qrLatencies),
    };
  }
}

export const MetricsService = new MetricsTracker();
