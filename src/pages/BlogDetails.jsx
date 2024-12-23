import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const BlogDetails = () => {
  const { id } = useParams(); // Extract the blog ID from the URL
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [updatedBlog, setUpdatedBlog] = useState({
    title: "",
    content: "",
    tags: "",
  });
  const [isOwner, setIsOwner] = useState(false); // To track if the logged-in user is the owner

  // Fetch a single blog by ID
  useEffect(() => {
    const fetchBlog = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found. User might not be logged in.");
        return;
      }

      try {
        const response = await fetch(`http://localhost:3001/api/blogs/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();

        if (data.success) {
          setBlog(data.data);
          setUpdatedBlog({
            title: data.data.title || "",
            content: data.data.content || "",
            tags: data.data.tags ? data.data.tags.join(", ") : "",
          });

          // Check if the logged-in user is the owner
          const userResponse = await fetch("http://localhost:3001/api/users/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const userData = await userResponse.json();

          if (userData.success && userData.data.email === data.data.author.email) {
            setIsOwner(true); // If the logged-in user is the owner of the blog
          }
        } else {
          console.error("Failed to fetch blog details");
        }
      } catch (error) {
        console.error("Error fetching blog details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const handleSave = async () => {
    const confirmSave = window.confirm("Are you sure you want to save changes?");
    if (!confirmSave) return;

    const token = localStorage.getItem("token"); // Get token from localStorage
    if (!token) {
      alert("You are not logged in. Please log in to perform this action.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/blogs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add the token in Authorization header
        },
        body: JSON.stringify({
          title: updatedBlog.title,
          content: updatedBlog.content,
          tags: updatedBlog.tags.split(",").map((tag) => tag.trim()), // Ensure tags are sent as an array
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update blog details");
      }

      const data = await response.json();
      if (data.success) {
        setBlog(data.data); // Update blog state with new data
        alert("Blog details updated successfully!");
        setEditMode(false); // Exit edit mode
      }
    } catch (error) {
      console.error("Error updating blog details:", error);
      alert(error.message || "Error updating blog details");
    }
  };

  if (loading) return <p className="text-gray-600">Loading...</p>;

  if (!blog) return <p className="text-red-600">Blog not found</p>;

  return (
    <div className="container mx-auto p-6">
      {!editMode ? (
        <>
          <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
          <p className="text-gray-600 mb-2">
            By: <strong>{blog.author.name}</strong> ({blog.author.email})
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Created At: {new Date(blog.createdAt).toLocaleString()}
          </p>
          <p className="text-lg text-gray-700 mb-4">{blog.content}</p>

          {blog.tags.length > 0 && (
            <p className="text-sm text-gray-500 mb-4">
              Tags: {blog.tags.join(", ")}
            </p>
          )}

          {/* Render Edit button only if the user is the owner */}
          {isOwner && (
            <button
              onClick={() => setEditMode(true)}
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 mr-2"
            >
              Edit
            </button>
          )}
        </>
      ) : (
        <>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Title</label>
            <input
              type="text"
              value={updatedBlog.title}
              onChange={(e) =>
                setUpdatedBlog({ ...updatedBlog, title: e.target.value })
              }
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Content</label>
            <textarea
              value={updatedBlog.content}
              onChange={(e) =>
                setUpdatedBlog({ ...updatedBlog, content: e.target.value })
              }
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Tags</label>
            <input
              type="text"
              value={updatedBlog.tags}
              onChange={(e) =>
                setUpdatedBlog({ ...updatedBlog, tags: e.target.value })
              }
              className="w-full p-2 border rounded"
            />
          </div>

          <button
            onClick={handleSave}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mr-2"
          >
            Save
          </button>
          <button
            onClick={() => setEditMode(false)}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </>
      )}
    </div>
  );
};

export default BlogDetails;
