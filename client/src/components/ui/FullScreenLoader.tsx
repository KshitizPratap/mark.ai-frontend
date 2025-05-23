import React from "react";

interface FullScreenLoaderProps {
  message?: string;
}

const FullScreenLoader: React.FC<FullScreenLoaderProps> = ({
  message = "Loading...",
}) => {
  return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-[#11132f] p-6 rounded-lg shadow-xl flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white text-sm">{message}</p>
        </div>
      </div>
  );
};

export default FullScreenLoader;
