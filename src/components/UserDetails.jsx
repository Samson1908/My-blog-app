import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const UserDetails = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({}); // To store form data

  // Fetch user details
  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem("token");
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
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Unauthorized. Please log in again.");
          } else {
            throw new Error("Failed to fetch user details");
          }
        }

        const data = await response.json();
        if (data.success) {
          setUser(data.data);
          setUpdatedUser(data.data); // Initialize the updatedUser state
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

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser({ ...updatedUser, [name]: value });
  };

  // Handle Save
  const handleSave = async () => {
    const confirmSave = window.confirm("Are you sure you want to save changes?");
    if (!confirmSave) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setError("No authentication token found. Please log in.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedUser),
      });

      if (!response.ok) {
        throw new Error("Failed to update user details");
      }

      const data = await response.json();
      if (data.success) {
        setUser(data.data); // Update user state with new data
        alert("User details updated successfully!");
        setEditMode(false); // Exit edit mode
      }
    } catch (err) {
      console.error("Error updating user details:", err);
      alert(err.message || "Error updating user details");
    }
  };

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
          <h1 className="text-2xl font-bold mb-4">{editMode ? "Edit User" : `${user.name}'s Profile`}</h1>

          {/* Display Edit Mode */}
          {editMode ? (
            <div className="bg-gray-100 p-6 rounded shadow">
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Name:</label>
                <input
                  type="text"
                  name="name"
                  value={updatedUser.name || ""}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Email:</label>
                <input
                  type="email"
                  name="email"
                  value={updatedUser.email || ""}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Age:</label>
                <input
                  type="number"
                  name="age"
                  value={updatedUser.age || ""}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleSave}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            // Display View Mode
            <>
              <p className="text-lg mb-4">Email: {user.email}</p>
              <p className="text-sm text-gray-600">Age: {user.age}</p>

              <div className="mt-6 flex gap-4">
                <button
                  onClick={() => setEditMode(true)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
                    if (confirmDelete) {
                      // Add delete logic here (already implemented previously)
                    }
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </>
      ) : (
        <p className="text-gray-700">No user details available</p>
      )}
    </div>
  );
};

export default UserDetails;
