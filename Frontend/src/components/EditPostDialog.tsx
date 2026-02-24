import React from "react";
import { z } from "zod";
import Dialog from "./Dialog";

interface EditPostDialogProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; content: string; img: File | null }) => void;
  initialValues: {
    title: string;
    content: string;
    img: File | null;
  };
  initialPreview: string;
}

const EditPostDialog: React.FC<EditPostDialogProps> = ({
  show,
  onClose,
  onSubmit,
  initialValues,
  initialPreview,
}) => {
  const postSchema = z.object({
    title: z.string().min(1, "Title is required"),
    content: z.string().min(1, "Content is required"),
    img: z.instanceof(File).nullable(),
  });

  const fields: { name: "title" | "content" | "img"; label: string; type: "text" | "textarea" | "file" }[] = [
    { name: "img", label: "תמונה (אופציונלי)", type: "file" },
    { name: "title", label: "כותרת", type: "text" },
    { name: "content", label: "תוכן", type: "textarea" },
  ];

  const handleSubmit = (data: typeof initialValues) => {
    onSubmit(data);
  };

  return (
    <Dialog
      title="עריכת פוסט"
      show={show}
      onClose={onClose}
      onSubmit={handleSubmit}
      schema={postSchema}
      initialValues={initialValues}
      fields={fields}
      initialPreview={initialPreview}
    />
  );
};

export default EditPostDialog;
