/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Cream & Black Minimal Palette
        cream: {
          50: '#FDFCFA',   // Lightest cream
          100: '#FAF8F5',  // Very light cream
          200: '#F5F2ED',  // Light cream
          300: '#EDE8E0',  // Cream
          400: '#E5DFD4',  // Medium cream
          500: '#DDD6C8',  // Base cream
          600: '#C9BFB0',  // Darker cream
          700: '#B5A898',  // Dark cream
        },
        black: {
          DEFAULT: '#0A0A0A', // Pure black
          50: '#F5F5F5',      // Near white
          100: '#E0E0E0',     // Very light gray
          200: '#CCCCCC',     // Light gray
          300: '#B3B3B3',     // Medium light gray
          400: '#999999',     // Medium gray
          500: '#808080',     // Gray
          600: '#666666',     // Dark gray
          700: '#4D4D4D',     // Darker gray
          800: '#333333',     // Very dark gray
          900: '#1A1A1A',     // Almost black
        },
      },
      fontFamily: {
        // Yellix for headings (we'll need to import this)
        display: ['Yellix', 'ui-serif', 'Georgia', 'serif'],
        // Space Grotesk for body
        sans: ['Space Grotesk', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Award-winning typography scale
        'display-xl': ['clamp(3.5rem, 8vw, 7rem)', { lineHeight: '1', letterSpacing: '-0.02em' }],
        'display-lg': ['clamp(2.5rem, 6vw, 5rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-md': ['clamp(2rem, 4vw, 3.5rem)', { lineHeight: '1.1', letterSpacing: '-0.01em' }],
        'display-sm': ['clamp(1.5rem, 3vw, 2.5rem)', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'heading-xl': ['clamp(2rem, 3vw, 3rem)', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'heading-lg': ['clamp(1.5rem, 2.5vw, 2.25rem)', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
        'heading-md': ['clamp(1.25rem, 2vw, 1.75rem)', { lineHeight: '1.3' }],
        'heading-sm': ['clamp(1.125rem, 1.5vw, 1.5rem)', { lineHeight: '1.4' }],
        'body-xl': ['1.25rem', { lineHeight: '1.7' }],
        'body-lg': ['1.125rem', { lineHeight: '1.7' }],
        'body-md': ['1rem', { lineHeight: '1.6' }],
        'body-sm': ['0.875rem', { lineHeight: '1.6' }],
        'body-xs': ['0.75rem', { lineHeight: '1.5' }],
      },
      spacing: {
        // Generous spacing scale for award-winning layouts
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
        '34': '8.5rem',
        '38': '9.5rem',
        '42': '10.5rem',
        '46': '11.5rem',
        '50': '12.5rem',
        '54': '13.5rem',
        '58': '14.5rem',
        '62': '15.5rem',
        '66': '16.5rem',
        '70': '17.5rem',
      },
      maxWidth: {
        '8xl': '90rem',
        '9xl': '100rem',
        'container': '1440px',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'fade-in-up': 'fadeInUp 0.4s ease-out',
        'fade-in-down': 'fadeInDown 0.4s ease-out',
        'slide-in-left': 'slideInLeft 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'scale-in': 'scaleIn 0.25s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-10px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(10px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.98)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'in-expo': 'cubic-bezier(0.7, 0, 0.84, 0)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
