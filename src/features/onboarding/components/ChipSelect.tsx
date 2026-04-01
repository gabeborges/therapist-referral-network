"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface ChipSelectProps {
  label: string;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  error?: string;
  helperText?: string;
}

export function ChipSelect({
  label,
  options,
  selected,
  onChange,
  placeholder = "Select...",
  error,
  helperText,
}: ChipSelectProps): React.ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const chipId = label.toLowerCase().replace(/\s+/g, "-");
  const labelId = `${chipId}-label`;
  const triggerId = `${chipId}-trigger`;
  const listboxId = `${chipId}-listbox`;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent): void {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleRemove(value: string): void {
    onChange(selected.filter((v) => v !== value));
  }

  function handleAdd(value: string): void {
    if (!selected.includes(value)) {
      onChange([...selected, value]);
    }
    setIsOpen(false);
    setFocusedIndex(-1);
  }

  const availableOptions = options.filter((opt) => !selected.includes(opt));

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent): void => {
      if (!isOpen) {
        if (event.key === "ArrowDown" || event.key === "Enter") {
          event.preventDefault();
          setIsOpen(true);
          setFocusedIndex(0);
        }
        return;
      }
      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          setFocusedIndex((prev) => {
            const next = prev < availableOptions.length - 1 ? prev + 1 : 0;
            optionRefs.current[next]?.focus();
            return next;
          });
          break;
        case "ArrowUp":
          event.preventDefault();
          setFocusedIndex((prev) => {
            const next = prev > 0 ? prev - 1 : availableOptions.length - 1;
            optionRefs.current[next]?.focus();
            return next;
          });
          break;
        case "Enter":
          event.preventDefault();
          if (focusedIndex >= 0 && focusedIndex < availableOptions.length) {
            const option = availableOptions[focusedIndex];
            if (option !== undefined) {
              handleAdd(option);
            }
          }
          break;
        case "Escape":
          event.preventDefault();
          setIsOpen(false);
          setFocusedIndex(-1);
          break;
      }
    },
    [isOpen, availableOptions, focusedIndex],
  );

  return (
    <div ref={containerRef} className="relative">
      <label
        id={labelId}
        className="block mb-2 text-[0.8125rem] font-medium tracking-[0.01em] text-fg-2"
      >
        {label}
      </label>

      {/* Selected chips */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2" aria-live="polite">
          {selected.map((value) => (
            <span
              key={value}
              className="inline-flex items-center gap-1 h-7 px-2.5 bg-brand-l text-brand rounded-full text-[0.8125rem] font-medium whitespace-nowrap"
            >
              {value}
              <button
                type="button"
                onClick={() => handleRemove(value)}
                className="bg-transparent border-none text-inherit cursor-pointer p-0 ml-0.5 opacity-60 hover:opacity-100 w-3.5 h-3.5 inline-flex items-center justify-center"
                aria-label={`Remove ${value}`}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={3}
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Dropdown trigger */}
      <button
        type="button"
        id={triggerId}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-labelledby={labelId}
        aria-controls={isOpen ? listboxId : undefined}
        className={`w-full h-11 px-3 bg-inset text-left border rounded-sm text-[0.9375rem] font-sans cursor-pointer transition-[border-color,background,box-shadow] duration-150 ease-out pr-9 appearance-none ${
          error
            ? "border-err"
            : "border-border focus:border-border-f focus:bg-bg focus:outline-2 focus:outline-border-f focus:outline-offset-2"
        }`}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%238F8279' viewBox='0 0 24 24'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 12px center",
        }}
      >
        <span className={selected.length > 0 ? "text-fg" : "text-fg-4"}>
          {selected.length > 0 ? `${selected.length} selected` : placeholder}
        </span>
      </button>

      {/* Dropdown list */}
      {isOpen && availableOptions.length > 0 && (
        <div
          role="listbox"
          id={listboxId}
          aria-labelledby={labelId}
          onKeyDown={handleKeyDown}
          className="absolute z-10 w-full mt-1 bg-s2 border border-border rounded-md shadow-2 max-h-48 overflow-y-auto"
        >
          {availableOptions.map((option, index) => (
            <button
              key={option}
              ref={(el) => {
                optionRefs.current[index] = el;
              }}
              type="button"
              role="option"
              aria-selected={false}
              onClick={() => handleAdd(option)}
              className="w-full px-3 py-2 text-left text-[0.9375rem] text-fg hover:bg-s1 cursor-pointer border-none bg-transparent font-sans transition-colors duration-150"
            >
              {option}
            </button>
          ))}
        </div>
      )}

      {error && <p className="mt-1 text-[0.75rem] text-err">{error}</p>}
      {helperText && !error && (
        <p className="mt-1 text-[0.75rem] italic text-fg-3 tracking-[0.015em]">{helperText}</p>
      )}
    </div>
  );
}
