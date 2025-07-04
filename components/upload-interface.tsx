
'use client';

import { useState, useCallback, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Sparkles, Wand2, Camera, Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Image from 'next/image';
import { Platform } from '@/lib/types';

interface UploadInterfaceProps {
  onImagesUploaded: (files: File[]) => void;
  onAnalysisStart?: () => void;
  onAnalysisComplete?: (results: any) => void;
  onAnalysisError?: (error: string) => void;
  selectedPlatforms: Platform[];
  maxFiles?: number;
}

interface AnalysisState {
  isLoading: boolean;
  error: string | null;
  results: any | null;
  progress: string;
}

export function UploadInterface({ 
  onImagesUploaded, 
  onAnalysisStart,
  onAnalysisComplete,
  onAnalysisError,
  selectedPlatforms,
  maxFiles = 10 
}: UploadInterfaceProps) {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [analysisState, setAnalysisState] = useState<AnalysisState>({
    isLoading: false,
    error: null,
    results: null,
    progress: ''
  });
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      const newFiles = [...uploadedFiles, ...fileArray].slice(0, maxFiles);
      setUploadedFiles(newFiles);
      
      // Create preview URLs
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setPreviews(newPreviews);
      
      onImagesUploaded(newFiles);
    }
  }, [uploadedFiles, maxFiles, onImagesUploaded]);

  const handleCameraCapture = () => {
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  };

  const handleCameraChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      handleFileChange(event);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    
    // Revoke the URL to prevent memory leaks
    URL.revokeObjectURL(previews[index]);
    
    setUploadedFiles(newFiles);
    setPreviews(newPreviews);
    onImagesUploaded(newFiles);
  };

  const clearAll = () => {
    previews.forEach(url => URL.revokeObjectURL(url));
    setUploadedFiles([]);
    setPreviews([]);
    onImagesUploaded([]);
    setAnalysisState({
      isLoading: false,
      error: null,
      results: null,
      progress: ''
    });
  };

  // Convert file to base64 data URL for the API
  const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // CRITICAL: Submit button functionality for analysis
  const handleSubmitForAnalysis = async () => {
    if (uploadedFiles.length === 0) {
      setAnalysisState(prev => ({
        ...prev,
        error: 'Please upload at least one image before analyzing.'
      }));
      return;
    }

    if (selectedPlatforms.length === 0) {
      setAnalysisState(prev => ({
        ...prev,
        error: 'Please select at least one platform before analyzing.'
      }));
      return;
    }

    setAnalysisState({
      isLoading: true,
      error: null,
      results: null,
      progress: 'Preparing images for analysis...'
    });

    if (onAnalysisStart) {
      onAnalysisStart();
    }

    try {
      // For now, we'll use the first uploaded file
      const firstFile = uploadedFiles[0];
      
      setAnalysisState(prev => ({
        ...prev,
        progress: 'Converting image to data URL...'
      }));
      
      // Convert file to data URL
      const imageUrl = await fileToDataUrl(firstFile);
      
      setAnalysisState(prev => ({
        ...prev,
        progress: 'Sending to AI for analysis...'
      }));

      // Call the analyze API
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl: imageUrl,
          platforms: selectedPlatforms
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed');
      }

      setAnalysisState({
        isLoading: false,
        error: null,
        results: data,
        progress: 'Analysis completed successfully!'
      });

      if (onAnalysisComplete) {
        onAnalysisComplete(data);
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Analysis failed';
      setAnalysisState({
        isLoading: false,
        error: errorMessage,
        results: null,
        progress: ''
      });

      if (onAnalysisError) {
        onAnalysisError(errorMessage);
      }
    }
  };

  const canSubmit = uploadedFiles.length > 0 && selectedPlatforms.length > 0 && !analysisState.isLoading;

  return (
    <div className="mobile-gap-4">
      {/* MASSIVE DEPLOYMENT INDICATOR - NEW */}
      <div className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 p-6 rounded-xl border-4 border-white shadow-2xl mb-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-2 animate-pulse">
            🚀 DEPLOYMENT TEST VERSION 3.0 - UPLOAD INTERFACE FIXED! 🚀
          </h2>
          <p className="text-xl text-white font-semibold">
            ✅ Submit Button Added • ✅ Analysis Workflow Complete • ✅ All Systems GO!
          </p>
          <div className="text-lg text-yellow-200 mt-2 animate-bounce">
            🔥 This version includes the WORKING submit functionality! 🔥
          </div>
        </div>
      </div>

      {/* Error Display */}
      {analysisState.error && (
        <Alert className="bg-red-50 border-red-500 mb-4">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <AlertDescription className="text-red-700 font-medium">
            {analysisState.error}
          </AlertDescription>
        </Alert>
      )}

      {/* Success Display */}
      {analysisState.results && (
        <Alert className="bg-green-50 border-green-500 mb-4">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertDescription className="text-green-700 font-medium">
            Analysis completed successfully! Check results below.
          </AlertDescription>
        </Alert>
      )}

      {/* Progress Display */}
      {analysisState.isLoading && (
        <Alert className="bg-blue-50 border-blue-500 mb-4">
          <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
          <AlertDescription className="text-blue-700 font-medium">
            {analysisState.progress}
          </AlertDescription>
        </Alert>
      )}

      {/* Mobile-Optimized Upload Area */}
      <Card className="border-2 border-dashed border-purple-200 transition-all hover:border-thrift-purple/50 magic-glow card-mobile">
        <CardContent className="mobile-p-6">
          <div
            className={`cursor-pointer text-center transition-colors text-muted-foreground ${uploadedFiles.length >= maxFiles ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => document.getElementById('file-input')?.click()}
          >
            <input 
              id="file-input"
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              disabled={uploadedFiles.length >= maxFiles}
            />
            <div className="flex flex-col items-center mobile-gap-4">
              <div className="p-4 sm:p-6 rounded-full thrift-purple-gradient animate-float">
                <Wand2 className="h-8 w-8 sm:h-12 sm:w-12 text-white animate-sparkle" />
              </div>
              <div className="space-y-2 sm:space-y-3">
                <h3 className="mobile-text-2xl font-bold thrift-gradient-text">
                  Upload Your Product Photos
                </h3>
                <p className="mobile-text-lg text-gray-600 leading-relaxed px-2">
                  {uploadedFiles.length >= maxFiles
                    ? `Maximum ${maxFiles} magical files reached`
                    : `Click to select your photos (${uploadedFiles.length}/${maxFiles})`}
                </p>
                <p className="text-sm sm:text-base text-thrift-purple font-medium">
                  ✨ Supports: JPEG, PNG, WebP, GIF ✨
                </p>
                <p className="text-xs sm:text-sm text-gray-500 px-2">
                  Let ThriftGenie transform your photos into perfect listings
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mobile Camera Button */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <Button
          onClick={handleCameraCapture}
          className="bg-thrift-gold hover:bg-yellow-600 text-white btn-mobile-lg flex-1 magic-glow"
          disabled={uploadedFiles.length >= maxFiles}
        >
          <Camera className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
          Take Photo with Camera
        </Button>
        
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleCameraChange}
          className="hidden"
          multiple={maxFiles > 1}
        />
        
        {uploadedFiles.length > 0 && (
          <Button
            variant="outline"
            onClick={clearAll}
            className="border-red-300 text-red-600 hover:bg-red-50 btn-mobile sm:w-auto"
          >
            <X className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        )}
      </div>

      {/* CRITICAL: SUBMIT BUTTON FOR ANALYSIS - This was missing! */}
      {uploadedFiles.length > 0 && (
        <div className="bg-gradient-to-r from-green-100 to-blue-100 p-6 rounded-xl border-4 border-green-400 shadow-lg">
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold text-green-700 flex items-center justify-center gap-2">
              <Send className="h-6 w-6" />
              Ready to Analyze Your Photos!
              <Sparkles className="h-6 w-6 animate-pulse" />
            </h3>
            
            <p className="text-lg text-gray-700">
              {selectedPlatforms.length === 0 
                ? "⚠️ Please select platforms below, then click Submit to analyze your photos!"
                : `✅ Ready to analyze for: ${selectedPlatforms.join(', ')}`
              }
            </p>

            <Button
              onClick={handleSubmitForAnalysis}
              disabled={!canSubmit}
              className={`text-xl px-8 py-4 rounded-xl font-bold transition-all transform hover:scale-105 ${
                canSubmit 
                  ? 'bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {analysisState.isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5 mr-2" />
                  🚀 SUBMIT FOR AI ANALYSIS 🚀
                </>
              )}
            </Button>

            {!canSubmit && !analysisState.isLoading && (
              <p className="text-sm text-red-600 font-medium">
                {uploadedFiles.length === 0 && "Upload photos first • "}
                {selectedPlatforms.length === 0 && "Select platforms first • "}
                Ready to go!
              </p>
            )}
          </div>
        </div>
      )}

      {/* Mobile-Optimized Preview Grid */}
      {uploadedFiles.length > 0 && (
        <div className="mobile-gap-4">
          <div className="flex items-center justify-between">
            <h3 className="mobile-text-xl font-bold thrift-gradient-text">
              ✨ Your Magical Images ({uploadedFiles.length})
            </h3>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {previews.map((preview, index) => (
              <Card key={index} className="relative group overflow-hidden card-mobile magic-glow border-purple-100">
                <CardContent className="p-2 sm:p-3">
                  <div className="relative aspect-square bg-purple-50 rounded-lg overflow-hidden">
                    <Image
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1 sm:top-2 sm:right-2 h-6 w-6 sm:h-7 sm:w-7 p-0 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600"
                      onClick={() => removeFile(index)}
                    >
                      <X className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                    <div className="absolute bottom-1 left-1 sm:bottom-2 sm:left-2 bg-thrift-purple/80 text-white px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-xs font-medium">
                      <Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3 inline mr-1" />
                      <span className="hidden sm:inline">Ready for Magic</span>
                      <span className="sm:hidden">Ready</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mt-1 sm:mt-2 truncate font-medium">
                    {uploadedFiles[index].name}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Analysis Results Display */}
      {analysisState.results && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl border-4 border-purple-400 shadow-lg">
          <h3 className="text-2xl font-bold text-purple-700 mb-4 text-center">
            🎉 Analysis Results - AI Powered! 🎉
          </h3>
          <div className="bg-white p-4 rounded-lg border border-purple-200">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap overflow-auto max-h-96">
              {JSON.stringify(analysisState.results, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
