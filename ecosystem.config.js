module.exports = {
  apps: [
    {
      name: 'gift-grade8-linear-eq',
      cwd: './backend',
      script: 'index.js',
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production',
        HOST: '0.0.0.0',
        PORT: 3015,
      },
    },
  ],
};
