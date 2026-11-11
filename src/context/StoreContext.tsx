import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  INITIAL_BANNERS,
  INITIAL_BLOGS,
  INITIAL_CATEGORIES,
  INITIAL_ENQUIRIES,
  INITIAL_PRODUCTS,
  INITIAL_SERVICES,
} from '../data/initialData';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import {
  BlogArticle,
  CategoryItem,
  Enquiry,
  EnquiryItem,
  EnquiryStatus,
  Product,
  ProductCategorySlug,
  PromotionalBanner,
  ServiceItem,
  VehicleType,
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
  addBlog: (blog: Omit<BlogArticle, 'id' | 'createdAt'>) => Promise<BlogArticle>;
  updateBlog: (id: string, updates: Partial<BlogArticle>) => Promise<void>;
  deleteBlog: (id: string) => Promise<void>;
  addCategory: (cat: Omit<CategoryItem, 'id'>) => Promise<void>;
  updateCategory: (id: string, updates: Partial<CategoryItem>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  updateBanner: (id: string, updates: Partial<PromotionalBanner>) => Promise<void>;
  updateEnquiryStatus: (id: string, status: EnquiryStatus, adminNotes?: string) => Promise<void>;
  deleteEnquiry: (id: string) => Promise<void>;
  seedInitialDataToSupabase: () => Promise<{
    success: boolean;
    message: string;
    productsCount?: number;
    blogsCount?: number;
  }>;
  refreshData: () => Promise<void>;
  isSupabaseConnected: boolean;
  isLoading: boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'gtz_enquiry_cart_v1';
const ADMIN_TOKEN_KEY = 'gtz_admin_token_v1';

// Helper Mappers between Supabase snake_case rows and Frontend camelCase types
function mapRowToProduct(row: Record<string, any>): Product {
  const categoryName = String(row.category || 'Tyres');
  const slugGuess = (row.category_slug ||
    categoryName.toLowerCase().replace(/\s+/g, '-')) as ProductCategorySlug;
  const specsObj =
    row.specifications && typeof row.specifications === 'object' ? row.specifications : {};
  const tyreSpecsObj =
    row.tyre_specs && typeof row.tyre_specs === 'object' && Object.keys(row.tyre_specs).length > 0
      ? row.tyre_specs
      : specsObj._tyreSpecs || undefined;

  const cleanSpecs: Record<string, string> = {};
  Object.entries(specsObj).forEach(([k, v]) => {
    if (k !== '_tyreSpecs' && k !== '_compatibleModels' && k !== '_visualType' && v !== undefined) {
      cleanSpecs[k] = String(v);
    }
  });

  const contactForPrice = Boolean(row.contact_for_price ?? row.price === null);
  const numericPrice =
    !contactForPrice && row.price !== null && row.price !== undefined ? Number(row.price) : null;

  return {
    id: String(row.id),
    sku: String(row.sku || 'GTZ-SKU'),
    name: String(row.name || ''),
    slug: String(row.slug || row.id),
    brand: String(row.brand || 'Genuine Brand'),
    category: categoryName,
    categorySlug: slugGuess,
    subCategory: String(row.sub_category || categoryName),
    vehicleTypes: Array.isArray(row.vehicle_types)
      ? (row.vehicle_types as VehicleType[])
      : ['Car'],
    compatibleModels: Array.isArray(row.compatible_models)
      ? row.compatible_models
      : Array.isArray(specsObj._compatibleModels)
      ? specsObj._compatibleModels
      : ['All Compatible Models'],
    shortDescription: String(row.short_description || ''),
    description: String(row.full_description || row.short_description || ''),
    price: numericPrice,
    contactForPrice,
    availability: (row.availability as Product['availability']) || 'In Stock',
    featured: Boolean(row.is_featured),
    images:
      Array.isArray(row.images) && row.images.length > 0
        ? row.images
        : ['/assets/aistudio/image_f3b889b3.png'],
    visualType: (row.visual_type ||
      specsObj._visualType ||
      (slugGuess === 'tyres'
        ? 'tyre-car'
        : slugGuess === 'batteries'
        ? 'battery-car'
        : slugGuess === 'alloy-wheels'
        ? 'alloy-wheel'
        : slugGuess === 'audio'
        ? 'speaker'
        : 'tool')) as Product['visualType'],
    tyreSpecs: tyreSpecsObj,
    specifications: cleanSpecs,
    additionalInfo: String(row.additional_info || ''),
    createdAt: String(row.created_at || new Date().toISOString()),
  };
}

function mapProductToRow(product: Partial<Product> & { id?: string }) {
  const contactForPrice =
    product.contactForPrice !== undefined
      ? product.contactForPrice
      : product.price === null || product.price === undefined || product.price <= 0;

  const specsPayload: Record<string, any> = {
    ...(product.specifications || {}),
  };
  if (product.tyreSpecs) {
    specsPayload._tyreSpecs = product.tyreSpecs;
  }
  if (product.compatibleModels) {
    specsPayload._compatibleModels = product.compatibleModels;
  }
  if (product.visualType) {
    specsPayload._visualType = product.visualType;
  }

  return {
    ...(product.id ? { id: product.id } : {}),
    name: product.name,
    slug: product.slug,
    sku: product.sku,
    brand: product.brand,
    category: product.category,
    price: contactForPrice ? null : product.price,
    contact_for_price: contactForPrice,
    availability: product.availability || 'In Stock',
    short_description: product.shortDescription || '',
    full_description: product.description || product.shortDescription || '',
    vehicle_types: product.vehicleTypes || ['Car'],
    specifications: specsPayload,
    images: product.images || ['/assets/aistudio/image_f3b889b3.png'],
    is_featured: Boolean(product.featured),
  };
}

function mapRowToBlog(row: Record<string, any>): BlogArticle {
  const rawContent = row.content;
  const contentArray: string[] = Array.isArray(rawContent)
    ? rawContent
    : typeof rawContent === 'string'
    ? rawContent
        .split(/\n\n+/)
        .map((p: string) => p.trim())
        .filter(Boolean)
    : [];

  return {
    id: String(row.id),
    title: String(row.title || ''),
    slug: String(row.slug || row.id),
    excerpt: String(row.excerpt || ''),
    content: contentArray.length > 0 ? contentArray : [String(row.excerpt || '')],
    image: String(row.featured_image || '/assets/aistudio/image_6aa2fd52.png'),
    author: String(row.author || 'Ghosh Tyre Zone Technical Team'),
    category: String(row.category || 'Tyre Care Guide'),
    publishedAt: String(
      row.published_date ||
        new Date(row.created_at || Date.now()).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })
    ),
    readTime: String(row.read_time || '4 min read'),
    keyTakeaways: Array.isArray(row.key_takeaways)
      ? row.key_takeaways
      : [
          'Genuine automotive products and professional workshop installation in Kolkata.',
          'Regular inspection improves tyre longevity, braking safety, and fuel efficiency.',
        ],
    isPublished: row.is_published !== undefined ? Boolean(row.is_published) : true,
    createdAt: String(row.created_at || new Date().toISOString()),
  };
}

