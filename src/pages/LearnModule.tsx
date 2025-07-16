import { useState, useEffect } from "react";
import { ArrowLeft, BookOpen, Brain, Download, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

const LearnModule = () => {
  const [selectedClass, setSelectedClass] = useState<string>("8");
  const [progress, setProgress] = useState<{ [key: string]: number }>({});
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  // Mock lesson data
  const classData = {
    "8": ["Introduction to Internet Safety", "Password Security", "Social Media Safety"],
    "9": ["Malware Basics", "Phishing Awareness", "Safe Browsing"],
    "10": ["Digital Privacy", "Data Protection", "Cyber Bullying"],
    "11": ["Advanced Threats", "Network Security", "Encryption Basics"],
    "12": ["Incident Response", "Risk Assessment", "Legal Aspects"],
    "+2": ["Penetration Testing", "Forensics", "Advanced Cryptography"],
    "College": ["Enterprise Security", "Threat Intelligence", "Security Architecture"]
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
              
              <div className="space-y-4 mb-6">
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm"><strong>You:</strong> What is phishing?</p>
                </div>
                <div className="bg-primary/10 p-4 rounded-lg">
                  <p className="text-sm"><strong>AI Tutor:</strong> Phishing is a cybersecurity attack where attackers impersonate legitimate organizations through emails, websites, or messages to steal sensitive information like passwords, credit card numbers, or personal data. Always verify the sender and look for suspicious links or urgent requests for personal information.</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask your cybersecurity question..."
                  className="flex-1 px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button variant="cyber">Send</Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default LearnModule;