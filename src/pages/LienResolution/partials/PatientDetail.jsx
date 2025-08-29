import React from 'react'
import SelectMedicalProvidersDemo from '../../OngoingCases/partials/SelectMedicalProvidersModal';
import { CaseActionMenu } from '../../../components/shared/CaseActionMenu';
import { Dropdown, Button, } from 'antd';
import { MoreOutlined } from "@ant-design/icons";
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../../../helper/formateDate';

const PatientDetail = ({ caseItem, handleSuccess }) => {
  const navigate = useNavigate();
  const handleDeleteCaseSuccess = () => {
    navigate('/lien-resolution');
    console.log("Case deleted successfully");
  };

  const handleArchiveSucess = () => {
    navigate('/lien-resolution');
    console.log("Case archived successfully");
  };

  const handleCaseUpdateSuccess = () => {
    console.log("Case updated successfully");
  };

  const caseMenu = <CaseActionMenu
    caseItem={caseItem}
    handleDeleteCaseSuccess={handleDeleteCaseSuccess}
    onArchiveSucess={handleArchiveSucess}
    handleCaseUpdateSuccess={handleCaseUpdateSuccess}
  />

  return (
    <div className="flex items-center justify-between relative flex-wrap gap-5">
      <div className="inline-flex items-start pl-0 pr-4 py-4 relative flex-[0_0_auto] bg-white rounded-2xl border border-solid border-[#e4e7ec]">
        <div className="inline-flex items-center gap-3 p-4 relative self-stretch flex-[0_0_auto] border-r [border-right-style:solid] border-[#e4e7ec]">
          <div className="inline-flex items-center gap-2.5 p-3 relative flex-[0_0_auto] bg-[#f2f3f6] rounded-lg overflow-hidden">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.025 5.57539C10.65 5.22539 10.15 5.02539 9.62495 5.02539H8.94995C7.87495 5.02539 6.87495 5.55039 6.27495 6.45039L5.99995 6.90039C5.97495 6.95039 5.92495 6.97539 5.87495 7.00039L4.17495 7.85039C3.64995 8.10039 3.32495 8.62539 3.32495 9.20039C3.32495 9.65039 3.52495 10.0504 3.84995 10.3504C4.02495 10.5004 4.24995 10.6254 4.47495 10.6754V15.2504C4.47495 15.5504 4.72495 15.8254 5.04995 15.8254C5.37495 15.8254 5.62495 15.5754 5.62495 15.2504V10.6254L6.02495 10.5754C6.42495 10.5254 6.77495 10.3504 7.07495 10.0754L7.44995 9.75039V15.2504C7.44995 15.5504 7.69995 15.8254 8.02495 15.8254C8.32495 15.8254 8.59995 15.5754 8.59995 15.2504V8.50039C8.59995 8.27539 8.47495 8.07539 8.27495 7.97539C8.07495 7.87539 7.82495 7.92539 7.67495 8.07539L6.32495 9.25039C6.19995 9.37539 6.02495 9.45039 5.84995 9.47539L5.49995 9.52539C5.39995 9.37539 5.22495 9.30039 5.04995 9.30039C4.87495 9.30039 4.69995 9.40039 4.59995 9.52539C4.52495 9.45039 4.47495 9.35039 4.47495 9.22539C4.47495 9.07539 4.54995 8.95039 4.69995 8.87539L6.39995 8.02539C6.62495 7.92539 6.82495 7.75039 6.94995 7.52539L7.24995 7.07539C7.62495 6.50039 8.27495 6.15039 8.97495 6.15039H9.64995C9.87495 6.15039 10.1 6.22539 10.275 6.40039C11.1 7.17539 11.5 8.60039 11.55 10.8254C11.55 11.3504 11.4 11.8754 11.1 12.3504L10.9 12.6254C10.55 13.1504 10.35 13.7754 10.35 14.4004V15.2504C10.35 15.5504 10.6 15.8254 10.925 15.8254C11.25 15.8254 11.5 15.5754 11.5 15.2504V14.3754C11.5 13.9754 11.625 13.5754 11.85 13.2254L12.05 12.9504C12.475 12.3004 12.7 11.5504 12.675 10.8004C12.625 8.22539 12.1 6.57539 11.025 5.57539Z" fill="#667085" />
              <path d="M8.57495 4.4502C9.74995 4.4502 10.7 3.5002 10.7 2.3252C10.7 1.1502 9.74995 0.200195 8.57495 0.200195C7.39995 0.200195 6.44995 1.1502 6.44995 2.3252C6.44995 3.4752 7.39995 4.4502 8.57495 4.4502ZM8.57495 1.3252C9.12495 1.3252 9.57495 1.7752 9.57495 2.3252C9.57495 2.8752 9.12495 3.3252 8.57495 3.3252C8.02495 3.3252 7.57495 2.8752 7.57495 2.3252C7.57495 1.7502 8.02495 1.3252 8.57495 1.3252Z" fill="#1C2434" />
            </svg>
          </div>

          <div className="inline-flex flex-col items-start justify-center gap-1 relative flex-[0_0_auto]">
            <div className="relative w-fit mt-[-1.00px] whitespace-nowrap fs-12 fw-400 text-blue-85">
              Patient
            </div>

            <div className="relative w-fit whitespace-nowrap fs-14 fw-500 text-gray-54">
              {caseItem?.fullName}
            </div>
          </div>
        </div>

        <div className="flex w-[175px] border-r [border-right-style:solid] border-[#e4e7ec] items-center gap-3 p-4 relative">
          <div className="inline-flex items-center gap-2.5 p-3 relative flex-[0_0_auto] bg-[#f2f3f6] rounded-lg overflow-hidden">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.1 15.5754C6.925 15.5754 6.775 15.5504 6.6 15.4754C6.125 15.2504 5.875 14.7504 5.975 14.2254L6.725 10.2504H2.15C1.725 10.2504 1.325 10.0004 1.125 9.62541C0.924996 9.25041 0.974996 8.77542 1.225 8.42542L6.85 0.900416C7.15 0.500416 7.65 0.350416 8.125 0.500416C8.6 0.650416 8.9 1.07542 8.9 1.57542V5.10042H13.85C14.3 5.10042 14.7 5.35042 14.875 5.75042C15.075 6.15042 15 6.62542 14.725 6.95042L7.975 15.1504C7.75 15.4254 7.425 15.5754 7.1 15.5754ZM7.75 1.57542L2.125 9.10042L7.4 9.12541C7.575 9.12541 7.725 9.20041 7.825 9.32541C7.925 9.45041 7.975 9.62542 7.95 9.80042L7.075 14.4504L7.1 14.4754L13.875 6.25042L8.35 6.22542C8.05 6.22542 7.775 5.97542 7.775 5.65042L7.75 1.57542Z" fill="#667085" />
            </svg>
          </div>

          <div className="inline-flex flex-col items-start justify-center gap-1 relative flex-[0_0_auto]">
            <div className="relative w-fit mt-[-1.00px] whitespace-nowrap fs-12 fw-400 text-blue-85">
              Case Status
            </div>

            <div className="inline-flex items-center justify-center px-2 py-0.5 relative flex-[0_0_auto] bg-[#ecf3ff] rounded-[999px]">
              <div className="relative w-fit mt-[-1.00px] text-[#465fff] text-center whitespace-nowrap fs-12 fw-500">
                {caseItem?.status}
              </div>
            </div>
          </div>
        </div>

        <div className="inline-flex items-center gap-3 p-4 relative self-stretch flex-[0_0_auto] border-r [border-right-style:solid] border-[#e4e7ec]">
          <div className="inline-flex items-center gap-2.5 p-3 relative flex-[0_0_auto] bg-[#f2f3f6] rounded-lg overflow-hidden">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 2.7498H12.675V2.2498C12.675 1.9498 12.425 1.6748 12.1 1.6748C11.775 1.6748 11.525 1.9248 11.525 2.2498V2.7498H4.45005V2.2498C4.45005 1.9498 4.20005 1.6748 3.87505 1.6748C3.55005 1.6748 3.30005 1.9248 3.30005 2.2498V2.7498H2.00005C1.15005 2.7498 0.425049 3.4498 0.425049 4.3248V12.7748C0.425049 13.6248 1.12505 14.3498 2.00005 14.3498H14C14.85 14.3498 15.575 13.6498 15.575 12.7748V4.2998C15.575 3.4498 14.85 2.7498 14 2.7498ZM2.00005 3.8748H3.32505V4.3498C3.32505 4.6498 3.57505 4.9248 3.90005 4.9248C4.22505 4.9248 4.47505 4.6748 4.47505 4.3498V3.8748H11.55V4.3498C11.55 4.6498 11.8 4.9248 12.125 4.9248C12.45 4.9248 12.7 4.6748 12.7 4.3498V3.8748H14C14.25 3.8748 14.45 4.0748 14.45 4.3248V5.89981H1.57505V4.3248C1.57505 4.0748 1.75005 3.8748 2.00005 3.8748ZM14 13.1998H2.00005C1.75005 13.1998 1.55005 12.9998 1.55005 12.7498V6.9998H14.425V12.7498C14.45 12.9998 14.25 13.1998 14 13.1998Z" fill="#667085" />
              <path d="M8.47504 8.24987C8.30004 8.14987 8.07504 8.14987 7.90004 8.27487L6.77504 9.02487C6.52504 9.19987 6.45004 9.54987 6.62504 9.79987C6.80004 10.0499 7.15004 10.1249 7.40004 9.94987L7.65004 9.77487V11.3749C7.65004 11.6749 7.90004 11.9499 8.22504 11.9499C8.52504 11.9499 8.80004 11.6999 8.80004 11.3749V8.74987C8.77504 8.54987 8.65004 8.34987 8.47504 8.24987Z" fill="#667085" />
            </svg>
          </div>

          <div className="inline-flex flex-col items-start justify-center gap-1 relative flex-[0_0_auto]">
            <div className="relative w-fit mt-[-1.00px] whitespace-nowrap fs-12 fw-400 text-blue-85">
              Date of Accident
            </div>

            <div className="relative w-fit whitespace-nowrap fs-14 fw-500 text-gray-54">
              {formatDate(caseItem?.dateOfAccident) || '-'}
            </div>
          </div>
        </div>

        <div className="inline-flex self-stretch flex-[0_0_auto] rounded-2xl overflow-hidden border-0 border-none items-center gap-3 p-4 relative">
          <div className="inline-flex items-center gap-2.5 p-3 relative flex-[0_0_auto] bg-[#f2f3f6] rounded-lg overflow-hidden">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 2.7498H12.675V2.2498C12.675 1.9498 12.425 1.6748 12.1 1.6748C11.775 1.6748 11.525 1.9248 11.525 2.2498V2.7498H4.45005V2.2498C4.45005 1.9498 4.20005 1.6748 3.87505 1.6748C3.55005 1.6748 3.30005 1.9248 3.30005 2.2498V2.7498H2.00005C1.15005 2.7498 0.425049 3.4498 0.425049 4.3248V12.7748C0.425049 13.6248 1.12505 14.3498 2.00005 14.3498H14C14.85 14.3498 15.575 13.6498 15.575 12.7748V4.2998C15.575 3.4498 14.85 2.7498 14 2.7498ZM2.00005 3.8748H3.32505V4.3498C3.32505 4.6498 3.57505 4.9248 3.90005 4.9248C4.22505 4.9248 4.47505 4.6748 4.47505 4.3498V3.8748H11.55V4.3498C11.55 4.6498 11.8 4.9248 12.125 4.9248C12.45 4.9248 12.7 4.6748 12.7 4.3498V3.8748H14C14.25 3.8748 14.45 4.0748 14.45 4.3248V5.89981H1.57505V4.3248C1.57505 4.0748 1.75005 3.8748 2.00005 3.8748ZM14 13.1998H2.00005C1.75005 13.1998 1.55005 12.9998 1.55005 12.7498V6.9998H14.425V12.7498C14.45 12.9998 14.25 13.1998 14 13.1998Z" fill="#667085" />
              <path d="M8.47504 8.24987C8.30004 8.14987 8.07504 8.14987 7.90004 8.27487L6.77504 9.02487C6.52504 9.19987 6.45004 9.54987 6.62504 9.79987C6.80004 10.0499 7.15004 10.1249 7.40004 9.94987L7.65004 9.77487V11.3749C7.65004 11.6749 7.90004 11.9499 8.22504 11.9499C8.52504 11.9499 8.80004 11.6999 8.80004 11.3749V8.74987C8.77504 8.54987 8.65004 8.34987 8.47504 8.24987Z" fill="#667085" />
            </svg>
          </div>

          <div className="inline-flex flex-col items-start justify-center gap-1 relative flex-[0_0_auto]">
            <div className="relative w-fit mt-[-1.00px] whitespace-nowrap fs-12 fw-400 text-blue-85">
              Case Starting Date
            </div>

            <div className="relative w-fit whitespace-nowrap fs-14 fw-500 text-gray-54">
              {formatDate(caseItem?.startDate) || '-'}
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <SelectMedicalProvidersDemo caseId={caseItem?.id} handleSuccess={handleSuccess} />

        <Dropdown overlay={caseMenu} trigger={["click"]}>
          <Button
            type="text"
            icon={<MoreOutlined />}
            className="flex items-center justify-center"
          />
        </Dropdown>
      </div>
    </div>
  )
}

export default PatientDetail