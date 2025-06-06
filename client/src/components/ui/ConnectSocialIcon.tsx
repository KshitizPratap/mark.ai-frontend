import { PlatformType } from "@/types";
import React, { useState } from "react";
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
  isToggleOn: boolean;
  onToggle: (platform: PlatformType, isOn: boolean) => void;
  toggleColor?: string;
}

const ConnectSocialIcon: React.FC<ConnectSocialIconProps> = ({
  isConnected,
  platform,
  handleAyrshareConnection,
  isLoading = false,
  isToggleOn = true,
  onToggle,
  toggleColor,
}) => {
  const getPlatformImage = (platform: PlatformType): string => {
    const platformImages: Record<PlatformType, string> = {
      bluesky: blueskyPng,
      facebook: facebookPng,
      gmb: facebookPng,
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
   
    return platformImages[platform] || facebookPng;
  };

  const handleClick = () => {
    if (isLoading) return;

    if (isConnected) {
      onToggle?.(platform, !isToggleOn);
    } else {
      handleAyrshareConnection(platform);
    }
  };

  return (
    <div
      className={`relative h-full flex items-center justify-center cursor-pointer p-[2px] rounded-full border-2`}
      style={{ borderColor: isConnected && isToggleOn && toggleColor ? toggleColor : "#444" }}
      onClick={handleClick}
    >
      {isConnected && !isLoading && (
        <span
          className="absolute -top-[4px] -right-[4px] w-4 md:w-5 h-4 md:h-5 flex items-center justify-center rounded-full border bg-white z-10"
          style={{ borderColor: isToggleOn && toggleColor ? toggleColor : !isToggleOn ? '#9ca3af' : "#444" }}
        >
          <svg
            className="w-3 h-3"
            style={{ color: isToggleOn && toggleColor ? toggleColor : !isToggleOn ? '#9ca3af' : "#444" }}
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              stroke="currentColor"
              strokeWidth={2}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      )}
      <img
        src={getPlatformImage(platform)}
        alt={`${platform} icon`}
        className={`h-full w-full rounded-full object-cover opacity-90 ${
          !isConnected || !isToggleOn ? 'grayscale' : ''
        } ${isLoading ? 'opacity-50' : ''}`}
      />
      {!isConnected && !isLoading && (
        <span className="absolute bottom-[-2px] right-[-6px] w-4 h-4 md:w-6 md:h-6 text-xs md:text-lg bg-gray-700 rounded-full flex items-center justify-center border border-white pb-[1px] md:pb-[2px] pl-[0.25px] md:pl-[0.5px]">
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