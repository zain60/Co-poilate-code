import React from 'react';
import { Modal } from 'antd';

const ActionModal = ({
  open,
  onCancel,
  onConfirm,
  title,
  content,
  icon,
  confirmText = 'Delete',
  confirmActionClass = 'btn-danger',
  showButtons = true,
  isSubmitting = false,
}) => {
  const defaultIcon = (
    <svg width="90" height="90" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M34.364 6.85053C38.6205 -2.28351 51.3795 -2.28351 55.636 6.85053C58.0129 11.951 63.5594 14.6722 68.9556 13.3853C78.6192 11.0807 86.5743 21.2433 82.2185 30.3287C79.7862 35.402 81.1561 41.5165 85.5082 45.0122C93.3019 51.2725 90.4628 63.9451 80.7747 66.1403C75.3648 67.3661 71.5265 72.2695 71.5572 77.9156C71.6123 88.0265 60.1169 93.6664 52.3918 87.3184C48.0781 83.7737 41.9219 83.7737 37.6082 87.3184C29.8831 93.6664 18.3877 88.0266 18.4428 77.9156C18.4735 72.2695 14.6352 67.3661 9.22531 66.1403C-0.462787 63.9451 -3.30193 51.2725 4.49185 45.0122C8.84391 41.5165 10.2138 35.402 7.78151 30.3287C3.42572 21.2433 11.3808 11.0807 21.0444 13.3853C26.4406 14.6722 31.9871 11.951 34.364 6.85053Z" fill="#FEF3F2" />
      <path fill-rule="evenodd" clip-rule="evenodd" d="M35.6278 37.7497C35.042 37.1639 35.042 36.2142 35.6278 35.6284C36.2136 35.0426 37.1634 35.0426 37.7491 35.6284L44.9994 42.8787L52.2495 35.6286C52.8353 35.0428 53.785 35.0428 54.3708 35.6286C54.9566 36.2144 54.9566 37.1641 54.3708 37.7499L47.1208 45L54.3708 52.2501C54.9566 52.8359 54.9566 53.7856 54.3708 54.3714C53.785 54.9572 52.8353 54.9572 52.2495 54.3714L44.9994 47.1213L37.7491 54.3716C37.1634 54.9574 36.2136 54.9574 35.6278 54.3716C35.042 53.7858 35.042 52.8361 35.6278 52.2503L42.8781 45L35.6278 37.7497Z" fill="#D92D20" />
    </svg>
  );

  return (
    <Modal
      centered
      open={open}
      onCancel={onCancel}
      className='action-modal'
      footer={showButtons ? [
        <div className='flex items-center justify-center gap-3 w-full'>
          <button
            key="cancel"
            className="btn btn-cancel max-w-[91px] w-full mr-3"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            key="delete"
            className={`btn ${confirmText === 'Delete' ? 'btn-danger' : confirmActionClass} max-w-[123px] w-full`}
            onClick={onConfirm}
            disabled={isSubmitting}
          >
            {confirmText}
          </button>
        </div>
      ] : null}
      width={{
        xs: '90%',
        sm: '42.1%',
        md: '40%',
        lg: '42.1%',
        xl: '40.4%',
        xxl: '22.7%',
      }}

    >
      <div className='flex flex-col items-center'>
        <div className='flex items-center justify-center'>
          {icon || defaultIcon}
        </div>
        <h5 className='text-blue-39 mt-7 mb-2'>{title}</h5>
        <p className='fs-14 fw-400 text-blue-85'>{content || "This action will permanently remove the case and all associated data. This cannot be undone. Please confirm that you want to proceed."}</p>
      </div>
    </Modal>
  );
};

export default ActionModal;