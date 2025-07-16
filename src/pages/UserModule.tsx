import { useState } from "react";
import { ArrowLeft, Mail, Globe, Network, FileText, Shield, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

type ScanResult = {
  type: "email" | "url" | "port";
  input: string;
  riskLevel: "Low" | "Medium" | "High";
  status: "Safe" | "Risky" | "Unknown";
  timestamp: Date;
  details: string[];
};

const UserModule = () => {
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);
  const [emailText, setEmailText] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [ipInput, setIpInput] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const { toast } = useToast();

  // Mock phishing indicators
  const phishingKeywords = ["urgent", "verify account", "click here", "suspended", "prize", "winner", "bitcoin"];
  const suspiciousDomains = ["bit.ly", "tinyurl.com", "paypal-security.com", "bank-verification.net"];

  const scanEmail = () => {
    if (!emailText.trim()) return;
    
    setIsScanning(true);
    
    // Mock email scanning logic
    setTimeout(() => {
      const suspiciousCount = phishingKeywords.filter(keyword => 
        emailText.toLowerCase().includes(keyword.toLowerCase())
      ).length;
      
      const riskLevel: "Low" | "Medium" | "High" = 
        suspiciousCount >= 3 ? "High" : 
        suspiciousCount >= 1 ? "Medium" : "Low";
      
      const details = [];
      if (suspiciousCount > 0) {
        details.push(`Found ${suspiciousCount} suspicious keywords`);
      }
      if (emailText.includes("@")) {
        details.push("Email format detected");
      }
      if (emailText.includes("http")) {
        details.push("Contains external links");
      }
      
      const result: ScanResult = {
        type: "email",
        input: emailText.substring(0, 100) + "...",
        riskLevel,
        status: riskLevel === "Low" ? "Safe" : "Risky",
        timestamp: new Date(),
        details
      };
      
      setScanResults(prev => [result, ...prev]);
      setIsScanning(false);
      setEmailText("");
      
      toast({
        title: "Email Scan Complete",
        description: `Risk Level: ${riskLevel}`
      });
    }, 2000);
  };

  const scanUrl = () => {
    if (!urlInput.trim()) return;
    
    setIsScanning(true);
    
    setTimeout(() => {
      const isSuspicious = suspiciousDomains.some(domain => 
        urlInput.toLowerCase().includes(domain)
      ) || urlInput.includes("phishing") || urlInput.includes("scam");
      
      const result: ScanResult = {
        type: "url",
        input: urlInput,
        riskLevel: isSuspicious ? "High" : "Low",
        status: isSuspicious ? "Risky" : "Safe",
        timestamp: new Date(),
        details: isSuspicious ? ["Suspicious domain detected", "Potential phishing site"] : ["Domain appears legitimate"]
      };
      
      setScanResults(prev => [result, ...prev]);
      setIsScanning(false);
      setUrlInput("");
      
      toast({
        title: "URL Scan Complete",
        description: `Status: ${result.status}`
      });
    }, 1500);
  };

  const scanPort = () => {
    if (!ipInput.trim()) return;
    
    setIsScanning(true);
    
    setTimeout(() => {
      // Mock port scan results
      const openPorts = ["22", "80", "443", "8080"];
      const details = [`Open ports: ${openPorts.join(", ")}`, "SSH, HTTP, HTTPS services detected"];
      
      const result: ScanResult = {
        type: "port",
        input: ipInput,
        riskLevel: openPorts.length > 3 ? "Medium" : "Low",
        status: "Unknown",
        timestamp: new Date(),
        details
      };
      
      setScanResults(prev => [result, ...prev]);
      setIsScanning(false);
      setIpInput("");
      
      toast({
        title: "Port Scan Complete",
        description: `Found ${openPorts.length} open ports`
      });
    }, 3000);
  };

  const generateReport = () => {
    const reportData = {
      generatedAt: new Date().toISOString(),
      totalScans: scanResults.length,
      riskBreakdown: {
        high: scanResults.filter(r => r.riskLevel === "High").length,
        medium: scanResults.filter(r => r.riskLevel === "Medium").length,
        low: scanResults.filter(r => r.riskLevel === "Low").length
      },
      scans: scanResults
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cybershiksha-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Report Generated",
      description: "Security scan report downloaded successfully"
    });
  };

  const getRiskIcon = (riskLevel: string, status: string) => {
    if (status === "Safe") return <CheckCircle className="w-5 h-5 text-accent" />;
    if (status === "Risky" || riskLevel === "High") return <XCircle className="w-5 h-5 text-destructive" />;
    return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
  };

  const getRiskColor = (riskLevel: string, status: string) => {
    if (status === "Safe") return "bg-accent/20 text-accent-foreground";
    if (status === "Risky" || riskLevel === "High") return "bg-destructive/20 text-destructive-foreground";
    return "bg-yellow-500/20 text-yellow-300";
  };

  return (
    <div className="min-h-screen bg-gradient-dark p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="outline" size="icon">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold glow-text">Security Tools</h1>
              <p className="text-muted-foreground">Professional cybersecurity scanning suite</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge className="bg-accent/20 text-accent-foreground">
              {scanResults.length} Scans Performed
            </Badge>
            <Button onClick={generateReport} className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Generate Report
            </Button>
          </div>
        </div>

        <Tabs defaultValue="email">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="email" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email Scanner
            </TabsTrigger>
            <TabsTrigger value="url" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              URL Scanner
            </TabsTrigger>
            <TabsTrigger value="port" className="flex items-center gap-2">
              <Network className="w-4 h-4" />
              Port Scanner
            </TabsTrigger>
            <TabsTrigger value="results" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Results
            </TabsTrigger>
          </TabsList>

          <TabsContent value="email" className="mt-6">
            <Card className="cyber-card p-6">
              <div className="flex items-center gap-3 mb-6">
                <Mail className="w-8 h-8 text-primary pulse-glow" />
                <div>
                  <h3 className="text-xl font-semibold">Email Phishing Scanner</h3>
                  <p className="text-muted-foreground">Analyze emails for phishing indicators</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <Textarea
                  placeholder="Paste email content here..."
                  value={emailText}
                  onChange={(e) => setEmailText(e.target.value)}
                  className="min-h-[200px]"
                />
                <Button 
                  onClick={scanEmail} 
                  variant="cyber"
                  size="lg"
                  className="w-full"
                  disabled={isScanning || !emailText.trim()}
                >
                  {isScanning ? "Scanning..." : "Scan Email"}
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="url" className="mt-6">
            <Card className="cyber-card p-6">
              <div className="flex items-center gap-3 mb-6">
                <Globe className="w-8 h-8 text-primary pulse-glow" />
                <div>
                  <h3 className="text-xl font-semibold">Website Phishing Scanner</h3>
                  <p className="text-muted-foreground">Check URLs for malicious content</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <Input
                  placeholder="Enter URL (e.g., https://example.com)"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                />
                <Button 
                  onClick={scanUrl} 
                  variant="cyber"
                  size="lg"
                  className="w-full"
                  disabled={isScanning || !urlInput.trim()}
                >
                  {isScanning ? "Scanning..." : "Scan URL"}
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="port" className="mt-6">
            <Card className="cyber-card p-6">
              <div className="flex items-center gap-3 mb-6">
                <Network className="w-8 h-8 text-primary pulse-glow" />
                <div>
                  <h3 className="text-xl font-semibold">Port Scanner</h3>
                  <p className="text-muted-foreground">Discover open ports and services</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <Input
                  placeholder="Enter IP address (e.g., 127.0.0.1)"
                  value={ipInput}
                  onChange={(e) => setIpInput(e.target.value)}
                />
                <Button 
                  onClick={scanPort} 
                  variant="matrix"
                  size="lg"
                  className="w-full"
                  disabled={isScanning || !ipInput.trim()}
                >
                  {isScanning ? "Scanning..." : "Scan Ports"}
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="results" className="mt-6">
            <div className="space-y-4">
              {scanResults.length === 0 ? (
                <Card className="cyber-card p-8 text-center">
                  <Shield className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Scans Yet</h3>
                  <p className="text-muted-foreground">Start scanning to see results here</p>
                </Card>
              ) : (
                scanResults.map((result, index) => (
                  <Card key={index} className="cyber-card p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {getRiskIcon(result.riskLevel, result.status)}
                        <div>
                          <h4 className="font-semibold capitalize">{result.type} Scan</h4>
                          <p className="text-sm text-muted-foreground">
                            {result.timestamp.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <Badge className={getRiskColor(result.riskLevel, result.status)}>
                        {result.status} - {result.riskLevel} Risk
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm"><strong>Target:</strong> {result.input}</p>
                      <div>
                        <p className="text-sm font-medium mb-1">Analysis Results:</p>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {result.details.map((detail, i) => (
                            <li key={i}>• {detail}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserModule;