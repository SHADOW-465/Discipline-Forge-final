"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Lock, 
  Clock, 
  Play, 
  Pause, 
  Square,
  Settings,
  Key,
  Shield,
  Calendar,
  Timer,
  CheckCircle,
  X
} from "lucide-react";

export default function SessionsPage() {
  const [isCreatingKeyholder, setIsCreatingKeyholder] = useState(false);
  const [keyholderData, setKeyholderData] = useState({
    name: "",
    password: "",
    confirmPassword: "",
    requiredDurationHours: 24,
  });
  const [isVerifyingPassword, setIsVerifyingPassword] = useState(false);
  const [passwordToVerify, setPasswordToVerify] = useState("");

  const activeSession = useQuery(api.sessions.getActiveSession);
  const userSessions = useQuery(api.sessions.getUserSessions);
  const sessionWithKeyholder = useQuery(
    api.sessions.getSessionWithKeyholder,
    activeSession ? { sessionId: activeSession._id } : "skip"
  );

  const startSession = useMutation(api.sessions.startSession);
  const endSession = useMutation(api.sessions.endSession);
  const createKeyholder = useMutation(api.sessions.createKeyholder);
  const verifyKeyholderPassword = useMutation(api.sessions.verifyKeyholderPassword);

  const handleStartSession = async () => {
    try {
      await startSession({ goalHours: 24 });
    } catch (error) {
      console.error("Error starting session:", error);
    }
  };

  const handleEndSession = async () => {
    if (!activeSession) return;
    
    try {
      await endSession({ sessionId: activeSession._id });
    } catch (error) {
      console.error("Error ending session:", error);
    }
  };

  const handleCreateKeyholder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (keyholderData.password !== keyholderData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (!activeSession) {
      alert("No active session");
      return;
    }

    try {
      // In a real app, you'd hash the password properly
      const passwordHash = keyholderData.password; // This is NOT secure for production
      
      await createKeyholder({
        sessionId: activeSession._id,
        name: keyholderData.name,
        passwordHash,
        requiredDurationHours: keyholderData.requiredDurationHours,
      });
      
      setIsCreatingKeyholder(false);
      setKeyholderData({
        name: "",
        password: "",
        confirmPassword: "",
        requiredDurationHours: 24,
      });
    } catch (error) {
      console.error("Error creating keyholder:", error);
    }
  };

  const handleVerifyPassword = async () => {
    if (!activeSession) return;
    
    setIsVerifyingPassword(true);
    try {
      const isValid = await verifyKeyholderPassword({
        sessionId: activeSession._id,
        password: passwordToVerify,
      });
      
      if (isValid) {
        alert("Password verified! Access granted.");
        setPasswordToVerify("");
      } else {
        alert("Invalid password. Access denied.");
      }
    } catch (error) {
      console.error("Error verifying password:", error);
      alert("Error verifying password");
    } finally {
      setIsVerifyingPassword(false);
    }
  };

  const formatDuration = (startTime: number, endTime?: number) => {
    const duration = (endTime || Date.now()) - startTime;
    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const getSessionStatus = (session: { isActive: boolean }) => {
    if (session.isActive) {
      return <Badge className="bg-green-500/20 text-green-400">Active</Badge>;
    } else {
      return <Badge variant="secondary">Completed</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Session Management</h1>
          <p className="text-slate-400">Control and monitor your chastity sessions</p>
        </div>
        {!activeSession && (
          <Button
            onClick={handleStartSession}
            className="bg-teal-600 hover:bg-teal-700"
          >
            <Play className="h-4 w-4 mr-2" />
            Start New Session
          </Button>
        )}
      </div>

      {/* Active Session */}
      {activeSession && (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Lock className="h-5 w-5 mr-2 text-teal-500" />
              Active Session
            </CardTitle>
            <CardDescription className="text-slate-400">
              Current session details and controls
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Session Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-700 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Timer className="h-4 w-4 text-blue-500" />
                    <span className="text-slate-300">Duration</span>
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {formatDuration(activeSession.startDate)}
                  </div>
                </div>
                
                <div className="bg-slate-700 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="h-4 w-4 text-green-500" />
                    <span className="text-slate-300">Started</span>
                  </div>
                  <div className="text-sm text-white">
                    {new Date(activeSession.startDate).toLocaleString()}
                  </div>
                </div>
                
                <div className="bg-slate-700 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="h-4 w-4 text-purple-500" />
                    <span className="text-slate-300">Goal</span>
                  </div>
                  <div className="text-sm text-white">
                    {activeSession.goalHours || "No goal set"} hours
                  </div>
                </div>
              </div>

              {/* Keyholder Section */}
              {sessionWithKeyholder?.keyholder ? (
                <div className="bg-slate-700 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white flex items-center">
                      <Shield className="h-5 w-5 mr-2 text-yellow-500" />
                      Keyholder: {sessionWithKeyholder.keyholder.name}
                    </h3>
                    <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400">
                      <Key className="h-3 w-3 mr-1" />
                      Protected
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <Label className="text-slate-300">Required Duration</Label>
                      <div className="text-white">
                        {sessionWithKeyholder.keyholder.requiredDurationHours || "Not set"} hours
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Input
                        type="password"
                        placeholder="Enter keyholder password"
                        value={passwordToVerify}
                        onChange={(e) => setPasswordToVerify(e.target.value)}
                        className="bg-slate-600 border-slate-500 text-white placeholder:text-slate-400"
                      />
                      <Button
                        onClick={handleVerifyPassword}
                        disabled={isVerifyingPassword || !passwordToVerify}
                        variant="outline"
                        className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      >
                        {isVerifyingPassword ? "Verifying..." : "Verify"}
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-700 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white flex items-center">
                      <Shield className="h-5 w-5 mr-2 text-slate-500" />
                      No Keyholder Set
                    </h3>
                    <Button
                      onClick={() => setIsCreatingKeyholder(true)}
                      variant="outline"
                      className="border-slate-600 text-slate-300 hover:bg-slate-700"
                    >
                      <Key className="h-4 w-4 mr-2" />
                      Set Keyholder
                    </Button>
                  </div>
                  <p className="text-slate-400 text-sm">
                    Add a keyholder to protect this session with password access.
                  </p>
                </div>
              )}

              {/* Session Controls */}
              <div className="flex space-x-2">
                <Button
                  onClick={handleEndSession}
                  variant="destructive"
                  className="flex-1"
                >
                  <Square className="h-4 w-4 mr-2" />
                  End Session
                </Button>
                <Button
                  variant="outline"
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create Keyholder Modal */}
      {isCreatingKeyholder && (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Key className="h-5 w-5 mr-2 text-yellow-500" />
              Set Keyholder
            </CardTitle>
            <CardDescription className="text-slate-400">
              Create a keyholder to protect this session
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateKeyholder} className="space-y-4">
              <div>
                <Label className="text-slate-300">Keyholder Name</Label>
                <Input
                  value={keyholderData.name}
                  onChange={(e) => setKeyholderData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter keyholder name"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                  required
                />
              </div>
              
              <div>
                <Label className="text-slate-300">Password</Label>
                <Input
                  type="password"
                  value={keyholderData.password}
                  onChange={(e) => setKeyholderData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter password"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                  required
                />
              </div>
              
              <div>
                <Label className="text-slate-300">Confirm Password</Label>
                <Input
                  type="password"
                  value={keyholderData.confirmPassword}
                  onChange={(e) => setKeyholderData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="Confirm password"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                  required
                />
              </div>
              
              <div>
                <Label className="text-slate-300">Required Duration (hours)</Label>
                <Input
                  type="number"
                  value={keyholderData.requiredDurationHours}
                  onChange={(e) => setKeyholderData(prev => ({ ...prev, requiredDurationHours: parseInt(e.target.value) }))}
                  min="1"
                  max="168"
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              
              <div className="flex space-x-2">
                <Button
                  type="submit"
                  className="bg-yellow-600 hover:bg-yellow-700"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Create Keyholder
                </Button>
                <Button
                  type="button"
                  onClick={() => setIsCreatingKeyholder(false)}
                  variant="outline"
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Session History */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-blue-500" />
            Session History
          </CardTitle>
          <CardDescription className="text-slate-400">
            Your past chastity sessions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {userSessions && userSessions.length > 0 ? (
            <div className="space-y-4">
              {userSessions.map((session) => (
                <div
                  key={session._id}
                  className="flex items-center justify-between p-4 bg-slate-700 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {session.isActive ? (
                        <Play className="h-4 w-4 text-green-500" />
                      ) : (
                        <Pause className="h-4 w-4 text-slate-500" />
                      )}
                      <span className="text-slate-300">
                        {new Date(session.startDate).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="text-slate-400">
                      Duration: {formatDuration(session.startDate, session.endDate)}
                    </div>
                    
                    {session.goalHours && (
                      <div className="text-slate-400">
                        Goal: {session.goalHours}h
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {getSessionStatus(session)}
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-slate-600 text-slate-300 hover:bg-slate-700"
                    >
                      <Settings className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-slate-500 mx-auto mb-4" />
              <p className="text-slate-400">No sessions found</p>
              <p className="text-slate-500 text-sm">Start your first session to begin tracking</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
