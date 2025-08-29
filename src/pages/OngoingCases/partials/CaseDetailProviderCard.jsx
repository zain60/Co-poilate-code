import React from 'react';
import { useSelector } from 'react-redux';
import { DownloadOutlined } from "@ant-design/icons";

const CaseDetailProviderCard = ({ provider }) => {
  const { user } = useSelector((state) => state.auth);
  const isAttorney = user?.role === 'Attorney';
  return (
    <div> <div key={provider.id} className="flex flex-col w-full items-center gap-3 pt-2 pb-3 px-2 relative bg-white rounded-2xl overflow-hidden border border-solid border-[#e4e7ec]">
      <div className="flex flex-col items-start gap-3 p-4 self-stretch w-full bg-[#f8f9fb] rounded-lg relative flex-[0_0_auto]">
        <div className="flex items-start gap-3 justify-between w-full relative flex-[0_0_auto]">
          <div className="inline-flex flex-col items-start justify-center gap-1 relative flex-[0_0_auto]">
            <div className="relative w-fit mt-[-1.00px] fs-20 fw-700 text-blue-39">
              {provider.fullName || 'N/A'}
            </div>

            <div className="relative w-fit fs-14 fw-500 blue-light-b3 whitespace-nowrap">
              {provider.speciality || 'N/A'}
            </div>
          </div>
          {
            !isAttorney && (
              <div className="cursor-pointer inline-flex p-2 pr-0 items-center jstify-center gap-2 rounded-lg overflow-hidden shadow-shadow-xs">
                <div className="relative w-5 h-5">
                  <img
                    className="absolute w-3.5 h-3.5 top-0.5 left-1"
                    alt="Icon"
                    src="https://c.animaapp.com/m9vlz8e7aemWY8/img/icon.svg"
                  />
                </div>
              </div>
            )
          }
        </div>

        <div className="flex items-center gap-1 relative self-stretch w-full flex-[0_0_auto]">
          <div className="relative w-fit whitespace-nowrap fs-14 fw-400 text-blue-85">
            Treatment Status:
          </div>

          <div className={`inline-flex items-center justify-center px-2.5 py-0.5 relative flex-[0_0_auto] ${provider.treatmentStatus === "Pending" ? "bg-[#FFFAEB]" :
            provider.treatmentStatus === "In Progress" ? "bg-[#ecf3ff]" :
              provider.treatmentStatus === "Completed" ? "bg-[#ebfdf2]" :
                "bg-[#ebfdf2]"
            } rounded-[999px]`}>
            <div className={`relative w-fit mt-[-1.00px] fs-14 fw-500 ${provider.treatmentStatus === "Pending" ? "text-[#F59E42]" :
              provider.treatmentStatus === "In Progress" ? "text-[#465fff]" :
                provider.treatmentStatus === "Completed" ? "text-[#039754]" :
                  "text-gray-500"
              } text-center whitespace-nowrap `}>
              {provider.treatmentStatus === "" ? "Invite yet to be accepted" : provider.treatmentStatus}
            </div>
          </div>
        </div>
        {isAttorney ? (
          <div className="flex items-start gap-6 self-stretch w-full relative flex-[0_0_auto]">
            <button className={`all-[unset] box-border flex items-center justify-center gap-2 px-4 py-3 relative flex-1 grow rounded-lg overflow-hidden ${provider.medicalRecords && provider.treatmentStatus !== "Pending" ? "bg-[#039754]" :
              provider.treatmentStatus === "Pending" ? "bg-[#ecf3ff]" :
                "bg-[#ecf3ff]"
              }`}>
              <div className={`mt-[-1.00px] relative w-fit whitespace-nowrap fs-14 fw-500 mr-2 ml-2 ${provider.medicalRecords && provider.treatmentStatus !== "Pending" ? "text-white" :
                provider.treatmentStatus === "Pending" ? "text-[#465fff]" :
                  "text-[#465fff]"
                }`}>
                <>
                  {provider.medicalRecords && provider.treatmentStatus !== "Pending" ? <DownloadOutlined className="w-5 h-5" /> : ""}

                  Medical records
                </>
              </div>
            </button>

            <button className="all-[unset] box-border flex items-center justify-center gap-2 px-4 py-3 relative flex-1 grow rounded-lg overflow-hidden bg-[#ecf3ff]">
              <div className="mt-[-1.00px] relative w-fit whitespace-nowrap fs-14 fw-500 text-[#465fff]">
                Bills
              </div>
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-1 relative self-stretch w-full flex-[0_0_auto]">
              <div className="relative w-fit whitespace-nowrap fs-14 fw-400 text-blue-85">
                Bill Amount:
              </div>

              <div className={`fs-14 fw-500 text-gray-54 text-centerwhitespace-nowrap `}>
                {provider.billAmount || 'No Amount'}
              </div>
            </div>
            <div className="flex items-center gap-1 relative self-stretch w-full flex-[0_0_auto]">
              <div className="relative w-fit whitespace-nowrap fs-14 fw-400 text-blue-85">
                Reduced Amount:
              </div>

              <div className={`fs-14 text-gray-54 text-centerwhitespace-nowrap `}>
                {provider.reducedAmount || ' - '}
              </div>
            </div>
          </>
        )}
      </div>
    </div></div>
  )
}

export default CaseDetailProviderCard;
