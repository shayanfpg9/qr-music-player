const getOSBitVersion = () => {
  const userAgent = navigator.userAgent.toLowerCase();

  if (
    // Check for 64-bit in Windows
    userAgent.includes("win64") ||
    userAgent.includes("wow64") ||
    // Check for 64-bit in Linux
    userAgent.includes("x86_64") ||
    userAgent.includes("amd64") ||
    // Check for 64-bit in Mac OS
    (userAgent.includes("macintosh") && userAgent.includes("x86_64"))
  ) {
    return "64-bit";
  }

  // Default to 32-bit
  return "32-bit";
};

const getUserAgentInfo = () => {
  const userAgent = navigator.userAgent;

  // Get browser name and version
  const browserInfo = {
    name: "",
    version: "",
  };

  if (userAgent.includes("Chrome") && !userAgent.includes("Edg")) {
    browserInfo.name = "Chrome";
    browserInfo.version = userAgent.match(/Chrome\/(\d+\.\d+)/)[1];
  } else if (userAgent.includes("Firefox")) {
    browserInfo.name = "Firefox";
    browserInfo.version = userAgent.match(/Firefox\/(\d+\.\d+)/)[1];
  } else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) {
    browserInfo.name = "Safari";
    browserInfo.version = userAgent.match(/Version\/(\d+\.\d+)/)[1];
  } else if (userAgent.includes("Edg")) {
    browserInfo.name = "Edge";
    browserInfo.version = userAgent.match(/Edg\/(\d+\.\d+)/)[1];
  } else if (userAgent.includes("MSIE") || userAgent.includes("Trident/")) {
    browserInfo.name = "Internet Explorer";
    browserInfo.version = userAgent.match(/(?:MSIE |rv:)(\d+\.\d+)/)[1];
  }

  // Get operating system and bit version
  const osInfo = {
    name: "",
    version: "",
    bit: getOSBitVersion(),
  };

  if (userAgent.includes("Windows NT")) {
    osInfo.name = "Windows";
    const versionMatch = userAgent.match(/Windows NT (\d+\.\d+)/);
    if (versionMatch) {
      const version = versionMatch[1];
      osInfo.version = version === "10.0" ? "10" : version;
    }
  } else if (userAgent.includes("Mac OS X")) {
    osInfo.name = "Mac OS";
    const versionMatch = userAgent.match(/Mac OS X (\d+_\d+)/);
    if (versionMatch) {
      osInfo.version = versionMatch[1].replace("_", ".");
    }
  } else if (userAgent.includes("Android")) {
    osInfo.name = "Android";
    const versionMatch = userAgent.match(/Android (\d+(\.\d+)?)/);
    if (versionMatch) {
      osInfo.version = versionMatch[1];
    }
  } else if (userAgent.includes("iPhone") || userAgent.includes("iPad")) {
    osInfo.name = "iOS";
    const versionMatch = userAgent.match(/OS (\d+_\d+)/);
    if (versionMatch) {
      osInfo.version = versionMatch[1].replace("_", ".");
    }
  } else if (userAgent.includes("Linux")) {
    osInfo.name = "Linux";
    osInfo.version = "";
  }
  
  return {
    browser: browserInfo,
    os: osInfo,
  };
};

export default getUserAgentInfo;
