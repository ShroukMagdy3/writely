import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Layout() {
  return (
    <div className="min-h-screen bg-black ">
      <Navbar />
      <main className="sm:max-w-6xl sm:mx-auto sm:px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
