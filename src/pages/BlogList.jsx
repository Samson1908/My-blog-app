import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);

  // Fetch blogs from the API
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/blogs");
        const data = await response.json();

        if (data.success) {
          setBlogs(data.data || []);
        } else {
          console.error("Failed to fetch blogs");
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Blogs</h1>
      <Link
        to="/create"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Create New Blog
      </Link>
      {blogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <h2 className="text-lg font-bold">{blog.title}</h2>
              <p className="text-sm text-gray-600">
                By:{" "}
                <Link
                  to={`/users/${blog.author._id}`} // Link to the user's profile
                  className="text-blue-500 hover:underline"
                >
                  {blog.author.name}
                </Link>
              </p>
              <p className="mt-2 text-gray-700">
                {blog.content.substring(0, 100)}...
              </p>

              <div className="mt-4">
                <p className="text-sm text-gray-500">
                  Tags:{" "}
                  {blog.tags.length > 0
                    ? blog.tags.join(", ")
                    : "No tags available"}
                </p>
                <p className="text-sm text-gray-500">
                  Created At: {new Date(blog.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="flex justify-between mt-4">
                <Link
                  to={`/blogs/${blog._id}`}
                  className="text-blue-500 hover:underline"
                >
                  Read More
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-700">No blogs available</p>
      )}
    </div>
  );
};

export default BlogList;
