module.exports = {
  "apps": [
    {
      "name": "ghl-api",
      "script": "dist/main.js",
      "cwd": "./apps/api",
      "instances": "max",
      "exec_mode": "cluster",
      "env": {
        "NODE_ENV": "development",
        "PORT": 3001
      },
      "error_file": "logs/api-error.log",
      "out_file": "logs/api-out.log",
      "log_date_format": "YYYY-MM-DD HH:mm:ss Z"
    },
    {
      "name": "ghl-web",
      "script": "node_modules/.bin/next",
      "args": "start -p 3000",
      "cwd": "./apps/web",
      "instances": 1,
      "exec_mode": "fork",
      "env": {
        "NODE_ENV": "development"
      },
      "error_file": "logs/web-error.log",
      "out_file": "logs/web-out.log",
      "log_date_format": "YYYY-MM-DD HH:mm:ss Z"
    }
  ]
}
