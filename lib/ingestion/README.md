# Evidence ingest connectors

Implemented: EIA retail-sales price context; licensed ERCOT report transport; GeoJSON public discovery normalization; checksum/idempotency-ready ingestion pipeline.

**Not implemented/never claimed:** live credentials, actual API calls, access rights, permitted redistribution, Neon repository write adapter, facility matching, or operational grid/utility guarantees. An analyst must inspect source scope and applicable terms before promoting a source into public UI. EIA prices are statewide/sector averages, not colocation quotes.

Tests: `node --test lib/ingestion/ingestion.test.mjs`. Planned extensions: source-specific facility mapping, NOAA, USGS, HIFLD batch imports, utility territory joins, PJM licensed ingestion, commercial facility feeds, authenticated operator uploads, alert review queue. Provider registration and licensed datasets must be explicitly provisioned, not scraped.
