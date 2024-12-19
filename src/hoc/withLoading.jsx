import React from "react";

const withLoading = (WrappedComponent) => {
  return function WithLoadingComponent({ isLoading, ...props }) {
    if (isLoading) {
      return <div className="text-center mt-10">Loading...</div>;
    }
    return <WrappedComponent {...props} />;
  };
};

export default withLoading;
