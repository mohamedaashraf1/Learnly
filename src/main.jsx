import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import { LearnProvider } from './data/learn.jsx'
import Nav from './components/Nav.jsx'
import Home from './pages/Home.jsx'
import Course from './pages/Course.jsx'
import Dashboard from './pages/Dashboard.jsx'
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <LearnProvider>
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/course/:id" element={<Course />} />
          <Route path="/my-learning" element={<Dashboard />} />
        </Routes>
      </LearnProvider>
    </HashRouter>
  </React.StrictMode>
)
