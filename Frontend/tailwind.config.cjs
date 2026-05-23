/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            colors: {
                dark: {
                    bg: '#111111',
                    card: '#1a1a1a',
                    elevated: '#222222',
                    border: 'rgba(255,255,255,0.08)',
                },
                cream: {
                    DEFAULT: '#e8d5b0',
                    light: '#f5ede0',
                    muted: '#c9b99a',
                    dim: '#a89070',
                },
            },
        },
    },
    plugins: [],
}
