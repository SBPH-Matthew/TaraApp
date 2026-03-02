import type { ComponentProps } from 'react';
import {
  Armchair,
  ArrowRight,
  Bell,
  Bus,
  Car,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  CircleHelp,
  Clock,
  Code,
  Compass,
  CreditCard,
  Cross,
  Gift,
  Globe,
  Handshake,
  Heart,
  House,
  KeyRound,
  LogIn,
  Luggage,
  MapPin,
  MessageCircle,
  Minus,
  Pencil,
  Plane,
  PlaneLanding,
  PlaneTakeoff,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  ShoppingBasket,
  ShoppingCart,
  Star,
  Store,
  Trash2,
  Truck,
  User,
  Wifi,
} from 'lucide-react-native';

export type IconName = string;

type AppIconProps = Omit<ComponentProps<typeof CircleHelp>, 'ref'> & {
  name: IconName;
};

const ICON_MAP = {
  // Generic/nav
  home: House,
  'house.fill': House,
  send: ArrowRight,
  'paperplane.fill': ArrowRight,
  code: Code,
  'chevron.left.forwardslash.chevron.right': Code,
  'chevron-right': ChevronRight,
  'chevron-left': ChevronLeft,
  'chevron.right': ChevronRight,
  'keyboard-arrow-down': ChevronDown,

  // User/account
  person: User,
  'person.fill': User,
  'person-outline': User,
  settings: Settings,
  login: LogIn,
  edit: Pencil,

  // Commerce
  store: Store,
  storefront: Store,
  'store.fill': Store,
  'credit-card': CreditCard,
  'card-giftcard': Gift,
  'gift.fill': Gift,
  gifts: Gift,
  'shopping-cart': ShoppingCart,
  'shopping-basket': ShoppingBasket,
  remove: Minus,
  add: Plus,
  'delete-outline': Trash2,

  // Travel/flight
  flight: Plane,
  'flight-takeoff': PlaneTakeoff,
  'flight-land': PlaneLanding,
  place: MapPin,
  schedule: Clock,
  luggage: Luggage,
  weekend: Armchair,
  'local-shipping': Truck,
  'directions-bus': Bus,
  'directions-car': Car,
  'local-taxi': Car,

  // Status/actions
  check: Check,
  'check-circle': CircleCheck,
  'arrow-forward': ArrowRight,
  search: Search,
  star: Star,
  stars: Star,

  // Misc
  handshake: Handshake,
  'favorite-border': Heart,
  'verified-user': ShieldCheck,
  'medical-services': Cross,
  wifi: Wifi,
  language: Globe,
  chat: MessageCircle,
  wechat: MessageCircle,
  explore: Compass,
  modal: KeyRound,
  orders: Gift,
  payment: CreditCard,
  profile: User,
  shop: Store,
  trips: Plane,
  wishlist: Heart,
  index: House,
  notifications: Bell,
  'notifications-none': Bell,
} as const;

export function AppIcon({ name, ...props }: AppIconProps) {
  const IconComponent = ICON_MAP[name as keyof typeof ICON_MAP] ?? CircleHelp;
  return <IconComponent {...props} />;
}
