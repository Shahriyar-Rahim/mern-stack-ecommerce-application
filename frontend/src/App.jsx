import { useState } from 'react'
import './App.css'
import { Outlet } from 'react-router'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  return (
    <>
    <NavBar />
    <main className='min-h-screen'>
      <Outlet/>
    </main>
    <ToastContainer position="top-right" autoClose={3000} />
    <Footer />
    </>
  )
}

export default App
