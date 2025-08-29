import { useEffect, useState } from "react"
import { Modal, Input, Button } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import ProvidersTable from '../../../components/shared/ProvidersTable';
import { addDoctorToCase, getAllProvider } from "../../../services/cases"
import { message } from 'antd';

export const SelectMedicalProvidersModal = ({ caseId, visible, onCancel, setIsModalVisible, handleSuccess }) => {
  const [searchText, setSearchText] = useState("")
  const [providersData, setProvidersData] = useState([])
  const [selectedRows, setSelectedRows] = useState(new Set())

  const handleRowSelect = (e, id) => {
    const newSelectedRows = new Set(selectedRows)
    if (e.target.checked) {
      newSelectedRows.add(id)
    } else {
      newSelectedRows.delete(id)
    }
    setSelectedRows(newSelectedRows)
  }

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = filteredData.map(item => item.id)
      setSelectedRows(new Set(allIds))
    } else {
      setSelectedRows(new Set())
    }
  }

  useEffect(() => {
    fetchAllProviders();
  }, []);

  useEffect(() => {
    setSelectedRows(new Set());
  }, [visible]);

  const fetchAllProviders = () => {
    getAllProvider()
      .then((response) => {
        const formattedProviders = response.filter((item) => item.availability === "Available").map((item) => ({
          id: item.id,
          name: item.fullName || "",
          speciality: item.speciality || "",
          address: item.address || "",
          contact: item.phone || "",
          email: item.email || "",
          availability: item.availability || "Available",
        }));
        setProvidersData(formattedProviders);
      })
      .catch((err) => {
        message.error(err?.message || "Failed to fetch cases. Please try again later.");
      });
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value)
  }
  const filteredData = searchText
    ? providersData.filter(
      (item) =>
        item.name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.speciality.toLowerCase().includes(searchText.toLowerCase()) ||
        item.email.toLowerCase().includes(searchText.toLowerCase()),
    )
    : providersData

  const handleSendInvite = () => {
    const selectedProviders = providersData.filter((item) =>
      selectedRows.has(item.id)
    );

    if (selectedProviders.length === 0) {
      message.error("No providers selected.");
      return;
    }

    const model = {
      doctorIds: selectedProviders.map(provider => provider.id),
      caseId: caseId,
    };
    addDoctorToCase(model)
      .then((response) => {
        setIsModalVisible(false)
        message.success(response?.message || "Case created successfully");
        handleSuccess();
        setSelectedRows({});
      })
      .catch((err) => {
        message.error(err?.message || "Failed to add provider to case");
      });
  };

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={'80%'}
      className="[&_.ant-modal-content]:rounded-3xl [&_.ant-modal-content]:overflow-hidden"
      styles={{
        header: {
          padding: '16px 24px',
          borderBottom: '1px solid #EAECF0',
          margin: 0,
          borderRadius: '24px 24px 0 0',
        },
        body: {
          padding: '24px',
          borderRadius: '0 0 24px 24px',
        },
        content: {
          borderRadius: '24px',
          overflow: 'hidden',
        },
      }}
      title={
        <div>
          <div className="text-2xl font-semibold text-gray-600">Select Providers</div>
          <div className="text-sm font-normal text-gray-500 mt-1">Select the providers you want to add to the case.</div>
        </div>
      }
    >
      <div className="flex justify-between items-center mt-6 mb-6">
        <div className="w-2/5">
          <Input
            placeholder="Search..."
            prefix={<SearchOutlined className="text-gray-400" />}
            value={searchText}
            onChange={handleSearch}
            className="h-10"
            allowClear
          />
        </div>
        <Button
          className={`h-10 px-4 flex items-center gap-2 ${selectedRows.size === 0 ? 'opacity-50' : ''}`}
          onClick={handleSendInvite}
          disabled={selectedRows.size === 0}
          style={{
            borderRadius: '8px',
            boxShadow: '0px 1px 2px 0px rgba(16, 24, 40, 0.05)',
            backgroundColor: selectedRows.size === 0 ? 'rgba(70, 95, 255, 0.5)' : '#465FFF',
            color: '#fff',
            border: 'none',
            cursor: selectedRows.size === 0 ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
          }}
        >
          <span>Send Invite</span>
        </Button>
      </div>

      <div className="mt-4">
        <ProvidersTable
          providers={filteredData}
          showCheckbox={true}
          selectedRows={selectedRows}
          onRowSelect={handleRowSelect}
          onSelectAll={handleSelectAll}
        />
      </div>
    </Modal>
  )
}

// Demo component to show the modal
const SelectMedicalProvidersDemo = ({ caseId, handleSuccess }) => {
  const [isModalVisible, setIsModalVisible] = useState(false)

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
    handleSuccess();
  }

  return (
    <div>
      <Button
        onClick={showModal}
        type="primary"
        icon={<PlusOutlined />}
        className="bg-blue-600 hover:bg-blue-700 h-11"
      >
        Add Provider
      </Button>

      <SelectMedicalProvidersModal caseId={caseId} visible={isModalVisible} onCancel={handleCancel} setIsModalVisible={setIsModalVisible} handleSuccess={handleSuccess} />
    </div>
  )
}

export default SelectMedicalProvidersDemo

