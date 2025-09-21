import { Navigation } from "@/components/ui/navigation";
import { Hero } from "@/components/Hero";
import { FeatureCards } from "@/components/FeatureCards";
import { Dashboard } from "@/components/Dashboard";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <Hero />
        <FeatureCards />
        <Dashboard />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
