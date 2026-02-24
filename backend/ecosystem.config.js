module.exports = {
  apps: [
    {
      name: "vtegram-backend",
      script: "./dist/app.js",
      env_file: "./.env_prod",
      env_production: {
        NODE_ENV: "production"
      }
    }
  ]
};