export type VehicleType =
  | 'Car'
  | 'SUV'
  | 'Hatchback'
  | 'Sedan'
  | 'Two Wheeler'
  | 'Commercial Vehicle';

export type ProductCategorySlug =
  | 'tyres'
  | 'batteries'
  | 'alloy-wheels'
  | 'accessories'
  | 'audio'
  | 'video'
  | 'detailing'
  | 'interior'
  | 'exterior'
  | 'parts'
  | 'tools'
  | 'services';

export interface TyreSpecs {
  width?: string;
  aspectRatio?: string;
  rimDiameter?: string;
  speedRating?: string;
  loadIndex?: string;
  construction?: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  brand: string;
  category: string;
  categorySlug: ProductCategorySlug;
  subCategory: string;
  vehicleTypes: VehicleType[];
  compatibleModels: string[];
  shortDescription: string;
  description: string;
  price: number | null; // null means "Contact for Price"
  availability: 'In Stock' | 'Available on Order' | 'Out of Stock';
  featured: boolean;
  isNewArrival?: boolean;
  isBestseller?: boolean;
  images: string[];
  visualType:
    | 'tyre-car'
    | 'tyre-suv'
    | 'tyre-moto'
    | 'tyre-truck'
    | 'battery-car'
    | 'battery-moto'
    | 'alloy-wheel'
    | 'speaker'
    | 'video-system'
    | 'sun-film'
    | 'ceramic-coating'
    | 'brake-fluid'
    | 'converter'
    | 'armrest'
    | 'camera'
    | 'organizer'
    | 'air-freshener'
    | 'buzzer'
    | 'tool';
  tyreSpecs?: TyreSpecs;
  specifications: Record<string, string>;
  additionalInfo?: string;
  createdAt: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: ProductCategorySlug;
  shortName: string;
  description: string;
  image: string;
  visualType: string;
  featuredOnHome: boolean;
}

export interface PromotionalBanner {
  id: string;
  slot: 'promo-1' | 'promo-2' | 'promo-3' | 'collection-1' | 'collection-2';
  kicker: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  image: string;
}

export interface EnquiryItem {
  productId: string;
  productName: string;
  sku: string;
  brand: string;
  category: string;
  quantity: number;
  price: number | null;
}

export type EnquiryStatus = 'New' | 'Contacted' | 'In Progress' | 'Completed';

export interface Enquiry {
  id: string;
  referenceNumber: string;
  type: 'product' | 'cart' | 'service' | 'contact';
  customerName: string;
  phone: string;
  email: string;
  city: string;
  state?: string;
  pincode?: string;
  vehicleType?: string;
  vehicleModel?: string;
  serviceName?: string;
  items: EnquiryItem[];
  message: string;
  status: EnquiryStatus;
  adminNotes: string;
  createdAt: string;
}

export interface ServiceItem {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  benefits: string[];
  relatedCategorySlug: ProductCategorySlug;
  visualType: string;
  image: string;
  durationEstimate: string;
}

export interface BlogArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  category: string;
  publishedAt: string;
  readTime: string;
  author: string;
  image: string;
  keyTakeaways: string[];
}
