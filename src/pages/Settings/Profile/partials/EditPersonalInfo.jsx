
import { useState } from "react"
import { Form, Input, Select, Button } from "antd"
import { PlusOutlined, FilePdfOutlined, GoogleOutlined } from "@ant-design/icons"
import PhoneInput from "react-phone-input-2"

const { TextArea } = Input
const { Option } = Select

const EditPersonalInfo = ({ open, onClose, onSave, initialData }) => {

  const [form] = Form.useForm()

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      delete values.email;
      onSave(values);
    });
  }

  return (
      <>
      <div className="pt-2">
          <h6 className="font-600 text-blue-39">Edit Personal Information</h6>
          <p className="fs-14 fw-400 text-blue-85 mt-1 mb-7">Update your details to keep your profile up-to-date.</p>
        </div>
        <Form form={form} layout="vertical" initialValues={initialData} className="edit-personal-info-form">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-3">
          <Form.Item
            name="firstName"
            label="First Name"
            rules={[{ required: true, message: "Please enter your first name" }]}
          >
            <Input placeholder="Enter your first name" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email Address"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input placeholder="Enter your email" disabled />
          </Form.Item>
            <div className="col-span-2">

          <Form.Item name="phone" 
          // label="Phone" 
          rules={[{ required: true, message: "Please enter your phone number" }]}>
          <PhoneInput
                  country={"us"}
                  enableSearch
                  inputStyle={{
                    width: "100%",
                    height: "44px",
                    borderRadius: "6px",
                    border: "1px solid #d9d9d9",
                    fontSize: "16px",
                    padding: "7px 11px",
                  }}
                  buttonStyle={{
                    border: "none",
                    background: "transparent",
                  }}
                  containerStyle={{ width: "100%" }}
                  />
          </Form.Item>
                  </div>

          <Form.Item name="bio" label="Bio" className="md:col-span-2">
            <Input placeholder="Enter your bio" />
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

export default EditPersonalInfo

