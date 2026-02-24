import { useEffect, useState } from "react";
import Dialog from "./Dialog";
import { z } from "zod";
import { googleSignIn, isTokenValid, login } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";

const Login: React.FC = () => {
  const [show, setShow] = useState(true);
  const nevigate = useNavigate();

  useEffect(() => {
    const checkAuthToken = async () => {
      const token = localStorage.getItem("accessToken");
      if (token && (await isTokenValid())) {
        nevigate("/");
      }
    };

    checkAuthToken();
  }, []);

  const onClose = () => setShow(false);

  const loginSchema = z.object({
    identifier: z.string().min(1, "חובה להזין שם משתמש או אימייל"),
    password: z.string().min(1),
  });

  const initialValues = { identifier: "", password: "" };

  const handleSubmit = async (data: typeof initialValues) => {
    if (await login(data.identifier, data.password)) {
      nevigate("/");
    } else {
      alert("התחברות נכשלה");
      setShow(true);
    }
  };

  const fields: {
    name: "identifier" | "password";
    label: string;
    type: "text" | "password";
  }[] = [
      { name: "identifier", label: "שם משתמש / אימייל", type: "text" },
      { name: "password", label: "סיסמא", type: "password" },
    ];

  const googlErrorMessage = () => {
    alert("Google login failed");
  };

  const googleResponseMessage = async (response: CredentialResponse) => {
    const success = await googleSignIn(response);
    if (success) {
      nevigate("/");
    } else {
      alert("Google login failed");
      setShow(true);
    }
  };

  return (
    <div>
      <Dialog
        title="התחברות"
        show={show}
        onClose={onClose}
        onSubmit={handleSubmit}
        schema={loginSchema}
        initialValues={initialValues}
        fields={fields}
        hideCloseButton={true}
      >
        <button
          className="btn btn-outline-primary"
          onClick={() => nevigate("/register")}
        >
          פעם ראשונה?
        </button>
        <GoogleLogin onSuccess={googleResponseMessage} onError={googlErrorMessage} />
      </Dialog>
    </div>
  );
};
export default Login;
