import React from 'react';
import axios from 'axios';

export default function Cart(){
  const [cart, setCart] = React.useState([]);
  const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const load = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    const res = await axios.get(`${API}/api/cart`, { headers: { Authorization: `Bearer ${token}` }});
    setCart(res.data);
  };

  React.useEffect(()=>{ load(); }, []);

  const remove = async (id) => {
    const token = localStorage.getItem('token');
    await axios.delete(`${API}/api/cart/${id}`, { headers: { Authorization: `Bearer ${token}` }});
    load();
  };

  const updateQty = async (id, qty) => {
    const token = localStorage.getItem('token');
    await axios.put(`${API}/api/cart/update`, { cartItemId: id, qty }, { headers: { Authorization: `Bearer ${token}` }});
    load();
  };

  const totalItems = cart.reduce((s,c)=> s + c.qty, 0);
  const totalPrice = cart.reduce((s,c)=> s + c.qty * c.item.price, 0);

  return (
    <div className="card">
      <h2>Your Cart</h2>
      {cart.length === 0 ? <p>No items in cart.</p> : (
        <>
          <p><strong>Total Items:</strong> {totalItems} &nbsp; <strong>Total Price:</strong> ${totalPrice.toFixed(2)}</p>
          {cart.map(ci => (
            <div key={ci.id} style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 12 }}>
              <img src={ci.item.imageUrl||'https://via.placeholder.com/100'} alt="" style={{ width: 90, height: 70, objectFit: 'cover', borderRadius: 6 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700 }}>{ci.item.title}</div>
                <div style={{ color: '#6b7280' }}>${ci.item.price.toFixed(2)}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button onClick={()=>updateQty(ci.id, Math.max(1, ci.qty-1))}>-</button>
                <div>{ci.qty}</div>
                <button onClick={()=>updateQty(ci.id, ci.qty+1)}>+</button>
                <button style={{ color: 'red' }} onClick={()=>remove(ci.id)}>Remove</button>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
