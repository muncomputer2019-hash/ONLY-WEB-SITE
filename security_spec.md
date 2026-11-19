# MUN COMPUTER Security Specification & Dirty Dozen Verification

## 1. Core Data Invariants
1. **Public Read Isolation**: Anonymous public visitors may ONLY read `website_settings/main`, `public_services`, `public_reviews`, and `public_notices` where `status == 'published'`. All private operational records (`customer_feedback`, `contact_enquiries`, `customers`, `applications`, `ledger_entries`, `lpg_records`, `inventory_items`, `service_internals`, `staff_users`, `master_settings`, `audit_logs`) are strictly inaccessible to the public.
2. **Feedback Privacy & Consent Gate**: Public visitors can create `customer_feedback` ONLY with `status == 'NEW'`, valid rating `1..5`, and zero admin-only fields (`adminResponse`, `reviewedBy`, `reviewedAt`). Private `mobileNumber` is never copied to `public_reviews`. Public reviews may ONLY be created by verified Admins when publishing consented feedback.
3. **Unpublished Notice Protection**: Notices with `status == 'draft'` or `status == 'archived'` cannot be read or listed by unauthenticated users.
4. **Role-Based Access Control (RBAC) & Anti-Self-Elevation**: Users cannot self-assign `role: 'admin'` or modify their own `role` or `status` in `staff_users`. Only verified Admins (`isAdmin()`) can manage `staff_users`, `website_settings`, `master_settings`, `public_reviews`, and `public_notices`.
5. **Immutable Audit Trail**: `audit_logs` can only be created by verified staff/admins with `actorUid == request.auth.uid` and `createdAt == request.time`, and can never be updated or deleted.
6. **Strict Timestamp & Boundary Guards**: Every document creation enforces `createdAt == request.time` (where applicable) and bounded `.size()` checks on every string and array.

## 2. The "Dirty Dozen" Attack Payloads (Must Return PERMISSION_DENIED)
1. **Shadow Field Injection on Feedback Create**: Public creates `customer_feedback` with extra field `isVerified: true` or `reviewedBy: 'attacker'`.
2. **Status Bypass on Feedback Create**: Public creates `customer_feedback` with `status: 'APPROVED'` instead of `'NEW'`.
3. **Invalid Rating Boundary**: Public submits `customer_feedback` with `rating: 99` or `rating: 0`.
4. **Oversized Message Denial-of-Wallet**: Public submits `customer_feedback` with a 50KB `message` string (`> 2000` chars).
5. **ID Poisoning**: Write to `/customer_feedback/../../admins/hacker` or a 500-character document ID.
6. **Public Read of Private Feedback / Mobile Numbers**: Unauthenticated user calls `getDoc` or `getDocs` on `customer_feedback`.
7. **Public Read of Draft Notice**: Unauthenticated user calls `getDoc` on a `public_notices` document with `status: 'draft'`.
8. **Unverified Admin Email Spoof**: User with `email: 'muncomputer2021@gmail.com'` but `email_verified: false` attempts to write `website_settings/main`.
9. **Self-Privilege Escalation**: Authenticated `staff` user attempts to update `staff_users/{uid}` setting `role: 'admin'`.
10. **Public Service Internal Cost Leak**: Unauthenticated or non-staff user attempts to read `service_internals`.
11. **Timestamp Forgery**: Authenticated staff creates a `customers` document with backdated `createdAt`.
12. **Audit Log Tampering**: Authenticated staff or manager attempts to `update` or `delete` an existing `audit_logs` document.
