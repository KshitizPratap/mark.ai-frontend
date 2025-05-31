import { PlatformType } from "@/types";
import React from "react";

// Import PNG files directly
import blueskyPng from "@/assets/icons/social/png/bluesky.png";
import facebookPng from "@/assets/icons/social/png/facebook.png";
import instagramPng from "@/assets/icons/social/png/instagram.png";
import linkedinPng from "@/assets/icons/social/png/linkedin.png";
import pinterestPng from "@/assets/icons/social/png/pinterest.png";
import redditPng from "@/assets/icons/social/png/reddit.png";
import telegramPng from "@/assets/icons/social/png/telegram.png";
import threadsPng from "@/assets/icons/social/png/threads.png";
import tiktokPng from "@/assets/icons/social/png/tiktok.png";
import twitterPng from "@/assets/icons/social/png/twitter.png";
import youtubePng from "@/assets/icons/social/png/youtube.png";

interface ConnectSocialIconProps {
  isConnected: boolean;
  platform: PlatformType;
  handleAyrshareConnection: (platform: PlatformType) => void;
  isLoading?: boolean;
}

const ConnectSocialIcon: React.FC<ConnectSocialIconProps> = ({
  isConnected,
  platform,
  handleAyrshareConnection,
  isLoading = false,
}) => {
  // Map platform to PNG file
  const getPlatformImage = (platform: PlatformType): string => {
    const platformImages: Record<PlatformType, string> = {
      bluesky: blueskyPng,
      facebook: facebookPng,
      gmb: facebookPng, // fallback to facebook for gmb since no PNG available
      instagram: instagramPng,
      linkedin: linkedinPng,
      pinterest: pinterestPng,
      reddit: redditPng,
      telegram: telegramPng,
      threads: threadsPng,
      tiktok: tiktokPng,
      twitter: twitterPng,
      youtube: youtubePng,
    };
    
    return platformImages[platform] || facebookPng; // fallback to facebook if platform not found
  };

  return (
    <div
      className="relative h-full flex items-center justify-center cursor-pointer p-[2px] rounded-full border border-gray-700"
      onClick={() => !isLoading && handleAyrshareConnection(platform)}
    >
      <img
        src={getPlatformImage(platform)}
        alt={`${platform} icon`}
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
