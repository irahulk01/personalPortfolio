"use client";

import { BsArrowRight } from 'react-icons/bs';
import ContactForm from './ContactForm';
import SocialMedia from './SocailMedia';
import Link from 'next/link';

export default function Contact() {
  return (
    <div className="w-full min-h-[calc(100vh-120px)] flex flex-col justify-between py-2 lg:py-4 gap-6">
      {/* Top Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center my-auto">
        {/* Left Info Column */}
        <div className="flex flex-col items-start max-w-lg mx-auto lg:mx-0">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-darkHeadingColor mb-4 leading-tight">
            Let’s make something new, different & meaningful.
          </h2>
          <p className="text-gray-600 mb-6 text-xl sm:text-2xl font-bold font-caviateFont">
            Whether you have a project in mind, a question, or just want to say hello, I’d love to hear from you.
          </p>
          <a
            href="mailto:irahulkv@gmail.com"
            className="inline-flex items-center gap-2.5 bg-highLighter hover:bg-[#e00236] text-white font-medium px-6 py-2.5 rounded-full text-base shadow-[0_8px_20px_rgba(255,3,62,0.3)] hover:shadow-[0_12px_25px_rgba(255,3,62,0.4)] transition-all duration-200 group"
          >
            <span>Say Hello</span>
            <BsArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>

        {/* Right Form Column */}
        <div className="w-full max-w-md mx-auto">
          <ContactForm />
        </div>
      </div>

      {/* Bottom Compact Social & Contact Footer */}
      <div className="w-full mt-auto">
        <SocialMedia />
      </div>
    </div>
  );
}
