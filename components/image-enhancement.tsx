
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { ImageEnhancementOptions } from '@/lib/types';
import { 
  Wand2, 
  Scissors, 
  Sun, 
  Palette,
  Sparkles,
  RotateCcw,
  Contrast,
  Lightbulb,
  Star,
  Zap
} from 'lucide-react';

interface ImageEnhancementProps {
  onEnhance: (options: ImageEnhancementOptions, customAdjustments?: any) => void;
  isProcessing: boolean;
}

export function ImageEnhancement({ onEnhance, isProcessing }: ImageEnhancementProps) {
  const [options, setOptions] = useState<ImageEnhancementOptions>({
    removeBackground: false,
    correctLighting: false,
    backgroundType: 'none'
  });
  
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [brightness, setBrightness] = useState([0]);
  const [contrast, setContrast] = useState([0]);
  const [saturation, setSaturation] = useState([0]);

  const handleEnhance = () => {
    const customAdjustments = {
      brightness: brightness[0],
      contrast: contrast[0],
      saturation: saturation[0]
    };
    
    onEnhance(options, customAdjustments);
  };

  const resetOptions = () => {
    setOptions({
      removeBackground: false,
      correctLighting: false,
      backgroundType: 'none'
    });
    setBrightness([0]);
    setContrast([0]);
    setSaturation([0]);
  };

  return (
    <Card className="magic-glow border-purple-100 card-mobile">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-yellow-50 mobile-p-4">
        <CardTitle className="flex items-center space-x-2 thrift-gradient-text mobile-text-xl">
          <Wand2 className="h-5 w-5 sm:h-6 sm:w-6 animate-sparkle" />
          <span>Magical Image Enhancement</span>
          <Star className="h-3 w-3 sm:h-4 sm:w-4 animate-sparkle" />
        </CardTitle>
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
          ✨ Let ThriftGenie enchant your product images to captivate buyers
        </p>
      </CardHeader>
      <CardContent className="mobile-gap-4">
        {/* Mobile-Optimized Quick Enhancement Options */}
        <div className="space-y-3 sm:space-y-4">
          <h3 className="font-semibold text-sm sm:text-base text-thrift-purple flex items-center space-x-2">
            <Zap className="h-4 w-4" />
            <span>Quick Magic Spells</span>
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 rounded-lg border border-purple-100 hover:bg-purple-50 transition-colors">
              <Checkbox
                id="remove-bg"
                checked={options.removeBackground}
                onCheckedChange={(checked) => 
                  setOptions(prev => ({ ...prev, removeBackground: checked as boolean }))
                }
                className="data-[state=checked]:bg-thrift-purple data-[state=checked]:border-thrift-purple"
              />
              <div className="flex items-center space-x-2 flex-1">
                <Scissors className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="remove-bg" className="text-sm sm:text-base cursor-pointer">Remove Background</Label>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 rounded-lg border border-purple-100 hover:bg-purple-50 transition-colors">
              <Checkbox
                id="correct-lighting"
                checked={options.correctLighting}
                onCheckedChange={(checked) => 
                  setOptions(prev => ({ ...prev, correctLighting: checked as boolean }))
                }
                className="data-[state=checked]:bg-thrift-purple data-[state=checked]:border-thrift-purple"
              />
              <div className="flex items-center space-x-2 flex-1">
                <Sun className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="correct-lighting" className="text-sm sm:text-base cursor-pointer">Auto-Correct Lighting</Label>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile-Optimized Background Selection */}
        {options.removeBackground && (
          <div className="space-y-3">
            <h3 className="font-medium text-sm sm:text-base flex items-center space-x-2">
              <Palette className="h-4 w-4" />
              <span>Background Style</span>
            </h3>
            
            <RadioGroup
              value={options.backgroundType}
              onValueChange={(value) => 
                setOptions(prev => ({ ...prev, backgroundType: value as any }))
              }
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="white" id="bg-white" />
                  <Label htmlFor="bg-white" className="text-sm sm:text-base cursor-pointer flex-1">Clean White</Label>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="gradient" id="bg-gradient" />
                  <Label htmlFor="bg-gradient" className="text-sm sm:text-base cursor-pointer flex-1">Soft Gradient</Label>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="lifestyle" id="bg-lifestyle" />
                  <Label htmlFor="bg-lifestyle" className="text-sm sm:text-base cursor-pointer flex-1">Lifestyle Scene</Label>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="none" id="bg-none" />
                  <Label htmlFor="bg-none" className="text-sm sm:text-base cursor-pointer flex-1">Transparent</Label>
                </div>
              </div>
            </RadioGroup>
          </div>
        )}

        {/* Advanced Controls */}
        <div className="space-y-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="p-0 h-auto font-medium text-sm"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            {showAdvanced ? 'Hide' : 'Show'} Advanced Controls
          </Button>
          
          {showAdvanced && (
            <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
              <div className="space-y-2">
                <Label className="text-sm flex items-center space-x-2">
                  <Lightbulb className="h-4 w-4" />
                  <span>Brightness: {brightness[0]}</span>
                </Label>
                <Slider
                  value={brightness}
                  onValueChange={setBrightness}
                  min={-50}
                  max={50}
                  step={1}
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm flex items-center space-x-2">
                  <Contrast className="h-4 w-4" />
                  <span>Contrast: {contrast[0]}</span>
                </Label>
                <Slider
                  value={contrast}
                  onValueChange={setContrast}
                  min={-50}
                  max={50}
                  step={1}
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm flex items-center space-x-2">
                  <Palette className="h-4 w-4" />
                  <span>Saturation: {saturation[0]}</span>
                </Label>
                <Slider
                  value={saturation}
                  onValueChange={setSaturation}
                  min={-50}
                  max={50}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>
          )}
        </div>

        {/* Mobile-Optimized Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-purple-100">
          <Button
            onClick={handleEnhance}
            disabled={isProcessing}
            className="flex-1 bg-thrift-purple hover:bg-purple-700 text-white btn-mobile-lg magic-glow"
          >
            {isProcessing ? (
              <>
                <Wand2 className="h-4 w-4 sm:h-5 sm:w-5 mr-2 animate-spin" />
                Casting Magic...
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                ✨ Cast Enhancement Spell
              </>
            )}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={resetOptions}
            className="border-gray-300 text-gray-600 hover:bg-gray-100 btn-mobile sm:w-auto"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
        
        {(options.removeBackground || options.correctLighting) && (
          <div className="text-xs text-gray-700 bg-gradient-to-r from-purple-50 to-yellow-50 p-4 rounded-lg border border-purple-200 magic-glow">
            <p className="font-semibold mb-2 text-thrift-purple flex items-center space-x-1">
              <Sparkles className="h-3 w-3" />
              <span>✨ Magic Spell Preview:</span>
            </p>
            <ul className="space-y-1">
              {options.removeBackground && (
                <li>• Background will be magically removed and replaced with {options.backgroundType} style</li>
              )}
              {options.correctLighting && (
                <li>• Lighting and exposure will be enchanted for perfect illumination</li>
              )}
              {showAdvanced && (brightness[0] !== 0 || contrast[0] !== 0 || saturation[0] !== 0) && (
                <li>• Custom magical adjustments will be applied</li>
              )}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
