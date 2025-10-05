import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoNotifications } from "react-icons/io5";
import { AiFillDashboard, AiFillProduct } from "react-icons/ai";
import { MdEmail, MdGroup, MdPermMedia } from "react-icons/md";
import { FaDelicious } from "react-icons/fa6";
import { SiGoogleanalytics, SiMarketo } from "react-icons/si";
import { IoMdSettings } from "react-icons/io";
import Cookies from "js-cookie";

function Layout({ children }) {
  const navigate = useNavigate();
  const user = JSON.parse(Cookies.get("user")) || {name:"User",email:"No email"};

  

  const name = user?.name || "User";
  const email = user?.email || "No email";

  const menuList = [
    { name: "Dashboard", link: "/", icon: <AiFillDashboard className="w-6 h-6" /> },
    { name: "Emails", link: "/emails", icon: <MdEmail className="w-6 h-6" /> },
    { name: "Products", link: "/products", icon: <AiFillProduct className="w-6 h-6" /> },
    { name: "Orders", link: "/orders", icon: <FaDelicious className="w-6 h-6" /> },
    { name: "Customers", link: "/customers", icon: <MdGroup className="w-6 h-6" /> },
    { name: "Analytics", link: "/analytics", icon: <SiGoogleanalytics className="w-6 h-6" /> },
    { name: "Marketing", link: "/marketing", icon: <SiMarketo className="w-6 h-6" /> },
    { name: "Media", link: "/medias", icon: <MdPermMedia className="w-6 h-6" /> },
    { name: "Settings", link: "/settings", icon: <IoMdSettings className="w-6 h-6" /> },
  ];

  const location = useLocation();
  const [openProfile, setOpenProfile] = useState(false);

  // ✅ Logout Handler
  const handleLogout = () => {
    Cookies.remove("user");
    sessionStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <main className="w-full h-screen flex bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-[20%] h-full flex flex-col border-r-2 border-gray-700">
        <h1 className="text-3xl flex items-center justify-center h-[10%] border-b-2 border-gray-700 text-gray-300 uppercase font-bold">
          Kra<span className="text-blue-400">viona</span>
        </h1>

        <nav className="flex-1 overflow-y-auto">
          {menuList.map((menu, index) => {
            const isActive = location.pathname === menu.link;
            return (
              <Link key={index} to={menu.link}>
                <div
                  className={`py-3 px-6 flex items-center gap-3 uppercase font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-orange-600 text-white"
                      : "hover:bg-sky-500 text-gray-300"
                  }`}
                >
                  {menu.icon}
                  {menu.name}
                </div>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Section */}
      <section className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-[10%] border-b-2 border-gray-700 flex items-center justify-between px-5 bg-gray-800">
          <h1 className="text-2xl font-semibold text-gray-200">
            Welcome, <span className="text-orange-500">{user.fullname||"Unknown"}</span>
          </h1>

          <div className="flex items-center gap-5">
            <IoNotifications className="text-2xl text-gray-300 hover:text-white cursor-pointer" />

            <div className="relative">
              <button
                onClick={() => setOpenProfile(!openProfile)}
                className="hover:scale-110 transition-all duration-200"
              >
                <img
                  src="https://www.pngall.com/wp-content/uploads/5/Profile-PNG-File.png"
                  alt="profile"
                  className="w-10 h-10 rounded-full object-cover cursor-pointer"
                />
              </button>

              {/* Dropdown */}
              {openProfile && (
                <div className="absolute top-14 right-0 bg-gray-800 border border-gray-600 rounded-md shadow-lg py-3 px-4 flex flex-col gap-2 w-52">
                  <h2 className="font-semibold text-gray-300">{user.fullname || "Unknown"}</h2>
                  <p className="text-sm text-gray-400 break-all">{user.email || "No email"}</p>
                  <button
                    onClick={handleLogout}
                    className="font-semibold text-white bg-rose-600 hover:bg-rose-700 py-1 rounded-md mt-2 transition-all"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
      </section>
    </main>
  );
}

export default Layout;
