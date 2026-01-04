import React from 'react'
import { createBrowserRouter, Route, Routes } from 'react-router'
import App from '../App';

const router = createBrowserRouter ([
    <Routes>
        <Route path="/" element={<App />} />
    </Routes>

]);

export default router