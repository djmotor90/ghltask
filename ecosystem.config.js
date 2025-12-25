module.exports = {
  "apps": [
    {
      "name": "ghl-api",
      "script": "dist/main.js",
      "cwd": "./apps/api",
      "instances": 1,
      "exec_mode": "fork",
      "env": {
        "NODE_ENV": "production",
        "PORT": 3001
      },
      "env_production": {
        "NODE_ENV": "production",
        "PORT": 3001
      }
    },
    {
      "name": "ghl-web",
      "script": "node_modules/.bin/next",
      "args": "start -p 3000",
      "cwd": "./apps/web",
      "instances": 1,
      "exec_mode": "fork",
      "env": {
        "NODE_ENV": "production"
      },
      "env_production": {
        "NODE_ENV": "production"
      }
    }
  ]
}
