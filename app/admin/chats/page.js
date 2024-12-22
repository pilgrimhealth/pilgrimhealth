'use client';
import { Loader } from 'lucide-react';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Paginate from '../../../components/Paginate/Paginate';
import { isValidArray } from '../../../lib/func';
import API from '../../../lib/instance/instance';

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
  const downloadCSV = () => {
    if (isValidArray(chats?.data)) {
      const fields = ['InputText', 'Lang', 'CreatedAt'];
      const json2csvParser = new Parser({ fields });
      const csv = json2csvParser.parse(
        chats.data.map((chat) => ({
          InputText: chat.inputText,
          Lang: chat.lang,
          CreatedAt: moment(chat.createdAt).format('MMMM Do YYYY, h:mm:ss a'),
        }))
      );

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'chats.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    fetchChats(currentPage);
  }, [currentLanguage, currentPage]);

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h2 className="p-4 text-2xl font-bold font-inter">All input:</h2>
        <button
          onClick={downloadCSV}
          className="bg-blue-500 text-white px-4 py-2 rounded-md mr-6"
        >
          Download CSV
        </button>
      </div>
      <div className="bg-blue-200">
        <ul>
          {isValidArray(chats.data) ? (
            chats.data.map((chat) => (
              <li
                key={chat.id}
                className="p-4 flex align-center justify-center"
              >
                {chat.message} -{' '}
                {moment(chat.createdAt).format('MMMM Do YYYY, h:mm:ss a')}
              </li>
            ))
          ) : (
            <li>No chats available</li>
          )}
          {isReq && (
            <div className="flex items-center justify-center">
              <Loader />
            </div>
          )}
        </ul>
      </div>
      <div className="py-3">
        <Paginate
          setCurrentPage={setCurrentPage}
          totalPages={chats?.paginate?.totalPage}
          currentPage={currentPage}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
};

export default Chats;
