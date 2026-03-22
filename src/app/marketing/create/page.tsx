'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ContentManager, ContentGenerator, type ContentPost } from '@/lib/marketing';
import Link from 'next/link';

export default function CreateContentPage() {
  const searchParams = useSearchParams();
  const contentType = (searchParams.get('type') || 'blog') as 'blog' | 'instagram' | 'reddit';

  const [formData, setFormData] = useState<Partial<ContentPost>>({
    type: contentType,
    title: '',
    content: '',
    status: 'draft',
    hashtags: [],
  });

  const [suggestedTopics, setSuggestedTopics] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showScheduler, setShowScheduler] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');

  useEffect(() => {
    // Load suggested topics based on content type
    if (contentType === 'blog') {
      setSuggestedTopics(ContentGenerator.suggestBlogTopics([
        { keyword: 'housing near usc', currentPosition: 14, previousPosition: 27, change: 13, searchVolume: 390, difficulty: 45 },
        { keyword: 'usc apartments', currentPosition: 13, previousPosition: 50, change: 37, searchVolume: 1000, difficulty: 62 },
      ]));
    } else if (contentType === 'instagram') {
      setSuggestedTopics(ContentGenerator.suggestInstagramTopics());
    } else if (contentType === 'reddit') {
      setSuggestedTopics(ContentGenerator.suggestRedditTopics());
    }
  }, [contentType]);

  const handleGenerateContent = async (topic: string) => {
    setIsGenerating(true);
    try {
      let generatedContent = '';
      
      if (contentType === 'blog') {
        generatedContent = await ContentGenerator.generateBlogPost(topic);
        setFormData(prev => ({
          ...prev,
          title: topic,
          content: generatedContent,
          suggestedTopic: topic,
        }));
      } else if (contentType === 'instagram') {
        const igContent = await ContentGenerator.generateInstagramCaption(topic);
        setFormData(prev => ({
          ...prev,
          title: topic,
          content: igContent.caption,
          hashtags: igContent.hashtags,
          suggestedTopic: topic,
        }));
      } else if (contentType === 'reddit') {
        const redditContent = await ContentGenerator.generateRedditPost(topic);
        setFormData(prev => ({
          ...prev,
          title: redditContent.title,
          content: redditContent.body,
          suggestedTopic: topic,
        }));
      }
    } catch (error) {
      console.error('Error generating content:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreatePost = () => {
    if (!formData.title || !formData.content) {
      alert('Please fill in title and content');
      return;
    }

    const post = ContentManager.createPost({
      type: contentType,
      title: formData.title,
      content: formData.content,
      status: showScheduler && scheduledDate ? 'scheduled' : 'draft',
      scheduledDate: showScheduler ? scheduledDate : undefined,
      hashtags: formData.hashtags,
      suggestedTopic: formData.suggestedTopic,
    });

    alert(`${contentType.charAt(0).toUpperCase() + contentType.slice(1)} post created!`);
    // Reset form
    setFormData({
      type: contentType,
      title: '',
      content: '',
      status: 'draft',
      hashtags: [],
    });
    setScheduledDate('');
    setShowScheduler(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <Link href="/marketing" className="text-blue-600 hover:text-blue-700 font-medium mb-4 inline-block">
            ← Back to Marketing
          </Link>
          <h1 className="text-4xl font-bold text-slate-900 capitalize">Create {contentType} Post</h1>
          <p className="text-slate-600 mt-2">AI-powered content generation with full customization</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Suggested Topics */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-slate-200 p-6 sticky top-24">
              <h2 className="text-lg font-bold text-slate-900 mb-4">💡 Suggested Topics</h2>
              <div className="space-y-2">
                {suggestedTopics.map((topic, i) => (
                  <button
                    key={i}
                    onClick={() => handleGenerateContent(topic)}
                    disabled={isGenerating}
                    className="w-full text-left p-3 rounded-lg bg-slate-100 hover:bg-blue-100 transition border border-slate-200 hover:border-blue-300 disabled:opacity-50"
                  >
                    <p className="text-sm font-medium text-slate-900">{topic}</p>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setFormData(prev => ({ ...prev, title: '', content: '' }))}
                className="w-full mt-4 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition"
              >
                ✏️ Custom Topic
              </button>
            </div>
          </div>

          {/* Editor */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                {contentType === 'blog' ? 'Blog Post Title' : 'Post Title'}
              </label>
              <input
                type="text"
                placeholder={contentType === 'blog' ? 'e.g., Complete Guide to USC Housing' : 'Post title...'}
                value={formData.title || ''}
                onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Content */}
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <label className="block text-sm font-semibold text-slate-900 mb-2">Content</label>
              <textarea
                placeholder="Content will appear here after generation, or write your own..."
                value={formData.content || ''}
                onChange={e => setFormData(prev => ({ ...prev, content: e.target.value }))}
                rows={contentType === 'blog' ? 15 : 8}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
              />
            </div>

            {/* Hashtags (Instagram & Reddit) */}
            {(contentType === 'instagram' || contentType === 'reddit') && (
              <div className="bg-white rounded-lg border border-slate-200 p-6">
                <label className="block text-sm font-semibold text-slate-900 mb-2">Hashtags</label>
                <input
                  type="text"
                  placeholder="#USCHousing #StudentApartments..."
                  value={formData.hashtags?.join(' ') || ''}
                  onChange={e => setFormData(prev => ({ 
                    ...prev, 
                    hashtags: e.target.value.split(' ').filter(h => h.length > 0)
                  }))}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            )}

            {/* Scheduling */}
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showScheduler}
                  onChange={e => setShowScheduler(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300"
                />
                <span className="font-semibold text-slate-900">Schedule for later</span>
              </label>
              
              {showScheduler && (
                <div className="mt-4">
                  <label className="block text-sm text-slate-600 mb-2">Scheduled Date & Time</label>
                  <input
                    type="datetime-local"
                    value={scheduledDate}
                    onChange={e => setScheduledDate(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleCreatePost}
                disabled={!formData.title || !formData.content}
                className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {showScheduler && scheduledDate ? '📅 Schedule Post' : '✅ Save Draft'}
              </button>
              <Link
                href="/marketing"
                className="px-6 py-3 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition"
              >
                Cancel
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
