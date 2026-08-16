import React from 'react'
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { FiHome, FiBox, FiList, FiDollarSign, FiBarChart2, FiSettings, FiLogOut, FiMenu, FiX } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'

export const AdminLayout: React.FC = () => {
  const { signOut, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false)

  const handleSignOut = async () => {
    await signOut()
    navigate('/admin/login')
  }

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: FiHome },
    { name: 'Products', path: '/admin/products', icon: FiBox },
    { name: 'Categories', path: '/admin/categories', icon: FiList },
    { name: 'Sales', path: '/admin/sales', icon: FiDollarSign },
    { name: 'Analytics', path: '/admin/analytics', icon: FiBarChart2 },
    { name: 'Settings', path: '/admin/settings', icon: FiSettings },
  ]

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

  return (
    <div className="flex h-screen bg-light-gray">
      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden" 
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-charcoal text-white transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-auto flex flex-col ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 bg-secondary-charcoal">
          <span className="text-xl font-bold">Admin Portal</span>
          <button onClick={toggleSidebar} className="md:hidden text-white focus:outline-none">
            <FiX className="h-6 w-6" />
          </button>
        </div>
        <div className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path !== '/admin' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                  isActive 
                    ? 'bg-orange text-white' 
                    : 'text-border-gray hover:bg-secondary-charcoal hover:text-white'
                }`}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </Link>
            )
          })}
        </div>
        <div className="p-4 border-t border-secondary-charcoal">
          <div className="mb-4 truncate text-sm text-border-gray">
            {user?.email}
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center w-full px-4 py-2 text-sm text-white bg-secondary-charcoal rounded-md hover:bg-opacity-80 transition-colors"
          >
            <FiLogOut className="h-4 w-4 mr-2" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header for mobile */}
        <header className="flex items-center justify-between h-16 px-4 bg-white border-b border-border-gray md:hidden">
          <button onClick={toggleSidebar} className="text-charcoal focus:outline-none p-2">
            <FiMenu className="h-6 w-6" />
          </button>
          <span className="text-lg font-semibold text-charcoal">Admin</span>
          <div className="w-10"></div> {/* Spacer for centering */}
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-light-gray p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
