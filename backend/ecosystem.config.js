module.exports = {
  apps : [{
    name   : "vetigram-backend",
    script : "./dist/app.js",
    env_production: {
      NODE_ENV: "production",
    },
  }]
}
