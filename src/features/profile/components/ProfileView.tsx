import Link from "next/link";
import type { TherapistProfile, User } from "@/generated/prisma/client";
import { AvailabilityToggle } from "@/features/profile/components/AvailabilityToggle";

interface ProfileViewProps {
  profile: TherapistProfile & { user: Pick<User, "email"> };
}

function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

function calculateCompleteness(profile: TherapistProfile): number {
  const fields = [
    profile.firstName,
    profile.lastName,
    profile.displayName,
    profile.bio,
    profile.city,
    profile.province,
    profile.specialties.length > 0,
    profile.modalities.length > 0,
    profile.therapeuticApproach.length > 0,
    profile.languages.length > 0,
    profile.ageGroups.length > 0,
    profile.hourlyRate !== null,
  ];

  const filled = fields.filter(Boolean).length;
  return Math.round((filled / fields.length) * 100);
}

export function ProfileView({ profile }: ProfileViewProps): React.ReactElement {
  const initials = getInitials(profile.firstName, profile.lastName);
  const completeness = calculateCompleteness(profile);

  return (
    <div className="px-4 sm:px-6 pt-12">
      <div className="max-w-[720px] mx-auto">
        {/* Profile Header */}
        <div className="bg-s1 border border-border rounded-md p-6 shadow-1 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold shrink-0 bg-brand-l text-brand">
              {initials}
            </div>
            <div className="flex-1">
              <h1 className="text-[1.5rem] font-semibold tracking-[-0.015em] leading-[1.3] text-fg mb-1">
                {profile.displayName}
              </h1>
              <p className="text-[0.875rem] leading-[1.5] text-fg-2 mb-1">
                {profile.firstName} {profile.lastName}
              </p>
              <p className="text-[0.75rem] tracking-[0.015em] text-fg-3">
                {profile.user.email}
              </p>
            </div>
            <Link
              href="/profile/edit"
              className="inline-flex items-center justify-center gap-2 h-9 px-4 bg-transparent text-fg-2 border border-border rounded-sm text-[0.8125rem] font-medium tracking-[0.01em] cursor-pointer transition-all duration-150 ease-out hover:border-border-e hover:text-fg no-underline"
            >
              Edit Profile
            </Link>
          </div>

          {/* Availability Toggle */}
          <AvailabilityToggle initialValue={profile.acceptingClients} />

          {/* Profile Completeness */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[0.75rem] tracking-[0.015em] text-fg-3">
                Profile completeness
              </p>
              <p className="text-[0.75rem] tracking-[0.015em] text-fg-3 font-medium text-brand">
                {completeness}%
              </p>
            </div>
            <div className="h-1.5 rounded-full bg-inset overflow-hidden">
              <div
                className="h-full rounded-full bg-brand transition-[width] duration-300 ease-out"
                style={{ width: `${completeness}%` }}
              />
            </div>
          </div>
        </div>

        {/* Matching Information */}
        <div className="bg-s1 border border-border rounded-md p-6 shadow-1 mb-6">
          <h2 className="text-[1.25rem] font-semibold tracking-[-0.01em] leading-[1.35] text-fg mb-4">
            Matching Information
          </h2>

          {/* Specialties */}
          {profile.specialties.length > 0 && (
            <div className="mb-4">
              <p className="text-[0.8125rem] font-medium tracking-[0.01em] text-fg-2 mb-2">
                Specialties
              </p>
              <div className="flex flex-wrap gap-2">
                {profile.specialties.map((specialty) => (
                  <span
                    key={specialty}
                    className="inline-flex items-center h-7 px-2.5 bg-brand-l text-brand rounded-full text-[0.8125rem] font-medium whitespace-nowrap"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Insurance */}
          {profile.insurers.length > 0 && (
            <div className="mb-4">
              <p className="text-[0.8125rem] font-medium tracking-[0.01em] text-fg-2 mb-2">
                Insurance Accepted
              </p>
              <div className="flex flex-wrap gap-2">
                {profile.insurers.map((insurer) => (
                  <span
                    key={insurer}
                    className="inline-flex items-center h-7 px-2.5 bg-inset text-fg-2 rounded-full text-[0.8125rem] font-medium whitespace-nowrap"
                  >
                    {insurer}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Therapeutic Approaches */}
          {profile.therapeuticApproach.length > 0 && (
            <div className="mb-4">
              <p className="text-[0.8125rem] font-medium tracking-[0.01em] text-fg-2 mb-2">
                Therapeutic Approaches
              </p>
              <div className="flex flex-wrap gap-2">
                {profile.therapeuticApproach.map((approach) => (
                  <span
                    key={approach}
                    className="inline-flex items-center h-7 px-2.5 bg-brand-l text-brand rounded-full text-[0.8125rem] font-medium whitespace-nowrap"
                  >
                    {approach}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Location */}
          <div>
            <p className="text-[0.8125rem] font-medium tracking-[0.01em] text-fg-2 mb-2">
              Location
            </p>
            <p className="text-[0.9375rem] leading-[1.5] text-fg">
              {profile.city}, {profile.province}
            </p>
            {profile.modalities.some(
              (m) => m.toLowerCase() === "virtual",
            ) && (
              <p className="text-[0.75rem] tracking-[0.015em] text-fg-3 mt-1">
                Also available virtually
              </p>
            )}
          </div>
        </div>

        {/* About */}
        <div className="bg-s1 border border-border rounded-md p-6 shadow-1">
          <h2 className="text-[1.25rem] font-semibold tracking-[-0.01em] leading-[1.35] text-fg mb-4">
            About
          </h2>
          {profile.bio ? (
            <p className="text-[0.9375rem] leading-[1.5] text-fg-2 whitespace-pre-line">
              {profile.bio}
            </p>
          ) : (
            <p className="text-[0.9375rem] leading-[1.5] text-fg-3 italic">
              No bio added yet. Edit your profile to add one.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
