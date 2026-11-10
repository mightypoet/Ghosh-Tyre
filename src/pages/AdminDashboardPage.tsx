import React, { useState } from 'react';
import {
  CheckCircle2,
  Download,
  Edit3,
  Eye,
  FolderKanban,
  LayoutDashboard,
  Lock,
  LogOut,
  Megaphone,
  MessageCircle,
  Package,
  Phone,
  Plus,
  ShieldCheck,
  Trash2,
  X,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import {
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

export const AdminDashboardPage: React.FC = () => {
  const {
    products,
    categories,
    banners,
    enquiries,
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
  } = useStore();

  // Login form state
  const [loginEmail, setLoginEmail] = useState('admin@ghoshtyre.com');
  const [loginPassword, setLoginPassword] = useState('gtz@kolkata2026');
  const [loginError, setLoginError] = useState('');

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<
    'overview' | 'enquiries' | 'products' | 'categories' | 'banners'
  >('overview');

  // Enquiry Details Modal
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [notesInput, setNotesInput] = useState('');

  // Product Form Modal
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);

  const [prodName, setProdName] = useState('');
  const [prodSku, setProdSku] = useState('');
  const [prodBrand, setProdBrand] = useState('Michelin');
  const [prodCategorySlug, setProdCategorySlug] = useState<ProductCategorySlug>('tyres');
  const [prodSubCategory, setProdSubCategory] = useState('Car Tyres');
  const [prodVehicles, setProdVehicles] = useState<VehicleType[]>(['Car']);
  const [prodModels, setProdModels] = useState('Maruti Swift, Hyundai i20, Honda City');
  const [prodShortDesc, setProdShortDesc] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodPrice, setProdPrice] = useState<string>(''); // empty means Contact for Price
  const [prodAvailability, setProdAvailability] =
    useState<Product['availability']>('In Stock');
  const [prodFeatured, setProdFeatured] = useState(true);
  const [prodVisualType, setProdVisualType] =
    useState<Product['visualType']>('tyre-car');
  const [prodImageUrls, setProdImageUrls] = useState('/assets/aistudio/image_f3b889b3.png');
  const [tyreWidth, setTyreWidth] = useState('');
  const [tyreAspect, setTyreAspect] = useState('');
  const [tyreRim, setTyreRim] = useState('');
  const [tyreSpeed, setTyreSpeed] = useState('');
  const [tyreLoad, setTyreLoad] = useState('');

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

  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-[80vh] bg-[#14151B] flex items-center justify-center p-4">
        <div className="bg-[#1C1D24] border border-white/15 rounded-2xl max-w-md w-full p-8 space-y-6 shadow-2xl">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-[#F10D17]/15 text-[#F10D17] flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="font-display text-2xl font-bold text-white uppercase">
              Ghosh Tyre Zone · Admin Login
            </h1>
            <p className="text-xs text-[#B8BBC4]">
              Secure content & enquiry management portal
            </p>
          </div>

          {loginError && (
            <div className="p-3 rounded-lg bg-[#F10D17]/20 border border-[#F10D17] text-xs text-white">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#B8BBC4] mb-1">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full bg-[#14151B] border border-white/15 rounded-lg px-3.5 py-2.5 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#B8BBC4] mb-1">
                Password
              </label>
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

  // Stats calculation
  const totalProducts = products.length;
  const totalCategories = categories.length;
  const totalEnquiries = enquiries.length;
  const newEnquiriesCount = enquiries.filter((e) => e.status === 'New').length;
  const pendingEnquiriesCount = enquiries.filter(
    (e) => e.status === 'Contacted' || e.status === 'In Progress'
  ).length;
  const resolvedEnquiriesCount = enquiries.filter((e) => e.status === 'Completed').length;

  const openAddProductModal = () => {
    setEditingProduct(null);
    setProdName('');
    setProdSku(`GTZ-PRD-${Math.floor(100 + Math.random() * 900)}`);
    setProdBrand('Michelin');
    setProdCategorySlug('tyres');
    setProdSubCategory('Car Tyres');
    setProdVehicles(['Car']);
    setProdModels('Maruti Swift, Hyundai i20, Honda City');
    setProdShortDesc('');
    setProdDesc('');
    setProdPrice('');
    setProdAvailability('In Stock');
    setProdFeatured(true);
    setProdVisualType('tyre-car');
    setProdImageUrls('/assets/aistudio/image_f3b889b3.png');
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
    setProdSku(p.sku);
    setProdBrand(p.brand);
    setProdCategorySlug(p.categorySlug);
    setProdSubCategory(p.subCategory);
    setProdVehicles(p.vehicleTypes);
    setProdModels(p.compatibleModels.join(', '));
    setProdShortDesc(p.shortDescription);
    setProdDesc(p.description);
    setProdPrice(p.price !== null ? String(p.price) : '');
    setProdAvailability(p.availability);
    setProdFeatured(p.featured);
    setProdVisualType(p.visualType);
    setProdImageUrls((p.images || []).join(', '));
    setTyreWidth(p.tyreSpecs?.width || '');
    setTyreAspect(p.tyreSpecs?.aspectRatio || '');
    setTyreRim(p.tyreSpecs?.rimDiameter || '');
    setTyreSpeed(p.tyreSpecs?.speedRating || '');
    setTyreLoad(p.tyreSpecs?.loadIndex || '');
    setShowProductForm(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const categoryLabelMap: Record<ProductCategorySlug, string> = {
      tyres: 'Tyres',
      batteries: 'Batteries',
      'alloy-wheels': 'Alloy Wheels',
      accessories: 'Accessories',
      audio: 'Audio',
      video: 'Video Systems',
      detailing: 'Detailing',
      interior: 'Interior',
      exterior: 'Exterior',
      parts: 'Parts',
      tools: 'Tools',
      services: 'Services',
    };

    const slug = prodName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const parsedPrice = prodPrice.trim() !== '' ? Number(prodPrice) : null;

    const payload: Omit<Product, 'id' | 'createdAt'> = {
      sku: prodSku.trim() || 'GTZ-NEW',
      name: prodName.trim(),
      slug: editingProduct ? editingProduct.slug : `${slug}-${Date.now().toString().slice(-3)}`,
      brand: prodBrand.trim(),
      category: categoryLabelMap[prodCategorySlug] || 'Tyres',
      categorySlug: prodCategorySlug,
      subCategory: prodSubCategory.trim(),
      vehicleTypes: prodVehicles.length > 0 ? prodVehicles : ['Car'],
      compatibleModels: prodModels
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      shortDescription: prodShortDesc.trim(),
      description: prodDesc.trim() || prodShortDesc.trim(),
      price: parsedPrice,
      availability: prodAvailability,
      featured: prodFeatured,
      images: prodImageUrls
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      visualType: prodVisualType,
      tyreSpecs: tyreWidth
        ? {
            width: tyreWidth,
            aspectRatio: tyreAspect,
            rimDiameter: tyreRim,
            speedRating: tyreSpeed,
            loadIndex: tyreLoad,
          }
        : undefined,
      specifications: {
        Brand: prodBrand.trim(),
        Category: categoryLabelMap[prodCategorySlug] || 'Automotive',
        ...(tyreWidth
          ? { 'Tyre Size': `${tyreWidth}/${tyreAspect} ${tyreRim} ${tyreLoad}${tyreSpeed}` }
          : {}),
      },
    };

    if (editingProduct) {
      await updateProduct(editingProduct.id, payload);
    } else {
      await addProduct(payload);
    }
    setShowProductForm(false);
  };

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
      {/* Admin Top Header */}
      <div className="bg-[#1C1D24] border-b border-white/10 py-6">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F10D17]/15 text-[#F10D17] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-white uppercase">
                Ghosh Tyre Zone · Admin Dashboard
              </h1>
              <p className="text-xs text-[#B8BBC4]">
                Manage Products, Categories, Promotional Banners & Customer Enquiries
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={exportEnquiriesToCsv}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#14151B] hover:bg-white/10 border border-white/15 text-xs font-semibold text-white cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#F10D17]" />
              <span>Export Enquiries CSV</span>
            </button>

            <button
              type="button"
              onClick={adminLogout}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#F10D17]/20 hover:bg-[#F10D17] border border-[#F10D17]/50 text-xs font-semibold text-white transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4">
          {[
            { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
            {
              id: 'enquiries',
              label: `Customer Enquiries (${totalEnquiries})`,
              icon: MessageCircle,
            },
            { id: 'products', label: `Product Catalogue (${totalProducts})`, icon: Package },
            { id: 'categories', label: `Categories (${totalCategories})`, icon: FolderKanban },
            { id: 'banners', label: 'Promotional Banners', icon: Megaphone },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
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

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="pt-8 space-y-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="p-5 rounded-xl bg-[#1C1D24] border border-white/10">
                <span className="text-xs text-[#B8BBC4] block">Total Products</span>
                <span className="font-mono-num text-3xl font-bold text-white mt-1 block">
                  {totalProducts}
                </span>
              </div>
              <div className="p-5 rounded-xl bg-[#1C1D24] border border-white/10">
                <span className="text-xs text-[#B8BBC4] block">Total Categories</span>
                <span className="font-mono-num text-3xl font-bold text-white mt-1 block">
                  {totalCategories}
                </span>
              </div>
              <div className="p-5 rounded-xl bg-[#1C1D24] border border-white/10">
                <span className="text-xs text-[#B8BBC4] block">Total Enquiries</span>
                <span className="font-mono-num text-3xl font-bold text-white mt-1 block">
                  {totalEnquiries}
                </span>
              </div>
              <div className="p-5 rounded-xl bg-[#1C1D24] border border-white/10">
                <span className="text-xs text-[#F10D17] font-semibold block">New Enquiries</span>
                <span className="font-mono-num text-3xl font-bold text-[#F10D17] mt-1 block">
                  {newEnquiriesCount}
                </span>
              </div>
              <div className="p-5 rounded-xl bg-[#1C1D24] border border-white/10">
                <span className="text-xs text-[#FACC15] font-semibold block">
                  Pending / In Progress
                </span>
                <span className="font-mono-num text-3xl font-bold text-[#FACC15] mt-1 block">
                  {pendingEnquiriesCount}
                </span>
              </div>
              <div className="p-5 rounded-xl bg-[#1C1D24] border border-white/10">
                <span className="text-xs text-emerald-400 font-semibold block">
                  Resolved Enquiries
                </span>
                <span className="font-mono-num text-3xl font-bold text-emerald-400 mt-1 block">
                  {resolvedEnquiriesCount}
                </span>
              </div>
            </div>

            {/* Quick Recent Enquiries Table */}
            <div className="bg-[#1C1D24] border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-xl font-bold text-white uppercase">
                  Recent Customer Enquiries
                </h2>
                <button
                  type="button"
                  onClick={() => setActiveTab('enquiries')}
                  className="text-xs text-[#F10D17] hover:underline font-semibold cursor-pointer"
                >
                  Manage All Enquiries →
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-[#B8BBC4] uppercase">
                      <th className="py-3 px-3">Enquiry ID</th>
                      <th className="py-3 px-3">Customer</th>
                      <th className="py-3 px-3">Phone</th>
                      <th className="py-3 px-3">Product / Service</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {enquiries.slice(0, 5).map((enq) => (
                      <tr key={enq.id} className="hover:bg-white/5">
                        <td className="py-3 px-3 font-mono-num font-bold text-white">
                          {enq.referenceNumber}
                        </td>
                        <td className="py-3 px-3 text-white">{enq.customerName}</td>
                        <td className="py-3 px-3 font-mono-num text-[#B8BBC4]">{enq.phone}</td>
                        <td className="py-3 px-3 text-[#D1D5DB]">
                          {enq.items.length > 0
                            ? enq.items.map((i) => `${i.productName} (x${i.quantity})`).join(', ')
                            : enq.serviceName || 'Contact Form Enquiry'}
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
                            View / Update
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

        {/* TAB 2: ENQUIRY MANAGEMENT */}
        {activeTab === 'enquiries' && (
          <div className="pt-8">
            <div className="bg-[#1C1D24] border border-white/10 rounded-2xl p-6">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="font-display text-2xl font-bold text-white uppercase">
                    Customer Enquiry Management
                  </h2>
                  <p className="text-xs text-[#B8BBC4]">
                    View customer details, update enquiry statuses, add internal workshop notes, and
                    respond via WhatsApp or phone.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={exportEnquiriesToCsv}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F10D17] text-white text-xs font-bold uppercase cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Export CSV</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-[#B8BBC4] uppercase">
                      <th className="py-3.5 px-3">Enquiry ID</th>
                      <th className="py-3.5 px-3">Customer Name</th>
                      <th className="py-3.5 px-3">Phone</th>
                      <th className="py-3.5 px-3">Email</th>
                      <th className="py-3.5 px-3">Product / Service</th>
                      <th className="py-3.5 px-3">Date</th>
                      <th className="py-3.5 px-3">Enquiry Status</th>
                      <th className="py-3.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {enquiries.map((enq) => (
                      <tr key={enq.id} className="hover:bg-white/5">
                        <td className="py-3.5 px-3 font-mono-num font-bold text-white">
                          {enq.referenceNumber}
                        </td>
                        <td className="py-3.5 px-3 font-medium text-white">{enq.customerName}</td>
                        <td className="py-3.5 px-3 font-mono-num text-[#D1D5DB]">{enq.phone}</td>
                        <td className="py-3.5 px-3 text-[#B8BBC4]">{enq.email || '—'}</td>
                        <td className="py-3.5 px-3 text-white max-w-xs truncate">
                          {enq.items.length > 0
                            ? enq.items.map((i) => `${i.productName} (x${i.quantity})`).join(', ')
                            : enq.serviceName || 'General Enquiry'}
                        </td>
                        <td className="py-3.5 px-3 font-mono-num text-[#B8BBC4]">
                          {new Date(enq.createdAt).toLocaleDateString('en-IN')}
                        </td>
                        <td className="py-3.5 px-3">
                          <select
                            value={enq.status}
                            onChange={(e) =>
                              updateEnquiryStatus(enq.id, e.target.value as EnquiryStatus)
                            }
                            className="bg-[#14151B] border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white font-semibold"
                          >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </td>
                        <td className="py-3.5 px-3 text-right space-x-2 whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedEnquiry(enq);
                              setNotesInput(enq.adminNotes || '');
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#14151B] hover:bg-white/15 text-white cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5 text-[#F10D17]" />
                            <span>Inspect</span>
                          </button>
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

        {/* TAB 3: PRODUCT MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="pt-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 bg-[#1C1D24] border border-white/10 p-6 rounded-2xl">
              <div>
                <h2 className="font-display text-2xl font-bold text-white uppercase">
                  Product Catalogue Management
                </h2>
                <p className="text-xs text-[#B8BBC4]">
                  Add, edit, or remove products. Changes immediately reflect across the storefront.
                </p>
              </div>
              <button
                type="button"
                onClick={openAddProductModal}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#F10D17] hover:bg-[#d10b14] text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Product</span>
              </button>
            </div>

            <div className="bg-[#1C1D24] border border-white/10 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-white/10 bg-[#14151B] text-[#B8BBC4] uppercase">
                      <th className="py-3.5 px-4">SKU</th>
                      <th className="py-3.5 px-4">Product Name</th>
                      <th className="py-3.5 px-4">Brand</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Price</th>
                      <th className="py-3.5 px-4">Availability</th>
                      <th className="py-3.5 px-4">Featured</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-white/5">
                        <td className="py-3.5 px-4 font-mono-num text-[#B8BBC4]">{p.sku}</td>
                        <td className="py-3.5 px-4 font-semibold text-white">{p.name}</td>
                        <td className="py-3.5 px-4 text-[#D1D5DB]">{p.brand}</td>
                        <td className="py-3.5 px-4 text-[#B8BBC4]">{p.category}</td>
                        <td className="py-3.5 px-4 font-mono-num text-[#FACC15]">
                          {p.price ? `₹${p.price.toLocaleString('en-IN')}` : 'Contact for Price'}
                        </td>
                        <td className="py-3.5 px-4 text-emerald-400">{p.availability}</td>
                        <td className="py-3.5 px-4">
                          <input
                            type="checkbox"
                            checked={p.featured}
                            onChange={(e) => updateProduct(p.id, { featured: e.target.checked })}
                            className="accent-[#F10D17]"
                          />
                        </td>
                        <td className="py-3.5 px-4 text-right space-x-2 whitespace-nowrap">
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
                            onClick={() => deleteProduct(p.id)}
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

        {/* TAB 4: CATEGORY MANAGEMENT */}
        {activeTab === 'categories' && (
          <div className="pt-8 space-y-6">
            <div className="flex items-center justify-between bg-[#1C1D24] border border-white/10 p-6 rounded-2xl">
              <div>
                <h2 className="font-display text-2xl font-bold text-white uppercase">
                  Category Management
                </h2>
                <p className="text-xs text-[#B8BBC4]">
                  Create, edit, or delete product categories and homepage circular showcase items.
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

        {/* TAB 5: PROMOTIONAL BANNERS EDITOR */}
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

      {/* ENQUIRY DETAILS MODAL */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-[#1C1D24] border border-white/15 rounded-2xl max-w-lg w-full p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-xs font-mono-num text-[#F10D17]">
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
                <strong className="text-white">Location:</strong> {selectedEnquiry.city}{' '}
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
                  <strong className="text-white block mb-1">Enquired Products:</strong>
                  <ul className="list-disc pl-5 space-y-1">
                    {selectedEnquiry.items.map((item) => (
                      <li key={item.productId}>
                        {item.productName} ({item.brand}) — Qty: {item.quantity} [SKU: {item.sku}]
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-white mb-1">
                Internal Admin Notes
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
                  <span>WhatsApp Customer</span>
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
                  setSelectedEnquiry(null);
                }}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-[#F10D17] text-xs font-bold uppercase text-white cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Save Notes</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT PRODUCT MODAL */}
      {showProductForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-[#1C1D24] border border-white/15 rounded-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-display text-xl font-bold text-white uppercase">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button
                type="button"
                onClick={() => setShowProductForm(false)}
                className="p-1.5 text-[#B8BBC4] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[#B8BBC4] mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={prodName}
                    onChange={(e) => setProdName(e.target.value)}
                    className="w-full bg-[#14151B] border border-white/15 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-[#B8BBC4] mb-1">SKU / Product Code *</label>
                  <input
                    type="text"
                    required
                    value={prodSku}
                    onChange={(e) => setProdSku(e.target.value)}
                    className="w-full bg-[#14151B] border border-white/15 rounded-lg px-3 py-2 text-white font-mono-num"
                  />
                </div>
                <div>
                  <label className="block text-[#B8BBC4] mb-1">Brand *</label>
                  <input
                    type="text"
                    required
                    value={prodBrand}
                    onChange={(e) => setProdBrand(e.target.value)}
                    className="w-full bg-[#14151B] border border-white/15 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-[#B8BBC4] mb-1">Category *</label>
                  <select
                    value={prodCategorySlug}
                    onChange={(e) =>
                      setProdCategorySlug(e.target.value as ProductCategorySlug)
                    }
                    className="w-full bg-[#14151B] border border-white/15 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="tyres">Tyres</option>
                    <option value="batteries">Batteries</option>
                    <option value="alloy-wheels">Alloy Wheels</option>
                    <option value="accessories">Accessories</option>
                    <option value="audio">Audio & Video</option>
                    <option value="detailing">Detailing</option>
                    <option value="interior">Interior</option>
                    <option value="exterior">Exterior</option>
                    <option value="parts">Parts</option>
                    <option value="tools">Tools</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#B8BBC4] mb-1">
                    Price in ₹ (Leave blank for "Contact for Price")
                  </label>
                  <input
                    type="number"
                    value={prodPrice}
                    onChange={(e) => setProdPrice(e.target.value)}
                    placeholder="Contact for Price"
                    className="w-full bg-[#14151B] border border-white/15 rounded-lg px-3 py-2 text-white font-mono-num"
                  />
                </div>
                <div>
                  <label className="block text-[#B8BBC4] mb-1">Availability</label>
                  <select
                    value={prodAvailability}
                    onChange={(e) =>
                      setProdAvailability(e.target.value as Product['availability'])
                    }
                    className="w-full bg-[#14151B] border border-white/15 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="In Stock">In Stock</option>
                    <option value="Available on Order">Available on Order</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>
              </div>

              {/* Vehicle Compatibility Checkboxes */}
              <div>
                <label className="block text-[#B8BBC4] mb-1.5">Vehicle Compatibility</label>
                <div className="flex flex-wrap gap-3">
                  {ALL_VEHICLE_TYPES.map((vt) => (
                    <label key={vt} className="inline-flex items-center gap-1.5 text-white">
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
                <label className="block text-[#B8BBC4] mb-1">
                  Compatible Vehicle Models (comma-separated)
                </label>
                <input
                  type="text"
                  value={prodModels}
                  onChange={(e) => setProdModels(e.target.value)}
                  className="w-full bg-[#14151B] border border-white/15 rounded-lg px-3 py-2 text-white"
                />
              </div>

              {/* Optional Tyre Specifications */}
              {prodCategorySlug === 'tyres' && (
                <div className="p-3.5 rounded-xl bg-[#14151B] border border-white/10 grid grid-cols-5 gap-2">
                  <div>
                    <label className="block text-[10px] text-[#B8BBC4]">Width</label>
                    <input
                      type="text"
                      value={tyreWidth}
                      onChange={(e) => setTyreWidth(e.target.value)}
                      placeholder="195"
                      className="w-full bg-[#1C1D24] border border-white/10 rounded px-2 py-1 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-[#B8BBC4]">Profile</label>
                    <input
                      type="text"
                      value={tyreAspect}
                      onChange={(e) => setTyreAspect(e.target.value)}
                      placeholder="55"
                      className="w-full bg-[#1C1D24] border border-white/10 rounded px-2 py-1 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-[#B8BBC4]">Rim</label>
                    <input
                      type="text"
                      value={tyreRim}
                      onChange={(e) => setTyreRim(e.target.value)}
                      placeholder="R16"
                      className="w-full bg-[#1C1D24] border border-white/10 rounded px-2 py-1 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-[#B8BBC4]">Load</label>
                    <input
                      type="text"
                      value={tyreLoad}
                      onChange={(e) => setTyreLoad(e.target.value)}
                      placeholder="87"
                      className="w-full bg-[#1C1D24] border border-white/10 rounded px-2 py-1 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-[#B8BBC4]">Speed</label>
                    <input
                      type="text"
                      value={tyreSpeed}
                      onChange={(e) => setTyreSpeed(e.target.value)}
                      placeholder="V"
                      className="w-full bg-[#1C1D24] border border-white/10 rounded px-2 py-1 text-white"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[#B8BBC4] mb-1">Short Description *</label>
                <input
                  type="text"
                  required
                  value={prodShortDesc}
                  onChange={(e) => setProdShortDesc(e.target.value)}
                  className="w-full bg-[#14151B] border border-white/15 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-[#B8BBC4] mb-1">Full Description</label>
                <textarea
                  rows={3}
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                  className="w-full bg-[#14151B] border border-white/15 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-[#B8BBC4] mb-1">
                  Product Image URLs (comma-separated)
                </label>
                <input
                  type="text"
                  value={prodImageUrls}
                  onChange={(e) => setProdImageUrls(e.target.value)}
                  className="w-full bg-[#14151B] border border-white/15 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="inline-flex items-center gap-2 text-white">
                  <input
                    type="checkbox"
                    checked={prodFeatured}
                    onChange={(e) => setProdFeatured(e.target.checked)}
                    className="accent-[#F10D17]"
                  />
                  <span>Mark as Featured Product</span>
                </label>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowProductForm(false)}
                    className="px-4 py-2.5 rounded-lg bg-[#14151B] text-[#B8BBC4]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-lg bg-[#F10D17] text-white font-bold uppercase cursor-pointer"
                  >
                    Save Product
                  </button>
                </div>
              </div>
            </form>
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
