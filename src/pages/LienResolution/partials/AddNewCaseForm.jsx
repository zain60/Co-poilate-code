import React from "react"
import { Form, Input, Button, Select, DatePicker } from "antd"
import { CalendarOutlined } from "@ant-design/icons"
import GooglePlacesAutocomplete from "../../../components/ui/GooglePlacesAutocomplete"
import PhoneInput from "react-phone-input-2"

const AddNewCaseForm = ({ onCancel, onSubmit }) => {

  const [form] = Form.useForm()

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        onSubmit(values)
      })
      .catch((info) => {
        console.log("Validate Failed:", info)
      })
  }

  // Country code options for phone
  const prefixSelector = (
    <Form.Item name="prefix" noStyle initialValue="US">
      <Select className="w-20">
        <Select.Option value="US">US</Select.Option>
        <Select.Option value="CA">CA</Select.Option>
        <Select.Option value="UK">UK</Select.Option>
      </Select>
    </Form.Item>
  )

  // Gender options
  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
    { value: "prefer_not_to_say", label: "Prefer not to say" },
  ]
  return (
    <div>
      <div className="pb-2">
        <h6 className="font-600 text-blue-39">Add new Provider</h6>
        <p className="fs-14 fw-400 text-blue-85 mt-1">Add provider information to start the case.</p>
      </div>
      <Form form={form} layout="vertical" name="addNewCaseForm" className="mt-4 add-new-case-form">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
          {/* Full name */}
          <Form.Item name="fullName" label="Full name" rules={[{ required: false, message: "Please enter full name" }]}>
            <Input placeholder="Enter full name" size="large" />
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
            <Input placeholder="Enter email address" size="large" />
          </Form.Item>

          {/* Phone */}
          <Form.Item
            name="phone"
            // label="Phone"
            rules={[{ required: false, message: "Please enter phone number" }]}
          >
            <PhoneInput
              country={'us'}
              enableSearch
              inputStyle={{
                width: '100%',
                height: '40px',
                borderRadius: '6px',
                border: '1px solid #d9d9d9',
                fontSize: '16px',
                padding: '7px 11px',
              }}
              buttonStyle={{
                border: 'none',
                background: 'transparent',
              }}
              containerStyle={{ width: '100%' }}
            />
          </Form.Item>

          {/* Gender */}
          <Form.Item name="gender" label="Gender">
            <Select placeholder="Select gender" options={genderOptions} size="large" />
          </Form.Item>

          {/* Date of Birth */}
          <Form.Item
            name="dateOfBirth"
            label="Date of Birth"
            rules={[{ required: false, message: "Please select date of birth" }]}
          >
            <DatePicker
              placeholder="dd/mm/yyyy"
              format="DD/MM/YYYY"
              className="w-full"
              size="large"
              suffixIcon={<CalendarOutlined />}
            />
          </Form.Item>

          {/* Date of Accident */}
          <Form.Item
            name="dateOfAccident"
            label="Date of Accident"
            rules={[{ required: false, message: "Please select date of accident" }]}
          >
            <DatePicker
              placeholder="dd/mm/yyyy"
              format="DD/MM/YYYY"
              className="w-full"
              size="large"
              suffixIcon={<CalendarOutlined />}
            />
          </Form.Item>
        </div>

        {/* Street Address with Google Places Autocomplete - Full width */}
        <Form.Item
          name="streetAddress"
          label="Street Address"
          rules={[{ required: false, message: "Please enter street address" }]}
          className=""
        >
          <Input placeholder="Enter address" />
        </Form.Item>

        {/* Form Actions */}
        <div className="flex justify-between gap-4 mt-6">
          <Button size="large" className="w-full btn btn-cancel" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            type="primary"
            size="large"
            className="w-full btn btn-primary h-11"
            onClick={handleSubmit}
          >
            Save Provider Details
          </Button>
        </div>
      </Form>
    </div>
  )
}

export default AddNewCaseForm