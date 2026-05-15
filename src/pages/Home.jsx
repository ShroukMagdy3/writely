import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import PostCard from "../components/PostCard";
import { getAllPosts } from "../services/api";

export default function Home() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await getAllPosts();
        setPosts([...data].reverse());
      } catch {
        toast.error("please try again later");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleDelete = (id) => {
    setPosts(posts.filter((p) => p._id !== id));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg text-cyan-400"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-2">
      <div className="max-w-2xl mx-auto px-4">
        {user && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 mb-6 shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-cyan-400 flex items-center justify-center text-black font-bold text-sm shrink-0">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <button
                onClick={() => navigate("/add-post")}
                className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-500 text-sm text-left px-4 py-3 rounded-full transition-colors border border-zinc-700"
              >
                What's on your mind, {user.name}?
              </button>
            </div>

            <div className="border-t border-zinc-800 my-3"></div>

            <button
              onClick={() => navigate("/add-post")}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl hover:bg-zinc-800 transition-colors text-zinc-400 text-sm font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-cyan-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" />
              </svg>
              Write a Post
            </button>
          </div>
        )}
        {posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 gap-3">
            <span className="text-6xl"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8 text-red-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H6.911a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661Z" />
            </svg>
            </span>
            <p className="text-zinc-500 text-sm">No posts yet. Be the first!</p>
            {user && (
              <button
                onClick={() => navigate("/add-post")}
                className="px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black text-sm transition-colors"
              >
                Create Post
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
