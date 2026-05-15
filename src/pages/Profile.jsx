import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import PostCard from "../components/PostCard";
import { getProfile } from "../services/api";

export default function Profile() {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const displayName = userData?.name || userData?.userName || currentUser?.name || "User";
  const displayEmail = userData?.email || currentUser?.email || "No email available";
  const joinedDate = userData?.createdAt
    ? new Date(userData.createdAt).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
    : "Not available";
  const publicPosts = posts.filter((post) => post.isPublic).length;
  const privatePosts = posts.length - publicPosts;

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      toast.error("Failed to load profile");
      return;
    }

    const fetchProfile = async () => {
      try {
        const { data } = await getProfile();
        setUserData(data.user);
        setPosts(data.posts);
      } catch (error) {
        toast.error("Failed to load profile");
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleDelete = (id) => {
    setPosts(posts.filter((p) => p._id !== id));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex justify-center items-center">
        <span className="loading loading-spinner loading-lg text-cyan-400"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-2">
      <div className="max-w-2xl mx-auto px-4">

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">

            <div className="w-20 h-20 rounded-full bg-cyan-400 flex items-center justify-center text-black font-bold text-3xl shrink-0 ring-4 ring-cyan-400/10">
              {displayName.charAt(0).toUpperCase()}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-xs uppercase tracking-wider text-cyan-400 font-semibold mb-1">
                Profile
              </p>

              <h2 className="text-white font-bold text-2xl truncate">
                {displayName}
              </h2>

              <p className="text-zinc-400 text-sm truncate mt-1">
                {displayEmail}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
            <div className="rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3">
              <p className="text-zinc-500 text-xs mb-1">Joined</p>
              <p className="text-white text-sm font-semibold">
                {joinedDate}
              </p>
            </div>

            <div className="rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3">
              <p className="text-zinc-500 text-xs mb-1">Posts</p>
              <p className="text-white text-sm font-semibold">
                {posts.length} total
              </p>
            </div>

            <div className="rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3">
              <p className="text-zinc-500 text-xs mb-1">Visibility</p>
              <p className="text-white text-sm font-semibold">
                {publicPosts} public / {privatePosts} private
              </p>
            </div>
          </div>

        </div>

        <h3 className="text-white font-bold text-lg mb-4">
          My Posts
        </h3>

        {posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 gap-3">

            <span className="text-5xl">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8 text-red-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H6.911a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661Z" />
              </svg>
            </span>

            <p className="text-zinc-500 text-sm">
              No posts yet.
            </p>

            <button
              onClick={() => navigate("/add-post")}
              className="px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black text-sm"
            >
              Write your first post
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">

            {posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                onDelete={handleDelete}
                isOwner
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
