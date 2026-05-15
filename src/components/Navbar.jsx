import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Navbar() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));
    const bookmarksCount = JSON.parse(localStorage.getItem("bookmarks") || "[]").length;

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        toast.success("Logged out successfully");
        navigate("/login");
    };

    return (
        <>
            <link href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap" rel="stylesheet" />
            <nav className="bg-zinc-900 border-b border-zinc-800 sticky top-0 z-50">
                <div className="container mx-auto px-4 py-3 flex items-center justify-between">

                    <Link to="/">
                        <span
                            style={{ fontFamily: "Pacifico, cursive" }}
                            className="text-2xl text-cyan-400"
                        >
                            Writely
                        </span>
                    </Link>

                    <div className="flex items-center gap-2">
                        {user ? (
                            <>
                                <Link
                                    to="/bookmarks"
                                    className="relative flex items-center justify-center w-9 h-9 rounded-full hover:bg-zinc-800 transition-colors"
                                    title="Bookmarks"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-zinc-400">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                                    </svg>

                                </Link>

                                <div className="w-px h-6 bg-zinc-700 mx-1"></div>

                                <div
                                    onClick={() => navigate("/profile")}
                                    className="w-9 h-9 rounded-full bg-cyan-400 flex items-center justify-center text-black font-bold text-sm shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                                >
                                    {user.name?.charAt(0).toUpperCase()}
                                    
                                </div>

                                <span onClick={() => navigate("/profile")}  className="cursor-pointer text-sm text-zinc-300 font-medium">
                                    Hi, {user.name}
                                </span>

                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-1 px-3 py-2 rounded-xl bg-zinc-800 hover:bg-red-500 text-zinc-400 hover:text-white text-sm transition-all"
                                    title="Logout"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                                    </svg>
                                </button>
                            </>
                        ) : (
                            <Link
                                to="/login"
                                className="px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-bold text-sm transition-colors"
                            >
                                Login / Register
                            </Link>
                        )}
                    </div>
                </div>
            </nav>
        </>
    );
}