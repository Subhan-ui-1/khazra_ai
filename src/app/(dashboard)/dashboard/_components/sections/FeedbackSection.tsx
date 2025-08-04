import React, { useState, useEffect } from 'react';
import { Plus, Save, X, Edit3, Trash2, MessageSquare, Star, Send, CheckCircle } from 'lucide-react';
import { postRequest, getRequest } from '@/utils/api';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { usePermissions, PermissionGuard } from '@/utils/permissions';
import { safeLocalStorage } from '@/utils/localStorage';

// Define TypeScript interfaces
interface FeedbackFormData {
  rating: number;
  content: string;
  category: string;
}

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  profilePic: string | null;
  email: string;
}

interface FeedbackItem {
  _id: string;
  userId: User;
  content: string;
  rating: number;
  category: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
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
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
    hasNext: false,
    hasPrevious: false
  });
  const [hasUserSubmitted, setHasUserSubmitted] = useState(false);
  const router = useRouter();
  const { canView } = usePermissions();
  
  const tokenData = JSON.parse(safeLocalStorage.getItem("tokens") || "{}");

  const [formData, setFormData] = useState<FeedbackFormData>({
    rating: 0,
    content: '',
    category: 'general'
  });

  // Check authentication
  useEffect(() => {
    if (!tokenData.accessToken) {
      toast.error("Please login to continue");
      router.push("/login");
      return;
    }
    
    // Fetch feedback data if user has permission to view
    if (canView('feedback')) {
      fetchFeedbacks();
    }
  }, []);

  // Fetch feedbacks from API
  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const response = await getRequest('feedback/getFeedbacks', tokenData.accessToken);
      
      if (response.success) {
        setFeedbackData(response.data.feedbacks || []);
        setPagination(response.data.pagination || {
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0,
          hasNext: false,
          hasPrevious: false
        });
        
        // Check if current user has already submitted feedback
        checkIfUserHasSubmitted(response.data.feedbacks || []);
      } else {
        toast.error(response.message || "Failed to fetch feedbacks");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch feedbacks");
    } finally {
      setLoading(false);
    }
  };

  // Check if current user has already submitted feedback
  const checkIfUserHasSubmitted = (feedbacks: FeedbackItem[]) => {
    const user = JSON.parse(safeLocalStorage.getItem('user')||"")
    const currentUserEmail = user.email
    const userHasSubmitted = feedbacks.some(feedback => 
      feedback.userId.email === currentUserEmail
    );
    setHasUserSubmitted(userHasSubmitted);
  };

  const handleSubmit = async () => {
    // Validate form data
    if (formData.rating === 0 || !formData.content.trim()) {
      toast.error("Please provide rating and feedback content");
      return;
    }

    try {
      setLoading(true);
      
      const requestBody = {
        rating: formData.rating,
        content: formData.content.trim(),
        category: formData.category
      };

      const response = await postRequest(
        'feedback/addFeedback',
        requestBody,
        'Feedback submitted successfully',
        tokenData.accessToken,
        'post'
      );

        if (response.success) {
         toast.success('Feedback submitted successfully');
         setShowForm(false);
         setFormData({
           rating: 0,
           content: '',
           category: 'general'
         });
         
         // Mark that user has submitted feedback
         setHasUserSubmitted(true);
         
         // Refresh feedback list if user has permission to view
         if (canView('feedback')) {
           fetchFeedbacks();
         }
       } else {
         toast.error(response.message || 'Failed to submit feedback');
       }
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit feedback');
    } finally {
      setLoading(false);
    }
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
  const showMOdalFeedback = ()=>{
     setShowForm(true)

  }
  return (
    <div className="space-y-6 ">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <MessageSquare className="w-6 h-6 text-green-600" />
          <h3 className="text-xl font-semibold text-gray-900">Feedback & Suggestions</h3>
        </div>
        {hasUserSubmitted ? (
          <div className="flex items-center space-x-2 px-4 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed">
            <CheckCircle className="w-4 h-4" />
            <span>Feedback Submitted</span>
          </div>
        ) : (
          <button
            onClick={showMOdalFeedback}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Submit Feedback</span>
          </button>
        )}
      </div>

      {/* Statistics Cards - Only show if user has permission to view feedback */}
      {canView('feedback') && (
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
      )}

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
                setFormData({
                  rating: 0,
                  content: '',
                  category: 'general'
                });
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
                  setFormData({
                    rating: 0,
                    content: '',
                    category: 'general'
                  });
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={formData.rating === 0 || !formData.content.trim() || loading}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span>{loading ? 'Submitting...' : 'Submit Feedback'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feedback List - Only show if user has permission to view feedback */}
      {canView('feedback') ? (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h4 className="text-lg font-medium text-gray-900">Recent Feedback</h4>
          </div>
          {hasUserSubmitted && (
            <div className="px-6 py-3 bg-green-50 border-b border-green-200">
              <div className="flex items-center space-x-2 text-green-700">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">You have already submitted feedback. Thank you!</span>
              </div>
            </div>
          )}
          <div className="divide-y divide-gray-200">
            {loading ? (
              <div className="px-6 py-12 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
                <p className="text-gray-500">Loading feedback...</p>
              </div>
            ) : feedbackData.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No feedback yet</h3>
                <p className="text-gray-500">Be the first to share your thoughts and help us improve!</p>
              </div>
            ) : (
              feedbackData.map((feedback) => {
                const categoryInfo = getCategoryInfo(feedback.category);
                return (
                  <div key={feedback._id} className="p-6 hover:bg-gray-50 transition-colors">
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
                            by {feedback.userId.firstName} {feedback.userId.lastName}
                          </span>
                          {feedback.createdAt && (
                            <span className="text-sm text-gray-500">
                              {new Date(feedback.createdAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-700 leading-relaxed">{feedback.content}</p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      ) : (
        // <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
        //   <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        //   <h3 className="text-lg font-medium text-gray-900 mb-2">You can't view feedback, because you don't have permissions!</h3>
        //   <p className="text-gray-500">Please contact the administrator to get access to the feedback section.</p>
        // </div>
        <></>
      )}
    </div>
  );
};

export default FeedbackSection; 