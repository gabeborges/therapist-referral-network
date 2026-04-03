"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";

export interface AutocompleteOption {
  id: string;
  name: string;
  category?: string | null;
}

interface AutocompleteSelectProps {
  label: string;
  optional?: boolean;
  options: AutocompleteOption[];
  selected: AutocompleteOption[];
  onChange: (selected: AutocompleteOption[]) => void;
  placeholder?: string;
  error?: string;
  helperText?: string;
  maxItems?: number;
  ranked?: boolean;
  loading?: boolean;
}

export function AutocompleteSelect({
  label,
  optional = false,
  options,
  selected,
  onChange,
  placeholder = "Type to search...",
  error,
  helperText,
  maxItems,
  ranked = false,
  loading = false,
}: AutocompleteSelectProps): React.ReactElement {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const componentId = label.toLowerCase().replace(/\s+/g, "-");
  const labelId = `${componentId}-label`;
  const inputId = `${componentId}-input`;
  const listboxId = `${componentId}-listbox`;

  const selectedIds = useMemo(() => new Set(selected.map((s) => s.id)), [selected]);

  const filtered = useMemo(() => {
    const available = options.filter((opt) => !selectedIds.has(opt.id));
    if (!query.trim()) return available;
    const q = query.toLowerCase();
    return available.filter((opt) => opt.name.toLowerCase().includes(q));
  }, [options, selectedIds, query]);

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

  function handleAdd(option: AutocompleteOption): void {
    if (maxItems && selected.length >= maxItems) return;
    onChange([...selected, option]);
    setQuery("");
    setIsOpen(false);
    setFocusedIndex(-1);
    inputRef.current?.focus();
  }

  function handleRemove(id: string): void {
    onChange(selected.filter((s) => s.id !== id));
  }

  function handleMoveUp(index: number): void {
    if (index <= 0) return;
    const next = [...selected];
    const temp = next[index - 1]!;
    next[index - 1] = next[index]!;
    next[index] = temp;
    onChange(next);
  }

  function handleMoveDown(index: number): void {
    if (index >= selected.length - 1) return;
    const next = [...selected];
    const temp = next[index]!;
    next[index] = next[index + 1]!;
    next[index + 1] = temp;
    onChange(next);
  }

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent): void => {
      if (!isOpen && event.key === "ArrowDown") {
        event.preventDefault();
        setIsOpen(true);
        setFocusedIndex(0);
        return;
      }
      if (!isOpen) return;

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          setFocusedIndex((prev) => {
            const next = prev < filtered.length - 1 ? prev + 1 : 0;
            optionRefs.current[next]?.scrollIntoView({ block: "nearest" });
            return next;
          });
          break;
        case "ArrowUp":
          event.preventDefault();
          setFocusedIndex((prev) => {
            const next = prev > 0 ? prev - 1 : filtered.length - 1;
            optionRefs.current[next]?.scrollIntoView({ block: "nearest" });
            return next;
          });
          break;
        case "Enter":
          event.preventDefault();
          if (focusedIndex >= 0 && focusedIndex < filtered.length) {
            const option = filtered[focusedIndex];
            if (option) handleAdd(option);
          }
          break;
        case "Escape":
          event.preventDefault();
          setIsOpen(false);
          setFocusedIndex(-1);
          break;
        case "Backspace":
          if (!query && selected.length > 0) {
            handleRemove(selected[selected.length - 1]!.id);
          }
          break;
      }
    },
    [isOpen, filtered, focusedIndex, query, selected],
  );

  const atMax = maxItems !== undefined && selected.length >= maxItems;

  return (
    <div ref={containerRef} className="relative">
      <label
        id={labelId}
        htmlFor={inputId}
        className="block mb-2 text-[0.8125rem] font-medium tracking-[0.01em] text-fg-2"
      >
        {label}
        {optional && <span className="font-normal text-fg-4"> (optional)</span>}
        {maxItems && (
          <span className="ml-1 font-normal text-fg-4">
            ({selected.length}/{maxItems})
          </span>
        )}
      </label>

      {/* Selected chips */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2" aria-live="polite">
          {selected.map((item, index) => (
            <span
              key={item.id}
              className="inline-flex items-center gap-1 h-7 px-2.5 bg-brand-l text-brand rounded-full text-[0.8125rem] font-medium whitespace-nowrap"
            >
              {ranked && <span className="text-fg-4 mr-0.5">{index + 1}.</span>}
              {item.name}
              {ranked && index > 0 && (
                <button
                  type="button"
                  onClick={() => handleMoveUp(index)}
                  className="bg-transparent border-none text-inherit cursor-pointer p-0 opacity-40 hover:opacity-100 text-xs"
                  aria-label={`Move ${item.name} up`}
                >
                  ↑
                </button>
              )}
              {ranked && index < selected.length - 1 && (
                <button
                  type="button"
                  onClick={() => handleMoveDown(index)}
                  className="bg-transparent border-none text-inherit cursor-pointer p-0 opacity-40 hover:opacity-100 text-xs"
                  aria-label={`Move ${item.name} down`}
                >
                  ↓
                </button>
              )}
              <button
                type="button"
                onClick={() => handleRemove(item.id)}
                className="bg-transparent border-none text-inherit cursor-pointer p-0 ml-0.5 opacity-60 hover:opacity-100 w-3.5 h-3.5 inline-flex items-center justify-center"
                aria-label={`Remove ${item.name}`}
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

      {/* Search input */}
      <input
        ref={inputRef}
        id={inputId}
        type="text"
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={isOpen ? listboxId : undefined}
        aria-labelledby={labelId}
        aria-activedescendant={
          focusedIndex >= 0 ? `${componentId}-option-${focusedIndex}` : undefined
        }
        value={query}
        disabled={atMax}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
          setFocusedIndex(-1);
        }}
        onFocus={() => !atMax && setIsOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder={atMax ? `Maximum ${maxItems} selected` : placeholder}
        className={`w-full h-11 px-3 bg-inset text-[0.9375rem] font-sans border rounded-sm transition-[border-color,background,box-shadow] duration-150 ease-out ${
          atMax ? "opacity-50 cursor-not-allowed" : ""
        } ${
          error
            ? "border-err"
            : "border-border focus:border-border-f focus:bg-bg focus:outline-2 focus:outline-border-f focus:outline-offset-2"
        }`}
      />

      {/* Dropdown list */}
      {isOpen && !atMax && (
        <div
          ref={listRef}
          role="listbox"
          id={listboxId}
          aria-labelledby={labelId}
          className="absolute z-10 w-full mt-1 bg-s2 border border-border rounded-md shadow-2 max-h-72 overflow-y-auto"
        >
          {loading ? (
            <div className="px-3 py-2 text-[0.875rem] text-fg-4">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="px-3 py-2 text-[0.875rem] text-fg-4">
              {query ? "No matches found" : "No options available"}
            </div>
          ) : (
            filtered.map((option, index) => (
              <button
                key={option.id}
                ref={(el) => {
                  optionRefs.current[index] = el;
                }}
                id={`${componentId}-option-${index}`}
                type="button"
                role="option"
                aria-selected={focusedIndex === index}
                onClick={() => handleAdd(option)}
                className={`w-full px-3 py-2 text-left text-[0.9375rem] text-fg cursor-pointer border-none bg-transparent font-sans transition-colors duration-150 ${
                  focusedIndex === index ? "bg-s1" : "hover:bg-s1"
                }`}
              >
                {option.name}
                {option.category && (
                  <span className="ml-2 text-[0.75rem] text-fg-4">{option.category}</span>
                )}
              </button>
            ))
          )}
        </div>
      )}

      {error && <p className="mt-1 text-[0.75rem] text-err">{error}</p>}
      {helperText && !error && (
        <p className="mt-1 text-[0.75rem] italic text-fg-3 tracking-[0.015em]">{helperText}</p>
      )}
    </div>
  );
}
