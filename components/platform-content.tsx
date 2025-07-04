
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { PlatformContent as PlatformContentType } from '@/lib/types';
import { 
  Copy, 
  Check, 
  Edit3, 
  Save, 
  X,
  Facebook, 
  Instagram, 
  Twitter,
  ShoppingBag,
  Package,
  MapPin,
  Palette,
  Globe,
  Music,
  Hash,
  Sparkles,
  Wand2,
  Star
} from 'lucide-react';

interface PlatformContentProps {
  content: PlatformContentType[];
}

const platformIcons = {
  facebook: Facebook,
  instagram: Instagram,
  tiktok: Music,
  poshmark: ShoppingBag,
  mercari: Package,
  craigslist: MapPin,
  etsy: Palette,
  website: Globe,
  x: Twitter
};

const platformColors = {
  facebook: 'text-blue-600 bg-blue-50 border-blue-200',
  instagram: 'text-pink-600 bg-pink-50 border-pink-200',
  tiktok: 'text-black bg-gray-50 border-gray-200',
  poshmark: 'text-purple-600 bg-purple-50 border-purple-200',
  mercari: 'text-orange-600 bg-orange-50 border-orange-200',
  craigslist: 'text-green-600 bg-green-50 border-green-200',
  etsy: 'text-orange-500 bg-orange-50 border-orange-200',
  website: 'text-blue-500 bg-blue-50 border-blue-200',
  x: 'text-gray-900 bg-gray-50 border-gray-200'
};

