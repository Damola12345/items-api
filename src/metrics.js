const client = require('prom-client');

const register = client.register;

// Histogram for request durations (ms)
const httpRequestDurationMs = new client.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['method', 'route', 'code'],
  buckets: [50,100,200,300,400,500,1000]
});

// Gauge to simulate pending jobs (used by KEDA or tests)
const pendingJobs = new client.Gauge({
  name: 'app_pending_jobs',
  help: 'Simulated pending jobs for KEDA scaling'
});

module.exports = { register, httpRequestDurationMs, pendingJobs };
