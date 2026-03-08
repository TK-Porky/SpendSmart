/**
 * Rate Limiter Utility
 * Prevents excessive Firebase operations
 * @module utils/rateLimiter
 */

class RateLimiter {
  constructor() {
    this.operations = new Map();
    this.limits = { read: 100, write: 50, delete: 20, auth: 10 };
  }

  _getKey(type, id = 'global') {
    return `${type}:${id}:${Math.floor(Date.now() / 60000)}`;
  }

  canProceed(type, id = 'global') {
    const key = this._getKey(type, id);
    const count = this.operations.get(key) || 0;
    return count < (this.limits[type] || 50);
  }

  record(type, id = 'global') {
    const key = this._getKey(type, id);
    this.operations.set(key, (this.operations.get(key) || 0) + 1);
  }

  checkAndRecord(type, id = 'global') {
    if (!this.canProceed(type, id)) {
      throw new Error('Trop de requêtes. Veuillez patienter.');
    }
    this.record(type, id);
  }
}

export const rateLimiter = new RateLimiter();

export const withRateLimit = (type, id) => async (fn) => {
  rateLimiter.checkAndRecord(type, id);
  return await fn();
};

export default rateLimiter;
