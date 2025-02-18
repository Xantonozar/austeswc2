import React, { useState, useEffect } from 'react';

const Testimonial = () => {
  const testimonials = [
    { text: "This club is amazing!", author: "John Doe" },
    { text: "I've learned so much here.", author: "Jane Smith" },
    { text: "Highly recommend joining!", author: "Alex Johnson" }
  ];

  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prevTestimonial) => 
        (prevTestimonial + 1) % testimonials.length
      );
    }, 3000); // Change testimonial every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="testimonial bg-gradient-to-r from-blue-500 to-purple-500 p-6 rounded-lg shadow-lg max-w-md mx-auto mt-10 text-white">
      <div className="flex flex-row-reverse overflow-hidden">
        <blockquote className="text-center animate-marquee">
          <p className="text-xl font-semibold mb-4">"{testimonials[currentTestimonial].text}"</p>
          <footer className="text-sm">- {testimonials[currentTestimonial].author}</footer>
        </blockquote>
      </div>
    </div>
  );
}

export default Testimonial;