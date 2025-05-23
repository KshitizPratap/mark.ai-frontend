import React, { useState, useEffect } from "react";
import { usePostStore } from "@/store/usePostStore";
import { PlatformType, PostStatus } from "@/types/post";
import PlatformToggle from "@/components/dashboard/PlatformToggle";
import SocialMediaPostPreview from "@/components/ui/social-media-post-preview";
import { platformsRow1, postTypes } from "@/commons/constant";
import { useToast } from "@/hooks/use-toast";
import { updatePost } from "@/services/postServices";

const CreatePost = () => {
  const {
    createPost,
    setCreatePost,
  } = usePostStore();
  const {content, hashtag, mediaUrl, platform, postType, scheduleDate, title} = createPost;

  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  // --- Local UI State Only ---
  const [date, setDate] = useState<Date | undefined>(new Date());

  const [uploadedImageFile, setUploadedImageFile] = useState<File | null>(null);
  const [localImageUrl, setLocalImageUrl] = useState<string | null>(null);

  // Show local preview if file is selected, otherwise use mediaUrl
  const imageUrl =
    localImageUrl ||
    (createPost.mediaUrl && createPost.mediaUrl.length > 0 ? createPost.mediaUrl[0] : undefined);

  // Effect to parse the ISO scheduledDate prop and set date and time inputs
  useEffect(() => {
    try {
      if (createPost.scheduleDate) {
        setDate(createPost.scheduleDate); // Set the main date object
      }
    } catch (error) {
      console.error("Error parsing scheduleDate prop:", error);
      // Fallback to current time if parse fails or scheduleDate is invalid
      const now = new Date();
      setDate(now);
    }
  }, [createPost.scheduleDate]);

  // Clean up local object URL when file changes
  useEffect(() => {
    if (uploadedImageFile) {
      const url = URL.createObjectURL(uploadedImageFile);
      setLocalImageUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setLocalImageUrl(null);
    }
  }, [uploadedImageFile]);

  const updatePostHandler = async (
    key: string,
    value: PlatformType[] | PostStatus | string
  ) => {
    setIsUpdating(true);

    try {
      const response = await updatePost(
        {
          [key]: value,
        },
        createPost._id || ""
      );

      if(response){
        setCreatePost({
          [key]: value,
        });
      }

    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error)?.message as string,
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePlatformToggle = async (platformName: PlatformType) => {
    const newPlatforms = platform.includes(platformName)
      ? platform.filter((p) => p !== platformName)
      : [...platform, platformName];
    
      updatePostHandler("platforms", newPlatforms)
  };

  const handlePostTypeClick = (type: "post" | "story" | "reel") => {
    updatePostHandler('postType', type)
  };

  const handleDateChange = (newDate: Date) => {
    setDate(newDate);
    setCreatePost({ scheduleDate: newDate });
  };
  
  // Image upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedImageFile(file);
    }
  };

  const handleImageDelete = () => {
    setUploadedImageFile(null);
    setLocalImageUrl(null);
    setMediaUrl([]);
  };
  
  // Modified handler to handle scheduling
  const handleSchedulePost = async () => {
    try {
      let responseData;
      if (uploadedImageFile) {
        const formData = new FormData();
        formData.append("image", uploadedImageFile);
        formData.append("title", title || "");
        formData.append("content", content || "");
        formData.append("hashtag", hashtag || "");
        formData.append("platform", JSON.stringify(platform));
        formData.append("postType", postType);
        formData.append("scheduleDate", scheduleDate.toISOString());
        // TODO: Replace with your actual API endpoint
        const response = await fetch("/api/schedule-post", {
          method: "POST",
          body: formData,
        });
        responseData = await response.json();
      } else {
        // Fallback: send as JSON if no image
        const response = await fetch("/api/schedule-post", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            content,
            hashtag,
            platform,
            postType,
            scheduleDate: scheduleDate.toISOString(),
          }),
        });
        responseData = await response.json();
      }
      // If backend returns image URL, update mediaUrl and clear local file
      if (responseData && responseData.url) {
        setUploadedImageFile(null);
        setLocalImageUrl(null);
        if (responseData.url) {
          setCreatePost({ mediaUrl: [responseData.url] });
        }
      }
      toast({
        title: "Success",
        description: `Post successfully scheduled for: ${date}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to schedule post.",
        variant: "destructive",
      });
    }
  };
  
  // Handle the actual draft post saving
  const handleSaveDraft = () => {
    try {
      // Save draft post logic
      const draftData = {
        title,
        content,
        hashtag,
        platform,
        postType,
        scheduleDate: scheduleDate.toISOString(),
      };
      
      // Save draft to localStorage for persistence
      const existingDrafts = JSON.parse(
        localStorage.getItem("postDrafts") || "[]"
      );
      existingDrafts.push({
        ...draftData,
        id: Date.now(), // Simple unique ID
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem("postDrafts", JSON.stringify(existingDrafts));
      
      toast({
        title: "Success",
        description: "Post saved as draft!",
      });
    } catch (error) {
      console.error("Error saving draft:", error);
      toast({
        title: "Error",
        description: "Failed to save draft.",
        variant: "destructive",
      });
    }
  };
  
  const previewPanelBg = "bg-gray-100";
  
  return (
    <div className={`flex flex-col ${previewPanelBg} text-black h-full  `}>
      <div className={`flex flex-col ${previewPanelBg} text-black h-full ${isUpdating ? 'opacity-50 pointer-events-none' : ''}`}>
        <div
        className={`h-[58px] flex items-center px-5 border-b border-gray-200 shrink-0 bg-white`}
      >
        <h2 className={`font-semibold text-gray-800`}>Post Preview</h2>
      </div>

      <div className={`px-5 py-2 border-b border-gray-200 bg-gray-50 shrink-0`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-y-4 gap-x-4 sm:gap-x-6">
          {platformsRow1.map((platformObj) => (
            <PlatformToggle
              key={platformObj.name}
              label={platformObj.name.charAt(0).toUpperCase() + platformObj.name.slice(1)}
              icon={platformObj.icon}
              active={platform.includes(platformObj.name)}
              onToggle={() => handlePlatformToggle(platformObj.name)}
            />
          ))}
        </div>
      </div>

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
        <div className="p-6">
          <SocialMediaPostPreview
            userInitials="SC"
            userName="Stephen Conley"
            userHandle="@steveconley"
            userTitle="Product Designer"
            scheduledDate={scheduleDate}
            onSchedule={handleSchedulePost}
            onDraft={handleSaveDraft}
            onDateChange={handleDateChange}
            hideFooter={false}
            onImageUpload={handleImageUpload}
            uploadedImageFile={uploadedImageFile}
            onImageDelete={handleImageDelete}
          />
        </div>
      </div>
      </div>
    </div>
  );
};

export default CreatePost;
