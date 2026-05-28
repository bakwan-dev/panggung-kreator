"use client";

import React, { useState, useEffect, useRef } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  value?: string; // YYYY-MM-DD
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const MONTH_NAMES = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

const WEEKDAY_NAMES = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

export function DatePicker({
  value,
  onChange,
  placeholder = "Pilih tanggal",
  className,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<"calendar" | "year-month">("calendar");
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse initial date value
  const initialDate = value ? new Date(value) : null;
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    initialDate && !isNaN(initialDate.getTime()) ? initialDate : null
  );

  // Control which month is displayed in the calendar
  const [currentMonth, setCurrentMonth] = useState<Date>(
    selectedDate || new Date()
  );

  // Sync state if value prop changes
  useEffect(() => {
    if (value) {
      const parsed = new Date(value);
      if (!isNaN(parsed.getTime())) {
        setSelectedDate(parsed);
        setCurrentMonth(parsed);
      }
    } else {
      setSelectedDate(null);
    }
  }, [value]);

  // Handle clicking outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setView("calendar"); // reset view to calendar when closed
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  const handleDaySelect = (date: Date) => {
    setSelectedDate(date);
    const formatted = formatDateToYYYYMMDD(date);
    if (onChange) {
      onChange(formatted);
    }
    setIsOpen(false);
  };

  const handleYearSelect = (year: number) => {
    setCurrentMonth(new Date(year, currentMonth.getMonth(), 1));
    setView("calendar");
  };

  const handleMonthSelect = (monthIndex: number) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), monthIndex, 1));
    setView("calendar");
  };

  // Helper: Format to YYYY-MM-DD
  const formatDateToYYYYMMDD = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  // Helper: Format display string (e.g., "28 Mei 2026")
  const formatDisplayDate = (date: Date | null) => {
    if (!date) return "";
    const d = date.getDate();
    const m = MONTH_NAMES[date.getMonth()];
    const y = date.getFullYear();
    return `${d} ${m} ${y}`;
  };

  // Compute days grid
  const getDaysGrid = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    // Index of the first day of the month (0 = Sunday, 1 = Monday, etc.)
    const firstDayIndex = new Date(year, month, 1).getDay();

    // Number of days in current month
    const totalDays = new Date(year, month + 1, 0).getDate();

    // Number of days in previous month
    const prevTotalDays = new Date(year, month, 0).getDate();

    const cells: { date: Date; isCurrentMonth: boolean }[] = [];

    // Prev month padding
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      cells.push({
        date: new Date(year, month - 1, prevTotalDays - i),
        isCurrentMonth: false,
      });
    }

    // Current month days
    for (let i = 1; i <= totalDays; i++) {
      cells.push({
        date: new Date(year, month, i),
        isCurrentMonth: true,
      });
    }

    // Next month padding to complete grid rows
    const totalCellsNeeded = 42; // standard 6-row grid
    const nextMonthDaysToAdd = totalCellsNeeded - cells.length;
    for (let i = 1; i <= nextMonthDaysToAdd; i++) {
      cells.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
      });
    }

    return cells;
  };

  const daysGrid = getDaysGrid();

  // Generate years list (e.g., from current year back to 1930)
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 1930 + 1 },
    (_, i) => currentYear - i
  );

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (date: Date) => {
    if (!selectedDate) return false;
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* DatePicker Input Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex h-12 w-full items-center rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-[#1a1a1a] transition-all hover:border-gray-300 focus:outline-none",
          isOpen ? "ring-2 ring-gray-900 border-transparent" : "",
          className
        )}
      >
        <Calendar className="mr-3 h-5 w-5 text-gray-400 flex-shrink-0" />
        <span className={cn("flex-grow text-left", !selectedDate && "text-gray-400")}>
          {selectedDate ? formatDisplayDate(selectedDate) : placeholder}
        </span>
      </button>

      {/* Dropdown Calendar Panel */}
      {isOpen && (
        <div className="absolute left-0 mt-2 w-full max-w-[328px] rounded-2xl border border-gray-100 bg-white p-4 shadow-[0_12px_30px_rgba(0,0,0,0.06)] z-50 animate-in fade-in slide-in-from-top-2 duration-200 dark:bg-neutral-900 dark:border-neutral-800 dark:shadow-[0_12px_30px_rgba(0,0,0,0.4)]">
          {view === "calendar" ? (
            <div>
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setView("year-month")}
                  className="px-3 py-1 text-sm font-semibold text-gray-900 hover:bg-gray-50 rounded-lg transition-colors dark:text-white dark:hover:bg-neutral-800"
                >
                  {MONTH_NAMES[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </button>
                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>

              {/* Weekdays */}
              <div className="grid grid-cols-7 gap-1 mb-2 text-center text-xs font-semibold text-gray-400 dark:text-neutral-500">
                {WEEKDAY_NAMES.map((name) => (
                  <div key={name} className="py-1">
                    {name}
                  </div>
                ))}
              </div>

              {/* Days Grid */}
              <div className="grid grid-cols-7 gap-1">
                {daysGrid.map((cell, idx) => {
                  const dayIsSelected = isSelected(cell.date);
                  const dayIsToday = isToday(cell.date);

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleDaySelect(cell.date)}
                      className={cn(
                        "h-9 w-9 mx-auto flex items-center justify-center rounded-full text-sm font-medium transition-all focus:outline-none",
                        // Base colors depending on whether day belongs to current month
                        cell.isCurrentMonth
                          ? "text-gray-800 dark:text-neutral-200 hover:bg-gray-100 dark:hover:bg-neutral-800"
                          : "text-gray-300 dark:text-neutral-600 hover:bg-gray-50 dark:hover:bg-neutral-800/40",
                        // Selected state (black in light mode, white in dark mode)
                        dayIsSelected
                          ? "bg-gray-900 text-white hover:bg-gray-900 dark:bg-white dark:text-gray-900 dark:hover:bg-white"
                          : "",
                        // Today's indicator (monochrome border outline)
                        dayIsToday && !dayIsSelected
                          ? "border border-gray-900/30 dark:border-white/30 font-bold"
                          : ""
                      )}
                    >
                      {cell.date.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Month & Year Select View */
            <div className="flex flex-col h-[280px]">
              {/* Header */}
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  Pilih Bulan & Tahun
                </span>
                <button
                  type="button"
                  onClick={() => setView("calendar")}
                  className="text-xs text-gray-500 hover:underline dark:text-neutral-400"
                >
                  Kembali
                </button>
              </div>

              {/* Selection Content */}
              <div className="flex gap-4 flex-grow overflow-hidden">
                {/* Months Grid */}
                <div className="w-3/5 grid grid-cols-2 gap-1.5 overflow-y-auto pr-1">
                  {MONTH_NAMES.map((month, index) => {
                    const isCurrent = currentMonth.getMonth() === index;
                    return (
                      <button
                        key={month}
                        type="button"
                        onClick={() => handleMonthSelect(index)}
                        className={cn(
                          "py-2 px-2 text-xs font-medium rounded-lg text-left transition-colors",
                          isCurrent
                            ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                            : "text-gray-700 hover:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                        )}
                      >
                        {month}
                      </button>
                    );
                  })}
                </div>

                {/* Years Scroll List */}
                <div className="w-2/5 border-l border-gray-100 dark:border-neutral-800 pl-3 overflow-y-auto h-full scrollbar-thin">
                  <div className="flex flex-col gap-1 pr-1">
                    {years.map((year) => {
                      const isCurrent = currentMonth.getFullYear() === year;
                      return (
                        <button
                          key={year}
                          type="button"
                          onClick={() => handleYearSelect(year)}
                          className={cn(
                            "py-1.5 px-2 text-xs font-semibold rounded-md text-center transition-colors",
                            isCurrent
                              ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                              : "text-gray-700 hover:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                          )}
                        >
                          {year}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
