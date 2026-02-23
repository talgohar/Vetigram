module.exports = {
  apps : [{
    name   : "vtegram-backend",
    script : "./dist/app.js",
    env_production: {
      NODE_ENV: "production",
    },
  }]
}
