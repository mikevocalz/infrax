# First real public-source pilot

This collector is an explicit development research action, not a scheduled production service. It fetches only EIA's published electricity-price table and a bounded OpenStreetMap extract. No keys, database credentials, email sends or deployments are involved. Failures remain failures; partial Overpass responses are not ingested.

## Sources and boundaries

- EIA Electric Power Monthly table 5.6.A: https://www.eia.gov/electricity/monthly/epm_table_grapher.php?t=table_5_06_a . Nationwide state/DC sector averages for the table's published month and comparison month. Preserve preliminary/final status, missing tokens, cents/kWh and release date. This is not a utility tariff, colocation quote or facility price. Data reuse policy: https://www.eia.gov/about/copyrights_reuse.php . Acknowledgment includes publication date; no logos or photos copied.
- OpenStreetMap: one DFW bounding box and only data-center tags. These are map objects, not independently verified facilities or offers. Nodes and buildings may overlap or belong to one campus. Do not auto-create a canonical facility or sellable MW from them. Approximate centers, limited tags and ODbL attribution are retained; personal contacts, editor identities and free-form notes are not stored. License: https://www.openstreetmap.org/copyright and https://osmfoundation.org/wiki/Licence/Licence_and_Legal_FAQ . Keep OSM evidence segregated and not publicly exposed until attribution/derivative-database obligations are implemented.
- PeeringDB is BLOCKED for this commercial use pending explicit permission. Its AUP does not permit treating anonymous API access as commercial reuse authorization: https://www.peeringdb.com/aup . No PeeringDB records are collected.

The workflow uploads a checksummed artifact for inspection. Database imports must target development explicitly, retain provenance, deduplicate unchanged payloads and leave publication/offers untouched. A successful source download is not equivalent to a completed database import, published signal or verified asset. No paid datasets or new accounts are provisioned.

Run locally: `python -m unittest discover -s scripts/ingestion -p 'test_*.py' -v`, then `python scripts/ingestion/collect-public-pilot.py --output public-pilot`.
