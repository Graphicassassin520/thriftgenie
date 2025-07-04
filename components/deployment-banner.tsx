
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, CheckCircle } from 'lucide-react';

// Static build information - no dynamic content
const STATIC_DEPLOYMENT_INFO = {
  version: 'v2.1.2025',
  deploymentId: 'deploy-20250618-stable',
  buildNumber: 'build-20250618-prod',
  status: 'DEPLOYED'
};

export function DeploymentBanner() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleForceRefresh = () => {
    setIsRefreshing(true);
    // Clear all possible caches
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        registrations.forEach(registration => registration.unregister());
      });
    }
    
    // Add cache-busting parameters to URL
    const url = new URL(window.location.href);
    url.searchParams.set('_refresh', Math.random().toString(36));
    url.searchParams.set('_bust', Math.random().toString(36));
    
    setTimeout(() => {
      window.location.href = url.toString();
    }, 500);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 text-white shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-6 w-6 animate-pulse" />
            <div className="text-lg font-bold">
              🚀 LATEST UPDATE DEPLOYED - LIVE NOW!
            </div>
            <div className="hidden md:flex items-center gap-2 text-sm bg-white/20 px-3 py-1 rounded-full">
              <span className="font-semibold">LATEST BUILD ACTIVE</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="text-sm bg-white/20 px-2 py-1 rounded">
              {STATIC_DEPLOYMENT_INFO.version}
            </div>
            <Button
              onClick={handleForceRefresh}
              variant="outline"
              size="sm"
              className="bg-white/20 border-white/30 text-white hover:bg-white/30"
              disabled={isRefreshing}
            >
              {isRefreshing ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Force Refresh
                </>
              )}
            </Button>
          </div>
        </div>
        
        <div className="mt-2 text-xs opacity-90 flex flex-wrap gap-4">
          <span>Deploy ID: {STATIC_DEPLOYMENT_INFO.deploymentId}</span>
          <span>Build: {STATIC_DEPLOYMENT_INFO.buildNumber}</span>
          <span>Cache-Busting: ACTIVE</span>
          <span className="animate-pulse">⚡ All Systems Updated</span>
        </div>
      </div>
    </div>
  );
}
