module.exports = {
  apps: [
    {
      name       : 'daylux-server',
      script     : 'yarn',
      args       : '--cwd "server" start:production',
      interpreter: '/bin/bash',
      env        : {
        NODE_ENV: 'production'
      }
    }
  ]
};
