import { z } from "zod";
import Dialog from "./Dialog";
import { useEffect, useState } from "react";
import { isTokenValid, register } from "../services/authService";
import { useNavigate } from "react-router-dom";

const Register: React.FC = () => {
  const [show, setShow] = useState(true);
  const nevigate = useNavigate();

  const onClose = () => setShow(false);

  useEffect(() => {
    const checkAuthToken = async () => {
      const token = localStorage.getItem("accessToken");
      if (token && (await isTokenValid())) {
        nevigate("/");
      }
    };

    checkAuthToken();

  }, []);
  const initialValues = {
    email: "",
    password: "",
    username: "",
    is_doctor: false,
    img: null as File | null,
  };

  const onSubmit = async (data: typeof initialValues) => {
    if (
      await register({
        email: data.email,
        password: data.password,
        username: data.username,
        isDoctor: data.is_doctor,
      },
        data.img
      )
    ) {
      nevigate("/");
    } else {
      alert("התחברות נכשלה");
      setShow(true);
    }
  };

  const initialPreview = "./images/upload_image_sample.png";

  const fields: {
    name: "email" | "password" | "img" | "username" | "is_doctor";
    label: string;
    type: "text" | "password" | "file" | "checkbox";
  }[] = [
      { name: "img", label: "תמונת פרופיל", type: "file" },
      { name: "email", label: "אימייל", type: "text" },
      { name: "username", label: "שם משתמש", type: "text" },
      { name: "password", label: "סיסמא", type: "password" },
      { name: "is_doctor", label: "רופא", type: "checkbox" },
    ];

  const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
    img: z.instanceof(File).nullable(),
    username: z.string().min(1),
    is_doctor: z.boolean(),
  });
  return (
    <Dialog
      title="הרשמה"
      show={show}
      onClose={onClose}
      onSubmit={onSubmit}
      schema={registerSchema}
      initialValues={initialValues}
      initialPreview={initialPreview}
      fields={fields}
    />
  );
};

export default Register;
