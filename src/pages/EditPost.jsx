import { useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { updatePost } from "../services/api";

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [formData, setFormData] = useState({
    title: state?.post.title || "",
    description: state?.post.description || "",
    imageUrl: state?.post.imageUrl || "",
    isPublic: state?.post.isPublic ?? true,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title || formData.title.trim().length < 3)
      newErrors.title = "Title must be at least 3 characters";
    if (!formData.description || formData.description.trim().length < 10)
      newErrors.description = "Description must be at least 10 characters";
    if (!formData.imageUrl || !/^https?:\/\/.+/.test(formData.imageUrl))
      newErrors.imageUrl = "Enter a valid image URL";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    try {
      await updatePost(id, formData);
      toast.success("Post updated!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
  <div className="w-full max-w-xl bg-zinc-900 shadow-2xl rounded-3xl p-8 border border-zinc-800">

    <div className="flex flex-col items-center mb-8">
      <h1
        style={{ fontFamily: "Pacifico, cursive" }}
        className="text-4xl text-cyan-400 mb-2"
      >
        Writely
      </h1>

      <h2 className="text-2xl font-bold text-white mt-1">
        Edit Your Post
      </h2>

      <p className="text-zinc-500 text-sm mt-1">
        Update your thoughts and keep your story fresh.
      </p>
    </div>

    <form onSubmit={handleSubmit} className="flex flex-col gap-4">

      <div>
        <label className="text-sm text-zinc-400 mb-1 block">
          Title
        </label>

        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={`w-full px-4 py-3 rounded-xl bg-zinc-800 text-white placeholder-zinc-600 border outline-none focus:border-cyan-400 transition-colors ${
            errors.title ? "border-red-500" : "border-zinc-700"
          }`}
        />

        {errors.title && (
          <p className="text-red-400 text-xs mt-1">
            {errors.title}
          </p>
        )}
      </div>

      <div>
        <label className="text-sm text-zinc-400 mb-1 block">
          Description
        </label>

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className={`w-full px-4 py-3 rounded-xl bg-zinc-800 text-white placeholder-zinc-600 border outline-none focus:border-cyan-400 transition-colors resize-none ${
            errors.description ? "border-red-500" : "border-zinc-700"
          }`}
        />

        {errors.description && (
          <p className="text-red-400 text-xs mt-1">
            {errors.description}
          </p>
        )}
      </div>

      <div>
        <label className="text-sm text-zinc-400 mb-1 block">
          Image URL
        </label>

        <input
          type="text"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          className={`w-full px-4 py-3 rounded-xl bg-zinc-800 text-white placeholder-zinc-600 border outline-none focus:border-cyan-400 transition-colors ${
            errors.imageUrl ? "border-red-500" : "border-zinc-700"
          }`}
        />

        {errors.imageUrl && (
          <p className="text-red-400 text-xs mt-1">
            {errors.imageUrl}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between bg-zinc-800 px-4 py-3 rounded-xl border border-zinc-700">
        <span className="text-sm text-zinc-300">
          {formData.isPublic ? "Public Post" : "Private Post"}
        </span>

        <input
          type="checkbox"
          name="isPublic"
          checked={formData.isPublic}
          onChange={handleChange}
          className="toggle toggle-info"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-bold transition-colors mt-2"
      >
        {loading ? (
          <span className="loading loading-spinner loading-sm"></span>
        ) : (
          "Update Post"
        )}
      </button>
    </form>
  </div>
</div>
  );
}