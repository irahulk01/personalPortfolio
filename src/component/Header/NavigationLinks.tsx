"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import styles from "./NavigationLinks.module.css";

function NavigationLinks({
  closeMobileMenu,
  isMobileStack = false,
}: {
  closeMobileMenu?: () => void;
  isMobileStack?: boolean;
}) {
  const pathname = usePathname();

  // Arc path offsets (x-offsets) following the curved path drawn by user
  const navLinks = [
    { path: "/", text: "Home", xOffset: -18 },
    { path: "/about", text: "About", xOffset: -36 },
    { path: "/work", text: "Works", xOffset: -48 },
    { path: "/resume", text: "Resume", xOffset: -32 },
    { path: "/contact", text: "Contact", xOffset: -14 },
  ];

  const handleClick = () => {
    if (closeMobileMenu) {
      closeMobileMenu();
    }
  };

  return (
    <nav className={styles.navContainer}>
      {navLinks.map((link, index) => {
        const isActive = pathname === link.path;

        return (
          <motion.div
            key={index}
            initial={
              isMobileStack
                ? { opacity: 0, x: 40, y: 50, scale: 0.6 }
                : undefined
            }
            animate={
              isMobileStack
                ? { opacity: 1, x: link.xOffset, y: 0, scale: 1 }
                : undefined
            }
            exit={
              isMobileStack
                ? { opacity: 0, x: 30, y: 30, scale: 0.7 }
                : undefined
            }
            transition={{
              type: "spring",
              stiffness: 380,
              damping: 24,
              delay: isMobileStack ? (navLinks.length - 1 - index) * 0.045 : 0,
            }}
            whileHover={
              isMobileStack ? { scale: 1.08, x: link.xOffset - 6 } : undefined
            }
            whileTap={isMobileStack ? { scale: 0.95 } : undefined}
            className="w-full flex justify-end lg:w-auto lg:block"
          >
            <Link
              href={link.path}
              onClick={handleClick}
              className={`${styles.navLink} ${
                isActive ? styles.navLinkActive : ""
              }`}
            >
              {link.text}
            </Link>
          </motion.div>
        );
      })}
    </nav>
  );
}

export default NavigationLinks;
