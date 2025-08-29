"use client"

import { useState } from "react"
import { Input, Select, Checkbox, Button, Form, message, Upload, Switch, Avatar } from "antd"
import { PlusOutlined, MailOutlined, UploadOutlined } from "@ant-design/icons"
import SettingsLayout from "../../../layout/SettingsLayout"

const { Option } = Select

export default function Payment() {
  const [form] = Form.useForm()
  const [cards, setCards] = useState([
    {
      id: 1,
      nameOnCard: "Olivia Rhye",
      cardNumber: "1234 1234 1234 1234",
      expiryMonth: "06",
      expiryYear: "2024",
      cvv: "123",
      cardType: "mastercard",
    },
  ])
  const [emails, setEmails] = useState(["jake@medical.com"])
  const [enableAutomaticPayments, setEnableAutomaticPayments] = useState(false)
  const [messageApi, contextHolder] = message.useMessage()

  // Generate years for expiry select
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 10 }, (_, i) => (currentYear + i).toString())

  // Generate months for expiry select
  const months = Array.from({ length: 12 }, (_, i) => {
    const month = (i + 1).toString().padStart(2, "0")
    return month
  })

  // Handle card number input with formatting
  const handleCardNumberChange = (e, cardId) => {
    let value = e.target.value.replace(/\D/g, "")

    // Format with spaces every 4 digits
    if (value.length > 0) {
      value = value.match(/.{1,4}/g).join(" ")
    }

    // Update the specific card
    const updatedCards = cards.map((card) => {
      if (card.id === cardId) {
        return { ...card, cardNumber: value }
      }
      return card
    })

    setCards(updatedCards)

    // Detect card type
    detectCardType(value, cardId)
  }

  // Detect card type based on first digits
  const detectCardType = (cardNumber, cardId) => {
    const number = cardNumber.replace(/\D/g, "")
    let cardType = ""

    if (number.startsWith("4")) {
      cardType = "visa"
    } else if (/^5[1-5]/.test(number)) {
      cardType = "mastercard"
    } else if (/^3[47]/.test(number)) {
      cardType = "amex"
    } else if (/^6(?:011|5)/.test(number)) {
      cardType = "discover"
    }

    const updatedCards = cards.map((card) => {
      if (card.id === cardId) {
        return { ...card, cardType }
      }
      return card
    })

    setCards(updatedCards)
  }

  // Add a new card
  const addAnotherCard = () => {
    const newCard = {
      id: cards.length + 1,
      nameOnCard: "",
      cardNumber: "",
      expiryMonth: "",
      expiryYear: "",
      cvv: "",
      cardType: "",
    }
    setCards([...cards, newCard])
  }

  // Add another email
  const addAnotherEmail = () => {
    setEmails([...emails, ""])
  }

  // Update email at specific index
  const updateEmail = (index, value) => {
    const updatedEmails = [...emails]
    updatedEmails[index] = value
    setEmails(updatedEmails)
  }

  // Handle form submission
  const handleSubmit = () => {
    form.validateFields().then((values) => {
      console.log("Form values:", values)
      console.log("Cards:", cards)
      console.log("Emails:", emails)
      console.log("Automatic payments:", enableAutomaticPayments)

      messageApi.success("Payment information saved successfully!")
    })
  }

  // Get card icon based on card type
  const getCardIcon = (cardType) => {
    if (cardType === "visa") {
      return "/visa.svg"
    } else if (cardType === "mastercard") {
      return "/mastercard.svg"
    } else if (cardType === "amex") {
      return "/amex.svg"
    } else if (cardType === "discover") {
      return "/discover.svg"
    }
    return null
  }

  // Add this function to render required asterisk
  const renderRequiredMark = () => {
    return <span className="text-red-500 ml-1">*</span>;
  }

  return (
    <SettingsLayout>
    <div className="max-w-[512px] bg-white">
      {contextHolder}
      <Form form={form} layout="vertical" onFinish={handleSubmit} requiredMark={false} >
        <h2 className="fs-14 fw-600 text-gray-54 mb-6">Card details</h2>

        {cards.map((card, index) => (
          <div key={card.id} className={index > 0 ? "mt-8" : ""}>
            {index > 0 && <div className="h-px bg-gray-200 my-6"></div>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item className="payment-form-container"
                label={<>Name on card {renderRequiredMark()}</>}
                name={`nameOnCard-${card.id}`}
                initialValue={card.nameOnCard}
                rules={[{ required: true, message: "Please enter the name on card" }]}
              >
                <Input
                  placeholder="Enter name on card"
                  value={card.nameOnCard}
                  onChange={(e) => {
                    const updatedCards = cards.map((c) => {
                      if (c.id === card.id) {
                        return { ...c, nameOnCard: e.target.value }
                      }
                      return c
                    })
                    setCards(updatedCards)
                  }}
                />
              </Form.Item>

              <Form.Item label={<>Expiry {renderRequiredMark()}</>} className="payment-form-container">
                <div className="flex space-x-2">
                  <Form.Item
                    name={`expiryMonth-${card.id}`}
                    initialValue={card.expiryMonth}
                    noStyle
                    rules={[{ required: true, message: "Required" }]}
                  >
                    <Select
                      placeholder="MM"
                      style={{ width: "50%" }}
                      value={card.expiryMonth}
                      className="select-height"
                      onChange={(value) => {
                        const updatedCards = cards.map((c) => {
                          if (c.id === card.id) {
                            return { ...c, expiryMonth: value }
                          }
                          return c
                        })
                        setCards(updatedCards)
                      }}
                    >
                      {months.map((month) => (
                        <Option key={month} value={month}>
                          {month}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item className="payment-form-container"
                    name={`expiryYear-${card.id}`}
                    initialValue={card.expiryYear}
                    noStyle
                    rules={[{ required: true, message: "Required" }]}
                  >
                    <Select
                    className="select-height"
                      placeholder="YYYY"
                      style={{ width: "50%" }}
                      value={card.expiryYear}
                      onChange={(value) => {
                        const updatedCards = cards.map((c) => {
                          if (c.id === card.id) {
                            return { ...c, expiryYear: value }
                          }
                          return c
                        })
                        setCards(updatedCards)
                      }}
                    >
                      {years.map((year) => (
                        <Option key={year} value={year}>
                          {year}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
              </Form.Item>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <Form.Item
              className="payment-form-container"
                label={<>Card number {renderRequiredMark()}</>}
                name={`cardNumber-${card.id}`}
                initialValue={card.cardNumber}
                rules={[
                  { required: true, message: "Please enter the card number" },
                  {
                    validator: (_, value) => {
                      const digits = value.replace(/\D/g, "")
                      if (digits.length < 15) {
                        return Promise.reject("Card number must be at least 15 digits")
                      }
                      return Promise.resolve()
                    },
                  },
                ]}
              >
                <Input
                  placeholder="1234 1234 1234 1234"
                  value={card.cardNumber}
                  onChange={(e) => handleCardNumberChange(e, card.id)}
                  maxLength={19}
                  prefix={
                    card.cardType && (
                      <div className="mr-2">
                       <svg width="36" height="24" viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="36" height="24" rx="4" fill="white"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M21.6 16.8C19.8327 18.5673 17.0163 18.5673 15.249 16.8C13.4817 15.0327 13.4817 12.2163 15.249 10.449C17.0163 8.68166 19.8327 8.68166 21.6 10.449C23.3673 12.2163 23.3673 15.0327 21.6 16.8Z" fill="#ED0006"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M21.6 16.8C23.3673 15.0327 23.3673 12.2163 21.6 10.449C20.7163 9.56533 19.5572 9.12349 18.3995 9.12349C17.2418 9.12349 16.0827 9.56533 15.199 10.449C13.4317 12.2163 13.4317 15.0327 15.199 16.8C16.0827 17.6837 17.2418 18.1255 18.3995 18.1255C19.5572 18.1255 20.7163 17.6837 21.6 16.8Z" fill="#F9A000"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M22.5 10.449C21.6163 9.56533 20.4572 9.12349 19.2995 9.12349C18.1418 9.12349 16.9827 9.56533 16.099 10.449C15.2153 11.3327 14.7735 12.4918 14.7735 13.6495C14.7735 14.8072 15.2153 15.9663 16.099 16.85C16.9827 17.7337 18.1418 18.1755 19.2995 18.1755C20.4572 18.1755 21.6163 17.7337 22.5 16.85C23.3837 15.9663 23.8255 14.8072 23.8255 13.6495C23.8255 12.4918 23.3837 11.3327 22.5 10.449Z" fill="#FF5E00"/>
  </svg>
                        {/* <img
                          src={getCardIcon(card.cardType) || "/placeholder.svg"}
                          alt={card.cardType}
                          width={24}
                          height={16}
                        /> */}
                      </div>
                    )
                  }
                />
              </Form.Item>

              <Form.Item
              className="payment-form-container"
                label={<>CVV {renderRequiredMark()}</>}
                name={`cvv-${card.id}`}
                initialValue={card.cvv}
                rules={[
                  { required: true, message: "Please enter the CVV" },
                  {
                    validator: (_, value) => {
                      if (value && (value.length < 3 || value.length > 4)) {
                        return Promise.reject("CVV must be 3 or 4 digits")
                      }
                      return Promise.resolve()
                    },
                  },
                ]}
              >
                <Input
                  placeholder="123"
                  value={card.cvv}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "")
                    const updatedCards = cards.map((c) => {
                      if (c.id === card.id) {
                        return { ...c, cvv: value }
                      }
                      return c
                    })
                    setCards(updatedCards)
                  }}
                  maxLength={4}
                  type="password"
                />
              </Form.Item>
            </div>
          </div>
        ))}

        <div className="mb-6 mt-2">
          <button type="button" className="fs-14 fw-400 text-primary flex items-center" onClick={addAnotherCard}>
            <PlusOutlined className="mr-1" />
            Add another Card
          </button>
        </div>

        <div className="h-px bg-gray-200 my-6"></div>

        <div className="mb-6">
          <h3 className="fs-14 fw-600 text-gray-54 mb-1">Email address</h3>
          <p className="fs-14 fw-400 gray-color-67 mb-6">Invoices will be sent to this email address.</p>

          {emails.map((email, index) => (
            <Form.Item
              key={index}
              name={`email-${index}`}
              initialValue={email}
              className={`payment-form-container ${index > 0 ? "mt-3" : ""}`}
              // label={index === 0 ? <><span>Email address</span> {renderRequiredMark()}</> : null}
              rules={[
                { required: true, message: "Please enter an email address" },
                { type: "email", message: "Please enter a valid email address" },
              ]}
            >
              <Input
                placeholder="email@example.com"
                value={email}
                onChange={(e) => updateEmail(index, e.target.value)}
                prefix={<MailOutlined className="text-gray-400 mr-2" />}
              />
            </Form.Item>
          ))}

          <div className="mt-2">
            <button type="button" className="fs-14 fw-400 flex items-center text-primary" onClick={addAnotherEmail}>
              <PlusOutlined className="mr-1" />
              Add another
            </button>
          </div>
        </div>

        <div className="h-px bg-gray-200 my-6"></div>

        <Form.Item name="enableAutomaticPayments" valuePropName="checked">
          <Checkbox checked={enableAutomaticPayments} onChange={(e) => setEnableAutomaticPayments(e.target.checked)}>
            <div className="ml-2">
              <span className="fs-14 fw-600 text-gray-54">Enable Automatic Payments</span>
              <p className="fs-14 fw-400 gray-color-67">Save this card for automatic payments in the future.</p>
            </div>
          </Checkbox>
        </Form.Item>

        {/* <div className="mt-6">
          <Button type="primary" htmlType="submit" className="bg-blue-600 hover:bg-blue-700">
            Save Payment Information
          </Button>
        </div> */}
      </Form>
    </div>
    </SettingsLayout>
  )
}
