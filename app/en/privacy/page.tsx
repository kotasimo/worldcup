import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | World Cup Live Bracket",
  description: "Privacy policy for World Cup Live Bracket.",
};

export default function EnglishPrivacyPage() {
  return (
    <main className="staticPage">
      <p className="eyebrow">Privacy Policy</p>
      <h1>Privacy Policy</h1>

      <section className="staticPanel">
        <h2>Information We Collect</h2>
        <p>
          This site currently does not provide user registration or commenting features, and it does not store personal information entered directly by visitors.
        </p>
        <p>
          If you contact us, we may review your email address and inquiry details only as needed to reply.
        </p>
      </section>

      <section className="staticPanel">
        <h2>Analytics and Advertising</h2>
        <p>
          This site may use advertising or analytics services in the future. These services may use cookies to collect usage information.
        </p>
        <p>
          Third-party advertising providers such as Google AdSense may use cookies to show ads based on user interests. Cookies can be disabled in your browser settings.
        </p>
      </section>

      <section className="staticPanel">
        <h2>External Services</h2>
        <p>
          This site may use external services for match data, flag images, advertising, and related functionality. Information sent to those services is handled under each service&apos;s privacy policy.
        </p>
      </section>

      <section className="staticPanel">
        <h2>Changes to This Policy</h2>
        <p>
          This policy may be updated as needed. Changes take effect when the updated policy is posted on this page.
        </p>
      </section>
    </main>
  );
}
