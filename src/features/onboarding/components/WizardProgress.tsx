"use client";

const STEPS = [
  { label: "Country", number: 1 },
  { label: "Bio", number: 2 },
  { label: "Communities", number: 3 },
  { label: "Services", number: 4 },
] as const;

interface WizardProgressProps {
  currentStep: number;
  onStepClick: (step: number) => void;
}

export function WizardProgress({
  currentStep,
  onStepClick,
}: WizardProgressProps): React.ReactElement {
  return (
    <nav aria-label="Onboarding progress" className="mb-6">
      <ol className="flex items-center justify-center gap-0 flex-wrap">
        {STEPS.map((step, index) => {
          const isCompleted = currentStep > step.number;
          const isCurrent = currentStep === step.number;

          return (
            <li key={step.number} className="flex items-center shrink-0">
              <button
                type="button"
                onClick={() => isCompleted && onStepClick(step.number)}
                disabled={!isCompleted}
                aria-current={isCurrent ? "step" : undefined}
                className={`flex items-center gap-2 text-[0.75rem] font-medium transition-colors duration-150 ${
                  isCompleted
                    ? "text-brand cursor-pointer hover:underline"
                    : isCurrent
                      ? "text-fg"
                      : "text-fg-4 cursor-default"
                }`}
              >
                <span
                  className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-[0.75rem] font-semibold shrink-0 ${
                    isCompleted
                      ? "bg-brand text-white"
                      : isCurrent
                        ? "bg-fg text-bg"
                        : "bg-transparent text-fg-4 border border-border"
                  }`}
                >
                  {isCompleted ? "✓" : step.number}
                </span>
                <span className="hidden sm:inline">{step.label}</span>
              </button>
              {index < STEPS.length - 1 && (
                <span className="mx-2 text-fg-4 text-[0.75rem] select-none" aria-hidden="true">
                  ›
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
