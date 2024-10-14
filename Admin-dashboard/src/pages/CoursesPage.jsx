import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterAudience, setFilterAudience] = useState('all');

  // Fetch courses from the backend
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/trainings/get_training'); // Update the URL to your backend endpoint
        setCourses(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);

  // Filter courses based on search, type, and audience
  const filteredCourses = courses.filter(course => {
    console.log(course);
    
    return (
      (filterType === 'all' || course.type.toLowerCase() === filterType.toLowerCase()) &&
      (filterAudience === 'all' || course.audience.toLowerCase() === filterAudience.toLowerCase()) &&
      (course.title.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  return (
    <div className="p-6 mt-20">
      <h1 className="text-2xl font-semibold mb-8 text-center">Courses</h1>

      {/* Filters and Add Course Button */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between mb-4">
        <div className="grid sm:grid-cols-3 grid-cols-1 sm:space-x-4 sm:gap-0 gap-4 ">
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
            <option value="free">Free</option>
            <option value="reduced">Reduced</option>
            <option value="paid">Paid</option>
          </select>
          <select
            value={filterAudience}
            onChange={(e) => setFilterAudience(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="all">All Audiences</option>
            <option value="family and children">Families and Children</option>
            <option value="specialist">Specialists</option>
          </select>
        </div>
        <Link to='addCourse' >
        <button className="bg-primary-pink text-white px-4 py-2 rounded mt-4 xl:mt-0 self-end">
          Add Course
        </button>
        </Link>
        
      </div>

      {/* Courses List */}
      <div className="w-full flex flex-col items-center">
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course, index) => {
            const photoUrl = course.photo.replace(/\\/g, '/'); // Replace backslashes with forward slashes
            return (
              <div key={index} className="bg-light-gray-bg rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:transform hover:translate-y-[-5px]">
                <img
                  src={`http://localhost:4000/${photoUrl}`} // Ensure 'photo' is the correct field for image URLs
                  alt={course.title}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4 bg-light-gray-bg">
                  <h3 className="text-lg font-semibold text-dark-gray-text mb-2">{course.title}</h3>
                  <p className="text-sm text-muted-gray-text mb-2">
                    <span className={`inline-block px-2 py-1 rounded text-white ${
                      course.type.toLowerCase() === 'free'
                        ? 'bg-green-500'
                        : course.type.toLowerCase() === 'reduced'
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
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;
