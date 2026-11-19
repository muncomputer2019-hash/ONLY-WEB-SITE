import { addDoc, collection, serverTimestamp, type Timestamp } from 'firebase/firestore';
import { formatFullAddress } from '../config/businessConfig';
import type { WebsiteSettings } from '../types';
import { db, handleFirestoreError, OperationType } from './firebase';

const FEEDBACK_COOLDOWN_KEY = 'mun_computer_last_feedback_ts';
const CONTACT_COOLDOWN_KEY = 'mun_computer_last_contact_ts';

export function sanitizeInput(value: string, maxLength: number): string {
  return value.replace(/[<>]/g, '').trim().slice(0, maxLength);
}

export function generateFeedbackCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let suffix = '';
  for (let i = 0; i < 6; i++) {
    suffix += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `MC-FB-${suffix}`;
}

export function formatFirestoreDate(ts?: Timestamp | string | null): string {
  if (!ts) return 'Recent';
  if (typeof ts === 'string') return ts;
  try {
    const date = ts.toDate();
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return 'Recent';
  }
}

export function getGoogleMapsDirectionsUrl(addressText: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressText)}`;
}

export function getShopMapsUrl(settings?: Partial<WebsiteSettings>): string {
  if (
    typeof settings?.shopLat === 'number' &&
    typeof settings?.shopLng === 'number' &&
    Number.isFinite(settings.shopLat) &&
    Number.isFinite(settings.shopLng)
  ) {
    return `https://www.google.com/maps/dir/?api=1&destination=${settings.shopLat},${settings.shopLng}`;
  }
  return getGoogleMapsDirectionsUrl(
    `${settings?.businessName || 'MUN COMPUTER'}, ${formatFullAddress(settings)}`
  );
}

export function parseLatLngFromInput(
  rawInput: string
): { lat: number; lng: number } | null {
  const input = rawInput.trim();
  if (!input) return null;

  const normalize = (latStr: string, lngStr: string) => {
    const lat = Number(latStr);
    const lng = Number(lngStr);
    if (
      !Number.isFinite(lat) ||
      !Number.isFinite(lng) ||
      lat < -90 ||
      lat > 90 ||
      lng < -180 ||
      lng > 180
    ) {
      return null;
    }
    return {
      lat: Number(lat.toFixed(7)),
      lng: Number(lng.toFixed(7)),
    };
  };

  // 1. Google Maps exact pin format (!3dLAT!4dLNG)
  const dataPinMatch = input.match(/!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/);
  if (dataPinMatch) {
    const parsed = normalize(dataPinMatch[1], dataPinMatch[2]);
    if (parsed) return parsed;
  }

  // 2. Google Maps query params (?q=lat,lng, &ll=lat,lng, &destination=lat,lng, &center=lat,lng)
  const queryParamMatch = input.match(
    /[?&](?:q|ll|destination|center|query)=(-?\d+(?:\.\d+)?)[,\s]+(-?\d+(?:\.\d+)?)/i
  );
  if (queryParamMatch) {
    const parsed = normalize(queryParamMatch[1], queryParamMatch[2]);
    if (parsed) return parsed;
  }

  // 3. Google Maps viewport path (@lat,lng)
  const atMatch = input.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
  if (atMatch) {
    const parsed = normalize(atMatch[1], atMatch[2]);
    if (parsed) return parsed;
  }

  // 4. Plain "lat, lng" or "lat lng"
  const plainMatch = input.match(
    /^\s*(-?\d+(?:\.\d+)?)\s*[,\s]\s*(-?\d+(?:\.\d+)?)\s*$/
  );
  if (plainMatch) {
    return normalize(plainMatch[1], plainMatch[2]);
  }

  return null;
}

