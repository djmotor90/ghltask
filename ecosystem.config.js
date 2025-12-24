{
  "apps": [
    {
      "name": "ghl-api",
      "script": "dist/main.js",
      "cwd": "./apps/api",
      "instances": "max",
      "exec_mode": "cluster",
      "env": {
        "NODE_ENV": "production",
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
      "instances": 2,
      "exec_mode": "cluster",
      "env": {
        "NODE_ENV": "production"
      },
      "error_file": "logs/web-error.log",
      "out_file": "logs/web-out.log",
      "log_date_format": "YYYY-MM-DD HH:mm:ss Z"
    }
  ]
}
