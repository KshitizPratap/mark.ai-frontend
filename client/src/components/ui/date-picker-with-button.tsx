import React, { useState } from "react";
import { format } from "date-fns";
import DateTimePicker from "./date-time-picker";

interface DatePickerWithButtonProps {
  date: Date;
  onDateChange: (date: Date) => void;
  className?: string;
  disabled?: boolean;
}

const DatePickerWithButton: React.FC<DatePickerWithButtonProps> = ({
  date,
  onDateChange,
  className = "",
  disabled = false,
}) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleButtonClick = () => {
    if (!disabled) setIsCalendarOpen(!isCalendarOpen);
  };

  const handleDateChange = (newDate: Date) => {
    onDateChange(newDate);
  };

  // Format the date for display
  const displayDate = date ? format(date, "MMMM d, yyyy • h:mm aa") : "Select Date";
  
  return (
    <>
      <button
        onClick={handleButtonClick}
        disabled={disabled}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-white border border-gray-200 hover:bg-gray-50 text-gray-900 ${className} ${disabled ? "cursor-not-allowed opacity-75" : ""}`}
      >
        {displayDate}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-gray-600"
        >
          <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
          <line x1="16" x2="16" y1="2" y2="6" />
          <line x1="8" x2="8" y1="2" y2="6" />
          <line x1="3" x2="21" y1="10" y2="10" />
        </svg>
      </button>

      <DateTimePicker
        selectedDate={date}
        onDateChange={handleDateChange}
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
      />
    </>
  );
};

export default DatePickerWithButton; 