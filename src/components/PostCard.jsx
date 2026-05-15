import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { deletePost } from "../services/api";
import { useState } from "react";

export default function PostCard({ post, onDelete, onBookmarkRemoved, isOwner: isOwnerOverride = false }) {
  const navigate = useNavigate();
  const storedUser = localStorage.getItem("user");

  const user = storedUser
    ? JSON.parse(storedUser)
    : null;
  const authorId = post.author?._id || post.author?.id || post.author;
  const userId = user?._id || user?.id;
  const authorName = post.author?.name || post.author?.userName || user?.name || "User";
  const isOwner = isOwnerOverride || (userId && authorId?.toString() === userId.toString());

  const getBookmarks = () => JSON.parse(localStorage.getItem("bookmarks") || "[]");
  const [isBookmarked, setIsBookmarked] = useState(
    getBookmarks().some((b) => b._id === post._id)
  );
  const [imgError, setImgError] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleBookmark = (e) => {
    e.stopPropagation();
    const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
    if (isBookmarked) {
      const updated = bookmarks.filter((b) => b._id !== post._id);

      localStorage.setItem("bookmarks", JSON.stringify(updated));
      setIsBookmarked(false);
      if (onBookmarkRemoved) onBookmarkRemoved(post._id);
      toast.success("Bookmark removed!");
    } else {
      const updated = [...bookmarks, post];

      localStorage.setItem("bookmarks", JSON.stringify(updated));
      setIsBookmarked(true);

      toast.success("Bookmarked!");
    }
  };

  const handleShare = (e) => {
    e.stopPropagation();
    if (!post.isPublic) {
      toast.error("Can't share a private post!");
      return;
    }
    const url = `${window.location.origin}/post/${post._id}`;
    if (navigator.share) {
      navigator.share({ title: post.title, url });
    } else {
      navigator.clipboard.writeText(url);
      toast.success("Link copied!");
    }
  };

  const handleDelete = async () => {
    try {
      await deletePost(post._id);
      const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
      const updatedBookmarks = bookmarks.filter((b) => b._id !== post._id);

      localStorage.setItem("bookmarks", JSON.stringify(updatedBookmarks));
      setIsBookmarked(false);
      toast.success("Post deleted!");
      if (onDelete) onDelete(post._id);
      setShowDeleteModal(false);
    } catch {
      toast.error("Failed to delete post");
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    navigate(`/edit-post/${post._id}`, { state: { post } });
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 transition-all duration-300">
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-cyan-400 flex items-center justify-center text-black font-bold text-sm shrink-0">
            {authorName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-white text-sm">{authorName}</p>
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

        {isOwner && (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-800 cursor-pointer transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-zinc-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
              </svg>
            </div>
            <ul tabIndex={0} className="dropdown-content menu bg-zinc-900 border border-zinc-700 rounded-2xl z-10 w-40 p-2 shadow-xl">
              <li>
                <button onClick={handleEdit} className="text-cyan-400 text-sm flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Z" />
                  </svg>
                  Edit Post
                </button>
              </li>
              <li>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="text-red-500 text-sm flex items-center gap-2"
                ><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                  Delete Post
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>

      <div
        onClick={() => navigate(`/post/${post._id}`)}
        className="px-4 pb-3 cursor-pointer"
      >
        <h2 className="font-bold text-white text-base mb-1">{post.title}</h2>
        <p className="text-zinc-400 text-sm leading-relaxed line-clamp-3">
          {post.description}
        </p>
      </div>

      {post.imageUrl && !imgError && (
        <div onClick={() => navigate(`/post/${post._id}`)} className="cursor-pointer">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full object-cover max-h-96"
            onError={() => setImgError(true)}
          />
        </div>
      )}

      <div className="px-4 py-3 border-t border-zinc-800 flex items-center justify-between">
        <button
          onClick={() => navigate(`/post/${post._id}`)}
          className="flex items-center gap-1 text-cyan-400 text-sm font-medium hover:underline"
        >
          Read more
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" />
          </svg>
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={handleBookmark}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-800 transition-colors"
            title={isBookmarked ? "Remove bookmark" : "Bookmark"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill={isBookmarked ? "currentColor" : "none"}
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={`w-5 h-5 transition-colors ${isBookmarked ? "text-yellow-400" : "text-zinc-500"}`}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
            </svg>
          </button>

          <button
            onClick={handleShare}
            className={`w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-800 transition-colors ${!post.isPublic ? "opacity-30 cursor-not-allowed" : ""}`}
            title={!post.isPublic ? "Can't share private post" : "Share"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-zinc-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
            </svg>
          </button>
        </div>
      </div>
      {
        showDeleteModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

            <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 w-[90%] max-w-sm">

              <h2 className="text-white text-xl font-bold mb-2">
                Delete Post
              </h2>

              <p className="text-zinc-400 text-sm mb-6">
                Are you sure you want to delete this post?
              </p>

              <div className="flex gap-3">

                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white"
                >
                  Cancel
                </button>

                <button
                  onClick={handleDelete}
                  className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white"
                >
                  Delete
                </button>

              </div>
            </div>
          </div>
        )
      }
    </div>
  );
}
