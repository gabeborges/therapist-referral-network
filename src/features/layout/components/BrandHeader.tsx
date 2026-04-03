export function BrandHeader(): React.ReactElement {
  return (
    <div className="text-center mb-8">
      <span className="font-semibold text-sm inline-flex items-center gap-2 text-fg">
        <svg width="26" height="26" viewBox="0 0 48 48" className="text-brand">
          <circle cx="24" cy="24" r="21" fill="none" stroke="currentColor" strokeWidth="3.5" />
          <circle cx="24" cy="24" r="16" fill="none" stroke="currentColor" strokeWidth="3.5" />
          <circle cx="24" cy="24" r="11" fill="none" stroke="currentColor" strokeWidth="3.5" />
          <circle cx="24" cy="24" r="6" fill="none" stroke="currentColor" strokeWidth="3.5" />
        </svg>
        Therapist Referral Network
      </span>
    </div>
  );
}
