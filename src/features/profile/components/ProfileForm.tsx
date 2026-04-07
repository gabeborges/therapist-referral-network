"use client";

import { useForm, FormProvider, Controller, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect, useMemo } from "react";
import { useTRPC } from "@/lib/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  therapistProfileSchema,
  type TherapistProfileFormData,
} from "@/lib/validations/therapist-profile";
import type { AutocompleteOption } from "@/features/onboarding/components/AutocompleteSelect";
import { ProfileSectionBio } from "@/features/profile/components/ProfileSectionBio";
import { ProfileSectionQualifications } from "@/features/profile/components/ProfileSectionQualifications";
import { ProfileSectionPractice } from "@/features/profile/components/ProfileSectionPractice";
import { ProfileSectionCommunities } from "@/features/profile/components/ProfileSectionCommunities";
import { ProfileSectionFinances } from "@/features/profile/components/ProfileSectionFinances";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";

interface ProfileFormProps {
  defaultValues: TherapistProfileFormData;
}

export function ProfileForm({ defaultValues }: ProfileFormProps): React.ReactElement {
  const router = useRouter();
  const trpc = useTRPC();
  const [serverError, setServerError] = useState<string | null>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (serverError) errorRef.current?.focus();
  }, [serverError]);

  // Taxonomy queries
  const { data: specialtiesData, isLoading: specialtiesLoading } = useQuery(
    trpc.taxonomy.getSpecialties.queryOptions(),
  );
  const { data: therapyTypesData, isLoading: therapyTypesLoading } = useQuery(
    trpc.taxonomy.getTherapyTypes.queryOptions(),
  );
  const { data: languagesData, isLoading: languagesLoading } = useQuery(
    trpc.taxonomy.getLanguages.queryOptions(),
  );
  const { data: alliedGroupsData, isLoading: alliedGroupsLoading } = useQuery(
    trpc.taxonomy.getAlliedGroups.queryOptions(),
  );

  const specialtyOptions: AutocompleteOption[] = useMemo(
    () =>
      (specialtiesData ?? []).map((s) => ({
        id: s.id,
        name: s.name,
        category: s.category,
      })),
    [specialtiesData],
  );

  const therapyTypeOptions: AutocompleteOption[] = useMemo(
    () => (therapyTypesData ?? []).map((t) => ({ id: t.id, name: t.name })),
    [therapyTypesData],
  );

  const languageOptions: AutocompleteOption[] = useMemo(
    () => (languagesData ?? []).map((l) => ({ id: l.id, name: l.name })),
    [languagesData],
  );

  const alliedGroupOptions: AutocompleteOption[] = useMemo(
    () => (alliedGroupsData ?? []).map((g) => ({ id: g.id, name: g.name })),
    [alliedGroupsData],
  );

  const methods = useForm<TherapistProfileFormData>({
    resolver: zodResolver(therapistProfileSchema) as Resolver<TherapistProfileFormData>,
    defaultValues,
  });

  const updateProfile = useMutation(
    trpc.therapist.updateProfile.mutationOptions({
      onSuccess() {
        router.refresh();
        router.push("/profile");
      },
      onError(error) {
        setServerError(error.message);
      },
    }),
  );

  function onSubmit(data: TherapistProfileFormData): void {
    setServerError(null);
    updateProfile.mutate(data);
  }

  function handleCancel(): void {
    router.push("/profile");
  }

  const isLoadingTaxonomies =
    specialtiesLoading || therapyTypesLoading || languagesLoading || alliedGroupsLoading;

  if (isLoadingTaxonomies) {
    return (
      <div className="px-4 sm:px-6 pt-12 pb-24">
        <div className="max-w-[720px] mx-auto">
          <div className="bg-s1 border border-border rounded-md p-6 shadow-1 flex flex-col items-center gap-2">
            <Spinner variant="brand" size={24} />
            <p className="text-fg-3 text-[0.875rem]">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 pt-12 pb-24">
      <div className="max-w-[720px] mx-auto">
        <div className="bg-s1 border border-border rounded-md p-6 shadow-1">
          <h2 className="text-[1.25rem] font-semibold tracking-[-0.01em] leading-[1.35] text-fg mb-4">
            Edit profile
          </h2>

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
            <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8">
              <ProfileSectionBio />
              <ProfileSectionQualifications />
              <ProfileSectionPractice
                specialtyOptions={specialtyOptions}
                therapyTypeOptions={therapyTypeOptions}
                specialtiesLoading={specialtiesLoading}
                therapyTypesLoading={therapyTypesLoading}
              />
              <ProfileSectionCommunities
                languageOptions={languageOptions}
                alliedGroupOptions={alliedGroupOptions}
                languagesLoading={languagesLoading}
                alliedGroupsLoading={alliedGroupsLoading}
              />
              <ProfileSectionFinances />

              {/* Communities served consent — gates public display and referral matching, not data entry */}
              <div className="pt-4 border-t border-border-s">
                <Controller
                  name="consentCommunitiesServed"
                  control={methods.control}
                  render={({ field }) => (
                    <label className="flex items-start gap-3 cursor-pointer select-none hover:[&>.cb-box]:border-border-e hover:[&>.cb-box]:bg-bg hover:[&_input:checked+.cb-box]:bg-brand-h hover:[&_input:checked+.cb-box]:border-brand-h">
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        className="sr-only peer"
                      />
                      <span className="cb-box mt-0.5 w-[18px] h-[18px] shrink-0 rounded-[4px] border border-border bg-inset inline-flex items-center justify-center transition-[background,border-color,box-shadow] duration-150 ease-out peer-checked:bg-brand peer-checked:border-brand peer-checked:[&>svg]:opacity-100 peer-checked:[&>svg]:scale-100 peer-focus-visible:outline-2 peer-focus-visible:outline-border-f peer-focus-visible:outline-offset-2">
                        <svg
                          className="w-3 h-3 opacity-0 scale-[0.6] transition-[opacity,transform] duration-150 ease-out"
                          viewBox="0 0 12 12"
                          fill="none"
                          stroke="white"
                          strokeWidth={3}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <polyline points="2.5,6 5,8.5 9.5,3.5" />
                        </svg>
                      </span>
                      <span className="text-[0.8125rem] leading-[1.5] text-fg-2">
                        I consent to displaying the faith orientation and ethnicity communities I
                        serve on my public profile and using them for referral matching. I can
                        withdraw this consent at any time from my profile settings.
                      </span>
                    </label>
                  )}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  type="button"
                  onClick={handleCancel}
                  disabled={updateProfile.isPending}
                >
                  Cancel
                </Button>
                <Button type="submit" loading={updateProfile.isPending} className="flex-1">
                  {updateProfile.isPending ? "Saving..." : "Save changes"}
                </Button>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
}
