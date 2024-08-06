import React, { useEffect, useState } from "react";

interface IProps {
  rating: number;
  totalStars: number;
}

export const Main = ({ rating, totalStars }: IProps) => {
  const [stars, setStars] = useState<number[]>(Array(totalStars).fill(0));

  useEffect(() => {
    setStars(() =>
      Array.from({ length: totalStars }, (_, i) =>
        i + 1 <= rating ? 1 : i < rating && i + 1 > rating ? 2 : 0
      )
    );
  }, [rating, totalStars]);

  return (
    <div className="stars">
      {stars.map((star, i) => (
        <div key={i}>
          {star == 0 ? (
            <i className="fa-regular fa-star"></i>
          ) : star == 2 ? (
            <i className="fa-regular fa-star-half-stroke"></i>
          ) : (
            <i className="fa-solid fa-star"></i>
          )}
        </div>
      ))}
    </div>
  );
};
