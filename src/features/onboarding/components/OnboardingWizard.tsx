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
import { OnboardingStepCountry } from "@/features/onboarding/components/OnboardingStepCountry";
import { OnboardingStepBio } from "@/features/onboarding/components/OnboardingStepBio";
import { OnboardingStepCommunities } from "@/features/onboarding/components/OnboardingStepCommunities";
import { OnboardingStepServices } from "@/features/onboarding/components/OnboardingStepServices";
import { Button } from "@/components/ui/Button";

const STEP_SCHEMAS = [null, stepBioSchema, stepCommunitiesSchema, stepServicesSchema];

const STEP_INFO = [
  {
    title: "Where do you practice?",
    description: "We're currently available in Canada and the United States.",
  },
  {
    title: "Bio",
    description: "Tell us a bit about yourself and your practice.",
  },
  {
    title: "Communities served",
    description: "Who are your clients and what do you specialize in?",
  },
  {
    title: "Your services",
    description: "Set your rates and service options.",
  },
];

export function OnboardingWizard(): React.ReactElement {
  const router = useRouter();
  const trpc = useTRPC();
  const [currentStep, setCurrentStep] = useState(1);
  const [country, setCountry] = useState("");
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
        router.refresh();
        router.push("/referrals");
      },
      onError(error) {
        setServerError(error.message);
      },
    }),
  );

  const stepInfo = STEP_INFO[currentStep - 1]!;

  async function handleNext(): Promise<void> {
    if (currentStep === 1) {
      if (country === "US") {
        router.push(`/onboarding/waitlist?country=US`);
        return;
      }
      if (country === "CA") {
        setCurrentStep(2);
      }
      return;
    }

    const stepSchema = STEP_SCHEMAS[currentStep - 1];
    if (stepSchema) {
      const values = methods.getValues();
      const result = stepSchema.safeParse(values);
      if (!result.success) {
        const fieldNames = Object.keys(stepSchema.shape) as (keyof OnboardingFormData)[];
        for (const name of fieldNames) {
          await methods.trigger(name);
        }
        return;
      }
    }

    setCurrentStep((prev) => Math.min(prev + 1, 4));
  }

  function handleBack(): void {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  }

  async function handleComplete(): Promise<void> {
    setServerError(null);
    const valid = await methods.trigger();
    if (!valid) return;

    const data = methods.getValues();

    createProfile.mutate({
      ...data,
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
      consentCommunitiesServed: false,
      groups: [],
      faithOrientation: [],
      ethnicity: [],
      therapyStyle: [],
      therapistGender: "",
      insurers: [],
      paymentMethods: [],
    });
  }

  return (
    <>
      {/* Progress bar — outside the card */}
      <WizardProgress currentStep={currentStep} onStepClick={setCurrentStep} />

      {/* Step title + description */}
      <div className="text-center mb-6">
        <h1 className="text-[1.5rem] font-semibold tracking-[-0.015em] leading-[1.3] text-fg mb-2">
          {stepInfo.title}
        </h1>
        <p className="text-[0.875rem] leading-[1.5] text-fg-2">{stepInfo.description}</p>
      </div>

      {/* Card */}
      <div className="bg-s1 border border-border rounded-md p-6 shadow-1">
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

        {currentStep === 1 && <OnboardingStepCountry country={country} onSelect={setCountry} />}

        {currentStep > 1 && (
          <FormProvider {...methods}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (currentStep === 4) {
                  handleComplete();
                } else {
                  handleNext();
                }
              }}
              className="space-y-6"
            >
              {currentStep === 2 && <OnboardingStepBio />}
              {currentStep === 3 && <OnboardingStepCommunities />}
              {currentStep === 4 && <OnboardingStepServices />}

              {/* Navigation buttons */}
              <div className="mt-6 pt-4 border-t border-border-s flex justify-between">
                <Button variant="secondary" type="button" onClick={handleBack}>
                  Back
                </Button>
                <Button type="submit" loading={createProfile.isPending}>
                  {currentStep === 4
                    ? createProfile.isPending
                      ? "Creating profile..."
                      : "Complete"
                    : "Next"}
                </Button>
              </div>
            </form>
          </FormProvider>
        )}

        {/* Step 1 button (outside form since Country has no form fields) */}
        {currentStep === 1 && (
          <div className="border-t border-border-s pt-4">
            <Button type="button" onClick={handleNext} disabled={!country} className="w-full">
              Next
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
