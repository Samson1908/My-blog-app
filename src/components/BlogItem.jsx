import React from "react";

const BlogItem = ({ title, body }) => {
  return (
    <div className="p-4 border rounded shadow-md bg-gray-50">
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="text-gray-700">{body}</p>
    </div>
  );
};

export default BlogItem;
