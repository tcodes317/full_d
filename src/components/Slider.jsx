import { useState } from "react";
import { Home, Settings, User, Menu } from "lucide-react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`h-screen bg-gray-900 text-white transition-all duration-300 ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        <div className="flex items-center justify-between p-4">
          <h1 className={`text-xl font-bold ${collapsed ? "hidden" : "block"}`}>Website Name</h1>
          <button onClick={() => setCollapsed(!collapsed)} className="text-white">
            <Menu size={24} />
          </button>
        </div>

        <nav className="mt-10">
          <ul>
            <li className="p-4 hover:bg-gray-700 flex cursor-pointer items-center">
              <Home size={24} />
              {!collapsed && <Link to="/" className="ml-4">Home</Link>}
            </li>
            <li className="p-4 hover:bg-gray-700 cursor-pointer flex items-center">
              <User size={24} />
              {!collapsed && <Link to="/profile" className="ml-4">Profile</Link>}
            </li>
            <li className="p-4 hover:bg-gray-700 cursor-pointer flex items-center">
              <Settings size={24} />
              {!collapsed && <Link to="/settings" className="ml-4">Settings</Link>}
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10">
        <h2 className="text-2xl">Main Content</h2>
      </div>
    </div>
  );
};

export default Sidebar;
