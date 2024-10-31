// /src/components/home/ContactSection.js
import useFadeInOnScroll from "../hooks/useFadeInOnScroll";
import { Button } from "@/components/ui/button";

export default function ContactSection() {
  const ref = useFadeInOnScroll();

  return (
    <section ref={ref} className="fade-in container mx-auto text-center py-10 bg-background text-foreground transition-colors duration-200">
      <h2 className="text-3xl font-bold mb-4">Want to Learn More?</h2>
      <p className="text-lg mb-6">
        Discover how our system can transform your organization's staff management and payroll processing.
      </p>
      <Button
        asChild
        className="btn px-8 py-3 font-semibold rounded-full shadow-lg hover:bg-hover transition-colors duration-200"
      >
        <a href="/about">Learn More About Us</a>
      </Button>
    </section>
  );
}
