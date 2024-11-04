// mui theme settings
export const themeSettings = (mode) => {
  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            // palette values for dark mode
            primary: {
              dark: "#99EEFD",
              main: "#00D5FA",
              light: "#00353F",
            },
            neutral: {
              dark: "#E0E0E0",
              main: "#C2C2C2",
              mediumMain: "#A3A3A3",
              medium: "#858585",
              light: "#333333",
            },
            background: {
              default: "#0A0A0A",
              alt: "#1A1A1A",
            },
          }
        : {
            // palette values for light mode
            primary: {
              dark: "#006B7D",
              main: "#00D5FA",
              light: "#E6FBFF",
            },
            neutral: {
              dark: "#333333",
              main: "#666666",
              mediumMain: "#858585",
              medium: "#A3A3A3",
              light: "#F0F0F0",
            },
            background: {
              default: "#F6F6F6",
              alt: "#FFFFFF",
            },
          }),
    },
    typography: {
      fontSize: 12,
      h1: {
        fontSize: 40,
      },
      h2: {
        fontSize: 32,
      },
      h3: {
        fontSize: 24,
      },
      h4: {
        fontSize: 20,
      },
      h5: {
        fontSize: 16,
      },
      h6: {
        fontSize: 14,
      },
    },
  };
};
