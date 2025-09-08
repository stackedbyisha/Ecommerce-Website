import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key';
const users = [];
const items = [];
const cartItems = [];
let userIdSeq = 1, itemIdSeq = 1, cartIdSeq = 1;
(function seed() {
  const demoPass = bcrypt.hashSync('password123', 10);
  users.push({ id: userIdSeq++, email: 'demo@user.com', passwordHash: demoPass });
  // inside your seed section (replace existing seedItems array)
  const seedItems = [
    {
      id: 1,
      title: 'Classic Blue T-Shirt',
      description: 'Comfort cotton tee, perfect for daily wear.',
      price: 14.99,
      category: 'Clothing',
      imageUrl: 'https://images.unsplash.com/photo-1569271434539-87ce3bbbaa06?q=80&w=389&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    {
      id: 2,
      title: 'Red Running Sneakers',
      description: 'Lightweight sneakers for running and gym.',
      price: 59.99,
      category: 'Footwear',
      imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    {
      id: 3,
      title: 'Wireless Headphones Pro',
      description: 'Noise-cancelling over-ear headphones.',
      price: 129.00,
      category: 'Electronics',
      imageUrl: 'https://images.unsplash.com/photo-1628202926206-c63a34b1618f?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    {
      id: 4,
      title: 'Ceramic Coffee Mug',
      description: '350ml ceramic mug, microwave safe.',
      price: 9.50,
      category: 'Home',
      imageUrl: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 5,
      title: 'Running Shorts',
      description: 'Breathable shorts for workouts.',
      price: 21.00,
      category: 'Clothing',
      imageUrl: 'https://images.unsplash.com/photo-1554139844-af2fc8ad3a3a?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    {
      id: 6,
      title: 'Makeup Products',
      description: 'Eyeshadow-Palette, Brushes',
      price: 70.00,
      category: 'Beauty',
      imageUrl: 'https://images.unsplash.com/photo-1487412912498-0447578fcca8?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    {
      id: 7,
      title: 'Novels, Poetry, Non-fictional books',
      description: 'Read what you actually evolve.',
      price: 30.00,
      category: 'Books',
      imageUrl: 'https://images.unsplash.com/photo-1521056787327-165dc2a32836?q=80&w=725&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    {
      id: 8,
      title: 'Kundan Jewellery',
      description: 'Necklace, Non-Vanished',
      price: 150.00,
      category: 'Jewellery',
      imageUrl:'https://plus.unsplash.com/premium_photo-1709033404514-c3953af680b4?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' 
}
  ];

  for (const it of seedItems) { items.push({ id: itemIdSeq++, imageUrl: '', ...it }); }
  console.log('Seeded demo user and items');
})();
function signToken(payload) { return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' }); }
function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'No auth token' });
  const token = header.split(' ')[1];
  try { const data = jwt.verify(token, JWT_SECRET); req.user = data; next(); } catch (err) { return res.status(401).json({ error: 'Invalid token' }); }
}
app.post('/api/auth/signup', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing fields' });
  if (users.find(u => u.email === email)) return res.status(400).json({ error: 'Email exists' });
  const hash = await bcrypt.hash(password, 10);
  const user = { id: userIdSeq++, email, passwordHash: hash };
  users.push(user);
  const token = signToken({ id: user.id, email: user.email });
  res.json({ token, user: { id: user.id, email: user.email } });
});
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  const token = signToken({ id: user.id, email: user.email });
  res.json({ token, user: { id: user.id, email: user.email } });
});
app.post('/api/items', authMiddleware, (req, res) => {
  const { title, description, price, category, imageUrl } = req.body;
  const item = { id: itemIdSeq++, title, description, price: parseFloat(price), category, imageUrl: imageUrl || '' };
  items.push(item);
  res.json(item);
});
app.get('/api/items', (req, res) => {
  const { q, category, minPrice, maxPrice, page = 1, limit = 20 } = req.query;
  let result = [...items];
  if (q) { const qq = q.toLowerCase(); result = result.filter(it => it.title.toLowerCase().includes(qq) || (it.description || '').toLowerCase().includes(qq)); }
  if (category) result = result.filter(it => it.category === category);
  if (minPrice) result = result.filter(it => it.price >= parseFloat(minPrice));
  if (maxPrice) result = result.filter(it => it.price <= parseFloat(maxPrice));
  const total = result.length; const start = (parseInt(page) - 1) * parseInt(limit); result = result.slice(start, start + parseInt(limit));
  res.json({ items: result, total });
});
app.get('/api/items/:id', (req, res) => {
  const it = items.find(i => i.id === parseInt(req.params.id));
  if (!it) return res.status(404).json({ error: 'Not found' });
  res.json(it);
});
app.put('/api/items/:id', authMiddleware, (req, res) => {
  const it = items.find(i => i.id === parseInt(req.params.id));
  if (!it) return res.status(404).json({ error: 'Not found' });
  Object.assign(it, req.body);
  res.json(it);
});
app.delete('/api/items/:id', authMiddleware, (req, res) => {
  const idx = items.findIndex(i => i.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  items.splice(idx, 1);
  res.json({ success: true });
});
app.get('/api/cart', authMiddleware, (req, res) => {
  const userId = req.user.id;
  const userCart = cartItems.filter(ci => ci.userId === userId).map(ci => ({ id: ci.id, qty: ci.qty, item: items.find(i => i.id === ci.itemId) }));
  res.json(userCart);
});
app.post('/api/cart/add', authMiddleware, (req, res) => {
  const userId = req.user.id; const { itemId, qty = 1 } = req.body;
  const item = items.find(i => i.id === parseInt(itemId));
  if (!item) return res.status(404).json({ error: 'Item not found' });
  const existing = cartItems.find(ci => ci.userId === userId && ci.itemId === item.id);
  if (existing) { existing.qty = existing.qty + parseInt(qty); res.json(existing); }
  else { const ci = { id: cartIdSeq++, userId, itemId: item.id, qty: parseInt(qty) }; cartItems.push(ci); res.json(ci); }
});
app.put('/api/cart/update', authMiddleware, (req, res) => {
  const userId = req.user.id; const { cartItemId, qty } = req.body;
  const ci = cartItems.find(c => c.id === parseInt(cartItemId));
  if (!ci || ci.userId !== userId) return res.status(403).json({ error: 'Not allowed' });
  ci.qty = parseInt(qty);
  res.json(ci);
});
app.delete('/api/cart/:id', authMiddleware, (req, res) => {
  const userId = req.user.id; const id = parseInt(req.params.id);
  const idx = cartItems.findIndex(c => c.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  if (cartItems[idx].userId !== userId) return res.status(403).json({ error: 'Not allowed' });
  cartItems.splice(idx, 1);
  res.json({ success: true });
});
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
const express = require("express");
const cors = require("cors");
const app = express();

// Allow your frontend to access backend
app.use(cors({
  origin: "https://ecommercewebsite-isha.netlify.app",
  credentials: true, // if you are using cookies
}));

// Or temporarily allow all origins (for testing)
app.use(cors());
