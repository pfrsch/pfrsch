import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import CompanyDashboard from './pages/CompanyDashboard'
import EmployeeProfile from './pages/EmployeeProfile'
import SearchEmployees from './pages/SearchEmployees'
import BookAppointment from './pages/BookAppointment'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<CompanyDashboard />} />
        <Route path="/search" element={<SearchEmployees />} />
        <Route path="/employee/:id" element={<EmployeeProfile />} />
        <Route path="/book/:employeeId" element={<BookAppointment />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
