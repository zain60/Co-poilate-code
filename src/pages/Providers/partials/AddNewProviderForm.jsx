import { useState } from 'react';
import { Form, Input, Select, Button, Radio, Modal } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { PhoneInputField } from "../../../components/ui/PhoneInput";
import { inviteNewDoctor } from "../../../services/cases";
import { message } from 'antd';

const { Option } = Select;

const AddNewProviderForm = ({ form, visible, onCancel, onSubmitSuccess }) => {
  const [addresses, setAddresses] = useState([
    { id: 1, isPrimary: true },
  ])

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        // Process addresses
        const formattedAddresses = addresses.map((addr) => ({
          ...values.address[addr.id],
          isPrimary: addr.isPrimary,
        }));

        // Create final form data
        const formData = {
          fullName: values.fullName,
          email: values.email,
          phone: values.phone,
          phonePrefix: values.phonePrefix,
          specialty: values.specialty,
          addresses: formattedAddresses,
        };

        let model = {
          ...values,
          frontendRedirectURL: `${window.location.protocol}/${window.location.host}/personal-info?role=doctor&inviteId=`,
        }

        inviteNewDoctor(model)
          .then((response) => {
            message.success(response?.message || "Medical provider added successfully");
            form.resetFields()
            onSubmitSuccess();
          })
          .catch((err) => {
            message.error(err?.message || "Medical provider added failed");
          });
      })
      .catch((err) => {
        console.log(err?.message || "Failed to add medical provider. Please try again.");
      });
  }

  // Handle primary address selection
  const handlePrimaryChange = (id) => {
    setAddresses(
      addresses.map((addr) => ({
        ...addr,
        isPrimary: addr.id === id,
      })),
    )
  }

  // Add new address
  const addNewAddress = () => {
    const newId = Math.max(...addresses.map((a) => a.id)) + 1
    setAddresses([...addresses, { id: newId, isPrimary: false }])
  }

  // Remove address
  const removeAddress = (id) => {
    // Don't allow removing if only one address remains
    if (addresses.length <= 1) return

    // If removing the primary address, make the first remaining one primary
    const isPrimaryRemoved = addresses.find((a) => a.id === id)?.isPrimary
    const filteredAddresses = addresses.filter((a) => a.id !== id)

    if (isPrimaryRemoved && filteredAddresses.length > 0) {
      filteredAddresses[0].isPrimary = true
    }

    setAddresses(filteredAddresses)
  }

  // Specialty options
  const specialtyOptions = [
    { value: "orthopedic", label: "Orthopedic" },
    { value: "neurologist", label: "Neurologist" },
    { value: "cardiologist", label: "Cardiologist" },
    { value: "pediatrician", label: "Pediatrician" },
    { value: "dermatologist", label: "Dermatologist" },
  ]

  // Prefill form with sample data
  const initialValues = {
  }

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={750}
      centered
      className="rounded-2xl [&_.ant-modal-content]:rounded-2xl [&_.ant-modal-content]:overflow-hidden"
      closeIcon={
        <div className="top-8 w-8 h-8 bg-gray-100 rounded-full overflow-hidden">
          <div className="w-full h-full flex items-center justify-center hover:bg-gray-200 transition-colors duration-200">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      }
    >

      <div className="p-6">
        <div className="pb-7">
          <h6 className="font-600 text-blue-39">Add Medical Provider</h6>
          <p className="fs-14 fw-400 text-blue-85 mt-2">Create a medical provider by adding their details.</p>
        </div>

        <Form form={form} layout="vertical" initialValues={initialValues} className="medical-provider-form">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
            {/* Full Name */}
            <Form.Item name="fullName" label="Full Name" rules={[{ required: false, message: "Please enter full name" }]}>
              <Input placeholder="Enter full name" />
            </Form.Item>

            {/* Email */}
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: false, message: "Please enter email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input placeholder="Enter email address" />
            </Form.Item>

            {/* Phone */}
            <Form.Item
              name="phone"
              label="Phone"
              rules={[{ required: false, message: "Please enter phone number" }]}
            >
              <PhoneInputField />
            </Form.Item>

            {/* Specialty */}
            <Form.Item name="specialty" label="Specialty" rules={[{ required: false, message: "Please select specialty" }]}>
              <Select placeholder="Select specialty" className="mt-0.5">
                {specialtyOptions.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          {/* Addresses */}
          {addresses.map((address, index) => (
            <div key={address.id} className="mb-2 bg-gray-50 p-4 rounded-lg mt-3">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-base font-medium">{index === 0 ? "Address" : `Address ${index + 1}`}</h3>
                {addresses.length > 1 && (
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => removeAddress(address.id)}
                    className="flex items-center justify-center h-8 w-8 hover:bg-red-50"
                  />
                )}
              </div>

              <div className="">
                {/* Street */}
                <Form.Item
                  name={["address", address.id, "street"]}
                  label="Street"
                  initialValue={initialValues[`address_${address.id}`]?.street}
                  rules={[{ required: false, message: "Please enter street address" }]}
                >
                  <Input placeholder="Enter street address" />
                </Form.Item>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* State */}
                  <Form.Item
                    name={["address", address.id, "state"]}
                    label="State"
                    initialValue={initialValues[`address_${address.id}`]?.state}
                    rules={[{ required: false, message: "Please enter state" }]}
                  >
                    <Input placeholder="Enter state" />
                  </Form.Item>

                  {/* ZIP Code */}
                  <Form.Item
                    name={["address", address.id, "zipCode"]}
                    label="ZIP Code"
                    initialValue={initialValues[`address_${address.id}`]?.zipCode}
                    rules={[{ required: false, message: "Please enter ZIP code" }]}
                  >
                    <Input placeholder="Enter ZIP code" />
                  </Form.Item>
                </div>

                {/* Mark as primary */}
                <Form.Item className="radio-provider">
                  <Radio.Group
                    value={addresses.find(a => a.isPrimary)?.id}
                    onChange={(e) => handlePrimaryChange(e.target.value)}
                  >
                    <Radio value={address.id}>Mark as primary address</Radio>
                  </Radio.Group>
                </Form.Item>
              </div>
            </div>
          ))}

          {/* Add New Address Button */}
          <Button
            type="link"
            icon={<PlusOutlined />}
            onClick={addNewAddress}
            className="text-blue-600 hover:text-blue-800 p-0 h-auto flex items-center mb-6 fs-16 fw-500 font-outfit mt-6"
          >
            Add New Address
          </Button>

          {/* Form Actions */}
          <div className="flex justify-between gap-4 mt-6">
            <Button size="large" className="w-full" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="primary" size="large" className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleSubmit}>
              Create
            </Button>
          </div>
        </Form>

      </div>
    </Modal>
  )
}

export default AddNewProviderForm;
