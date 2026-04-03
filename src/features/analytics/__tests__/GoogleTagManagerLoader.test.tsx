import { describe, expect, it, vi, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import { GoogleTagManagerLoader } from "../components/GoogleTagManagerLoader";

const mockUseConsent = vi.fn();

vi.mock("@/lib/consent/ConsentProvider", () => ({
  useConsent: () => mockUseConsent(),
}));

vi.mock("@next/third-parties/google", () => ({
  GoogleTagManager: ({ gtmId }: { gtmId: string }) => <div data-testid="gtm" data-gtm-id={gtmId} />,
}));

function makeConsent(
  overrides: {
    analytics?: boolean;
    sessionRecording?: boolean;
    isReady?: boolean;
    hasConsented?: boolean;
  } = {},
) {
  const {
    analytics = false,
    sessionRecording = false,
    isReady = true,
    hasConsented = true,
  } = overrides;
  return {
    preferences: {
      essential: true as const,
      analytics,
      sessionRecording,
      updatedAt: new Date().toISOString(),
    },
    hasConsented,
    isReady,
    updatePreferences: vi.fn(),
  };
}

describe("GoogleTagManagerLoader", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    window.gtag = vi.fn();
  });

  it("renders nothing when consent is not ready", () => {
    mockUseConsent.mockReturnValue(makeConsent({ isReady: false }));
    const { container } = render(<GoogleTagManagerLoader gtmId="GTM-TEST" />);
    expect(container.innerHTML).toBe("");
  });

  it("renders nothing when preferences are null (first visit)", () => {
    mockUseConsent.mockReturnValue({
      preferences: null,
      hasConsented: false,
      isReady: true,
      updatePreferences: vi.fn(),
    });
    const { container } = render(<GoogleTagManagerLoader gtmId="GTM-TEST" />);
    expect(container.innerHTML).toBe("");
  });

  it("renders nothing when analytics consent is denied", () => {
    mockUseConsent.mockReturnValue(makeConsent({ analytics: false }));
    const { container } = render(<GoogleTagManagerLoader gtmId="GTM-TEST" />);
    expect(container.innerHTML).toBe("");
  });

  it("renders nothing when gtmId is empty", () => {
    mockUseConsent.mockReturnValue(makeConsent({ analytics: true }));
    const { container } = render(<GoogleTagManagerLoader gtmId="" />);
    expect(container.innerHTML).toBe("");
  });

  it("renders GoogleTagManager when analytics consent is granted", () => {
    mockUseConsent.mockReturnValue(makeConsent({ analytics: true }));
    const { getByTestId } = render(<GoogleTagManagerLoader gtmId="GTM-TEST" />);
    expect(getByTestId("gtm")).toHaveAttribute("data-gtm-id", "GTM-TEST");
  });

  it("pushes consent update 'granted' when analytics is true", () => {
    mockUseConsent.mockReturnValue(makeConsent({ analytics: true }));
    render(<GoogleTagManagerLoader gtmId="GTM-TEST" />);
    expect(window.gtag).toHaveBeenCalledWith("consent", "update", {
      analytics_storage: "granted",
    });
  });

  it("pushes consent update 'denied' when analytics is false", () => {
    mockUseConsent.mockReturnValue(makeConsent({ analytics: false }));
    render(<GoogleTagManagerLoader gtmId="GTM-TEST" />);
    expect(window.gtag).toHaveBeenCalledWith("consent", "update", {
      analytics_storage: "denied",
    });
  });

  it("pushes consent update when analytics changes from true to false", () => {
    mockUseConsent.mockReturnValue(makeConsent({ analytics: true }));
    const { rerender } = render(<GoogleTagManagerLoader gtmId="GTM-TEST" />);

    mockUseConsent.mockReturnValue(makeConsent({ analytics: false }));
    rerender(<GoogleTagManagerLoader gtmId="GTM-TEST" />);

    expect(window.gtag).toHaveBeenLastCalledWith("consent", "update", {
      analytics_storage: "denied",
    });
  });

  it("does not push duplicate consent updates", () => {
    mockUseConsent.mockReturnValue(makeConsent({ analytics: true }));
    const { rerender } = render(<GoogleTagManagerLoader gtmId="GTM-TEST" />);

    // Rerender with same value
    rerender(<GoogleTagManagerLoader gtmId="GTM-TEST" />);

    expect(window.gtag).toHaveBeenCalledTimes(1);
  });

  it("does not call gtag if window.gtag is not defined", () => {
    // @ts-expect-error — testing missing gtag
    delete window.gtag;
    mockUseConsent.mockReturnValue(makeConsent({ analytics: true }));
    expect(() => render(<GoogleTagManagerLoader gtmId="GTM-TEST" />)).not.toThrow();
  });
});
