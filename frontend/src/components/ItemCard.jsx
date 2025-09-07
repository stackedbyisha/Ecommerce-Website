import React from 'react';

export default function ItemCard({ item, onAdd }) {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <img
        className="product-img"
        src={item.imageUrl}  // ab backend se guaranteed hai
        alt={item.title}
        style={{ borderRadius: 8, objectFit: 'cover', height: 180 }}
      />
      <div style={{ marginTop: 10 }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>{item.title}</h3>
        <div style={{ color: '#6b7280', fontSize: 14, marginTop: 2 }}>{item.category}</div>
        <p style={{ color: '#475569', fontSize: 14, marginTop: 6 }}>{item.description}</p>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
        <div style={{ fontWeight: 700, fontSize: 16 }}>${item.price.toFixed(2)}</div>
        <button
          className="btn"
          onClick={() => onAdd(item.id)}
          style={{ padding: '6px 12px', fontSize: 14 }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

