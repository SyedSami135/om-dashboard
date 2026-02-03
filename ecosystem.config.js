module.exports = {
  apps: [{
    name: 'om-dashboard',
    script: 'npm',
    args: 'start',
    cwd: process.cwd(),
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development',
      PORT: process.env.PORT,
      HOSTNAME: process.env.HOSTNAME || process.env.HOST
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: process.env.PORT,
      HOSTNAME: process.env.HOSTNAME || process.env.HOST
    }
  }]
};