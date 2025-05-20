import { PostData } from "@/components/EditPost";

// Global function to check if we're on the create page
function isOnCreatePage(): boolean {
  if (typeof window !== 'undefined') {
    return window.location.pathname === '/create';
  }
  return false;
}

// Create a common fallback function
const createFallbackFunction = () => {
  return (data: PostData) => {
    // First check if we're on the correct page
    if (!isOnCreatePage()) {
      console.error('Error: Update post data only works on the /create page. Please navigate to /create and try again.');
      return false;
    } else {
      console.error('Error: PostPreviewPanel is not mounted yet. Please wait for the component to load completely.');
      return false;
    }
  };
};

// Make sure window.updatePostData has a fallback if the component isn't mounted yet
if (typeof window !== 'undefined' && !window.updatePostData) {
  // Define a temporary function that will handle calls before the component mounts
  window.updatePostData = createFallbackFunction();
}

// Also support the old name for backward compatibility
if (typeof window !== 'undefined' && !window.updatePostPreview) {
  // Define a temporary function that will handle calls before the component mounts
  window.updatePostPreview = createFallbackFunction();
}

// Add TypeScript declaration for the window object
declare global {
  interface Window {
    updatePostData: (data: PostData) => void;
    updatePostPreview: (data: PostData) => void; // Keep both for backward compatibility
  }
}