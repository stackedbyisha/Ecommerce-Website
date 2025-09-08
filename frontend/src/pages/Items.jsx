import React from 'react';
import axios from 'axios';
import ItemCard from '../components/ItemCard';
export default function Items() {
  const [items, setItems] = React.useState([]); const [q, setQ] = React.useState(''); const [category, setCategory] = React.useState(''); const [min, setMin] = React.useState(''); const [max, setMax] = React.useState(''); const API = import.meta.env.VITE_API_URL || 'https://ecommerce-website-backend-gq3h.onrender.com';
  React.useEffect(() => { fetchItems(); }, []);
  async function fetchItems() { const params = {}; if (q) params.q = q; if (category) params.category = category; if (min) params.minPrice = min; if (max) params.maxPrice = max; const res = await axios.get(`${API}/api/items`, { params }); setItems(res.data.items); }
  const addToCart = async (itemId) => { const token = localStorage.getItem('token'); if (!token) return alert('Please login to add items to cart'); await axios.post(`${API}/api/cart/add`, { itemId, qty: 1 }, { headers: { Authorization: `Bearer ${token}` } }); alert('Added to cart'); }
  return (<div><div className='card' style={{ marginBottom: 12 }}><div style={{ display: 'flex', gap: 8 }}><input className='input' placeholder='Search' value={q} onChange={e => setQ(e.target.value)} /><select className='input' value={category} onChange={e => setCategory(e.target.value)}><option value=''>All categories</option><option>Clothing</option><option>Footwear</option><option>Electronics</option><option>Home</option><option>Beauty</option><option>Books</option><option>Jewellery</option></select><input className='input' placeholder='Min' style={{ width: 80 }} value={min} onChange={e => setMin(e.target.value)} /><input className='input' placeholder='Max' style={{ width: 80 }} value={max} onChange={e => setMax(e.target.value)} /><button className='btn' onClick={fetchItems}>Filter</button></div></div><div className='grid'>{items.map(it => <ItemCard key={it.id} item={it} onAdd={addToCart} />)}</div></div>);
}
