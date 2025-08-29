import React from 'react'
import { Icons } from '../../components/svg/Icons'
import { useNavigate, useLocation } from 'react-router-dom'

const AuthPageLayout = ({ children, fullHeight }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const showBackButton = location.pathname !== '/'

  const goback = () => {
    navigate(-1)
  }
  return (
    <div className="pt--70">
      <div className='container-auth'>
        {showBackButton && (
          <div onClick={goback} className='cursor-pointer flex items-center gap-1'>
            <Icons.BackIcon />
            <p className='text-gray-54 fs-14'>Back</p>
          </div>
        )}
        <div className={`auth-layout ${fullHeight ? 'h-100' : 'h-screen-100'}`}>
          {children}
        </div>
      </div>
    </div>
  )
}

export default AuthPageLayout;
