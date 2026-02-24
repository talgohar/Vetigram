import React, { useEffect } from "react";
import "./LogoutConfirmationDialog.css";

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
  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [show]);

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
            <div className="modal-header logout-modal-header">
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              ></button>
            </div>
            <div className="modal-body logout-modal-body">
              <p>האם אתה בטוח שתרצה להתנתק</p>
            </div>
            <div className="modal-footer logout-modal-footer">
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
