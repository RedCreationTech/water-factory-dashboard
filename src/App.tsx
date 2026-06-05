import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Overview from './pages/Overview'
import Process from './pages/Process'
import Aeration from './pages/Aeration'
import Energy from './pages/Energy'
import Equipment from './pages/Equipment'
import WaterQuality from './pages/WaterQuality'
import Reports from './pages/Reports'
import System from './pages/System'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/process" element={<Process />} />
        <Route path="/aeration" element={<Aeration />} />
        <Route path="/energy" element={<Energy />} />
        <Route path="/equipment" element={<Equipment />} />
        <Route path="/water-quality" element={<WaterQuality />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/system" element={<System />} />
      </Routes>
    </Layout>
  )
}
