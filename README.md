# items-api
# 🧩 items-api

A **Node.js REST microservice** that stores and lists simple items in **PostgreSQL**

- **REST API Endpoints**
  - `POST /items` — Add a new item (`name` required)
  - `GET /items` — List recent items
  - `GET /healthz` — Health check (useful for Kubernetes probes)
  - `POST /enqueue` — Increment a Prometheus gauge (simulate queued jobs)
  - `POST /dequeue` — Decrement the gauge
  - `/metrics` — Prometheus-compatible metrics (via `prom-client`

---

## Tech Stack

| Layer | Technology |
|-------|-------------|
| Runtime | Node.js 20 |
| Database | PostgreSQL 15 |
| Metrics | Prometheus |
| Traces | OpenTelemetry + Tempo |
| Logs | Loki + Promtail |
| Dashboards | Grafana |
| Collector | OpenTelemetry Collector |

---

## 🚀 Run Locally with Docker Compose

```bash
git clone https://github.com/<your-username>/items-api.git
cd items-api

docker compose up -d

