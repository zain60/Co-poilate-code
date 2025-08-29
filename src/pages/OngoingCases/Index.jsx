import React, { useEffect, useState } from "react";
import AuthenticatedLayout from "../../layout/AuthenticatedLayout";
import Breadcrumb from "./partials/Breadcrumb";
import { Button, Input } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import CaseCard from "./partials/CaseCard";
import AddNewCaseForm from "./partials/AddNewCaseForm";
import { getAllCases } from "../../services/cases";
import { useSelector } from "react-redux";
import { SelectMedicalProvidersModal } from "./partials/SelectMedicalProvidersModal";
import { message } from "antd";

const OngoingCases = () => {
  const user = useSelector((state) => state.auth.user); // Add this line to select the user

  const breadcrumbLinks = [
    { label: "Home", href: "/" },
    { label: "Ongoing Cases" },
  ];
  const [search, setSearch] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isProvidersModalVisible, setIsProvidersModalVisible] = useState(false);
  const [newCaseId, setNewCaseId] = useState(null);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const [cases, setCases] = useState(); // State to store cases
  const [error, setError] = useState(null); // State to store errors

  // Fetch all cases when the component mounts
  useEffect(() => {
    localStorage.setItem("currentPage", "ongoing");

    fetchAllCases();
  }, []);

  const fetchAllCases = () => {
    getAllCases(user?.id)
      .then((response) => {
        setCases(response?.cases);
      })
      .catch((err) => {
        message.error(err?.message || "Failed to fetch cases");
      });
  };

  const handleSuccess = () => {
    fetchAllCases();
  };

  const handleSubmitSuccess = (newCase) => {
    setIsModalVisible(false);
    setNewCaseId(newCase?.id);

    setCases((prevCases) => [newCase, ...prevCases]);
    setIsProvidersModalVisible(true);
  };

  const handleProvidersModalClose = () => {
    setIsProvidersModalVisible(false);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (searchTimeout) clearTimeout(searchTimeout);

    const timeout = setTimeout(() => {
      setSearchTerm(value);
    }, 300);

    setSearchTimeout(timeout);
  };

  const filteredCases = cases?.filter((caseItem) => {
    if (!searchTerm.trim()) return true;

    const searchLower = searchTerm.toLowerCase();
    return (
      caseItem?.fullName?.toLowerCase().includes(searchLower) ||
      caseItem?.caseNumber?.toLowerCase().includes(searchLower) ||
      caseItem?.caseType?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <AuthenticatedLayout>
      <div className="lg:flex gap-2 justify-between">
        <p className="fs-20 fw-600 text-blue-39">Ongoing Cases</p>
        <Breadcrumb links={breadcrumbLinks} />
      </div>

      <div className="p-6 bg-white rounded-xl shadow-sm mt-6  ">
        <div className="lg:flex xl:flex justify-between relative">
          <div className="flex flex-col mb-6">
            <h1 className="fs-16 fw-500 text-blue-39">Cases</h1>
            <p className="fs-14 fw-400 text-blue-85">
              First three cases are free, after that you will have to pay $50
              per case.
            </p>
          </div>

          <div className="flex  md:flex-row flex-col justify-between gap-4 mb-8">
            <Input
              placeholder="Search cases..."
              prefix={<SearchOutlined className="text-gray-400" />}
              className=" md:max-w-md mb-4 order-1 md:order-0"
              size="large"
              value={search}
              onChange={handleSearch}
              allowClear
            />
            <Button
              type="primary"
              onClick={showModal}
              icon={<PlusOutlined />}
              size="large"
              className="order-0 md:order-1 mt-2 md:mt-0 bg-blue-600 hover:bg-[#3641F5]"
            >
              Add New Case
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3  gap-4">
          {filteredCases?.map((caseItem) => (
            <CaseCard caseItem={caseItem} />
          ))}
        </div>
      </div>

      <AddNewCaseForm
        open={isModalVisible}
        onSubmitSuccess={handleSubmitSuccess}
        onClose={handleCancel}
      />

      <SelectMedicalProvidersModal
        visible={isProvidersModalVisible}
        onCancel={handleProvidersModalClose}
        caseId={newCaseId}
        setIsModalVisible={setIsProvidersModalVisible}
        handleSuccess={handleSuccess}
      />
    </AuthenticatedLayout>
  );
};

export default OngoingCases;
