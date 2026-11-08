export type ProductCondition = 'Brand New' | 'Like New' | 'Excellent' | 'Good' | 'Fair';

export type ListingStatus = 'Active' | 'Pending Review' | 'Sold' | 'Draft' | 'Paused' | 'Rejected';

export type UserRole = 'customer' | 'seller' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  phone?: string;
  role: UserRole;
  city: string;
  state: string;
  joinedDate: string;
}

export interface SellerReview {
  id: string;
  reviewerName: string;
  reviewerAvatar: string;
  rating: number;
  date: string;
  comment: string;
  productName: string;
}

export interface Seller {
  id: string;
  name: string;
  email: string;
  avatar: string;
  phone: string;
  city: string;
  state: string;
  isVerified: boolean;
  verificationStatus: 'Not Verified' | 'Verification Pending' | 'Verified' | 'Verification Rejected';
  rating: number;
  reviewCount: number;
  completedSales: number;
  responseRate: string;
  avgResponseTime: string;
  memberSince: string;
  bio: string;
  reviews: SellerReview[];
}

export interface Product {
  id: string;
  title: string;
  brand: string;
  model: string;
  category: string;
  condition: ProductCondition;
  price: number;
  originalPrice: number;
  description: string;
  features: string[];
  specs: Record<string, string>;
  images: string[];
  coverImage: string;
  sellerId: string;
  sellerName: string;
  sellerCity: string;
  sellerRating: number;
  isSellerVerified: boolean;
  status: ListingStatus;
  views: number;
  likes: number;
  isNegotiable: boolean;
  deliveryOption: 'Delivery & Pickup' | 'Delivery Only' | 'Pickup Only';
  createdAt: string;
  featured?: boolean;
  trending?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  itemCount: number;
  description: string;
  image?: string;
}

export interface CartItem {
  product: Product;
  addedAt: string;
}

export type OrderStatus = 
  | 'Order Placed' 
  | 'Payment Confirmed' 
  | 'Seller Processing' 
  | 'Order Dispatched' 
  | 'Out for Delivery' 
  | 'Delivered' 
  | 'Cancelled';

export type PaymentMethod = 'UPI' | 'Card' | 'Net Banking' | 'Cash on Delivery';

export interface OrderTimelineItem {
  status: OrderStatus;
  timestamp: string;
  description: string;
  completed: boolean;
  current?: boolean;
}

export interface Order {
  id: string;
  productId: string;
  productTitle: string;
  productImage: string;
  productCondition: ProductCondition;
  sellerId: string;
  sellerName: string;
  buyerId: string;
  buyerName: string;
  price: number;
  deliveryFee: number;
  discount: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'Paid' | 'Pending' | 'Refunded';
  deliveryType: 'Delivery' | 'Pickup';
  shippingAddress: {
    fullName: string;
    phone: string;
    addressLine: string;
    city: string;
    state: string;
    pincode: string;
  };
  trackingNumber: string;
  carrierName: string;
  status: OrderStatus;
  createdAt: string;
  estimatedDelivery: string;
  timeline: OrderTimelineItem[];
}

export type OfferStatus = 'Pending' | 'Accepted' | 'Rejected' | 'Countered' | 'Expired';

export interface PriceOffer {
  id: string;
  productId: string;
  productTitle: string;
  productImage: string;
  listingPrice: number;
  offeredPrice: number;
  counterPrice?: number;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  status: OfferStatus;
  createdAt: string;
  updatedAt: string;
  message?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'buyer' | 'seller';
  text: string;
  timestamp: string;
  offerId?: string;
  isSystem?: boolean;
}

export interface Conversation {
  id: string;
  productId: string;
  productTitle: string;
  productImage: string;
  productPrice: number;
  buyerId: string;
  buyerName: string;
  buyerAvatar: string;
  sellerId: string;
  sellerName: string;
  sellerAvatar: string;
  isSellerOnline: boolean;
  lastMessage: string;
  lastMessageTimestamp: string;
  unreadCountBuyer: number;
  unreadCountSeller: number;
  messages: ChatMessage[];
  activeOffer?: PriceOffer;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  description: string;
  type: 'offer' | 'order' | 'message' | 'verification' | 'system';
  isRead: boolean;
  createdAt: string;
  link?: string;
}

export interface VerificationRequest {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerEmail: string;
  documentType: 'Aadhaar Card' | 'PAN Card' | 'Passport' | 'Voter ID';
  documentNumber: string;
  documentImage: string;
  phone: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  submittedAt: string;
  notes?: string;
}

export interface ReportedItem {
  id: string;
  targetType: 'listing' | 'user';
  targetId: string;
  targetTitle: string;
  reporterId: string;
  reporterName: string;
  reason: string;
  details: string;
  status: 'Pending Review' | 'Resolved - Dismissed' | 'Resolved - Removed';
  createdAt: string;
}