export function PlatformContent({ content }: PlatformContentProps) {
  const [copiedItems, setCopiedItems] = useState<Set<string>>(new Set());
  const [editingItems, setEditingItems] = useState<Set<string>>(new Set());
  const [editedContent, setEditedContent] = useState<Record<string, PlatformContentType>>({});

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItems(prev => new Set(Array.from(prev).concat([id])));
      setTimeout(() => {
        setCopiedItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const startEditing = (item: PlatformContentType) => {
    const id = `${item.platform}-edit`;
    setEditingItems(prev => new Set(Array.from(prev).concat([id])));
    setEditedContent(prev => ({ ...prev, [id]: { ...item } }));
  };

  const saveEdit = (id: string) => {
    setEditingItems(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  const cancelEdit = (id: string) => {
    setEditingItems(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
    setEditedContent(prev => {
      const newContent = { ...prev };
      delete newContent[id];
      return newContent;
    });
  };

  const updateEditedContent = (id: string, field: keyof PlatformContentType, value: string) => {
    setEditedContent(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value
      }
    }));
  };

  const getCharacterLimit = (platform: string, field: string) => {
    const limits: Record<string, Record<string, number>> = {
      x: { title: 100, description: 280 },
      instagram: { description: 2200, hashtags: 2200 },
      tiktok: { description: 2200, hashtags: 2200 },
      facebook: { title: 100, description: 8000 },
      poshmark: { title: 80, description: 8000 },
      mercari: { title: 80, description: 1000 },
      craigslist: { title: 70, description: 4000 },
      etsy: { title: 140, description: 13000 },
      website: { title: 200, description: 5000 }
    };
    
    return limits[platform]?.[field] || 1000;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold thrift-gradient-text flex items-center space-x-2">
            <Star className="h-6 w-6 animate-sparkle" />
            <span>✨ OpenAI-Generated Platform Content</span>
          </h2>
          <div className="flex items-center space-x-2 mt-2">
            <Badge className="bg-green-100 text-green-800 border-green-300">
              🤖 Powered by OpenAI
            </Badge>
            <span className="text-sm text-gray-600">Platform-optimized content generated by AI</span>
          </div>
        </div>
        <Badge className="bg-gradient-to-r from-purple-100 to-yellow-100 text-thrift-purple border-purple-200">
          <Sparkles className="h-3 w-3 mr-1" />
          {content.length} Platform{content.length !== 1 ? 's' : ''}
        </Badge>
      </div>
      
      <div className="grid gap-6">
        {content.map((item) => {
          const Icon = platformIcons[item.platform as keyof typeof platformIcons] || Globe;
          const colorClass = platformColors[item.platform as keyof typeof platformColors] || 'text-gray-600 bg-gray-50 border-gray-200';
          const editId = `${item.platform}-edit`;
          const isEditing = editingItems.has(editId);
          const currentContent = isEditing ? editedContent[editId] : item;
          
          return (
            <Card key={item.platform} className="overflow-hidden magic-glow border-purple-100 card-hover">
              <CardHeader className="pb-3 bg-gradient-to-r from-purple-50 to-yellow-50">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-3">
                    <div className={`p-3 rounded-xl ${colorClass} magic-glow`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <span className="capitalize font-bold text-gray-900">{item.platform === 'x' ? 'X (Twitter)' : item.platform}</span>
                      <div className="flex items-center space-x-1 mt-1">
                        <Sparkles className="h-3 w-3 text-thrift-purple" />
                        <span className="text-xs text-thrift-purple font-medium">Magically Optimized</span>
                      </div>
                    </div>
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    {!isEditing ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => startEditing(item)}
                        className="text-thrift-purple hover:bg-purple-100 btn-animate"
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                    ) : (
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => saveEdit(editId)}
                          className="text-green-600 hover:bg-green-100 btn-animate"
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => cancelEdit(editId)}
                          className="text-red-600 hover:bg-red-100 btn-animate"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Title */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Title</label>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-muted-foreground">
                        {currentContent?.title?.length || 0}/{getCharacterLimit(item.platform, 'title')}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(currentContent?.title || '', `${item.platform}-title`)}
                        className="h-6 w-6 p-0"
                      >
                        {copiedItems.has(`${item.platform}-title`) ? (
                          <Check className="h-3 w-3 text-green-600" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  {isEditing ? (
                    <Textarea
                      value={currentContent?.title || ''}
                      onChange={(e) => updateEditedContent(editId, 'title', e.target.value)}
                      className="min-h-[60px] resize-none"
                      maxLength={getCharacterLimit(item.platform, 'title')}
                    />
                  ) : (
                    <div className="p-3 bg-muted/50 rounded-lg text-sm">
                      {currentContent?.title}
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Description</label>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-muted-foreground">
                        {currentContent?.description?.length || 0}/{getCharacterLimit(item.platform, 'description')}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(currentContent?.description || '', `${item.platform}-description`)}
                        className="h-6 w-6 p-0"
                      >
                        {copiedItems.has(`${item.platform}-description`) ? (
                          <Check className="h-3 w-3 text-green-600" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  {isEditing ? (
                    <Textarea
                      value={currentContent?.description || ''}
                      onChange={(e) => updateEditedContent(editId, 'description', e.target.value)}
                      className="min-h-[120px]"
                      maxLength={getCharacterLimit(item.platform, 'description')}
                    />
                  ) : (
                    <div className="p-3 bg-muted/50 rounded-lg text-sm whitespace-pre-wrap max-h-40 overflow-y-auto">
                      {currentContent?.description}
                    </div>
                  )}
                </div>

                {/* Hashtags */}
                {currentContent?.hashtags && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium flex items-center space-x-1">
                        <Hash className="h-4 w-4" />
                        <span>Hashtags</span>
                      </label>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-muted-foreground">
                          {currentContent.hashtags.length}/{getCharacterLimit(item.platform, 'hashtags')}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(currentContent.hashtags || '', `${item.platform}-hashtags`)}
                          className="h-6 w-6 p-0"
                        >
                          {copiedItems.has(`${item.platform}-hashtags`) ? (
                            <Check className="h-3 w-3 text-green-600" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    {isEditing ? (
                      <Textarea
                        value={currentContent.hashtags}
                        onChange={(e) => updateEditedContent(editId, 'hashtags', e.target.value)}
                        className="min-h-[80px] resize-none"
                        maxLength={getCharacterLimit(item.platform, 'hashtags')}
                      />
                    ) : (
                      <div className="p-3 bg-muted/50 rounded-lg text-sm">
                        {currentContent.hashtags}
                      </div>
                    )}
                  </div>
                )}

                {/* Copy All Button */}
                <div className="pt-2 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const fullContent = [
                        currentContent?.title,
                        currentContent?.description,
                        currentContent?.hashtags
                      ].filter(Boolean).join('\n\n');
                      copyToClipboard(fullContent, `${item.platform}-all`);
                    }}
                    className="w-full"
                  >
                    {copiedItems.has(`${item.platform}-all`) ? (
                      <>
                        <Check className="h-4 w-4 mr-2 text-green-600" />
                        Copied All Content!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy All Content
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
