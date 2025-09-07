import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Items from './pages/Items';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Navbar from './components/Navbar';
function PrivateRoute({ children }) { const token = localStorage.getItem('token'); return token ? children : <Navigate to='/login' />; }
export default function App(){ return (<><Navbar /><div className='container'><Routes><Route path='/' element={<Items/>} /><Route path='/cart' element={<PrivateRoute><Cart/></PrivateRoute>} /><Route path='/login' element={<Login/>} /><Route path='/signup' element={<Signup/>} /></Routes></div></>); }
