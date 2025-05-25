import React, { useState, useEffect } from 'react';
import { X, Edit, Trash2, PlusCircle, CheckSquare, XSquare, Image, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useEditPostContext } from '@/context/EditPostProvider';
import ScheduleActionButton from "@/components/ui/schedule-action-button";
import DatePickerWithButton from "./ui/date-picker-with-button";
import { Post, PlatformType, PostStatus } from '@/types/post';
import { ENABLE_AI_GENERATE } from '@/commons/constant';

// Define platform values
const PLATFORM_VALUES: PlatformType[] = [
  'facebook',
  'instagram',
  'threads',
  'twitter',
  'youtube',
];

interface EditPostProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post;
  onSave: (updatedPost: Post) => void;
  onDelete: () => void;
  onGenerate?: (prompt: string) => void;
}

const EditPost: React.FC<EditPostProps> = ({
  isOpen,
  onClose,
  post,
  onSave,
  onDelete,
  onGenerate
}) => {
  const { timeZoneLabel = 'GMT+00:00' } = useEditPostContext();
  const [editedPost, setEditedPost] = useState<Post>(post);
  const [characterCount, setCharacterCount] = useState<number>(0);
  const [generatePrompt, setGeneratePrompt] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(post.status === 'draft');
  
  // Calendar and time selection state
  const [date, setDate] = useState<Date>(new Date(post.scheduleDate));
  
  const { toast } = useToast();

  useEffect(() => {
    setCharacterCount(editedPost.content.length);
  }, [editedPost.content]);

  useEffect(() => {
    if (post) {
      setEditedPost(post);
      const postDate = new Date(post.scheduleDate);
      
      setDate(postDate);

      setIsEditing(post.status === 'draft');
    }
  }, [post, timeZoneLabel]);
  
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedPost(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handlePlatformToggle = (platform: PlatformType) => {
    setEditedPost(prev => ({
      ...prev,
      platform: prev.platform.includes(platform)
        ? prev.platform.filter(p => p !== platform)
        : [...prev.platform, platform]
    }));
  };

  const handlePostTypeToggle = (type: string) => {
    setEditedPost(prev => ({
      ...prev,
      postType: type
    }));
  };

  const handleHashtagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hashtagsText = e.target.value;
    
    setEditedPost(prev => ({
      ...prev,
      hashtag: hashtagsText
    }));
  };

  const handleDeleteMedia = (index: number) => {
    setEditedPost(prev => ({
      ...prev,
      mediaUrl: prev.mediaUrl.filter((_, i) => i !== index)
    }));
  };

  const handleGenerate = () => {
    if (onGenerate && generatePrompt.trim()) {
      onGenerate(generatePrompt);
      setGeneratePrompt('');
      toast({
        title: "AI Generation Requested",
        description: "Generating content based on your prompt...",
      });
    }
  };
  
  const handleDateChange = (newDate: Date) => {
    setDate(newDate);
  };

  const handleSave = (status: PostStatus) => {
    if (!isEditing) return;
    
    const updatedPost = {
      ...editedPost,
      scheduleDate: date,
      status
    };
    onSave(updatedPost);
    setIsEditing(false);
  };

  const handleClose = () => {
    setIsEditing(false);
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-hidden"
      onClick={handleClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl w-[95%] sm:w-[85%] md:w-[80%] xl:w-[64%] flex flex-col h-[90vh] md:h-[80vh] max-h-[700px] relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b rounded-tr-[8px] rounded-tl-[8px] border-gray-200 sticky top-0 bg-white z-10">
          <div className="w-5 h-5"></div> {/* Empty space for alignment */}

          <div className="flex items-center">
            <h2 className="text-lg font-medium mr-2 text-gray-800 dark:text-gray-100">Post Details</h2>
            {false && (
              <button 
                className="text-gray-600 hover:text-gray-900 cursor-pointer flex items-center"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(!isEditing);
                }}
              >
                <Edit className="w-5 h-5" />
              </button>
            )}
          </div>
          
          <button 
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden rounded-bl-[8px] rounded-br-[8px]">
          {/* Left side - Media preview (desktop) */}
          <div className="hidden md:flex w-1/2 border-r border-gray-200 p-4 flex-col">
            <div className="relative flex-grow">
              {editedPost.mediaUrl.length > 0 ? (
                <div className="relative mb-4 rounded-lg overflow-hidden h-64 md:h-72 lg:h-80">
                  <img 
                    src={editedPost.mediaUrl[0]} 
                    alt="Post media" 
                    className="object-cover w-full h-full"
                  />
                  {editedPost.status === 'draft' && (
                    <button 
                      className="absolute top-2 right-2 p-1 bg-gray-800/80 rounded-full hover:bg-gray-800 text-white"
                      onClick={() => handleDeleteMedia(0)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ) : (
                <div className={cn(
                  "flex flex-col items-center justify-center h-64 md:h-72 lg:h-80 rounded-lg mb-4 border-2 border-dashed border-gray-300",
                  isEditing ? "bg-gray-100 cursor-pointer hover:bg-gray-200" : "bg-gray-50"
                )}>
                  {isEditing ? (
                    <>
                      <PlusCircle className="w-10 h-10 mb-2 text-gray-400" />
                      <p className="text-sm text-gray-500">Click to upload media</p>
                      <input 
                        type="file" 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const url = URL.createObjectURL(file);
                            setEditedPost(prev => ({
                              ...prev,
                              mediaUrl: [...prev.mediaUrl, url]
                            }));
                          }
                        }}
                      />
                    </>
                  ) : (
                    <>
                      <Image className="w-10 h-10 mb-2 text-gray-400" />
                      <p className="text-sm text-gray-400">No image</p>
                    </>
                  )}
                </div>
              )}

            </div>

            {/* Post Type Selection - Moved from bottom to top */}
            <div className="mb-4">
              <h3 className="text-sm text-gray-700 font-medium mb-2">Post Type</h3>
              <div className="flex gap-2">
                {['post', 'story', 'reel'].map((type) => (
                  <button
                    key={type}
                    className={cn(
                      "px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex-1",
                      (editedPost.postType === type || (editedPost.postType === 'text' && type === 'post'))
                        ? "bg-blue-500 text-white" 
                        : "bg-gray-100 text-gray-600",
                      !isEditing && "opacity-75 cursor-not-allowed hover:bg-gray-100 hover:text-gray-600"
                    )}
                    onClick={() => isEditing && handlePostTypeToggle(type)}
                    disabled={!isEditing}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Social platform toggles */}
            <div className="mt-4 border-t border-gray-100 pt-4">
              <h3 className="text-sm text-gray-700 font-medium mb-3">Platforms</h3>
              
              {/* Platform toggles in a single grid */}
              <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-2 mb-4">
                {PLATFORM_VALUES.map((platform) => (
                  <button
                    key={platform}
                    className={cn(
                      "flex items-center justify-center px-1 py-1.5 rounded-md text-xs font-medium transition-colors",
                      editedPost.platform.includes(platform)
                        ? "bg-blue-500 text-white" 
                        : "bg-gray-100 text-gray-600",
                      !isEditing && "opacity-75 cursor-not-allowed hover:bg-gray-100 hover:text-gray-600"
                    )}
                    onClick={() => isEditing && handlePlatformToggle(platform)}
                    disabled={!isEditing}
                  >
                    {platform === 'twitter' ? 'X' : 
                     platform === 'gmb' ? 'Google' :
                     platform === 'instagram' ? 'IG' : platform}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile view: stacked layout */}
          <div className="md:hidden flex flex-col w-full h-full">
            <div className="flex-1 overflow-y-auto">
              <div className="flex-1" onClick={(e) => e.stopPropagation()}>
                {/* Media preview for mobile */}
                <div className="my-4 mx-4 relative">
                  {editedPost.mediaUrl.length > 0 ? (
                    <div className="relative rounded-lg overflow-hidden h-64">
                      <img 
                        src={editedPost.mediaUrl[0]} 
                        alt="Post media" 
                        className="object-cover w-full h-full"
                      />
                      {editedPost.status === 'draft' && (
                        <button 
                          className="absolute top-2 right-2 p-1 bg-gray-800/80 rounded-full hover:bg-gray-800 text-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteMedia(0);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className={cn(
                      "flex flex-col items-center justify-center h-64 rounded-lg border-2 border-dashed border-gray-300",
                      isEditing ? "bg-gray-100 cursor-pointer hover:bg-gray-200" : "bg-gray-50"
                    )}>
                      {isEditing ? (
                        <>
                          <PlusCircle className="w-10 h-10 mb-2 text-gray-400" />
                          <p className="text-sm text-gray-500">Click to upload media</p>
                          <label 
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <input 
                              type="file" 
                              className="hidden" 
                              accept="image/*"
                              onChange={(e) => {
                                e.stopPropagation();
                                const file = e.target.files?.[0];
                                if (file) {
                                  const url = URL.createObjectURL(file);
                                  setEditedPost(prev => ({
                                    ...prev,
                                    mediaUrl: [...prev.mediaUrl, url]
                                  }));
                                }
                              }}
                            />
                          </label>
                        </>
                      ) : (
                        <>
                          <Image className="w-10 h-10 mb-2 text-gray-400" />
                          <p className="text-sm text-gray-400">No image</p>
                        </>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Title input (Mobile) */}
                <div className={cn(
                  "mb-3 px-4",
                  !isEditing && "opacity-50"
                )}>
                  <label className="block text-sm text-gray-600 mb-1">Title</label>
                  <input
                    type="text"
                    name="title"
                    className={cn(
                      "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-800",
                      !isEditing && "bg-gray-50 cursor-default"
                    )}
                    value={editedPost.title}
                    onChange={handleTextChange}
                    placeholder="Enter post title"
                    readOnly={!isEditing}
                  />
                </div>
                
                {/* Content textarea (Mobile) */}
                <div className={cn(
                  "mb-3 px-4",
                  !isEditing && "opacity-50"
                )}>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm text-gray-600">Caption</label>
                    <span className="text-xs text-gray-400">{characterCount}/2,200</span>
                  </div>
                  {!isEditing ? (
                    <div className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none max-h-60 overflow-y-auto text-gray-800 bg-gray-50">
                      {editedPost.content.split('\n').map((line, i) => (
                        <div key={i} className="mb-1 relative flex items-center">
                          {line.includes("Netflix and Chill") && (
                            <div className="flex items-center">
                              <span>{line}</span>
                              <XSquare className="ml-1 text-red-500 h-4 w-4" />
                            </div>
                          )}
                          {line.includes("Mountain-ing and Hill") && (
                            <div className="flex items-center">
                              <span>{line}</span>
                              <CheckSquare className="ml-1 text-green-600 h-4 w-4" />
                            </div>
                          )}
                          {!line.includes("Netflix and Chill") && !line.includes("Mountain-ing and Hill") && (
                            <span>{line}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <textarea
                      name="content"
                      className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none text-gray-800"
                      value={editedPost.content}
                      onChange={handleTextChange}
                      placeholder="Write your caption..."
                      maxLength={2200}
                    />
                  )}
                </div>
                
                {/* Hashtags input (Mobile) */}
                <div className={cn(
                  "mb-4 px-4",
                  !isEditing && "opacity-50"
                )}>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm text-gray-600">Hashtags</label>
                    <span className="text-xs text-gray-400">0/2,200</span>
                  </div>
                  <input
                    type="text"
                    className={cn(
                      "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-800",
                      !isEditing && "bg-gray-50 cursor-default"
                    )}
                    value={editedPost.hashtag}
                    onChange={handleHashtagsChange}
                    placeholder="#hashtag1 #hashtag2 #hashtag3"
                    readOnly={!isEditing}
                  />
                </div>
                
                {/* AI Generation Button (Mobile) */}
                {onGenerate && ENABLE_AI_GENERATE && (
                  <div className={cn(
                    "mb-4 px-4",
                    !isEditing && "opacity-50"
                  )}>
                    <button 
                      className={cn(
                        "inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 w-full",
                        isEditing 
                          ? "hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          : "cursor-not-allowed"
                      )}
                      onClick={() => {
                        if (isEditing) {
                          setGeneratePrompt("Generate engaging content about " + editedPost.title);
                          handleGenerate();
                        }
                      }}
                      disabled={!isEditing}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      AI Generate
                    </button>
                  </div>
                )}

                {/* Platform toggles for mobile */}
                <div className={cn(
                  "px-4 mb-4",
                  !isEditing && "opacity-50"
                )}>
                  <h3 className="text-sm text-gray-700 font-medium mb-2">Platforms</h3>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {PLATFORM_VALUES.map((platform) => (
                      <button
                        key={platform}
                        className={cn(
                          "flex items-center justify-center px-2 py-1.5 rounded-md text-xs font-medium transition-colors",
                          editedPost.platform.includes(platform)
                            ? "bg-blue-500 text-white" 
                            : "bg-gray-100 text-gray-600",
                          !isEditing && "opacity-75 cursor-not-allowed hover:bg-gray-100 hover:text-gray-600"
                        )}
                        onClick={() => isEditing && handlePlatformToggle(platform)}
                        disabled={!isEditing}
                      >
                        {platform === 'twitter' ? 'X' : 
                         platform === 'gmb' ? 'Google' :
                         platform === 'instagram' ? 'IG' : platform}
                      </button>
                    ))}
                  </div>

                  {/* Post Type Selection for mobile */}
                  <h3 className="text-sm text-gray-700 font-medium mb-2">Post Type</h3>
                  <div className="flex gap-2 mb-4">
                    {['post', 'story', 'reel'].map((type) => (
                      <button
                        key={type}
                        className={cn(
                          "px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex-1",
                          (editedPost.postType === type || (editedPost.postType === 'text' && type === 'post'))
                            ? "bg-blue-500 text-white" 
                            : "bg-gray-100 text-gray-600",
                          !isEditing && "opacity-75 cursor-not-allowed hover:bg-gray-100 hover:text-gray-600"
                        )}
                        onClick={() => isEditing && handlePostTypeToggle(type)}
                        disabled={!isEditing}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Scheduling Controls for mobile - Fixed at bottom */}
            <div className="px-4 py-3 border-t border-gray-200 bg-white">
              <div className="text-xs text-gray-500 mb-1">
                {timeZoneLabel}
              </div>  
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-gray-700">Schedule Date</label>
                <DatePickerWithButton
                  date={date}
                  onDateChange={handleDateChange}
                  disabled={!isEditing}
                  className={cn("w-full", !isEditing && "opacity-75")}
                />
                
                {/* Schedule Button with Dropdown - Mobile */}
                {editedPost.status === 'schedule' ? (
                  <div className="flex justify-center w-full">
                    <button
                      className="w-full px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors inline-flex items-center justify-center gap-2"
                      onClick={onDelete}
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                ) : editedPost.status === 'published' ? (
                  <div className="flex justify-center items-center gap-2 px-4 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-md">
                    <CheckCircle className="w-5 h-5" />
                    <span>Post Published</span>
                  </div>
                ) : (
                  <div className={cn("flex rounded-lg shadow-sm relative w-full")}>
                    <ScheduleActionButton
                      onSchedule={() => isEditing && handleSave('schedule')}
                      onDraft={() => isEditing && handleSave('draft')}
                      className={!isEditing ? "opacity-70" : ""}
                      disabled={!isEditing}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right side - Post details (desktop) */}
          <div className="hidden md:flex w-full md:w-1/2 p-4 flex-col h-full">
            {/* Title input */}
            <div className="mb-3">
              <label className="block text-sm text-gray-600 mb-1">Title</label>
              <input
                type="text"
                name="title"
                className={cn(
                  "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-800",
                  !isEditing && "opacity-75 bg-gray-50 cursor-default"
                )}
                value={editedPost.title}
                onChange={handleTextChange}
                placeholder="Enter post title"
                readOnly={!isEditing}
              />
            </div>

            {/* Content textarea with rich preview */}
            <div className="mb-3">
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm text-gray-600">Caption</label>
                <span className="text-xs text-gray-400">{characterCount}/2,200</span>
              </div>
              {!isEditing ? (
                <div className={cn(
                  "w-full px-3 py-2 border border-gray-300 rounded-md resize-none h-[12rem] overflow-y-auto text-gray-800",
                  "opacity-75 bg-gray-50"
                )}>
                  {editedPost.content.split('\n').map((line, i) => (
                    <div key={i} className="mb-1 relative flex items-center">
                      {line.includes("Netflix and Chill") && (
                        <div className="flex items-center">
                          <span>{line}</span>
                          <XSquare className="ml-1 text-red-500 h-4 w-4" />
                        </div>
                      )}
                      {line.includes("Mountain-ing and Hill") && (
                        <div className="flex items-center">
                          <span>{line}</span>
                          <CheckSquare className="ml-1 text-green-600 h-4 w-4" />
                        </div>
                      )}
                      {!line.includes("Netflix and Chill") && !line.includes("Mountain-ing and Hill") && (
                        <span>{line}</span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <textarea
                  name="content"
                  className="w-full h-[12rem] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none text-gray-800"
                  value={editedPost.content}
                  onChange={handleTextChange}
                  placeholder="Write your caption..."
                  maxLength={2200}
                />
              )}
            </div>

            {/* Hashtags input */}
            <div className="mb-3">
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm text-gray-600">Hashtags</label>
                <span className="text-xs text-gray-400">0/2,200</span>
              </div>
              <input
                type="text"
                className={cn(
                  "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-800",
                  !isEditing && "opacity-75 bg-gray-50 cursor-default"
                )}
                value={editedPost.hashtag}
                onChange={handleHashtagsChange}
                placeholder="#hashtag1 #hashtag2 #hashtag3"
                readOnly={!isEditing}
              />
            </div>

            {/* AI Generation Button */}
            {onGenerate && ENABLE_AI_GENERATE && (
              <div className="mb-6">
                <button
                  className={cn(
                    "inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600",
                    isEditing 
                      ? "hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" 
                      : "opacity-50 cursor-not-allowed"
                  )}
                  onClick={() => {
                    if (isEditing) {
                      setGeneratePrompt("Generate engaging content about " + editedPost.title);
                      handleGenerate();
                    }
                  }}
                  disabled={!isEditing}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  AI Generate
                </button>
              </div>
            )}
            
            {/* Scheduling Controls - Made responsive */}
            <div className="mt-auto">
              {/* Timezone Label */}
              <div className="text-xs text-gray-500 mb-1">
                {timeZoneLabel}
              </div>  
              <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center space-y-2 lg:space-y-0 lg:space-x-2">
                
                {/* Calendar Date Picker */}
                <div className="w-full lg:w-auto">
                  <DatePickerWithButton
                    date={date}
                    onDateChange={handleDateChange}
                    disabled={!isEditing}
                    className={cn("w-full", !isEditing && "opacity-75")}
                  />
                </div>
                
                {/* Schedule Button with Dropdown - Desktop */}
                {editedPost.status === 'schedule' ? (
                  <div className="flex justify-center">
                    <button
                      className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors inline-flex items-center justify-center gap-2"
                      onClick={onDelete}
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                ) : editedPost.status === 'published' ? (
                  <div className="flex justify-center items-center gap-2 px-4 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-md">
                    <CheckCircle className="w-5 h-5" />
                    <span>Post Published</span>
                  </div>
                ) : (
                  <div className={cn("flex rounded-lg shadow-sm relative w-full lg:w-auto")}>
                    <ScheduleActionButton
                      onSchedule={() => isEditing && handleSave('schedule')}
                      onDraft={() => isEditing && handleSave('draft')}
                      className={!isEditing ? "opacity-70" : ""}
                      disabled={!isEditing}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPost;