import React,{useState,useEffect} from 'react';
import { FaRegStar,FaStar } from "react-icons/fa";

const HeaderStar = ({header,onRatingChange,value=0 }) => {

  const [rating,setRating]=useState(0);

  useEffect(() => {
    setRating(value);
  }, [value]);

  const handleStarClick = (index) => {
    setRating(index + 1);
    onRatingChange(index + 1);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{header}</h1>
      <div className="flex mt-2 flex-row justify-center">
        {[...Array(5)].map((_, index) => (
          <span key={index} onClick={() => handleStarClick(index)}>
            {/* Show filled star if index is less than the current rating */}
            {index < rating ? (
              <FaStar className="text-2xl text-yellow-500 cursor-pointer m-0.5" />
            ) : (
              <FaRegStar className="text-2xl text-yellow-500 cursor-pointer m-0.5" />
            )}
          </span>
        ))}
      </div>

    </div>
  )
}

export default HeaderStar;