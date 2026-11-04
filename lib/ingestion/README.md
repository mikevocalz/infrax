# Evidence ingest connectors

Implemented: EIA retail-sales price context; licensed ERCOT report transport; GeoJSON public discovery normalization; checksum/idempotency-ready ingestion pipeline.

**Not implemented/never claimed:** live credentials, actual API calls, access rights, permitted redistribution, Neon repository write adapter, facility matching, or operational grid/utility guarantees. An analyst must inspect source scope and applicable terms before promoting a source into public UI. EIA prices are statewide/sector averages, not colocation quotes.

Tests: `node --test lib/ingestion/ingestion.test.mjs`. Planned extensions: source-specific facility mapping, NOAA, USGS, HIFLD batch imports, utility territory joins, PJM licensed ingestion, commercial facility feeds, authenticated operator uploads, alert review queue. Provider registration and licensed datasets must be explicitly provisioned, not scraped.

## Extended source readers — source-specific limits and policies

- `noaa.mjs`: NOAA CDO historical station weather observations; real token required and explicit location/time query. Station observations alone cannot establish specific cooling feasibility or water allocation.
- `usgs.mjs`: modern USGS Water Data OGC endpoint reader, restricted to official collection paths; no legal access/water-right guarantees.
- `hifld.mjs`: bounded ArcGIS FeatureServer batch reader for *configured and reviewed* HIFLD datasets. Transmission line mapping is not service availability and some dataset copies are stale. Keep exact dataset URL/license in source record.
- `pjm.mjs`: PJM Data Miner client is **license-gated**, no fetch unless redistribution review has been explicitly approved. Check membership, feed conditions and cap requests before deployment.

These connectors **do not auto-publish** data, run a scheduler, create source licenses, or attach provider credentials. Pair with dedicated Neon repository adapter and ingestion queue before production. For private operator offers, require authenticated submissions and document/analyst review. Tests: `node --test lib/ingestion/*.test.mjs`.
