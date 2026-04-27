import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#111214",
        surface: "#18191C",
        "surface-2": "#1E2024",
        border: "#2A2D33",
        "border-subtle": "#222529",
        "text-primary": "#E8E6E1",
        "text-secondary": "#9A9693",
        "text-muted": "#5C5A57",
        accent: "#C6A75E",
        "accent-dim": "#8B7241",
        "accent-subtle": "#1F1A11",
        success: "#4A7C59",
        danger: "#8B3A3A",
        warning: "#8B6F2E",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
      fontSize: {
        "display-xl": ["72px", { lineHeight: "1", fontWeight: "700", letterSpacing: "-0.03em" }],
        "display-lg": ["48px", { lineHeight: "1.05", fontWeight: "700", letterSpacing: "-0.025em" }],
        "display-md": ["36px", { lineHeight: "1.1", fontWeight: "600", letterSpacing: "-0.02em" }],
        "display-sm": ["28px", { lineHeight: "1.15", fontWeight: "600", letterSpacing: "-0.015em" }],
      },
      borderRadius: {
        sm: "4px",
        DEFAULT: "6px",
        md: "6px",
        lg: "8px",
      },
      spacing: {
        sidebar: "240px",
        header: "56px",
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3)",
        "card-lg": "0 4px 12px rgba(0,0,0,0.5)",
        accent: "0 0 0 1px rgba(198,167,94,0.2)",
      },
      animation: {
        "fade-in": "fadeIn 0.2s ease-out",
        "slide-up": "slideUp 0.2s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
