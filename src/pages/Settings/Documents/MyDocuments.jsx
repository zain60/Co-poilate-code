import React from 'react'
import { EditOutlined, DeleteOutlined, QuestionCircleOutlined, DownOutlined } from '@ant-design/icons'
import SettingsLayout from '../../../layout/SettingsLayout'

const MyDocuments = () => {
  return (
    <SettingsLayout>

    <div className='gap-4 flex flex-col'>
        <div className="flex items-center gap-5 p-5 w-full relative bg-white rounded-xl border border-solid border-[#e4e7ec] shadow-shadows-shadow-sm">
  <div className="flex items-center gap-4 relative flex-1 grow">
    <div className="items-start gap-3 flex-1 grow flex relative">
      {/* Toggle icons - hardcoded open state example */}
      <div className="cursor-pointer hidden">
        <QuestionCircleOutlined />
      </div> 

      <div className="flex flex-col items-start justify-center gap-1 relative flex-1 grow">
        <div className="items-center gap-2.5 self-stretch w-full flex-[0_0_auto] flex relative">
          <p className="text-question cursor-pointer relative w-fit">
            Document Name
          </p>
        </div> 
      </div>
    </div>
  </div>

  {/* Status badge (assuming activeTab === "new") */}
  {/* <div className="inline-flex items-center justify-center px-2 py-0.5 relative flex-[0_0_auto] rounded-[999px] bg-[#ECFDF3]">
    <div className="relative w-fit status-tag text-[#039855]">
      Completed
    </div>
  </div> */}

  {/* Edit & delete icons (assuming activeTab === "new") */}
  {/* <div className="relative w-6 h-6 cursor-pointer">
    <EditOutlined />
  </div> */}

  <div className="relative w-6 h-6 cursor-pointer">
    <DeleteOutlined />
  </div>
</div>


<div className="flex items-center gap-5 p-5 w-full relative bg-white rounded-xl border border-solid border-[#e4e7ec] shadow-shadows-shadow-sm">
  <div className="flex items-center gap-4 relative flex-1 grow">
    <div className="items-start gap-3 flex-1 grow flex relative">
      {/* Toggle icons - hardcoded open state example */}
      <div className="cursor-pointer hidden">
        <QuestionCircleOutlined />
      </div> 

      <div className="flex flex-col items-start justify-center gap-1 relative flex-1 grow">
        <div className="items-center gap-2.5 self-stretch w-full flex-[0_0_auto] flex relative">
          <p className="text-question cursor-pointer relative w-fit">
            Document Name
          </p>
        </div> 
      </div>
    </div>
  </div>

  {/* Status badge (assuming activeTab === "new") */}
  {/* <div className="inline-flex items-center justify-center px-2 py-0.5 relative flex-[0_0_auto] rounded-[999px] bg-[#ECFDF3]">
    <div className="relative w-fit status-tag text-[#039855]">
      Completed
    </div>
  </div> */}

  {/* Edit & delete icons (assuming activeTab === "new") */}
  {/* <div className="relative w-6 h-6 cursor-pointer">
    <EditOutlined />
  </div> */}

  <div className="relative w-6 h-6 cursor-pointer">
    <DeleteOutlined />
  </div>
</div>

<div className="flex items-center gap-5 p-5 w-full relative bg-white rounded-xl border border-solid border-[#e4e7ec] shadow-shadows-shadow-sm">
  <div className="flex items-center gap-4 relative flex-1 grow">
    <div className="items-start gap-3 flex-1 grow flex relative">
      {/* Toggle icons - hardcoded open state example */}
      <div className="cursor-pointer hidden">
        <QuestionCircleOutlined />
      </div> 

      <div className="flex flex-col items-start justify-center gap-1 relative flex-1 grow">
        <div className="items-center gap-2.5 self-stretch w-full flex-[0_0_auto] flex relative">
          <p className="text-question cursor-pointer relative w-fit">
            Document Name
          </p>
        </div> 
      </div>
    </div>
  </div>

  {/* Status badge (assuming activeTab === "new") */}
  {/* <div className="inline-flex items-center justify-center px-2 py-0.5 relative flex-[0_0_auto] rounded-[999px] bg-[#ECFDF3]">
    <div className="relative w-fit status-tag text-[#039855]">
      Completed
    </div>
  </div> */}

  {/* Edit & delete icons (assuming activeTab === "new") */}
  {/* <div className="relative w-6 h-6 cursor-pointer">
    <EditOutlined />
  </div> */}

  <div className="relative w-6 h-6 cursor-pointer">
    <DeleteOutlined />
  </div>
</div>

    </div>
    </SettingsLayout>
  )
}

export default MyDocuments