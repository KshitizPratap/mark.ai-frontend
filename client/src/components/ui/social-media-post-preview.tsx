import React, { useState, useRef, useEffect } from "react";
import ScheduleActionButton from "./schedule-action-button";
import { usePostStore } from "@/store/usePostStore";
import { useAuthStore } from "@/store/useAuthStore";
import { User } from "@/types";
import DatePickerWithButton from "./date-picker-with-button";
import { Trash2 } from 'lucide-react';
import { cn } from "@/lib/utils";

// Define types for component props
interface SocialMediaPostPreviewProps {
  // Post content
  postTitle?: string | null;
  postContent?: string | null;
  hashtags?: string[];

  // Image data
  imageUrl?: string;

  // Scheduling options
  scheduledDate?: Date;
  onSchedule?: () => void;
  onDraft?: () => void;
  onDateChange: (date: Date) => void;

  // Customization options
  hideHeader?: boolean;
  hideFooter?: boolean;
  className?: string;

  // Add these props for upload
  onImageUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploadedImageFile?: string;
  onImageDelete?: () => void;
  isImageUploading?: boolean;
}

/**
 * A reusable component that displays a social media post preview with user info,
 * post content, image upload area, and scheduling options.
 */
const SocialMediaPostPreview: React.FC<SocialMediaPostPreviewProps> = ({
  // User data with defaults

  // Post content with defaults
  imageUrl,
  scheduledDate,
  onSchedule,
  onDraft,
  onDateChange,

  // Customization options
  hideHeader = false,
  hideFooter = false,
  className = "",

  // Add these props for upload
  onImageUpload,
  uploadedImageFile,
  onImageDelete,
  isImageUploading = false
}) => {
  const {livePost} = usePostStore();
  const {content: postContent, hashtag, title: postTitle} = livePost;
  const { userDetails = {} } = useAuthStore();
  const { name: userName = "" } = userDetails as User;
  
  const formattedUserName = userName
    .split(' ')
    .filter(word => word.length > 0)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
  
  const userInitials = userName
    .split(' ')
    .filter(word => word.length > 0)
    .map(word => word.charAt(0).toUpperCase())
    .join('') || 'U';
  
  const [imageError, setImageError] = React.useState(false);

  console.log("[]", userDetails);
  

  // Reset error if imageUrl changes
  React.useEffect(() => {
    setImageError(false);
  }, [imageUrl]);

  const hashtags = hashtag ? hashtag.split(' ').filter(Boolean) : [];

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 w-full">
        {!hideHeader && (
          <div className="px-4 py-2 border-b border-gray-100 flex items-center">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold mr-3">
              {userInitials}
            </div>
            <div>
              <h3 className="font-medium text-sm text-gray-900">{formattedUserName}</h3>
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2 h-[300px] flex items-center justify-center bg-gray-100 border-r border-gray-100 relative">
            {isImageUploading ? (
              <div className="flex flex-col items-center text-center w-full h-full justify-center">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mb-2 animate-spin">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-500"
                  >
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                </div>
                <p className="text-sm text-gray-500">Uploading...</p>
              </div>
            ) : !uploadedImageFile || imageError ? (
              <div className="flex flex-col items-center text-center w-full h-full justify-center">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-500"
                  >
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7" />
                    <line x1="16" y1="5" x2="22" y2="5" />
                    <line x1="19" y1="2" x2="19" y2="8" />
                    <circle cx="9" cy="9" r="2" />
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                  </svg>
                </div>
                <p className="text-sm text-gray-500 mx-4">
                  <span className="font-semibold text-blue-600 cursor-pointer">
                    Click to Upload
                  </span>
                  <span className="block mt-1">or Drag & Drop</span>
                </p>
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={onImageUpload}
                />
              </div>
            ) : (
              <div className="relative w-full h-full">
                <img
                  src={uploadedImageFile}
                  alt="Post visual content"
                  className="object-conver h-full w-full"
                  onError={() => setImageError(true)}
                  onLoad={() => setImageError(false)}
                />
                {onImageDelete && (
                  <button 
                    className="absolute top-2 right-2 p-1 bg-gray-800/80 rounded-full hover:bg-gray-800 text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      onImageDelete();
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="md:w-1/2 p-5 max-h-[280px] overflow-y-auto">
            {postTitle ? (
              <h2 className="font-bold text-lg text-gray-900 mb-2">
                {postTitle}
              </h2>
            ) : (
              <h2 className="font-bold text-lg text-gray-400 mb-2 italic">
                Post title will appear here
              </h2>
            )}

            {postContent ? (
              <p className="text-gray-700 mb-4 text-sm">{postContent}</p>
            ) : (
              <p className="text-gray-400 mb-4 text-sm italic">
                Your post content will be displayed in this area. Add compelling
                content to engage your audience.
              </p>
            )}

            {hashtags && hashtags.length > 0 && (
              <div className="text-blue-500 text-sm space-x-1 flex flex-wrap">
                {hashtags.map((tag, index) => (
                  <span key={index}>#{tag}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {!hideFooter && (
        <div className="max-w-2xl mx-auto mt-4 flex items-center justify-end flex-wrap gap-4 w-full">
          <div className="flex items-center gap-2">
            <DatePickerWithButton
              date={scheduledDate || new Date()}
              onDateChange={(date) => onDateChange(date)}
            />
             <div className={cn("flex rounded-lg shadow-sm relative w-full lg:w-auto")}>
            <ScheduleActionButton
              onSchedule={onSchedule}
              onDraft={onDraft}
              className={!onSchedule && !onDraft ? "opacity-70" : ""}
              disabled={!onSchedule && !onDraft}
            />
          </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialMediaPostPreview;
