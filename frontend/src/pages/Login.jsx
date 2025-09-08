import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login(){
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [err, setErr] = React.useState('');
  const [show, setShow] = React.useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'https://ecommerce-website-backend-gq3h.onrender.com'}/api/auth/login`, { email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch (e) {
      setErr(e?.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: '24px auto' }} className="card">
      <h2>Sign in</h2>
      <form onSubmit={submit} style={{ display: 'grid', gap: 10, marginTop: 12 }}>
        <input className="input" required placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <div style={{ display: 'flex', gap: 8 }}>
          <input className="input" required type={show ? 'text' : 'password'} placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
          <button type="button" className="link-btn" onClick={()=>setShow(s=>!s)}>{show ? 'Hide' : 'Show'}</button>
        </div>
        {err && <div style={{ color: 'red' }}>{err}</div>}
        <button className="btn">Login</button>
      </form>
    </div>
  );
}
