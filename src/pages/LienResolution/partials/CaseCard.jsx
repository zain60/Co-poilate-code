import React from 'react'
import { Avatar, Button, Input } from 'antd';
import { ArrowRightOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const CaseCard = ({ caseItem }) => {
  return (
    <div
      key={caseItem.id}
      className="border border-gray-200 rounded-xl p-2 hover:shadow-md transition-shadow relative"
    >

      <div className='rounded-xl bg-[#F9FAFB] p-3 '>
        <div className="flex justify-between items-start mb-4">
          <h2 className="fs-20 fw-700 text-blue-39">{caseItem.fullName}</h2>

          <Link to={`/case-dashboard/${caseItem?.id}`} className='rounded-lg bg-[#fff] w-8 h-8 flex justify-center items-center'> <ArrowRightOutlined className="text-gray-400" /></Link>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex">
            <span className="fs-14 fw-400 text-blue-85 w-32">No of files:</span>
            <span className="fs-14 fw-500 text-gray-54">{caseItem.files}</span>
          </div>

          <div className="flex">
            <span className="fs-14 fw-400 text-blue-85 w-32">Date of Accident:</span>
            <span className="fs-14 fw-500 text-gray-54">{caseItem.dateOfAccident}</span>
          </div>

          <div className="flex">
            <span className="fs-14 fw-400 text-blue-85 w-32">Case Started on:</span>
            <span className="fs-14 fw-500 text-gray-54">{caseItem.startDate}</span>
          </div>

          <div className="flex items-center">
            <span className="fs-14 fw-400 text-blue-85 w-32">Case Status:</span>
            <span className={`px-2 py-0.5 rounded-md fs-14 fw-500 ${caseItem.statusColor}`}>{caseItem.status}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CaseCard