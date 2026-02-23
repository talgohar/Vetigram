import React from "react";

interface LogoutConfirmationDialogProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutConfirmationDialog: React.FC<LogoutConfirmationDialogProps> = ({
  show,
  onClose,
  onConfirm,
}) => {
  if (!show) return null;

  return (
    <>
      <div className="modal-backdrop fade show"></div>
      <div
        className={`modal ${show ? "show d-block" : "d-none"}`}
        tabIndex={-1}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              ></button>
            </div>
            <div className="modal-body">
              <p>האם אתה בטוח שתרצה להתנתק</p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                ביטול
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={onConfirm}
              >
                התנתקות
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LogoutConfirmationDialog;
