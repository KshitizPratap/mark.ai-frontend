import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { PostStatus } from '@/types/post';
import { useConfirmationDialogContext } from '@/context/ConfirmationDialogProvider';

interface ScheduleActionButtonProps {
  onSchedule?: () => void;
  onDraft?: () => void;
  className?: string;
  disabled?: boolean;
  initialPostStatus?: PostStatus;
  hasChanges?: boolean;
  isMediaUploading?: boolean;
}

const ScheduleActionButton = ({
  onSchedule,
  onDraft,
  className = '',
  disabled = false,
  initialPostStatus = 'draft',
  hasChanges = true,
  isMediaUploading = false,
}: ScheduleActionButtonProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<'schedule' | 'draft'>('draft');
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const { showConfirmation } = useConfirmationDialogContext();

  // Set initial selected type based on post status
  useEffect(() => {
    if (initialPostStatus === 'schedule') {
      setSelectedType('schedule');
    } else {
      setSelectedType('draft');
    }
  }, [initialPostStatus]);

  // Disable buttons if no changes have been made or media is uploading
  const isButtonDisabled = disabled || !hasChanges || isMediaUploading;

  const handleDropdownToggle = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (!isButtonDisabled) setIsDropdownOpen(!isDropdownOpen);
  };

  const handleOptionSelect = (type: 'schedule' | 'draft') => {
    setSelectedType(type);
    setIsDropdownOpen(false);
  };

  const handleMainButtonClick = () => {
    if (isButtonDisabled) return;
    if (selectedType === 'schedule') {
      onSchedule?.();
    } else {
      onDraft?.();
    }
  };

  const getButtonText = () => {
    if (isMediaUploading) {
      return 'Uploading...';
    }
    return selectedType === 'schedule' ? 'Schedule Post' : 'Save Draft';
  };

  return (
    <>
      <div className={`w-full flex rounded-lg shadow-sm relative ${className}`}>
        <button 
          className={`w-full min-w-40 px-6 text-sm font-medium bg-cyan-500 text-white whitespace-nowrap rounded-l-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 ${isButtonDisabled ? 'opacity-70 cursor-not-allowed' : 'hover:bg-cyan-600'}`}
          onClick={handleMainButtonClick}
          disabled={isButtonDisabled}
          tabIndex={isButtonDisabled ? -1 : 0}
        >
          {getButtonText()}
        </button>
        <button 
          className={`px-2 py-2 bg-cyan-500 text-white rounded-r-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 ${isButtonDisabled ? 'opacity-70 cursor-not-allowed' : 'hover:bg-cyan-700'}`}
          onClick={handleDropdownToggle}
          aria-haspopup="true"
          aria-expanded={isDropdownOpen}
          disabled={isButtonDisabled}
          tabIndex={isButtonDisabled ? -1 : 0}
        >
          <ChevronDown className={`h-5 w-5 transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {isDropdownOpen && !isButtonDisabled && (
          <div 
            ref={dropdownRef}
            className="absolute right-0 bottom-full mb-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50 divide-y divide-gray-100"
            role="menu"
            aria-orientation="vertical"
          >
            <div className="py-1" role="none">
              <button
                onClick={() => handleOptionSelect('schedule')}
                className="group flex items-center w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                role="menuitem"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-400 group-hover:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Schedule Post
              </button>
              
              <button
                onClick={() => handleOptionSelect('draft')}
                className="group outline-none flex items-center w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                role="menuitem"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-400 group-hover:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Draft Post
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ScheduleActionButton; 