import { useState, useEffect } from "react";
import { ArrowLeft, BookOpen, Brain, Download, RefreshCw, CheckCircle, Lock, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";

const LearnModule = () => {
  const [selectedClass, setSelectedClass] = useState<string>("8");
  const [progress, setProgress] = useState<{ [key: string]: number }>({});
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [chatMessages, setChatMessages] = useState<Array<{type: 'user' | 'bot', message: string}>>([
    { type: 'bot', message: "Hello! I'm your AI CyberTutor. I'm here to help you learn about cybersecurity. What would you like to know?" }
  ]);
  const [userInput, setUserInput] = useState("");

  // Enhanced lesson data with more comprehensive topics
  const classData = {
    "8": [
      "Introduction to Internet Safety", 
      "Password Security & Digital Keys", 
      "Social Media Safety & Digital Citizenship",
      "Understanding Your Digital Footprint"
    ],
    "9": [
      "Understanding Malware: Digital Threats", 
      "Phishing: Digital Deception Tactics", 
      "Safe Browsing & Website Security",
      "Email Security & Communication Safety"
    ],
    "10": [
      "Digital Privacy: Protecting Your Personal Information", 
      "Data Protection & Information Security", 
      "Cyberbullying Prevention & Response",
      "Online Gaming Security"
    ],
    "11": [
      "Advanced Threat Detection", 
      "Network Security Fundamentals", 
      "Encryption & Cryptography Basics",
      "Mobile Device Security"
    ],
    "12": [
      "Incident Response & Recovery", 
      "Risk Assessment & Management", 
      "Legal Aspects of Cybersecurity",
      "Digital Forensics Introduction"
    ],
    "+2": [
      "Ethical Hacking & Penetration Testing", 
      "Digital Forensics & Investigation", 
      "Advanced Cryptography & Blockchain",
      "IoT Security & Smart Devices"
    ],
    "College": [
      "Enterprise Security Architecture", 
      "Threat Intelligence & Analysis", 
      "Security Governance & Compliance",
      "Emerging Threats & Future Security"
    ]
  };

  // AI CyberTutor responses
  const cyberTutorResponses = {
    keywords: {
      "password": "Strong passwords are your first line of defense! Use a combination of uppercase, lowercase, numbers, and symbols. Make it at least 8 characters long and unique for each account. Consider using a passphrase like 'Coffee$Loves#Morning2024!' Remember: never reuse passwords across different accounts!",
      "phishing": "Phishing attacks try to trick you into giving away personal information. Always verify the sender, look for spelling errors, and never click suspicious links. When in doubt, contact the organization directly using their official website or phone number. Remember: legitimate companies will never ask for passwords via email!",
      "malware": "Malware is malicious software designed to harm your device. Protect yourself by keeping software updated, using antivirus protection, avoiding suspicious downloads, and being careful with email attachments. Types include viruses, trojans, ransomware, and spyware. Prevention is easier than removal!",
      "social media": "Stay safe on social media by adjusting privacy settings, thinking before you post, never sharing personal information with strangers, and being kind to others. Remember: anything you post online can potentially be seen by others, including future employers! Use the 'grandmother rule' - if you wouldn't want your grandmother to see it, don't post it!",
      "wifi": "Public Wi-Fi can be risky! Avoid accessing sensitive information like banking on public networks. If you must use public Wi-Fi, look for HTTPS websites (the padlock icon), avoid auto-connecting, and consider using a VPN. Your home Wi-Fi should be secured with WPA3 encryption.",
      "backup": "Regular backups are essential for protection against ransomware and data loss! Follow the 3-2-1 rule: 3 copies of important data, 2 different storage types (like cloud and external drive), 1 offsite backup. Test your backups regularly to ensure they work when needed.",
      "privacy": "Privacy settings are your digital armor! Review them regularly on all your accounts. Limit who can see your posts, turn off location tracking when not needed, and be selective about what information you share online. Remember: once something is online, it can be very difficult to completely remove.",
      "cyberbullying": "Cyberbullying is serious and you're not alone. If you're experiencing it: don't respond to bullies, save evidence by taking screenshots, block the person, report to the platform, and tell a trusted adult. If you see it happening to others, be an upstander - report it and support the victim. Remember: it's not your fault, and there are people who can help.",
      "2fa": "Two-Factor Authentication (2FA) adds an extra layer of security by requiring both your password and something else (like your phone). It's like having two locks on your door. Enable 2FA on all important accounts - it can prevent 99.9% of automated attacks!",
      "virus": "Computer viruses attach to other programs and spread when those programs run. Signs include slow performance, unexpected pop-ups, and files disappearing. Protect yourself with antivirus software, regular updates, and careful downloading. If infected, disconnect from internet and run a full system scan."
    },
    fallback: [
      "That's an interesting question! While I may not have a specific answer, I encourage you to explore our lessons for detailed information about cybersecurity topics.",
      "Great question! Cybersecurity is a vast field. Check out our class-based lessons for comprehensive coverage of this topic.",
      "I'd love to help you learn more about that! Our learning modules cover many cybersecurity concepts in detail. Try asking about specific topics like passwords, phishing, or malware."
    ]
  };

  // Load progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem("cyberShikshaProgress");
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress));
    }
  }, []);

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleTopicClick = (topic: string) => {
    const progressKey = `${selectedClass}-${topic}`;
    const newProgress = { ...progress, [progressKey]: 100 };
    setProgress(newProgress);
    localStorage.setItem("cyberShikshaProgress", JSON.stringify(newProgress));
  };

  const getClassProgress = (className: string) => {
    const topics = classData[className as keyof typeof classData] || [];
    const completed = topics.filter(topic => progress[`${className}-${topic}`] === 100).length;
    return topics.length > 0 ? (completed / topics.length) * 100 : 0;
  };

  const handleCyberTutorMessage = () => {
    if (!userInput.trim()) return;
    
    // Add user message
    const newMessages = [...chatMessages, { type: 'user' as const, message: userInput }];
    
    // Generate bot response
    const input = userInput.toLowerCase();
    let response = "";
    
    // Check for keywords
    const foundKeyword = Object.keys(cyberTutorResponses.keywords).find(keyword => 
      input.includes(keyword)
    );
    
    if (foundKeyword) {
      response = cyberTutorResponses.keywords[foundKeyword as keyof typeof cyberTutorResponses.keywords];
    } else {
      // Random fallback response
      const randomIndex = Math.floor(Math.random() * cyberTutorResponses.fallback.length);
      response = cyberTutorResponses.fallback[randomIndex];
    }
    
    // Add bot response
    setTimeout(() => {
      setChatMessages([...newMessages, { type: 'bot', message: response }]);
    }, 1000);
    
    setChatMessages(newMessages);
    setUserInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCyberTutorMessage();
    }
  };

  const classes = ["8", "9", "10", "11", "12", "+2", "College"];

  return (
    <div className="min-h-screen bg-gradient-dark p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="outline" size="icon" className="hover:shadow-glow">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold glow-text">Learning Module</h1>
              <p className="text-muted-foreground">Master cybersecurity fundamentals</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {isOffline && (
              <Badge variant="destructive" className="animate-pulse">
                Offline Mode
              </Badge>
            )}
            <Button variant="outline" className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Check for Updates
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Download Lessons
            </Button>
          </div>
        </div>

        <Tabs defaultValue="lessons">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="lessons" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Lessons
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center gap-2">
              <Progress className="w-4 h-4" />
              Progress
            </TabsTrigger>
            <TabsTrigger value="tutor" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              AI Tutor
            </TabsTrigger>
          </TabsList>

          <TabsContent value="lessons" className="mt-6">
            {/* Class Selector */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Select Your Class</h3>
              <div className="flex flex-wrap gap-2">
                {classes.map((cls) => (
                  <Button
                    key={cls}
                    variant={selectedClass === cls ? "default" : "outline"}
                    onClick={() => setSelectedClass(cls)}
                    className="relative"
                  >
                    Class {cls}
                    {getClassProgress(cls) > 0 && (
                      <Badge className="absolute -top-2 -right-2 bg-accent text-accent-foreground">
                        {Math.round(getClassProgress(cls))}%
                      </Badge>
                    )}
                  </Button>
                ))}
              </div>
            </div>

            {/* Topics Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(classData[selectedClass as keyof typeof classData] || []).map((topic, index) => {
                const progressKey = `${selectedClass}-${topic}`;
                const isCompleted = progress[progressKey] === 100;
                
                return (
                  <Card
                    key={topic}
                    className="cyber-card p-6 cursor-pointer"
                    onClick={() => handleTopicClick(topic)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-semibold">{topic}</h4>
                      {isCompleted && (
                        <Badge className="bg-accent text-accent-foreground">
                          Completed
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Lesson {index + 1} • 15 min read
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{progress[progressKey] || 0}%</span>
                      </div>
                      <Progress value={progress[progressKey] || 0} className="h-2" />
                    </div>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="progress" className="mt-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {classes.map((cls) => (
                <Card key={cls} className="cyber-card p-6">
                  <h3 className="text-lg font-semibold mb-3">Class {cls}</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Overall Progress</span>
                      <span>{Math.round(getClassProgress(cls))}%</span>
                    </div>
                    <Progress value={getClassProgress(cls)} className="h-3" />
                    <p className="text-sm text-muted-foreground">
                      {(classData[cls as keyof typeof classData] || []).filter(topic => 
                        progress[`${cls}-${topic}`] === 100
                      ).length} of {(classData[cls as keyof typeof classData] || []).length} topics completed
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tutor" className="mt-6">
            <Card className="cyber-card p-6">
              <div className="flex items-center gap-3 mb-6">
                <Brain className="w-8 h-8 text-primary pulse-glow" />
                <div>
                  <h3 className="text-xl font-semibold">AI CyberTutor</h3>
                  <p className="text-muted-foreground">Ask me anything about cybersecurity!</p>
                </div>
              </div>
              
              <div className="max-h-96 overflow-y-auto space-y-4 mb-6">
                {chatMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg ${
                      msg.type === 'user' 
                        ? 'bg-primary/20 ml-8' 
                        : 'bg-muted mr-8'
                    }`}
                  >
                    <p className="text-sm">
                      <strong>{msg.type === 'user' ? 'You:' : 'AI Tutor:'}</strong> {msg.message}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Ask about passwords, phishing, malware, privacy..."
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                />
                <Button variant="cyber" onClick={handleCyberTutorMessage}>
                  Send
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default LearnModule;