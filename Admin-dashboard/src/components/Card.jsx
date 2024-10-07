import React from 'react';

const Card = ({ title, number, icon: Icon }) => {
  return (
    <div className="w-full bg-white rounded-lg p-4 shadow-md flex justify-between items-center cursor-pointer group hover:bg-primary-pink  hover:shadow-lg transition-all duration-300">
      <div>
        <h2 className="text-3xl group-hover:text-white font-bold">{number}</h2>
        <p className="text-gray-500 group-hover:text-white">{title}</p>
      </div>
      <Icon className="text-4xl text-primary-pink group-hover:text-white" />
    </div>
  );
};

export default Card;
