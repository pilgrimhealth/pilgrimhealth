import React, { useContext, useEffect, useRef } from 'react'
import BusinessItem from './BusinessItem'
import { SelectedBusinessContext } from '../context/SelectedBusinessContext';

function BusinessList({businessList}) {
    const elementRef=useRef(null);
    const {selectedBusiness,setSelectedBusiness}=useContext(SelectedBusinessContext)

    const slideRight=(element)=>{
        element.scrollLeft+=500;
    }
    const slideLeft=(element)=>{
        element.scrollLeft-=500;
    }

    useEffect(() => {
      if (!selectedBusiness || !elementRef.current) return;
      const idx = businessList.findIndex((item) => item.id === selectedBusiness.id);
      if (idx >= 0 && elementRef.current.children[idx]) {
        elementRef.current.children[idx].scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
          block: 'nearest',
        });
      }
    }, [selectedBusiness]);

  return (
    <div>

<svg xmlns="http://www.w3.org/2000/svg"
            fill="none" viewBox="0 0 24 24"
            onClick={()=>slideLeft(elementRef.current)}
            strokeWidth={1.5} stroke="currentColor"
            className="w-8 h-8 absolute rotate-180 top-[35%]
            bg-gray-300 cursor-pointer p-1 rounded-full text-white">
            <path strokeLinecap="round"
            strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
    <div className='flex overflow-scroll overflow-x-auto gap-4
    scrollbar-hide scroll-smooth' ref={elementRef}>
        {businessList.map((item,index)=>(
            <div
              key={item.id || index}
              onClick={() =>
                setSelectedBusiness(
                  selectedBusiness?.id === item.id ? null : item
                )
              }
              className={`flex-shrink-0 rounded-lg transition-all ${
                selectedBusiness?.id === item.id
                  ? 'ring-2 ring-[#02B1BF] bg-blue-50 scale-110'
                  : ''
              }`}
            >
           <BusinessItem business={item} isSelected={selectedBusiness?.id === item.id} />
           </div>
        ))}

    </div>
    <svg xmlns="http://www.w3.org/2000/svg"
            onClick={()=>slideRight(elementRef.current)}
            fill="none" viewBox="0 0 24 24"
            strokeWidth={1.5} stroke="currentColor"
            className="w-8 h-8 absolute right-0 top-[35%]
            bg-gray-300 cursor-pointer p-1 rounded-full text-white">
            <path strokeLinecap="round"
            strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
    </div>
  )
}

export default BusinessList