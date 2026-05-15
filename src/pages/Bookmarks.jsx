import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import PostCard from "../components/PostCard";

export default function Bookmarks() {
  const navigate = useNavigate();

  const [bookmarks, setBookmarks] = useState(
    JSON.parse(localStorage.getItem("bookmarks") || "[]")
  );

  const handleDelete = (id) => {
    const updated = bookmarks.filter((p) => p._id !== id);

    setBookmarks(updated);
    localStorage.setItem("bookmarks", JSON.stringify(updated));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-base-content mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-cyan-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
        </svg>

        Bookmarks

        <span className="text-base-content/40 text-sm font-normal ml-2">
          {bookmarks.length} saved
        </span>
      </h1>

      {bookmarks.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 gap-3">
          <span className="text-6xl">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-red-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
            </svg>
          </span>
          <p className="text-base-content/50">No bookmarks yet.</p>
          <button
            onClick={() => navigate("/")}
            className="btn btn-sm bg-cyan-500 hover:bg-cyan-600 text-white border-0 rounded-xl"
          >
            Browse Posts
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {bookmarks.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onDelete={handleDelete}
              onBookmarkRemoved={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
