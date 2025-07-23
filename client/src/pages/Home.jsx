import React from 'react';
import dummyProjects from '../assets/assets';
import ProjectCard from '../components/ProjectCard';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      
      <section className="text-center py-12 bg-blue-100">
        <h1 className="text-4xl font-bold text-blue-800 mb-2">Explore Live Projects</h1>
        <p className="text-gray-700 text-lg">Find and Join real Student Projects!</p>
        <Link to="/postproject">
          <button className= " mt-5 cursor-pointer bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200">
            🚀 List Your Project
          </button>
        </Link>
      </section>

      
      <div className="grid mt-2 gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3  pb-6 max-w-7xl mx-auto">
        {dummyProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
};

export default Home;
