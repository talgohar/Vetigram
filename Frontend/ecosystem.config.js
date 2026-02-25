module.exports = {
  apps: [
    {
      name: "vetigram-frontend",
      script: "npm",
      args: "run preview:prod",
      cwd: "/home/node/Vetigram/frontend",
      env_production: {
        NODE_ENV: "production"
      }
    }
  ]
};
