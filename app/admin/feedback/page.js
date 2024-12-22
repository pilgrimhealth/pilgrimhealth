'use client';

import { Parser } from 'json2csv';

import { Loader } from 'lucide-react';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Paginate from '../../../components/Paginate/Paginate';
import { isValidArray } from '../../../lib/func';
import API from '../../../lib/instance/instance';

// Component for rendering individual feedback items
const FeedbackItem = ({ feedback }) => (
  <li className="border p-4 mt-3 rounded-md shadow-sm">
    <div className="space-y-2">
      <p>
        <span className="font-bold">Gender:</span> {feedback.gender || 'N/A'}
      </p>
      <p>
        <span className="font-bold">Age:</span> {feedback.age || 'N/A'}
      </p>
      <p>
        <span className="font-bold">Nationality:</span>{' '}
        {feedback?.nationality || 'N/A'}
      </p>
      <p>
        <span className="font-bold">Lang:</span> {feedback?.lang || 'N/A'}
      </p>
      <p>
        <span className="font-bold">Rating:</span> {feedback.rating || 'N/A'}
      </p>
      <p>
        <span className="font-bold">Message:</span> {feedback.message || 'N/A'}
      </p>
      {feedback.createdAt && (
        <p>
          <span className="font-bold">Date:</span>{' '}
          <span className="text-gray-500">
            {moment(feedback.createdAt).format('MMMM Do YYYY, h:mm:ss a')}
          </span>
        </p>
      )}
    </div>
  </li>
);

// Main Feedback Component
const FeedBack = () => {
  // State Management
  const [isReq, setIsReq] = useState(false);
  const [feedBacks, setFeedBacks] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);
  const limit = 10;

  // Get current language from Redux store
  const currentLanguage = useSelector(
    (state) => state.language.currentLanguage
  );

  // Fetch Feedback Data
  const fetchFeedBack = async (page) => {
    try {
      setIsReq(true);
      const res = await API.get(
        `/api/feedback?lang=${currentLanguage}&page=${page || 1}&limit=${limit}`
      );
      console.log(res.data.data, 'result feedback');
      if (res.data?.success) {
        setFeedBacks(res.data);
      } else {
        throw new Error(res.data.message || 'Failed to fetch feedback data');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsReq(false);
    }
  };

  // Download CSV handler
  const downloadCSV = () => {
    if (isValidArray(feedBacks?.data)) {
      const fields = [
        'gender',
        'age',
        'nationality',
        'lang',
        'rating',
        'message',
        'createdAt',
      ];
      const json2csvParser = new Parser({ fields });
      const csv = json2csvParser.parse(
        feedBacks.data.map((feedback) => ({
          ...feedback,
          createdAt: moment(feedback.createdAt).format(
            'MMMM Do YYYY, h:mm:ss a'
          ),
        }))
      );

      // Create a blob from the CSV data
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

      // Create a URL for the blob and trigger a download
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'feedbacks.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Page change handler
  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  // Fetch data on mount and when dependencies change
  useEffect(() => {
    fetchFeedBack(currentPage);
  }, [currentLanguage, currentPage]);

  // Main render
  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 py-6">
          <h2 className="text-2xl font-bold font-inter">All Feedbacks</h2>
          <button
            onClick={downloadCSV}
            disabled={!isValidArray(feedBacks?.data)}
            className={`px-4 py-2 rounded-md transition-all duration-200 ${
              isValidArray(feedBacks?.data)
                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                : 'bg-gray-300 cursor-not-allowed text-gray-500'
            }`}
          >
            Download CSV
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-4">
            {error}
          </div>
        )}

        {/* Loading State */}
        {isReq && (
          <div className="flex justify-center items-center py-12">
            <Loader className="animate-spin text-blue-500" />
          </div>
        )}

        {/* No Data State */}
        {!isReq && !error && !isValidArray(feedBacks?.data) && (
          <div className="text-center py-12 text-gray-500">
            No feedback data available
          </div>
        )}

        {/* Feedback List */}
        {!isReq && !error && isValidArray(feedBacks?.data) && (
          <ul className="space-y-4" id="feedback-paginate">
            {feedBacks.data.map((feedback, index) => (
              <FeedbackItem key={index} feedback={feedback} />
            ))}
          </ul>
        )}

        {/* Pagination */}
        {!isReq && !error && feedBacks?.paginate?.totalPage > 1 && (
          <div className="mt-6">
            <Paginate
              setCurrentPage={setCurrentPage}
              totalPages={feedBacks?.paginate?.totalPage}
              currentPage={currentPage}
              onPageChange={onPageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedBack;
