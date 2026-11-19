/**
 * Security Rules Verification Specification for MUN COMPUTER
 * Verifies all Dirty Dozen attack vectors against Firestore Security Rules.
 */

export interface DirtyDozenCase {
  id: number;
  name: string;
  collection: string;
  operation: 'create' | 'get' | 'list' | 'update' | 'delete';
  expected: 'PERMISSION_DENIED';
  payload?: Record<string, unknown>;
  notes: string;
}

export const DIRTY_DOZEN_TEST_CASES: DirtyDozenCase[] = [
  {
    id: 1,
    name: 'Shadow Field Injection on Feedback Create',
    collection: 'customer_feedback',
    operation: 'create',
    expected: 'PERMISSION_DENIED',
    payload: {
      feedbackCode: 'MC-FB-TEST01',
      serviceCategory: 'Computer & Printing Services',
      rating: 5,
      message: 'Great service',
      publicationConsent: true,
      status: 'NEW',
      isVerified: true,
    },
    notes: 'Blocked by incoming().keys().hasOnly(...) in isValidFeedbackCreate.',
  },
  {
    id: 2,
    name: 'Status Bypass on Feedback Create',
    collection: 'customer_feedback',
    operation: 'create',
    expected: 'PERMISSION_DENIED',
    payload: {
      feedbackCode: 'MC-FB-TEST02',
      serviceCategory: 'Computer & Printing Services',
      rating: 5,
      message: 'Bypass attempt',
      publicationConsent: true,
      status: 'APPROVED',
    },
    notes: 'Blocked by incoming().status == "NEW".',
  },
  {
    id: 3,
    name: 'Invalid Rating Boundary',
    collection: 'customer_feedback',
    operation: 'create',
    expected: 'PERMISSION_DENIED',
    payload: {
      feedbackCode: 'MC-FB-TEST03',
      serviceCategory: 'Computer & Printing Services',
      rating: 99,
      message: 'Invalid rating',
      publicationConsent: false,
      status: 'NEW',
    },
    notes: 'Blocked by rating is int && rating >= 1 && rating <= 5.',
  },
  {
    id: 4,
    name: 'Oversized Message Denial-of-Wallet',
    collection: 'customer_feedback',
    operation: 'create',
    expected: 'PERMISSION_DENIED',
    payload: {
      feedbackCode: 'MC-FB-TEST04',
      serviceCategory: 'Computer & Printing Services',
      rating: 4,
      message: 'A'.repeat(5000),
      publicationConsent: false,
      status: 'NEW',
    },
    notes: 'Blocked by data.message.size() <= 2000.',
  },
  {
    id: 5,
    name: 'ID Poisoning',
    collection: 'customer_feedback',
    operation: 'create',
    expected: 'PERMISSION_DENIED',
    notes: 'Blocked by isValidId(docId) regex ^[a-zA-Z0-9_\\-]+$ and size <= 128.',
  },
  {
    id: 6,
    name: 'Public Read of Private Feedback',
    collection: 'customer_feedback',
    operation: 'list',
    expected: 'PERMISSION_DENIED',
    notes: 'Blocked because allow read requires isManagerOrAdmin().',
  },
  {
    id: 7,
    name: 'Public Read of Draft Notice',
    collection: 'public_notices',
    operation: 'get',
    expected: 'PERMISSION_DENIED',
    notes: 'Blocked because allow get requires resource.data.status == "published" or isStaff().',
  },
  {
    id: 8,
    name: 'Unverified Admin Email Spoof',
    collection: 'website_settings',
    operation: 'update',
    expected: 'PERMISSION_DENIED',
    notes: 'Blocked by request.auth.token.email_verified == true in isAdmin().',
  },
  {
    id: 9,
    name: 'Self-Privilege Escalation in staff_users',
    collection: 'staff_users',
    operation: 'update',
    expected: 'PERMISSION_DENIED',
    payload: { role: 'admin' },
    notes: 'Blocked because non-admin device update enforces affectedKeys().hasOnly(["registeredDevices", "lastLoginAt", "updatedAt"]).',
  },
  {
    id: 10,
    name: 'Public Read of Internal Service Commission or Master Settings',
    collection: 'master_settings',
    operation: 'get',
    expected: 'PERMISSION_DENIED',
    notes: 'Blocked because service_internals and master_settings require isStaff().',
  },
  {
    id: 11,
    name: 'Timestamp Forgery on Billing / Customer Create',
    collection: 'billing_documents',
    operation: 'create',
    expected: 'PERMISSION_DENIED',
    notes: 'Blocked by incoming().createdAt == request.time and updatedAt == request.time.',
  },
  {
    id: 12,
    name: 'Immutable Log Tampering (audit_logs / print_logs / login_history)',
    collection: 'audit_logs',
    operation: 'delete',
    expected: 'PERMISSION_DENIED',
    notes: 'Blocked by allow update, delete: if false; on audit_logs, print_logs, and login_history.',
  },
];
