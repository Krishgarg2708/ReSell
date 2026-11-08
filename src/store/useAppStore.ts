import { create } from 'zustand';
import { 
  Product, 
  Seller, 
  User, 
  UserRole, 
  Order, 
  Conversation, 
  ChatMessage, 
  PriceOffer, 
  NotificationItem, 
  VerificationRequest, 
  ReportedItem,
  OrderStatus
} from '../types';
import { INITIAL_PRODUCTS } from '../data/products';
import { SELLERS } from '../data/sellers';
import { 
  CURRENT_BUYER, 
  INITIAL_ORDERS, 
  INITIAL_CONVERSATIONS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_VERIFICATIONS, 
  INITIAL_REPORTS 
} from '../data/mockData';

const STORAGE_KEYS = {
  PRODUCTS: 'resell_products_v1',
  SELLERS: 'resell_sellers_v1',
  ROLE: 'resell_current_role_v1',
  WISHLIST: 'resell_wishlist_v1',
  CART: 'resell_cart_v1',
  ORDERS: 'resell_orders_v1',
  CONVERSATIONS: 'resell_conversations_v1',
  NOTIFICATIONS: 'resell_notifications_v1',
  VERIFICATIONS: 'resell_verifications_v1',
  REPORTS: 'resell_reports_v1',
  RECENTLY_VIEWED: 'resell_recently_viewed_v1',
  THEME: 'resell_theme_v1',
};

const loadStorage = <T>(key: string, fallback: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (err) {
    console.warn(`Error reading localStorage for ${key}:`, err);
    return fallback;
  }
};

const saveStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Error saving localStorage for ${key}:`, err);
  }
};

interface AppState {
  // User & Role
  currentUser: User;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;

  // Theme
  isDarkMode: boolean;
  toggleDarkMode: () => void;

  // Products
  products: Product[];
  addProduct: (newProduct: Omit<Product, 'id' | 'views' | 'likes' | 'createdAt'>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleListingStatus: (id: string, status: Product['status']) => void;

  // Sellers
  sellers: Seller[];
  updateSellerVerification: (sellerId: string, status: Seller['verificationStatus'], isVerified: boolean) => void;

  // Wishlist
  wishlist: string[]; // product IDs
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;

  // Cart
  cart: Product[];
  addToCart: (product: Product) => { success: boolean; message: string };
  removeFromCart: (productId: string) => void;
  clearCart: () => void;

  // Orders
  orders: Order[];
  placeOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'timeline' | 'trackingNumber' | 'carrierName'>) => Order;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  cancelOrder: (orderId: string) => void;

  // Chat & Negotiations
  conversations: Conversation[];
  sendMessage: (conversationId: string, text: string, offerId?: string) => void;
  createOrOpenConversation: (productId: string, sellerId: string, initialOffer?: number) => string;
  markConversationAsRead: (conversationId: string) => void;

  // Price Offers
  makeOffer: (productId: string, offeredPrice: number, message?: string) => PriceOffer;
  respondToOffer: (conversationId: string, offerId: string, action: 'accept' | 'reject' | 'counter', counterPrice?: number) => void;

  // Verifications
  verifications: VerificationRequest[];
  submitVerification: (req: Omit<VerificationRequest, 'id' | 'submittedAt' | 'status'>) => void;
  updateVerificationStatus: (id: string, status: 'Approved' | 'Rejected', notes?: string) => void;

  // Reports
  reports: ReportedItem[];
  reportItem: (targetType: 'listing' | 'user', targetId: string, targetTitle: string, reason: string, details: string) => void;
  resolveReport: (id: string, action: 'dismiss' | 'remove') => void;

  // Notifications
  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  addNotification: (title: string, description: string, type: NotificationItem['type'], link?: string) => void;

  // Recently Viewed
  recentlyViewed: string[]; // product IDs
  recordView: (productId: string) => void;

  // System
  resetAllDemoData: () => void;
}

export const useAppStore = create<AppState>((set, get) => {
  // Initialize dark mode
  const initialDark = loadStorage<boolean>(STORAGE_KEYS.THEME, false);
  if (typeof document !== 'undefined') {
    if (initialDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  return {
    currentUser: CURRENT_BUYER,
    currentRole: loadStorage<UserRole>(STORAGE_KEYS.ROLE, 'customer'),
    setCurrentRole: (role: UserRole) => {
      saveStorage(STORAGE_KEYS.ROLE, role);
      set({ currentRole: role });
    },

    isDarkMode: initialDark,
    toggleDarkMode: () => {
      const next = !get().isDarkMode;
      if (typeof document !== 'undefined') {
        if (next) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
      saveStorage(STORAGE_KEYS.THEME, next);
      set({ isDarkMode: next });
    },

    // Products
    products: loadStorage<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS),
    addProduct: (newProdData) => {
      const id = `prod-custom-${Date.now()}`;
      const newProduct: Product = {
        ...newProdData,
        id,
        views: 1,
        likes: 0,
        createdAt: new Date().toISOString(),
      };
      const updated = [newProduct, ...get().products];
      saveStorage(STORAGE_KEYS.PRODUCTS, updated);
      set({ products: updated });
      return newProduct;
    },
    updateProduct: (id, updates) => {
      const updated = get().products.map((p) => (p.id === id ? { ...p, ...updates } : p));
      saveStorage(STORAGE_KEYS.PRODUCTS, updated);
      set({ products: updated });
    },
    deleteProduct: (id) => {
      const updated = get().products.filter((p) => p.id !== id);
      saveStorage(STORAGE_KEYS.PRODUCTS, updated);
      set({ products: updated });
    },
    toggleListingStatus: (id, status) => {
      const updated = get().products.map((p) => (p.id === id ? { ...p, status } : p));
      saveStorage(STORAGE_KEYS.PRODUCTS, updated);
      set({ products: updated });
    },

    // Sellers
    sellers: loadStorage<Seller[]>(STORAGE_KEYS.SELLERS, SELLERS),
    updateSellerVerification: (sellerId, status, isVerified) => {
      const updatedSellers = get().sellers.map((s) => 
        s.id === sellerId ? { ...s, verificationStatus: status, isVerified } : s
      );
      saveStorage(STORAGE_KEYS.SELLERS, updatedSellers);
      
      // Update any products with this seller
      const updatedProducts = get().products.map((p) =>
        p.sellerId === sellerId ? { ...p, isSellerVerified: isVerified } : p
      );
      saveStorage(STORAGE_KEYS.PRODUCTS, updatedProducts);

      set({ sellers: updatedSellers, products: updatedProducts });
    },

    // Wishlist
    wishlist: loadStorage<string[]>(STORAGE_KEYS.WISHLIST, ['prod-sony-wh1000xm5', 'prod-mid-century-lounge-chair']),
    toggleWishlist: (productId) => {
      const current = get().wishlist;
      const next = current.includes(productId) 
        ? current.filter((id) => id !== productId)
        : [...current, productId];
      saveStorage(STORAGE_KEYS.WISHLIST, next);
      set({ wishlist: next });
    },
    isWishlisted: (productId) => get().wishlist.includes(productId),

    // Cart
    cart: loadStorage<Product[]>(STORAGE_KEYS.CART, []),
    addToCart: (product) => {
      const current = get().cart;
      // Pre-owned items are unique individual listings
      if (current.some((item) => item.id === product.id)) {
        return { success: false, message: 'This unique pre-owned listing is already in your cart.' };
      }
      if (product.status === 'Sold') {
        return { success: false, message: 'This item has already been purchased.' };
      }
      const next = [...current, product];
      saveStorage(STORAGE_KEYS.CART, next);
      set({ cart: next });
      return { success: true, message: `${product.title} added to cart.` };
    },
    removeFromCart: (productId) => {
      const next = get().cart.filter((item) => item.id !== productId);
      saveStorage(STORAGE_KEYS.CART, next);
      set({ cart: next });
    },
    clearCart: () => {
      saveStorage(STORAGE_KEYS.CART, []);
      set({ cart: [] });
    },

    // Orders
    orders: loadStorage<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS),
    placeOrder: (orderData) => {
      const id = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
      const now = new Date();
      const newOrder: Order = {
        ...orderData,
        id,
        trackingNumber: `DEL-IN-${Math.floor(1000000 + Math.random() * 9000000)}`,
        carrierName: orderData.deliveryType === 'Pickup' ? 'Self Pickup Verified' : 'Delhivery Direct Air',
        createdAt: now.toISOString(),
        timeline: [
          {
            status: 'Order Placed',
            timestamp: 'Just now',
            description: `Order ${id} placed for ${orderData.productTitle}.`,
            completed: true,
          },
          {
            status: 'Payment Confirmed',
            timestamp: 'Just now',
            description: `Payment of ₹${orderData.totalAmount.toLocaleString('en-IN')} verified.`,
            completed: true,
            current: true,
          },
          {
            status: 'Seller Processing',
            timestamp: 'Pending',
            description: 'Seller notified to prepare and package listing.',
            completed: false,
          },
          {
            status: 'Order Dispatched',
            timestamp: 'Pending',
            description: 'Courier partner will pick up shipment.',
            completed: false,
          },
          {
            status: 'Out for Delivery',
            timestamp: 'Pending',
            description: 'Out for doorstep delivery with OTP verification.',
            completed: false,
          },
          {
            status: 'Delivered',
            timestamp: 'Pending',
            description: 'Handover complete.',
            completed: false,
          },
        ],
      };

      // Mark the product as Sold
      get().updateProduct(orderData.productId, { status: 'Sold' });
      // Remove from cart
      get().removeFromCart(orderData.productId);

      const nextOrders = [newOrder, ...get().orders];
      saveStorage(STORAGE_KEYS.ORDERS, nextOrders);

      // Create notification
      get().addNotification(
        `Order ${id} Confirmed!`,
        `Your order for ${orderData.productTitle} has been successfully placed.`,
        'order',
        `/customer/orders`
      );

      set({ orders: nextOrders });
      return newOrder;
    },
    updateOrderStatus: (orderId, newStatus) => {
      const updated = get().orders.map((o) => {
        if (o.id !== orderId) return o;
        const timeline = o.timeline.map((t) => {
          if (t.status === newStatus) {
            return { ...t, completed: true, current: true, timestamp: 'Just now' };
          }
          return t;
        });
        return { ...o, status: newStatus, timeline };
      });
      saveStorage(STORAGE_KEYS.ORDERS, updated);
      set({ orders: updated });
    },
    cancelOrder: (orderId) => {
      const updated = get().orders.map((o) => (o.id === orderId ? { ...o, status: 'Cancelled' as OrderStatus } : o));
      saveStorage(STORAGE_KEYS.ORDERS, updated);
      set({ orders: updated });
    },

    // Conversations & Chat
    conversations: loadStorage<Conversation[]>(STORAGE_KEYS.CONVERSATIONS, INITIAL_CONVERSATIONS),
    sendMessage: (conversationId, text, offerId) => {
      const state = get();
      const currentRole = state.currentRole;
      const isSeller = currentRole === 'seller';
      const senderId = isSeller ? 'seller-demo' : state.currentUser.id;
      const senderName = isSeller ? 'Arjun Mehta' : state.currentUser.name;

      const newMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        senderId,
        senderName,
        senderRole: isSeller ? 'seller' : 'buyer',
        text,
        timestamp: 'Just now',
        offerId,
      };

      const updatedConversations = state.conversations.map((conv) => {
        if (conv.id !== conversationId) return conv;
        return {
          ...conv,
          lastMessage: text,
          lastMessageTimestamp: 'Just now',
          messages: [...conv.messages, newMsg],
          unreadCountBuyer: isSeller ? conv.unreadCountBuyer + 1 : 0,
          unreadCountSeller: isSeller ? 0 : conv.unreadCountSeller + 1,
        };
      });

      saveStorage(STORAGE_KEYS.CONVERSATIONS, updatedConversations);
      set({ conversations: updatedConversations });

      // Simulated auto-response from seller if message was sent by buyer
      if (!isSeller) {
        setTimeout(() => {
          const autoReplies = [
            'Thanks for the message! Yes, the item is completely genuine and well cared for. Feel free to inspect in person or make an offer.',
            'Hi! Happy to answer any questions or share more photos if you would like.',
            'I can arrange same-day delivery or quick pickup near Indiranagar if that works for you!',
          ];
          const randomReply = autoReplies[Math.floor(Math.random() * autoReplies.length)];

          const sellerMsg: ChatMessage = {
            id: `msg-reply-${Date.now()}`,
            senderId: 'seller-demo',
            senderName: 'Seller Response',
            senderRole: 'seller',
            text: randomReply,
            timestamp: 'Just now',
          };

          const withReply = get().conversations.map((conv) => {
            if (conv.id !== conversationId) return conv;
            return {
              ...conv,
              lastMessage: randomReply,
              lastMessageTimestamp: 'Just now',
              messages: [...conv.messages, sellerMsg],
            };
          });

          saveStorage(STORAGE_KEYS.CONVERSATIONS, withReply);
          set({ conversations: withReply });
        }, 1500);
      }
    },

    createOrOpenConversation: (productId, sellerId, initialOffer) => {
      const state = get();
      const product = state.products.find((p) => p.id === productId);
      const seller = state.sellers.find((s) => s.id === sellerId) || {
        id: sellerId,
        name: product?.sellerName || 'Verified Seller',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      };

      const existing = state.conversations.find((c) => c.productId === productId && c.sellerId === sellerId);
      if (existing) {
        return existing.id;
      }

      const convId = `conv-${Date.now()}`;
      const newConv: Conversation = {
        id: convId,
        productId,
        productTitle: product?.title || 'Marketplace Item',
        productImage: product?.coverImage || product?.images[0] || '',
        productPrice: product?.price || 0,
        buyerId: state.currentUser.id,
        buyerName: state.currentUser.name,
        buyerAvatar: state.currentUser.avatar,
        sellerId: seller.id,
        sellerName: seller.name,
        sellerAvatar: seller.avatar,
        isSellerOnline: true,
        lastMessage: initialOffer ? `Made an offer of ₹${initialOffer.toLocaleString('en-IN')}` : 'Started a conversation',
        lastMessageTimestamp: 'Just now',
        unreadCountBuyer: 0,
        unreadCountSeller: 1,
        messages: [
          {
            id: `msg-${Date.now()}`,
            senderId: state.currentUser.id,
            senderName: state.currentUser.name,
            senderRole: 'buyer',
            text: initialOffer 
              ? `Hi! I am interested in your ${product?.title}. I would like to offer ₹${initialOffer.toLocaleString('en-IN')}. Is this acceptable?`
              : `Hi! Is your listing for ${product?.title} still available?`,
            timestamp: 'Just now',
          },
        ],
      };

      if (initialOffer && product) {
        newConv.activeOffer = {
          id: `off-${Date.now()}`,
          productId: product.id,
          productTitle: product.title,
          productImage: product.coverImage,
          listingPrice: product.price,
          offeredPrice: initialOffer,
          buyerId: state.currentUser.id,
          buyerName: state.currentUser.name,
          sellerId: seller.id,
          sellerName: seller.name,
          status: 'Pending',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          message: `Offer of ₹${initialOffer.toLocaleString('en-IN')} proposed.`,
        };
      }

      const next = [newConv, ...state.conversations];
      saveStorage(STORAGE_KEYS.CONVERSATIONS, next);
      set({ conversations: next });
      return convId;
    },

    markConversationAsRead: (conversationId) => {
      const updated = get().conversations.map((c) => {
        if (c.id !== conversationId) return c;
        return { ...c, unreadCountBuyer: 0, unreadCountSeller: 0 };
      });
      saveStorage(STORAGE_KEYS.CONVERSATIONS, updated);
      set({ conversations: updated });
    },

    // Price Offers
    makeOffer: (productId, offeredPrice, message) => {
      const state = get();
      const product = state.products.find((p) => p.id === productId);
      if (!product) throw new Error('Product not found');

      const offer: PriceOffer = {
        id: `off-${Date.now()}`,
        productId,
        productTitle: product.title,
        productImage: product.coverImage,
        listingPrice: product.price,
        offeredPrice,
        buyerId: state.currentUser.id,
        buyerName: state.currentUser.name,
        sellerId: product.sellerId,
        sellerName: product.sellerName,
        status: 'Pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        message,
      };

      // Open conversation or link to existing
      const convId = state.createOrOpenConversation(productId, product.sellerId);
      const updatedConversations = get().conversations.map((c) => {
        if (c.id !== convId) return c;
        return {
          ...c,
          activeOffer: offer,
          lastMessage: `Offer submitted: ₹${offeredPrice.toLocaleString('en-IN')}`,
          lastMessageTimestamp: 'Just now',
          messages: [
            ...c.messages,
            {
              id: `msg-${Date.now()}`,
              senderId: state.currentUser.id,
              senderName: state.currentUser.name,
              senderRole: 'buyer' as const,
              text: `Proposed an offer of ₹${offeredPrice.toLocaleString('en-IN')}. ${message || ''}`,
              timestamp: 'Just now',
              offerId: offer.id,
            },
          ],
        };
      });

      saveStorage(STORAGE_KEYS.CONVERSATIONS, updatedConversations);
      set({ conversations: updatedConversations });

      get().addNotification(
        'Offer Submitted',
        `Your offer of ₹${offeredPrice.toLocaleString('en-IN')} for ${product.title} has been sent to the seller.`,
        'offer',
        `/customer/messages?convId=${convId}`
      );

      return offer;
    },

    respondToOffer: (conversationId, offerId, action, counterPrice) => {
      const updated = get().conversations.map((conv) => {
        if (conv.id !== conversationId || !conv.activeOffer) return conv;
        const offer = { ...conv.activeOffer };
        let msgText = '';

        if (action === 'accept') {
          offer.status = 'Accepted';
          msgText = `Offer of ₹${(offer.counterPrice || offer.offeredPrice).toLocaleString('en-IN')} accepted! Buyer can proceed to checkout at the agreed price.`;
        } else if (action === 'reject') {
          offer.status = 'Rejected';
          msgText = `Offer of ₹${offer.offeredPrice.toLocaleString('en-IN')} was declined.`;
        } else if (action === 'counter' && counterPrice) {
          offer.status = 'Countered';
          offer.counterPrice = counterPrice;
          msgText = `Counteroffer proposed: ₹${counterPrice.toLocaleString('en-IN')}.`;
        }

        offer.updatedAt = new Date().toISOString();

        return {
          ...conv,
          activeOffer: offer,
          lastMessage: msgText,
          lastMessageTimestamp: 'Just now',
          messages: [
            ...conv.messages,
            {
              id: `msg-${Date.now()}`,
              senderId: 'seller-demo',
              senderName: 'Arjun Mehta',
              senderRole: 'seller' as const,
              text: msgText,
              timestamp: 'Just now',
              offerId,
            },
          ],
        };
      });

      saveStorage(STORAGE_KEYS.CONVERSATIONS, updated);
      set({ conversations: updated });
    },

    // Verifications
    verifications: loadStorage<VerificationRequest[]>(STORAGE_KEYS.VERIFICATIONS, INITIAL_VERIFICATIONS),
    submitVerification: (req) => {
      const newReq: VerificationRequest = {
        ...req,
        id: `vr-${Date.now()}`,
        status: 'Pending',
        submittedAt: new Date().toISOString(),
      };
      const updated = [newReq, ...get().verifications];
      saveStorage(STORAGE_KEYS.VERIFICATIONS, updated);

      // Update seller verification status to pending
      get().updateSellerVerification(req.sellerId, 'Verification Pending', false);
      set({ verifications: updated });
    },
    updateVerificationStatus: (id, status, notes) => {
      const req = get().verifications.find((v) => v.id === id);
      const isApproved = status === 'Approved';
      if (req) {
        get().updateSellerVerification(
          req.sellerId, 
          isApproved ? 'Verified' : 'Verification Rejected',
          isApproved
        );
      }

      const updated = get().verifications.map((v) => 
        v.id === id ? { ...v, status, notes: notes || v.notes } : v
      );
      saveStorage(STORAGE_KEYS.VERIFICATIONS, updated);
      set({ verifications: updated });
    },

    // Reports
    reports: loadStorage<ReportedItem[]>(STORAGE_KEYS.REPORTS, INITIAL_REPORTS),
    reportItem: (targetType, targetId, targetTitle, reason, details) => {
      const newReport: ReportedItem = {
        id: `rep-${Date.now()}`,
        targetType,
        targetId,
        targetTitle,
        reporterId: get().currentUser.id,
        reporterName: get().currentUser.name,
        reason,
        details,
        status: 'Pending Review',
        createdAt: new Date().toISOString(),
      };
      const updated = [newReport, ...get().reports];
      saveStorage(STORAGE_KEYS.REPORTS, updated);
      set({ reports: updated });
    },
    resolveReport: (id, action) => {
      const updated = get().reports.map((r) => {
        if (r.id !== id) return r;
        return {
          ...r,
          status: action === 'remove' ? ('Resolved - Removed' as const) : ('Resolved - Dismissed' as const),
        };
      });
      saveStorage(STORAGE_KEYS.REPORTS, updated);
      set({ reports: updated });
    },

    // Notifications
    notifications: loadStorage<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS),
    markNotificationAsRead: (id) => {
      const updated = get().notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n));
      saveStorage(STORAGE_KEYS.NOTIFICATIONS, updated);
      set({ notifications: updated });
    },
    markAllNotificationsAsRead: () => {
      const updated = get().notifications.map((n) => ({ ...n, isRead: true }));
      saveStorage(STORAGE_KEYS.NOTIFICATIONS, updated);
      set({ notifications: updated });
    },
    addNotification: (title, description, type, link) => {
      const newNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        userId: get().currentUser.id,
        title,
        description,
        type,
        isRead: false,
        createdAt: 'Just now',
        link,
      };
      const updated = [newNotif, ...get().notifications];
      saveStorage(STORAGE_KEYS.NOTIFICATIONS, updated);
      set({ notifications: updated });
    },

    // Recently Viewed
    recentlyViewed: loadStorage<string[]>(STORAGE_KEYS.RECENTLY_VIEWED, ['prod-iphone-14-pro', 'prod-macbook-pro-14-m2', 'prod-sony-wh1000xm5']),
    recordView: (productId) => {
      const current = get().recentlyViewed.filter((id) => id !== productId);
      const next = [productId, ...current].slice(0, 10);
      saveStorage(STORAGE_KEYS.RECENTLY_VIEWED, next);

      // Increment view counter on product
      const updatedProducts = get().products.map((p) => 
        p.id === productId ? { ...p, views: (p.views || 0) + 1 } : p
      );
      saveStorage(STORAGE_KEYS.PRODUCTS, updatedProducts);

      set({ recentlyViewed: next, products: updatedProducts });
    },

    // Factory Reset
    resetAllDemoData: () => {
      Object.values(STORAGE_KEYS).forEach((k) => {
        localStorage.removeItem(k);
      });
      set({
        products: INITIAL_PRODUCTS,
        sellers: SELLERS,
        currentRole: 'customer',
        wishlist: ['prod-sony-wh1000xm5', 'prod-mid-century-lounge-chair'],
        cart: [],
        orders: INITIAL_ORDERS,
        conversations: INITIAL_CONVERSATIONS,
        notifications: INITIAL_NOTIFICATIONS,
        verifications: INITIAL_VERIFICATIONS,
        reports: INITIAL_REPORTS,
        recentlyViewed: ['prod-iphone-14-pro', 'prod-macbook-pro-14-m2', 'prod-sony-wh1000xm5'],
      });
    },
  };
});
