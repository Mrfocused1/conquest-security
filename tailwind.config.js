/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#050608',
        surface: '#0B0D11',
        card: '#111418',
        card2: '#16191D',
        elev: '#1A1E24',
        t1: '#FFFFFF',
        t2: '#B4B7BD',
        t3: '#6E737D',
        ok: '#22C55E',
        warn: '#F59E0B',
        danger: '#EF4444',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 10px 30px rgba(0,0,0,0.25)',
        lift: '0 18px 45px rgba(0,0,0,0.45)',
        glow: '0 0 40px rgba(255,255,255,0.12)',
      },
      transitionDuration: {
        150: '150ms',
      },
    },
  },
  plugins: [],
}
