Jurisdiction-agnostic health data handling. All code that touches health data must comply with HIPAA, PHIPA, Quebec Law 25, and equivalent regulations.

Rules:
- No PHI (Protected Health Information) in logs at any level (debug, info, warn, error)
- No PHI in third-party analytics or monitoring payloads
- Sanitize all log output and telemetry before emission
- Use opaque identifiers (not patient names, emails, or health details) in any external-facing data
- Encryption at rest and in transit for all health data
- Audit logging for health data access (who accessed what, when)
