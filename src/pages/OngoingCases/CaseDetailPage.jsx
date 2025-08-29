import React, { useState, useEffect } from "react";
import {
  Button,
  Dropdown,
  Spin,
  message,
} from "antd";
import {
  MoreOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import AuthenticatedLayout from "../../layout/AuthenticatedLayout";
import Breadcrumb from "./partials/Breadcrumb";
import oldman from "../../assets/icons/oldman.png";
import calender from "../../assets/icons/calender.png";
import flash from "../../assets/icons/bolt.png";
import SelectMedicalProvidersDemo from "./partials/SelectMedicalProvidersModal";
import { useNavigate, useParams } from "react-router-dom";
import { getSingleCase } from "../../services/cases";
import { formatDate } from "../../helper/formateDate";
import CaseDetailProviderCard from "./partials/CaseDetailProviderCard";
import { CaseActionMenu } from '../../components/shared/CaseActionMenu';
import { TasksTabs } from '../../components/TasksTabs';

const PatientStatusCard = ({ data, index }) => (
  <div
    className={` ${index == 3 ? "border-0" : "border-r"
      }  hover:shadow-md transition-shadow px-2`}
    size="small"
  >
    <div className="flex gap-2.5">
      <div className="p-3 rounded-lg bg-[#F2F4F7]">
        <img src={data?.img} alt="" className="h-4" />
      </div>
      <div>
        <p className="text-[#667085] font-normal text-xs">{data?.heading}</p>
        <div className="fs-14 fw-500 text-gray-54 whitespace-nowrap">
          {data?.name}
        </div>
      </div>
    </div>
  </div>
);

const CaseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCaseDetails();
  }, [id]);

  const getCaseDetails = () => {
    getSingleCase(id)
      .then((response) => {
        setCaseData(response.case);
        setLoading(false);
      })
      .catch((err) => {
        message.error(err?.message || "Failed to fetch single case data. Please try again later.");
        setLoading(false);
      });
  }

  const handleSuccess = () => {
    getCaseDetails();
  }

  const breadcrumbLinks = [
    { label: "Home", href: "/" },
    { label: "Ongoing Cases", href: "/ongoing-cases" },
    { label: "Case Details" },
  ];

  const items = [
    {
      id: 1,
      heading: "Patient",
      name: caseData?.fullName,
      img: oldman,
    },
    {
      id: 2,
      heading: "Case Status",
      name: caseData?.status,
      img: flash,
    },
    {
      id: 3,
      heading: "Date of Accident",
      name: formatDate(caseData?.dateOfAccident),
      img: calender,
    },
    {
      id: 4,
      heading: "Case Starting Date",
      name: formatDate(caseData?.startDate) || "Not started yet",
      img: calender,
    },
  ];

  const handleCaseUpdateSuccess = () => {
    getCaseDetails();
  };

  const handleDeleteCaseSuccess = () => {
    navigate("/ongoing-cases");
  };

  const onArchiveSucess = () => {
    navigate("/ongoing-cases");
  };

  const menu = <CaseActionMenu caseItem={caseData} handleDeleteCaseSuccess={handleDeleteCaseSuccess} onArchiveSucess={onArchiveSucess} handleCaseUpdateSuccess={handleCaseUpdateSuccess} />;

  return (
    <AuthenticatedLayout>
      <div className="lg:flex gap-2 justify-between">
        <p className="page-heading text-blue-39">Case Dashboard</p>
        <Breadcrumb links={breadcrumbLinks} />
      </div>

      {loading ? (
        <Spin size="large" />
      ) : (
        <div className="mt-6">
          <div className="relative mb-6">
            <div className="border border-yellow-300 bg-yellow-50 rounded-lg px-8 py-4 mb-6 w-fit">
              <div className="flex items-center gap-2">
                <ExclamationCircleOutlined className="text-yellow-500" />
                <span className="font-medium text-gray-800">
                  Treatment Status
                </span>
              </div>
              <p className="text-sm text-gray-500 ml-6">{caseData?.treatmentStatus}</p>
            </div>
          </div>

          <div className="flex justify-between items-center mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 p-4 border rounded-xl  max-w-[760px]">
              {items?.map((data, index) => (
                <PatientStatusCard data={data} index={index} />
              ))}
            </div>

            <div className="flex gap-2">
              <SelectMedicalProvidersDemo caseId={caseData?.id} handleSuccess={handleSuccess} />

              <Dropdown overlay={menu} trigger={["click"]}>
                <Button
                  type="text"
                  icon={<MoreOutlined />}
                  className="flex items-center justify-center"
                />
              </Dropdown>
            </div>
          </div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-gray-800">
              Medical Providers
            </h2>
          </div>
          {caseData?.doctors?.length > 0 ? (
            <div className="flex overflow-x-auto pb-4 -mx-4 px-4">
              <div className="flex space-x-4 min-w-max w-full">
                {caseData?.doctors?.map((provider, index) => (
                  <div key={index} className="w-80 flex-shrink-0">
                    <CaseDetailProviderCard provider={provider} />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                No doctors added yet?
              </h3>
              <p className="text-gray-500">
                The doctors will appear once they are added to the case.
              </p>
            </div>
          )}

          <TasksTabs
            caseItem={caseData}
          />
        </div>
      )}
    </AuthenticatedLayout>
  );
};

export default CaseDetailPage;
