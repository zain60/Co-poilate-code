/* eslint-disable no-unused-vars */
import AuthPageLayout from "./AuthPageLayout";
import React, { useState } from "react";
import {
  LockOutlined,
  UserOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { Button, Checkbox, Form, Input, Flex, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../services/auth";
import { useDispatch } from "react-redux";
import { setAuthData } from "../../store/authSlice";

const SignIn = () => {
  const [form] = Form.useForm();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const dispatch = useDispatch();

  const handleLogin = async (credentials) => {
    try {
      console.log("Sending credentials to server:", credentials);
      const response = await loginUser(credentials);
      console.log("Server response:", response);

      if (response?.token) {
        // Save user and token in Redux store
        dispatch(
          setAuthData({
            user: response.user, // Assuming the API returns user data
            token: response.token,
          })
        );
        return response;
      }
      throw new Error("Login failed: No token received");
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);
      console.log("Form values:", values);

      const loginPayload = {
        email: values.email,
        password: values.password,
      };

      const response = await handleLogin(loginPayload);
      messageApi.success("Login successful!");

      if (response.token) {
        localStorage.setItem("token", response.token);
      }

      setTimeout(() => {
        navigate("/home");
      }, 1000);
    } catch (error) {
      messageApi.error(error.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Form validation failed:", errorInfo);
    messageApi.error("Please check your input and try again.");
  };

  return (
    <AuthPageLayout>
      {contextHolder}
      <div className="form-bg">
        <h4 className="text-blue-39 fw-600 mb-3">Sign In</h4>
        <p className="text-blue-85 fw-400 fs-14 mb-8">
          Enter your email and password to sign in!
        </p>

        <Form
          className="login-form"
          form={form}
          name="login"
          initialValues={{
            remember: true,
          }}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your Email!",
              },
              {
                type: "email",
                message: "This email doesn't look right. Try again.",
              },
            ]}
          >
            <div>
              <label
                className="text-14 fw-500 text-blue-39 mb-2"
                style={{ display: "block", marginBottom: "8px" }}
              >
                Email
              </label>
              <Input
                type="email"
                className="auth-input"
                placeholder="Email"
                autoComplete="email"
              />
            </div>
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your Password!",
              },
            ]}
          >
            <div>
              <label
                className="text-14 fw-500 text-blue-39 mb-2"
                style={{ display: "block", marginBottom: "8px" }}
              >
                Password
              </label>
              <Input
                type={passwordVisible ? "text" : "password"}
                className="auth-input"
                placeholder="*******"
                autoComplete="current-password"
                suffix={
                  <span
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    style={{ cursor: "pointer" }}
                  >
                    {passwordVisible ? (
                      <EyeOutlined />
                    ) : (
                      <EyeInvisibleOutlined />
                    )}
                  </span>
                }
              />
            </div>
          </Form.Item>

          <Form.Item
            className="remember-checkbox"
            style={{ marginBottom: "0px" }}
          >
            <Flex justify="space-between" align="center">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox className="text-14 fw-400 secondary-color-54 font-outfit">
                  Keep me logged in
                </Checkbox>
              </Form.Item>
              <Link
                to={"/forgot-password"}
                className="text-14 fw-400 text-primary font-outfit"
              >
                Forgot password?
              </Link>
            </Flex>
          </Form.Item>

          <Form.Item>
            <Button
              block
              type="primary"
              htmlType="submit"
              className="btn btn-primary"
              loading={loading}
            >
              Sign In
            </Button>
            <p className="text-14 fw-400 text-gray-54 text-center mt-5">
              Don't have an account?{" "}
              <Link to={"/sign-up"} className="text-primary">
                Sign Up
              </Link>
            </p>
          </Form.Item>
        </Form>
      </div>
    </AuthPageLayout>
  );
};

export default SignIn;
