import React, { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";

const Header = () => {
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Optionally, fetch the user data (e.g., email) from your backend
      const fetchUserProfile = async () => {
        try {
          const response = await fetch("http://localhost:3001/api/profile", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Pass the token to fetch user data
            },
          });
          if (!response.ok) {
            throw new Error("Failed to fetch user profile");
          }
          const data = await response.json();
          setUserEmail(data.email); // Set the user's email
        } catch (err) {
          console.error("Error fetching user profile:", err);
        }
      };

      fetchUserProfile();
    }
  }, []);

  return (
    <header className="bg-gray-300 text-black shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-sans italic ">Sam's Website</h1>

        <div className="flex items-center space-x-2">
          <FaUserCircle size={24} />
          {/* Display the user's email or fallback to 'Guest' */}
          {userEmail ? (
            <div className="text-sm">
              <span>{userEmail}</span>
            </div>
          ) : (
            <span className="text-lg">Guest</span>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