function mapBlogToRow(blog: Partial<BlogArticle> & { id?: string }) {
  const joinedContent = Array.isArray(blog.content)
    ? blog.content.join('\n\n')
    : String(blog.content || '');

  return {
    ...(blog.id ? { id: blog.id } : {}),
    title: blog.title,
    slug: blog.slug,
    excerpt: blog.excerpt || '',
    content: joinedContent,
    featured_image: blog.image || '/assets/aistudio/image_6aa2fd52.png',
    author: blog.author || 'Ghosh Tyre Zone Technical Team',
    category: blog.category || 'Tyre Care Guide',
    published_date:
      blog.publishedAt ||
      new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
    is_published: blog.isPublished !== undefined ? blog.isPublished : true,
  };
}

function mapRowToEnquiry(row: Record<string, any>): Enquiry {
  return {
    id: String(row.id),
    referenceNumber: String(row.reference_no || row.referenceNumber || 'GTZ-2026-0001'),
    type: (row.type as Enquiry['type']) || 'product',
    customerName: String(row.customer_name || row.customerName || ''),
    phone: String(row.phone || ''),
    email: String(row.email || ''),
    city: String(row.city || 'Kolkata'),
    state: String(row.state || 'West Bengal'),
    pincode: String(row.pincode || ''),
    vehicleType: String(row.vehicle_type || row.vehicleType || ''),
    vehicleModel: String(row.vehicle_model || row.vehicleModel || ''),
    serviceName: String(row.service_name || row.serviceName || ''),
    items: Array.isArray(row.items) ? row.items : [],
    message: String(row.message || ''),
    status: (row.status as EnquiryStatus) || 'New',
    adminNotes: String(row.admin_notes || row.adminNotes || ''),
    createdAt: String(row.created_at || row.createdAt || new Date().toISOString()),
  };
}

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<CategoryItem[]>(INITIAL_CATEGORIES);
  const [banners, setBanners] = useState<PromotionalBanner[]>(INITIAL_BANNERS);
  const [enquiries, setEnquiries] = useState<Enquiry[]>(INITIAL_ENQUIRIES);
  const [blogs, setBlogs] = useState<BlogArticle[]>(INITIAL_BLOGS);
  const [services] = useState<ServiceItem[]>(INITIAL_SERVICES);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean>(isSupabaseConfigured);

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

  const refreshData = useCallback(async () => {
    setIsLoading(true);

    // 1. Try loading from local Express server first for categories/banners/fallback
    try {
      const res = await fetch('/api/bootstrap');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.products)) setProducts(data.products);
        if (Array.isArray(data.categories)) setCategories(data.categories);
        if (Array.isArray(data.banners)) setBanners(data.banners);
        if (Array.isArray(data.enquiries)) setEnquiries(data.enquiries);
        if (Array.isArray(data.blogs)) setBlogs(data.blogs);
      }
    } catch {
      // ignore local bootstrap error
    }

    // 2. If Supabase is configured, fetch live rows from Supabase tables
    if (supabase) {
      try {
        const [prodRes, blogRes, enqRes] = await Promise.all([
          supabase.from('products').select('*').order('created_at', { ascending: false }),
          supabase.from('blogs').select('*').order('created_at', { ascending: false }),
          supabase.from('enquiries').select('*').order('created_at', { ascending: false }),
        ]);

        if (!prodRes.error && Array.isArray(prodRes.data) && prodRes.data.length > 0) {
          setProducts(prodRes.data.map(mapRowToProduct));
          setIsSupabaseConnected(true);
        }
        if (!blogRes.error && Array.isArray(blogRes.data) && blogRes.data.length > 0) {
          setBlogs(blogRes.data.map(mapRowToBlog));
          setIsSupabaseConnected(true);
        }
        if (!enqRes.error && Array.isArray(enqRes.data)) {
          if (enqRes.data.length > 0) {
            setEnquiries(enqRes.data.map(mapRowToEnquiry));
          }
          setIsSupabaseConnected(true);
        }
      } catch (err) {
        console.warn('Supabase live fetch warning:', err);
      }
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

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
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const refNo = `GTZ-2026-${randomNum}`;
    const newId = `enq-${Date.now()}`;

    // 1. Insert into Supabase if configured
    if (supabase) {
      try {
        const supabaseRow = {
          id: newId,
          reference_no: refNo,
          customer_name: payload.customerName,
          phone: payload.phone,
          email: payload.email || '',
          city: payload.city || 'Kolkata',
          vehicle_type: payload.vehicleType || '',
          vehicle_model: payload.vehicleModel || '',
          items: payload.items || [],
          message:
            payload.serviceName && !payload.message.includes(payload.serviceName)
              ? `[Service: ${payload.serviceName}] ${payload.message}`
              : payload.message || '',
          status: 'New',
          admin_notes: '',
        };
        const { data, error } = await supabase
          .from('enquiries')
          .insert([supabaseRow])
          .select()
          .single();

        if (!error && data) {
          const mapped = mapRowToEnquiry(data);
          setEnquiries((prev) => [mapped, ...prev]);
          // Also sync to local backend
          fetch('/api/enquiries', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(mapped),
          }).catch(() => {});
          return mapped;
        }
      } catch (err) {
        console.warn('Supabase enquiry insert fallback:', err);
      }
    }

    // 2. Local Backend Fallback
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, id: newId, referenceNumber: refNo }),
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
      id: newId,
      referenceNumber: refNo,
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

  // PRODUCT CRUD (Supabase + Local API Sync)
  const addProduct = async (productData: Omit<Product, 'id' | 'createdAt'>): Promise<Product> => {
    const newId = `prod-${Date.now()}`;
    const fullProduct: Product = {
      ...productData,
      id: newId,
      createdAt: new Date().toISOString(),
    };

    if (supabase) {
      try {
        const row = mapProductToRow(fullProduct);
        const { data, error } = await supabase.from('products').insert([row]).select().single();
        if (!error && data) {
          const created = mapRowToProduct(data);
          setProducts((prev) => [created, ...prev]);
          fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(created),
          }).catch(() => {});
          return created;
        }
      } catch (err) {
        console.warn('Supabase addProduct fallback:', err);
      }
    }

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fullProduct),
      });
      if (res.ok) {
        const created: Product = await res.json();
        setProducts((prev) => [created, ...prev]);
        return created;
      }
    } catch (err) {
      console.warn('Fallback addProduct:', err);
    }

    setProducts((prev) => [fullProduct, ...prev]);
    return fullProduct;
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    let updatedItem: Product | undefined;
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          updatedItem = { ...p, ...updates };
          return updatedItem;
        }
        return p;
      })
    );

    if (supabase && updatedItem) {
      try {
        const row = mapProductToRow(updatedItem);
        await supabase.from('products').update(row).eq('id', id);
      } catch (err) {
        console.warn('Supabase updateProduct warning:', err);
      }
    }

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

    if (supabase) {
      try {
        await supabase.from('products').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase deleteProduct warning:', err);
      }
    }

    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('Fallback deleteProduct:', err);
    }
  };

  // BLOG CRUD (Supabase + Local API Sync)
  const addBlog = async (blogData: Omit<BlogArticle, 'id' | 'createdAt'>): Promise<BlogArticle> => {
    const newId = `blog-${Date.now()}`;
    const fullBlog: BlogArticle = {
      ...blogData,
      id: newId,
      createdAt: new Date().toISOString(),
    };

    if (supabase) {
      try {
        const row = mapBlogToRow(fullBlog);
        const { data, error } = await supabase.from('blogs').insert([row]).select().single();
        if (!error && data) {
          const created = mapRowToBlog(data);
          setBlogs((prev) => [created, ...prev]);
          fetch('/api/blogs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(created),
          }).catch(() => {});
          return created;
        }
      } catch (err) {
        console.warn('Supabase addBlog fallback:', err);
      }
    }

    try {
      const res = await fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fullBlog),
      });
      if (res.ok) {
        const created: BlogArticle = await res.json();
        setBlogs((prev) => [created, ...prev]);
        return created;
      }
    } catch (err) {
      console.warn('Fallback addBlog:', err);
    }

    setBlogs((prev) => [fullBlog, ...prev]);
    return fullBlog;
  };

  const updateBlog = async (id: string, updates: Partial<BlogArticle>) => {
    let updatedBlog: BlogArticle | undefined;
    setBlogs((prev) =>
      prev.map((b) => {
        if (b.id === id) {
          updatedBlog = { ...b, ...updates };
          return updatedBlog;
        }
        return b;
      })
    );

    if (supabase && updatedBlog) {
      try {
        const row = mapBlogToRow(updatedBlog);
        await supabase.from('blogs').update(row).eq('id', id);
      } catch (err) {
        console.warn('Supabase updateBlog warning:', err);
      }
    }

    try {
      await fetch(`/api/blogs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
    } catch (err) {
      console.warn('Fallback updateBlog:', err);
    }
  };

  const deleteBlog = async (id: string) => {
    setBlogs((prev) => prev.filter((b) => b.id !== id));

    if (supabase) {
      try {
        await supabase.from('blogs').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase deleteBlog warning:', err);
      }
    }

    try {
      await fetch(`/api/blogs/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('Fallback deleteBlog:', err);
    }
  };

  // CATEGORIES CRUD
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

  // ENQUIRY STATUS & NOTES UPDATE
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

    if (supabase) {
      try {
        await supabase
          .from('enquiries')
          .update({
            status,
            ...(adminNotes !== undefined ? { admin_notes: adminNotes } : {}),
          })
          .eq('id', id);
      } catch (err) {
        console.warn('Supabase updateEnquiryStatus warning:', err);
      }
    }

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

    if (supabase) {
      try {
        await supabase.from('enquiries').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase deleteEnquiry warning:', err);
      }
    }

    try {
      await fetch(`/api/enquiries/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('Fallback deleteEnquiry:', err);
    }
  };

  // 1-CLICK SEED INITIAL DATA TO SUPABASE
  const seedInitialDataToSupabase = async (): Promise<{
    success: boolean;
    message: string;
    productsCount?: number;
    blogsCount?: number;
  }> => {
    if (!supabase) {
      return {
        success: false,
        message:
          'Supabase environment variables (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY) are not configured yet. Please add them and run supabase_schema.sql in your Supabase SQL Editor.',
      };
    }

    try {
      const productRows = INITIAL_PRODUCTS.map((p) => mapProductToRow(p));
      const blogRows = INITIAL_BLOGS.map((b) => mapBlogToRow(b));

      const { error: prodErr } = await supabase
        .from('products')
        .upsert(productRows, { onConflict: 'slug' });

      if (prodErr) {
        return {
          success: false,
          message: `Failed to seed products table: ${prodErr.message}. Make sure you have executed supabase_schema.sql in your Supabase SQL Editor.`,
        };
      }

      const { error: blogErr } = await supabase
        .from('blogs')
        .upsert(blogRows, { onConflict: 'slug' });

      if (blogErr) {
        return {
          success: false,
          message: `Products seeded, but blogs table returned: ${blogErr.message}. Make sure you have executed supabase_schema.sql.`,
        };
      }

      await refreshData();
      return {
        success: true,
        message: `Successfully seeded ${productRows.length} sample products and ${blogRows.length} blog posts into your live Supabase database!`,
        productsCount: productRows.length,
        blogsCount: blogRows.length,
      };
    } catch (err: any) {
      return {
        success: false,
        message: err?.message || 'Unexpected error while seeding Supabase.',
      };
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
        addBlog,
        updateBlog,
        deleteBlog,
        addCategory,
        updateCategory,
        deleteCategory,
        updateBanner,
        updateEnquiryStatus,
        deleteEnquiry,
        seedInitialDataToSupabase,
        refreshData,
        isSupabaseConnected,
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
