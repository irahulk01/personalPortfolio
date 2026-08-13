"use client";

import { FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import SocialMediaIcons from "../../component/SocialMediaIcons/SocialMediaIcons";

const SocialMedia = () => {
  const phoneNumber = "+919955956721";
  const emailAddress = "irahulkv@gmail.com";
  const location = "Kolkata, West Bengal, India";

  const handlePhoneCall = () => {
    window.location.href = `tel:${phoneNumber}`;
  };

  const handleEmail = () => {
    window.location.href = `mailto:${emailAddress}`;
  };

  const handleLocation = () => {
    window.location.href = `geo:0,0?q=${encodeURIComponent(location)}`;
  };

  return (
    <div className="w-full bg-white/70 backdrop-blur-md rounded-2xl border border-white/80 p-3 sm:p-4 shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs sm:text-sm">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 sm:gap-6">
          <div className="flex items-center cursor-pointer hover:text-highLighter transition-colors" onClick={handlePhoneCall}>
            <FaPhone className="mr-2 text-gray-500" />
            <span className="text-gray-800 font-semibold">{phoneNumber}</span>
          </div>
          <div className="flex items-center cursor-pointer hover:text-highLighter transition-colors" onClick={handleEmail}>
            <FaEnvelope className="mr-2 text-gray-500" />
            <span className="text-gray-800 font-semibold">{emailAddress}</span>
          </div>
          <div className="flex items-center cursor-pointer hover:text-highLighter transition-colors" onClick={handleLocation}>
            <FaMapMarkerAlt className="mr-2 text-gray-500" />
            <span className="text-gray-800 font-semibold">{location}</span>
          </div>
        </div>
        <div className="flex items-center">
          <SocialMediaIcons />
        </div>
      </div>
    </div>
  );
};

export default SocialMedia;
