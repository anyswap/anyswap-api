const log4js = require('log4js')
log4js.configure({
  "appenders": {
    "console": {
      "type": "console" // 可以设置成 console、file、dateFile三种
    },
    "trace": {
      "type": "dateFile",
      "filename": "./logs/access-", // 设置log输出的文件路劲和文件名
      "pattern": ".yyyy-MM-dd.log",
      "alwaysIncludePattern": true, // 和上面同时使用 设置每天生成log名
      "maxLogSize ": 31457280
    },
    "http": {
      "type": "logLevelFilter",
      "appender": "trace",
      "level": "trace",
      "maxLevel": "trace"
    },
    "info": {
      "type": "dateFile",
      "filename": "./logs/info-",
      "encoding": "utf-8", // 设置文件编码格式
      "pattern": ".yyyy-MM-dd.log",
      "maxLogSize": 10000000, // 设置文件大小
      "alwaysIncludePattern": true,
      "layout": {
        "type": "pattern",
        "pattern": "[%d{ISO8601}][%5p  %z  %c] %m"
      },
      "compress": true
    },
    "maxInfo": {
      "type": "logLevelFilter",
      "appender": "info",
      "level": "debug", // 设置log输出的最低级别
      "maxLevel": "error" // 设置log输出的最高级别 
    },
    "error": {
      "type": "dateFile",
      "filename": "./logs/error-",
      "pattern": ".yyyy-MM-dd.log",
      "maxLogSize": 10000000,
      "encoding": "utf-8",
      "alwaysIncludePattern": true,
      "layout": {
        "type": "pattern",
        "pattern": "[%d{ISO8601}][%5p  %z  %c] %m"
      },
      "compress": true
    },
    "minError": {
      "type": "logLevelFilter",
      "appender": "error",
      "level": "error"
    }
  },
  "categories": {
    "default": {
      "appenders": [
        "console",
        "http",
        "maxInfo",
        "minError"
      ],
      "level": "all"
    }
  }
})

module.exports = log4js