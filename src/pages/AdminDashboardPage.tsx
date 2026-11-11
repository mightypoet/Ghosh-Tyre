import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  Database,
  Download,
  Edit3,
  ExternalLink,
  Eye,
  FolderKanban,
  ImagePlus,
  LayoutDashboard,
  Lock,
  LogOut,
  Megaphone,
  MessageCircle,
  Package,
  Phone,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { uploadImageToSupabase } from '../lib/supabase';
import {
  BlogArticle,
  CategoryItem,
  Enquiry,
  EnquiryStatus,
  Product,
  ProductCategorySlug,
  VehicleType,
} from '../types';
import { getWhatsAppUrl } from '../utils/whatsapp';

const ALL_VEHICLE_TYPES: VehicleType[] = [
  'Car',
  'SUV',
  'Hatchback',
  'Sedan',
  'Two Wheeler',
  'Commercial Vehicle',
];

const CATEGORY_OPTIONS: { label: string; slug: ProductCategorySlug }[] = [
  { label: 'Tyres', slug: 'tyres' },
  { label: 'Batteries', slug: 'batteries' },
  { label: 'Alloy Wheels', slug: 'alloy-wheels' },
  { label: 'Audio', slug: 'audio' },
  { label: 'Detailing', slug: 'detailing' },
  { label: 'Interior', slug: 'interior' },
  { label: 'Exterior', slug: 'exterior' },
  { label: 'Parts', slug: 'parts' },
  { label: 'Tools', slug: 'tools' },
  { label: 'Accessories', slug: 'accessories' },
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export const AdminDashboardPage: React.FC = () => {
  const {
    products,
    categories,
    banners,
    enquiries,
    blogs,
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
  } = useStore();

  // Login State
  const [loginEmail, setLoginEmail] = useState('admin@ghoshtyre.com');
  const [loginPassword, setLoginPassword] = useState('gtz@kolkata2026');
  const [loginError, setLoginError] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    'overview' | 'products' | 'blogs' | 'enquiries' | 'categories' | 'banners'
  >('overview');

  // Seed / Status Notification Banner
  const [statusBanner, setStatusBanner] = useState<{
    type: 'success' | 'error' | 'info';
    text: string;
  } | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Product Management Filters
  const [prodSearchQuery, setProdSearchQuery] = useState('');
  const [prodFilterCategory, setProdFilterCategory] = useState('all');

  // Product Form Modal State
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const [prodName, setProdName] = useState('');
  const [prodSlug, setProdSlug] = useState('');
  const [prodSku, setProdSku] = useState('');
  const [prodBrand, setProdBrand] = useState('Michelin');
  const [prodCategorySlug, setProdCategorySlug] = useState<ProductCategorySlug>('tyres');
  const [prodSubCategory, setProdSubCategory] = useState('Car Tyres');
  const [prodVehicles, setProdVehicles] = useState<VehicleType[]>(['Car']);
  const [prodModels, setProdModels] = useState('Maruti Swift, Hyundai i20, Honda City');
  const [prodShortDesc, setProdShortDesc] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodContactForPrice, setProdContactForPrice] = useState(true);
  const [prodPrice, setProdPrice] = useState<string>('');
  const [prodAvailability, setProdAvailability] = useState<Product['availability']>('In Stock');
  const [prodFeatured, setProdFeatured] = useState(true);
  const [prodVisualType, setProdVisualType] = useState<Product['visualType']>('tyre-car');
  const [prodImages, setProdImages] = useState<string[]>(['/assets/aistudio/image_f3b889b3.png']);
  const [newImageUrlInput, setNewImageUrlInput] = useState('');
  const [isUploadingProdImg, setIsUploadingProdImg] = useState(false);

  // Dynamic Key-Value Specifications
  const [specRows, setSpecRows] = useState<{ key: string; value: string }[]>([
    { key: 'Warranty', value: 'Manufacturer Standard Warranty' },
    { key: 'Installation', value: 'Available at Ghosh Tyre Zone Workshop, Kolkata' },
  ]);

  // Tyre Specs
  const [tyreWidth, setTyreWidth] = useState('');
  const [tyreAspect, setTyreAspect] = useState('');
  const [tyreRim, setTyreRim] = useState('');
  const [tyreSpeed, setTyreSpeed] = useState('');
  const [tyreLoad, setTyreLoad] = useState('');

  // Blog Management State
  const [blogSearchQuery, setBlogSearchQuery] = useState('');
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogArticle | null>(null);
  const [blogToDelete, setBlogToDelete] = useState<BlogArticle | null>(null);

  const [blogTitle, setBlogTitle] = useState('');
  const [blogSlug, setBlogSlug] = useState('');
  const [blogCategory, setBlogCategory] = useState('Tyre Care Guide');
  const [blogAuthor, setBlogAuthor] = useState('Ghosh Tyre Zone Technical Team');
  const [blogPublishedDate, setBlogPublishedDate] = useState('');
  const [blogReadTime, setBlogReadTime] = useState('4 min read');
  const [blogExcerpt, setBlogExcerpt] = useState('');
  const [blogContentText, setBlogContentText] = useState('');
  const [blogTakeawaysText, setBlogTakeawaysText] = useState('');
  const [blogFeaturedImage, setBlogFeaturedImage] = useState('/assets/aistudio/image_6aa2fd52.png');
  const [blogIsPublished, setBlogIsPublished] = useState(true);
  const [isUploadingBlogImg, setIsUploadingBlogImg] = useState(false);

  // Enquiry Management Filters & Detail Modal
  const [enqSearchQuery, setEnqSearchQuery] = useState('');
  const [enqStatusFilter, setEnqStatusFilter] = useState<string>('all');
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [notesInput, setNotesInput] = useState('');

  // Category Form State
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [catName, setCatName] = useState('');
  const [catShortName, setCatShortName] = useState('');
  const [catSlug, setCatSlug] = useState<ProductCategorySlug>('accessories');
  const [catDesc, setCatDesc] = useState('');
  const [catVisual, setCatVisual] = useState('accessories');
  const [catFeatured, setCatFeatured] = useState(true);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const res = await adminLogin(loginEmail, loginPassword);
    if (!res.success) {
      setLoginError(res.message || 'Invalid credentials');
    }
  };

  const filteredProductsList = useMemo(() => {
    return products.filter((p) => {
      if (prodFilterCategory !== 'all' && p.categorySlug !== prodFilterCategory) {
        return false;
      }
      if (prodSearchQuery.trim()) {
        const q = prodSearchQuery.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [products, prodFilterCategory, prodSearchQuery]);

  const filteredBlogsList = useMemo(() => {
    return blogs.filter((b) => {
      if (blogSearchQuery.trim()) {
        const q = blogSearchQuery.toLowerCase();
        return (
          b.title.toLowerCase().includes(q) ||
          b.category.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [blogs, blogSearchQuery]);

  const filteredEnquiriesList = useMemo(() => {
    return enquiries.filter((e) => {
      if (enqStatusFilter !== 'all' && e.status !== enqStatusFilter) {
        return false;
      }
      if (enqSearchQuery.trim()) {
        const q = enqSearchQuery.toLowerCase();
        return (
          e.customerName.toLowerCase().includes(q) ||
          e.phone.toLowerCase().includes(q) ||
          e.referenceNumber.toLowerCase().includes(q) ||
          (e.email || '').toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [enquiries, enqStatusFilter, enqSearchQuery]);

  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-[80vh] bg-[#14151B] flex items-center justify-center p-4">
        <div className="bg-[#1C1D24] border border-white/15 rounded-2xl max-w-md w-full p-8 space-y-6 shadow-2xl">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-[#F10D17]/15 text-[#F10D17] flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="font-display text-2xl font-bold text-white uppercase">
              Ghosh Tyre Zone · Admin Portal
            </h1>
            <p className="text-xs text-[#B8BBC4]">
              Secure Supabase & Storefront Content Management System
            </p>
          </div>

          {loginError && (
            <div className="p-3 rounded-lg bg-[#F10D17]/20 border border-[#F10D17] text-xs text-white">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#B8BBC4] mb-1">Admin Email</label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full bg-[#14151B] border border-white/15 rounded-lg px-3.5 py-2.5 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#B8BBC4] mb-1">Password</label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full bg-[#14151B] border border-white/15 rounded-lg px-3.5 py-2.5 text-sm text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#F10D17] hover:bg-[#d10b14] text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Sign In to Admin Dashboard
            </button>
          </form>

          <div className="p-3.5 rounded-xl bg-[#14151B] border border-white/10 text-xs text-[#B8BBC4] space-y-1">
            <span className="text-white font-semibold block">Default Store Admin Credentials:</span>
            <p className="font-mono-num">Email: admin@ghoshtyre.com</p>
            <p className="font-mono-num">Password: gtz@kolkata2026</p>
          </div>
        </div>
      </div>
    );
  }

  // Real-time KPI Metrics
  const totalProducts = products.length;
  const totalBlogs = blogs.length;
  const totalEnquiries = enquiries.length;
  const newOrPendingEnquiries = enquiries.filter(
    (e) => e.status === 'New' || e.status === 'Contacted' || e.status === 'In Progress'
  ).length;
  const resolvedEnquiries = enquiries.filter((e) => e.status === 'Completed').length;

  // Seed Handler
  const handleSeedSupabase = async () => {
    setIsSeeding(true);
    setStatusBanner({
      type: 'info',
      text: 'Pushing 24 sample products and 6 blog posts to Supabase...',
    });
    const result = await seedInitialDataToSupabase();
    setStatusBanner({
      type: result.success ? 'success' : 'error',
      text: result.message,
    });
    setIsSeeding(false);
  };

  const handleRefreshLive = async () => {
    setIsRefreshing(true);
    await refreshData();
    setStatusBanner({
      type: 'success',
      text: 'Synchronized latest products, blogs, and enquiries!',
    });
    setIsRefreshing(false);
  };

  // PRODUCT FORM HANDLERS
  const openAddProductModal = () => {
    setEditingProduct(null);
    setProdName('');
    setProdSlug('');
    setProdSku(`GTZ-PRD-${Math.floor(100 + Math.random() * 900)}`);
    setProdBrand('Michelin');
    setProdCategorySlug('tyres');
    setProdSubCategory('Car Tyres');
    setProdVehicles(['Car']);
    setProdModels('Maruti Swift, Hyundai i20, Honda City');
    setProdShortDesc('');
    setProdDesc('');
    setProdContactForPrice(true);
    setProdPrice('');
    setProdAvailability('In Stock');
    setProdFeatured(true);
    setProdVisualType('tyre-car');
    setProdImages(['/assets/aistudio/image_f3b889b3.png']);
    setNewImageUrlInput('');
    setSpecRows([
      { key: 'Construction', value: 'Tubeless Radial' },
      { key: 'Fitment', value: 'Available at Ghosh Tyre Zone Workshop, Kolkata' },
    ]);
    setTyreWidth('195');
    setTyreAspect('55');
    setTyreRim('R16');
    setTyreSpeed('V');
    setTyreLoad('87');
    setShowProductForm(true);
  };

  const openEditProductModal = (p: Product) => {
    setEditingProduct(p);
    setProdName(p.name);
    setProdSlug(p.slug);
    setProdSku(p.sku);
    setProdBrand(p.brand);
    setProdCategorySlug(p.categorySlug);
    setProdSubCategory(p.subCategory);
    setProdVehicles(p.vehicleTypes);
    setProdModels(p.compatibleModels.join(', '));
    setProdShortDesc(p.shortDescription);
    setProdDesc(p.description);
    const isContactPrice =
      p.contactForPrice !== undefined ? p.contactForPrice : p.price === null || p.price <= 0;
    setProdContactForPrice(isContactPrice);
    setProdPrice(p.price !== null && p.price > 0 ? String(p.price) : '');
    setProdAvailability(p.availability);
    setProdFeatured(p.featured);
    setProdVisualType(p.visualType);
    setProdImages(
      p.images && p.images.length > 0 ? [...p.images] : ['/assets/aistudio/image_f3b889b3.png']
    );
    setNewImageUrlInput('');
    const entries = Object.entries(p.specifications || {}).map(([key, value]) => ({
      key,
      value: String(value),
    }));
    setSpecRows(
      entries.length > 0 ? entries : [{ key: 'Brand', value: p.brand }]
    );
    setTyreWidth(p.tyreSpecs?.width || '');
    setTyreAspect(p.tyreSpecs?.aspectRatio || '');
    setTyreRim(p.tyreSpecs?.rimDiameter || '');
    setTyreSpeed(p.tyreSpecs?.speedRating || '');
    setTyreLoad(p.tyreSpecs?.loadIndex || '');
    setShowProductForm(true);
  };

  const handleProductFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingProdImg(true);
    const uploadedUrls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const res = await uploadImageToSupabase(files[i], 'product-images');
      if (res.url) {
        uploadedUrls.push(res.url);
      }
    }
    setProdImages((prev) => [...prev, ...uploadedUrls]);
    setIsUploadingProdImg(false);
    e.target.value = '';
  };

  const handleAddExternalProductImage = () => {
    if (!newImageUrlInput.trim()) return;
    setProdImages((prev) => [...prev, newImageUrlInput.trim()]);
    setNewImageUrlInput('');
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const categoryOption = CATEGORY_OPTIONS.find((c) => c.slug === prodCategorySlug);
    const categoryLabel = categoryOption ? categoryOption.label : 'Tyres';

    const finalSlug =
      prodSlug.trim() ||
      `${slugify(prodName)}-${editingProduct ? '' : Date.now().toString().slice(-3)}`.replace(
        /-$/,
        ''
      );

    const parsedPrice =
      !prodContactForPrice && prodPrice.trim() !== '' ? Number(prodPrice) : null;

    const specsRecord: Record<string, string> = {};
    specRows.forEach((row) => {
      if (row.key.trim() && row.value.trim()) {
        specsRecord[row.key.trim()] = row.value.trim();
      }
    });

    const payload: Omit<Product, 'id' | 'createdAt'> = {
      sku: prodSku.trim() || 'GTZ-NEW',
      name: prodName.trim(),
      slug: finalSlug,
      brand: prodBrand.trim(),
      category: categoryLabel,
      categorySlug: prodCategorySlug,
      subCategory: prodSubCategory.trim() || categoryLabel,
      vehicleTypes: prodVehicles.length > 0 ? prodVehicles : ['Car'],
      compatibleModels: prodModels
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      shortDescription: prodShortDesc.trim(),
      description: prodDesc.trim() || prodShortDesc.trim(),
      price: parsedPrice,
      contactForPrice: prodContactForPrice,
      availability: prodAvailability,
      featured: prodFeatured,
      images:
        prodImages.length > 0 ? prodImages : ['/assets/aistudio/image_f3b889b3.png'],
      visualType: prodVisualType,
      tyreSpecs:
        prodCategorySlug === 'tyres' && tyreWidth
          ? {
              width: tyreWidth,
              aspectRatio: tyreAspect,
              rimDiameter: tyreRim,
              speedRating: tyreSpeed,
              loadIndex: tyreLoad,
            }
          : undefined,
      specifications: specsRecord,
    };

    if (editingProduct) {
      await updateProduct(editingProduct.id, payload);
      setStatusBanner({
        type: 'success',
        text: `Updated product "${payload.name}" in catalogue.`,
      });
    } else {
      await addProduct(payload);
      setStatusBanner({
        type: 'success',
        text: `Created new product "${payload.name}" in catalogue.`,
      });
    }
    setShowProductForm(false);
  };

  // BLOG FORM HANDLERS
  const openAddBlogModal = () => {
    setEditingBlog(null);
    setBlogTitle('');
    setBlogSlug('');
    setBlogCategory('Tyre Care Guide');
    setBlogAuthor('Ghosh Tyre Zone Technical Team');
    setBlogPublishedDate(
      new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    );
    setBlogReadTime('4 min read');
    setBlogExcerpt('');
    setBlogContentText('');
    setBlogTakeawaysText(
      'Always check cold tyre pressure before long drives.\nInspect tread wear indicators and sidewall condition regularly.'
    );
    setBlogFeaturedImage('/assets/aistudio/image_6aa2fd52.png');
    setBlogIsPublished(true);
    setShowBlogForm(true);
  };

  const openEditBlogModal = (b: BlogArticle) => {
    setEditingBlog(b);
    setBlogTitle(b.title);
    setBlogSlug(b.slug);
    setBlogCategory(b.category);
    setBlogAuthor(b.author);
    setBlogPublishedDate(b.publishedAt);
    setBlogReadTime(b.readTime || '4 min read');
    setBlogExcerpt(b.excerpt);
    setBlogContentText((b.content || []).join('\n\n'));
    setBlogTakeawaysText((b.keyTakeaways || []).join('\n'));
    setBlogFeaturedImage(b.image);
    setBlogIsPublished(b.isPublished !== false);
    setShowBlogForm(true);
  };

  const handleBlogFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingBlogImg(true);
    const res = await uploadImageToSupabase(file, 'blog-images');
    if (res.url) {
      setBlogFeaturedImage(res.url);
    }
    setIsUploadingBlogImg(false);
    e.target.value = '';
  };

  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalSlug = blogSlug.trim() || slugify(blogTitle);
    const paragraphs = blogContentText
      .split(/\n\n+/)
      .map((p) => p.trim())
      .filter(Boolean);
    const takeaways = blogTakeawaysText
      .split(/\n+/)
      .map((t) => t.trim())
      .filter(Boolean);

    const payload: Omit<BlogArticle, 'id' | 'createdAt'> = {
      title: blogTitle.trim(),
      slug: finalSlug,
      category: blogCategory.trim() || 'Tyre Care Guide',
      author: blogAuthor.trim() || 'Ghosh Tyre Zone Technical Team',
      publishedAt: blogPublishedDate.trim() || 'November 2026',
      readTime: blogReadTime.trim() || '4 min read',
      excerpt: blogExcerpt.trim(),
      content: paragraphs.length > 0 ? paragraphs : [blogExcerpt.trim()],
      keyTakeaways:
        takeaways.length > 0
          ? takeaways
          : ['Expert automotive care and genuine products at Ghosh Tyre Zone, Kolkata.'],
      image: blogFeaturedImage.trim() || '/assets/aistudio/image_6aa2fd52.png',
      isPublished: blogIsPublished,
    };

    if (editingBlog) {
      await updateBlog(editingBlog.id, payload);
      setStatusBanner({
        type: 'success',
        text: `Updated blog post "${payload.title}".`,
      });
    } else {
      await addBlog(payload);
      setStatusBanner({
        type: 'success',
        text: `Published new blog post "${payload.title}".`,
      });
    }
    setShowBlogForm(false);
  };

  // CATEGORY FORM SAVE
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Omit<CategoryItem, 'id'> = {
      name: catName.trim(),
      shortName: catShortName.trim() || catName.trim(),
      slug: catSlug,
      description: catDesc.trim(),
      image: '/assets/aistudio/image_f3b889b3.png',
      visualType: catVisual,
      featuredOnHome: catFeatured,
    };
    if (editingCategory) {
      await updateCategory(editingCategory.id, payload);
    } else {
      await addCategory(payload);
    }
    setShowCategoryForm(false);
  };

  // CSV Export for Enquiries
  const exportEnquiriesToCsv = () => {
    const headers = [
      'Reference ID',
      'Date',
      'Customer Name',
      'Phone',
      'Email',
      'City',
      'Vehicle',
      'Products / Service',
      'Status',
      'Customer Message',
      'Admin Notes',
    ];
    const rows = enquiries.map((enq) => {
      const prodSummary =
        enq.items.length > 0
          ? enq.items.map((i) => `${i.productName} (x${i.quantity})`).join('; ')
          : enq.serviceName || 'General Contact';
      return [
        enq.referenceNumber,
        new Date(enq.createdAt).toLocaleDateString('en-IN'),
        `"${enq.customerName.replace(/"/g, '""')}"`,
        `"${enq.phone}"`,
        `"${enq.email}"`,
        `"${enq.city}"`,
        `"${enq.vehicleType || ''} ${enq.vehicleModel || ''}"`,
        `"${prodSummary.replace(/"/g, '""')}"`,
        enq.status,
        `"${(enq.message || '').replace(/"/g, '""')}"`,
        `"${(enq.adminNotes || '').replace(/"/g, '""')}"`,
      ].join(',');
    });
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ghosh-tyre-zone-enquiries-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#14151B] pb-16">
      {/* Top Bar */}
      <div className="bg-[#1C1D24] border-b border-white/10 py-6">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#F10D17]/15 text-[#F10D17] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="font-display text-2xl font-bold text-white uppercase">
                  Ghosh Tyre Zone · Admin Portal
                </h1>
                <span className="text-[11px] font-medium text-[#B8BBC4]">
                  · {isSupabaseConnected ? 'Supabase Live Sync Active' : 'Local Backend Mode'}
                </span>
              </div>
              <p className="text-xs text-[#B8BBC4]">
                Manage Products, Blogs, Categories, Banners & Visitor Enquiries
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleSeedSupabase}
              disabled={isSeeding}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#14151B] hover:bg-white/10 border border-white/15 text-xs font-semibold text-white cursor-pointer"
            >
              <Database className="w-3.5 h-3.5 text-[#FACC15]" />
              <span>{isSeeding ? 'Seeding...' : 'Seed Initial Data to Supabase'}</span>
            </button>

            <button
              type="button"
              onClick={handleRefreshLive}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#14151B] hover:bg-white/10 border border-white/15 text-xs font-semibold text-white cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#F10D17] ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Sync</span>
            </button>

            <button
              type="button"
              onClick={exportEnquiriesToCsv}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#14151B] hover:bg-white/10 border border-white/15 text-xs font-semibold text-white cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#F10D17]" />
              <span>Export CSV</span>
            </button>

            <button
              type="button"
              onClick={adminLogout}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#F10D17]/20 hover:bg-[#F10D17] border border-[#F10D17]/50 text-xs font-semibold text-white transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Status Banner */}
        {statusBanner && (
          <div
            className={`mb-6 p-4 rounded-xl border flex items-center justify-between gap-3 text-xs ${
              statusBanner.type === 'success'
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200'
                : statusBanner.type === 'error'
                ? 'bg-[#F10D17]/15 border-[#F10D17]/50 text-white'
                : 'bg-blue-500/15 border-blue-500/40 text-blue-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {statusBanner.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-[#FACC15] shrink-0" />
              )}
              <span>{statusBanner.text}</span>
            </div>
            <button
              type="button"
              onClick={() => setStatusBanner(null)}
              className="text-white/70 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4">
          {[
            { id: 'overview', label: '1. Dashboard Overview', icon: LayoutDashboard },
            { id: 'products', label: `2. Product Management (${totalProducts})`, icon: Package },
            { id: 'blogs', label: `3. Blog Management (${totalBlogs})`, icon: BookOpen },
            {
              id: 'enquiries',
              label: `4. Visitor Enquiries (${totalEnquiries})`,
              icon: MessageCircle,
            },
            { id: 'categories', label: `Categories (${categories.length})`, icon: FolderKanban },
            { id: 'banners', label: 'Promo Banners', icon: Megaphone },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                activeTab === tab.id
                  ? 'bg-[#F10D17] text-white'
                  : 'bg-[#1C1D24] text-[#B8BBC4] hover:text-white border border-white/10'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* =====================================================================
            TAB 1: DASHBOARD OVERVIEW
           ===================================================================== */}
        {activeTab === 'overview' && (
          <div className="pt-8 space-y-8">
            {/* 5 Real-Time KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="p-5 rounded-xl bg-[#1C1D24] border border-white/10">
                <span className="text-xs text-[#B8BBC4] block">Total Products</span>
                <span className="font-mono-num text-3xl font-bold text-white mt-1.5 block">
                  {totalProducts}
                </span>
                <span className="text-[11px] text-[#B8BBC4] mt-1 block">
                  Live in Catalogue
                </span>
              </div>

              <div className="p-5 rounded-xl bg-[#1C1D24] border border-white/10">
                <span className="text-xs text-[#B8BBC4] block">Total Blogs</span>
                <span className="font-mono-num text-3xl font-bold text-white mt-1.5 block">
                  {totalBlogs}
                </span>
                <span className="text-[11px] text-[#B8BBC4] mt-1 block">
                  {blogs.filter((b) => b.isPublished !== false).length} Published Guides
                </span>
              </div>

              <div className="p-5 rounded-xl bg-[#1C1D24] border border-white/10">
                <span className="text-xs text-[#B8BBC4] block">Total Enquiries</span>
                <span className="font-mono-num text-3xl font-bold text-white mt-1.5 block">
                  {totalEnquiries}
                </span>
                <span className="text-[11px] text-[#B8BBC4] mt-1 block">
                  Product, Cart & Contact
                </span>
              </div>

              <div className="p-5 rounded-xl bg-[#1C1D24] border border-white/10">
                <span className="text-xs text-[#FACC15] font-semibold block">
                  New / Pending Enquiries
                </span>
                <span className="font-mono-num text-3xl font-bold text-[#FACC15] mt-1.5 block">
                  {newOrPendingEnquiries}
                </span>
                <span className="text-[11px] text-[#B8BBC4] mt-1 block">
                  Awaiting Follow-up
                </span>
              </div>

              <div className="p-5 rounded-xl bg-[#1C1D24] border border-white/10">
                <span className="text-xs text-emerald-400 font-semibold block">
                  Resolved Enquiries
                </span>
                <span className="font-mono-num text-3xl font-bold text-emerald-400 mt-1.5 block">
                  {resolvedEnquiries}
                </span>
                <span className="text-[11px] text-[#B8BBC4] mt-1 block">
                  Completed Orders
                </span>
              </div>
            </div>

            {/* Quick Action Bar */}
            <div className="bg-[#1C1D24] border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-xl font-bold text-white uppercase">
                  Quick Storefront Actions & Database Seeding
                </h2>
                <p className="text-xs text-[#B8BBC4] mt-1">
                  Add new inventory, publish automotive articles, or seed the 24 initial products
                  and 6 blogs directly into your Supabase tables.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('products');
                    openAddProductModal();
                  }}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#F10D17] hover:bg-[#d10b14] text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Product</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('blogs');
                    openAddBlogModal();
                  }}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#14151B] hover:bg-white/10 border border-white/20 text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-[#F10D17]" />
                  <span>Write New Blog</span>
                </button>

                <button
                  type="button"
                  onClick={handleSeedSupabase}
                  disabled={isSeeding}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#14151B] hover:bg-white/10 border border-[#FACC15]/40 text-[#FACC15] text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  <Database className="w-4 h-4" />
                  <span>{isSeeding ? 'Seeding Database...' : 'Seed 24 Products & 6 Blogs'}</span>
                </button>
              </div>
            </div>

            {/* Recent Enquiries Table */}
            <div className="bg-[#1C1D24] border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-xl font-bold text-white uppercase">
                  Latest Visitor Enquiries
                </h2>
                <button
                  type="button"
                  onClick={() => setActiveTab('enquiries')}
                  className="text-xs text-[#F10D17] hover:underline font-semibold cursor-pointer"
                >
                  View All Enquiries ({totalEnquiries}) →
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-[#B8BBC4] uppercase">
                      <th className="py-3 px-3">Ref ID</th>
                      <th className="py-3 px-3">Customer</th>
                      <th className="py-3 px-3">Phone</th>
                      <th className="py-3 px-3">Vehicle</th>
                      <th className="py-3 px-3">Requested Items / Message</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {enquiries.slice(0, 6).map((enq) => (
                      <tr key={enq.id} className="hover:bg-white/5">
                        <td className="py-3 px-3 font-mono-num font-bold text-white">
                          {enq.referenceNumber}
                        </td>
                        <td className="py-3 px-3 text-white font-medium">{enq.customerName}</td>
                        <td className="py-3 px-3 font-mono-num text-[#B8BBC4]">{enq.phone}</td>
                        <td className="py-3 px-3 text-[#B8BBC4]">
                          {enq.vehicleType || '—'}{' '}
                          {enq.vehicleModel ? `(${enq.vehicleModel})` : ''}
                        </td>
                        <td className="py-3 px-3 text-[#D1D5DB] max-w-xs truncate">
                          {enq.items.length > 0
                            ? enq.items.map((i) => `${i.productName} (x${i.quantity})`).join(', ')
                            : enq.serviceName || enq.message}
                        </td>
                        <td className="py-3 px-3 font-semibold text-[#FACC15]">{enq.status}</td>
                        <td className="py-3 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedEnquiry(enq);
                              setNotesInput(enq.adminNotes || '');
                            }}
                            className="px-3 py-1.5 rounded-lg bg-[#14151B] hover:bg-[#F10D17] text-white font-medium transition-colors cursor-pointer"
                          >
                            Manage
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 2: PRODUCT MANAGEMENT (FULL CRUD + SUPABASE IMAGE UPLOAD)
           ===================================================================== */}
        {activeTab === 'products' && (
          <div className="pt-8 space-y-6">
            {/* Toolbar */}
            <div className="bg-[#1C1D24] border border-white/10 p-6 rounded-2xl flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-bold text-white uppercase">
                  Product Catalogue Management
                </h2>
                <p className="text-xs text-[#B8BBC4]">
                  Manage tyres, batteries, alloy wheels & accessories. Upload product images to
                  Supabase Storage (`product-images`) or paste external URLs.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-[#B8BBC4] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={prodSearchQuery}
                    onChange={(e) => setProdSearchQuery(e.target.value)}
                    placeholder="Search SKU, name, brand..."
                    className="bg-[#14151B] border border-white/15 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#F10D17]"
                  />
                </div>

                <select
                  value={prodFilterCategory}
                  onChange={(e) => setProdFilterCategory(e.target.value)}
                  className="bg-[#14151B] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white"
                >
                  <option value="all">All Categories</option>
                  {CATEGORY_OPTIONS.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.label}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={openAddProductModal}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F10D17] hover:bg-[#d10b14] text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Product</span>
                </button>
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-[#1C1D24] border border-white/10 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-white/10 bg-[#14151B] text-[#B8BBC4] uppercase">
                      <th className="py-3.5 px-4">Image</th>
                      <th className="py-3.5 px-4">SKU</th>
                      <th className="py-3.5 px-4">Product Name</th>
                      <th className="py-3.5 px-4">Brand</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Pricing</th>
                      <th className="py-3.5 px-4">Stock Status</th>
                      <th className="py-3.5 px-4">Featured</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {filteredProductsList.map((p) => (
                      <tr key={p.id} className="hover:bg-white/5">
                        <td className="py-3 px-4">
                          <img
                            src={p.images?.[0] || '/assets/aistudio/image_f3b889b3.png'}
                            alt={p.name}
                            referrerPolicy="no-referrer"
                            className="w-12 h-10 rounded-lg object-cover border border-white/10 bg-[#14151B]"
                          />
                        </td>
                        <td className="py-3 px-4 font-mono-num text-[#B8BBC4]">{p.sku}</td>
                        <td className="py-3 px-4">
                          <Link
                            to={`/product/${p.slug}`}
                            className="font-semibold text-white hover:text-[#F10D17] transition-colors block"
                          >
                            {p.name}
                          </Link>
                          <span className="text-[11px] text-[#B8BBC4]">
                            Fits: {p.vehicleTypes.join(', ')}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-[#D1D5DB]">{p.brand}</td>
                        <td className="py-3 px-4 text-[#B8BBC4]">{p.category}</td>
                        <td className="py-3 px-4 font-mono-num text-[#FACC15] font-semibold">
                          {p.price !== null && p.price > 0
                            ? `₹${p.price.toLocaleString('en-IN')}`
                            : 'Contact for Price'}
                        </td>
                        <td className="py-3 px-4">
                          <select
                            value={p.availability}
                            onChange={(e) =>
                              updateProduct(p.id, {
                                availability: e.target.value as Product['availability'],
                              })
                            }
                            className="bg-[#14151B] border border-white/15 rounded-lg px-2 py-1 text-xs text-emerald-400"
                          >
                            <option value="In Stock">In Stock</option>
                            <option value="Available on Order">Available on Order</option>
                            <option value="Out of Stock">Out of Stock</option>
                          </select>
                        </td>
                        <td className="py-3 px-4">
                          <input
                            type="checkbox"
                            checked={p.featured}
                            onChange={(e) => updateProduct(p.id, { featured: e.target.checked })}
                            className="w-4 h-4 accent-[#F10D17] cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-4 text-right space-x-2 whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => openEditProductModal(p)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#14151B] hover:bg-white/15 text-white cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-[#F10D17]" />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setProductToDelete(p)}
                            className="inline-flex items-center p-1.5 rounded-lg bg-[#14151B] text-[#B8BBC4] hover:text-[#F10D17] cursor-pointer"
                            aria-label="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 3: BLOG MANAGEMENT (FULL CRUD + SUPABASE IMAGE UPLOAD)
           ===================================================================== */}
        {activeTab === 'blogs' && (
          <div className="pt-8 space-y-6">
            <div className="bg-[#1C1D24] border border-white/10 p-6 rounded-2xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-bold text-white uppercase">
                  Blog & Article Management
                </h2>
                <p className="text-xs text-[#B8BBC4]">
                  Write, edit, publish, or unpublish automotive articles. Upload featured images to
                  Supabase Storage (`blog-images`).
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-[#B8BBC4] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={blogSearchQuery}
                    onChange={(e) => setBlogSearchQuery(e.target.value)}
                    placeholder="Search blog title or category..."
                    className="bg-[#14151B] border border-white/15 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#F10D17]"
                  />
                </div>

                <button
                  type="button"
                  onClick={openAddBlogModal}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F10D17] hover:bg-[#d10b14] text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Write New Blog Post</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBlogsList.map((article) => {
                const isPub = article.isPublished !== false;
                return (
                  <div
                    key={article.id}
                    className="bg-[#1C1D24] border border-white/10 rounded-2xl overflow-hidden flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-44 bg-[#14151B]">
                        <img
                          src={article.image}
                          alt={article.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 right-3">
                          <button
                            type="button"
                            onClick={() => updateBlog(article.id, { isPublished: !isPub })}
                            className={`px-3 py-1 rounded-md text-[11px] font-bold uppercase cursor-pointer ${
                              isPub
                                ? 'bg-emerald-600 text-white'
                                : 'bg-amber-600 text-white'
                            }`}
                          >
                            {isPub ? 'Published' : 'Draft'}
                          </button>
                        </div>
                      </div>

                      <div className="p-5 space-y-2">
                        <div className="flex items-center gap-2 text-[11px] text-[#B8BBC4]">
                          <span className="text-[#F10D17] font-semibold uppercase">
                            {article.category}
                          </span>
                          <span>·</span>
                          <span>{article.publishedAt}</span>
                        </div>
                        <h3 className="font-display text-lg font-bold text-white uppercase line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-xs text-[#B8BBC4] line-clamp-2">{article.excerpt}</p>
                        <p className="text-[11px] text-[#B8BBC4]/80 pt-1">
                          Author: {article.author}
                        </p>
                      </div>
                    </div>

                    <div className="px-5 pb-5 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                      <Link
                        to={`/blog/${article.slug}`}
                        className="inline-flex items-center gap-1 text-xs text-[#B8BBC4] hover:text-white"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-[#F10D17]" />
                        <span>View Post</span>
                      </Link>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openEditBlogModal(article)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#14151B] hover:bg-white/10 text-xs text-white cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-[#F10D17]" />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setBlogToDelete(article)}
                          className="p-1.5 rounded-lg bg-[#14151B] text-[#B8BBC4] hover:text-[#F10D17] cursor-pointer"
                          aria-label="Delete Blog"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 4: VISITOR ENQUIRIES & CONTACT SUBMISSIONS
           ===================================================================== */}
        {activeTab === 'enquiries' && (
          <div className="pt-8 space-y-6">
            <div className="bg-[#1C1D24] border border-white/10 rounded-2xl p-6 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-bold text-white uppercase">
                  Visitor Enquiries & Contact Submissions
                </h2>
                <p className="text-xs text-[#B8BBC4]">
                  Live enquiries from Product Modals, Multi-Product Enquiry Cart, and Contact Us
                  page.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-[#B8BBC4] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={enqSearchQuery}
                    onChange={(e) => setEnqSearchQuery(e.target.value)}
                    placeholder="Search name, phone, or Ref ID..."
                    className="bg-[#14151B] border border-white/15 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#F10D17]"
                  />
                </div>

                <select
                  value={enqStatusFilter}
                  onChange={(e) => setEnqStatusFilter(e.target.value)}
                  className="bg-[#14151B] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white"
                >
                  <option value="all">All Statuses</option>
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>

                <button
                  type="button"
                  onClick={exportEnquiriesToCsv}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F10D17] text-white text-xs font-bold uppercase cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Export Enquiries CSV</span>
                </button>
              </div>
            </div>

            <div className="bg-[#1C1D24] border border-white/10 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-white/10 bg-[#14151B] text-[#B8BBC4] uppercase">
                      <th className="py-3.5 px-4">Reference ID</th>
                      <th className="py-3.5 px-4">Customer</th>
                      <th className="py-3.5 px-4">Phone & City</th>
                      <th className="py-3.5 px-4">Vehicle Info</th>
                      <th className="py-3.5 px-4">Requested Products / Message</th>
                      <th className="py-3.5 px-4">Date</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {filteredEnquiriesList.map((enq) => (
                      <tr key={enq.id} className="hover:bg-white/5">
                        <td className="py-3.5 px-4 font-mono-num font-bold text-white">
                          {enq.referenceNumber}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-white block">{enq.customerName}</span>
                          <span className="text-[11px] text-[#B8BBC4]">{enq.email || '—'}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-mono-num text-white block">{enq.phone}</span>
                          <span className="text-[11px] text-[#B8BBC4]">{enq.city}</span>
                        </td>
                        <td className="py-3.5 px-4 text-[#D1D5DB]">
                          {enq.vehicleType || 'General'}{' '}
                          {enq.vehicleModel ? `– ${enq.vehicleModel}` : ''}
                        </td>
                        <td className="py-3.5 px-4 text-white max-w-xs">
                          {enq.items.length > 0 ? (
                            <div className="space-y-0.5">
                              {enq.items.map((item, idx) => (
                                <div key={idx} className="text-xs truncate">
                                  • {item.productName} (x{item.quantity})
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="line-clamp-2 text-[#D1D5DB]">
                              {enq.serviceName ? `[${enq.serviceName}] ` : ''}
                              {enq.message}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 font-mono-num text-[#B8BBC4]">
                          {new Date(enq.createdAt).toLocaleDateString('en-IN')}
                        </td>
                        <td className="py-3.5 px-4">
                          <select
                            value={enq.status}
                            onChange={(e) =>
                              updateEnquiryStatus(enq.id, e.target.value as EnquiryStatus)
                            }
                            className="bg-[#14151B] border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-[#FACC15] font-semibold"
                          >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </td>
                        <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedEnquiry(enq);
                              setNotesInput(enq.adminNotes || '');
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#14151B] hover:bg-white/15 text-white cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5 text-[#F10D17]" />
                            <span>Details</span>
                          </button>
                          <a
                            href={getWhatsAppUrl(
                              `Hello ${enq.customerName}, greetings from Ghosh Tyre Zone Kolkata regarding your enquiry ${enq.referenceNumber}.`
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center p-1.5 rounded-lg bg-[#16A34A] text-white hover:bg-[#15803D]"
                            title="Reply on WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>
                          <button
                            type="button"
                            onClick={() => deleteEnquiry(enq.id)}
                            className="inline-flex items-center p-1.5 rounded-lg bg-[#14151B] text-[#B8BBC4] hover:text-[#F10D17] cursor-pointer"
                            aria-label="Delete Enquiry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: CATEGORIES */}
        {activeTab === 'categories' && (
          <div className="pt-8 space-y-6">
            <div className="flex items-center justify-between bg-[#1C1D24] border border-white/10 p-6 rounded-2xl">
              <div>
                <h2 className="font-display text-2xl font-bold text-white uppercase">
                  Category Management
                </h2>
                <p className="text-xs text-[#B8BBC4]">
                  Manage product categories and homepage circular showcase items.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingCategory(null);
                  setCatName('');
                  setCatShortName('');
                  setCatSlug('accessories');
                  setCatDesc('');
                  setCatVisual('accessories');
                  setCatFeatured(true);
                  setShowCategoryForm(true);
                }}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#F10D17] text-white text-xs font-bold uppercase cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Category</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="p-5 rounded-xl bg-[#1C1D24] border border-white/10 flex flex-col justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono-num text-[#F10D17]">/{cat.slug}</span>
                      {cat.featuredOnHome && (
                        <span className="text-[11px] text-emerald-400 font-semibold">
                          Featured on Home Circle
                        </span>
                      )}
                    </div>
                    <h3 className="font-display text-xl font-bold text-white uppercase mt-1">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-[#B8BBC4] mt-1.5">{cat.description}</p>
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingCategory(cat);
                        setCatName(cat.name);
                        setCatShortName(cat.shortName);
                        setCatSlug(cat.slug);
                        setCatDesc(cat.description);
                        setCatVisual(cat.visualType);
                        setCatFeatured(cat.featuredOnHome);
                        setShowCategoryForm(true);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#14151B] text-xs text-white hover:bg-white/10 cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteCategory(cat.id)}
                      className="px-3 py-1.5 rounded-lg bg-[#14151B] text-xs text-[#F10D17] hover:bg-white/10 cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: PROMOTIONAL BANNERS */}
        {activeTab === 'banners' && (
          <div className="pt-8 space-y-6">
            <div className="bg-[#1C1D24] border border-white/10 p-6 rounded-2xl">
              <h2 className="font-display text-2xl font-bold text-white uppercase">
                Editable Promotional & Collection Banners
              </h2>
              <p className="text-xs text-[#B8BBC4] mt-1">
                Customize the promotional cards and collection banners displayed on the Homepage.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {banners.map((banner) => (
                <div
                  key={banner.id}
                  className="p-6 rounded-2xl bg-[#1C1D24] border border-white/10 space-y-4"
                >
                  <span className="text-xs font-mono-num uppercase text-[#F10D17]">
                    Slot: {banner.slot}
                  </span>
                  <div>
                    <label className="block text-xs text-[#B8BBC4] mb-1">Top Kicker</label>
                    <input
                      type="text"
                      value={banner.kicker}
                      onChange={(e) => updateBanner(banner.id, { kicker: e.target.value })}
                      className="w-full bg-[#14151B] border border-white/15 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#B8BBC4] mb-1">Main Title</label>
                    <input
                      type="text"
                      value={banner.title}
                      onChange={(e) => updateBanner(banner.id, { title: e.target.value })}
                      className="w-full bg-[#14151B] border border-white/15 rounded-lg px-3 py-2 text-sm font-bold text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#B8BBC4] mb-1">Subtitle</label>
                    <input
                      type="text"
                      value={banner.subtitle}
                      onChange={(e) => updateBanner(banner.id, { subtitle: e.target.value })}
                      className="w-full bg-[#14151B] border border-white/15 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* =======================================================================
          MODAL 1: ADD / EDIT PRODUCT (WITH MULTI-IMAGE SUPABASE STORAGE UPLOAD)
         ======================================================================= */}
      {showProductForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-[#1C1D24] border border-white/15 rounded-2xl max-w-3xl w-full p-6 max-h-[92vh] overflow-y-auto space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#F10D17] font-bold">
                  Supabase Catalogue Sync
                </span>
                <h3 className="font-display text-xl font-bold text-white uppercase">
                  {editingProduct ? `Edit Product: ${editingProduct.name}` : 'Add New Product'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowProductForm(false)}
                className="p-1.5 text-[#B8BBC4] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-5 text-xs">
              {/* Name, Slug, SKU, Brand */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#B8BBC4] mb-1 font-medium">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={prodName}
                    onChange={(e) => {
                      setProdName(e.target.value);
                      if (!editingProduct) {
                        setProdSlug(slugify(e.target.value));
                      }
                    }}
                    placeholder="e.g. Michelin Primacy 4 ST Tubeless Tyre"
                    className="w-full bg-[#14151B] border border-white/15 rounded-lg px-3 py-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-[#B8BBC4] mb-1 font-medium">
                    URL Slug (Auto-generated) *
                  </label>
                  <input
                    type="text"
                    required
                    value={prodSlug}
                    onChange={(e) => setProdSlug(slugify(e.target.value))}
                    className="w-full bg-[#14151B] border border-white/15 rounded-lg px-3 py-2.5 text-white font-mono-num"
                  />
                </div>

                <div>
                  <label className="block text-[#B8BBC4] mb-1 font-medium">
                    SKU / Product Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={prodSku}
                    onChange={(e) => setProdSku(e.target.value)}
                    className="w-full bg-[#14151B] border border-white/15 rounded-lg px-3 py-2.5 text-white font-mono-num"
                  />
                </div>

                <div>
                  <label className="block text-[#B8BBC4] mb-1 font-medium">Brand *</label>
                  <input
                    type="text"
                    required
                    value={prodBrand}
                    onChange={(e) => setProdBrand(e.target.value)}
                    placeholder="Michelin, Bridgestone, Exide, Amaron, Sonax..."
                    className="w-full bg-[#14151B] border border-white/15 rounded-lg px-3 py-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-[#B8BBC4] mb-1 font-medium">Category *</label>
                  <select
                    value={prodCategorySlug}
                    onChange={(e) => setProdCategorySlug(e.target.value as ProductCategorySlug)}
                    className="w-full bg-[#14151B] border border-white/15 rounded-lg px-3 py-2.5 text-white"
                  >
                    {CATEGORY_OPTIONS.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[#B8BBC4] mb-1 font-medium">Availability *</label>
                  <select
                    value={prodAvailability}
                    onChange={(e) =>
                      setProdAvailability(e.target.value as Product['availability'])
                    }
                    className="w-full bg-[#14151B] border border-white/15 rounded-lg px-3 py-2.5 text-white"
                  >
                    <option value="In Stock">In Stock</option>
                    <option value="Available on Order">Available on Order</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>
              </div>

              {/* Price & Contact for Price Toggle */}
              <div className="p-4 rounded-xl bg-[#14151B] border border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <label className="inline-flex items-center gap-2.5 text-white font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prodContactForPrice}
                    onChange={(e) => setProdContactForPrice(e.target.checked)}
                    className="w-4 h-4 accent-[#F10D17]"
                  />
                  <span>Display "Contact for Price" (Enquiry-Based Pricing)</span>
                </label>

                {!prodContactForPrice && (
                  <div>
                    <label className="block text-[#B8BBC4] mb-1">Configured Price (₹ INR)</label>
                    <input
                      type="number"
                      min={1}
                      value={prodPrice}
                      onChange={(e) => setProdPrice(e.target.value)}
                      placeholder="e.g. 6500"
                      className="w-full bg-[#1C1D24] border border-white/15 rounded-lg px-3 py-2 text-white font-mono-num"
                    />
                  </div>
                )}
              </div>

              {/* Compatible Vehicle Types */}
              <div>
                <label className="block text-[#B8BBC4] mb-2 font-medium">
                  Compatible Vehicle Types *
                </label>
                <div className="flex flex-wrap gap-3">
                  {ALL_VEHICLE_TYPES.map((vt) => (
                    <label
                      key={vt}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#14151B] border border-white/10 text-white cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={prodVehicles.includes(vt)}
                        onChange={() => {
                          if (prodVehicles.includes(vt)) {
                            setProdVehicles(prodVehicles.filter((v) => v !== vt));
                          } else {
                            setProdVehicles([...prodVehicles, vt]);
                          }
                        }}
                        className="accent-[#F10D17]"
                      />
                      <span>{vt}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[#B8BBC4] mb-1 font-medium">
                  Compatible Vehicle Models (comma-separated)
                </label>
                <input
                  type="text"
                  value={prodModels}
                  onChange={(e) => setProdModels(e.target.value)}
                  placeholder="Honda City, Hyundai Creta, Maruti Swift..."
                  className="w-full bg-[#14151B] border border-white/15 rounded-lg px-3 py-2 text-white"
                />
              </div>

              {/* Tyre Specifications when Category is Tyres */}
              {prodCategorySlug === 'tyres' && (
                <div className="p-4 rounded-xl bg-[#14151B] border border-white/10 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#FACC15] block">
                    Tyre Size & Rating Specifications
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    <div>
                      <label className="block text-[11px] text-[#B8BBC4] mb-1">Width (mm)</label>
                      <input
                        type="text"
                        value={tyreWidth}
                        onChange={(e) => setTyreWidth(e.target.value)}
                        placeholder="195"
                        className="w-full bg-[#1C1D24] border border-white/15 rounded-lg px-2.5 py-1.5 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-[#B8BBC4] mb-1">Aspect Ratio</label>
                      <input
                        type="text"
                        value={tyreAspect}
                        onChange={(e) => setTyreAspect(e.target.value)}
                        placeholder="55"
                        className="w-full bg-[#1C1D24] border border-white/15 rounded-lg px-2.5 py-1.5 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-[#B8BBC4] mb-1">Rim Diameter</label>
                      <input
                        type="text"
                        value={tyreRim}
                        onChange={(e) => setTyreRim(e.target.value)}
                        placeholder="R16"
                        className="w-full bg-[#1C1D24] border border-white/15 rounded-lg px-2.5 py-1.5 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-[#B8BBC4] mb-1">Load Index</label>
                      <input
                        type="text"
                        value={tyreLoad}
                        onChange={(e) => setTyreLoad(e.target.value)}
                        placeholder="87"
                        className="w-full bg-[#1C1D24] border border-white/15 rounded-lg px-2.5 py-1.5 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-[#B8BBC4] mb-1">Speed Rating</label>
                      <input
                        type="text"
                        value={tyreSpeed}
                        onChange={(e) => setTyreSpeed(e.target.value)}
                        placeholder="V"
                        className="w-full bg-[#1C1D24] border border-white/15 rounded-lg px-2.5 py-1.5 text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Short & Full Description */}
              <div>
                <label className="block text-[#B8BBC4] mb-1 font-medium">Short Description *</label>
                <input
                  type="text"
                  required
                  value={prodShortDesc}
                  onChange={(e) => setProdShortDesc(e.target.value)}
                  className="w-full bg-[#14151B] border border-white/15 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-[#B8BBC4] mb-1 font-medium">
                  Detailed Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                  className="w-full bg-[#14151B] border border-white/15 rounded-lg px-3 py-2 text-white"
                />
              </div>

              {/* Dynamic Key-Value Specifications */}
              <div className="p-4 rounded-xl bg-[#14151B] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white uppercase tracking-wider">
                    Technical Specifications (Key – Value)
                  </span>
                  <button
                    type="button"
                    onClick={() => setSpecRows([...specRows, { key: '', value: '' }])}
                    className="inline-flex items-center gap-1 text-[#F10D17] hover:underline font-semibold cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Specification Row</span>
                  </button>
                </div>

                {specRows.map((row, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={row.key}
                      onChange={(e) => {
                        const copy = [...specRows];
                        copy[idx].key = e.target.value;
                        setSpecRows(copy);
                      }}
                      placeholder="Spec Name (e.g. Warranty)"
                      className="w-2/5 bg-[#1C1D24] border border-white/15 rounded-lg px-3 py-1.5 text-white"
                    />
                    <input
                      type="text"
                      value={row.value}
                      onChange={(e) => {
                        const copy = [...specRows];
                        copy[idx].value = e.target.value;
                        setSpecRows(copy);
                      }}
                      placeholder="Spec Value"
                      className="flex-1 bg-[#1C1D24] border border-white/15 rounded-lg px-3 py-1.5 text-white"
                    />
                    <button
                      type="button"
                      onClick={() => setSpecRows(specRows.filter((_, i) => i !== idx))}
                      className="p-1.5 text-[#B8BBC4] hover:text-[#F10D17]"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Multi-Image Upload (Supabase Storage `product-images` + URL input) */}
              <div className="p-4 rounded-xl bg-[#14151B] border border-white/10 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="font-bold text-white uppercase tracking-wider block">
                      Product Images (Supabase `product-images` Bucket)
                    </span>
                    <span className="text-[11px] text-[#B8BBC4]">
                      Upload images directly from your device or paste an image URL
                    </span>
                  </div>

                  <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#F10D17] hover:bg-[#d10b14] text-white text-xs font-bold uppercase cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isUploadingProdImg ? 'Uploading...' : 'Upload from Device'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleProductFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* External URL Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newImageUrlInput}
                    onChange={(e) => setNewImageUrlInput(e.target.value)}
                    placeholder="Or paste an image URL (https://...)"
                    className="flex-1 bg-[#1C1D24] border border-white/15 rounded-lg px-3 py-2 text-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddExternalProductImage}
                    className="px-4 py-2 rounded-lg bg-[#1C1D24] hover:bg-white/10 border border-white/15 text-white font-semibold cursor-pointer"
                  >
                    Add URL
                  </button>
                </div>

                {/* Image Previews with Remove Buttons */}
                {prodImages.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 pt-2">
                    {prodImages.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        className="relative group rounded-lg overflow-hidden border border-white/15 bg-[#1C1D24] h-20"
                      >
                        <img
                          src={imgUrl}
                          alt={`Product preview ${idx + 1}`}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setProdImages(prodImages.filter((_, i) => i !== idx))
                          }
                          className="absolute top-1 right-1 p-1 rounded-full bg-black/80 text-white hover:bg-[#F10D17]"
                          title="Remove image"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer Save Controls */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-white/10">
                <label className="inline-flex items-center gap-2 text-white font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prodFeatured}
                    onChange={(e) => setProdFeatured(e.target.checked)}
                    className="w-4 h-4 accent-[#F10D17]"
                  />
                  <span>Mark as Featured Product on Storefront</span>
                </label>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setShowProductForm(false)}
                    className="px-4 py-2.5 rounded-lg bg-[#14151B] text-[#B8BBC4] hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-lg bg-[#F10D17] hover:bg-[#d10b14] text-white font-bold uppercase tracking-wider cursor-pointer"
                  >
                    {editingProduct ? 'Save Product Changes' : 'Create Product'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE PRODUCT CONFIRMATION MODAL */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-[#1C1D24] border border-white/15 rounded-2xl max-w-md w-full p-6 space-y-4 text-center">
            <h3 className="font-display text-xl font-bold text-white uppercase">
              Delete Product?
            </h3>
            <p className="text-xs text-[#B8BBC4]">
              Are you sure you want to permanently delete{' '}
              <strong className="text-white">{productToDelete.name}</strong> from the catalogue and
              Supabase?
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="px-5 py-2.5 rounded-lg bg-[#14151B] text-xs text-[#B8BBC4]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  await deleteProduct(productToDelete.id);
                  setStatusBanner({
                    type: 'info',
                    text: `Deleted product "${productToDelete.name}".`,
                  });
                  setProductToDelete(null);
                }}
                className="px-5 py-2.5 rounded-lg bg-[#F10D17] text-xs font-bold uppercase text-white cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =======================================================================
          MODAL 2: CREATE / EDIT BLOG POST (WITH SUPABASE `blog-images` UPLOAD)
         ======================================================================= */}
      {showBlogForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-[#1C1D24] border border-white/15 rounded-2xl max-w-3xl w-full p-6 max-h-[92vh] overflow-y-auto space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#F10D17] font-bold">
                  Automotive Knowledge Hub
                </span>
                <h3 className="font-display text-xl font-bold text-white uppercase">
                  {editingBlog ? `Edit Blog: ${editingBlog.title}` : 'Create New Blog Post'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowBlogForm(false)}
                className="p-1.5 text-[#B8BBC4] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBlog} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#B8BBC4] mb-1 font-medium">Blog Title *</label>
                  <input
                    type="text"
                    required
                    value={blogTitle}
                    onChange={(e) => {
                      setBlogTitle(e.target.value);
                      if (!editingBlog) {
                        setBlogSlug(slugify(e.target.value));
                      }
                    }}
                    placeholder="e.g. 7 Things to Check Before a Long Drive"
                    className="w-full bg-[#14151B] border border-white/15 rounded-lg px-3 py-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-[#B8BBC4] mb-1 font-medium">
                    URL Slug (Auto-generated) *
                  </label>
                  <input
                    type="text"
                    required
                    value={blogSlug}
                    onChange={(e) => setBlogSlug(slugify(e.target.value))}
                    className="w-full bg-[#14151B] border border-white/15 rounded-lg px-3 py-2.5 text-white font-mono-num"
                  />
                </div>

                <div>
                  <label className="block text-[#B8BBC4] mb-1 font-medium">Category / Tag *</label>
                  <input
                    type="text"
                    required
                    value={blogCategory}
                    onChange={(e) => setBlogCategory(e.target.value)}
                    placeholder="Tyre Care Guide, Battery Guide, Highway Safety..."
                    className="w-full bg-[#14151B] border border-white/15 rounded-lg px-3 py-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-[#B8BBC4] mb-1 font-medium">Author *</label>
                  <input
                    type="text"
                    required
                    value={blogAuthor}
                    onChange={(e) => setBlogAuthor(e.target.value)}
                    className="w-full bg-[#14151B] border border-white/15 rounded-lg px-3 py-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-[#B8BBC4] mb-1 font-medium">Publication Date *</label>
                  <input
                    type="text"
                    required
                    value={blogPublishedDate}
                    onChange={(e) => setBlogPublishedDate(e.target.value)}
                    placeholder="November 11, 2026"
                    className="w-full bg-[#14151B] border border-white/15 rounded-lg px-3 py-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-[#B8BBC4] mb-1 font-medium">Estimated Read Time</label>
                  <input
                    type="text"
                    value={blogReadTime}
                    onChange={(e) => setBlogReadTime(e.target.value)}
                    placeholder="4 min read"
                    className="w-full bg-[#14151B] border border-white/15 rounded-lg px-3 py-2.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#B8BBC4] mb-1 font-medium">Short Excerpt *</label>
                <textarea
                  rows={2}
                  required
                  value={blogExcerpt}
                  onChange={(e) => setBlogExcerpt(e.target.value)}
                  placeholder="Brief 1–2 sentence summary shown on blog cards..."
                  className="w-full bg-[#14151B] border border-white/15 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-[#B8BBC4] mb-1 font-medium">
                  Key Technical Takeaways (One point per line)
                </label>
                <textarea
                  rows={3}
                  value={blogTakeawaysText}
                  onChange={(e) => setBlogTakeawaysText(e.target.value)}
                  className="w-full bg-[#14151B] border border-white/15 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-[#B8BBC4] mb-1 font-medium">
                  Full Article Content (Separate paragraphs with a blank line) *
                </label>
                <textarea
                  rows={7}
                  required
                  value={blogContentText}
                  onChange={(e) => setBlogContentText(e.target.value)}
                  placeholder="Write the full article content here..."
                  className="w-full bg-[#14151B] border border-white/15 rounded-lg px-3 py-2.5 text-white leading-relaxed"
                />
              </div>

              {/* Featured Image Upload (`blog-images` bucket) */}
              <div className="p-4 rounded-xl bg-[#14151B] border border-white/10 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="font-bold text-white uppercase tracking-wider block">
                      Featured Image (Supabase `blog-images` Bucket)
                    </span>
                    <span className="text-[11px] text-[#B8BBC4]">
                      Upload directly to Supabase Storage or paste an image URL
                    </span>
                  </div>

                  <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#F10D17] hover:bg-[#d10b14] text-white text-xs font-bold uppercase cursor-pointer">
                    <ImagePlus className="w-3.5 h-3.5" />
                    <span>{isUploadingBlogImg ? 'Uploading...' : 'Upload Featured Image'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleBlogFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <input
                  type="text"
                  value={blogFeaturedImage}
                  onChange={(e) => setBlogFeaturedImage(e.target.value)}
                  placeholder="Or paste featured image URL..."
                  className="w-full bg-[#1C1D24] border border-white/15 rounded-lg px-3 py-2 text-white"
                />

                {blogFeaturedImage && (
                  <div className="h-36 w-64 rounded-xl overflow-hidden border border-white/15 bg-[#1C1D24]">
                    <img
                      src={blogFeaturedImage}
                      alt="Blog featured preview"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-white/10">
                <label className="inline-flex items-center gap-2 text-white font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={blogIsPublished}
                    onChange={(e) => setBlogIsPublished(e.target.checked)}
                    className="w-4 h-4 accent-[#F10D17]"
                  />
                  <span>Publish Immediately (Uncheck to save as Draft)</span>
                </label>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setShowBlogForm(false)}
                    className="px-4 py-2.5 rounded-lg bg-[#14151B] text-[#B8BBC4]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-lg bg-[#F10D17] hover:bg-[#d10b14] text-white font-bold uppercase tracking-wider cursor-pointer"
                  >
                    {editingBlog ? 'Update Blog Post' : 'Publish Blog Post'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE BLOG CONFIRMATION MODAL */}
      {blogToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-[#1C1D24] border border-white/15 rounded-2xl max-w-md w-full p-6 space-y-4 text-center">
            <h3 className="font-display text-xl font-bold text-white uppercase">
              Delete Blog Post?
            </h3>
            <p className="text-xs text-[#B8BBC4]">
              Are you sure you want to delete{' '}
              <strong className="text-white">{blogToDelete.title}</strong>?
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setBlogToDelete(null)}
                className="px-5 py-2.5 rounded-lg bg-[#14151B] text-xs text-[#B8BBC4]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  await deleteBlog(blogToDelete.id);
                  setStatusBanner({
                    type: 'info',
                    text: `Deleted blog post "${blogToDelete.title}".`,
                  });
                  setBlogToDelete(null);
                }}
                className="px-5 py-2.5 rounded-lg bg-[#F10D17] text-xs font-bold uppercase text-white cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =======================================================================
          MODAL 3: ENQUIRY DETAILS & INTERNAL NOTES
         ======================================================================= */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-[#1C1D24] border border-white/15 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-xs font-mono-num text-[#F10D17] font-bold">
                  {selectedEnquiry.referenceNumber}
                </span>
                <h3 className="font-display text-xl font-bold text-white uppercase">
                  Enquiry Details – {selectedEnquiry.customerName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                className="p-1.5 text-[#B8BBC4] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs text-[#D1D5DB]">
              <p>
                <strong className="text-white">Phone:</strong> {selectedEnquiry.phone}
              </p>
              <p>
                <strong className="text-white">Email:</strong> {selectedEnquiry.email || 'N/A'}
              </p>
              <p>
                <strong className="text-white">City / Location:</strong> {selectedEnquiry.city}{' '}
                {selectedEnquiry.pincode ? `– ${selectedEnquiry.pincode}` : ''}
              </p>
              {selectedEnquiry.vehicleType && (
                <p>
                  <strong className="text-white">Vehicle:</strong> {selectedEnquiry.vehicleType}{' '}
                  {selectedEnquiry.vehicleModel ? `(${selectedEnquiry.vehicleModel})` : ''}
                </p>
              )}
              <p>
                <strong className="text-white">Customer Message:</strong> {selectedEnquiry.message}
              </p>
              {selectedEnquiry.items.length > 0 && (
                <div className="pt-2">
                  <strong className="text-white block mb-1">Requested Products:</strong>
                  <ul className="list-disc pl-5 space-y-1">
                    {selectedEnquiry.items.map((item, idx) => (
                      <li key={idx}>
                        {item.productName} ({item.brand}) — Qty: {item.quantity} [SKU: {item.sku}]
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-white mb-1">
                Enquiry Status
              </label>
              <select
                value={selectedEnquiry.status}
                onChange={(e) =>
                  setSelectedEnquiry({
                    ...selectedEnquiry,
                    status: e.target.value as EnquiryStatus,
                  })
                }
                className="w-full bg-[#14151B] border border-white/15 rounded-lg px-3 py-2 text-xs text-[#FACC15] font-semibold"
              >
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white mb-1">
                Internal Admin Notes (Saved to Supabase)
              </label>
              <textarea
                rows={3}
                value={notesInput}
                onChange={(e) => setNotesInput(e.target.value)}
                placeholder="Record quoted price, stock batch, or follow-up schedule..."
                className="w-full bg-[#14151B] border border-white/15 rounded-lg p-3 text-xs text-white"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                <a
                  href={`tel:${selectedEnquiry.phone}`}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#14151B] text-xs text-white border border-white/15"
                >
                  <Phone className="w-3.5 h-3.5 text-[#F10D17]" />
                  <span>Call</span>
                </a>
                <a
                  href={getWhatsAppUrl(
                    `Hello ${selectedEnquiry.customerName}, greetings from Ghosh Tyre Zone Kolkata regarding your enquiry ${selectedEnquiry.referenceNumber}.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#16A34A] text-xs text-white font-semibold"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Reply on WhatsApp</span>
                </a>
              </div>

              <button
                type="button"
                onClick={async () => {
                  await updateEnquiryStatus(
                    selectedEnquiry.id,
                    selectedEnquiry.status,
                    notesInput
                  );
                  setStatusBanner({
                    type: 'success',
                    text: `Updated enquiry ${selectedEnquiry.referenceNumber}.`,
                  });
                  setSelectedEnquiry(null);
                }}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-[#F10D17] text-xs font-bold uppercase text-white cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Save Status & Notes</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT CATEGORY MODAL */}
      {showCategoryForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-[#1C1D24] border border-white/15 rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-display text-xl font-bold text-white uppercase">
                {editingCategory ? 'Edit Category' : 'Add Category'}
              </h3>
              <button
                type="button"
                onClick={() => setShowCategoryForm(false)}
                className="p-1.5 text-[#B8BBC4] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#B8BBC4] mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  className="w-full bg-[#14151B] border border-white/15 rounded-lg px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-[#B8BBC4] mb-1">Short Label (Homepage Circle)</label>
                <input
                  type="text"
                  value={catShortName}
                  onChange={(e) => setCatShortName(e.target.value)}
                  className="w-full bg-[#14151B] border border-white/15 rounded-lg px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-[#B8BBC4] mb-1">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  className="w-full bg-[#14151B] border border-white/15 rounded-lg px-3 py-2 text-white"
                />
              </div>
              <label className="inline-flex items-center gap-2 text-white">
                <input
                  type="checkbox"
                  checked={catFeatured}
                  onChange={(e) => setCatFeatured(e.target.checked)}
                  className="accent-[#F10D17]"
                />
                <span>Display in Homepage Circular Showcase</span>
              </label>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCategoryForm(false)}
                  className="px-4 py-2 rounded-lg bg-[#14151B] text-[#B8BBC4]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#F10D17] text-white font-bold uppercase cursor-pointer"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
