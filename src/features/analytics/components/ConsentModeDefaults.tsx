/**
 * Inline script that initializes Google Consent Mode v2 defaults before GTM loads.
 * Must render in <head> so it executes synchronously before any tag manager scripts.
 *
 * Also reads the consent cookie synchronously so returning users get
 * analytics_storage:"granted" in the dataLayer BEFORE the gtm.js event.
 * Without this, the consent update arrives via React useEffect (async),
 * which lands after gtm.js — causing tags with Additional Consent Checks
 * to miss the Initialization trigger.
 *
 * Content is a static string literal with no user input — safe for dangerouslySetInnerHTML.
 */
export function ConsentModeDefaults(): React.ReactElement {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag("consent","default",{analytics_storage:"denied",ad_storage:"denied",ad_user_data:"denied",ad_personalization:"denied"});try{var c=document.cookie.split("; ").find(function(r){return r.startsWith("consent-preferences=")});if(c){var p=JSON.parse(decodeURIComponent(c.split("=").slice(1).join("=")));if(p&&p.analytics)gtag("consent","update",{analytics_storage:"granted"})}}catch(e){}`,
      }}
    />
  );
}
