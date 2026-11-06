export default {
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#1a365d',
          deep: '#102542',
          soft: '#e8eef7',
          line: '#c9d6e6',
        },
        orange: {
          DEFAULT: '#f97316',
          deep: '#c2410c',
          soft: '#fff1e5',
          hover: '#fb8a3c',
        },
        ink: {
          DEFAULT: '#16202e',
          2: '#45566d',
          3: '#5c6b7f',
        },
        surface: '#ffffff',
        'surface-2': '#fafbfc',
        line: '#e2e6ec',
        'line-strong': '#c7d0dc',
        page: '#f3f4f6',
        ok: '#157347',
        'ok-bg': '#e6f4ec',
        bad: '#b42318',
        'bad-bg': '#fdecea',
        warn: '#8a5308',
        'warn-bg': '#fdf0d5',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      borderRadius: {
        card: '18px',
      },
      boxShadow: {
        card: '0 8px 24px -14px rgba(16,37,66,0.32)',
        float: '0 12px 30px -10px rgba(16,37,66,0.38)',
      },
    },
  },
};
