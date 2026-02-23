import { z } from "zod";
import { SendPostDTO } from "../services/postService";
import React from "react";
import Dialog from "./Dialog";


interface AddPostDialogProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (data: SendPostDTO, image: File | null) => void;
}

const AddPostDialog: React.FC<AddPostDialogProps> = ({
  show,
  onClose,
  onSubmit,
}) => {
  const postSchema = z.object({
    title: z.string().min(1),
    content: z.string().min(1),
    img: z.instanceof(File).nullable(),
  });
  
  const initialValues = { title: "", content: "", img: null as File | null };

  const initialPreview = "./images/upload_image_sample.png";

  const fields: { name: "title" | "content" | "img"; label: string; type: "text" | "textarea" | "file" }[] = [
    { name: "img", label: "תמונה", type: "file" },
    { name: "title", label: "כותרת", type: "text" },
    { name: "content", label: "ערך", type: "textarea" },
  ];

  const handleSubmit = (data: typeof initialValues) => {
    onSubmit({ title: data.title, content: data.content }, data.img);
  };

  return (
    <Dialog
        title="הוספת פוסט חדש"
        show={show}
        onClose={onClose}
        onSubmit={handleSubmit}
        schema={postSchema}
        initialValues={initialValues}
        fields={fields}
        initialPreview={initialPreview}
    />
  )
};

export default AddPostDialog;
