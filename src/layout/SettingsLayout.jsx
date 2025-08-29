import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import AuthenticatedLayout from '../layout/AuthenticatedLayout'
import { Icons } from '../components/svg/Icons';

const SettingsLayout = ({ children }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const breadcrumbLinks = [
    { label: "Home", href: "/" },
    { label: "Ongoing Cases" },
  ];

  return (
    <AuthenticatedLayout>
      <div className='flex justify-between items-center gap-2 pb-6'>
        <p className='fs-20 fw-600 text-blue-39'>Settings</p>
        <div className="flex items-center gap-1.5">
          <p className='fs-14 fw-400 text-[#667085]'>Home</p>
          <Icons.ArrowRightIcon />
          <p className='fs-14 fw-400 text-[#1D2939]'>Settings</p>
        </div>
      </div>
      <div className="content-card-bg p--24">
        <div className="setting-layout-div mb-6 overflow-x-auto">
          <Link to="/settings/profile" className={`setting-layout-link ${currentPath === "/settings/profile" ? "active" : ""}`}>Profile</Link>
          <Link to="/settings/password" className={`setting-layout-link ${currentPath === "/settings/password" ? "active" : ""}`}>Password</Link>
          <Link to="/settings/intake-setting" className={`setting-layout-link ${currentPath === "/settings/intake-setting" ? "active" : ""}`}>Intake Setting</Link>
          <Link to="/settings/payment" className={`setting-layout-link ${currentPath === "/settings/payment" ? "active" : ""}`}>Payment Method</Link>
          <Link to="/settings/my-documents" className={`setting-layout-link ${currentPath === "/settings/my-documents" ? "active" : ""}`}>My Documents</Link>
          <Link to="/settings/create-documents" className={`setting-layout-link ${currentPath === "/settings/create-documents" ? "active" : ""}`}>Create Documents</Link>
          <Link to="/settings/sign-documents" className={`setting-layout-link ${currentPath === "/settings/sign-documents" ? "active" : ""}`}>Sign Documents</Link>
          <Link to="/settings/twilio" className={`setting-layout-link ${currentPath === "/settings/twilio" ? "active" : ""}`}>Purchase Number</Link>
          <Link to="/settings/vapi-assistant" className={`setting-layout-link ${currentPath === "/settings/vapi-assistant" ? "active" : ""}`}>Knowledge Base</Link>
          <Link to="/settings/campaigns" className={`setting-layout-link ${currentPath === "/settings/campaigns" ? "active" : ""}`}>Campaigns</Link>
        </div>
        {children}
      </div>
    </AuthenticatedLayout>
  )
}

export default SettingsLayout