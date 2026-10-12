import type { Metadata } from "next";
import { PrivacyContent } from "./(components)/PrivacyContent";

export const metadata: Metadata = {
  title: "Datenschutz | Frisch nach Hause",
};

export default function PrivacyPage() {
  return <PrivacyContent />;
}
