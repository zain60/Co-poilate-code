import React, { useEffect } from 'react';
import ActionModal from '../ui/ActionModal';
import { message } from 'antd';
interface CopyLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseId: string;
}

const CopyLinkModal: React.FC<CopyLinkModalProps> = ({ caseId, isOpen, onClose }) => {
  const caseType = localStorage.getItem('currentPage');

  useEffect(() => {
    if (isOpen && caseId && caseType) {
      handleCopy();
    }
  }, [isOpen, caseId, caseType]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.protocol}/${window.location.host}/tasks/${caseId}?caseType=${caseType}`).then(() => {
        setTimeout(() => {
          message.success('Link copied to clipboard!');
          onClose();
        }, 1000);
      });
    } catch (err) {
      message.error('Failed to copy link!');
    }
  };

  return (
    <ActionModal
      open={isOpen}
      onCancel={onClose}
      onConfirm={() => { }}
      title="Link Copied"
      content="You've successfully copied the link of the intake form."
      showButtons={false}
      icon={
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M45.8187 9.13404C51.494 -3.04468 68.506 -3.04468 74.1813 9.13404C77.3505 15.9347 84.7459 19.563 91.9408 17.8471C104.826 14.7743 115.432 28.3245 109.625 40.4382C106.382 47.2026 108.208 55.3554 114.011 60.0163C124.403 68.3633 120.617 85.2601 107.7 88.187C100.486 89.8214 95.3686 96.3594 95.4096 103.887C95.4831 117.369 80.1559 124.889 69.8558 116.425C64.1042 111.698 55.8958 111.698 50.1442 116.425C39.8441 124.889 24.5169 117.369 24.5903 103.887C24.6314 96.3594 19.5136 89.8214 12.3004 88.187C-0.61705 85.2601 -4.40257 68.3633 5.98913 60.0163C11.7919 55.3554 13.6184 47.2026 10.3754 40.4382C4.56763 28.3245 15.1744 14.7743 28.0592 17.8471C35.2541 19.563 42.6495 15.9347 45.8187 9.13404Z" fill="#ECFDF3" />
          <path fill-rule="evenodd" clip-rule="evenodd" d="M46.9375 60C46.9375 52.785 52.7864 46.9361 60.0014 46.9361C67.2164 46.9361 73.0653 52.785 73.0653 60C73.0653 67.215 67.2164 73.0639 60.0014 73.0639C52.7864 73.0639 46.9375 67.215 46.9375 60ZM60.0014 43.9361C51.1296 43.9361 43.9375 51.1281 43.9375 60C43.9375 68.8719 51.1296 76.0639 60.0014 76.0639C68.8733 76.0639 76.0653 68.8719 76.0653 60C76.0653 51.1281 68.8733 43.9361 60.0014 43.9361ZM65.7855 58.0571C66.3713 57.4713 66.3713 56.5215 65.7855 55.9358C65.1997 55.35 64.25 55.35 63.6642 55.9358L58.7177 60.8823L56.3387 58.5032C55.7529 57.9174 54.8031 57.9174 54.2173 58.5032C53.6316 59.089 53.6316 60.0388 54.2173 60.6245L57.657 64.0642C57.9383 64.3455 58.3199 64.5036 58.7177 64.5036C59.1155 64.5036 59.4971 64.3455 59.7784 64.0642L65.7855 58.0571Z" fill="#039855" />
        </svg>
      }
    />
  );
};

export default CopyLinkModal;