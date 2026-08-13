"use client";

import { useState, useEffect, useRef } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import NavigationLinks from "./NavigationLinks";
import logo from "../../assets/Profile/newLogo.jpeg";
import Link from "next/link";
import Image from "next/image";
import styles from "./Header.module.css";

export function Header() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollPosRef = useRef(0);

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => {
      if (!prev) {
        scrollPosRef.current = typeof window !== "undefined" ? window.scrollY : 0;
      }
      return !prev;
    });
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    // Close on click/tap outside container
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setMobileMenuOpen(false);
      }
    };

    // Close only when user actually scrolls page by > 15px
    const handleScroll = () => {
      const currentY = typeof window !== "undefined" ? window.scrollY : 0;
      if (Math.abs(currentY - scrollPosRef.current) > 15) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isMobileMenuOpen]);

  return (
    <div ref={containerRef} className={styles.headerContainer}>
      {/* 1. Desktop Top Bar */}
      <div className={styles.desktopWaterBar}>
        <div className={styles.logoWrapper}>
          <div className={styles.logoBox}>
            <Link href="/" onClick={closeMobileMenu} className={styles.logoLink}>
              <Image
                src={logo}
                alt="Logo"
                placeholder="blur"
                fill
                sizes="48px"
                className="object-cover"
                priority
              />
            </Link>
          </div>
        </div>
        <div className={styles.desktopNav}>
          <NavigationLinks closeMobileMenu={closeMobileMenu} />
        </div>
      </div>

      {/* 2. Mobile & Tablet Top Floating Logo */}
      <div className={styles.mobileTopLogo}>
        <div className={styles.logoBox}>
          <Link href="/" onClick={closeMobileMenu} className={styles.logoLink}>
            <Image
              src={logo}
              alt="Logo"
              placeholder="blur"
              fill
              sizes="40px"
              className="object-cover"
              priority
            />
          </Link>
        </div>
      </div>

      {/* 3. Mobile & Tablet Bottom Circular Glass Trigger Button */}
      <div className={styles.mobileBottomBar}>
        <motion.button
          onClick={toggleMobileMenu}
          whileTap={{ scale: 0.88 }}
          whileHover={{ scale: 1.08 }}
          animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className={styles.darkGlassTriggerBtn}
          aria-label="Toggle Navigation Menu"
        >
          {isMobileMenuOpen ? (
            <HiX className="h-6 w-6 text-[#ff033e]" />
          ) : (
            <HiMenu className="h-6 w-6 text-[#3e4355]" />
          )}
        </motion.button>
      </div>

      {/* 4. Mobile & Tablet Tilted Arc Stack Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className={styles.darkGlassStackMenu}>
            <NavigationLinks
              closeMobileMenu={closeMobileMenu}
              isMobileStack={true}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
