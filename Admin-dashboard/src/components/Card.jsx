import React from 'react';

const Card = ({ title, number, icon: Icon }) => {
  return (
    <div className="w-full bg-white rounded-lg p-4 shadow-md flex justify-between items-center cursor-pointer hover:bg-primary-pink hover:text-white hover:shadow-lg transition-all duration-300">
      <div>
        <h2 className="text-3xl font-bold">{number}</h2>
        <p className="text-gray-500">{title}</p>
      </div>
      <Icon className="text-4xl text-primary-pink" />
    </div>
  );
};

export default Card;
