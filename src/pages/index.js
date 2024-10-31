import IntroductionSection from "@/components/Home/IntroductionSection";
import FeaturesSection from "@/components/Home/FeaturesSection";
import ContactSection from "@/components/Home/ContactSection";

export default function Home() {
  return (
    <div className="bg-background text-foreground transition-colors duration-200">
      <IntroductionSection />
      <FeaturesSection />
      <ContactSection />
    </div>
  );
}
