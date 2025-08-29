import React, { useState } from 'react';
import { Modal, Form, InputNumber, Button, Select } from 'antd';

const statusOptions = [
  { value: "In Progress", label: "In Progress" },
  { value: "Pending", label: "Pending" },
  { value: "Complete", label: "Complete" },
];
const EditProviderModal = ({ provider, visible, onCancel, onSave }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      await onSave({ ...provider, ...values });
      onCancel();
    } catch (error) {
      console.error('Validation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={
        <div className="mb-10">
          <div className="text-lg font-medium mb-2">{provider?.fullName}</div>
          <div className="text-sm text-gray-400">{provider?.speciality}</div>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      footer={[
        <div key="footer-buttons" className="w-full flex space-x-4">
          <Button
            key="cancel"
            onClick={onCancel}
            className="flex-1 h-10 rounded-lg border border-gray-300"
          >
            Cancel
          </Button>
          <Button
            key="save"
            type="primary"
            loading={loading}
            onClick={handleSubmit}
            className="flex-1 h-10 bg-blue-600 rounded-lg"
          >
            Save Changes
          </Button>
        </div>
      ]}
      width={700}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          name: provider?.billAmount || '',
          specialty: provider?.reducedAmount || '',
          treatmentStatus: provider?.treatmentStatus || 'In Progress',
          lienOfferStatus: provider?.lienOfferStatus || 'Pending',
          lienOffer: provider?.lienOffer || '',
          lienOfferStatus: provider?.lienOfferStatus || 'Pending',

        }}
        className="space-y-4"
      >
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="billAmount"
            label="Bill amount"
            rules={[{ required: true, message: 'Please enter bill amount' }]}
            required={false}
            className="mb-0"
          >
            <InputNumber
              className="w-full h-10 rounded-lg"
              formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
              min={0}
              placeholder="0.00"
            />
          </Form.Item>

          <Form.Item
            name="reducedAmount"
            label="Reduced amount"
            rules={[{ required: true, message: 'Please enter reduced amount' }]}
            required={false}
            className="mb-0"
          >
            <InputNumber
              className="w-full h-10 rounded-lg"
              formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
              min={0}
              placeholder="0.00"
            />
          </Form.Item>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="lienOffer"
            label="Lien Offer"
            rules={[{ required: true, message: 'Please enter lien offer' }]}
            required={false}
            className="mb-0"
          >
            <InputNumber
              className="w-full h-10 rounded-lg"
              formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
              min={0}
              placeholder="0.00"
            />
          </Form.Item>

          <Form.Item
            name="lienOfferStatus"
            label="Lien Offer Status"
            rules={[{ required: true, message: 'Please select status' }]}
            required={false}
            className="mb-0"
          >
            <Select placeholder="Select status">
              {statusOptions.map((option) => {
                let dotColor = "#2563EB"; // In Progress (darker blue)
                if (option.value === "Pending") dotColor = "#F59E42"; // Darker orange
                if (option.value === "Complete") dotColor = "#16A34A"; // Darker green
                return (
                  <Option key={option.value} value={option.value}>
                    <span style={{ display: "flex", alignItems: "center" }}>
                      <span
                        style={{
                          display: "inline-block",
                          width: 16,
                          height: 16,
                          borderRadius: "50%",
                          background: dotColor,
                          marginRight: 12,
                        }}
                      />
                      <span>{option.label}</span>
                    </span>
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
        </div>

        <div>
          <Form.Item
            name="treatmentStatus"
            label="Treatment Status"
            rules={[{ required: true, message: 'Please select status' }]}
            required={false}
            className="mb-0"
          >
            <Select placeholder="Select status">
              {statusOptions.map((option) => {
                let dotColor = "#2563EB"; // In Progress (darker blue)
                if (option.value === "Pending") dotColor = "#F59E42"; // Darker orange
                if (option.value === "Complete") dotColor = "#16A34A"; // Darker green
                return (
                  <Option key={option.value} value={option.value}>
                    <span style={{ display: "flex", alignItems: "center" }}>
                      <span
                        style={{
                          display: "inline-block",
                          width: 16,
                          height: 16,
                          borderRadius: "50%",
                          background: dotColor,
                          marginRight: 12,
                        }}
                      />
                      <span>{option.label}</span>
                    </span>
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Medical Records</h4>
            <div className="bg-gray-50 p-3 rounded-lg min-h-[80px] border border-gray-200">
              {provider?.medicalRecords?.length > 0 ? (
                <div className="space-y-2">
                  {provider.medicalRecords.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-white p-2 rounded border">
                      <span className="text-sm text-gray-700 truncate">{file.name}</span>
                      <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-sm">
                        View
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">No medical records uploaded</p>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Bills</h4>
            <div className="bg-gray-50 p-3 rounded-lg min-h-[80px] border border-gray-200">
              {provider?.bills?.length > 0 ? (
                <div className="space-y-2">
                  {provider.bills.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-white p-2 rounded border">
                      <span className="text-sm text-gray-700 truncate">{file.name}</span>
                      <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-sm">
                        View
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">No bills uploaded</p>
              )}
            </div>
          </div>
        </div>

      </Form>
    </Modal >
  );
};

export default EditProviderModal;
