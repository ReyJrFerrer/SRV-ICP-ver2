import React from 'react';
import Image from 'next/image';

const teamMembers = [
  { name: "Reynaldo Jr. Ferrer", title: "Lead Developer", imageUrl: "/images/team/member1.jpg" },
  { name: "Jan Dale Zarate", title: "Project Manager | Business Strategist", imageUrl: "/images/team/member2.jpg" },
  { name: "Don Daryll Dela Concha", title: "Frontend Developer", imageUrl: "/images/team/member3.jpg" },
  { name: "Hyaeni Gayle Ferrer", title: "UI/UX Designer", imageUrl: "/images/team/member4.jpg" },
  { name: "Princess Hannah Azradon", title: "Frontend Developer", imageUrl: "/images/team/member5.jpg" },
];

const AboutUs: React.FC = () => {
  return (
    <section className="py-16 lg:py-24 bg-blue-600 text-white">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl lg:text-4xl font-bold text-yellow-300 mb-4">
          Meet The Team
        </h2>
        <p className="text-blue-100 max-w-2xl mx-auto mb-12 lg:mb-16 text-lg">
          SRV is a project developed by a passionate team dedicated to building innovative solutions on the Internet Computer.
        </p>
  
        <div className="flex flex-wrap justify-center gap-8 lg:gap-10">
          {teamMembers.map((member) => (
            <div key={member.name} className="text-center group max-w-[180px] w-full"> {/* Each item card */}
              <div className="relative w-32 h-32 lg:w-36 lg:h-36 rounded-full mx-auto mb-4 overflow-hidden shadow-lg border-4 border-yellow-300 group-hover:border-yellow-200 transition-all duration-300 transform group-hover:scale-105">
                <Image
                  src={member.imageUrl}
                  alt={member.name}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <h3 className="text-xl font-semibold text-white mb-1">{member.name}</h3>
              <p className="text-yellow-200 text-sm">{member.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutUs;