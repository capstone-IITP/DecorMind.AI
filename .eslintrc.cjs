// Use CommonJS syntax for Node.js environment
module.exports = {
  extends: 'next/core-web-vitals',
  rules: {
    // Disable the no-img-element rule if you prefer using img tags in some places
    '@next/next/no-img-element': 'warn',
    
    // Disable the unescaped entities rule if needed
    'react/no-unescaped-entities': 'warn',
    
    // Set exhaustive-deps to warn instead of error if needed
    'react-hooks/exhaustive-deps': 'warn',
  },
}; 