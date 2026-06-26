import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | World Cup Live Bracket",
  description: "Contact page for World Cup Live Bracket.",
};

export default function EnglishContactPage() {
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL;

  return (
    <main className="staticPage">
      <p className="eyebrow">Contact</p>
      <h1>Contact</h1>

      <section className="staticPanel">
        <h2>Contact Address</h2>
        {contactEmail ? (
          <p>
            Please contact us at <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
          </p>
        ) : (
          <p>
            The contact address is being prepared. Please set <code>NEXT_PUBLIC_CONTACT_EMAIL</code> before publishing.
          </p>
        )}
      </section>

      <section className="staticPanel">
        <h2>When Contacting Us</h2>
        <p>
          For display issues, data updates, advertising, or other inquiries, please include the relevant page URL, time of occurrence, and what you observed.
        </p>
      </section>
    </main>
  );
}
