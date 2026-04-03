interface PHINoticeProps {
  children?: React.ReactNode;
}

export function PHINotice({ children }: PHINoticeProps): React.ReactElement {
  return (
    <div className="p-3 rounded-sm border-l-[3px] border-l-warn bg-warn-l">
      <p className="text-[0.875rem] text-fg-2 m-0">
        <svg
          className="w-4 h-4 inline-block mr-1.5 -mt-0.5 text-warn"
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        {children ?? "Do not include client names, dates of birth, or identifying health details."}
      </p>
    </div>
  );
}
