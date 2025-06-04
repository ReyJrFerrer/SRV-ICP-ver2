// frontend/src/components/shared/AboutUs.tsx
import React from 'react';
import Image from 'next/image';

const teamMembers = [
  { name: "Reynaldo Jr. Ferrer", title: "Lead Developer", imageUrl: "/images/team/member1.jpg" },
  { name: "Jan Dale Zarate", title: "Project Manager | Business Strategist", imageUrl: "/images/team/member2.jpg" },
  { name: "Don Daryll Dela Concha", title: "UI/UX Designer", imageUrl: "/images/team/member3.jpg" },
  { name: "Hyaeni Gayle Ferrer", title: "Frontend Developer", imageUrl: "/images/team/member4.jpg" },
  { name: "Princess Hannah Azradon", title: "Frontend Developer", imageUrl: "/images/team/member5.jpg" },
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
        {/* MODIFIED: Using Flexbox for the team members container */}
        <div className="flex flex-wrap justify-center gap-8 lg:gap-10">
          {teamMembers.map((member) => (
            // Each member card itself. We can give it a width to control how many fit per line.
            // For example, to aim for roughly 5 on large screens, 3 on medium, 2 on small.
            // You might need to adjust these widths/basis values for your exact preference.
            <div 
              key={member.name} 
              className="text-center group w-full max-w-[180px] sm:w-auto sm:max-w-none sm:basis-[calc(50%-2rem)] md:basis-[calc(33.333%-2rem)] lg:basis-[calc(20%-2rem)] xl:basis-[calc(20%-2.5rem)] flex flex-col items-center"
              // Note: Tailwind's basis fractions (like basis-1/2) don't account for gap. Using calc() is more precise.
              // Or, for simplicity with gap, you can set a min/max width on items and let flexbox wrap.
              // Example of simpler width control:
              // className="text-center group w-40 md:w-44 lg:w-48 flex flex-col items-center"
            >
              <div className="relative w-32 h-32 lg:w-36 lg:h-36 rounded-full mx-auto mb-4 overflow-hidden shadow-lg border-4 border-yellow-300 group-hover:border-blue-500 transition-all duration-300 transform group-hover:scale-105">
                <Image
                  src={member.imageUrl} // Ensure these images exist in public/images/team/
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