import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const BlogDetails = () => {
  const { id } = useParams(); // Extract the blog ID from the URL
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch a single blog by ID
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/blogs/${id}`);
        const data = await response.json();

        if (data.success) {
          setBlog(data.data);
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

  if (loading) return <p className="text-gray-600">Loading...</p>;

  if (!blog) return <p className="text-red-600">Blog not found</p>;

  return (
    <div className="container mx-auto p-6">
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

      <Link
        to="/blogs"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Back to Blogs
      </Link>
    </div>
  );
};

export default BlogDetails;
