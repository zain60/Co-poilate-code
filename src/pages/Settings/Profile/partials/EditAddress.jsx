
import { useState } from "react"
import { Form, Input, Select, Button } from "antd"
import { PlusOutlined, FilePdfOutlined, GoogleOutlined } from "@ant-design/icons"

const EditAddress = ({ open, onClose, onSave, initialData }) => {

  const [form] = Form.useForm()

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      onSave(values)
    })
  }

  return (
      <>
      <div className="pt-2">
          <h6 className="font-600 text-blue-39">Edit Address</h6>
          <p className="fs-14 fw-400 text-blue-85 mb-7 mt-1">Update your details to keep your profile up-to-date.</p>
        </div>
        <Form form={form} layout="vertical" initialValues={initialData} className="edit-personal-info-form">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-3">
          <Form.Item name="street" label="Street" rules={[{ required: true, message: "Please enter your street address" }]}>
            <Input placeholder="Enter your street address" />
          </Form.Item>

          <Form.Item
            name="state"
            label="City/State"
            rules={[{ required: true, message: "Please enter your city/state" }]}
          >
            <Input placeholder="Enter your city/state" />
          </Form.Item>

          <Form.Item
            name="zipCode"
            label="Postal Code"
            rules={[{ required: true, message: "Please enter your postal code" }]}
          >
            <Input placeholder="Enter your postal code" />
          </Form.Item>

          <Form.Item name="texId" label="TAX ID">
            <Input placeholder="Enter your TAX ID" />
          </Form.Item>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button onClick={onClose} className="h-11">Close</Button>
          <Button type="primary" onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700 h-11">
            Save Changes
          </Button>
        </div>
      </Form>
    </>
  )
}

export default EditAddress