export function getWhatsAppUrl(phoneNumber: string, message?: string): string {
  const digits = phoneNumber.replace(/[^0-9]/g, '');
  const base = `https://wa.me/${digits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export interface FeedbackSubmissionInput {
  customerName?: string;
  mobileNumber?: string;
  serviceCategory: string;
  serviceReferenceId?: string;
  rating: number;
  message: string;
  publicationConsent: boolean;
  honeypot?: string;
}

export async function submitCustomerFeedback(
  input: FeedbackSubmissionInput
): Promise<{ feedbackCode: string }> {
  if (input.honeypot && input.honeypot.trim().length > 0) {
    throw new Error('Submission blocked by spam verification.');
  }

  try {
    const lastTs = Number(localStorage.getItem(FEEDBACK_COOLDOWN_KEY) || '0');
    if (Date.now() - lastTs < 30_000) {
      throw new Error('Please wait a moment before submitting another feedback entry.');
    }
  } catch (err) {
    if (err instanceof Error && err.message.includes('Please wait')) {
      throw err;
    }
  }

  const serviceCategory = sanitizeInput(input.serviceCategory, 100);
  const message = sanitizeInput(input.message, 2000);
  const customerName = sanitizeInput(input.customerName || '', 100);
  const mobileNumber = sanitizeInput(input.mobileNumber || '', 20);
  const serviceReferenceId = sanitizeInput(input.serviceReferenceId || '', 64);

  if (!serviceCategory || serviceCategory.length < 2) {
    throw new Error('Please select a service category.');
  }
  if (!Number.isInteger(input.rating) || input.rating < 1 || input.rating > 5) {
    throw new Error('Please choose a rating between 1 and 5 stars.');
  }
  if (!message || message.length < 5) {
    throw new Error('Please enter a feedback message (at least 5 characters).');
  }
  if (mobileNumber && !/^[0-9+\-\s()]{6,20}$/.test(mobileNumber)) {
    throw new Error('Please enter a valid mobile number or leave it blank.');
  }

  const feedbackCode = generateFeedbackCode();
  const payload: Record<string, unknown> = {
    feedbackCode,
    serviceCategory,
    rating: input.rating,
    message,
    publicationConsent: Boolean(input.publicationConsent),
    status: 'NEW',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  if (customerName) payload.customerName = customerName;
  if (mobileNumber) payload.mobileNumber = mobileNumber;
  if (serviceReferenceId) payload.serviceReferenceId = serviceReferenceId;

  try {
    await addDoc(collection(db, 'customer_feedback'), payload);
    try {
      localStorage.setItem(FEEDBACK_COOLDOWN_KEY, String(Date.now()));
    } catch {
      // ignore storage errors
    }
    return { feedbackCode };
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'customer_feedback');
  }
}

export interface ContactEnquiryInput {
  name: string;
  phone?: string;
  email?: string;
  serviceCategory?: string;
  subject: string;
  message: string;
  honeypot?: string;
}

export async function submitContactEnquiry(input: ContactEnquiryInput): Promise<void> {
  if (input.honeypot && input.honeypot.trim().length > 0) {
    throw new Error('Submission blocked by spam verification.');
  }

  try {
    const lastTs = Number(localStorage.getItem(CONTACT_COOLDOWN_KEY) || '0');
    if (Date.now() - lastTs < 30_000) {
      throw new Error('Please wait a moment before sending another enquiry.');
    }
  } catch (err) {
    if (err instanceof Error && err.message.includes('Please wait')) {
      throw err;
    }
  }

  const name = sanitizeInput(input.name, 100);
  const phone = sanitizeInput(input.phone || '', 20);
  const email = sanitizeInput(input.email || '', 120);
  const serviceCategory = sanitizeInput(input.serviceCategory || '', 100);
  const subject = sanitizeInput(input.subject, 160);
  const message = sanitizeInput(input.message, 2000);

  if (!name || name.length < 2) {
    throw new Error('Please enter your name (at least 2 characters).');
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('Please enter a valid email address or leave it blank.');
  }
  if (!subject || subject.length < 3) {
    throw new Error('Please enter a subject (at least 3 characters).');
  }
  if (!message || message.length < 5) {
    throw new Error('Please enter your enquiry message (at least 5 characters).');
  }

  const payload: Record<string, unknown> = {
    name,
    subject,
    message,
    status: 'NEW',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  if (phone) payload.phone = phone;
  if (email) payload.email = email;
  if (serviceCategory) payload.serviceCategory = serviceCategory;

  try {
    await addDoc(collection(db, 'contact_enquiries'), payload);
    try {
      localStorage.setItem(CONTACT_COOLDOWN_KEY, String(Date.now()));
    } catch {
      // ignore storage errors
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'contact_enquiries');
  }
}
