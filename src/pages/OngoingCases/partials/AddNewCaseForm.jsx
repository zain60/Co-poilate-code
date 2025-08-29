import React, { useEffect } from "react"
import { Form, Input, Button, Select, DatePicker, message } from "antd"
import { CalendarOutlined } from "@ant-design/icons"
// import moment from "moment"
import GooglePlacesAutocomplete from "../../../components/ui/GooglePlacesAutocomplete"
import PhoneInput from "react-phone-input-2"
import { useSelector } from "react-redux"
import { createCase, updateCase } from "../../../services/cases"
import { Modal } from "antd";
import moment from "moment";

const statusOptions = [
  { value: "In Progress", label: "In Progress" },
  { value: "Pending", label: "Pending" },
  { value: "Complete", label: "Complete" },
];

const AddNewCaseForm = ({ open, onClose, onSubmitSuccess, initialValues = {}, isEdit = false }) => {
  const [form] = Form.useForm()
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (isEdit && initialValues) {
      let formattedPhone = '';
      if (initialValues.phone) {
        const cleaned = initialValues.phone.replace(/[^\d+]/g, '');
        if (cleaned.startsWith('+')) {
          formattedPhone = cleaned;
        } else if (cleaned) {
          formattedPhone = `+1${cleaned}`;
        }
      }

      const formattedValues = {
        ...initialValues,
        dateOfBirth: initialValues.dateOfBirth ? moment(initialValues.dateOfBirth) : null,
        dateOfAccident: initialValues.dateOfAccident ? moment(initialValues.dateOfAccident) : null,
        phone: formattedPhone
      };
      form.setFieldsValue(formattedValues);
    }
  }, [initialValues, isEdit]);

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        const formattedValues = {
          ...values,
          dateOfBirth: values.dateOfBirth ? values.dateOfBirth.toISOString() : null,
          dateOfAccident: values.dateOfAccident ? values.dateOfAccident.toISOString() : null,
        };

        if (isEdit && initialValues.id) {
          formattedValues.id = initialValues.id;
        }
        const model = {
          caseData: {
            ...formattedValues,
          },
          userId: user?.id,
        };

        if (!isEdit) {
          createCase(model)
            .then((response) => {
              onSubmitSuccess(response?.case);
              form.resetFields();
              message.success("Case created successfully");
            })
            .catch((err) => {
              message.error(err.message);
            });
        }
        else {
          updateCase({ ...model.caseData, userId: user?.id })
            .then((response) => {
              onSubmitSuccess(response?.case);
              form.resetFields();
              message.success("Case updated successfully");
            })
            .catch((err) => {
              message.error(err.message);
            });
        }
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  }

  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
    { value: "prefer_not_to_say", label: "Prefer not to say" },
  ]
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={750}
      centered
      style={{ borderRadius: '32px' }}
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
        <div className="mb-8">
          <h6 className="text-[22px] font-semibold text-gray-800 mb-2">{isEdit ? "Edit Case Details" : "Add New Case"}</h6>
          <p className="text-sm text-gray-500">
            {isEdit
              ? "Update case details here."
              : "Add patient information to start a new case."
            }
          </p>
        </div>
        <Form
          form={form}
          layout="vertical"
          name="addNewCaseForm"
          className="add-new-case-form"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            {/* Full name */}
            <Form.Item
              name="fullName"
              label={<span className="text-sm font-medium text-gray-700">Full Name</span>}
              rules={[{ required: false, message: "Please enter full name" }]}
            >
              <Input
                placeholder="Enter full name"
                size="large"
                className="h-11 text-sm border-gray-300 rounded-md hover:border-blue-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </Form.Item>

            {/* Email */}
            <Form.Item
              name="email"
              label={<span className="text-sm font-medium text-gray-700">Email</span>}
              rules={[
                { required: false, message: "Please enter email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input
                placeholder="Enter email address"
                size="large"
                className="h-11 text-sm border-gray-300 rounded-md hover:border-blue-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </Form.Item>

            {/* Phone */}
            <Form.Item
              name="phone"
              className="phone-field-container"
              label={
                <>
                  Phone
                </>
              }
              rules={[
                { required: false, message: "Please enter phone number" },
              ]}
            >
              <div style={{ position: 'relative' }}>
                <PhoneInput
                  country={form.getFieldValue('phone')?.startsWith('+1') ? 'us' : undefined}
                  value={form.getFieldValue('phone')}
                  onChange={(value, country, e, formattedValue) => {
                    form.setFieldsValue({ phone: formattedValue });
                  }}
                  enableSearch
                  inputStyle={{
                    width: "100%",
                    height: "44px",
                    borderRadius: "6px",
                    border: "1px solid #d1d5db",
                    fontSize: "16px",
                    padding: '10px 12px',
                    paddingLeft: '80px',
                    color: '#111827',
                    backgroundColor: '#fff',
                    outline: 'none',
                    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                  }}
                  buttonStyle={{
                    border: "none",
                    borderRight: '1px solid #d1d5db',
                    background: "transparent",
                    padding: '0 12px',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px',
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    margin: 'auto',
                    zIndex: 1,
                    borderRadius: '6px 0 0 6px'
                  }}
                  dropdownStyle={{
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    position: 'absolute',
                    left: 0,
                    top: 'calc(100% + 4px)',
                    margin: 0,
                    border: '1px solid #d1d5db',
                    backgroundColor: '#fff',
                    zIndex: 1000
                  }}
                  containerStyle={{
                    width: "100%",
                    position: 'relative',
                    overflow: 'visible',
                    zIndex: 1
                  }}
                  searchStyle={{
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #d1d5db',
                    marginBottom: '8px',
                    backgroundColor: '#fff'
                  }}
                  dropdownArrowStyle={{
                    color: '#6b7280'
                  }}
                  countrySelectorStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    padding: '8px'
                  }}
                />
              </div>
            </Form.Item>
            {/* Gender */}
            <Form.Item
              name="gender"
              label={<span className="text-sm font-medium text-gray-700">Gender</span>}
            >
              <Select
                placeholder="Select gender"
                options={genderOptions}
                size="large"
                className="h-11 text-sm border-gray-300 rounded-md hover:border-blue-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </Form.Item>

            {/* Date of Birth */}
            <Form.Item
              name="dateOfBirth"
              label={<span className="text-sm font-medium text-gray-700">Date of Birth</span>}
              rules={[{ required: false, message: "Please select date of birth" }]}
            >
              <DatePicker
                placeholder="dd/mm/yyyy"
                format="DD/MM/YYYY"
                className="w-full h-11 text-sm border-gray-300 rounded-md hover:border-blue-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                size="large"
                suffixIcon={
                  <CalendarOutlined
                    className="text-gray-500"
                    style={{ fontSize: '16px' }}
                  />
                }
              />
            </Form.Item>

            {/* Date of Accident */}
            <Form.Item
              name="dateOfAccident"
              label={<span className="text-sm font-medium text-gray-700">Date of Accident</span>}
              rules={[{ required: false, message: "Please select date of accident" }]}
            >
              <DatePicker
                placeholder="dd/mm/yyyy"
                format="DD/MM/YYYY"
                className="w-full h-11 text-sm border-gray-300 rounded-md hover:border-blue-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                size="large"
                suffixIcon={
                  <CalendarOutlined
                    className="text-gray-500"
                    style={{ fontSize: '16px' }}
                  />
                }
              />
            </Form.Item>
          </div>

          {/* Street Address with Google Places Autocomplete - Full width */}
          <div className="col-span-2">
            {isEdit ? (
              <Form.Item
                name="status"
                label="Case Status"
                rules={[{ required: false, message: "Please select status" }]}
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
            ) : (
              <Form.Item
                name="streetAddress"
                label={<span className="text-sm font-medium text-gray-700">Street Address</span>}
                rules={[{ required: false, message: "Please enter street address" }]}
              >
                <Input
                  placeholder="Enter address"
                  size="large"
                  className="h-11 text-sm border-gray-300 rounded-md hover:border-blue-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </Form.Item>
            )}
          </div>

          {/* Form Actions */}
          <div className="col-span-2 flex justify-between gap-4 mt-6">
            <Button
              size="large"
              className="w-full h-11 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              size="large"
              className="w-full h-11 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={handleSubmit}
            >
              {isEdit ? 'Update Case' : 'Save Case Details'}
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  )
}

export default AddNewCaseForm;
