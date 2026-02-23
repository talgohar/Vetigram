import "./App.css";
import Post from "./components/Post";
import usePosts from "./hooks/usePosts";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { Tooltip } from "bootstrap";
import { useEffect, useRef, useState } from "react";
import AddPostDialog from "./components/AddPostDialog";
import { isTokenValid } from "./services/authService";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import ImageDropdown from "./components/ImageDropdown";

const App: React.FC = () => {
  const { posts, loading, error, addPost } = usePosts();
  const tooltipRef = useRef<HTMLButtonElement>(null);
  const [userId, setUserId] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [renderOnLogout, setRenderOnLogout] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const tooltip = new Tooltip(tooltipRef.current!, {
      title: "Add New Post",
      placement: "top",
      trigger: "hover",
    });

    return () => {
      tooltip.dispose();
    };
  });

  useEffect(() => {
    const checkAuthToken = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token || !(await isTokenValid())) {
        navigate("/login");
      } else {
        const decodedToken: { _id: string; random: string } = jwtDecode(token);
        setUserId(decodedToken._id);
      }
    };
    checkAuthToken();
  }, [renderOnLogout] );

  useEffect(() => {
    if (showModal) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
  }, [showModal]);

  return (
    <div className="home-page">
      <div className="home-header">
      <div className="home-logo">🐾</div>
      <h1 className="home-title">Vetigram</h1>
    </div>
    <div className="home-content">
    <div className="container">
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {posts.map((postItem) => (
        <Post
          key={postItem._id}
          userId={userId}
          owner={postItem.owner}
          postId={postItem._id}
          caption={postItem.content}
          imageName={postItem.imageName}
        />
      ))}
      <button
        className="btn btn-light rounded-circle shadow-lg border border-dark position-fixed add-post-btn"
        ref={tooltipRef}
        data-bs-toggle="tooltip"
        data-bs-placement="top"
        data-bs-custom-class="custom-tooltip"
        data-bs-title="Add New Post"
        onClick={() => setShowModal(true)}
      >
      +
      </button>
      <AddPostDialog
        show={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={addPost}
      />
      <ImageDropdown
      userId={userId}
      setRenderOnLogout={setRenderOnLogout}/>
    </div>
    </div>
    </div>
  );
};

export default App;