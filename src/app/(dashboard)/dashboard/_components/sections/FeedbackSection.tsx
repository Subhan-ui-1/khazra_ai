import React, { useState } from 'react';
import { Plus, Save, X, Edit3, Trash2, MessageSquare, Star, Send } from 'lucide-react';

// Define TypeScript interfaces
interface FeedbackFormData {
  rating: number;
  content: string;
  category: string;
}

interface FeedbackItem extends FeedbackFormData {
  id: string;
  createdAt: string;
  updatedAt: string;
}

const feedbackCategories = [
  { id: 'general', name: 'General', icon: '💬', color: 'bg-blue-100 text-blue-800' },
  { id: 'bug', name: 'Bug Report', icon: '🐛', color: 'bg-red-100 text-red-800' },
  { id: 'feature', name: 'Feature Request', icon: '✨', color: 'bg-green-100 text-green-800' },
  { id: 'usability', name: 'Usability', icon: '🎯', color: 'bg-purple-100 text-purple-800' }
];

const FeedbackSection = () => {
  const [feedbackData, setFeedbackData] = useState<FeedbackItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<FeedbackItem | null>(null);
  const [formData, setFormData] = useState<FeedbackFormData>({
    rating: 0,
    content: '',
    category: 'general'
  });

  const handleSubmit = () => {
    const newRecord: FeedbackItem = {
      id: editingItem ? editingItem.id : `feedback_${Date.now()}`,
      ...formData,
      createdAt: editingItem ? editingItem.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    if (editingItem) {
      setFeedbackData(prev => prev.map(item => item.id === editingItem.id ? newRecord : item));
    } else {
      setFeedbackData(prev => [...prev, newRecord]);
    }
    
    setShowForm(false);
    setEditingItem(null);
    setFormData({
      rating: 0,
      content: '',
      category: 'general'
    });
  };

  const startEdit = (item: FeedbackItem) => {
    setEditingItem(item);
    setFormData({
      rating: item.rating,
      content: item.content,
      category: item.category
    });
    setShowForm(true);
  };

  const getCategoryInfo = (categoryId: string) => {
    return feedbackCategories.find(cat => cat.id === categoryId) || feedbackCategories[0];
  };

  const renderStars = (rating: number, interactive: boolean = false, onStarClick?: (star: number) => void) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? "button" : undefined}
            onClick={interactive && onStarClick ? () => onStarClick(star) : undefined}
            className={`${
              interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'
            }`}
            disabled={!interactive}
          >
            <Star
              className={`w-5 h-5 ${
                star <= rating
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  const getFeedbackStats = () => {
    const total = feedbackData.length;
    const avgRating = total > 0 
      ? (feedbackData.reduce((sum, item) => sum + item.rating, 0) / total).toFixed(1)
      : '0.0';
    
    const categoryCounts = feedbackCategories.map(cat => ({
      ...cat,
      count: feedbackData.filter(item => item.category === cat.id).length
    }));

    return { total, avgRating, categoryCounts };
  };

  const stats = getFeedbackStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <MessageSquare className="w-6 h-6 text-green-600" />
          <h3 className="text-xl font-semibold text-gray-900">Feedback & Suggestions</h3>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Submit Feedback</span>
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Feedback</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <MessageSquare className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Rating</p>
              <div className="flex items-center space-x-2">
                <p className="text-2xl font-bold text-gray-900">{stats.avgRating}</p>
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
              </div>
            </div>
          </div>
        </div>

        {stats.categoryCounts.slice(0, 2).map((category) => (
          <div key={category.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{category.name}</p>
                <p className="text-2xl font-bold text-gray-900">{category.count}</p>
              </div>
              <span className="text-2xl">{category.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Feedback Form */}
      {showForm && (
        <div className="bg-white border border-green-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-medium text-green-900">
              {editingItem ? 'Edit' : 'Add'} Feedback
            </h4>
            <button
              onClick={() => {
                setShowForm(false);
                setEditingItem(null);
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Rating *
              </label>
              <div className="flex items-center space-x-4">
                {renderStars(formData.rating, true, (star) => 
                  setFormData((prev: FeedbackFormData) => ({ ...prev, rating: star }))
                )}
                <span className="text-sm text-gray-500">
                  {formData.rating > 0 ? `${formData.rating} out of 5` : 'Click to rate'}
                </span>
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {feedbackCategories.map((category) => (
                  <label
                    key={category.id}
                    className={`relative flex items-center p-3 border rounded-lg cursor-pointer transition-all ${
                      formData.category === category.id
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="category"
                      value={category.id}
                      checked={formData.category === category.id}
                      onChange={(e) => setFormData((prev: FeedbackFormData) => ({ ...prev, category: e.target.value }))}
                      className="sr-only"
                    />
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{category.icon}</span>
                      <span className="text-sm font-medium text-gray-700">{category.name}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Feedback Content *
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData((prev: FeedbackFormData) => ({ ...prev, content: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                rows={4}
                placeholder="Please share your feedback, suggestions, or report any issues you've encountered..."
                required
              />
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingItem(null);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={formData.rating === 0 || !formData.content.trim()}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                <span>{editingItem ? 'Update' : 'Submit'} Feedback</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feedback List */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h4 className="text-lg font-medium text-gray-900">Recent Feedback</h4>
        </div>
        <div className="divide-y divide-gray-200">
          {feedbackData.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No feedback yet</h3>
              <p className="text-gray-500">Be the first to share your thoughts and help us improve!</p>
            </div>
          ) : (
            feedbackData.map((feedback) => {
              const categoryInfo = getCategoryInfo(feedback.category);
              return (
                <div key={feedback.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryInfo.color}`}>
                          <span className="mr-1">{categoryInfo.icon}</span>
                          {categoryInfo.name}
                        </span>
                        <div className="flex items-center">
                          {renderStars(feedback.rating)}
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(feedback.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{feedback.content}</p>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => startEdit(feedback)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setFeedbackData(prev => prev.filter(item => item.id !== feedback.id))}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackSection; 