// Rate limiting middleware to prevent abuse

const rateLimit = (windowMs, maxRequests) => {
  const requestCounts = new Map();

  return (req, res, next) => {
    const key = req.ip || req.connection.remoteAddress;
    const now = Date.now();

    if (!requestCounts.has(key)) {
      requestCounts.set(key, []);
    }

    const requests = requestCounts.get(key);
    
    // Remove old requests outside the window
    const validRequests = requests.filter(time => now - time < windowMs);
    
    if (validRequests.length >= maxRequests) {
      return res.status(429).json({
        error: "Too Many Requests",
        message: `Rate limit exceeded. Max ${maxRequests} requests per ${Math.round(windowMs / 1000)} seconds.`,
        retryAfter: Math.ceil((validRequests[0] + windowMs - now) / 1000),
      });
    }

    validRequests.push(now);
    requestCounts.set(key, validRequests);

    // Clean up old entries periodically
    if (requestCounts.size > 10000) {
      for (let [k, v] of requestCounts.entries()) {
        if (v.filter(time => now - time < windowMs).length === 0) {
          requestCounts.delete(k);
        }
      }
    }

    next();
  };
};

// Specific rate limiters
const authLimiter = rateLimit(15 * 60 * 1000, 5); // 5 requests per 15 minutes
const apiLimiter = rateLimit(60 * 1000, 100); // 100 requests per minute
const productLimiter = rateLimit(60 * 1000, 30); // 30 requests per minute for product creation

module.exports = {
  authLimiter,
  apiLimiter,
  productLimiter,
};