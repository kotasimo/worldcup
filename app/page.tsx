import { LiveBracket } from "@/components/LiveBracket";
import { getWorldCupViewModel } from "@/lib/view-model";

export const revalidate = 120;

export default async function Home() {
  const data = await getWorldCupViewModel();

  return (
    <main className="page">
      <LiveBracket initialData={data} />
    </main>
  );
}
