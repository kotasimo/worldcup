import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer | World Cup Live Bracket",
  description: "Disclaimer for World Cup Live Bracket.",
};

export default function EnglishDisclaimerPage() {
  return (
    <main className="staticPage">
      <p className="eyebrow">Disclaimer</p>
      <h1>Disclaimer</h1>

      <section className="staticPanel">
        <h2>Accuracy of Information</h2>
        <p>
          We try to display accurate information, but we do not guarantee the accuracy, completeness, or freshness of match results, standings, or bracket projections.
        </p>
        <p>
          For official schedules, standings, and results, please check the official tournament site and official announcements.
        </p>
      </section>

      <section className="staticPanel">
        <h2>Liability</h2>
        <p>
          The operator is not responsible for damages or issues arising from use of the information on this site. Please use the site at your own discretion.
        </p>
      </section>

      <section className="staticPanel">
        <h2>External Links and Services</h2>
        <p>
          The operator is not responsible for the content of external sites or services linked or referenced from this site, or for damages caused by their use.
        </p>
      </section>
    </main>
  );
}
