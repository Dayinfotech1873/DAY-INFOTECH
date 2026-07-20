# Security Specification for Gujarat Form Assistant

This document outlines the security architecture, invariants, threat model payloads (The "Dirty Dozen"), and validation rules for the Firestore database.

## 1. Data Invariants
- **Write Integrity (Create/Update)**: Anyone can create or update their own applications (drafts and submissions) using their generated IDs.
- **Access Isolation (Read/List/Delete)**: Only the verified owner (`bsporiya9@gmail.com`) can read, list, or delete other people's submissions. This prevents public data harvesting of PII (Aadhaar cards, bank details, signatures, etc.).
- **Strict Size Limits**: Text fields and Base64-encoded files must not exceed safe sizes to prevent Denial of Wallet attacks.

## 2. The "Dirty Dozen" Malicious Payloads (TDD Test Cases)

Below are twelve payloads designed to attack the database. They must all be rejected with `PERMISSION_DENIED`.

1. **Identity Spoofing (Owner bypass)**: Read all applications from the collection without being logged in.
2. **PII Harvesting (Unauthorized Get)**: A guest trying to get a specific application document they do not own.
3. **Privilege Escalation**: Attempting to delete an application document as a guest or unauthorized logged-in user.
4. **ID Poisoning (Junk ID)**: Creating an application with a document ID containing malicious characters, e.g. `applications/../../../etc/passwd`.
5. **Denial of Wallet (Huge Payload)**: Inserting a massive text payload of 10MB in details.
6. **Malicious Schema Injection**: Adding arbitrary fields like `isAdmin: true` or `role: "admin"` directly inside the database document.
7. **Temporal Fraud (Manipulated Timestamp)**: Providing a client-side falsified future date for `createdAt` instead of using the server timestamp.
8. **Invalid FormType**: Saving an application with a non-existent `formType` value (e.g., `"HACKED"`).
9. **Invalid Status**: Saving an application with a non-existent status state (e.g., `"SUBMITTED"`).
10. **State Shortcutting**: Updating a completed application's details after it has been finalized.
11. **Malicious File Injection**: Bypassing client-side limits to submit empty or corrupted documents.
12. **Untrusted Email Spoofing**: Attempting to access the database as an administrator with `email_verified: false` on the google token.

## 3. Test Runner Specification
The rules will be audited using flat security linter checks and local dry-run validation tests. All write operations from the public are strictly validated by `isValidApplication` and read operations are restricted to `isOwner()`.
