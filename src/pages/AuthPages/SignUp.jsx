import React, { useState } from 'react'
import AuthLayout from './AuthPageLayout'
import { useNavigate } from 'react-router-dom'
import { message } from 'antd'; // Import message for showing validation error

const SignUp = () => {
    const [selectedRole, setSelectedRole] = useState('doctor'); // Default to doctor as shown in image
    const navigate = useNavigate();

    const handleRoleSelect = (role) => {
        setSelectedRole(role);
    };

    const handleContinue = () => {
        // Validate role selection
        if (!selectedRole) {
            message.error('Please select a role to continue');
            return;
        }

        if (selectedRole) {
            navigate('/personal-info', {
                state: { role: selectedRole }
            });
        }
    };

    return (
        <AuthLayout>
            <div className='card-bg'>
                <div className="flex flex-col form-width items-start gap-8 relative flex-[0_0_auto]">
                    <div className="flex flex-col items-start gap-3 relative self-stretch w-full flex-[0_0_auto]">
                        <p className="relative w-fit mt-[-1.00px] fs-12 fw-500 text-primary">
                            Step 1/3
                        </p>

                        <h4 className="text-blue-39">
                            Select your role
                        </h4>

                        <p className="fs-14 text-blue-85 fw-400">
                            How would you like to proceed?
                        </p>
                    </div>

                    <div className="flex flex-col items-start gap-5 relative self-stretch w-full flex-[0_0_auto]">
                        <div
                            className={`flex h-[114px]  items-center gap-5 p-6 relative self-stretch w-full rounded-2xl overflow-hidden border border-solid cursor-pointer transition-colors duration-200 ${selectedRole === 'doctor'
                                ? 'bg-[#ecf3ff] border-[#465fff]'
                                : 'bg-white border-[#e4e7ec] hover:bg-[#f8fafc]'
                                }`}
                            onClick={() => handleRoleSelect('doctor')}
                        >
                            <div className={`flex w-12 items-center justify-around gap-2.5 p-3 relative rounded-xl overflow-hidden transition-colors duration-200 ${selectedRole === 'doctor' ? 'bg-white' : 'bg-[#F2F4F7]'
                                }`}>
                                {/* <Sthethoscope className="!relative !w-6 !h-6" /> */}
                                <svg
                                    fill="none"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    width="24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M20.775 0.674805H18.375C17.925 0.674805 17.55 1.0498 17.55 1.4998V2.4373C17.55 2.8873 17.925 3.2623 18.375 3.2623C18.825 3.2623 19.2 2.8873 19.2 2.4373V2.3248H20.3625V8.8498C20.3625 11.1748 18.4875 13.0498 16.1625 13.0498H15.75C13.425 13.0498 11.55 11.1748 11.55 8.8498V2.3248H12.7125V2.4373C12.7125 2.8873 13.0875 3.2623 13.5375 3.2623C13.9875 3.2623 14.3625 2.8873 14.3625 2.4373V1.4998C14.3625 1.0498 13.9875 0.674805 13.5375 0.674805H11.1375C10.425 0.674805 9.82498 1.2748 9.82498 1.9873V8.88731C9.82498 12.0748 12.375 14.6623 15.5625 14.7748V19.4998C15.5625 20.6998 14.6625 21.6748 13.5375 21.6748H8.02498C6.82498 21.6748 5.84998 20.6998 5.84998 19.4998V16.4248C7.19998 16.0498 8.21248 14.8498 8.21248 13.3873C8.21248 11.6623 6.78748 10.2373 5.06248 10.2373C3.33748 10.2373 1.91248 11.6623 1.91248 13.3873C1.91248 14.8123 2.88748 16.0498 4.19998 16.4248V19.4998C4.19998 21.6373 5.92498 23.3623 8.06248 23.3623H13.6125C15.675 23.3623 17.325 21.6373 17.325 19.4998V14.6248C20.025 14.0998 22.0875 11.6998 22.0875 8.8498V1.9873C22.0875 1.2373 21.4875 0.674805 20.775 0.674805ZM3.59998 13.3498C3.59998 12.5248 4.27498 11.8873 5.06248 11.8873C5.84998 11.8873 6.52498 12.5623 6.52498 13.3498C6.52498 14.1748 5.84998 14.8123 5.06248 14.8123C4.27498 14.8123 3.59998 14.1748 3.59998 13.3498Z"
                                        fill="#1C2434"
                                    />
                                </svg>
                            </div>

                            <div className="flex items-end gap-5 relative flex-1 grow">
                                <div className="flex flex-col items-start gap-2 relative flex-1 grow">
                                    <h5 className={`relative self-stretch mt-[-1.00px] transition-colors duration-200 ${selectedRole === 'doctor' ? 'text-[#1D2939]' : 'text-[#667085]'
                                        }`}>
                                        Doctor
                                    </h5>
                                </div>
                            </div>
                        </div>

                        <div
                            className={`flex h-[114px] items-center gap-5 p-6 relative self-stretch w-full rounded-2xl overflow-hidden border border-solid cursor-pointer transition-colors duration-200 ${selectedRole === 'attorney'
                                ? 'bg-[#ecf3ff] border-[#465fff]'
                                : 'bg-white border-[#e4e7ec] hover:bg-[#f8fafc]'
                                }`}
                            onClick={() => handleRoleSelect('attorney')}
                        >
                            <div className={`flex w-12 items-center justify-around gap-2.5 p-3 relative rounded-xl overflow-hidden transition-colors duration-200 ${selectedRole === 'attorney' ? 'bg-white' : 'bg-[#F2F4F7]'
                                }`}>
                                {/* <Jurisdiction className="!relative !w-6 !h-6" /> */}
                                <svg
                                    fill="none"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    width="24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M22.2276 14.6998L17.3907 10.1998L19.0522 8.69983C19.5322 8.28733 19.7907 7.64983 19.8276 7.01233C19.8276 6.37483 19.6061 5.73733 19.163 5.28733L17.2799 3.37483C16.8369 2.92483 16.2092 2.66233 15.5815 2.69983C14.9538 2.69983 14.363 2.99983 13.9199 3.48733L11.0769 6.71233C11.0399 6.74983 10.9661 6.82483 10.9292 6.86233L7.75378 9.74983C7.27378 10.1623 7.01532 10.7998 6.97839 11.4373C6.97839 12.0748 7.19993 12.7123 7.64301 13.1623L9.52609 15.0748C9.96916 15.5248 10.5599 15.7498 11.1507 15.7498C11.1876 15.7498 11.1876 15.7498 11.2245 15.7498C11.8522 15.7498 12.443 15.4498 12.8861 14.9623L14.363 13.2748L18.7938 18.1873C19.2369 18.6748 19.8645 18.9748 20.5292 18.9748H20.5661C21.2307 18.9748 21.8215 18.7123 22.2645 18.2623C22.7445 17.7748 23.003 17.1373 22.9661 16.4623C23.003 15.7873 22.7076 15.1498 22.2276 14.6998ZM11.6307 13.8373C11.5199 13.9873 11.3353 14.0623 11.1507 14.0623C10.9661 14.0623 10.8184 13.9873 10.6707 13.8748L8.78762 11.9623C8.67686 11.8498 8.60301 11.6623 8.60301 11.4748C8.60301 11.2873 8.67686 11.1373 8.82455 10.9873L11.9999 8.09983C12.1107 8.02483 12.1845 7.91233 12.2953 7.79983L15.1384 4.57483C15.2492 4.42483 15.4338 4.34983 15.6184 4.34983C15.6184 4.34983 15.6184 4.34983 15.6553 4.34983C15.8399 4.34983 15.9876 4.42483 16.0984 4.53733L17.9815 6.44983C18.0922 6.56233 18.1661 6.74983 18.1661 6.93733C18.1661 7.12483 18.0922 7.27483 17.9445 7.42483L14.7692 10.3123C14.6584 10.3873 14.5845 10.4998 14.4738 10.6123L11.6307 13.8373ZM21.1199 17.0623C20.9722 17.2123 20.7876 17.2873 20.5661 17.2873C20.3446 17.2873 20.1599 17.2123 20.0122 17.0248L15.4707 12.0373L15.7292 11.7373C15.7661 11.6998 15.8399 11.6248 15.8769 11.5873L16.1722 11.3248L21.1199 15.9373C21.2676 16.0873 21.3784 16.2748 21.3784 16.4998C21.3415 16.7248 21.2676 16.9123 21.1199 17.0623Z"
                                        fill="#1C2434"
                                    />

                                    <path
                                        d="M14.3261 19.6123H1.80919C1.36611 19.6123 0.959961 19.9873 0.959961 20.4748C0.959961 20.9623 1.32919 21.3373 1.80919 21.3373H14.2892C14.7323 21.3373 15.1384 20.9623 15.1384 20.4748C15.1384 19.9873 14.7692 19.6123 14.3261 19.6123Z"
                                        fill="#1C2434"
                                    />
                                </svg>
                            </div>

                            <div className="flex items-end gap-5 relative flex-1 grow">
                                <div className="flex flex-col items-start gap-2 relative flex-1 grow">
                                    <h5 className={`relative self-stretch mt-[-1.00px] transition-colors duration-200 ${selectedRole === 'attorney' ? 'text-[#1D2939]' : 'text-[#667085]'
                                        }`}>
                                        Attorney
                                    </h5>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-5 relative self-stretch w-full flex-[0_0_auto]">
                        <button
                            className="btn btn-primary w-full"
                            onClick={handleContinue}
                        >
                            Continue
                        </button>

                        <p className="relative w-fit font-normal text-transparent text-sm tracking-[0] leading-[14px]">
                            <span className="text-[#344053] leading-5">
                                Already have an account?{" "}
                            </span>

                            <a href="/" className="font-[number:var(--text-sm-medium-font-weight)] text-[#465fff] leading-[var(--text-sm-medium-line-height)] font-text-sm-medium [font-style:var(--text-sm-medium-font-style)] tracking-[var(--text-sm-medium-letter-spacing)] text-[length:var(--text-sm-medium-font-size)]">
                                Sign In
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </AuthLayout>
    )
}

export default SignUp