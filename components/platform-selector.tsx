
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Platform } from '@/lib/types';
import { 
  Facebook, 
  Instagram, 
  Twitter,
  ShoppingBag,
  Package,
  MapPin,
  Palette,
  Globe,
  Music,
  Sparkles,
  Wand2
} from 'lucide-react';

interface PlatformSelectorProps {
  selectedPlatforms: Platform[];
  onPlatformsChange: (platforms: Platform[]) => void;
}

const platformConfig = [
  {
    id: 'facebook' as Platform,
    name: 'Facebook Marketplace',
    description: 'Professional, detailed descriptions for local sales',
    icon: Facebook,
    color: 'text-blue-600'
  },
  {
    id: 'instagram' as Platform,
    name: 'Instagram',
    description: 'Visual-focused content with trending hashtags',
    icon: Instagram,
    color: 'text-pink-600'
  },
  {
    id: 'tiktok' as Platform,
    name: 'TikTok',
    description: 'Casual tone with viral hashtags and emojis',
    icon: Music,
    color: 'text-black'
  },
  {
    id: 'poshmark' as Platform,
    name: 'Poshmark',
    description: 'Fashion-focused, community-driven content',
    icon: ShoppingBag,
    color: 'text-purple-600'
  },
  {
    id: 'mercari' as Platform,
    name: 'Mercari',
    description: 'Simple, direct descriptions for quick sales',
    icon: Package,
    color: 'text-orange-600'
  },
  {
    id: 'craigslist' as Platform,
    name: 'Craigslist',
    description: 'Straightforward, local-focused listings',
    icon: MapPin,
    color: 'text-green-600'
  },
  {
    id: 'etsy' as Platform,
    name: 'Etsy',
    description: 'Creative, artisanal tone for unique items',
    icon: Palette,
    color: 'text-orange-500'
  },
  {
    id: 'website' as Platform,
    name: 'Personal Website',
    description: 'Professional, SEO-optimized content',
    icon: Globe,
    color: 'text-blue-500'
  },
  {
    id: 'x' as Platform,
    name: 'X (Twitter)',
    description: 'Concise, engaging posts with character limits',
    icon: Twitter,
    color: 'text-gray-900'
  }
];

export function PlatformSelector({ selectedPlatforms, onPlatformsChange }: PlatformSelectorProps) {
  const handlePlatformToggle = (platform: Platform) => {
    if (selectedPlatforms.includes(platform)) {
      onPlatformsChange(selectedPlatforms.filter(p => p !== platform));
    } else {
      onPlatformsChange([...selectedPlatforms, platform]);
    }
  };

  const selectAll = () => {
    onPlatformsChange(platformConfig.map(p => p.id));
  };

  const clearAll = () => {
    onPlatformsChange([]);
  };

  return (
    <Card className="magic-glow border-purple-100 card-mobile">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-yellow-50 mobile-p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <CardTitle className="flex items-center space-x-2 thrift-gradient-text mobile-text-xl">
            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 animate-sparkle" />
            <span>Choose Your Magic Platforms</span>
          </CardTitle>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={selectAll}
              className="border-thrift-purple text-thrift-purple hover:bg-thrift-purple hover:text-white btn-mobile text-xs sm:text-sm flex-1 sm:flex-none"
            >
              <Wand2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              Select All
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearAll}
              className="border-gray-300 text-gray-600 hover:bg-gray-100 btn-mobile text-xs sm:text-sm flex-1 sm:flex-none"
            >
              Clear All
            </Button>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
          ✨ Choose which platforms you want ThriftGenie to cast its magic on
        </p>
      </CardHeader>
      <CardContent className="mobile-p-4">
        <div className="mobile-grid">
          {platformConfig.map((platform) => {
            const Icon = platform.icon;
            const isSelected = selectedPlatforms.includes(platform.id);
            
            return (
              <Card 
                key={platform.id}
                className={`cursor-pointer transition-all card-mobile ${
                  isSelected 
                    ? 'ring-2 ring-thrift-purple bg-purple-50 magic-glow border-thrift-purple' 
                    : 'border-gray-200 hover:border-thrift-purple/50'
                }`}
                onClick={() => handlePlatformToggle(platform.id)}
              >
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      checked={isSelected}
                      onChange={() => handlePlatformToggle(platform.id)}
                      className="mt-1 data-[state=checked]:bg-thrift-purple data-[state=checked]:border-thrift-purple"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${platform.color}`} />
                        <h3 className="font-semibold text-sm sm:text-base text-gray-900 leading-tight">{platform.name}</h3>
                        {isSelected && (
                          <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-thrift-purple animate-sparkle" />
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                        {platform.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        {selectedPlatforms.length > 0 && (
          <div className="mt-6 p-4 bg-gradient-to-r from-purple-100 to-yellow-100 rounded-xl border border-purple-200 magic-glow">
            <div className="flex items-center space-x-2 mb-2">
              <Wand2 className="h-5 w-5 text-thrift-purple" />
              <p className="text-sm font-bold text-thrift-purple">
                ✨ Magic Selected: {selectedPlatforms.length} platform{selectedPlatforms.length !== 1 ? 's' : ''}
              </p>
            </div>
            <p className="text-xs text-gray-700">
              ThriftGenie will create enchanted content for: <span className="font-medium">{selectedPlatforms.join(', ')}</span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
