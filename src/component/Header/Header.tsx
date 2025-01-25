import { useState, useEffect } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import NavigationLinks from "./NavigationLinks";
import logo from "../../assets/Profile/newLogo.jpeg";
import { Link } from "react-router-dom";


export function Header() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    if (isMobileMenuOpen) {
      setTimeout(() => {
        setIsMounted(true);
      }, 100);
    } else {
      setIsMounted(false);
    }
  }, [isMobileMenuOpen]);

  return (
    <header className="text-textHeaderColor font-semibold">
      <div className="flex items-center justify-between">
        <button onClick={toggleMobileMenu} className="lg:hidden block focus:outline-none">
          {isMobileMenuOpen ? <HiX className="h-6 w-6" /> : <HiMenu className="h-6 w-6" />}
        </button>
      </div>
      <div className={`${isMobileMenuOpen ? "block" : "hidden lg:block"} lg:flex items-center justify-between`}>
        <div className="lg:flex items-center hidden">
          <div className="logo w-12 h-12 flex justify-center">
            <Link to="/">
              <img src={logo} alt="" loading="lazy" className="rounded-full " />
            </Link>
          </div>
        </div>
        <NavigationLinks closeMobileMenu={closeMobileMenu} isMobileMenuOpen={isMobileMenuOpen} isMounted={isMounted} />
      </div>
    </header>
  );
}
