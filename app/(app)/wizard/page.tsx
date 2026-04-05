import { WizardClient } from "@/components/wizard/WizardClient";

export const metadata = {
  title: "Plan wizard | eSIMSeeker",
  description: "AI-assisted eSIM plan finder",
};

export default function WizardPage() {
  return (
    <>
      <a
        href="#site-main"
        className="absolute -left-[9999px] top-4 z-50 rounded-lg bg-brand-navy px-4 py-2 text-sm font-medium text-brand-paper focus:left-4 focus:z-[100] focus:outline-none"
      >
        Skip to main content
      </a>
      <main
        id="site-main"
        tabIndex={-1}
        className="min-h-screen bg-[#F8F9FA] text-[#0A192F] dark:bg-[#0A192F] dark:text-[#F8F9FA]"
      >
        <WizardClient />
      </main>
    </>
  );
}
