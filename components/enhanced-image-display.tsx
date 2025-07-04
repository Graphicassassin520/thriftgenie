
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  Eye, 
  EyeOff, 
  Sparkles, 
  Clock,
  CheckCircle,
  ArrowLeftRight,
  Zap
} from 'lucide-react';
import Image from 'next/image';

interface EnhancedImageDisplayProps {
  originalImageUrl: string;
  enhancedImageUrl: string;
  options: any;
  customAdjustments?: any;
  processingTime?: number;
}

export function EnhancedImageDisplay({ 
  originalImageUrl, 
  enhancedImageUrl, 
  options, 
  customAdjustments,
  processingTime 
}: EnhancedImageDisplayProps) {
  const [showComparison, setShowComparison] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      
      // Convert data URL to blob for download
      const response = await fetch(enhancedImageUrl);
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `enhanced-image-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const getEnhancementSummary = () => {
    const enhancements = [];
    
    if (options.removeBackground) {
      enhancements.push(`Background removed (${options.backgroundType})`);
    }
    if (options.correctLighting) {
      enhancements.push('Lighting corrected');
    }
    if (customAdjustments) {
      if (customAdjustments.brightness !== 0) {
        enhancements.push(`Brightness ${customAdjustments.brightness > 0 ? '+' : ''}${customAdjustments.brightness}`);
      }
      if (customAdjustments.contrast !== 0) {
        enhancements.push(`Contrast ${customAdjustments.contrast > 0 ? '+' : ''}${customAdjustments.contrast}`);
      }
      if (customAdjustments.saturation !== 0) {
        enhancements.push(`Saturation ${customAdjustments.saturation > 0 ? '+' : ''}${customAdjustments.saturation}`);
      }
    }
    
    return enhancements;
  };

  return (
    <Card className="magic-glow border-green-100 card-mobile">
      <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 mobile-p-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-green-700">
            <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="mobile-text-xl">✨ Enhancement Complete!</span>
          </div>
          {processingTime && (
            <Badge variant="secondary" className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>{(processingTime / 1000).toFixed(1)}s</span>
            </Badge>
          )}
        </CardTitle>
        
        {/* Enhancement Summary */}
        <div className="space-y-2">
          <p className="text-xs sm:text-sm text-gray-600">
            Applied enhancements:
          </p>
          <div className="flex flex-wrap gap-2">
            {getEnhancementSummary().map((enhancement, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                <Sparkles className="h-3 w-3 mr-1" />
                {enhancement}
              </Badge>
            ))}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="mobile-gap-4">
        {/* Comparison Toggle */}
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm sm:text-base">Enhanced Image</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowComparison(!showComparison)}
            className="flex items-center space-x-2"
          >
            {showComparison ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            <span>{showComparison ? 'Hide' : 'Show'} Comparison</span>
          </Button>
        </div>
        
        {/* Image Display */}
        <div className="space-y-4">
          {showComparison ? (
            // Before/After Comparison
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">Original</Badge>
                </div>
                <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={originalImageUrl}
                    alt="Original image"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Badge className="bg-green-600 hover:bg-green-700">Enhanced</Badge>
                  <ArrowLeftRight className="h-4 w-4 text-green-600" />
                </div>
                <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden magic-glow">
                  <Image
                    src={enhancedImageUrl}
                    alt="Enhanced image"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          ) : (
            // Enhanced Image Only
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Badge className="bg-green-600 hover:bg-green-700">Enhanced Image</Badge>
                <Zap className="h-4 w-4 text-green-600" />
              </div>
              <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden magic-glow">
                <Image
                  src={enhancedImageUrl}
                  alt="Enhanced image"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-green-100">
          <Button
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white btn-mobile-lg"
          >
            {isDownloading ? (
              <>
                <Download className="h-4 w-4 sm:h-5 sm:w-5 mr-2 animate-spin" />
                Downloading...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Download Enhanced Image
              </>
            )}
          </Button>
        </div>
        
        {/* Enhancement Details */}
        <div className="text-xs text-gray-700 bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
          <p className="font-semibold mb-2 text-green-700 flex items-center space-x-1">
            <Sparkles className="h-3 w-3" />
            <span>✨ Enhancement Details:</span>
          </p>
          <ul className="space-y-1">
            {options.removeBackground && (
              <li>• Background magically removed and replaced with {options.backgroundType} style</li>
            )}
            {options.correctLighting && (
              <li>• Lighting and exposure automatically optimized for perfect illumination</li>
            )}
            {customAdjustments && (customAdjustments.brightness !== 0 || customAdjustments.contrast !== 0 || customAdjustments.saturation !== 0) && (
              <li>• Custom adjustments applied for personalized enhancement</li>
            )}
            <li>• Image optimized for web delivery and marketplace listings</li>
            <li>• Processing completed in {processingTime ? (processingTime / 1000).toFixed(1) : '0'}s</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
