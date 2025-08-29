import React, { useEffect, useState } from "react";
import AuthLayout from "./AuthPageLayout";
import {
  ArrowLeftOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  Row,
  Typography,
  message,
  Select,
} from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import { registerUser, getInvitedUserInfo } from "../../services/auth";
import GooglePlacesAutocomplete from "../../components/ui/GooglePlacesAutocomplete";

const usStates = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' },
];

const PersonalInfo = () => {
  const [form] = Form.useForm();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const queryParams = new URLSearchParams(location.search);
  const role = queryParams.get('role');
  const inviteId = queryParams.get('inviteId');

  const userRole = location.state?.role || role || null;

  useEffect(() => {
    if (inviteId) {
      getInvitedUserInfo(inviteId)
        .then((response) => {
          form.setFieldsValue({
            fullName: response?.data?.fullName,
            email: response?.data?.email,
            phone: response?.data?.phone,
            specialty: response?.data?.specialty,
          });
        })
        .catch((err) => {
          message.error(err);
        });
    }
  }, [inviteId])

  React.useEffect(() => {
    if (!userRole) {
      message.error("Please select a role first");
      navigate("/signup");
    }
  }, [userRole, navigate]);

  const onFinish = async (values) => {
    try {
      setLoading(true);

      // Transforming the data into the desired structure
      const payload = {
        userData: {
          fullName: values.fullName,
          email: values.email,
          password: values.password,
          phone: values.phone,
          role: userRole.charAt(0).toUpperCase() + userRole.slice(1),
          speciality: userRole === "doctor" ? values.specialty : null,
        },
        addresses: [
          {
            streetAddress: values.address,
            state: values.state,
            zipCode: values.zipCode,
          },
        ],
      };

      // Call your register function
      const response = await registerUser(payload, inviteId?.length > 0 ? true : false);
      if (response) {
        navigate("/otp-verification", { state: { email: values.email } });
      }
    } catch (error) {
      message.error(error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout fullHeight={true}>
      <div className="card-bg max-w-[832px] w-full">
        <div style={{ marginBottom: 24 }}>
          <p className="fs-12 fw-500 mb-3 text-primary">Step 2/3</p>
          <h4 className="text-blue-39 mb-3">Personal Information</h4>
          <p className="fs-14 fw-400 text-blue-85">
            Enter your personal info to get started!
          </p>
        </div>
        <Form
          form={form}
          layout="vertical"
          className="personal-info-form"
          onFinish={onFinish}
          initialValues={{
            agreement: false,
          }}
        >
          <Row gutter={[16, 16]} style={{ marginBottom: "16px" }}>
            <Col xs={24} sm={12}>
              <Form.Item
                style={{ marginBottom: "16px" }}
                name="fullName"
                label={
                  <>
                    {userRole == 'attorney' ? 'Law firm name' : 'Full name'}  <span style={{ color: "red" }}>*</span>
                  </>
                }
                rules={[
                  { required: false, message: "Please enter your full name" },
                  { min: 2, message: "Name must be at least 2 characters" },
                ]}
              >
                <Input
                  className="auth-input"
                  placeholder="Enter your full name"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                style={{ marginBottom: "16px" }}
                name="email"
                label={
                  <>
                    Email <span style={{ color: "red" }}>*</span>
                  </>
                }
                rules={[
                  { required: false, message: "Please enter your email" },
                  { type: "email", message: "Please enter a valid email" },
                ]}
              >
                <Input
                  className="auth-input"
                  placeholder="Enter your email"
                  type="email"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]} style={{ marginBottom: "16px" }}>
            <Col xs={24} sm={userRole !== 'attorney' && 12}>
              <Form.Item
                name="phone"
                className="phone-field-container"
                label={
                  <>
                    Phone <span style={{ color: "red" }}>*</span>
                  </>
                }
                rules={[
                  { required: false, message: "Please enter phone number" },
                ]}
              >
                <div style={{ position: 'relative' }}>
                  <PhoneInput
                    country={"us"}
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
            </Col>
            {userRole !== 'attorney' && <Col xs={24} sm={12}>
              <Form.Item
                name="specialty"
                label="Specialty"
                rules={[
                  {
                    required: userRole === "doctor" && false,
                    message: "Please select specialty",
                  },
                ]}
              >
                <Input className="auth-input" placeholder="Select specialty" />
              </Form.Item>
            </Col>}
          </Row>
          <Row gutter={[16, 16]} style={{ marginBottom: "16px" }}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="password"
                label={
                  <>
                    Password <span style={{ color: "red" }}>*</span>
                  </>
                }
                rules={[
                  { required: false, message: "Please enter your password" },
                  { min: 8, message: "Password must be at least 8 characters" },
                ]}
              >
                <Input.Password
                  className="auth-input"
                  placeholder="Enter your password"
                  iconRender={(visible) =>
                    visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
                  }
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="confirmPassword"
                label={
                  <>
                    Re-enter Password <span style={{ color: "red" }}>*</span>
                  </>
                }
                dependencies={["password"]}
                rules={[
                  { required: false, message: "Please re-enter your password" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject("Passwords do not match");
                    },
                  }),
                ]}
              >
                <Input.Password
                  className="auth-input"
                  placeholder="Re-enter your password"
                  iconRender={(visible) =>
                    visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
                  }
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]} style={{ marginBottom: "16px" }}>
            <Col span={24}>
              <Form.Item
                name="address"
                label="Street Address"
                rules={[
                  { required: false, message: "Please enter your address" },
                ]}
              >
                <Input className="auth-input" placeholder="Enter your address" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]} style={{ marginBottom: "16px" }}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="state"
                label="Select State"
                rules={[
                  { required: false, message: "Please select your state" },
                ]}
              >
                <Select
                  placeholder="Select your state"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase()) ||
                    option.value.toLowerCase().includes(input.toLowerCase())
                  }
                  className="w-full h-10 rounded-lg"
                >
                  {usStates.map((state) => (
                    <Select.Option key={state.value} value={state.value}>
                      {state.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="zipCode"
                label="Zip Code"
                rules={[
                  { required: false, message: "Please enter your zip code" },
                ]}
              >
                <Input className="auth-input" placeholder="Enter your zip" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="agreement"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value
                    ? Promise.resolve()
                    : Promise.reject("Please accept the terms and conditions"),
              },
            ]}
            className="remember-checkbox"
          >
            <Checkbox className="text-gray-600 font-light">
              By creating an account means you agree to the{" "}
              <a href="#" className="text-gray-500 hover:text-gray-400">Terms and Conditions</a>, {" "}
              <a href="#" className="text-gray-500 hover:text-gray-400">and our {" "}</a> Privacy Policy
            </Checkbox>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="btn btn-primary"
              block
              loading={loading}
            >
              Continue
            </Button>
          </Form.Item>
        </Form>
      </div>
    </AuthLayout>
  );
};

export default PersonalInfo;
