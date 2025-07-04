
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  DollarSign, 
  Package, 
  Palette, 
  Ruler, 
  ShoppingBag,
  Star,
  Clock,
  Eye
} from 'lucide-react';

interface AnalysisData {
  analysis: {
    category: string;
    condition: string;
    material: string;
    color: string;
    brand: string;
    dimensions: string;
    features: string[];
    description: string;
  };
  pricing: {
    suggested_price_usd: number;
    pricing_reasoning: string;
    market_factors: string[];
  };
  platformContent: Array<{
    platform: string;
    title: string;
    description: string;
    hashtags: string[];
  }>;
  processingTimeMs: number;
}

interface AnalysisResultsProps {
  data: AnalysisData;
  powered_by?: string;
}

export function AnalysisResults({ data, powered_by = "AI Analysis" }: AnalysisResultsProps) {
  const { analysis, pricing, platformContent, processingTimeMs } = data;

  return (
    <div className="space-y-6">
      {/* DEPLOYMENT VERSION BANNER */}
      <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-4 rounded-xl text-center">
        <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
          <Star className="h-6 w-6 animate-spin" />
          ANALYSIS RESULTS - VERSION 3.0 DEPLOYED!
          <Star className="h-6 w-6 animate-spin" />
        </h2>
        <p className="text-lg">✅ Submit button working • ✅ Analysis complete • ✅ Results displayed!</p>
      </div>

      {/* Header with Processing Info */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-700">
            <Sparkles className="h-5 w-5" />
            AI Analysis Complete!
            <Badge variant="secondary" className="ml-auto">
              <Clock className="h-3 w-3 mr-1" />
              {processingTimeMs}ms
            </Badge>
          </CardTitle>
          <p className="text-sm text-purple-600">Powered by {powered_by}</p>
        </CardHeader>
      </Card>

      {/* Product Analysis */}
      <Card className="border-2 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-700">
            <Eye className="h-5 w-5" />
            Product Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <Package className="h-4 w-4" />
                Category
              </h4>
              <Badge variant="outline">{analysis.category}</Badge>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <Star className="h-4 w-4" />
                Condition
              </h4>
              <Badge variant="outline">{analysis.condition}</Badge>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Color
              </h4>
              <Badge variant="outline">{analysis.color}</Badge>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold">Material</h4>
              <Badge variant="outline">{analysis.material}</Badge>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold">Brand</h4>
              <Badge variant="outline">{analysis.brand}</Badge>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <Ruler className="h-4 w-4" />
                Dimensions
              </h4>
              <Badge variant="outline">{analysis.dimensions}</Badge>
            </div>
          </div>
          
          <hr className="border-gray-200 my-4" />
          
          <div>
            <h4 className="font-semibold mb-2">Description</h4>
            <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{analysis.description}</p>
          </div>
          
          {analysis.features && analysis.features.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Key Features</h4>
              <div className="flex flex-wrap gap-2">
                {analysis.features.map((feature, index) => (
                  <Badge key={index} variant="secondary">{feature}</Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pricing Analysis */}
      <Card className="border-2 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700">
            <DollarSign className="h-5 w-5" />
            Pricing Recommendation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              ${pricing.suggested_price_usd}
            </div>
            <Badge className="bg-green-100 text-green-800">Suggested Price</Badge>
          </div>
          
          <hr className="border-gray-200 my-4" />
          
          <div>
            <h4 className="font-semibold mb-2">Pricing Reasoning</h4>
            <p className="text-gray-700 bg-green-50 p-3 rounded-lg">{pricing.pricing_reasoning}</p>
          </div>
          
          {pricing.market_factors && pricing.market_factors.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Market Factors</h4>
              <div className="flex flex-wrap gap-2">
                {pricing.market_factors.map((factor, index) => (
                  <Badge key={index} variant="outline" className="border-green-300">{factor}</Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Platform Content */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <ShoppingBag className="h-5 w-5" />
          Platform-Specific Content
        </h3>
        
        {platformContent.map((content, index) => (
          <Card key={index} className="border-2 border-orange-200">
            <CardHeader>
              <CardTitle className="text-orange-700 capitalize">
                {content.platform}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Title</h4>
                <p className="bg-orange-50 p-3 rounded-lg font-medium">{content.title}</p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Description</h4>
                <p className="bg-orange-50 p-3 rounded-lg text-gray-700">{content.description}</p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Hashtags</h4>
                <div className="flex flex-wrap gap-2">
                  {content.hashtags.map((hashtag, tagIndex) => (
                    <Badge key={tagIndex} variant="outline" className="border-orange-300">
                      #{hashtag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
