import { Post } from '@/types/post';

export const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const FULL_DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June', 
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Get start date (first day of the month)
export const getMonthStartDate = (date: Date): Date => {
  const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
  return startDate;
};

// Get end date (last day of the month)
export const getMonthEndDate = (date: Date): Date => {
  const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return endDate;
};

// Get all dates for the calendar grid (including trailing days)
export const getCalendarDates = (date: Date): Date[] => {
  const monthStart = getMonthStartDate(date);
  const monthEnd = getMonthEndDate(date);
  const startDay = monthStart.getDay(); // 0 for Sunday, 1 for Monday, etc.
  const daysInMonth = monthEnd.getDate();
  
  const datesArray: Date[] = [];
  
  // Add previous month's trailing dates
  const prevMonthEnd = new Date(date.getFullYear(), date.getMonth(), 0).getDate();
  for (let i = startDay - 1; i >= 0; i--) {
    const prevDate = new Date(date.getFullYear(), date.getMonth() - 1, prevMonthEnd - i);
    datesArray.push(prevDate);
  }
  
  // Add current month dates
  for (let i = 1; i <= daysInMonth; i++) {
    const currentDate = new Date(date.getFullYear(), date.getMonth(), i);
    datesArray.push(currentDate);
  }
  
  // Add next month's leading dates to complete the grid (6 rows total)
  const remainingDays = 42 - datesArray.length; // 6 rows * 7 columns = 42
  for (let i = 1; i <= remainingDays; i++) {
    const nextDate = new Date(date.getFullYear(), date.getMonth() + 1, i);
    datesArray.push(nextDate);
  }
  
  return datesArray;
};

// Get the first date of the week containing the given date
export const getWeekStartDate = (date: Date): Date => {
  const day = date.getDay(); // 0 for Sunday, 1 for Monday, etc.
  const diff = date.getDate() - day;
  return new Date(date.getFullYear(), date.getMonth(), diff);
};

// Get all dates for a week
export const getWeekDates = (date: Date): Date[] => {
  const weekStart = getWeekStartDate(date);
  const weekDates: Date[] = [];
  
  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(weekStart);
    currentDate.setDate(weekStart.getDate() + i);
    weekDates.push(currentDate);
  }
  
  return weekDates;
};

// Get a formatted string for month view header
export const getMonthTitle = (date: Date): string => {
  return `${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
};

// Get a formatted string for week view header
export const getWeekTitle = (date: Date): string => {
  const weekDates = getWeekDates(date);
  const startMonth = MONTHS[weekDates[0].getMonth()];
  const endMonth = MONTHS[weekDates[6].getMonth()];
  
  if (startMonth === endMonth) {
    return `${startMonth} ${weekDates[0].getDate()} - ${weekDates[6].getDate()}, ${weekDates[0].getFullYear()}`;
  } else {
    return `${startMonth} ${weekDates[0].getDate()} - ${endMonth} ${weekDates[6].getDate()}, ${weekDates[0].getFullYear()}`;
  }
};

// Check if two dates are the same day
export const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

// Check if a date is today
export const isToday = (date: Date): boolean => {
  const today = new Date();
  return isSameDay(date, today);
};

// Check if a date is in the current month
export const isCurrentMonth = (date: Date, currentMonth: Date): boolean => {
  return (
    date.getMonth() === currentMonth.getMonth() &&
    date.getFullYear() === currentMonth.getFullYear()
  );
};

// Format time in 12-hour format (e.g., 2:30 PM)
export const formatTime12Hour = (date: Date): string => {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  
  hours = hours % 12;
  hours = hours ? hours : 12; // "0" should be "12"
  
  const minutesStr = minutes < 10 ? `0${minutes}` : minutes;
  
  return `${hours}:${minutesStr} ${ampm}`;
};

// Format time in 24-hour format for the post indicators (e.g., 14:30)
export const formatTime24Hour = (date: Date): string => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  
  const hoursStr = hours < 10 ? `0${hours}` : hours;
  const minutesStr = minutes < 10 ? `0${minutes}` : minutes;
  
  return `${hoursStr}:${minutesStr}`;
};

// Get posts for a specific day
export const getPostsForDay = (posts: Post[], date: Date): Post[] => {
  return posts.filter(post => {
    return isSameDay(post.scheduleDate, date);
  });
};

// Generate hours array for week view (0-23)
export const getHoursArray = (): number[] => {
  return Array.from({ length: 24 }, (_, i) => i); // 0 to 23 (12AM to 11PM)
};

// Format hour label for time gutter (e.g., "1 AM", "2 PM")
export const formatHourLabel = (hour: number): string => {
  if (hour === 0) {
    return '12 AM';
  } else if (hour < 12) {
    return `${hour} AM`;
  } else if (hour === 12) {
    return '12 PM';
  } else {
    return `${hour - 12} PM`;
  }
};

// Calculate position and height for a post in week view
export const calculatePostPosition = (post: Post): { top: number; height: number } => {
  const hour = post.scheduleDate.getHours();
  const minute = post.scheduleDate.getMinutes();
  
  const top = hour * 60 + minute; // Position in minutes from top
  const height = 30; // Fixed height of 30 minutes for each post
  
  return { top, height };
};

// Check if posts overlap in time
export const doPostsOverlap = (post1: Post, post2: Post): boolean => {
  const time1 = post1.scheduleDate.getTime();
  const time2 = post2.scheduleDate.getTime();
  
  // Consider posts overlapping if they are within 30 minutes of each other
  const timeWindow = 30 * 60 * 1000; // 30 minutes in milliseconds
  return Math.abs(time1 - time2) < timeWindow;
};

// Position posts with consideration for overlapping
export const positionPostsForWeek = (posts: Post[]): Post[] => {
  if (!posts || posts.length === 0) return [];
  
  // Sort posts by scheduled time
  const sortedPosts = [...posts].sort((a, b) => 
    a.scheduleDate.getTime() - b.scheduleDate.getTime()
  );
  
  // Create a map to track horizontal position for each post
  const postPositions = new Map<string, number>();
  
  // For each post, find the first available horizontal position
  sortedPosts.forEach(post => {
    // Start at position 0 and check if any overlapping posts are using this position
    let horizontalPosition = 0;
    let positionFound = false;
    
    while (!positionFound) {
      positionFound = true;
      
      // Check against all posts that have been positioned already
      for (const [postId, position] of Array.from(postPositions)) {
        // Find the post object for this id
        const otherPost = sortedPosts.find(p => p._id === postId);
        if (!otherPost) continue;
        
        // If posts overlap in time and are using the same horizontal position
        if (doPostsOverlap(post, otherPost) && position === horizontalPosition) {
          positionFound = false;
          horizontalPosition++;
          break;
        }
      }
    }
    
    // Assign the position
    postPositions.set(post._id || '', horizontalPosition);
  });
  
  // Return the posts with their positions
  return sortedPosts.map(post => ({
    ...post,
    horizontalPosition: postPositions.get(post._id || '') || 0
  }));
};
