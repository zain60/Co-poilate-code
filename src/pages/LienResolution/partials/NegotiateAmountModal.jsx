import React, { useEffect, useState } from "react";
import { Modal, Form, Button, Input } from "antd";
import { UpOutlined, DownOutlined } from "@ant-design/icons";
import { sendLienOffer } from "../../../services/cases";
import { useSelector } from "react-redux";

const NegotiateAmountModal = ({
  caseId,
  visible,
  onCancel,
  onSave,
  loading = false,
  provider,
}) => {
  const user = useSelector((state) => state.auth.user);
  const [form] = Form.useForm();
  const [isManualMode, setIsManualMode] = useState(false);
  const [amount, setAmount] = useState(
    provider?.billAmount?.replace(/[^0-9.]/g, "") || "0.00"
  );

  useEffect(() => {
    if (form) {
      form.setFieldsValue({ currentAmount: amount });
    }
  }, [amount, form]);

  const handleManualToggle = () => {
    setIsManualMode(!isManualMode);
  };

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/[^0-9.]/g, "");
    setAmount(value);
  };

  const adjustAmount = (increment) => {
    const numericValue = parseFloat(amount) || 0;
    const newAmount = Math.max(0, numericValue + increment);
    setAmount(newAmount.toFixed(2));
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        caseId: caseId,
        providerId: provider?.userId,
        attorneyId: user?.id,
        offerAmount: values?.currentAmount,
        message: values?.notes,
      };
      await sendLienOffer(payload);
      onSave(values);
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const onClose = () => {
    form.resetFields();
    setIsManualMode(false);
    setAmount(provider?.billAmount?.replace(/[^0-9.]/g, "") || "0.00");
    onCancel();
  };

  return (
    <Modal
      title={
        <div className="p-4">
          <div className="text-xl font-semibold mb-2">
            Select a Lien Negotiation Request
          </div>
          <div className="text-base text-gray-600 mb-3">
            Send an Offer to{" "}
            <span className="text-gray-600 font-medium">
              {provider?.fullName}
            </span>
          </div>
          <div className="text-base text-gray-600">
            Bill Amount:{" "}
            <span className="text-gray-900 font-medium">
              ${provider?.billAmount}
            </span>
          </div>
        </div>
      }
      open={visible}
      onCancel={onClose}
      closeIcon={
        <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5"
              stroke="#6B7280"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      }
      footer={
        <div className="px-6 py-4">
          {/* {!isManualMode ? (
            <>
              <Button
                key="offer"
                onClick={handleSubmit}
                loading={loading}
                className="w-full sm:w-auto h-10 rounded-lg px-6 mb-2 sm:mb-0 sm:mr-3"
              >
                Counter Offer
              </Button>
              <Button
                key="request"
                type="primary"
                onClick={() => setIsManualMode(false)}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 h-10 rounded-lg px-6"
              >
                Accept Offer
              </Button>
            </>
          ) : (
            <Button
              key="submit"
              type="primary"
              onClick={handleSubmit}
              loading={loading}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 h-10 rounded-lg px-6"
            >
              Send Offer
            </Button>
          )} */}

          <Button
            key="submit"
            type="primary"
            onClick={handleSubmit}
            loading={loading}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 h-10 rounded-lg px-6"
          >
            Send Offer
          </Button>
        </div>
      }
      width={700}
      className="rounded-3xl [&_.ant-modal-content]:rounded-3xl [&_.ant-modal-header]:rounded-t-3xl [&_.ant-modal-body]:rounded-b-3xl"
    >
      <Form form={form} layout="vertical" className="p-4">
        <Form.Item
          name="currentAmount"
          label={
            <span className="text-sm font-medium text-gray-700">
              Enter Price
            </span>
          }
          className="mb-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <div className="flex items-center">
              <div className="relative" style={{ width: "250px" }}>
                <Form.Item name="currentAmount" noStyle>
                  <Input
                    type="text"
                    value={isManualMode ? amount : `$${amount}`}
                    onChange={handleAmountChange}
                    readOnly={!isManualMode}
                    className={`w-full text-4xl font-bold px-4 py-2 border rounded-xl ${
                      isManualMode ? "border-blue-400 ring-2 ring-blue-100" : ""
                    }`}
                  />
                </Form.Item>
              </div>
              {!isManualMode && (
                <div className="flex flex-col ml-2">
                  <button
                    className="hover:text-blue-600 p-1"
                    onClick={(e) => {
                      e.preventDefault();
                      adjustAmount(100);
                    }}
                  >
                    <UpOutlined />
                  </button>
                  <button
                    className="hover:text-blue-600 p-1"
                    onClick={(e) => {
                      e.preventDefault();
                      adjustAmount(-100);
                    }}
                  >
                    <DownOutlined />
                  </button>
                </div>
              )}
            </div>
            {!isManualMode && (
              <div className="flex items-center text-sm sm:text-base mt-2 sm:mt-0">
                <span className="mx-1 text-gray-500">or</span>
                <button
                  type="button"
                  className="text-blue-600 font-medium hover:underline focus:outline-none"
                  onClick={handleManualToggle}
                >
                  Add Manually
                </button>
              </div>
            )}
          </div>
        </Form.Item>

        <Form.Item
          name="notes"
          label={
            <span className="text-sm font-medium text-gray-700">
              Write a Message
            </span>
          }
          className="mt-8 mb-0"
        >
          <Input.TextArea
            rows={6}
            className="text-base p-4 border-gray-300 rounded-xl hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            placeholder="Type your message here..."
            style={{ minHeight: "150px" }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default NegotiateAmountModal;
