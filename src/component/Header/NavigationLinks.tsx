import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

function NavigationLinks({ closeMobileMenu }: any) {
  const location = useLocation();
  const [isMounted, setIsMounted] = useState(false);
  const isMobile = window.innerWidth <= 768; 

  const navLinks = [
    { path: "/", text: "Home" },
    { path: "/About", text: "About" },
    { path: "/Work", text: "Works" },
    { path: "/Resume", text: "Resume" },
    { path: "/Contact", text: "Contact" },
  ];

  const activeLinkStyle = "text-red-500 bg-gray-200 px-3";

  const handleClick = () => {
    closeMobileMenu();
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsMounted(true);
    }, 100);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <nav className={`${isMobile ? "block" : "hidden lg:flex"} ${isMobile ? "lg:hidden" : "flex"} lg:space-x-8`}>
      {navLinks.map((link, index) => (
        <Link
          key={index}
          to={link.path}
          onClick={handleClick}
          className={`${
            isMobile ? "block py-2 text-center" : "inline-block"
          } px-3 py-2 rounded-[1rem] hover:bg-gray-200 ${
            location.pathname === link.path ? activeLinkStyle : ""
          } ${isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          style={{ transitionDelay: `${isMounted ? index * 100 : 0}ms` }}
        >
          {link.text}
        </Link>
      ))}
    </nav>
  );
}

export default NavigationLinks;
