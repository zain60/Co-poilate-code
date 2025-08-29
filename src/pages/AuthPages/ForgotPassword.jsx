import { Button, Col, Input, Row, Typography, Form, Modal as AntdModal } from "antd";
import React, { useState, useRef } from "react";
import AuthLayout from "./AuthPageLayout";
const { Title, Text } = Typography;
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  EyeInvisibleOutlined,
} from "@ant-design/icons";
import { CloseOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";


export const ForgotPassword = () => {

  const [showOtp, setShowOtp] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showValidation, setShowValidation] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const otpRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];
  
  const handleSendResetLink = () => {
    setShowOtp(true);
  };

  const handleVerifyOtp = () => {
    setShowOtp(false);
    setShowNewPassword(true);
  };

  const handleBackToForgotPassword = () => {
    setShowOtp(false);
  };

  const handleBackToOtp = () => {
    setShowNewPassword(false);
    setShowOtp(true);
  };

  const handleOtpChange = (index, e) => {
    const value = e.target.value;
    
    // Only allow digits
    if (!/^\d*$/.test(value)) return;
    
    // Update the OTP values array
    const newOtpValues = [...otpValues];
    newOtpValues[index] = value.slice(0, 1); // Take only the first digit
    setOtpValues(newOtpValues);
    
    // Move to the next input if a digit was entered
    if (value && index < 5) {
      otpRefs[index + 1].current.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      otpRefs[index - 1].current.focus();
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setShowValidation(true);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setShowValidation(false);
  };

  const handleUpdatePassword = () => {
    setShowSuccessModal(true);
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
  };

  return (
    <AuthLayout>
      {/* ------------FORGOT PASSWORD --------- */}
      <div
        style={{
          width: "100%",
          display: (showOtp || showNewPassword) ? "none" : "block",
          transition: "opacity 0.5s ease-in-out",
          opacity: (showOtp || showNewPassword) ? 0 : 1,
        }}
      >
        <Row justify="center" align="middle" style={{ height: "100%" }}>
          <Col
            xs={24}
            sm={16}
            md={12}
            lg={8}
            xl={9}
            style={{
              backgroundColor: "white",
              padding: "32px",
              borderRadius: "16px",
            }}
          >
            <h4 className="text-blue-39 mb-3">Forgot Your Password?</h4>
            <p className="text-blue-85 mb-8">Enter the email address linked to your account, and we'll send you a link to reset your password.</p>
            <div style={{ marginTop: "24px" }}>
              <Text className="fs-14 fw-500 text-gray-54 font-outfit">
                Email <span style={{ color: "#f04437" }}>*</span>
              </Text>
               
              <Form.Item className="mb--20"
              name="username"
              style={{ marginTop: "8px" }}
              rules={[
                {
                  required: true,
                  message: 'Please input your Email!',
                },
              ]}
            >
              <Input className='auth-input' placeholder="Username" />
            </Form.Item>
            </div>
            <Button 
              block 
              type="primary" 
              htmlType="submit" 
              className='btn btn-primary mt-6'
              onClick={handleSendResetLink}
            >
              Send Reset Link
            </Button>
          </Col>
        </Row>
       
      </div>
      {/* ------------FORGOT PASSWORD --------- */}
      {/* ------------OTP Verification --------- */}
      <div
        style={{
          padding: "32px",
          background: "white",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "440px",
          display: showOtp ? "block" : "none",
          transition: "opacity 0.5s ease-in-out",
          opacity: showOtp ? 1 : 0,
        }}
      >
        <Row gutter={[0, 12]}>
          <Col span={24}>
            <h4 className="text-blue-39 mb-3">OTP Verification</h4>
            <p className="text-blue-85 fw-400 mb-5">A verification code has been sent to <span className="fw-500 text-gray-54">michael.james88@gmail.com</span>. Please enter it in the field below.</p>
          </Col>
          <Col span={24}>
            <Text className="fs-14 fw-500 text-blue-39">Type your 6 digits security code</Text>
          </Col>
          <Col span={24}>
            <Row gutter={16}>
              {otpValues.map((value, index) => (
                <Col span={4} key={index}>
                  <Input
                    ref={otpRefs[index]}
                    size="large"
                    className="otp-input"
                    value={value}
                    onChange={(e) => handleOtpChange(index, e)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    maxLength={1}
                    autoComplete="off"
                    style={{ textAlign: "center", fontSize: "1.2rem" }}
                  />
                </Col>
              ))}
            </Row>
          </Col>
          <Col span={24}>
            <Button 
              block 
              type="primary" 
              htmlType="submit" 
              className='btn btn-primary mt-2'
              onClick={handleVerifyOtp}
            >
              Verify My Account
            </Button>
          </Col>
          <Col span={24} style={{ textAlign: "center" }} className="mt-2">
            <Text className="fs-14 fw-400 text-gray-54 font-outfit">
              Didn&apos;t get the code? <a href="#" className="fw-500 text-primary" >Resend</a>
            </Text>
          </Col>
        </Row>
      </div>
      {/* ------------OTP Verification --------- */}
      {/* ------------Set New Password --------- */}
      <div
        style={{
          width: 440,
          padding: 32,
          backgroundColor: "white",
          borderRadius: 8,
          display: showNewPassword ? "block" : "none",
          transition: "opacity 0.5s ease-in-out",
          opacity: showNewPassword ? 1 : 0,
        }}
      >
        <h4 className="text-blue-39 mb-3">Set New Password</h4>
            <p className="text-blue-85 mb-8">Please enter a new password</p>
        <Form layout="vertical" style={{ marginTop: 20 }} className="set-new-password-form">
          <Form.Item label="Password">
            <Input.Password
              className="auth-input"
              placeholder="Enter your password"
              value={password}
              onChange={handlePasswordChange}
              iconRender={(visible) =>
                visible ? <EyeInvisibleOutlined /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>
          <Form.Item label="Re-enter Password">
            <Input.Password
              className="auth-input"
              placeholder="Enter your password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              iconRender={(visible) =>
                visible ? <EyeInvisibleOutlined /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>
          
          {showValidation && (
            <div style={{ marginBottom: 16 }}>
              <Row align="middle" gutter={8}>
                <Col>
                  <CheckCircleOutlined style={{ 
                    color: password ? "#52c41a" : "#d9d9d9" 
                  }} />
                </Col>
                <Col>
                  <Text className="fs-12 fw-400 blue-light-b3" type={password ? "text-gray-54" : "disabled"}>
                    Min. of 8-16 characters
                  </Text>
                </Col>
              </Row>
              <Row align="middle" gutter={8}>
                <Col>
                  <CheckCircleOutlined style={{ 
                    color: password ? "#52c41a" : "#d9d9d9" 
                  }} />
                </Col>
                <Col>
                  <Text className="fs-12 fw-400 blue-light-b3" type={password ? "secondary" : "disabled"}>
                    Min. one uppercase letter (a-z)
                  </Text>
                </Col>
              </Row>
              <Row align="middle" gutter={8}>
                <Col>
                  <CheckCircleOutlined style={{ 
                    color: password ? "#52c41a" : "#d9d9d9" 
                  }} />
                </Col>
                <Col>
                  <Text className="fs-12 fw-400 blue-light-b3" type={password ? "secondary" : "disabled"}>
                    Min. one lowercase letter (A-Z)
                  </Text>
                </Col>
              </Row>
              <Row align="middle" gutter={8}>
                <Col>
                  <CheckCircleOutlined style={{ 
                    color: password ? "#52c41a" : "#d9d9d9" 
                  }} />
                </Col>
                <Col>
                  <Text className="fs-12 fw-400 blue-light-b3" type={password ? "secondary" : "disabled"}>
                    Min. one number (0-9)
                  </Text>
                </Col>
              </Row>
            </div>
          )}
          
          <Form.Item>
            <Button 
              block 
              type="primary" 
              htmlType="submit" 
              className='btn btn-primary'
              onClick={handleUpdatePassword}
            >
              Update Password
            </Button>
          </Form.Item>
        </Form>
      </div>
      {/* ------------Set New Password --------- */}
      {/* ------------MODAL --------- */}
      <AntdModal
        visible={showSuccessModal}
        footer={null}
        closable={false}
        centered
        className="password-reset-modal"
        style={{
          borderRadius: "24px",
          maxWidth: "580px",
          height: "258px"
        }}
        width={580}
        bodyStyle={{ 
          padding: "40px", 
          textAlign: "center",
          height: "258px",
          borderRadius: "24px",
        }}
        modalRender={(node) => (
          <Link to={'/sign-up'} style={{ borderRadius: "24px", overflow: "hidden" }}>
            {node}
          </Link>
        )}
      >
        <Row justify="center" style={{ marginBottom: "20px" }}>
          <Col>
            <div
              style={{
                width: "120px",
                height: "120px",
                backgroundImage:
                  "url(https://c.animaapp.com/m8kdviwdBkWVsc/img/star-1.svg)",
                backgroundSize: "100% 100%",
                position: "relative",
              }}
            >
              <div
                style={{
                  width: "38px",
                  height: "38px",
                  position: "absolute",
                  top: "41px",
                  left: "41px",
                }}
              >
                <img
                  style={{
                    width: "32px",
                    height: "32px",
                    position: "absolute",
                    top: "3px",
                    left: "3px",
                  }}
                  alt="Icon"
                  src="https://c.animaapp.com/m8kdviwdBkWVsc/img/icon.svg"
                />
              </div>
            </div>
          </Col>
        </Row>

          <h5 className="text-blue-39 mb-3">Password Reset</h5>
          <p className="fs-14 text-blue-85 mb-6">Congratulations! You've successfully update the password.</p>

        <div
          style={{
            position: "absolute",
            top: "24px",
            right: "24px",
            width: "44px",
            height: "44px",
            backgroundColor: "#f2f3f6",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
          onClick={handleCloseModal}
        >
          <CloseOutlined style={{ fontSize: "16px", color: "#000" }} />
        </div>
      </AntdModal>
      {/* ------------MODAL --------- */}

    </AuthLayout>
  );
};
export default ForgotPassword;