
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  RefreshCw, 
  Globe, 
  TabletSmartphone, 
  Smartphone, 
  Monitor,
  AlertTriangle,
  CheckCircle,
  Trash2
} from 'lucide-react';

export function CacheInstructions() {
  const clearAllCaches = async () => {
    // Clear service worker cache
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      registrations.forEach(registration => registration.unregister());
    }

    // Clear browser cache (what we can access)
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
    }

    // Force reload with cache bypass
    window.location.reload();
  };

  const forceRefreshWithBypass = () => {
    // Add multiple cache-busting parameters
    const url = new URL(window.location.href);
    url.searchParams.set('_cb', Date.now().toString());
    url.searchParams.set('_v', Math.random().toString(36).substring(7));
    url.searchParams.set('_refresh', 'true');
    
    window.location.href = url.toString();
  };

  return (
    <Card className="border-2 border-orange-500 bg-gradient-to-br from-orange-50 to-red-50">
      <CardHeader className="text-center">
        <CardTitle className="text-xl font-bold text-orange-700 flex items-center justify-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Cache Troubleshooting - UPDATED VERSION
        </CardTitle>
        <div className="text-sm text-orange-600">
          If you don't see the latest changes, follow these steps:
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-red-100 border-2 border-red-300 p-4 rounded-lg">
          <div className="text-center text-red-700 font-bold mb-3">
            🔥 EMERGENCY CACHE CLEARING 🔥
          </div>
          <div className="flex gap-2 justify-center flex-wrap">
            <Button 
              onClick={clearAllCaches}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All Caches Now!
            </Button>
            <Button 
              onClick={forceRefreshWithBypass}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Force Refresh + Bypass
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-lg font-semibold text-blue-600">
              <Globe className="h-5 w-5" />
              Chrome / Edge / Safari
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Badge className="bg-blue-500">STEP 1</Badge>
                <span>Press <kbd className="px-2 py-1 bg-gray-200 rounded">Ctrl + Shift + R</kbd></span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-blue-500">STEP 2</Badge>
                <span>Or press <kbd className="px-2 py-1 bg-gray-200 rounded">Ctrl + F5</kbd></span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-green-500">ALT</Badge>
                <span>Right-click refresh button → "Empty Cache and Hard Reload"</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-lg font-semibold text-orange-600">
              <TabletSmartphone className="h-5 w-5" />
              Firefox
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Badge className="bg-orange-500">STEP 1</Badge>
                <span>Press <kbd className="px-2 py-1 bg-gray-200 rounded">Ctrl + Shift + R</kbd></span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-orange-500">STEP 2</Badge>
                <span>Or press <kbd className="px-2 py-1 bg-gray-200 rounded">Ctrl + F5</kbd></span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-green-500">ALT</Badge>
                <span>Open Developer Tools → Right-click refresh → "Empty Cache and Hard Reload"</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-lg font-semibold text-purple-600">
            <Smartphone className="h-5 w-5" />
            Mobile Devices
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge className="bg-purple-500">iOS Safari</Badge>
                <span>Settings → Safari → Clear History and Website Data</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-purple-500">iOS Chrome</Badge>
                <span>Chrome Menu → History → Clear Browsing Data</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge className="bg-green-600">Android</Badge>
                <span>Chrome Menu → History → Clear Browsing Data</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-green-600">Android</Badge>
                <span>Or use incognito/private browsing mode</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-green-100 border-2 border-green-300 p-4 rounded-lg">
          <div className="flex items-center justify-center gap-2 text-green-700 font-bold">
            <CheckCircle className="h-5 w-5" />
            UPDATED VERSION VERIFICATION
          </div>
          <div className="text-center text-sm text-green-600 mt-2">
            Look for: Green deployment banner at top, new timestamps, and "UPDATED" indicators throughout the page
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
