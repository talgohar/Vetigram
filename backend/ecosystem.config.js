module.exports = {
  apps : [{
    name   : "medigram",
    script : "./dist/app.js",
    env_production: {
      NODE_ENV: "production",
    },
  }]
}
