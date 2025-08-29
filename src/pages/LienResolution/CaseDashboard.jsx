import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '../../layout/AuthenticatedLayout';
import Breadcrumb from '../../components/ui/Breadcrumb';
import PatientDetail from './partials/PatientDetail';
import { useParams } from 'react-router-dom';
import EditProviderModal from './partials/EditProviderModal';
import NegotiateAmountModal from './partials/NegotiateAmountModal';
import { TasksTabs } from '../../components/TasksTabs';
import { Button, message } from 'antd';
import { getSingleCase } from '../../services/cases';

const CaseDashboard = () => {
  const caseId = useParams()['case-id'];
  const [caseItem, setCaseItem] = useState(null);

  useEffect(() => {
    getCase();
  }, [caseId]);

  const [selectedProvider, setSelectedProvider] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isNegotiateModalVisible, setIsNegotiateModalVisible] = useState(false);
  const [negotiateLoading, setNegotiateLoading] = useState(false);

  const handleEditProvider = (provider) => {
    setSelectedProvider(provider);
    setIsEditModalVisible(true);
  };

  const handleSaveProvider = (updatedProvider) => {
    setIsEditModalVisible(false);
    setSelectedProvider(null);
  };

  const handleNegotiateSubmit = async (values) => {
    try {
      setNegotiateLoading(true);
      message.success('Negotiation offer submitted successfully');
      setIsNegotiateModalVisible(false);
    } catch (error) {
      message.error('Failed to submit negotiation offer');
    } finally {
      setNegotiateLoading(false);
    }
  };

  const handleNegotiateClick = (provider) => {
    setSelectedProvider(provider);
    setIsNegotiateModalVisible(true);
  };

  const breadcrumbLinks = [
    { label: "Home", href: "/" },
    { label: "Lien Resolution", href: "/" },
    { label: "Case Details" },
  ];

  const handleSuccess = () => {
    getCase();
  }

  const getCase = () => {
    getSingleCase(caseId)
      .then((response) => {
        setCaseItem(response?.case);
      })
      .catch((error) => {
        message.error(error?.message || "Error fetching case details");
      });
  }

  return (
    <AuthenticatedLayout>
      <div className='lg:flex gap-2 justify-between'>
        <p className='fs-20 fw-600 text-blue-39'>Case Dashboard</p>
        <Breadcrumb links={breadcrumbLinks} />
      </div>

      <div className='mt-6'>
        <PatientDetail caseItem={caseItem} handleSuccess={handleSuccess} />
      </div>
      <div className="mt-6">
        <p className='fs-16 fw-500 text-blue-39'>Medical Providers</p>
        {/* -----------------------------------------------------------------  */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 lg:gap-4 xl:gap-6 mt-3 relative ">
          {caseItem?.doctors?.map((provider) => (
            <div key={provider.id} className="flex flex-col w-full items-center gap-3 pt-2 pb-3 px-2 relative bg-white rounded-2xl overflow-hidden border border-solid border-[#e4e7ec]">
              <div className="flex flex-col items-start gap-3 p-4 self-stretch w-full bg-[#f8f9fb] rounded-lg relative flex-[0_0_auto]">
                <div className="flex items-start gap-3 justify-between w-full relative flex-[0_0_auto]">
                  <div className="inline-flex flex-col items-start justify-center gap-1 relative flex-[0_0_auto]">
                    <div className="relative w-fit mt-[-1.00px] fs-20 fw-700 text-blue-39">
                      {provider.fullName}
                    </div>

                    <div className="relative w-fit fs-14 fw-500 blue-light-b3 whitespace-nowrap">
                      {provider.specialty}
                    </div>
                  </div>
                  {/* here */}
                  <button
                    onClick={() => handleEditProvider(provider)}
                    className="inline-flex p-2 pr-0 items-center justify-center gap-2 rounded-lg overflow-hidden hover:bg-gray-100 transition-colors"
                    aria-label="Edit provider"
                  >
                    <div className="relative w-5 h-5">
                      <img
                        className="absolute w-3.5 h-3.5 top-0.5 left-1"
                        alt="Edit"
                        src="https://c.animaapp.com/m9vlz8e7aemWY8/img/icon.svg"
                      />
                    </div>
                  </button>
                </div>

                <div className="flex items-center gap-1 relative self-stretch w-full flex-[0_0_auto]">
                  <div className="relative w-fit whitespace-nowrap fs-14 fw-400 text-blue-85">
                    Treatment Status:
                  </div>

                  <div className={`inline-flex items-center justify-center px-2.5 py-0.5 relative flex-[0_0_auto] ${provider.treatmentStatus === "Completed" ? "bg-[#ECFDF3]" : "bg-[#ecf3ff]"} rounded-[999px]`}>
                    <div className={`relative w-fit mt-[-1.00px] fs-14 fw-500 ${provider.treatmentStatus === "Completed" ? "text-[#039855]" : "text-[#465fff]"} text-center  whitespace-nowrap `}>
                      {provider.treatmentStatus}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 relative self-stretch w-full flex-[0_0_auto]">
                  <div className="relative w-fit whitespace-nowrap fs-14 fw-400 text-blue-85">
                    Lien Offer:
                  </div>

                  <div className={`inline-flex items-center justify-center px-2.5 py-0.5 relative flex-[0_0_auto] rounded-[999px] ${provider.offerAmount
                    ? "bg-[#ecf3ff] text-[#465fff]"
                    : "bg-[#FFFAEB] text-[#DC6803]"
                    }`}>
                    <div className="mt-[-1.00px] text-center relative w-fit whitespace-nowrap fs-14 fw-500">
                      {provider.offerAmount ? 'In Progress' : 'Pending'}
                    </div>
                  </div>
                </div>

                <div className="flex items-end justify-between relative self-stretch w-full flex-[0_0_auto]">
                  <div className="inline-flex flex-col items-start justify-center gap-1 relative flex-[0_0_auto]">
                    <div className="inline-flex items-center gap-1 relative flex-[0_0_auto]">
                      <div className="relative w-fit mt-[-1.00px] whitespace-nowrap fs-14 fw-400 text-blue-85">
                        Bill Amount:
                      </div>

                      <div className="mt-[-1.00px] relative w-fit  whitespace-nowrap fs-14 fw-500 text-gray-54">
                        - ${provider.offerAmount}
                      </div>
                    </div>

                    <div className="inline-flex items-center gap-1 relative flex-[0_0_auto]">
                      <div className="relative w-fit mt-[-1.00px] whitespace-nowrap fs-14 fw-400 text-blue-85">
                        Reduced Amount:
                      </div>

                      <div className="mt-[-1.00px] text-[#344054] relative w-fit  whitespace-nowrap fs-14 fw-500">
                        {provider.reducedAmount === "-" ? "-" : provider.reducedAmount? `$${provider.reducedAmount}`:"-"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-6 self-stretch w-full relative flex-[0_0_auto]">
                  <button className="all-[unset] box-border flex items-center justify-center gap-2 px-4 py-3 relative flex-1 grow rounded-lg overflow-hidden border border-solid border-[#e4e7ec]">
                    <div className="mt-[-1.00px] relative w-fit whitespace-nowrap fs-14 fw-500 text-gray-54">
                      Medical records
                    </div>
                  </button>

                  <button className="all-[unset] box-border flex items-center justify-center gap-2 px-4 py-3 relative flex-1 grow rounded-lg overflow-hidden border border-solid border-[#e4e7ec]">
                    <div className="mt-[-1.00px] relative w-fit whitespace-nowrap fs-14 fw-500 text-gray-54">
                      Bills
                    </div>
                  </button>
                </div>
              </div>

              <div className="flex flex-col w-[90%] items-start gap-2.5 relative flex-[0_0_auto]">
                <Button
                  type="primary"
                  className="w-full bg-blue-600 hover:bg-blue-700 h-11 flex items-center justify-center"
                  onClick={() => handleNegotiateClick(provider)}
                >
                  <span className="text-white">Negotiate Amount</span>
                </Button>
              </div>
            </div>
          ))}
        </div>

        <TasksTabs
          caseItem={caseItem}
        />
        {/* -----------------------------------------------------------------  */}
      </div>
      <EditProviderModal
        provider={selectedProvider}
        visible={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        onSave={handleSaveProvider}
      />

      <NegotiateAmountModal
        caseId={caseItem?.id}
        visible={isNegotiateModalVisible}
        onCancel={() => setIsNegotiateModalVisible(false)}
        onSave={handleNegotiateSubmit}
        loading={negotiateLoading}
        provider={selectedProvider}
        currentAmount={selectedProvider?.billAmount ? parseFloat(selectedProvider.billAmount.replace(/[^0-9.-]+/g, '')) : 0}
      />
    </AuthenticatedLayout>
  )
}

export default CaseDashboard