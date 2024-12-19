import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const UserDetails = () => {
  const { userId } = useParams(); // Extract userId from URL
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem("token"); // Retrieve token from localStorage
      if (!token) {
        setError("No authentication token found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:3001/api/users/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Add token to the Authorization header
          },
        });

        if (!response.ok) {
          // Handle HTTP errors
          if (response.status === 401) {
            throw new Error("Unauthorized. Please log in again.");
          } else {
            throw new Error("Failed to fetch user details");
          }
        }

        const data = await response.json();
        if (data.success) {
          setUser(data.data); // Assuming API returns user data under "data.data"
        } else {
          setError("User not found");
        }
      } catch (err) {
        console.error("Error fetching user details:", err);
        setError(err.message || "Error fetching user details");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [userId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="container mx-auto p-6">
      {user ? (
        <>
          <h1 className="text-2xl font-bold mb-4">{user.name}'s Profile</h1>
          <p className="text-lg mb-4">Email: {user.email}</p>
          <p className="text-sm text-gray-600">Age: {user.age}</p>
        </>
      ) : (
        <p className="text-gray-700">No user details available</p>
      )}
    </div>
  );
};

export default UserDetails;
