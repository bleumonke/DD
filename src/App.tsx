import './App.css'
import { NAVIGATION_LINKS } from './data'
import { Sidebar } from './components/export'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// import Dashboard from './pages/Dashboard'
import Customers from './pages/Customers'
import Layouts from './pages/Layouts'
import LayoutDetails from './pages/LayoutDetails/LayoutDetails'
import PlotDetails from './pages/PlotDetails/PlotDetails'
import Pricing from './pages/Pricing'
import Coupons from './pages/Coupons'
import Login from './pages/Login/Login'

function Layout() {
  return (
    <div className="layout">
      <Sidebar links={NAVIGATION_LINKS} username="John Doe" />
      <div className="section">
        <Routes>
          {/* <Route path="/" element={<Dashboard />} /> */}
          <Route path="/customers" element={<Customers />} />
          <Route path="/layouts" element={<Layouts />} />
          <Route path="/layouts/:layoutId" element={<LayoutDetails />} />
          <Route path="/layouts/:layoutId/plots/:plotId" element={<PlotDetails />} />
          <Route path="/layouts/:layoutId/plots/new" element={<PlotDetails />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/coupons" element={<Coupons />} />
          <Route path="*" element={<Navigate to="/layouts" replace />} />
        </Routes>
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<Layout />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App