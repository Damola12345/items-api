// Initialize OpenTelemetry (optional -- safe if collector not present)
let sdk;
try {
  const { NodeSDK } = require('@opentelemetry/sdk-node');
  const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
  const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-grpc');

  const otelEndpoint = process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4317';

  sdk = new NodeSDK({
    traceExporter: new OTLPTraceExporter({
      url: otelEndpoint
    }),
    instrumentations: [getNodeAutoInstrumentations()]
  });

  sdk.start()
    .then(() => console.log('OpenTelemetry SDK started'))
    .catch((err) => console.warn(' OTel SDK start failed:', err.message));
} catch (err) {
  console.warn('OpenTelemetry modules not loaded, continuing without tracing.');
}


const express = require('express');
const bodyParser = require('body-parser');
const { init, addItem, listItems } = require('./db');
const { register, httpRequestDurationMs, pendingJobs } = require('./metrics');

const client = require('prom-client');
client.collectDefaultMetrics();

const app = express();
app.use(bodyParser.json());

// DB init
init().catch(err => {
  console.error('DB init error:', err);
});

// latency middleware
app.use((req, res, next) => {
  const end = httpRequestDurationMs.startTimer();
  res.on('finish', () => {
    end({ method: req.method, route: req.path, code: res.statusCode });
  });
  next();
});

// health endpoint
app.get('/healthz', (req, res) => res.status(200).send('ok'));

// create item
app.post('/items', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'name required' });
    const item = await addItem(name);
    res.status(201).json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal error' });
  }
});

// list items
app.get('/items', async (req, res) => {
  try {
    const items = await listItems();
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal error' });
  }
});

// simulate enqueue/dequeue for metrics
app.post('/enqueue', (req, res) => {
  pendingJobs.inc();
  res.json({ status: 'enqueued' });
});

app.post('/dequeue', (req, res) => {
  pendingJobs.dec();
  res.json({ status: 'dequeued' });
});

// metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`app listening on ${port}`);
});
