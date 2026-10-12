import type { Metadata } from "next";
import { SplashScreen } from "./(components)/SplashScreen";

export const metadata: Metadata = {
  title: "Willkommen | Frisch nach Hause",
};

export default function SplashPage() {
  return <SplashScreen />;
}
