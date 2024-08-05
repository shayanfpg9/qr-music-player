const Footer = () => {
  return (
    <footer className="p-4 bg-gray-800 text-white text-center">
      <p>
        &copy; {new Date().getFullYear()} Music Player. All rights reserved. -
        <a
          href="http://github.com/shayanfpg9"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500"
        >
          @Shayanfpg9
        </a>
      </p>
    </footer>
  );
};

export default Footer;
