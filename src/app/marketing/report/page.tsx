'use client';

import { useState, useEffect } from 'react';
import { SEOMetricsManager, ReportGenerator, type SEOMetrics } from '@/lib/marketing';
import Link from 'next/link';

export default function MonthlyReportPage() {
  const [metrics, setMetrics] = useState<SEOMetrics | null>(null);
  const [reportText, setReportText] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentMetrics = SEOMetricsManager.getCurrentMetrics();
    setMetrics(currentMetrics);
    
    const report = ReportGenerator.generateMonthlyReport(currentMetrics);
    setReportText(report);
    setIsLoading(false);
  }, []);

  const handleDownloadPDF = () => {
    // TODO: Implement PDF generation
    alert('PDF download coming soon');
  };

  const handleDownloadTxt = () => {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(reportText));
    element.setAttribute('download', `moxieusc-marketing-report-${new Date().toISOString().split('T')[0]}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (isLoading || !metrics) {
    return <div className="p-8 text-center">Loading report...</div>;
  }

  const gainers = SEOMetricsManager.getGainers(metrics);
  const losers = SEOMetricsManager.getLosers(metrics);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <Link href="/marketing" className="text-blue-600 hover:text-blue-700 font-medium mb-4 inline-block">
            ← Back to Marketing
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900">Monthly Report</h1>
              <p className="text-slate-600 mt-1">moxieusc.com Marketing Performance</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleDownloadPDF}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition font-medium"
              >
                📄 PDF
              </button>
              <button
                onClick={handleDownloadTxt}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                📥 Download
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Report Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg border border-slate-200 p-8">
          {/* Title Section */}
          <div className="border-b border-slate-200 pb-8 mb-8">
            <h2 className="text-3xl font-bold text-slate-900">moxieusc.com Monthly Report</h2>
            <p className="text-slate-600 mt-2">Generated on {new Date().toLocaleDateString()}</p>
          </div>

          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 pb-8 border-b border-slate-200">
            <div>
              <p className="text-sm text-slate-600 font-medium">Total Sessions</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{metrics.sessions.toLocaleString()}</p>
              <p className={`text-sm mt-1 ${metrics.sessions < metrics.sessionsPreviouse ? 'text-red-600' : 'text-green-600'}`}>
                {metrics.sessions < metrics.sessionsPreviouse ? '↓' : '↑'} {Math.abs(metrics.sessions - metrics.sessionsPreviouse)} vs last month
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-600 font-medium">Organic Sessions</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{metrics.organicSessions.toLocaleString()}</p>
              <p className="text-sm text-slate-600 mt-1">{(metrics.organicSessions / metrics.sessions * 100).toFixed(1)}% of total traffic</p>
            </div>

            <div>
              <p className="text-sm text-slate-600 font-medium">Engagement Rate</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{(metrics.engagementRate * 100).toFixed(1)}%</p>
              <p className="text-sm text-slate-600 mt-1">↑ 8% improvement</p>
            </div>
          </div>

          {/* Top Queries */}
          <div className="mb-8 pb-8 border-b border-slate-200">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">🔝 Top Search Queries</h3>
            <div className="space-y-3">
              {metrics.topQueries.map((q, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-bold text-slate-900">#{i + 1}. "{q.query}"</p>
                    <p className="text-sm text-slate-600 mt-1">{q.impressions} impressions • {q.clicks} clicks</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-blue-600">{q.ctr.toFixed(2)}% CTR</p>
                    <p className="text-sm text-slate-600">Pos. {q.avgPosition.toFixed(1)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gainers */}
          <div className="mb-8 pb-8 border-b border-slate-200">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">📈 Keyword Winners</h3>
            <div className="space-y-3">
              {gainers.slice(0, 5).map((k, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                  <div>
                    <p className="font-bold text-slate-900">"{k.keyword}"</p>
                    <p className="text-sm text-slate-600 mt-1">{k.searchVolume.toLocaleString()} searches/month</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600 text-lg">↑ {k.change} positions</p>
                    <p className="text-sm text-slate-600">Now #{k.currentPosition}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Losers */}
          <div className="mb-8 pb-8 border-b border-slate-200">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">📉 Keywords to Watch</h3>
            <div className="space-y-3">
              {losers.slice(0, 5).map((k, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                  <div>
                    <p className="font-bold text-slate-900">"{k.keyword}"</p>
                    <p className="text-sm text-slate-600 mt-1">{k.searchVolume.toLocaleString()} searches/month</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-red-600 text-lg">↓ {Math.abs(k.change)} positions</p>
                    <p className="text-sm text-slate-600">Now #{k.currentPosition}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Keyword Distribution */}
          <div className="grid grid-cols-2 gap-6 mb-8 pb-8 border-b border-slate-200">
            <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-slate-600 font-medium">Page 1 Keywords</p>
              <p className="text-4xl font-bold text-blue-600 mt-3">{SEOMetricsManager.getPage1Keywords(metrics).length}</p>
              <p className="text-sm text-slate-600 mt-2">Ranking in top 10</p>
            </div>
            <div className="p-6 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-sm text-slate-600 font-medium">Page 2+ Keywords</p>
              <p className="text-4xl font-bold text-yellow-600 mt-3">{SEOMetricsManager.getPage2PlusKeywords(metrics).length}</p>
              <p className="text-sm text-slate-600 mt-2">On page 2 and beyond</p>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-3">💡 Recommendations</h3>
            <ul className="space-y-2 text-slate-700">
              <li>✅ Continue optimizing content for trending keywords, especially keywords with 5+ position gains</li>
              <li>✅ Create new blog posts targeting high-volume keywords that are gaining traction</li>
              <li>⚠️ Monitor declining keywords for content freshness opportunities</li>
              <li>⚠️ Update existing content on pages that have lost rankings recently</li>
              <li>✅ Leverage Page 1 keywords in social media and internal linking strategy</li>
            </ul>
          </div>

          {/* Plain Text Report */}
          <div className="mt-8 pt-8 border-t border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">📄 Full Report (Text)</h3>
            <pre className="bg-slate-100 p-6 rounded-lg overflow-x-auto text-xs text-slate-800 font-mono whitespace-pre-wrap">
              {reportText}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
