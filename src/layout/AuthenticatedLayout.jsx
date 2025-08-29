import React, { useState } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'

const AuthenticatedLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className='layout-flex'>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="layout-padding w-full">
        <Header toggleSidebar={toggleSidebar} />

        <div className="content-wrapper content-padding">
          {children}
        </div>
      </div>
    </div>
  )
}

export default AuthenticatedLayout;
