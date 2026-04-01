"use client";

const STEPS = [
  { label: "Bio", number: 1 },
  { label: "Communities served", number: 2 },
  { label: "Your services", number: 3 },
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
    <nav aria-label="Onboarding progress" className="mb-8">
      <ol className="flex items-center gap-2">
        {STEPS.map((step, index) => {
          const isCompleted = currentStep > step.number;
          const isCurrent = currentStep === step.number;

          return (
            <li key={step.number} className="flex items-center gap-2 flex-1">
              <button
                type="button"
                onClick={() => isCompleted && onStepClick(step.number)}
                disabled={!isCompleted}
                aria-current={isCurrent ? "step" : undefined}
                className={`flex items-center gap-2 text-[0.8125rem] font-medium transition-colors duration-150 ${
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
                        : "bg-inset text-fg-4 border border-border"
                  }`}
                >
                  {isCompleted ? "✓" : step.number}
                </span>
                <span className="hidden sm:inline">{step.label}</span>
              </button>
              {index < STEPS.length - 1 && (
                <div className={`flex-1 h-px ${isCompleted ? "bg-brand" : "bg-border"}`} />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
