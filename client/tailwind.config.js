/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        border: "var(--color-border)",
        input: "var(--color-input)",
        ring: "var(--color-ring)",
        background: "var(--color-background)",
        foreground: "var(--color-foreground)",
        primary: {
          DEFAULT: "var(--color-primary)" /* pink-200 */,
          foreground: "var(--color-primary-foreground)" /* gray-900 */,
        },
        secondary: {
          DEFAULT: "var(--color-secondary)" /* pink-300 */,
          foreground: "var(--color-secondary-foreground)" /* white */,
        },
        accent: {
          DEFAULT: "var(--color-accent)" /* blue-200 */,
          foreground: "var(--color-accent-foreground)" /* blue-900 */,
        },
        muted: {
          DEFAULT: "var(--color-muted)" /* pink-100 */,
          foreground: "var(--color-muted-foreground)" /* gray-600 */,
        },
        card: {
          DEFAULT: "var(--color-card)" /* pink-100 */,
          foreground: "var(--color-card-foreground)" /* gray-900 */,
        },
        popover: {
          DEFAULT: "var(--color-popover)" /* pink-100 */,
          foreground: "var(--color-popover-foreground)" /* gray-900 */,
        },
        success: {
          DEFAULT: "var(--color-success)" /* green-200 */,
          foreground: "var(--color-success-foreground)" /* green-900 */,
        },
        warning: {
          DEFAULT: "var(--color-warning)" /* orange-200 */,
          foreground: "var(--color-warning-foreground)" /* orange-900 */,
        },
        error: {
          DEFAULT: "var(--color-error)" /* red-200 */,
          foreground: "var(--color-error-foreground)" /* red-900 */,
        },
        destructive: {
          DEFAULT: "var(--color-destructive)" /* red-200 */,
          foreground: "var(--color-destructive-foreground)" /* red-900 */,
        },
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        heading: ["Nunito", "sans-serif"],
        caption: ["Poppins", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      fontSize: {
        h1: ["2.25rem", { lineHeight: "1.2", fontWeight: "800" }],
        h2: ["1.875rem", { lineHeight: "1.25", fontWeight: "700" }],
        h3: ["1.5rem", { lineHeight: "1.3", fontWeight: "700" }],
        h4: ["1.25rem", { lineHeight: "1.4", fontWeight: "600" }],
        h5: ["1.125rem", { lineHeight: "1.5", fontWeight: "600" }],
        caption: ["0.875rem", { lineHeight: "1.4", letterSpacing: "0.025em" }],
      },
      spacing: {
        18: "4.5rem",
        88: "22rem",
      },
      boxShadow: {
        sm: "0 2px 4px rgba(255, 182, 193, 0.15)",
        DEFAULT: "0 4px 6px rgba(255, 182, 193, 0.15)",
        md: "0 6px 12px rgba(255, 182, 193, 0.15)",
        lg: "0 12px 24px rgba(255, 182, 193, 0.15)",
        xl: "0 16px 32px rgba(255, 182, 193, 0.15)",
        "2xl": "0 20px 40px -8px rgba(255, 182, 193, 0.15)",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      transitionDuration: {
        250: "250ms",
      },
      keyframes: {
        "slide-down": {
          "0%": { opacity: "0", transform: "translateY(-8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
      },
      animation: {
        "slide-down": "slide-down 250ms cubic-bezier(0.4, 0, 0.2, 1)",
        "slide-up": "slide-up 250ms cubic-bezier(0.4, 0, 0.2, 1)",
        "scale-in": "scale-in 250ms cubic-bezier(0.4, 0, 0.2, 1)",
        shimmer: "shimmer 2s linear infinite",
        "pulse-soft": "pulse-soft 2s cubic-bezier(0.4, 0, 0.2, 1) infinite",
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("tailwindcss-animate")],
};
