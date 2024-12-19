import React, { useState } from "react";
import { jwtDecode } from "jwt-decode";
// Install via npm: npm install jwt-decode

const CreateBlog = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content || !tags) {
      setError("All fields are required");
      return;
    }

    try {
      const token = localStorage.getItem("token"); // Retrieve token from localStorage
      if (!token) {
        setError("User is not authenticated");
        return;
      }

      const decodedToken = jwtDecode(token); // Decode token to get user ID
      const authorId = decodedToken?.id; // Replace `userId` with the field name in your token payload

      if (!authorId) {
        setError("Author ID not found");
        return;
      }

      const response = await fetch("http://localhost:3001/api/blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add Bearer Token
        },
        body: JSON.stringify({
          title,
          content,
          author: authorId, // Pass the decoded author ID
          tags: tags.split(",").map((tag) => tag.trim()),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setError("");
        setTitle("");
        setContent("");
        setTags("");
      } else {
        setError(data.message || "Failed to create blog");
      }
    } catch (err) {
      setError("An error occurred");
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create a New Blog</h1>

      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">Blog created successfully!</p>}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
        >
          Create Blog
        </button>
      </form>
    </div>
  );
};

export default CreateBlog;
