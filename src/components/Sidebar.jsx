import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {

 
  return (
    <aside className="w-64 h-auto bg-gray-500 text-white   p-6 overflow-y-auto">
      <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
      <nav>
        <ul>
          <li className="mb-4">
            <Link to="/dashboard/users" className="hover:text-blue-300">
              Users
            </Link>
          </li>

          <li className="mb-4">
            <Link to="/blogs" className="hover:text-blue-300">
              Blogs
            </Link>
          </li>
          <li>
          </li>
        </ul>
      </nav>

     
      
    </aside>
  );
};

export default Sidebar;
