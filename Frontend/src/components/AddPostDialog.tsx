import { z } from "zod";
import { SendPostDTO } from "../services/postService";
import React, { useState } from "react";
import aiService from "../services/aiService";

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
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("./images/upload_image_sample.png");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGetSuggestions = async () => {
    if (!image) {
      alert("Please select an image first");
      return;
    }

    setIsLoadingSuggestions(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const base64String = (e.target?.result as string).split(",")[1];
        const mimeType = image.type || "image/jpeg";

        const suggestions = await aiService.suggestPostContent(base64String, mimeType);
        setTitle(suggestions.title);
        setContent(suggestions.content);
      } catch (error) {
        console.error("Error getting suggestions:", error);
        alert("Failed to get AI suggestions. Please try again.");
      } finally {
        setIsLoadingSuggestions(false);
      }
    };
    reader.readAsDataURL(image);
  };

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) {
      alert("Please fill in title and content");
      return;
    }
    onSubmit({ title, content }, image);
    // Reset form
    setTitle("");
    setContent("");
    setImage(null);
    setPreview("./images/upload_image_sample.png");
  };

  const handleClose = () => {
    // Reset form
    setTitle("");
    setContent("");
    setImage(null);
    setPreview("./images/upload_image_sample.png");
    onClose();
  };

  if (!show) return null;

  return (
    <>
      <div className="modal-backdrop fade show"></div>
      <div className="modal show d-block" tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header d-flex justify-content-between align-items-center">
              <div>
                <div className="app-brand">🐾 Vetigram</div>
                <div className="app-subtitle">הוספת פוסט חדש</div>
              </div>
              <button type="button" className="btn-close" onClick={handleClose}></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">תמונה</label>
                <div style={{ display: "flex", justifyContent: "center", position: "relative" }}>
                  <img
                    src={preview}
                    onClick={() => document.getElementById("image-input")?.click()}
                    style={{ width: "200px", height: "200px", cursor: "pointer" }}
                  />
                </div>
                <input
                  id="image-input"
                  type="file"
                  className="form-control"
                  onChange={handleImageChange}
                  accept="image/jpeg, image/png"
                  style={{ display: "none" }}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">כותרת</label>
                <input
                  type="text"
                  className="form-control"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">ערך</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                ></textarea>
              </div>

              <button
                type="button"
                className="btn btn-outline-primary btn-sm w-100"
                onClick={handleGetSuggestions}
                disabled={isLoadingSuggestions || !image}
              >
                {isLoadingSuggestions ? "🤖 Getting suggestions..." : "🤖 Get AI Suggestions"}
              </button>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={handleClose}>
                ביטול
              </button>
              <button type="button" className="btn btn-primary" onClick={handleSubmit}>
                שליחה
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddPostDialog;
