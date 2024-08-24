import React, { useState, useEffect, useRef } from "react";
import { BiLogoGmail } from "react-icons/bi";
import { FaBug, FaTelegram } from "react-icons/fa";
import { MdOutlineClose } from "react-icons/md";
import getUserAgentInfo from "../script/userAgent";

const ReportButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const menuRef = useRef(null);
  const userAgent = getUserAgentInfo();
  const report = {
    title: "🔴 Bug Report",
    text: encodeURI(
      `Bug on page "${encodeURIComponent(location.href)}"\nfor system: "${
        userAgent.os.name + userAgent.os.version + "(" + userAgent.os.bit
      })/${userAgent.browser.name + userAgent.browser.version}"\nand ip: "${
        window.ip
      }" `
    ),
  };

  const toggleMenu = () => {
    if (isOpen) {
      // Close the menu with animation
      menuRef.current.style.opacity = 0;
      menuRef.current.style.transform = "translateY(10px)";
      setTimeout(() => {
        setIsVisible(false);
      }, 300); // Wait for the animation to complete before hiding
    } else {
      // Open the menu
      setIsVisible(true);
      setTimeout(() => {
        menuRef.current.style.opacity = 1;
        menuRef.current.style.transform = "translateY(0)";
      }, 10); // Small timeout to ensure the animation runs
    }
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (!isVisible) {
      menuRef.current.style.display = "none";
    } else {
      menuRef.current.style.display = "flex";
    }
  }, [isVisible]);

  return (
    <div className="absolute bottom-0 left-0 flex flex-col-reverse items-center">
      <button
        onClick={toggleMenu}
        className={
          "bg-red-500 text-white p-4 rounded-full shadow-lg focus:outline-none transform transition-transform duration-300 " +
          (isOpen ? "scale-110 hover:scale-125" : "hover:scale-110")
        }
      >
        {isOpen ? (
          <MdOutlineClose className="size-6" />
        ) : (
          <FaBug className="size-6" />
        )}
      </button>

      <div
        ref={menuRef}
        className={`flex flex-col items-center space-y-2 mb-4 opacity-0 translate-y-10 transition-all duration-300`}
        style={{ display: "none" }}
      >
        <a
          href={`tg://resolve?domain=shayanfpg9&text=${report.text}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition duration-300"
        >
          <FaTelegram className="size-6" />
        </a>
        <a
          href={`mailto:shayanfpg9@duck.com?subject=${report.title}&body=${report.text}`}
          className="bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition duration-300"
        >
          <BiLogoGmail className="size-6" />
        </a>
      </div>
    </div>
  );
};

export default ReportButton;
