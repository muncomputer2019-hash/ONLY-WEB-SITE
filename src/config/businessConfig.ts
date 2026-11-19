import type { PublicServiceItem, ServiceCategoryInfo, WebsiteSettings } from '../types';
import { FULL_SERVICES_CATALOG } from './servicesCatalog';

export const OFFICIAL_WEB_APP_URL = 'https://app.muncomputer.org';

/**
 * Configurable Official Logo Asset Location.
 * Pre-configured with the official MUN COMPUTER HEADER.png logo uploaded by the owner.
 */
export const LOGO_ASSET_CONFIG = {
  staticLogoPath: '/assets/aistudio/mun_logo_66196f51.png' as string,
  staticFaviconPath: '/assets/aistudio/mun_logo_66196f51.png' as string,
  acceptedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/webp'],
  maxUploadBytes: 240 * 1024,
};

export const SHOP_STOREFRONT_IMAGE = '/assets/aistudio/WhatsApp_Image_2026-11-19_at_9.15.22_AM_9ec23a38.jpeg';

export const OFFICIAL_BUSINESS_ADDRESS = {
  village: 'Mamudpur',
  postOffice: 'Juginda',
  policeStation: 'Domkal',
  district: 'Murshidabad',
  state: 'West Bengal',
  country: 'India',
  pinCode: '742406',
};

export const DEFAULT_WEBSITE_SETTINGS: WebsiteSettings = {
  businessName: 'MUN COMPUTER',
  businessType: 'Digital Service & Computer Solutions Centre',
  logoDataUrl: '',
  faviconDataUrl: '',
  heroHeading: 'WELCOME TO MUN COMPUTER',
  heroSubtitle: 'Your Trusted Digital Service & Computer Solutions Centre.',
  heroDescription:
    'MUN COMPUTER provides digital service assistance, computer solutions, documentation support and customer-focused services across 40 main categories.',
  heroImageUrl: SHOP_STOREFRONT_IMAGE,
  aboutIntro:
    'MUN COMPUTER is an independent local Digital Service & Computer Solutions Centre serving residents, students, farmers, and small businesses in Mamudpur, Juginda, Domkal, and surrounding areas of Murshidabad, West Bengal.',
  mission:
    'To provide clear, reliable, and accessible digital application assistance, computer printing solutions, banking support, and documentation guidance with transparent customer care.',
  vision:
    'To be a dependable local digital solutions centre where every visitor receives honest service information, careful document preparation, and attentive follow-up support.',
  serviceCommitment:
    'We assist customers with online portals, forms, printing, document scanning, and digital follow-up. All government portals, banking networks, and third-party schemes remain subject to the rules and approvals of their respective authorities.',
  phone: '+91 8101352105',
  whatsapp: '+91 8101352105',
  email: 'MUNCOMPUTER2019@GMAIL.COM',
  village: OFFICIAL_BUSINESS_ADDRESS.village,
  postOffice: OFFICIAL_BUSINESS_ADDRESS.postOffice,
  policeStation: OFFICIAL_BUSINESS_ADDRESS.policeStation,
  district: OFFICIAL_BUSINESS_ADDRESS.district,
  state: OFFICIAL_BUSINESS_ADDRESS.state,
  country: OFFICIAL_BUSINESS_ADDRESS.country,
  pinCode: OFFICIAL_BUSINESS_ADDRESS.pinCode,
  businessHoursConfigured: false,
  openingTime: '',
  closingTime: '',
  weeklyHolidays: [],
  specialHolidayNotice: '',
  temporaryClosureNotice: '',
  shopLat: undefined,
  shopLng: undefined,
  shopMapAddress: '',
};

export const SERVICE_CATEGORIES: ServiceCategoryInfo[] = FULL_SERVICES_CATALOG.map((cat) => ({
  id: cat.id,
  number: cat.number,
  title: cat.title,
  shortDescription: cat.shortDescription,
  iconName: cat.iconName,
}));

export const DEFAULT_PUBLIC_SERVICES: PublicServiceItem[] = FULL_SERVICES_CATALOG.flatMap((cat) =>
  cat.services.map((srv) => ({
    id: `srv-${srv.code}`,
    title: srv.title,
    category: cat.title,
    shortDescription: `${srv.title} — guided online assistance, document preparation, and receipt printing under ${cat.title}.`,
    isActive: true,
    sortOrder: srv.code,
  }))
);

export function formatFullAddress(settings?: Partial<WebsiteSettings>): string {
  if (settings?.shopMapAddress && settings.shopMapAddress.trim().length > 0) {
    return settings.shopMapAddress.trim();
  }
  const v = settings?.village || OFFICIAL_BUSINESS_ADDRESS.village;
  const po = settings?.postOffice || OFFICIAL_BUSINESS_ADDRESS.postOffice;
  const ps = settings?.policeStation || OFFICIAL_BUSINESS_ADDRESS.policeStation;
  const d = settings?.district || OFFICIAL_BUSINESS_ADDRESS.district;
  const s = settings?.state || OFFICIAL_BUSINESS_ADDRESS.state;
  const p = settings?.pinCode || OFFICIAL_BUSINESS_ADDRESS.pinCode;
  const c = settings?.country || OFFICIAL_BUSINESS_ADDRESS.country;
  return `Village: ${v}, P.O.: ${po}, P.S.: ${ps}, District: ${d}, ${s}, PIN: ${p}, ${c}`;
}
