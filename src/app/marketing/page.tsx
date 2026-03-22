'use client';

import { useState, useEffect } from 'react';
import { SEOMetricsManager, ContentManager, ReportGenerator, type SEOMetrics } from '@/lib/marketing';
import Link from 'next/link';

export default function MarketingPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'content' | 'calendar'>('dashboard');
  const [metrics, setMetrics] = useState<SEOMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load metrics on mount
    const currentMetrics = SEOMetricsManager.getCurrentMetrics();
    setMetrics(currentMetrics);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div className="p-8 text-center">Loading marketing data...</div>;
  }

  if (!metrics) {
    return <div className="p-8 text-center">No metrics found</div>;
  }

  const gainers = SEOMetricsManager.getGainers(metrics);
  const losers = SEOMetricsManager.getLosers(metrics);
  const page1Keywords = SEOMetricsManager.getPage1Keywords(metrics);
  const page2Keywords = SEOMetricsManager.getPage2PlusKeywords(metrics);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900">Marketing Hub</h1>
              <p className="text-slate-600 mt-1">moxieusc.com Performance & Content Operations</p>
            </div>
            <Link href="/marketing/report" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              📊 View Monthly Report
            </Link>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-6 border-t border-slate-200 pt-4">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                activeTab === 'dashboard'
                  ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📈 SEO Dashboard
            </button>
            <button
              onClick={() => setActiveTab('content')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                activeTab === 'content'
                  ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ✍️ Content Hub
            </button>
            <button
              onClick={() => setActiveTab('calendar')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                activeTab === 'calendar'
                  ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📅 Content Calendar
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* TAB 1: SEO Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <OverviewCard
                title="Sessions"
                value={metrics.sessions.toLocaleString()}
                change={metrics.sessions - metrics.sessionsPrevious}
                changePercent={((metrics.sessions - metrics.sessionsPrevious) / metrics.sessionsPrevious * 100).toFixed(1)}
                icon="📊"
              />
              <OverviewCard
                title="Organic Search"
                value={metrics.organicSessions.toLocaleString()}
                change={0}
                changePercent=""
                icon="🔍"
              />
              <OverviewCard
                title="Engagement Rate"
                value={`${(metrics.engagementRate * 100).toFixed(1)}%`}
                change={0}
                changePercent=""
                icon="⚡"
              />
              <OverviewCard
                title="Avg. Position"
                value="11"
                change={0}
                changePercent="↑ 22%"
                icon="🎯"
              />
            </div>

            {/* Top Queries */}
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4">🔝 Top Search Queries</h2>
              <div className="space-y-3">
                {metrics.topQueries.map((q, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded hover:bg-slate-100 transition">
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">"{q.query}"</p>
                      <p className="text-sm text-slate-600">{q.clicks} clicks • {q.impressions} impressions</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-blue-600">{q.ctr.toFixed(2)}% CTR</p>
                      <p className="text-sm text-slate-600">Position {q.avgPosition.toFixed(1)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Keyword Rankings */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Gainers */}
              <div className="bg-white rounded-lg border border-slate-200 p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-4">📈 Keyword Gainers</h2>
                <div className="space-y-3">
                  {gainers.slice(0, 5).map((k, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-green-50 rounded">
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">"{k.keyword}"</p>
                        <p className="text-sm text-slate-600">{k.searchVolume} searches/month</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">↑ {k.change}</p>
                        <p className="text-sm text-slate-600">Now #{k.currentPosition}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Losers */}
              <div className="bg-white rounded-lg border border-slate-200 p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-4">📉 Keywords to Watch</h2>
                <div className="space-y-3">
                  {losers.slice(0, 5).map((k, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-red-50 rounded">
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">"{k.keyword}"</p>
                        <p className="text-sm text-slate-600">{k.searchVolume} searches/month</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-red-600">↓ {Math.abs(k.change)}</p>
                        <p className="text-sm text-slate-600">Now #{k.currentPosition}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Page Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg border border-slate-200 p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-4">🏆 Page 1 Keywords</h2>
                <div className="text-center">
                  <p className="text-4xl font-bold text-blue-600">{page1Keywords.length}</p>
                  <p className="text-slate-600 mt-2">keywords ranking on page 1</p>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-slate-200 p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-4">📄 Page 2+ Keywords</h2>
                <div className="text-center">
                  <p className="text-4xl font-bold text-yellow-600">{page2Keywords.length}</p>
                  <p className="text-slate-600 mt-2">keywords on page 2 and beyond</p>
                </div>
              </div>
            </div>

            {/* Top Pages */}
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4">📄 Top Performing Pages</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-100 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-slate-900">Page</th>
                      <th className="px-4 py-3 text-right font-semibold text-slate-900">Views</th>
                      <th className="px-4 py-3 text-right font-semibold text-slate-900">Sessions</th>
                      <th className="px-4 py-3 text-right font-semibold text-slate-900">Engagement</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {metrics.topPages.map((p, i) => (
                      <tr key={i} className="hover:bg-slate-50 transition">
                        <td className="px-4 py-3 font-medium text-slate-900">{p.page}</td>
                        <td className="px-4 py-3 text-right text-slate-600">{p.pageviews}</td>
                        <td className="px-4 py-3 text-right text-slate-600">{p.sessions}</td>
                        <td className="px-4 py-3 text-right">
                          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                            {(p.engagedSessions / p.sessions * 100).toFixed(0)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Content Hub */}
        {activeTab === 'content' && <ContentHub />}

        {/* TAB 3: Content Calendar */}
        {activeTab === 'calendar' && <ContentCalendar />}
      </div>
    </div>
  );
}

// Overview Card Component
function OverviewCard({
  title,
  value,
  change,
  changePercent,
  icon,
}: {
  title: string;
  value: string;
  change: number;
  changePercent: string;
  icon: string;
}) {
  const isPositive = change >= 0;

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-lg transition">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-600 font-medium">{title}</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{value}</p>
          {changePercent && (
            <p className={`text-sm font-medium mt-2 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? '↑' : '↓'} {changePercent}
            </p>
          )}
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
    </div>
  );
}

// Content Hub Component (placeholder)
function ContentHub() {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      <h2 className="text-2xl font-bold text-slate-900 mb-4">✍️ Content Hub</h2>
      <p className="text-slate-600 mb-6">AI-powered blog, Instagram, and Reddit content generation</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/marketing/content?type=blog" className="p-6 border-2 border-slate-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition cursor-pointer">
          <p className="text-2xl mb-2">📝</p>
          <h3 className="font-bold text-slate-900">Blog Posts</h3>
          <p className="text-sm text-slate-600 mt-1">1 post per week</p>
        </Link>
        <Link href="/marketing/content?type=instagram" className="p-6 border-2 border-slate-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition cursor-pointer">
          <p className="text-2xl mb-2">📸</p>
          <h3 className="font-bold text-slate-900">Instagram</h3>
          <p className="text-sm text-slate-600 mt-1">2 posts per week</p>
        </Link>
        <Link href="/marketing/content?type=reddit" className="p-6 border-2 border-slate-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition cursor-pointer">
          <p className="text-2xl mb-2">💬</p>
          <h3 className="font-bold text-slate-900">Reddit</h3>
          <p className="text-sm text-slate-600 mt-1">Community engagement</p>
        </Link>
      </div>
    </div>
  );
}

// Content Calendar Component (placeholder)
function ContentCalendar() {
  const posts = ContentManager.getContentCalendar();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">📅 Content Calendar</h2>
        <Link href="/marketing/create" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          + Create Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
          <p className="text-slate-600">No scheduled content yet</p>
          <Link href="/marketing/create" className="text-blue-600 hover:text-blue-700 font-medium mt-2 inline-block">
            Create your first post →
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-100 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left font-semibold text-slate-900">Title</th>
                <th className="px-6 py-4 text-left font-semibold text-slate-900">Type</th>
                <th className="px-6 py-4 text-left font-semibold text-slate-900">Status</th>
                <th className="px-6 py-4 text-left font-semibold text-slate-900">Scheduled</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {posts.map(post => (
                <tr key={post.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4 font-medium text-slate-900">{post.title}</td>
                  <td className="px-6 py-4 text-slate-600 capitalize">{post.type}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      post.status === 'published' ? 'bg-green-100 text-green-700' :
                      post.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{post.scheduledDate || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
