export class RateLimiter {
  private requests: number = 0;
  private lastReset: number = Date.now();
  private readonly limit: number;
  private readonly interval: number;

  constructor(limit: number, interval: number = 24 * 60 * 60 * 1000) { // Default: 24 hours
    this.limit = limit;
    this.interval = interval;
  }

  canMakeRequest(): boolean {
    const now = Date.now();
    if (now - this.lastReset >= this.interval) {
      this.requests = 0;
      this.lastReset = now;
    }

    return this.requests < this.limit;
  }

  incrementRequests(): void {
    if (this.canMakeRequest()) {
      this.requests++;
    }
  }

  getRemainingRequests(): number {
    if (Date.now() - this.lastReset >= this.interval) {
      return this.limit;
    }
    return Math.max(0, this.limit - this.requests);
  }

  getTimeUntilReset(): number {
    return Math.max(0, this.interval - (Date.now() - this.lastReset));
  }
} 