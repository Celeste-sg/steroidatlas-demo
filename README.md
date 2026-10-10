# SteroidAtlas Showcase

Static competition demonstration. Open `index.html` or serve this directory with any static server. All assets are relative, so GitHub Pages project paths work. No backend or live model calls are used. After loading, case switching and report export require no network.

- **REAL**: public molecular structures and RDKit-computed descriptors/search results; not measured properties.
- **SIMULATED**: original illustrative assay values, new PK/safety mocks, literature-SAR illustration and canned next-round feedback.
- **VIRTUAL**: saved Codex hypotheses and untested modification proposals; no synthesis, assay, novelty or professional review claimed.
- **MISSING**: unavailable experiments, professional review and measured business outcomes.

The original four-molecule series has eight assay rows, not eight cases. Dexamethasone and betamethasone have different full InChIKeys despite non-chiral fingerprint similarity of 1. Value claims are registration targets, not measured outcomes. Reviewer feedback concerns demo wording only.

This public directory contains compiled static assets and allow-listed public/illustrative data only. It contains no licensed commercial observations, original private repository, credentials or database dumps. Mock inputs are kept separately in `data/mock/illustrative.json`. Case C and v2 feedback are illustrative and do not claim an archived Codex run.

Public identity references: PubChem. Computation: RDKit 2026.03.3. Analysis: saved Codex conversation artifacts. Original application stack: PostgreSQL + RDKit, FastAPI, Next.js, Docker Compose. Showcase: HTML, CSS and JavaScript. No third-party CDN is used.

## GitHub Pages

Publish this directory only into a separate public repository. Enable Pages for the root of its main branch. `.nojekyll` is supplied in the packaged output. Do not copy private source, documents or commercial-source data into that repository.

## Source library

The platform snapshot contains **4,236 source associations across 4,158 unique documents**, covering 11 pilot APIs. These are records, not 4,236 independent databases. The public catalog contains **3,903 unique public-source documents / 3,960 associations** from PubChem, ClinicalTrials.gov, PubMed, openFDA and Orange Book. Licensed sources contribute aggregate counts only (276 associations / 255 documents); their titles, assignees and content are excluded.

The catalog exports source metadata, identifiers, references and allow-listed structured fields, not full articles or licensed payloads. Search association and name-field matching remain distinct; neither establishes stereochemical identity, professional approval or clinical efficacy. Collection snapshot: 2026-08-27; compilation: 2026-10-08. Counts are archived, not live monitoring.
