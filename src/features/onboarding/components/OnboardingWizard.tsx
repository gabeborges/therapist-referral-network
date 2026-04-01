"use client";

import { useState, useRef, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTRPC } from "@/lib/trpc/client";
import { useMutation } from "@tanstack/react-query";
import {
  onboardingSchema,
  stepBioSchema,
  stepCommunitiesSchema,
  stepServicesSchema,
  type OnboardingFormData,
} from "@/lib/validations/onboarding";
import { WizardProgress } from "@/features/onboarding/components/WizardProgress";
import { OnboardingStepBio } from "@/features/onboarding/components/OnboardingStepBio";
import { OnboardingStepCommunities } from "@/features/onboarding/components/OnboardingStepCommunities";
import { OnboardingStepServices } from "@/features/onboarding/components/OnboardingStepServices";

const STEP_SCHEMAS = [stepBioSchema, stepCommunitiesSchema, stepServicesSchema];

interface OnboardingWizardProps {
  onBack?: () => void;
}

export function OnboardingWizard({ onBack }: OnboardingWizardProps): React.ReactElement {
  const router = useRouter();
  const trpc = useTRPC();
  const [currentStep, setCurrentStep] = useState(1);
  const [serverError, setServerError] = useState<string | null>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (serverError) errorRef.current?.focus();
  }, [serverError]);

  const methods = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      imageUrl: "",
      firstName: "",
      middleName: "",
      lastName: "",
      pronouns: "",
      displayName: "",
      contactEmail: "",
      city: "",
      province: "",
      specialties: [],
      participants: [],
      ages: [],
      modalities: [],
      rateIndividual: undefined,
      rateGroup: undefined,
      rateFamily: undefined,
      rateCouples: undefined,
      acceptsInsurance: false,
      reducedFees: false,
      proBono: false,
      freeConsultation: false,
      acceptingClients: true,
    },
  });

  const createProfile = useMutation(
    trpc.therapist.createProfile.mutationOptions({
      onSuccess() {
        router.push("/referrals");
      },
      onError(error) {
        setServerError(error.message);
      },
    }),
  );

  async function handleNext(): Promise<void> {
    const stepSchema = STEP_SCHEMAS[currentStep - 1]!;
    const values = methods.getValues();

    // Validate only the current step's fields
    const result = stepSchema.safeParse(values);
    if (!result.success) {
      // Trigger validation on the form to show errors
      const fieldNames = Object.keys(stepSchema.shape) as (keyof OnboardingFormData)[];
      for (const name of fieldNames) {
        await methods.trigger(name);
      }
      return;
    }

    setCurrentStep((prev) => Math.min(prev + 1, 3));
  }

  function handleBack(): void {
    if (currentStep === 1 && onBack) {
      onBack();
    } else {
      setCurrentStep((prev) => Math.max(prev - 1, 1));
    }
  }

  async function handleComplete(): Promise<void> {
    setServerError(null);
    const valid = await methods.trigger();
    if (!valid) return;

    const data = methods.getValues();

    // Build full profile data with defaults for fields not in onboarding
    createProfile.mutate({
      ...data,
      // Fields not in onboarding — set defaults for the full profile schema
      displayName: data.displayName || `${data.firstName} ${data.lastName}`.trim(),
      bio: "",
      primaryCredential: "",
      credentials: [],
      websiteUrl: "",
      psychologyTodayUrl: "",
      licensingLevel: "",
      country: "CA" as const,
      therapeuticApproach: [],
      languages: [],
      topSpecialties: [],
      groups: [],
      faithOrientation: [],
      ethnicity: [],
      therapyStyle: [],
      therapistGender: "",
      insurers: [],
      paymentMethods: [],
      // reducedFees, acceptsInsurance, proBono, freeConsultation come from form data
    });
  }

  return (
    <div className="bg-s1 border border-border rounded-md p-6 shadow-1">
      <h2 className="text-[1.25rem] font-semibold tracking-[-0.01em] leading-[1.35] text-fg mb-4">
        Complete your profile
      </h2>

      <WizardProgress currentStep={currentStep} onStepClick={setCurrentStep} />

      {serverError && (
        <div
          ref={errorRef}
          role="alert"
          tabIndex={-1}
          className="p-4 rounded-md border border-err/20 bg-err-l flex gap-3 items-start mb-6"
        >
          <svg
            aria-hidden="true"
            className="w-5 h-5 shrink-0 mt-0.5 text-err"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <p className="text-[0.9375rem] font-medium text-err">{serverError}</p>
        </div>
      )}

      <FormProvider {...methods}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (currentStep === 3) {
              handleComplete();
            } else {
              handleNext();
            }
          }}
          className="space-y-6"
        >
          {currentStep === 1 && <OnboardingStepBio />}
          {currentStep === 2 && <OnboardingStepCommunities />}
          {currentStep === 3 && <OnboardingStepServices />}

          {/* Navigation buttons */}
          <div className="pt-4 border-t border-border-s flex justify-between gap-3">
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center justify-center h-11 px-6 bg-transparent text-fg border border-border rounded-sm text-[0.8125rem] font-semibold tracking-[0.01em] cursor-pointer transition-colors duration-150 font-sans hover:bg-inset focus-visible:outline-2 focus-visible:outline-border-f focus-visible:outline-offset-2"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={createProfile.isPending}
              className="inline-flex items-center justify-center h-11 px-6 bg-brand text-brand-on border-none rounded-sm text-[0.8125rem] font-semibold tracking-[0.01em] cursor-pointer transition-[background] duration-150 ease-out font-sans hover:bg-brand-h focus-visible:outline-2 focus-visible:outline-border-f focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentStep === 3
                ? createProfile.isPending
                  ? "Creating profile..."
                  : "Complete"
                : "Next"}
            </button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
