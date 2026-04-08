"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { FieldError } from "@/components/ui/FieldError";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { StyledLink } from "@/components/ui/StyledLink";
import { contactSchema, type ContactFormData } from "@/lib/validations/contact";
import { submitContactForm } from "@/features/contact/actions";

export function ContactForm(): React.ReactElement {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  async function onSubmit(data: ContactFormData): Promise<void> {
    setServerError(null);
    setLoading(true);

    try {
      const result = await submitContactForm(data);
      if (result.success) {
        setSubmitted(true);
      } else {
        setServerError(result.error ?? "Something went wrong");
      }
    } catch {
      setServerError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-8">
        <svg
          className="w-12 h-12 mx-auto mb-4 text-ok"
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h2 className="text-[1.25rem] font-semibold text-fg mb-2">Message sent!</h2>
        <p className="text-[0.875rem] text-fg-3 mb-6">
          Thanks for reaching out. We&apos;ll get back to you as soon as we can.
        </p>
        <StyledLink href="/account/settings">Back to settings</StyledLink>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {serverError && (
        <div className="mb-6">
          <ErrorBanner title={serverError} />
        </div>
      )}

      <div className="space-y-5">
        {/* Subject */}
        <div>
          <Label htmlFor="subject">Subject</Label>
          <Input
            id="subject"
            type="text"
            maxLength={150}
            placeholder="Brief summary of your message"
            error={!!errors.subject}
            {...register("subject")}
          />
          <FieldError message={errors.subject?.message} />
        </div>

        {/* Message */}
        <div>
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            maxLength={2000}
            placeholder="Tell us more..."
            error={!!errors.message}
            {...register("message")}
          />
          <FieldError message={errors.message?.message} />
        </div>
      </div>

      <div className="mt-8">
        <Button type="submit" loading={loading}>
          Send message
        </Button>
      </div>
    </form>
  );
}
