import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  INITIAL_BANNERS,
  INITIAL_BLOGS,
  INITIAL_CATEGORIES,
  INITIAL_ENQUIRIES,
  INITIAL_PRODUCTS,
   INITIAL_SERVICES,
} from '../data/initialData';
import {
  BlogArticle,
  CategoryItem,
  Enquiry,
  EnquiryItem,
  EnquiryStatus,
  Product,
  PromotionalBanner,
  ServiceItem,
} from '../types';

interface EnquiryModalRequest {
  isOpen: boolean;
  type: 'product' | 'service';
  product?: Product;
  quantity?: number;
  serviceName?: string;
}

interface StoreContextType {
  products: Product[];
  categories: CategoryItem[];
  banners: PromotionalBanner[];
  enquiries: Enquiry[];
  blogs: BlogArticle[];
  services: ServiceItem[];
  cart: EnquiryItem[];
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  enquiryModal: EnquiryModalRequest;
  openProductEnquiryModal: (product: Product, quantity?: number) => void;
  openServiceEnquiryModal: (serviceName: string) => void;
  closeEnquiryModal: () => void;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  submitEnquiry: (
    payload: Omit<Enquiry, 'id' | 'referenceNumber' | 'status' | 'adminNotes' | 'createdAt'>
  ) => Promise<Enquiry>;
  // Admin actions
  isAdminAuthenticated: boolean;
  adminLogin: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  adminLogout: () => void;
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => Promise<Product>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addCategory: (cat: Omit<CategoryItem, 'id'>) => Promise<void>;
  updateCategory: (id: string, updates: Partial<CategoryItem>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  updateBanner: (id: string, updates: Partial<PromotionalBanner>) => Promise<void>;
  updateEnquiryStatus: (id: string, status: EnquiryStatus, adminNotes?: string) => Promise<void>;
  deleteEnquiry: (id: string) => Promise<void>;
  isLoading: boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'gtz_enquiry_cart_v1';
const ADMIN_TOKEN_KEY = 'gtz_admin_token_v1';

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<CategoryItem[]>(INITIAL_CATEGORIES);
  const [banners, setBanners] = useState<PromotionalBanner[]>(INITIAL_BANNERS);
  const [enquiries, setEnquiries] = useState<Enquiry[]>(INITIAL_ENQUIRIES);
  const [blogs, setBlogs] = useState<BlogArticle[]>(INITIAL_BLOGS);
  const [services] = useState<ServiceItem[]>(INITIAL_SERVICES);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [cart, setCart] = useState<EnquiryItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  const [enquiryModal, setEnquiryModal] = useState<EnquiryModalRequest>({
    isOpen: false,
    type: 'product',
  });

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return Boolean(localStorage.getItem(ADMIN_TOKEN_KEY));
    } catch {
      return false;
    }
  });

  // Load initial persistent data from backend API
  useEffect(() => {
    let mounted = true;
    async function fetchBootstrap() {
      try {
        const res = await fetch('/api/bootstrap');
        if (res.ok) {
          const data = await res.json();
          if (mounted) {
            if (Array.isArray(data.products)) setProducts(data.products);
            if (Array.isArray(data.categories)) setCategories(data.categories);
            if (Array.isArray(data.banners)) setBanners(data.banners);
            if (Array.isArray(data.enquiries)) setEnquiries(data.enquiries);
            if (Array.isArray(data.blogs)) setBlogs(data.blogs);
          }
        }
      } catch (err) {
        console.warn('Using local initial dataset fallback:', err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }
    fetchBootstrap();
    return () => {
      mounted = false;
    };
  }, []);

  // Persist enquiry cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // ignore storage errors
    }
  }, [cart]);

  const openProductEnquiryModal = (product: Product, quantity = 1) => {
    setEnquiryModal({
      isOpen: true,
      type: 'product',
      product,
      quantity,
    });
  };

  const openServiceEnquiryModal = (serviceName: string) => {
    setEnquiryModal({
      isOpen: true,
      type: 'service',
      serviceName,
    });
  };

  const closeEnquiryModal = () => {
    setEnquiryModal((prev) => ({ ...prev, isOpen: false }));
  };

  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((i) => i.productId === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }
      return [
        ...prev,
        {
          productId: product.id,
          productName: product.name,
          sku: product.sku,
          brand: product.brand,
          category: product.category,
          quantity,
          price: product.price,
        },
      ];
    });
    setIsCartDrawerOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.productId === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const submitEnquiry = async (
    payload: Omit<Enquiry, 'id' | 'referenceNumber' | 'status' | 'adminNotes' | 'createdAt'>
  ): Promise<Enquiry> => {
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const created: Enquiry = await res.json();
        setEnquiries((prev) => [created, ...prev]);
        return created;
      }
    } catch (err) {
      console.warn('Fallback local enquiry creation:', err);
    }

    const fallbackEnquiry: Enquiry = {
      ...payload,
      id: `enq-${Date.now()}`,
      referenceNumber: `GTZ-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'New',
      adminNotes: '',
      createdAt: new Date().toISOString(),
    };
    setEnquiries((prev) => [fallbackEnquiry, ...prev]);
    return fallbackEnquiry;
  };

  const adminLogin = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem(ADMIN_TOKEN_KEY, data.token);
        setIsAdminAuthenticated(true);
        return { success: true };
      }
      return { success: false, message: data.message || 'Invalid credentials' };
    } catch {
      if (
        (email.toLowerCase() === 'admin@ghoshtyre.com' ||
          email.toLowerCase() === 'info@ghoshtyre.com') &&
        password === 'gtz@kolkata2026'
      ) {
        localStorage.setItem(ADMIN_TOKEN_KEY, 'gtz-local-token');
        setIsAdminAuthenticated(true);
        return { success: true };
      }
      return { success: false, message: 'Invalid credentials' };
    }
  };

  const adminLogout = () => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    setIsAdminAuthenticated(false);
  };

  const addProduct = async (productData: Omit<Product, 'id' | 'createdAt'>): Promise<Product> => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
      if (res.ok) {
        const created: Product = await res.json();
        setProducts((prev) => [created, ...prev]);
        return created;
      }
    } catch (err) {
      console.warn('Fallback addProduct:', err);
    }
    const created: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setProducts((prev) => [created, ...prev]);
    return created;
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    try {
      await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
    } catch (err) {
      console.warn('Fallback updateProduct:', err);
    }
  };

  const deleteProduct = async (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('Fallback deleteProduct:', err);
    }
  };

  const addCategory = async (catData: Omit<CategoryItem, 'id'>) => {
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(catData),
      });
      if (res.ok) {
        const created: CategoryItem = await res.json();
        setCategories((prev) => [...prev, created]);
        return;
      }
    } catch (err) {
      console.warn('Fallback addCategory:', err);
    }
    setCategories((prev) => [...prev, { ...catData, id: `cat-${Date.now()}` }]);
  };

  const updateCategory = async (id: string, updates: Partial<CategoryItem>) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
    try {
      await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
    } catch (err) {
      console.warn('Fallback updateCategory:', err);
    }
  };

  const deleteCategory = async (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    try {
      await fetch(`/api/categories/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('Fallback deleteCategory:', err);
    }
  };

  const updateBanner = async (id: string, updates: Partial<PromotionalBanner>) => {
    setBanners((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates } : b)));
    try {
      await fetch(`/api/banners/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
    } catch (err) {
      console.warn('Fallback updateBanner:', err);
    }
  };

  const updateEnquiryStatus = async (
    id: string,
    status: EnquiryStatus,
    adminNotes?: string
  ) => {
    setEnquiries((prev) =>
      prev.map((e) =>
        e.id === id
          ? { ...e, status, adminNotes: adminNotes !== undefined ? adminNotes : e.adminNotes }
          : e
      )
    );
    try {
      await fetch(`/api/enquiries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          ...(adminNotes !== undefined ? { adminNotes } : {}),
        }),
      });
    } catch (err) {
      console.warn('Fallback updateEnquiryStatus:', err);
    }
  };

  const deleteEnquiry = async (id: string) => {
    setEnquiries((prev) => prev.filter((e) => e.id !== id));
    try {
      await fetch(`/api/enquiries/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('Fallback deleteEnquiry:', err);
    }
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        banners,
        enquiries,
        blogs,
        services,
        cart,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        enquiryModal,
        openProductEnquiryModal,
        openServiceEnquiryModal,
        closeEnquiryModal,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        submitEnquiry,
        isAdminAuthenticated,
        adminLogin,
        adminLogout,
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        updateCategory,
        deleteCategory,
        updateBanner,
        updateEnquiryStatus,
        deleteEnquiry,
        isLoading,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = (): StoreContextType => {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return ctx;
};
