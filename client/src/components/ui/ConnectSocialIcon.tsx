import React from "react";

interface ConnectSocialIconProps {
  image: string;
  isConnected: boolean;
  label: string;
  handleAyrshareConnection: (label: string) => void;
  isLoading?: boolean;
}

const ConnectSocialIcon: React.FC<ConnectSocialIconProps> = ({
  image,
  isConnected,
  label,
  handleAyrshareConnection,
  isLoading = false,
}) => {
  return (
    <div
      className="relative h-full flex items-center justify-center cursor-pointer p-[2px] rounded-full border border-gray-700"
      onClick={() => !isLoading && handleAyrshareConnection(label)}
    >
      <img
        src={image}
        alt="Social Icon"
        className={`h-full w-full rounded-full object-cover ${
          !isConnected ? "grayscale" : ""
        } ${isLoading ? "opacity-50" : ""}`}
      />
      {!isConnected && !isLoading && (
        <span className="absolute bottom-[-2px] right-[-6px] w-6 h-6 text-lg bg-gray-700 rounded-full flex items-center justify-center border border-white pb-[2px] pl-[0.5px]">
          <span>+</span>
        </span>
      )}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default ConnectSocialIcon;
