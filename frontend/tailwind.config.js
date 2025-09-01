// @type {import('tailwindcss').Config} */
const {group} = require("console");
const defaultTheme = require("tailwindcss/defaultTheme");
module.exports = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./src/components/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            fontFamily: {
                title: ["Inter", "sans-serif"],
                tHead: ["Lato", "sans-serif"],
            },
            colors: {
                customGray: "rgb(227, 227, 227)",
                footerTextColor: "rgba(255, 255, 255, 1)",
                footerBgColor: "rgba(20, 20, 20, 1)",
                primary: "#5A62DD",
                primary_hover: "#2531EF",
                // Colle la palette de rouge ici
                redShade: {
                    50: '#fef2f2',
                    100: '#fee2e2',
                    200: '#fecaca',
                    300: '#fca5a5', // Parfait pour ton cas d'usage !
                    400: '#f87171',
                    500: '#ef4444',
                    600: '#dc2626',
                    700: '#b91c1c',
                    800: '#991b1b', // Idéal pour le texte contrasté
                    900: '#7f1d1d',
                    950: '#450a0a'
                },
                red: "#F21F0C",
                draft: "#47556960",
                authBgColor: "#FDFDFD",
                btnColor: "#FBBE20",
                formInputTextColor: "#222B45",
                inputFieldColor: "#F9FAFB",
                dark: "#232A3C",
                medium: "#293245",
                buttonColor: "#685BFF",
                tBodyTextColor: "#475569",
                backColor: "#F0F0F0",
                searchColor: "#F8FAFC",
                gradientStart: "#593B99",
                gradientEnd: "#2D95F8",
                gradientGreenStart: "#08A710",
                gradientGreenEnd: "#00C80A",
                gradientBlueStart: "#5051C3",
                gradientBlueEnd: "#9178F1",
                gradientYellowStart: "#FCDD08",
                gradientYellowEnd: "#CFB60C",
                textColor: "#6D6E75",
                inputBgColor: "#F0F0F0",
                //secondary: "#F6C575",
                //lightBlack: "#161D4A",
                //slate: "#313D48",
                //danger: "#EA3E3E",
                //gray: "#748092",
                //pink: "#F4B6B5",
                //default: "#DFE5EF",
                //"primary-hover": "#D0BEF2",
                //"secondary-hover": "#4146ad",
                //"primary-light": "#fffbd7",
            },
            with: {
                482: "482px",
            },
            screens: {
                "lg-custom": "1200px", // Nouveau breakpoint
                "lg-custom2": "1620px", // Nouveau breakpoint
                "lg-custom3": "1670px", // Nouveau breakpoint
                "lg-custom4": "1420px", // Nouveau breakpoint
                "secondarySidebarRetract": "1405px",
                "md-custom": "767px",
            },
        },
    },
    plugins: [],
};

/*
fontFamily: {
        sans: ["Poppins", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        primary: "#4B5FC3",
        secondary: "#F6C575",
        lightBlack: "#161D4A",
        slate: "#313D48",
        danger: "#EA3E3E",
        gray: "#748092",
        pink: "#F4B6B5",
        default: "#DFE5EF",
        "primary-hover": "#D0BEF2",
        "secondary-hover": "#4146ad",
        "primary-light": "#fffbd7",
      },*/