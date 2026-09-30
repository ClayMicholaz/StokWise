import { notFound } from "next/navigation";
import Home from "../page";

const sections = new Set([
  "inventaris",
  "supplier-lokal",
  "keuangan",
  "pengaturan",
]);

export default async function SectionPage({
  params,
}: PageProps<"/[section]">) {
  const { section } = await params;
  if (!sections.has(section)) notFound();
  return <Home />;
}