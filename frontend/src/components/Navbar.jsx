import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Navbar(){
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [count, setCount] = React.useState(0);

  React.useEffect(()=>{
    let mounted = true;
    if(token){
      axios.get(`${import.meta.env.VITE_API_URL || 'https://ecommerce-website-backend-gq3h.onrender.com'}/api/cart`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => { if(mounted) setCount(res.data.reduce((s,c)=> s + c.qty, 0)); })
      .catch(()=> { if(mounted) setCount(0); });
    } else {
      setCount(0);
    }
    return ()=> mounted = false;
  }, [token]);

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="header container">
      <div className="logo">Ecom Pro.</div>
      <div className="nav-actions">
        <Link to="/" className="link-btn">Products</Link>
        <Link to="/cart" className="link-btn">
          Cart <span style={{marginLeft:8}} className="cart-badge">{count}</span>
        </Link>
        {token ? (
          <button className="btn" onClick={logout}>Logout</button>
        ) : (
          <>
            <Link to="/login"><button className="link-btn">Login</button></Link>
            <Link to="/signup"><button className="btn">Sign up</button></Link>
          </>
        )}
      </div>
    </div>
  );
}


