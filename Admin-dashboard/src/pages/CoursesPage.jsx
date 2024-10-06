import React, { useState } from 'react';

const CoursesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterAudience, setFilterAudience] = useState('all');

  const courses = [
    {
      title: "Parenting 101",
      type: "Free",
      audience: "Families",
      price: 0,
      image: "https://images.unsplash.com/photo-1531058020387-3be344556be6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDF8fHBhcmVudGluZ3xlbnwwfHx8fDE2OTY2OTcyMzA&ixlib=rb-1.2.1&q=80&w=400"
    },
    {
      title: "Special Needs Support",
      type: "Reduced",
      audience: "Specialists",
      price: 50,
      image: "https://images.unsplash.com/photo-1531058020387-3be344556be6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDF8fHBhcmVudGluZ3xlbnwwfHx8fDE2OTY2OTcyMzA&ixlib=rb-1.2.1&q=80&w=400"
    },
    {
      title: "Child Development",
      type: "Paid",
      audience: "Children",
      price: 100,
      image: "https://images.unsplash.com/photo-1531058020387-3be344556be6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDF8fHBhcmVudGluZ3xlbnwwfHx8fDE2OTY2OTcyMzA&ixlib=rb-1.2.1&q=80&w=400"
    },
    {
      title: "Advanced Therapies",
      type: "Paid",
      audience: "Specialists",
      price: 150,
      image: "https://images.unsplash.com/photo-1531058020387-3be344556be6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDF8fHBhcmVudGluZ3xlbnwwfHx8fDE2OTY2OTcyMzA&ixlib=rb-1.2.1&q=80&w=400"
    },
    {
      title: "Playtime Skills",
      type: "Free",
      audience: "Children",
      price: 0,
      image: "https://images.unsplash.com/photo-1531058020387-3be344556be6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDF8fHBhcmVudGluZ3xlbnwwfHx8fDE2OTY2OTcyMzA&ixlib=rb-1.2.1&q=80&w=400"
    }
  ];

  // Filter courses based on search, type, and audience
  const filteredCourses = courses.filter(course => {
    return (
      (filterType === 'all' || course.type === filterType) &&
      (filterAudience === 'all' || course.audience === filterAudience) &&
      (course.title.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  return (
    <div className="p-6 mt-20">
      <h1 className="text-2xl font-semibold mb-8 text-center">Courses</h1>

      {/* Filters */}
      <div className="grid md:grid-cols-3 grid-1 md:gap-0 gap-2 mb-4">
        <input
          type="text"
          placeholder="Search courses"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded"
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="all">All Types</option>
          <option value="Free">Free</option>
          <option value="Reduced">Reduced</option>
          <option value="Paid">Paid</option>
        </select>
        <select
          value={filterAudience}
          onChange={(e) => setFilterAudience(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="all">All Audiences</option>
          <option value="Families">Families</option>
          <option value="Children">Children</option>
          <option value="Specialists">Specialists</option>
        </select>
      </div>

      {/* Courses List */}
      <div className='w-full flex flex-col items-center '>
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
          {filteredCourses.map((course, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:transform hover:translate-y-[-5px]">
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4 bg-light-gray-bg">
                <h3 className="text-lg font-semibold text-dark-gray-text mb-2">{course.title}</h3>
                <p className="text-sm text-muted-gray-text mb-2">
                  <span className={`inline-block px-2 py-1 rounded text-white ${
                    course.type === 'Free'
                      ? 'bg-green-500'
                      : course.type === 'Reduced'
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}>
                    {course.type}
                  </span>
                </p>
                <p className="text-sm text-muted-gray-text mb-2">Audience: {course.audience}</p>
                <p className="text-sm text-muted-gray-text mb-2">Price: {course.price === 0 ? 'Free' : `$${course.price}`}</p>
                <button className="bg-primary-pink text-white px-4 py-2 rounded mt-2">
                  Learn More
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
};

export default CoursesPage;
