/**
 * Inline script that initializes Google Consent Mode v2 defaults before GTM loads.
 * Must render in <head> so it executes synchronously before any tag manager scripts.
 * Content is a static string literal — no user input involved.
 */
export function ConsentModeDefaults(): React.ReactElement {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag("consent","default",{analytics_storage:"denied",ad_storage:"denied",ad_user_data:"denied",ad_personalization:"denied"})`,
      }}
    />
  );
}
