import Modal from "@libs/app/components/general-components/modal/modal";
import React from "react";

interface ConfirmDeleteModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  loading?: boolean;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  open,
  onClose,
  onConfirm,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  loading = false,
}) => {
  if (!open) return null;

  return (
    <Modal
      title={title}
      buttonContent="Delete"
      onClose={onClose}
      onSubmit={onConfirm}
      isLoadingButton={loading}
      className="w-[450px]"
    >
      <div className="mb-6 text-start text-base font-semibold">{description}</div>
    </Modal>
  );
};

export default ConfirmDeleteModal;
