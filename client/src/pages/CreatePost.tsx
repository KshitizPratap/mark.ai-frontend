import React, { useState, useEffect } from "react";
import { resetLivePost, usePostStore } from "@/store/usePostStore";
import { useAuthStore } from "@/store/useAuthStore";
import { PostStatus } from "@/types/post";
import { PlatformType } from "@/types";
import PlatformToggle from "@/components/dashboard/PlatformToggle";
import SocialMediaPostPreview from "@/components/ui/social-media-post-preview";
import { postTypes } from "@/commons/constant";
import { useToast } from "@/hooks/use-toast";
import { updatePost } from "@/services/postServices";
import useEditPost from "@/hooks/use-edit-post";
import { createDummyLivePost } from "@/services/authServices";
import { formatHashtagsForSubmission } from "@/utils/postUtils";

const CreatePost = () => {
  const { livePost, setLivePost } = usePostStore();
  const { getConnectedPlatforms, isMobileView } = useAuthStore();
  const {updatePostHandler} = useEditPost();
  const { platform, postType, scheduleDate, mediaUrl } = livePost;

  const { toast } = useToast();
  const { onSave } = useEditPost();
  const [isUpdating, setIsUpdating] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());

  const connectedPlatforms = getConnectedPlatforms();

  useEffect(() => {
    try {
      if (livePost.scheduleDate) {
        setDate(livePost.scheduleDate);
      }
    } catch (error) {
      console.error("Error parsing scheduleDate prop:", error);
      const now = new Date();
      setDate(now);
    }
  }, [livePost.scheduleDate]);

  // const updatePostHandler = async (
  //   key: string,
  //   value: PlatformType[] | string
  // ) => {
  //   setIsUpdating(true);
  //   try {
  //     const response = await updatePost(
  //       {
  //         [key]: value,
  //       },
  //       livePost._id || ""
  //     );

  //     if(response){
  //       setLivePost({
  //         [key]: value,
  //       });
  //     }

  //   } catch (error) {
  //     toast({
  //       title: "Error",
  //       description: (error as Error)?.message as string,
  //       variant: "destructive",
  //     });
  //   } finally{
  //     setIsUpdating(false);
  //   }
  // };

  const handlePostTypeClick = (type: "post" | "story" | "reel") => {
    updatePostHandler('postType', type);
  };

  const handleDateChange = (newDate: Date) => {
    setDate(newDate);
    setLivePost({ scheduleDate: newDate });
  };
  
  const handleMediaChange = (mediaUrls: string[]) => {
    setLivePost({ ...livePost, mediaUrl: mediaUrls });
  };

  const handleSave = async (status: PostStatus) => {
    // Check if the selected date and time is in the past
    const now = new Date();
    if (date && date < now) {
      toast({
        title: "Invalid Date/Time",
        description: "Please select a future date and time.",
        variant: "destructive",
      });
      return;
    }

    const formattedHashtags = formatHashtagsForSubmission(livePost.hashtag || '');

    const updatedPost = {
      ...livePost,
      hashtag: formattedHashtags,
      scheduleDate: date || new Date(),
      status,
    };
    await onSave(updatedPost);
    resetLivePost();
    createDummyLivePost();
  };

  const handleSavePost = async (type: "schedule" | "draft") => {
    const currentPlatforms = Array.isArray(platform) ? platform : [];
    if (currentPlatforms.length === 0) {
      toast({
        title: "Select Platform",
        description: `Please select at least one platform to ${type === "schedule" ? "schedule" : "save"} your post.`,
        variant: "destructive",
      });
      return;
    }
    
    await handleSave(type);
  };

  const previewPanelBg = "bg-gray-100";
  
  return (
    <div className={`flex flex-col ${previewPanelBg} text-black h-full ${isMobileView ? 'h-[calc(100vh-70px-65px)]' : ''}`}>
      <div className={`flex flex-col ${previewPanelBg} text-black h-full ${isUpdating ? 'opacity-50 pointer-events-none' : ''}`}>
        <div
          className={`h-[58px] flex items-center px-5 border-b border-gray-200 shrink-0 bg-white`}
        >
          <h2 className={`font-semibold text-gray-800`}>Post Preview</h2>
        </div>

        {/* <div className={`px-5 py-2 border-b border-gray-200 bg-gray-50 shrink-0`}>
          <div className="flex flex-wrap justify-between gap-4">
            {connectedPlatforms.map((platformObj) => (
              <div key={platformObj.value} className="flex-shrink-0">
                <PlatformToggle
                  label={platformObj.label}
                  platform={platformObj.value}
                  onToggle={(isActive) => handlePlatformToggle(platformObj.value as PlatformType, isActive)}
                  initialState={Array.isArray(platform) ? platform.includes(platformObj.value) : false}
                />
              </div>
            ))}
          </div>
        </div> */}

        <div
          className={`px-5 py-3 border-b border-gray-200 bg-white shrink-0 flex flex-wrap gap-3`}
        >
          {postTypes.map((type) => (
            <button
              key={type.id}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium border ${
                (postType === type.id || (postType === 'text' && type.id === 'post'))
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300"
              }`}
              onClick={() => handlePostTypeClick(type.id)}
            >
              {type.label}
            </button>
          ))}
        </div>

        <div className={`flex-1 overflow-y-auto bg-white`}>
          <div className="p-4">
            <SocialMediaPostPreview
              scheduledDate={scheduleDate}
              onSchedule={() => handleSavePost("schedule")}
              onDraft={() => handleSavePost("draft")}
              onDateChange={handleDateChange}
              hideFooter={false}
              uploadedMediaFile={mediaUrl}
              onMediaChange={handleMediaChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
