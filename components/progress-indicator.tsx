
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, AlertCircle, Bot, Sparkles } from 'lucide-react';

interface Step {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
}

interface ProgressIndicatorProps {
  steps: Step[];
  currentStep?: string;
}

export function ProgressIndicator({ steps, currentStep }: ProgressIndicatorProps) {
  const getStepIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'processing':
        return <Clock className="h-5 w-5 text-blue-600 animate-spin" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStepColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'border-green-200 bg-green-50';
      case 'processing':
        return 'border-blue-200 bg-blue-50 magic-glow';
      case 'error':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Bot className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">OpenAI Processing Status</h3>
          <Sparkles className="h-4 w-4 text-yellow-500 animate-sparkle" />
        </div>
        
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex items-center space-x-4 p-4 rounded-lg border-2 transition-all duration-300 ${getStepColor(step.status)}`}
            >
              <div className="flex-shrink-0">
                {getStepIcon(step.status)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h4 className="text-sm font-medium text-gray-900">
                    {step.title}
                  </h4>
                  {step.status === 'processing' && (
                    <Badge className="bg-blue-100 text-blue-800 border-blue-300 animate-pulse">
                      🤖 OpenAI Working...
                    </Badge>
                  )}
                  {step.status === 'completed' && (
                    <Badge className="bg-green-100 text-green-800 border-green-300">
                      ✅ Complete
                    </Badge>
                  )}
                  {step.status === 'error' && (
                    <Badge className="bg-red-100 text-red-800 border-red-300">
                      ❌ Failed
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {step.description}
                </p>
              </div>
              
              <div className="flex-shrink-0">
                <div className={`w-2 h-8 rounded-full ${
                  step.status === 'completed' ? 'bg-green-400' :
                  step.status === 'processing' ? 'bg-blue-400 animate-pulse' :
                  step.status === 'error' ? 'bg-red-400' :
                  'bg-gray-300'
                }`} />
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-2">
            <Bot className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">
              Powered by OpenAI GPT-4o-mini Vision API
            </span>
          </div>
          <p className="text-xs text-blue-600 mt-1">
            Real AI analysis - no mock data or fallbacks
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
