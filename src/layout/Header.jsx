import React from 'react'
import { Icons } from '../components/svg/Icons'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux';
import placeholder from '../assets/img/placeholder.png'

const Header = ({ toggleSidebar }) => {
  const user = useSelector((state) => state.auth.user); // user from store
  return (
    <div className='bg-white py-4 pr-6 border-b [border-bottom-style:solid] border-[#e4e7ec] sticky top-0 z-[1]'>
      <div className='content-wrapper'>
        <div className="flex w-full items-center justify-between relative">
          {/* Hamburger menu for mobile and tablet */}
          <button 
            className="lg:hidden pl-6 text-gray-700 hover:text-gray-900"
            onClick={toggleSidebar}
          >
            <Icons.MenuIcon />
          </button>
          
          <div className="inline-flex items-center gap-4 relative flex-[0_0_auto] profile-header ml-auto">
            <div className="inline-flex items-start gap-3 relative flex-[0_0_auto]">
              {/* <Link className="inline-flex items-center gap-2.5 p-3 relative flex-[0_0_auto] bg-white rounded-[999px] border border-solid border-[#e4e7ec]">
                <Icons.MoonIcon />
              </Link> */}

              {/* <Link className="inline-flex items-center gap-2.5 p-3 relative flex-[0_0_auto] bg-white rounded-[999px] border border-solid border-[#e4e7ec]">
                <div className="absolute w-3 h-3 top-px left-[31px] bg-[#fd8439] rounded-md border-2 border-solid border-white" />
                <div className="relative w-5 h-5">
                  <Icons.notificationIcon />
                </div>
              </Link> */}
            </div>

            <Link to='/settings/profile' className="inline-flex items-center gap-3 relative flex-[0_0_auto]">
              <img src={placeholder} className="relative w-11 h-11 rounded-[200px]  *: bg-cover bg-[50%_50%]" />

              <div className="inline-flex items-center gap-1 relative flex-[0_0_auto]">
                <div className="relative w-fit mt-[-1.00px] font-text-sm-medium font-[number:var(--text-sm-medium-font-weight)] text-[#344053] text-[length:var(--text-sm-medium-font-size)] tracking-[var(--text-sm-medium-letter-spacing)] leading-[var(--text-sm-medium-line-height)] whitespace-nowrap [font-style:var(--text-sm-medium-font-style)]">
                 {user?.fullName || 'User'}
                </div>

                <div className="inline-flex items-center gap-2.5 pt-0.5 pb-0 px-0 relative flex-[0_0_auto]">
                  {/* <ArrowDown className="!relative !w-[18px] !h-[18px]" /> */}
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header