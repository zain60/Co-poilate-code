import React, { useState } from 'react';
import { FaExclamationCircle, FaExchangeAlt } from 'react-icons/fa';
import { archiveCase } from '../../services/cases';
import { message } from 'antd';
import ActionModal from '../ui/ActionModal';
import { useSelector } from 'react-redux';

export const ArchiveModal = ({ caseItem, isOpen, onClose, onArchiveSucess }) => {
  if (!isOpen) return null;

  const [movedCaseToArchiveVisible, setMovedCaseToArchiveVisible] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleArchiveCase = () => {
    setIsSubmitting(true);
    const model = {
      reason: "Case is completed",
      caseId: caseItem?.id,
      userId: user?.id,
    };

    archiveCase(model)
      .then((response) => {
        console.log("Case archived successfully:", response);
        message.success(response?.message || "Case archived successfully");
        setMovedCaseToArchiveVisible(true);
        setTimeout(() => {
          setMovedCaseToArchiveVisible(false);
          onArchiveSucess(caseItem);
        }, 1000);
        setIsSubmitting(false);
      })
      .catch((err) => {
        message.error(err);
        console.error("Error archive case:", err);
        onClose();
        setIsSubmitting(false);
      });
  };

  return (
    <>
      <ActionModal
        open={isOpen}
        onCancel={() => onClose()}
        onConfirm={handleArchiveCase}
        title="Archive this case?"
        content="Archiving will remove the case from your active view but will not delete any information.
          You can restore it at any time from the Archived Cases section."
        showButtons={true}
        confirmText="Archive Case"
        confirmButtonColor="#FFF3E0"
        icon={
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M45.8187 9.13404C51.494 -3.04468 68.506 -3.04468 74.1813 9.13404C77.3505 15.9347 84.7459 19.563 91.9408 17.8471C104.826 14.7743 115.432 28.3245 109.625 40.4382C106.382 47.2026 108.208 55.3554 114.011 60.0163C124.403 68.3633 120.617 85.2601 107.7 88.187C100.486 89.8214 95.3686 96.3594 95.4096 103.887C95.4831 117.369 80.1559 124.889 69.8558 116.425C64.1042 111.698 55.8958 111.698 50.1442 116.425C39.8441 124.889 24.5169 117.369 24.5903 103.887C24.6314 96.3594 19.5136 89.8214 12.3004 88.187C-0.61705 85.2601 -4.40257 68.3633 5.98913 60.0163C11.7919 55.3554 13.6184 47.2026 10.3754 40.4382C4.56763 28.3245 15.1744 14.7743 28.0592 17.8471C35.2541 19.563 42.6495 15.9347 45.8187 9.13404Z" fill="#FFF3E0" />
            <g transform="translate(40, 45) scale(2.5)">
              <FaExclamationCircle color='#F39C12' />
            </g>
          </svg>
        }
        isSubmitting={isSubmitting}
      />

      <ActionModal
        open={movedCaseToArchiveVisible}
        onCancel={() => setMovedCaseToArchiveVisible(false)}
        onConfirm={() => { }}
        title="Case Moved"
        content="Congratulations! You've successfully moved the case to archived cases."
        showButtons={false}
        icon={
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M45.8187 9.13404C51.494 -3.04468 68.506 -3.04468 74.1813 9.13404C77.3505 15.9347 84.7459 19.563 91.9408 17.8471C104.826 14.7743 115.432 28.3245 109.625 40.4382C106.382 47.2026 108.208 55.3554 114.011 60.0163C124.403 68.3633 120.617 85.2601 107.7 88.187C100.486 89.8214 95.3686 96.3594 95.4096 103.887C95.4831 117.369 80.1559 124.889 69.8558 116.425C64.1042 111.698 55.8958 111.698 50.1442 116.425C39.8441 124.889 24.5169 117.369 24.5903 103.887C24.6314 96.3594 19.5136 89.8214 12.3004 88.187C-0.61705 85.2601 -4.40257 68.3633 5.98913 60.0163C11.7919 55.3554 13.6184 47.2026 10.3754 40.4382C4.56763 28.3245 15.1744 14.7743 28.0592 17.8471C35.2541 19.563 42.6495 15.9347 45.8187 9.13404Z" fill="#ECFDF3" />
            <g transform="translate(45, 45) scale(2.5)">
              <FaExchangeAlt color='#0B6623' />
            </g>
          </svg>
        }
      />
    </>
  );
};
