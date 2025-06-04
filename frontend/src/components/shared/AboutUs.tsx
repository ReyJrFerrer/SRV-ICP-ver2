import React from 'react';
import Image from 'next/image'; 

const teamMembers = [
  { name: "Alex Ray", title: "Lead Developer", imageUrl: "/images/team/member1.jpg" },
  { name: "Jamie Doe", title: "UX/UI Designer", imageUrl: "/images/team/member2.jpg" },
  { name: "Sam Lee", title: "Motoko Specialist", imageUrl: "/images/team/member3.jpg" },
  { name: "Casey Moe", title: "Frontend Engineer", imageUrl: "/images/team/member4.jpg" },
  { name: "Jordan Tay", title: "Project Manager", imageUrl: "/images/team/member5.jpg" },
];

const AboutUs: React.FC = () => {
  return (
    <section className="py-16 lg:py-24 bg-yellow-50">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl lg:text-4xl font-bold text-blue-600 mb-4">
          Meet The Team
        </h2>
        <p className="text-gray-700 max-w-2xl mx-auto mb-12 lg:mb-16 text-lg">
          SRV is a project developed by a passionate team dedicated to building innovative solutions on the Internet Computer.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-10">
          {teamMembers.map((member) => (
            <div key={member.name} className="text-center group">
              <div className="relative w-32 h-32 lg:w-36 lg:h-36 rounded-full mx-auto mb-4 overflow-hidden shadow-lg border-4 border-yellow-300 group-hover:border-blue-500 transition-all duration-300 transform group-hover:scale-105">
                <Image
                  src={member.imageUrl}
                  alt={member.name}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-1">{member.name}</h3>
              <p className="text-blue-500 text-sm">{member.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutUs;