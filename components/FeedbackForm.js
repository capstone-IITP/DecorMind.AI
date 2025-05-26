import React, { useState } from 'react';
import { Button } from "./ui/button";

const FeedbackForm = ({ designId, roomType, styleType }) => {
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [showForm, setShowForm] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!feedback.trim()) {
      setSubmitStatus({
        success: false,
        message: 'Please enter your feedback'
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: feedback,
          designId,
          roomType,
          styleType
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSubmitStatus({
          success: true,
          message: 'Thank you for your feedback!'
        });
        setFeedback('');
        setShowForm(false);
      } else {
        setSubmitStatus({
          success: false,
          message: data.message || 'Failed to submit feedback. Please try again.'
        });
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setSubmitStatus({
        success: false,
        message: 'An error occurred. Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!showForm && submitStatus?.success) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-md">
        <div className="bg-green-900/30 text-green-200 p-4 rounded-lg mb-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <div>
            <p className="font-medium">Thank you for your feedback!</p>
            <p className="text-sm">Your input helps us improve our service.</p>
          </div>
        </div>
        <Button 
          onClick={() => setShowForm(true)}
          className="bg-zinc-800 hover:bg-zinc-700 text-white transition-colors duration-300"
        >
          Submit Another Feedback
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-md">
      <h3 className="text-xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-[#1e3a5c] via-[#22d3ee] to-[#4ade80] mb-4">
        How did we do?
      </h3>
      <p className="text-zinc-400 mb-4">
        We'd love to hear your thoughts on the design. Your feedback helps us improve our AI.
      </p>
      
      {submitStatus && (
        <div className={`${
          submitStatus.success 
            ? 'bg-green-900/30 text-green-200' 
            : 'bg-red-900/30 text-red-200'
          } p-3 rounded-lg mb-4 text-sm flex items-center`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" 
            className={`h-5 w-5 mr-2 ${submitStatus.success ? 'text-green-400' : 'text-red-400'}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            {submitStatus.success 
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            }
          </svg>
          {submitStatus.message}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="feedback" className="block text-sm font-medium text-zinc-300">
            Your Feedback
          </label>
          <textarea
            id="feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={4}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#22d3ee] focus:border-transparent transition-colors duration-300"
            placeholder="Tell us what you think about the design..."
          />
        </div>
        
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-gradient-to-r from-[#1e3a5c] via-[#22d3ee] to-[#4ade80] text-white hover:opacity-90 transition-all duration-300 flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Submitting...
              </>
            ) : (
              'Submit Feedback'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default FeedbackForm; 