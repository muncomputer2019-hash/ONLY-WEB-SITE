import React from 'react';
import {
  Briefcase,
  Building2,
  Car,
  ClipboardCheck,
  CreditCard,
  FileCheck2,
  FileText,
  Flame,
  Globe,
  GraduationCap,
  HeartPulse,
  IdCard,
  Landmark,
  MapPinned,
  Monitor,
  Plane,
  Printer,
  QrCode,
  Receipt,
  Scale,
  ShieldCheck,
  ShoppingBag,
  Sprout,
} from 'lucide-react';

export const CategoryIcon: React.FC<{ name: string; className?: string }> = ({
  name,
  className = 'w-5 h-5',
}) => {
  switch (name) {
    case 'FileCheck2':
      return <FileCheck2 className={className} />;
    case 'Landmark':
      return <Landmark className={className} />;
    case 'Printer':
      return <Printer className={className} />;
    case 'IdCard':
      return <IdCard className={className} />;
    case 'Flame':
      return <Flame className={className} />;
    case 'FileText':
      return <FileText className={className} />;
    case 'Globe':
      return <Globe className={className} />;
    case 'ClipboardCheck':
      return <ClipboardCheck className={className} />;
    case 'Briefcase':
      return <Briefcase className={className} />;
    case 'Building2':
      return <Building2 className={className} />;
    case 'HeartPulse':
      return <HeartPulse className={className} />;
    case 'GraduationCap':
      return <GraduationCap className={className} />;
    case 'MapPinned':
      return <MapPinned className={className} />;
    case 'CreditCard':
      return <CreditCard className={className} />;
    case 'Receipt':
      return <Receipt className={className} />;
    case 'Plane':
      return <Plane className={className} />;
    case 'ShieldCheck':
      return <ShieldCheck className={className} />;
    case 'Scale':
      return <Scale className={className} />;
    case 'QrCode':
      return <QrCode className={className} />;
    case 'Sprout':
      return <Sprout className={className} />;
    case 'Car':
      return <Car className={className} />;
    case 'ShoppingBag':
      return <ShoppingBag className={className} />;
    case 'Monitor':
    default:
      return <Monitor className={className} />;
  }
};
