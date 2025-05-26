import React, { useState, useRef, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";

interface DateTimePickerProps {
  selectedDate: Date | undefined;
  onDateChange: (date: Date) => void;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

const DateTimePicker: React.FC<DateTimePickerProps> = ({
  selectedDate,
  onDateChange,
  isOpen,
  onClose,
  className = "",
}) => {
  const { toast } = useToast();
  // Time input states
  const [inputHour, setInputHour] = useState<string>("09");
  const [inputMinute, setInputMinute] = useState<string>("00");
  const [inputAmPm, setInputAmPm] = useState<"AM" | "PM">("AM");

  const calendarRef = useRef<HTMLDivElement>(null);

  // Options for time dropdowns
  const hourOptions = Array.from({ length: 12 }, (_, i) =>
    (i + 1).toString().padStart(2, "0")
  );

  // Create minute options with 5-minute intervals
  const minuteOptions = Array.from({ length: 12 }, (_, i) =>
    (i * 5).toString().padStart(2, "0")
  );

  // Initialize time inputs when selectedDate changes
  useEffect(() => {
    if (selectedDate) {
      let hours = selectedDate.getHours();
      const minutes = selectedDate.getMinutes();
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12; // Convert to 12-hour format

      setInputHour(hours.toString().padStart(2, "0"));
      setInputMinute(minutes.toString().padStart(2, "0"));
      setInputAmPm(ampm);
    }
  }, [selectedDate]);

  // Handle clicks outside calendar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isOpen, onClose]);

  // Check if a date is in the past
  const isDateInPast = (date: Date): boolean => {
    const now = new Date();
    return date < now;
  };

  // Handle date selection from calendar
  const handleSelectDate = (newDate: Date | undefined) => {
    if (newDate) {
      // Create a new date object to avoid mutating the input
      const updatedDate = new Date(newDate);
      
      // Get current time values
      const hours = parseInt(inputHour, 10);
      const minutes = parseInt(inputMinute, 10);
      let hours24 = hours;
      
      if (inputAmPm === "PM" && hours < 12) hours24 += 12;
      if (inputAmPm === "AM" && hours === 12) hours24 = 0;

      // Set the time on the new date
      updatedDate.setHours(hours24, minutes, 0, 0);

      // Check if the selected date and time is in the past
      if (isDateInPast(updatedDate)) {
        toast({
          title: "Invalid Date/Time",
          description: "Please select a future date and time.",
          variant: "destructive",
        });
        return;
      }

      onDateChange(updatedDate);
    }
  };

  // Handle time changes
  const handleHourChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setInputHour(e.target.value);
    updateDateTime(e.target.value, inputMinute, inputAmPm);
  };

  const handleMinuteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setInputMinute(e.target.value);
    updateDateTime(inputHour, e.target.value, inputAmPm);
  };

  const handleAmPmChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newAmPm = e.target.value as "AM" | "PM";
    setInputAmPm(newAmPm);
    updateDateTime(inputHour, inputMinute, newAmPm);
  };

  const updateDateTime = (hour: string, minute: string, ampm: "AM" | "PM") => {
    if (!selectedDate) return;

    // Create a new date object to avoid mutating the input
    const updatedDate = new Date(selectedDate);
    
    let hours24 = parseInt(hour, 10);
    if (ampm === "PM" && hours24 < 12) hours24 += 12;
    if (ampm === "AM" && hours24 === 12) hours24 = 0;

    updatedDate.setHours(hours24, parseInt(minute, 10), 0, 0);

    // Check if the selected date and time is in the past
    if (isDateInPast(updatedDate)) {
      toast({
        title: "Invalid Date/Time",
        description: "Please select a future date and time.",
        variant: "destructive",
      });
      return;
    }

    onDateChange(updatedDate);
  };

  if (!isOpen) return null;

  return (
    <div
      ref={calendarRef}
      className={`fixed right-1/4 top-1/3 z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-3 ${className}`}
    >
      <div className="flex flex-col">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleSelectDate}
          disabled={(date) => isDateInPast(date)}
          className="rounded-md border bg-white text-gray-900 [&_button]:text-gray-900 [&_button]:bg-white [&_button:hover]:bg-gray-100 [&_button:focus]:bg-gray-200 [&_button[aria-current='date']]:bg-gray-100 [&_button[aria-selected='true']]:bg-blue-500 [&_button[aria-selected='true']]:text-white [&_button[aria-selected='true']:hover]:bg-blue-600"
        />
        <div className="mt-3 border-t pt-3">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Select Time:
          </h4>
          <div className="flex items-center w-full gap-2">
            {/* Hour Dropdown */}
            <select
              value={inputHour}
              onChange={handleHourChange}
              className="hour-select flex-1 p-1.5 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm time-select"
              size={1}
            >
              {hourOptions.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
            <span className="text-gray-700 flex-shrink-0">:</span>
            {/* Minute Dropdown */}
            <select
              value={inputMinute}
              onChange={handleMinuteChange}
              className="minute-select flex-1 p-1.5 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm time-select"
              size={1}
            >
              {minuteOptions.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            {/* AM/PM Selector */}
            <select
              value={inputAmPm}
              onChange={handleAmPmChange}
              className="flex-1 p-1.5 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            >
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateTimePicker; 