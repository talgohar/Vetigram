import React from "react";
import Dialog from "./Dialog";
import { z } from "zod";

interface ProfileUpdateDialogProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialValues: {
    username: string;
    img: File | null;
  };
  initialPreview: string;
}

const ProfileUpdateDialog: React.FC<ProfileUpdateDialogProps> = ({
  show,
  onClose,
  onSubmit,
  initialValues,
  initialPreview,
}) => {
  const schema = z.object({
    username: z.string().min(1, "Username is required"),
    img: z.instanceof(File).nullable(),
  });

  return (
    <Dialog
      title="Update Profile"
      show={show}
      onClose={onClose}
      onSubmit={onSubmit}
      schema={schema}
      initialValues={initialValues}
      initialPreview={initialPreview}
      fields={[
        { name: "img", label: "תמונת פרופיל", type: "file" },
        { name: "username", label: "שם משתמש", type: "text" },
      ]}
    ></Dialog>
  );
};

export default ProfileUpdateDialog;
