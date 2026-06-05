/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Background
        'bg-primary': '#050e1a',
        'bg-panel': '#0a1a2e',
        'bg-panel-hover': '#0f2540',
        'bg-card': 'rgba(10, 26, 46, 0.85)',
        'bg-header': '#061220',
        'bg-nav': '#040d18',
        'bg-sidebar': '#0a1a2e',
        'bg-overlay': 'rgba(5, 14, 26, 0.95)',
        'bg-active': '#0f2540',
        // Border
        'border-primary': '#1a3a5c',
        'border-glow': '#00c8ff',
        'border-subtle': '#0f2540',
        'border-accent': '#00e5ff',
        // Accent Cyan
        'accent-cyan': '#00e5ff',
        'accent-cyan-dim': '#00a3b3',
        'accent-cyan-glow': 'rgba(0, 229, 255, 0.3)',
        'accent-teal': '#00ffcc',
        // Status
        'status-normal': '#00ff88',
        'status-warning': '#ffcc00',
        'status-danger': '#ff4444',
        'status-offline': '#888888',
        'status-info': '#00aaff',
        // Chart
        'chart-cyan': '#00e5ff',
        'chart-green': '#00ff88',
        'chart-yellow': '#ffcc00',
        'chart-orange': '#ff8833',
        'chart-red': '#ff4444',
        'chart-blue': '#4488ff',
        'chart-purple': '#aa66ff',
        // Text
        'text-primary': '#ffffff',
        'text-secondary': '#a0b4c8',
        'text-tertiary': '#5a7a94',
        'text-data': '#00e5ff',
        'text-success': '#00ff88',
        'text-danger': '#ff4444',
        // Legacy shadcn compatibility
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        'zh': ['"PingFang SC"', '"Microsoft YaHei"', '"Noto Sans SC"', 'system-ui', 'sans-serif'],
        'mono-data': ['"Roboto Mono"', '"JetBrains Mono"', 'monospace'],
        'sans': ['system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xs: "calc(var(--radius) - 6px)",
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        'glow-cyan': '0 0 12px rgba(0, 229, 255, 0.3)',
        'glow-cyan-strong': '0 0 20px rgba(0, 229, 255, 0.5)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 4px #00ff88", opacity: "1" },
          "50%": { boxShadow: "0 0 12px #00ff88", opacity: "0.8" },
        },
        "blink": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.3" },
        },
        "slideInLeft": {
          from: { transform: "translateX(-30px)", opacity: "0" },
          to: { transform: "translateX(0)", opacity: "1" },
        },
        "slideInRight": {
          from: { transform: "translateX(30px)", opacity: "0" },
          to: { transform: "translateX(0)", opacity: "1" },
        },
        "slideUp": {
          from: { transform: "translateY(20px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        "fadeIn": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "flow-dash": {
          "0%": { strokeDashoffset: "0" },
          "100%": { strokeDashoffset: "-14" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "blink": "blink 1s infinite",
        "slideInLeft": "slideInLeft 0.4s ease-out",
        "slideInRight": "slideInRight 0.4s ease-out",
        "slideUp": "slideUp 0.5s ease-out",
        "fadeIn": "fadeIn 0.4s ease-out",
        "flow-dash": "flow-dash 1.5s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
