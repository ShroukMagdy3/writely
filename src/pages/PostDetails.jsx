import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getPostById } from "../services/api";

export default function PostDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await getPostById(id);
        setPost(data);
      } catch {
        toast.error("Post not found");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg text-cyan-400"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-6">
      <div className="max-w-2xl mx-auto px-4">

        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-zinc-400 hover:text-cyan-400 transition-colors mb-4 text-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Back to Home
        </button>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">

          <div className="flex items-center gap-3 px-4 pt-4 pb-2">
            <div className="w-10 h-10 rounded-full bg-cyan-400 flex items-center justify-center text-black font-bold text-sm shrink-0">
              {post.author.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-white text-sm">{post.author.name}</p>
              <div className="flex items-center gap-1">
                <p className="text-xs text-zinc-500">
                  {new Date(post.createdAt).toLocaleDateString("en-US", {
                    month: "short", day: "numeric", year: "numeric"
                  })}
                </p>
                <span className="text-zinc-600 text-xs">•</span>
                <span className={`text-xs ${post.isPublic ? "text-cyan-400" : "text-yellow-500"}`}>
                  {post.isPublic ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
                </svg>
                  : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="size-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                  </svg>}
                </span>
              </div>
            </div>
          </div>

          <div className="px-4 pb-3">
            <h1 className="font-bold text-white text-xl mb-1">{post.title}</h1>
          </div>

          {post.imageUrl && !imgError && (
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full object-cover max-h-96"
              onError={() => setImgError(true)}
            />
          )}

          <div className="px-4 py-4">
            <p className="text-zinc-300 leading-relaxed text-sm whitespace-pre-wrap">
              {post.description}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}