import React, { useState } from 'react';
import { Menu } from 'antd';
import { EditOutlined, InboxOutlined, DeleteOutlined } from '@ant-design/icons';
import { CustomModal } from '../ui/CustomModal';
import AddNewCaseForm from '../../pages/OngoingCases/partials/AddNewCaseForm';
import { ArchiveModal } from './ArchiveModal';
import { DeleteCaseModal } from './DeleteCaseModal';

export const CaseActionMenu = ({ caseItem, handleDeleteCaseSuccess, onArchiveSucess, handleCaseUpdateSuccess }) => {
  const [isCaseModalVisible, setIsCaseModalVisible] = useState(false);
  const [isDeleteCaseModalVisible, setIsDeleteCaseModalVisible] = useState(false);
  const [openArchiveModal, setOpenArchiveModal] = useState(false);

  const handleCloseModal = () => {
    setIsCaseModalVisible(false);
    setIsDeleteCaseModalVisible(false);
    setOpenArchiveModal(false);
  };

  const handleMenuClick = (e) => {
    switch (e.key) {
      case "edit":
        setIsCaseModalVisible(true);
        break;
      case "archive":
        setOpenArchiveModal(true);
        break;
      case "delete":
        setIsDeleteCaseModalVisible(true);
        break;
      default:
        break;
    }
  };

  return (
    <>
      <Menu
        className="rounded-2xl shadow-xl p-6 bg-white w-44 gap-8"
        onClick={handleMenuClick}
      >
        <Menu.Item
          key="edit"
          className="flex items-center gap-5 text-[#344054] hover:bg-gray-100 rounded-lg px-3 py-2"
        >
          <EditOutlined className="text-xl text-[#667085]" />
          <span className="fs-14 fw-500 text-gray-54 font-outfit ml-3">
            Edit profile
          </span>
        </Menu.Item>

        <Menu.Item
          key="archive"
          className="flex items-center gap-3 text-gray-800 hover:bg-gray-100 rounded-lg px-3 py-4"
        >
          <InboxOutlined className="text-xl" />
          <span className="fs-14 fw-500 text-gray-54 font-outfit ml-3">
            Move to archive
          </span>
        </Menu.Item>

        <Menu.Item
          key="delete"
          className="delete-provider flex items-center gap-3 text-red-500 hover:bg-red-100 rounded-lg px-3 py-2"
        >
          <DeleteOutlined className="text-xl text-[#D92D20]" />
          <span className="fs-14 fw-500 ml-3 font-outfit text-[#D92D20]">
            Delete
          </span>
        </Menu.Item>
      </Menu>

      <DeleteCaseModal
        selectedCaseId={caseItem?.id}
        caseDeleteModalVisible={isDeleteCaseModalVisible}
        setCaseDeleteModalVisible={setIsDeleteCaseModalVisible}
        onDeleteSuccess={handleDeleteCaseSuccess}
      />

      <AddNewCaseForm open={isCaseModalVisible} onClose={handleCloseModal} isEdit={true} initialValues={caseItem} onSubmitSuccess={() => {
        handleCloseModal();
        handleCaseUpdateSuccess();
      }} />

      <ArchiveModal
        isOpen={openArchiveModal}
        onClose={() => {
          setOpenArchiveModal(false);
        }}
        onArchiveSucess={onArchiveSucess}
        caseItem={caseItem}
      />
    </>
  );
};
