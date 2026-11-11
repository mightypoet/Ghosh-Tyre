import express from 'express';
import fs from 'fs';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import {
  INITIAL_BANNERS,
  INITIAL_BLOGS,
  INITIAL_CATEGORIES,
  INITIAL_ENQUIRIES,
  INITIAL_PRODUCTS,
} from './src/data/initialData';
import {
  BlogArticle,
  CategoryItem,
  Enquiry,
  Product,
  PromotionalBanner,
} from './src/types';

interface DatabaseSchema {
  products: Product[];
  categories: CategoryItem[];
  banners: PromotionalBanner[];
  enquiries: Enquiry[];
  blogs: BlogArticle[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'store.json');

function loadDatabase(): DatabaseSchema {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      return {
        products: Array.isArray(parsed.products) ? parsed.products : INITIAL_PRODUCTS,
        categories: Array.isArray(parsed.categories) ? parsed.categories : INITIAL_CATEGORIES,
        banners: Array.isArray(parsed.banners) ? parsed.banners : INITIAL_BANNERS,
        enquiries: Array.isArray(parsed.enquiries) ? parsed.enquiries : INITIAL_ENQUIRIES,
        blogs: Array.isArray(parsed.blogs) ? parsed.blogs : INITIAL_BLOGS,
      };
    }
  } catch (err) {
    console.error('Error reading store.json, initializing fresh database:', err);
  }
  const initial: DatabaseSchema = {
    products: INITIAL_PRODUCTS,
    categories: INITIAL_CATEGORIES,
    banners: INITIAL_BANNERS,
    enquiries: INITIAL_ENQUIRIES,
    blogs: INITIAL_BLOGS,
  };
  saveDatabase(initial);
  return initial;
}

function saveDatabase(db: DatabaseSchema) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to persist store.json:', err);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '15mb' }));

  const db = loadDatabase();

  // Bootstrap endpoint for initial load
  app.get('/api/bootstrap', (_req, res) => {
    res.json(db);
  });

  // Admin authentication endpoint
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body || {};
    const validEmail = process.env.ADMIN_EMAIL || 'admin@ghoshtyre.com';
    const validPassword = process.env.ADMIN_PASSWORD || 'gtz@kolkata2026';

    if (
      (email?.toLowerCase() === validEmail.toLowerCase() ||
        email?.toLowerCase() === 'info@ghoshtyre.com') &&
      password === validPassword
    ) {
      return res.json({
        success: true,
        token: 'gtz-admin-session-token-2026',
        user: {
          email,
          name: 'Ghosh Tyre Zone Administrator',
          role: 'admin',
        },
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Invalid admin credentials. Please check your email and password.',
    });
  });

  // Products CRUD
  app.get('/api/products', (_req, res) => {
    res.json(db.products);
  });

  app.post('/api/products', (req, res) => {
    const newProduct: Product = {
      ...req.body,
      id: req.body.id || `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    db.products.unshift(newProduct);
    saveDatabase(db);
    res.status(201).json(newProduct);
  });

  app.put('/api/products/:id', (req, res) => {
    const idx = db.products.findIndex((p) => p.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ message: 'Product not found' });
    }
    db.products[idx] = { ...db.products[idx], ...req.body, id: req.params.id };
    saveDatabase(db);
    res.json(db.products[idx]);
  });

  app.delete('/api/products/:id', (req, res) => {
    const idx = db.products.findIndex((p) => p.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ message: 'Product not found' });
    }
    const removed = db.products.splice(idx, 1)[0];
    saveDatabase(db);
    res.json(removed);
  });

  // Blogs CRUD
  app.get('/api/blogs', (_req, res) => {
    res.json(db.blogs);
  });

  app.post('/api/blogs', (req, res) => {
    const newBlog: BlogArticle = {
      ...req.body,
      id: req.body.id || `blog-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    db.blogs.unshift(newBlog);
    saveDatabase(db);
    res.status(201).json(newBlog);
  });

  app.put('/api/blogs/:id', (req, res) => {
    const idx = db.blogs.findIndex((b) => b.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    db.blogs[idx] = { ...db.blogs[idx], ...req.body, id: req.params.id };
    saveDatabase(db);
    res.json(db.blogs[idx]);
  });

  app.delete('/api/blogs/:id', (req, res) => {
    const idx = db.blogs.findIndex((b) => b.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    const removed = db.blogs.splice(idx, 1)[0];
    saveDatabase(db);
    res.json(removed);
  });

  // Categories CRUD
  app.get('/api/categories', (_req, res) => {
    res.json(db.categories);
  });

  app.post('/api/categories', (req, res) => {
    const newCat: CategoryItem = {
      ...req.body,
      id: req.body.id || `cat-${Date.now()}`,
    };
    db.categories.push(newCat);
    saveDatabase(db);
    res.status(201).json(newCat);
  });

  app.put('/api/categories/:id', (req, res) => {
    const idx = db.categories.findIndex((c) => c.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ message: 'Category not found' });
    }
    db.categories[idx] = { ...db.categories[idx], ...req.body, id: req.params.id };
    saveDatabase(db);
    res.json(db.categories[idx]);
  });

  app.delete('/api/categories/:id', (req, res) => {
    const idx = db.categories.findIndex((c) => c.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ message: 'Category not found' });
    }
    const removed = db.categories.splice(idx, 1)[0];
    saveDatabase(db);
    res.json(removed);
  });

  // Promotional Banners update
  app.put('/api/banners/:id', (req, res) => {
    const idx = db.banners.findIndex((b) => b.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ message: 'Banner not found' });
    }
    db.banners[idx] = { ...db.banners[idx], ...req.body, id: req.params.id };
    saveDatabase(db);
    res.json(db.banners[idx]);
  });

  // Enquiries CRUD
  app.get('/api/enquiries', (_req, res) => {
    res.json(db.enquiries);
  });

  app.post('/api/enquiries', (req, res) => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newEnquiry: Enquiry = {
      id: req.body.id || `enq-${Date.now()}`,
      referenceNumber: req.body.referenceNumber || `GTZ-2026-${randomNum}`,
      type: req.body.type || 'product',
      customerName: req.body.customerName || '',
      phone: req.body.phone || '',
      email: req.body.email || '',
      city: req.body.city || 'Kolkata',
      state: req.body.state || 'West Bengal',
      pincode: req.body.pincode || '',
      vehicleType: req.body.vehicleType || '',
      vehicleModel: req.body.vehicleModel || '',
      serviceName: req.body.serviceName || '',
      items: Array.isArray(req.body.items) ? req.body.items : [],
      message: req.body.message || '',
      status: 'New',
      adminNotes: '',
      createdAt: new Date().toISOString(),
    };
    db.enquiries.unshift(newEnquiry);
    saveDatabase(db);
    res.status(201).json(newEnquiry);
  });

  app.put('/api/enquiries/:id', (req, res) => {
    const idx = db.enquiries.findIndex((e) => e.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ message: 'Enquiry not found' });
    }
    db.enquiries[idx] = {
      ...db.enquiries[idx],
      ...req.body,
      id: req.params.id,
    };
    saveDatabase(db);
    res.json(db.enquiries[idx]);
  });

  app.delete('/api/enquiries/:id', (req, res) => {
    const idx = db.enquiries.findIndex((e) => e.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ message: 'Enquiry not found' });
    }
    const removed = db.enquiries.splice(idx, 1)[0];
    saveDatabase(db);
    res.json(removed);
  });

  // Vite middleware in development or static dist in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Ghosh Tyre Zone server running on http://localhost:${PORT}`);
  });
}

startServer();
