'use client';

import { Loader } from 'lucide-react';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Paginate from '../../../components/Paginate/Paginate';
import { isValidArray } from '../../../lib/func';
import API from '../../../lib/instance/instance';

// Component for rendering individual chat items
const ChatItem = ({ chat }) => (
  <li className="border p-4 mt-3 rounded-md shadow-sm">
    <div className="space-y-2">
      <p>
        <span className="font-bold">Input Text:</span> {chat.inputText || 'N/A'}
      </p>
      <p>
        <span className="font-bold">Response Text:</span>{' '}
        {chat.responseText || 'N/A'}
      </p>
      <p>
        <span className="font-bold">Lang:</span> {chat.lang || 'N/A'}
      </p>
      {chat.createdAt && (
        <p>
          <span className="font-bold">Date:</span>{' '}
          <span className="text-gray-500">
            {moment(chat.createdAt).format('MMMM Do YYYY, h:mm:ss a')}
          </span>
        </p>
      )}
    </div>
  </li>
);

// Main Chats Component
const Chats = () => {
  const [isReq, setIsReq] = useState(false);
  const [chats, setChats] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  const currentLanguage = useSelector(
    (state) => state.language.currentLanguage
  );

  const fetchChats = async (page) => {
    try {
      setIsReq(true);
      const res = await API.get(
        `/api/chat?lang=${currentLanguage}&page=${page || 1}&limit=${limit}`
      );
      console.log(res.data.data, 'result chats');
      if (res.data?.success) {
        setChats(res?.data);
      }
      setIsReq(false);
    } catch (error) {
      setIsReq(false);
      console.error(error);
    }
  };

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    fetchChats(currentPage);
  }, [currentLanguage, currentPage]);

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 py-6">
          <h2 className="text-2xl font-bold font-inter">All Chats</h2>
        </div>

        {/* Loading State */}
        {isReq && (
          <div className="flex justify-center items-center py-12">
            <Loader className="animate-spin text-blue-500" />
          </div>
        )}

        {/* No Data State */}
        {!isReq && !isValidArray(chats?.data) && (
          <div className="text-center py-12 text-gray-500">
            No chat data available
          </div>
        )}

        {/* Chat List */}
        {!isReq && isValidArray(chats?.data) && (
          <ul className="space-y-4" id="chat-paginate">
            {chats.data.map((chat, index) => (
              <ChatItem key={index} chat={chat} />
            ))}
          </ul>
        )}

        {/* Pagination */}
        {!isReq && chats?.paginate?.totalPage > 1 && (
          <div className="mt-6">
            <Paginate
              setCurrentPage={setCurrentPage}
              totalPages={chats?.paginate?.totalPage}
              currentPage={currentPage}
              onPageChange={onPageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Chats;
