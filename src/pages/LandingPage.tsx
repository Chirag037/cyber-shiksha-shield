import { useState } from "react";
import { Link } from "react-router-dom";
import { Shield, GraduationCap, Users, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import cyberHero from "@/assets/cyber-hero.jpg";

const LandingPage = () => {
  const [language, setLanguage] = useState<"en" | "ne">("en");

  const content = {
    en: {
      title: "CyberShikshaX",
      slogan: "Educate. Detect. Defend.",
      learnerButton: "I'm a Learner",
      userButton: "I'm a User",
      learnerDesc: "Master cybersecurity fundamentals through interactive lessons and quizzes",
      userDesc: "Access powerful security tools for real-world threat detection",
      about: "About",
      contact: "Contact"
    },
    ne: {
      title: "साइबर शिक्षा X",
      slogan: "शिक्षा दिनुहोस्। पत्ता लगाउनुहोस्। रक्षा गर्नुहोस्।",
      learnerButton: "म एक विद्यार्थी हुँ",
      userButton: "म एक प्रयोगकर्ता हुँ",
      learnerDesc: "अन्तरक्रियात्मक पाठ र प्रश्नोत्तरी मार्फत साइबर सुरक्षाको आधारभूत कुराहरू सिक्नुहोस्",
      userDesc: "वास्तविक संसारको खतरा पत्ता लगाउनका लागि शक्तिशाली सुरक्षा उपकरणहरू पहुँच गर्नुहोस्",
      about: "बारेमा",
      contact: "सम्पर्क"
    }
  };

  const t = content[language];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-dark">
      {/* Header */}
      <header className="p-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-bold glow-text">{t.title}</h1>
        </div>
        
        <Button
          variant="outline"
          onClick={() => setLanguage(language === "en" ? "ne" : "en")}
          className="flex items-center gap-2"
        >
          <Globe className="w-4 h-4" />
          {language === "en" ? "नेपाली" : "English"}
        </Button>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 relative">
        {/* Background Hero Image */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url(${cyberHero})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
        
        {/* Content */}
        <div className="relative z-10 text-center mb-12">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 glow-text">
            <span className="bg-gradient-cyber bg-clip-text text-transparent">
              {t.title}
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl">
            {t.slogan}
          </p>
        </div>

        {/* Action Cards */}
        <div className="relative z-10 grid md:grid-cols-2 gap-8 max-w-4xl w-full">
          <Card className="cyber-card p-8 text-center group cursor-pointer backdrop-blur-sm">
            <div className="mb-6">
              <GraduationCap className="w-16 h-16 text-primary mx-auto mb-4 pulse-glow" />
              <h3 className="text-2xl font-bold mb-3">{t.learnerButton}</h3>
              <p className="text-muted-foreground">{t.learnerDesc}</p>
            </div>
            <Link to="/learn">
              <Button variant="cyber" size="lg" className="w-full">
                Start Learning
              </Button>
            </Link>
          </Card>

          <Card className="cyber-card p-8 text-center group cursor-pointer backdrop-blur-sm">
            <div className="mb-6">
              <Users className="w-16 h-16 text-accent mx-auto mb-4 pulse-glow" />
              <h3 className="text-2xl font-bold mb-3">{t.userButton}</h3>
              <p className="text-muted-foreground">{t.userDesc}</p>
            </div>
            <Link to="/use">
              <Button variant="matrix" size="lg" className="w-full">
                Access Tools
              </Button>
            </Link>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center">
        <div className="flex justify-center gap-6 text-muted-foreground">
          <a href="#about" className="hover:text-primary transition-colors">{t.about}</a>
          <span>|</span>
          <a href="#contact" className="hover:text-primary transition-colors">{t.contact}</a>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;