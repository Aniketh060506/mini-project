/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0B1120",
        foreground: "#F8FAFC",
        card: "#1E293B",
        primary: "#3B82F6",
        "primary-foreground": "#FFFFFF",
        secondary: "#334155",
        muted: "#1E293B",
        "muted-foreground": "#94A3B8",
        accent: "#F59E0B",
        destructive: "#EF4444",
        "destructive-foreground": "#FFFFFF",
        success: "#10B981",
        warning: "#F59E0B",
        critical: "#EF4444",
        border: "#334155",
      }
    },
  },
  plugins: [],
}
