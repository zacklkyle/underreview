
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Image, Video, Send, Loader2, Camera as CameraIcon, X, ShieldAlert, Upload, Film } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Post } from "@/api/entities";
import { User } from "@/api/entities";
import { UploadFile, InvokeLLM } from "@/api/integrations";
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const SPORTS = ['NFL', 'NBA', 'MLB', 'NHL', 'College Football', 'Soccer'];

export default function PostForm({ onPostCreated }) {
  const [content, setContent] = useState('');
  const [sport, setSport] = useState('');
  const [file, setFile] = useState(null);
  const [postType, setPostType] = useState('text');
  const [previewUrl, setPreviewUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState('');
  const [moderationError, setModerationError] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraMode, setCameraMode] = useState('both'); // 'photo', 'video', or 'both'
  const [isVideoSourceModalOpen, setIsVideoSourceModalOpen] = useState(false);
  const fileInputRef = useRef(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await User.me();
        setCurrentUser(user);
      } catch (e) {
        console.log("User not logged in:", e);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (!file) {
      setPreviewUrl('');
      setPostType('text');
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    // Also set postType based on file type
    setPostType(file.type.startsWith('image') ? 'image' : 'video');
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const handleFileTrigger = (type) => {
    setPostType(type);
    if (fileInputRef.current) {
      fileInputRef.current.accept = `${type}/*`;
      fileInputRef.current.value = null;
      fileInputRef.current.click();
    }
  };

  const openCamera = (mode) => {
    setCameraMode(mode);
    setIsCameraOpen(true);
  };
  
  const handleFileChange = (e) => {
    setModerationError(null);
    const selectedFile = e.target.files[0];
    if (selectedFile) setFile(selectedFile);
  };

  const handleCameraCapture = (capturedFile) => {
    setModerationError(null);
    setFile(capturedFile);
    setIsCameraOpen(false);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setModerationError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!sport || (!content.trim() && !file)) {
      return;
    }

    setIsSubmitting(true);
    setModerationError(null);

    try {
      let media_url = '';
      if (file) {
        setSubmissionStatus('Uploading...');
        const uploadResponse = await UploadFile({ file });
        media_url = uploadResponse.file_url;

        setSubmissionStatus('Analyzing...');
        const moderationResult = await InvokeLLM({
          prompt: `You are an AI content moderator. Is this content safe for a general audience (SFW)? It must not contain nudity, graphic violence, hate speech, or illegal acts.`,
          file_urls: [media_url],
          response_json_schema: {
            type: "object",
            properties: { is_safe: { type: "boolean" }, reason: { type: "string" } },
            required: ["is_safe"]
          }
        });

        if (!moderationResult.is_safe) {
          setModerationError(moderationResult.reason || "This content was flagged as inappropriate.");
          setIsSubmitting(false);
          setSubmissionStatus('');
          return;
        }
      }

      setSubmissionStatus('Posting...');
      await Post.create({
        post_type: postType,
        content,
        sport,
        media_url,
        user_name: currentUser?.full_name || 'Anonymous Referee'
      });

      setContent('');
      setSport('');
      setFile(null);
      onPostCreated();

    } catch (error) {
      console.error("Error creating post:", error);
      setModerationError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
      setSubmissionStatus('');
    }
  };

  return (
    <>
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <form onSubmit={handleSubmit}>
            <div className="flex gap-3 items-start">
              <Avatar>
                <AvatarFallback className="bg-orange-200 text-orange-700">
                  {currentUser?.full_name?.[0]?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's your call? Start a discussion..."
                className="min-h-[60px] border-none focus-visible:ring-0 shadow-none p-0 text-base resize-none"
              />
            </div>

            {file && (
              <div className="mt-4 relative w-full max-w-md mx-auto">
                {postType === 'image' && <img src={previewUrl} alt="Preview" className="rounded-lg max-h-80 w-full object-contain" />}
                {postType === 'video' && <video src={previewUrl} controls className="rounded-lg w-full" />}
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute -top-3 -right-3 rounded-full h-8 w-8 shadow-lg"
                  onClick={handleRemoveFile}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            {moderationError && (
              <Alert variant="destructive" className="mt-4">
                <ShieldAlert className="h-4 w-4" />
                <AlertTitle>Post Rejected</AlertTitle>
                <AlertDescription>{moderationError}</AlertDescription>
              </Alert>
            )}

            <div className="border-t mt-4 pt-3 flex flex-wrap justify-between items-center gap-y-2">
              <div className="flex items-center gap-2">
                <input ref={fileInputRef} type="file" onChange={handleFileChange} className="hidden" />
                <Button type="button" variant="ghost" size="sm" onClick={() => handleFileTrigger('image')} className="text-gray-600 gap-2"><Image className="w-5 h-5" />Image Upload</Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => setIsVideoSourceModalOpen(true)} className="text-gray-600 gap-2"><Video className="w-5 h-5" />Video Upload</Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => openCamera('photo')} className="text-gray-600 gap-2"><CameraIcon className="w-5 h-5" />Take Photo</Button>
              </div>
              <div className="flex items-center gap-3">
                <Select value={sport} onValueChange={setSport}>
                  <SelectTrigger className="w-[150px] h-9">
                    <SelectValue placeholder="Select Sport *" />
                  </SelectTrigger>
                  <SelectContent>
                    {SPORTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Button type="submit" disabled={isSubmitting || !sport || (!content.trim() && !file)} className="bg-orange-500 hover:bg-orange-600 h-9">
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Post'}
                </Button>
              </div>
            </div>
            {isSubmitting && submissionStatus && <p className="text-sm text-gray-500 mt-2 text-right">{submissionStatus}</p>}
          </form>
        </CardContent>
      </Card>

      <Dialog open={isVideoSourceModalOpen} onOpenChange={setIsVideoSourceModalOpen}>
          <DialogContent>
              <DialogHeader>
                  <DialogTitle>Add a Video</DialogTitle>
                  <DialogDescription>
                      Choose whether to upload an existing video or record a new one.
                  </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 pt-4">
                  <Button variant="outline" onClick={() => { setIsVideoSourceModalOpen(false); handleFileTrigger('video'); }}>
                      <Upload className="w-4 h-4 mr-2" /> Upload from Device
                  </Button>
                  <Button onClick={() => { setIsVideoSourceModalOpen(false); openCamera('video'); }}>
                      <Film className="w-4 h-4 mr-2" /> Record Video
                  </Button>
              </div>
          </DialogContent>
      </Dialog>

      <CameraCaptureModal isOpen={isCameraOpen} onClose={() => setIsCameraOpen(false)} onCapture={handleCameraCapture} mode={cameraMode} />
    </>
  );
}

function CameraCaptureModal({ isOpen, onClose, onCapture, mode }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const timerRef = useRef(null);
  
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const MAX_RECORDING_TIME = 20;

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: true });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setIsCameraReady(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setIsCameraReady(false);
    setIsRecording(false);
    setRecordingTime(0);
    clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isOpen, startCamera, stopCamera]);

  const handleStopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    clearInterval(timerRef.current);
    setIsRecording(false);
  }, []);
  
  const handleStartRecording = () => {
    if (!streamRef.current) return;
    setIsRecording(true);
    recordedChunksRef.current = [];
    
    try {
      mediaRecorderRef.current = new MediaRecorder(streamRef.current, { mimeType: 'video/webm' });
    } catch (e) {
      console.error('MediaRecorder not supported:', e);
      try {
        mediaRecorderRef.current = new MediaRecorder(streamRef.current); // Fallback without specific mimeType
      } catch (e2) {
        console.error('MediaRecorder fallback failed:', e2);
        setIsRecording(false);
        return;
      }
    }

    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunksRef.current.push(event.data);
      }
    };
    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
      const file = new File([blob], `recording-${Date.now()}.webm`, { type: 'video/webm' });
      onCapture(file);
    };
    
    mediaRecorderRef.current.start();
    setRecordingTime(0);
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => {
        const newTime = prev + 1;
        if (newTime >= MAX_RECORDING_TIME) {
          handleStopRecording();
          return MAX_RECORDING_TIME;
        }
        return newTime;
      });
    }, 1000);
  };
  
  const captureStillImage = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if(blob){
        const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
        onCapture(file);
      }
    }, 'image/jpeg');
  };

  const showTakePhoto = mode === 'photo' || mode === 'both';
  const showRecord = mode === 'video' || mode === 'both';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><CameraIcon/>Use Camera</DialogTitle>
        </DialogHeader>
        <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
          {!isCameraReady && <div className="absolute inset-0 flex items-center justify-center text-white">Loading camera...</div>}
          {isRecording && (
            <div className="absolute top-3 left-3 flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full text-sm">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span>{recordingTime}s / {MAX_RECORDING_TIME}s</span>
            </div>
          )}
        </div>
        <div className="flex justify-around items-center gap-3 mt-4">
          {showTakePhoto && (
            <Button variant="outline" onClick={captureStillImage} disabled={!isCameraReady || isRecording}>Take Photo</Button>
          )}
          {showRecord && (
            <div className="text-center">
              {!isRecording ? (
                <Button onClick={handleStartRecording} disabled={!isCameraReady} className="bg-red-600 hover:bg-red-700 w-20 h-20 rounded-full">Record</Button>
              ) : (
                <Button onClick={handleStopRecording} className="bg-white border-2 border-red-600 text-red-600 hover:bg-red-50 w-20 h-20 rounded-full">Stop</Button>
              )}
            </div>
          )}
          <Button variant="outline" onClick={onClose}>Cancel</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
