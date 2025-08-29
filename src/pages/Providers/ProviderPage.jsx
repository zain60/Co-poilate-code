import React, { useEffect, useState } from 'react'
import AuthenticatedLayout from '../../layout/AuthenticatedLayout'
import { Button, Form, Input, Table } from 'antd'
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import AddNewProviderForm from './partials/AddNewProviderForm';
import Breadcrumb from '../../components/ui/Breadcrumb'
import { getAllProvider } from '../../services/cases';
import ProvidersTable from '../../components/shared/ProvidersTable';
import { message } from 'antd';

const ProviderPage = () => {
  const [form] = Form.useForm()
  const breadcrumbLinks = [
    { label: "Home", href: "/" },
    { label: "Providers" },
  ];

  const [isModalVisible, setIsModalVisible] = useState(false)

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  const handleSubmit = () => {
    setIsModalVisible(false)
    fetchAllProviders();
  }

  const [providersData, setProvidersData] = useState([]); // State to store cases
  const [error, setError] = useState(null); // State to store errors

  // Fetch all cases when the component mounts
  useEffect(() => {
    localStorage.setItem('currentPage', 'providers');

    fetchAllProviders();
  }, []);

  const fetchAllProviders = () => {
    getAllProvider()
      .then((response) => {
        const formattedProviders = response.map((item) => ({
          id: item.id?.toString() || "", // making sure id is string
          name: item.fullName || "",      // mapping fullName to name
          speciality: item.speciality || "",
          address: item.address || "",
          contact: item.phone || "",
          email: item.email || "",
          availability: item.availability || "Pending", // default to Available
        }));

        setProvidersData(formattedProviders);
      })

      .catch((err) => {
        message.error(err?.message || "Failed to fetch cases");
      });
  };
  const [searchText, setSearchText] = useState("")


  // Handle search input change
  const handleSearch = (e) => {
    setSearchText(e.target.value)
  }

  // Filter data based on search text
  const filteredData = searchText
    ? providersData.filter(
      (item) =>
        item.name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.speciality.toLowerCase().includes(searchText.toLowerCase()) ||
        item.email.toLowerCase().includes(searchText.toLowerCase()),
    )
    : providersData

  return (
    <AuthenticatedLayout>
      <div className='lg:flex gap-2 justify-between'>
        <p className='fs-20 fw-600 text-blue-39'>Providers</p>
        <Breadcrumb links={breadcrumbLinks} />
      </div>

      <div className=" bg-white rounded-xl shadow-sm mt-6  ">
        <div className="px-3 lg:px-6 py-2 lg:py-4 lg:flex xl:flex justify-between items-center relative">

          <div className="flex flex-col mb-">
            <h1 className="text-xl font-semibold text-gray-800">Medical Providers</h1>
          </div>

          <div className="flex  md:flex-row flex-col justify-between gap-4 mb-">
            <Input
              placeholder="Search providers..."
              prefix={<SearchOutlined className="text-gray-400" />}
              className=" md:max-w-md order-1 md:order-0"
              size="large"
              value={searchText}
              onChange={handleSearch}
              allowClear
            />
            <Button type="primary" onClick={showModal} icon={<PlusOutlined />} size="large" className="order-0 md:order-1 mt-2 md:mt-0 bg-blue-600 hover:bg-blue-700 h-11">
              Add medical provider
            </Button>
          </div>
        </div>

        <ProvidersTable
          providers={filteredData}
          pagination={true}
        />
      </div>

      <AddNewProviderForm form={form} visible={isModalVisible} onCancel={handleCancel} onSubmitSuccess={handleSubmit} />
    </AuthenticatedLayout>
  )
}

export default ProviderPage;
