global.DEBUG = 0;
global.INFO  = 1;
global.WARNING = 2;
global.ERROR = 3;
global.FATAL = 4;

const FATAL_COLOR = '#d65156';

const setColor = (str, color) => {
  return `<font color='${color}'>${str}</font>`;
}

const buildArguments = (level) => {
  const out = [];
  switch (level) {
    case ERROR:
      out.push(setColor(`${Game.time} [ERROR]`, 'red'));
      break;
    case WARNING:
      out.push(setColor(`${Game.time} [WARNING]`, 'orange'));
      break;
    case INFO:
      out.push(setColor(`${Game.time} [INFO]`, 'green'));
      break;
    case DEBUG:
      out.push(setColor(`${Game.time} [DEBUG]`, 'gray'));
      break;
    case FATAL:
      out.push(setColor(`${Game.time} [FATAL]`, FATAL_COLOR));
      break;
  }
  return out;
}

/**
* 日志对象
* 支持Console输出以及邮件通知
*/
module.exports = class Log {

  get level() {
    return global.settings.log.level;
  }

  setLogLevel = (level) => {
    let changeValue = true;
    switch (level) {
      case ERROR:
        console.log(`Logging level set to ${level}. Displaying: ERROR.`);
        break;
      case WARNING:
        console.log(`Logging level set to ${level}. Displaying: ERROR, WARNING.`);
        break;
      case INFO:
        console.log(`Logging level set to ${level}. Displaying: ERROR, WARNING, ALERT, INFO.`);
        break;
      case DEBUG:
        console.log(`Logging level set to ${level}. Displaying: ERROR, WARNING, ALERT, INFO, DEBUG.`);
        break;
    }
    if (changeValue) {
      global.settings.log.level = level;
    }
  }

  notify (message) {
    this.alert(message);
    Game.notify(message);
  }

  throw (e) {
    console.log.apply(this, buildArguments(FATAL).concat([setColor(e.toString(), FATAL_COLOR)]));
  }

  error (...args) {
    if (this.level <= ERROR) {
      console.log.apply(this, buildArguments(ERROR).concat([].slice.call(args)));
    }
  }

  warning (...args) {
    if (this.level <= WARNING) {
      console.log.apply(this, buildArguments(WARNING).concat([].slice.call(args)));
    }
  }

  info (...args) {
    if (this.level <= INFO) {
      console.log.apply(this, buildArguments(INFO).concat([].slice.call(args)));
    }
  }

  debug (...args) {
    if (this.level <= DEBUG) {
      console.log.apply(this, buildArguments(DEBUG).concat([].slice.call(args)));
    }
  }

  printObject (obj) {
    console.log.apply(this, buildArguments(DEBUG).concat(JSON.stringify(obj)));
  }
}

