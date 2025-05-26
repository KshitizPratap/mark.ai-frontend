import React, { useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import markAiLogo from "../../assets/logo.png";
import { AYRSHARE } from "@/commons/constant";
import ConnectSocialIcon from "../ui/ConnectSocialIcon";
import { Link } from "wouter";
import { useAuthStore } from "@/store/useAuthStore";
import { generateAyrshareToken, getAyrshareSocialHandles } from "@/services/ayrShareServices";
import { PlatformType } from "@/types";

const headerBg = "bg-[#11132f]";
const headerBorder = "border-gray-700/50";

const Header = () => {
  const { logout, updatePlatformConnection, getEnabledPlatforms } = useAuthStore();
  const [loadingPlatform, setLoadingPlatform] = useState<string | null>(null);
  const enabledPlatforms = getEnabledPlatforms();

  useEffect(() => {
    handleAyrshareSocialHandles();
  }, []);

  const handleAyrshareSocialHandles = async () => {
     try{
      const socialMediaHandles = await getAyrshareSocialHandles();
      
      Object.entries(socialMediaHandles).forEach(([platform, isConnected]) => {
        updatePlatformConnection(platform, isConnected as boolean);
      });
      
     } catch(error){
      console.error(error)
     }
  }

  const handleAyrshareConnection = async (platform: PlatformType) => {
    try {
        setLoadingPlatform(platform);
        const response = await generateAyrshareToken([platform] as PlatformType[]);
        const currentUrl = encodeURIComponent(window.location.href);
        const hasSourceParam = window.location.href.includes(`source=${AYRSHARE}`);
        
        const url = `${response.url}&redirect=${currentUrl}${hasSourceParam ? '' : `?source=${AYRSHARE}`}`;
        window.open(url, "_self");
    } catch (error) {
        console.error('Failed to connect social media:', error);
        setLoadingPlatform(null);
    }
  };

  return (
    <header
      className={`h-[70px] ${headerBg} text-white flex items-center justify-between px-4 border-b ${headerBorder} shrink-0`}
    >
      <Link
        href="/"
        className="relative flex-shrink-0 w-[220px] flex items-center cursor-pointer"
      >
        <img
          src={markAiLogo}
          alt="Mark.ai Logo"
          style={{ height: "65px", objectFit: "contain" }}
        />
      </Link>

      <div className="flex items-center gap-4 h-[50px]">
        {enabledPlatforms.map((platform) => (
          <ConnectSocialIcon
            key={platform.value}
            image={platform.img}
            isConnected={platform.isConnected}
            platform={platform.value}
            handleAyrshareConnection={handleAyrshareConnection}
            isLoading={loadingPlatform === platform.value}
          />
        ))}
      </div>

      <button
        onClick={logout}
        className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-3 py-2 rounded-md transition-colors"
      >
        <LogOut size={18} />
        <span className="text-sm">Sign out</span>
      </button>
    </header>
  );
};

export default Header;
