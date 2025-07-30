import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Camera, Monitor, Shield, AlertTriangle, X, Check } from 'lucide-react';
import toast from 'react-hot-toast';

interface AssessmentSecurityProps {
  onSecurityVerified: () => void;
  onSecurityFailed: () => void;
}

export const AssessmentSecurity: React.FC<AssessmentSecurityProps> = ({
  onSecurityVerified,
  onSecurityFailed
}) => {
  const [step, setStep] = useState<'intro' | 'camera' | 'fullscreen' | 'verified'>('intro');
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Check if user exits fullscreen during assessment
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = Boolean(document.fullscreenElement);
      setIsFullscreen(isCurrentlyFullscreen);
      
      if (!isCurrentlyFullscreen && step === 'verified') {
        toast.error('Assessment paused - Please return to fullscreen mode');
        // You can add additional actions here like pausing the assessment
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden && step === 'verified') {
        toast.error('Assessment monitoring - Tab switching detected');
        // Log suspicious activity
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [step]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        },
        audio: false
      });

      setCameraStream(stream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setStep('camera');
      toast.success('Camera access granted');
    } catch (error) {
      console.error('Camera access denied:', error);
      setCameraError('Camera access is required for this assessment. Please allow camera permissions and try again.');
      toast.error('Camera access denied');
    }
  };

  const enterFullscreen = async () => {
    try {
      await document.documentElement.requestFullscreen();
      setIsFullscreen(true);
      setStep('fullscreen');
      toast.success('Fullscreen mode activated');
    } catch (error) {
      console.error('Fullscreen request failed:', error);
      toast.error('Fullscreen mode is required for this assessment');
    }
  };

  const verifySecuritySetup = () => {
    if (cameraStream && isFullscreen) {
      setStep('verified');
      setTimeout(() => {
        onSecurityVerified();
      }, 2000);
    } else {
      toast.error('Please complete all security requirements');
    }
  };

  const cancelAssessment = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
    }
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    onSecurityFailed();
  };

  const renderIntroStep = () => (
    <div className="text-center space-y-6">
      <div className="flex justify-center">
        <Shield className="w-16 h-16 text-blue-500" />
      </div>
      <h2 className="text-2xl font-bold text-gray-800">Assessment Security Setup</h2>
      <p className="text-gray-600 max-w-md mx-auto">
        To ensure assessment integrity, we need to enable camera monitoring and fullscreen mode. 
        This helps maintain a secure testing environment.
      </p>
      
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-left">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-yellow-800">Security Requirements:</h4>
            <ul className="mt-2 text-sm text-yellow-700 space-y-1">
              <li>• Camera access for monitoring</li>
              <li>• Fullscreen mode (no tab switching)</li>
              <li>• Stable internet connection</li>
              <li>• No external applications</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex justify-center space-x-4">
        <button
          onClick={cancelAssessment}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={startCamera}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Camera className="w-4 h-4" />
          <span>Start Setup</span>
        </button>
      </div>
    </div>
  );

  const renderCameraStep = () => (
    <div className="text-center space-y-6">
      <div className="flex justify-center">
        <Camera className="w-16 h-16 text-green-500" />
      </div>
      <h2 className="text-2xl font-bold text-gray-800">Camera Setup</h2>
      
      {cameraError ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-red-700">
            <X className="w-5 h-5" />
            <p>{cameraError}</p>
          </div>
          <button
            onClick={startCamera}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Retry Camera Access
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-gray-100 rounded-lg p-4 max-w-md mx-auto">
            <video
              ref={videoRef}
              autoPlay
              muted
              className="w-full h-48 bg-black rounded-lg object-cover"
            />
          </div>
          <p className="text-gray-600">
            Camera is active. Please ensure you are clearly visible.
          </p>
          <button
            onClick={enterFullscreen}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 mx-auto"
          >
            <Monitor className="w-4 h-4" />
            <span>Enter Fullscreen</span>
          </button>
        </div>
      )}
    </div>
  );

  const renderFullscreenStep = () => (
    <div className="text-center space-y-6">
      <div className="flex justify-center">
        <Monitor className="w-16 h-16 text-purple-500" />
      </div>
      <h2 className="text-2xl font-bold text-gray-800">Fullscreen Activated</h2>
      <p className="text-gray-600">
        Security setup complete! You are now in fullscreen mode with camera monitoring.
      </p>
      
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center justify-center space-x-2 text-green-700">
          <Check className="w-5 h-5" />
          <span>All security requirements met</span>
        </div>
      </div>

      <button
        onClick={verifySecuritySetup}
        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
      >
        Begin Assessment
      </button>
    </div>
  );

  const renderVerifiedStep = () => (
    <div className="text-center space-y-6">
      <div className="flex justify-center">
        <Check className="w-16 h-16 text-green-500" />
      </div>
      <h2 className="text-2xl font-bold text-gray-800">Security Verified</h2>
      <p className="text-gray-600">Starting your assessment...</p>
      
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-8 max-w-2xl w-full"
      >
        {/* Progress Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              ['camera', 'fullscreen', 'verified'].includes(step) ? 'bg-green-500 text-white' : 'bg-gray-200'
            }`}>
              <Camera className="w-4 h-4" />
            </div>
            <div className={`w-16 h-1 ${
              ['fullscreen', 'verified'].includes(step) ? 'bg-green-500' : 'bg-gray-200'
            }`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              ['fullscreen', 'verified'].includes(step) ? 'bg-green-500 text-white' : 'bg-gray-200'
            }`}>
              <Monitor className="w-4 h-4" />
            </div>
            <div className={`w-16 h-1 ${
              step === 'verified' ? 'bg-green-500' : 'bg-gray-200'
            }`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step === 'verified' ? 'bg-green-500 text-white' : 'bg-gray-200'
            }`}>
              <Shield className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Step Content */}
        {step === 'intro' && renderIntroStep()}
        {step === 'camera' && renderCameraStep()}
        {step === 'fullscreen' && renderFullscreenStep()}
        {step === 'verified' && renderVerifiedStep()}
      </motion.div>
    </div>
  );
};
