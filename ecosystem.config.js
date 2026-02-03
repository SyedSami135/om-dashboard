module.exports = {
  apps: [{
    name: 'om-dashboard',
    script: 'npm',
    args: 'start',
    cwd: process.cwd(),
    instances: 1,
    autorestart: true,
    watch: false,
    time: true,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development',
      PORT: process.env.PORT || 3008,
      HOSTNAME: process.env.HOSTNAME || process.env.HOST || '0.0.0.0'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: process.env.PORT || 3008,
      HOSTNAME: process.env.HOSTNAME || process.env.HOST || 'om-dashboard.duckdns.org'
    }
  }]
};
