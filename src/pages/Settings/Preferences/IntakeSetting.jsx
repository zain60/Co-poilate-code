import React from 'react'
import SettingsLayout from '../../../layout/SettingsLayout'
import { useState } from "react"
import { Upload, Switch, Avatar, message } from "antd"
import { UploadOutlined } from "@ant-design/icons"

const IntakeSetting = () => {

  const [settings, setSettings] = useState({
    autoSendRetainer: true,
    lienOffer: true,
    redirectBusy: true,
    redirectVoicemail1: true,
    redirectVoicemail2: true,
    acceptCarAccidents: false,
    acceptMedicalMalpractice: false,
    acceptSimpleLiability: false,
    acceptComplexLiability: false,
    acceptSlipAndFall: false,
  })

  const [retainerFile, setRetainerFile] = useState(null)
  const [lienFile, setLienFile] = useState(null)

  const handleToggleChange = (key) => (checked) => {
    setSettings({ ...settings, [key]: checked })
    message.success(`Setting updated successfully`)
  }

  const handleRetainerUpload = (info) => {
    if (info.file.status === "done") {
      setRetainerFile(info.file.originFileObj)
      message.success(`${info.file.name} file uploaded successfully`)
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`)
    }
  }

  const handleLienUpload = (info) => {
    if (info.file.status === "done") {
      setLienFile(info.file.originFileObj)
      message.success(`${info.file.name} file uploaded successfully`)
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`)
    }
  }
  return (
    <SettingsLayout>
      <div className=" mx-auto p-6 bg-white">
        {/* Agreements Section */}
        <div className="mb-8">
          <h2 className="fs-20 fw-500 mb-4 text-blue-39">Agreements</h2>

          <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
            <div className="flex-1">
              <p className="fs-14 fw-400 text-blue-85">Automatically send the retainer agreement after the call ends.</p>
              <div className="mt-2">
                <Upload
                  onChange={handleRetainerUpload}
                  maxCount={1}
                  showUploadList={false}
                  customRequest={({ onSuccess }) => setTimeout(() => onSuccess("ok"), 0)}
                >
                  <button className="text-primary fw-500 fs-14 flex items-center">
                    <UploadOutlined className="mr-1" />
                    <span>Upload retainer agreement</span>
                  </button>
                </Upload>
              </div>
            </div>
            <div className="ml-4 flex items-center">
              <Switch
                checked={settings.autoSendRetainer}
                onChange={handleToggleChange("autoSendRetainer")}
                className={`${settings.autoSendRetainer ? "bg-blue-600" : "bg-gray-200"}`}
              />
            </div>
          </div>

          <div className="flex justify-between items-center pb-3 border-b border-gray-100">
            <div className="flex-1">
              <p className="fs-14 fw-400 text-blue-85">Lien offer (amount $3,500)</p>
              <div className="mt-2">
                <Upload
                  onChange={handleLienUpload}
                  maxCount={1}
                  showUploadList={false}
                  customRequest={({ onSuccess }) => setTimeout(() => onSuccess("ok"), 0)}
                >
                  <button className="text-primary fw-500 fs-14 flex items-center">
                    <UploadOutlined className="mr-1 " />
                    <span>Upload lien offer</span>
                  </button>
                </Upload>
              </div>
            </div>
            <div className="ml-4 flex items-center">
              <Switch
                checked={settings.lienOffer}
                onChange={handleToggleChange("lienOffer")}
                className={`${settings.lienOffer ? "bg-blue-600" : "bg-gray-200"}`}
              />
            </div>
          </div>
        </div>

        {/* Call Forward Section */}
        <div className="mb-8">
          <h2 className="fs-20 fw-500 mb-4 text-blue-39 mb-4">Call Forward</h2>

          <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
            <p className="fs-14 fw-400 text-blue-85 flex-1">
              Redirect all incoming calls if the receptionist is busy on another call.
            </p>
            <Switch
              checked={settings.redirectBusy}
              onChange={handleToggleChange("redirectBusy")}
              className={`${settings.redirectBusy ? "bg-blue-600" : "bg-gray-200"}`}
            />
          </div>

          <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
            <p className="fs-14 fw-400 text-blue-85 flex-1">
              Redirect calls to voicemail or another number when the primary line is in use.
            </p>
            <Switch
              checked={settings.redirectVoicemail1}
              onChange={handleToggleChange("redirectVoicemail1")}
              className={`${settings.redirectVoicemail1 ? "bg-blue-600" : "bg-gray-200"}`}
            />
          </div>

          <div className="flex justify-between items-center pb-3 border-b border-gray-100">
            <p className="fs-14 fw-400 text-blue-85 flex-1">
              Redirect calls to voicemail or another number when the primary line is in use.
            </p>
            <Switch
              checked={settings.redirectVoicemail2}
              onChange={handleToggleChange("redirectVoicemail2")}
              className={`${settings.redirectVoicemail2 ? "bg-blue-600" : "bg-gray-200"}`}
            />
          </div>
        </div>

        {/* Cases Section */}
        <div>
          <h2 className="fs-20 fw-500 mb-4 text-blue-39  mb-4">Cases</h2>

          <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
            <p className="fs-14 fw-400 text-blue-85">Accept Car Accidents</p>
            <Switch
              checked={settings.acceptCarAccidents}
              onChange={handleToggleChange("acceptCarAccidents")}
              className={`${settings.acceptCarAccidents ? "bg-blue-600" : "bg-gray-200"}`}
            />
          </div>

          <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
            <p className="fs-14 fw-400 text-blue-85">Accept Medical Malpractice</p>
            <Switch
              checked={settings.acceptMedicalMalpractice}
              onChange={handleToggleChange("acceptMedicalMalpractice")}
              className={`${settings.acceptMedicalMalpractice ? "bg-blue-600" : "bg-gray-200"}`}
            />
          </div>

          <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
            <p className="fs-14 fw-400 text-blue-85">Accept Simple Liability Cases</p>
            <Switch
              checked={settings.acceptSimpleLiability}
              onChange={handleToggleChange("acceptSimpleLiability")}
              className={`${settings.acceptSimpleLiability ? "bg-blue-600" : "bg-gray-200"}`}
            />
          </div>

          <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
            <p className="fs-14 fw-400 text-blue-85">Accept Complex Liability Cases</p>
            <Switch
              checked={settings.acceptComplexLiability}
              onChange={handleToggleChange("acceptComplexLiability")}
              className={`${settings.acceptComplexLiability ? "bg-blue-600" : "bg-gray-200"}`}
            />
          </div>

          <div className="flex justify-between items-center pb-3 border-b border-gray-100">
            <p className="fs-14 fw-400 text-blue-85">Accept Slip and Fall</p>
            <Switch
              checked={settings.acceptSlipAndFall}
              onChange={handleToggleChange("acceptSlipAndFall")}
              className={`${settings.acceptSlipAndFall ? "bg-blue-600" : "bg-gray-200"}`}
            />
          </div>
        </div>
      </div>
    </SettingsLayout>
  )
}

export default IntakeSetting