/*
 * The following goog.* methods are adapted from the Google closure toolkit
 * See http://closure-library.googlecode.com/ for the full closure library
 */
var goog = {};
goog.global = this;

goog.abstractMethod = function() {
  throw new Error('unimplemented abstract method');
};

/**
 * @param {Function} fn
 * @param {Object|undefined} selfObj
 * @param {...*} var_args
 * @return {!Function}
 */
goog.bind = function(fn, selfObj, var_args) {
  var context = selfObj || goog.global;
  if (arguments.length > 2) {
    var boundArgs = Array.prototype.slice.call(arguments, 2);
    return function() {
      var newArgs = Array.prototype.slice.call(arguments);
      Array.prototype.unshift.apply(newArgs, boundArgs);
      return fn.apply(context, newArgs);
    };
  } else {
    return function() {
      return fn.apply(context, arguments);
    };
  }
};

/**
 * @param {Function} fn
 * @param {...*} var_args
 * @return {!Function}
 */
goog.partial = function(fn, var_args) {
  var args = Array.prototype.slice.call(arguments, 1);
  return function() {
    var newArgs = Array.prototype.slice.call(arguments);
    newArgs.unshift.apply(newArgs, args);
    return fn.apply(this, newArgs);
  };
};

goog.inherits = function(childCtor, parentCtor) {
  /** @constructor */
  function tempCtor() {};
  tempCtor.prototype = parentCtor.prototype;
  childCtor.superClass_ = parentCtor.prototype;
  childCtor.prototype = new tempCtor();
  childCtor.prototype.constructor = childCtor;
};

goog.asserts = {};

/**
 * @param {boolean} condition
 * @param {string=} opt_message
 */
goog.asserts.assert = function(condition, opt_message) {
  if (!condition) {
    throw new Error(opt_message || 'Assert failed');
  }
};

goog.dom = {};
goog.dom.classes = {};

goog.dom.classes.set = function(element, className) {
  element.className = className;
};

goog.dom.classes.get = function(element) {
  var className = element.className;
  return className && typeof className.split == 'function' ?
      className.split(/\s+/) : [];
};

/**
 * @param {Element} element
 * @param {...string} var_args
 */
goog.dom.classes.add = function(element, var_args) {
  var classes = goog.dom.classes.get(element);
  var args = Array.prototype.slice.call(arguments, 1);

  var b = goog.dom.classes.add_(classes, args);
  element.className = classes.join(' ');

  return b;
};

/**
 * @param {Element} element
 * @param {...string} var_args
 */
goog.dom.classes.remove = function(element, var_args) {
  var classes = goog.dom.classes.get(element);
  var args = Array.prototype.slice.call(arguments, 1);

  var b = goog.dom.classes.remove_(classes, args);
  element.className = classes.join(' ');

  return b;
};

goog.dom.classes.add_ = function(classes, args) {
  var rv = 0;
  for (var i = 0; i < args.length; i++) {
    if (Array.prototype.indexOf.call(classes, args[i]) < 0) {
      classes.push(args[i]);
      rv++;
    }
  }
  return rv == args.length;
};

goog.dom.classes.remove_ = function(classes, args) {
  var rv = 0;
  for (var i = 0; i < classes.length; i++) {
    if (Array.prototype.indexOf.call(args, classes[i]) >= 0) {
      Array.prototype.splice.call(classes, i--, 1);
      rv++;
    }
  }
  return rv == args.length;
};

goog.dom.classes.has = function(element, className) {
  return goog.dom.classes.get(element).indexOf(className) >= 0;
};

goog.dom.classes.enable = function(element, className, enabled) {
  if (enabled) {
    goog.dom.classes.add(element, className);
  } else {
    goog.dom.classes.remove(element, className);
  }
};

goog.dom.classes.toggle = function(element, className) {
  var add = !goog.dom.classes.has(element, className);
  goog.dom.classes.enable(element, className, add);
  return add;
};

goog.string = {};

goog.string.contains = function(s, ss) {
  return s.indexOf(ss) != -1;
};

goog.string.trim = function(str) {
  return str.replace(/^[\s\xa0]+|[\s\xa0]+$/g, '');
};

goog.string.compareVersions = function(version1, version2) {
  var order = 0;
  // Trim leading and trailing whitespace and split the versions into
  // subversions.
  var v1Subs = goog.string.trim(String(version1)).split('.');
  var v2Subs = goog.string.trim(String(version2)).split('.');
  var subCount = Math.max(v1Subs.length, v2Subs.length);

  // Iterate over the subversions, as long as they appear to be equivalent.
  for (var subIdx = 0; order == 0 && subIdx < subCount; subIdx++) {
    var v1Sub = v1Subs[subIdx] || '';
    var v2Sub = v2Subs[subIdx] || '';

    var v1CompParser = new RegExp('(\\d*)(\\D*)', 'g');
    var v2CompParser = new RegExp('(\\d*)(\\D*)', 'g');
    do {
      var v1Comp = v1CompParser.exec(v1Sub) || ['', '', ''];
      var v2Comp = v2CompParser.exec(v2Sub) || ['', '', ''];
      // Break if there are no more matches.
      if (v1Comp[0].length == 0 && v2Comp[0].length == 0) {
        break;
      }

      // Parse the numeric part of the subversion. A missing number is
      // equivalent to 0.
      var v1CompNum = v1Comp[1].length == 0 ? 0 : parseInt(v1Comp[1], 10);
      var v2CompNum = v2Comp[1].length == 0 ? 0 : parseInt(v2Comp[1], 10);

      order = goog.string.compareElements_(v1CompNum, v2CompNum) ||
          goog.string.compareElements_(v1Comp[2].length == 0,
              v2Comp[2].length == 0) ||
          goog.string.compareElements_(v1Comp[2], v2Comp[2]);
    } while (order == 0);
  }

  return order;
};

goog.string.compareElements_ = function(left, right) {
  if (left < right) {
    return -1;
  } else if (left > right) {
    return 1;
  }
  return 0;
};

goog.userAgent = {};

goog.userAgent.getUserAgentString = function() {
  return goog.global['navigator'] ? goog.global['navigator'].userAgent : null;
};

goog.userAgent.getNavigator = function() {
  return goog.global['navigator'];
};

goog.userAgent.init_ = function() {
  goog.userAgent.detectedOpera_ = false;
  goog.userAgent.detectedIe_ = false;
  goog.userAgent.detectedWebkit_ = false;
  goog.userAgent.detectedMobile_ = false;
  goog.userAgent.detectedGecko_ = false;

  var ua;
  if (ua = goog.userAgent.getUserAgentString()) {
    var navigator = goog.userAgent.getNavigator();
    goog.userAgent.detectedOpera_ = ua.indexOf('Opera') == 0;
    goog.userAgent.detectedIe_ = !goog.userAgent.detectedOpera_ &&
        ua.indexOf('MSIE') != -1;
    goog.userAgent.detectedWebkit_ = !goog.userAgent.detectedOpera_ &&
        ua.indexOf('WebKit') != -1;
    goog.userAgent.detectedMobile_ = goog.userAgent.detectedWebkit_ &&
        ua.indexOf('Mobile') != -1;
    goog.userAgent.detectedGecko_ = !goog.userAgent.detectedOpera_ &&
        !goog.userAgent.detectedWebkit_ && navigator.product == 'Gecko';
  }
};

goog.userAgent.init_();

goog.userAgent.OPERA = goog.userAgent.detectedOpera_;
goog.userAgent.IE = goog.userAgent.detectedIe_;
goog.userAgent.GECKO = goog.userAgent.detectedGecko_;
goog.userAgent.WEBKIT = goog.userAgent.detectedWebkit_;
goog.userAgent.MOBILE = goog.userAgent.detectedMobile_;

goog.userAgent.determinePlatform_ = function() {
  var navigator = goog.userAgent.getNavigator();
  return navigator && navigator.platform || '';
};

goog.userAgent.PLATFORM = goog.userAgent.determinePlatform_();

goog.userAgent.initPlatform_ = function() {
  goog.userAgent.detectedMac_ = goog.string.contains(goog.userAgent.PLATFORM,
      'Mac');
  goog.userAgent.detectedWindows_ = goog.string.contains(
      goog.userAgent.PLATFORM, 'Win');
  goog.userAgent.detectedLinux_ = goog.string.contains(goog.userAgent.PLATFORM,
      'Linux');
  goog.userAgent.detectedX11_ = !!goog.userAgent.getNavigator() &&
      goog.string.contains(goog.userAgent.getNavigator()['appVersion'] || '',
          'X11');
};

goog.userAgent.initPlatform_();

goog.userAgent.MAC = goog.userAgent.detectedMac_;
goog.userAgent.WINDOWS = goog.userAgent.detectedWindows_;
goog.userAgent.LINUX = goog.userAgent.detectedLinux_;
goog.userAgent.X11 = goog.userAgent.detectedX11_;

goog.userAgent.determineVersion_ = function() {
 var version = '', re;

  if (goog.userAgent.OPERA && goog.global['opera']) {
    var operaVersion = goog.global['opera'].version;
    version = typeof operaVersion == 'function' ? operaVersion() : operaVersion;
  } else {
    if (goog.userAgent.GECKO) {
      re = /rv\:([^\);]+)(\)|;)/;
    } else if (goog.userAgent.IE) {
      re = /MSIE\s+([^\);]+)(\)|;)/;
    } else if (goog.userAgent.WEBKIT) {
      // WebKit/125.4
      re = /WebKit\/(\S+)/;
    }
    if (re) {
      var arr = re.exec(goog.userAgent.getUserAgentString());
      version = arr ? arr[1] : '';
    }
  }
  if (goog.userAgent.IE) {
   var docMode = goog.userAgent.getDocumentMode_();
    if (docMode > parseFloat(version)) {
      return String(docMode);
    }
  }
  return version;
};

goog.userAgent.getDocumentMode_ = function() {
  var doc = goog.global['document'];
  return doc ? doc['documentMode'] : undefined;
};

goog.userAgent.VERSION = goog.userAgent.determineVersion_();

goog.userAgent.isVersionCache_ = {};

/**
 * @return {boolean} Whether the user agent version is higher or the same as
 *     the given version.
 */
goog.userAgent.isVersion = function(version) {
  return goog.userAgent.isVersionCache_[version] ||
      (goog.userAgent.isVersionCache_[version] =
          goog.string.compareVersions(goog.userAgent.VERSION, version) >= 0);
};

var main = {};

main.Util = {};

main.Util.hzToMs = function(hz) {
  return 1000 / hz;
};

/** @constructor */
main.EventHost = function() {
  this.listeners = [];
};

main.EventHost.prototype.addListener = function(listener) {
  this.listeners.push(listener);
};

/**
 * @param {...*} var_args
 */
main.EventHost.prototype.fire = function(var_args) {
  for (var i = 0; i < this.listeners.length; i++) {
    this.listeners[i].apply(null, arguments);
  }
};

/** @constructor */
main.Point = function(x, y) {
  this.x = x;
  this.y = y;
};

main.Point.prototype.setX = function(x) {
  this.x = x;
  return this;
};

main.Point.prototype.setY = function(y) {
  this.y = y;
  return this;
};

main.Point.prototype.clone = function() {
  return new main.Point(this.x, this.y);
};

/** @constructor */
main.Size = function(width, height) {
  this.width = width;
  this.height = height;
};

main.Size.prototype.clone = function() {
  return new main.Size(this.width, this.height);
};

/** @constructor */
main.Bounds = function(left, top, right, bottom) {
  this.left = left;
  this.top = top;
  this.right = right;
  this.bottom = bottom;
};

main.Bounds.forPoint = function(point) {
  return new main.Bounds(point.x, point.y, point.x, point.y);
};

main.Bounds.prototype.addPoint = function(point) {
  this.left = Math.min(point.x, this.left);
  this.right = Math.max(point.x, this.right);
  this.top = Math.min(point.y, this.top);
  this.bottom = Math.max(point.y, this.bottom);
};

main.Bounds.prototype.getWidth = function() {
  return this.right - this.left;
};

main.Bounds.prototype.getHeight = function() {
  return this.bottom - this.top;
};

/** @constructor */
main.MotionBlurSpec = function(points) {
  this.points = points;
};

main.MotionBlurSpec.prototype.getPoints = function() {
  return this.points;
};

main.MotionBlurSpec.prototype.getBounds = function() {
  var bounds = main.Bounds.forPoint(this.points[0]);
  for (var i = 1; i < this.points.length; i++) {
    bounds.addPoint(this.points[i]);
  }
  return bounds;
};

main.MotionBlurSpec.forHorizontalLinearPath = function(distance) {
  var points = [];
  for (var i = 0; i < distance; i++) {
    points.push(new main.Point(i - Math.floor(distance/2), 0));
  }
  return new main.MotionBlurSpec(points);
};

main.MotionBlurSpec.forDiagonalLinearPath = function(distance) {
  var points = [];
  for (var i = 0; i < distance; i++) {
    var pos = i - Math.floor(distance/2);
    points.push(new main.Point(pos, pos));
  }
  return new main.MotionBlurSpec(points);
};

/**
 * @param {boolean} enabled
 * @param {number=} opt_weight
 * @constructor
 */
main.MotionBlurConfig = function(enabled, opt_weight) {
  /** @type {boolean} */
  this.enabled = enabled;
  /** @type {number} */
  this.weight = opt_weight || 1.0;
};

main.MotionBlurConfig.fromString = function(str) {
  if (str == 'None') {
    return new main.MotionBlurConfig(false);
  } else {
    return new main.MotionBlurConfig(true, parseFloat(str) + 0.0);
  }
};

main.MotionBlurConfig.prototype.isEnabled = function() {
  return this.enabled;
};

main.MotionBlurConfig.prototype.getWeight = function() {
  return this.weight;
};

main.MotionBlurConfig.prototype.toString = function() {
  if (this.enabled) {
    return '' + this.weight;
  } else {
    return 'None';
  }
};

main.MotionBlurConfig.prototype.toFriendlyString = function() {
  if (this.enabled) {
    if (this.weight == 1.0) {
      return '1.0 (Realistic)';
    }
    var weightString = '' + this.weight;
    if (weightString.indexOf('.') < 0) {
      weightString += '.0';
    }
    if (this.weight > 1.0) {
      return weightString + ' (Heavy)';
    } else {
      return weightString + ' (Light)';
    }
  } else {
    return 'None';
  }
};

/** @constructor */
main.DropList = function() {
  this.el = null;
  this.arrowEl = null;
  this.listEl = null;
  this.selectedEl = null;
  this.open = false;
  this.onchange = new main.EventHost();
};

main.DropList.NAME_FIELD = 'DLO-name';

main.DropList.prototype.render = function(containerEl) {
  this.el = document.createElement('div');
  this.el.className = 'drop-list';
  this.el.addEventListener('click', goog.bind(this.handleClick_, this), false);

  this.buttonEl = document.createElement('div');
  this.buttonEl.className = 'drop-list-button';
  this.el.appendChild(this.buttonEl);

  this.selectedEl = document.createElement('div');
  this.selectedEl.className = 'drop-list-selected';
  this.buttonEl.appendChild(this.selectedEl);

  this.arrowEl = document.createElement('div');
  this.arrowEl.className = 'drop-list-arrow';
  this.buttonEl.appendChild(this.arrowEl);

  this.listEl = document.createElement('div');
  this.listEl.className = 'drop-list-list';
  this.listEl.style.display = 'none';
  this.listEl.tabIndex = -1;
  this.listEl.addEventListener('blur',
      goog.bind(this.setOpen, this, false), false);
  this.el.appendChild(this.listEl);

  containerEl.appendChild(this.el);
};

main.DropList.prototype.createOption = function(optionName) {
  var optionEl = document.createElement('div');
  optionEl.className = 'drop-list-option';
  optionEl[main.DropList.NAME_FIELD] = optionName;
  optionEl.addEventListener('click',
      goog.bind(this.handleClickOption_, this, optionName), false);

  this.listEl.appendChild(optionEl);
  return optionEl;
};

main.DropList.prototype.findOptionByName = function(optionName) {
  var node = this.listEl.firstChild;
  while (node) {
    if (node[main.DropList.NAME_FIELD] == optionName) {
      return node;
    }
    node = node.nextSibling;
  }
};

main.DropList.prototype.getSelected = function() {
  var selectedName = this.selectedEl.firstChild[main.DropList.NAME_FIELD];
  goog.asserts.assert(selectedName);
  return selectedName;
};

main.DropList.prototype.setSelected = function(optionName) {
  var selectedOption = this.findOptionByName(optionName);
  goog.asserts.assert(selectedOption);
  this.selectedEl.innerHTML = '';
  this.selectedEl.appendChild(selectedOption.cloneNode(true));
  this.onchange.fire(optionName);
};

main.DropList.prototype.handleClick_ = function(e) {
  this.setOpen(!this.open);
  e.stopPropagation();
};

main.DropList.prototype.handleClickOption_ = function(optionName, e) {
  this.setOpen(false);
  this.setSelected(optionName);
  e.stopPropagation();
};

main.DropList.prototype.setOpen = function(open) {
  if (open != this.open) {
    this.open = open;
    if (this.open) {
      this.listEl.style.minWidth = this.el.offsetWidth + 'px';
    }
    goog.dom.classes.enable(this.el, 'drop-list-open', this.open);
    this.listEl.style.display = this.open ? '' : 'none';
    if (this.open) {
      this.listEl.focus();
    }
  }
};

/** @constructor */
main.Spinner = function() {
  this.el = document.createElement('div');
  goog.dom.classes.add(this.el, 'spinner');
  document.body.appendChild(this.el);

  var imgEl = document.createElement('img');
  imgEl.src = 'images/spinner-black.gif';
  goog.dom.classes.add(imgEl, 'spinner-img');
  this.el.appendChild(imgEl);

  this.messageEl = document.createElement('div');
  goog.dom.classes.add(this.messageEl, 'spinner-message');
  this.el.appendChild(this.messageEl);

  this.spinDisplayed = false;
  this.spinEntries = [];
  this.spinTimeout = null;
};

/**
 * @param {main.Spinner} spinner
 * @param {string=} opt_message
 * @constructor
 */
main.Spinner.SpinEntry = function(spinner, opt_message) {
  this.spinner = spinner;
  this.message = opt_message || null;
};

main.Spinner.SpinEntry.prototype.release = function() {
  if (this.spinner) {
    this.spinner.releaseSpin(this);
    this.spinner = null;
  }
};

main.Spinner.getInstance = function() {
  if (main.Spinner.instance == null) {
    main.Spinner.instance = new main.Spinner();
  }
  return main.Spinner.instance;
};

main.Spinner.prototype.getSpinDepth = function() {
  return this.spinEntries.length;
};

/**
 * @param {number=} opt_delay
 * @param {string=} opt_message
 */
main.Spinner.prototype.spin = function(opt_delay, opt_message) {
  var spinEntry = new main.Spinner.SpinEntry(this, opt_message);
  this.spinEntries.push(spinEntry);
  if (opt_delay && this.getSpinDepth() == 1) {
    if (!this.spinTimeout) {
      this.spinTimeout = window.setTimeout(
          goog.bind(this.handleTimeout, this), opt_delay);
    }
  } else {
    this.spinDisplayed = this.getSpinDepth() > 0;
    this.updateDisplay();
  }
  return spinEntry;
};

main.Spinner.prototype.releaseSpin = function(spinEntry) {
  this.spinEntries.splice(this.spinEntries.indexOf(spinEntry), 1);
  this.spinDisplayed = this.getSpinDepth() > 0;
  this.updateDisplay();
};

main.Spinner.prototype.handleTimeout = function() {
  this.spinDisplayed = this.getSpinDepth() > 0;
  this.updateDisplay();
  delete this.spinTimeout;
};

main.Spinner.prototype.updateDisplay = function() {
  this.el.style.display = this.spinDisplayed ? '' : 'none';

  var message;
  for (var i = 0; i < this.spinEntries.length; i++) {
    message = this.spinEntries[i].message || message;
  }

  this.messageEl.style.display = message ? '' : 'none';
  if (message) {
    this.messageEl.innerHTML = '';
    this.messageEl.appendChild(document.createTextNode(message));
  }
  this.el.style.marginLeft = -(this.el.offsetWidth/2) + 'px';
  this.el.style.marginTop = -(this.el.offsetHeight/2) + 'px';
};

/** @constructor */
main.AnimationManager = function() {
  this.running = false;
  this.timer = null;
  this.startTimeMs = null;
  this.frameNumber = 0;
  this.animations = [];
};

main.AnimationManager.prototype.addAnimation = function(animation) {
  this.animations.push(animation);
  animation.setManager(this);
  if (this.running) {
    animation.start();
  }
};

main.AnimationManager.prototype.removeAnimation = function(animation) {
  var index = this.animations.indexOf(animation);
  goog.asserts.assert(index >= 0);
  this.animations.splice(index, 1);
  animation.setManager(null);
};

main.AnimationManager.prototype.getAnimations = function() {
  return this.animations;
};

main.AnimationManager.prototype.getFrameNumber = function() {
  return this.frameNumber;
};

main.AnimationManager.prototype.start = function() {
  if (this.running) {
    return;
  }
  this.startTimeMs = new Date().getTime();
  this.frameNumber = 0;
  this.timer = window.setInterval(goog.bind(this.handleTick, this), 1);
  this.running = true;
  for (var i = 0; i < this.animations.length; i++) {
    this.animations[i].start();
  }
};

main.AnimationManager.prototype.stop = function() {
  if (!this.running) {
    return;
  }
  window.clearInterval(this.timer);
  this.timer = null;
  this.running = false;
  for (var i = 0; i < this.animations.length; i++) {
    this.animations[i].stop();
  }
};

main.AnimationManager.prototype.handleTick = function() {
  this.frameNumber++;

  var nowMs = new Date().getTime();
  var elapsedTimeMs = nowMs - this.startTimeMs;

  for (var i = 0; i < this.animations.length; i++) {
    var animation = this.animations[i];
    var msPerFrame = main.Util.hzToMs(animation.getFramesPerSecond());
    var lastExpectedStepTimeMs = msPerFrame * Math.floor(elapsedTimeMs / msPerFrame);
    if (animation.lastStepTimeMs < lastExpectedStepTimeMs) {
      animation.step(elapsedTimeMs);
    }
  }
};

/** @constructor */
main.Animation = function(framesPerSecond) {
  this.framesPerSecond = framesPerSecond;
  this.frameNumber = 0;
  this.lastStepTimeMs = null;
  /** @type {main.AnimationManager} */
  this.manager = null;
  this.frameRateMonitor = new main.FrameRateMonitor(this);
};

main.Animation.prototype.setManager = function(manager) {
  goog.asserts.assert(manager == null || this.manager == null);
  this.manager = manager;
};

main.Animation.prototype.getManager = function() {
  return this.manager;
};

main.Animation.prototype.getFramesPerSecond = function() {
  return this.framesPerSecond;
};

main.Animation.prototype.setFramesPerSecond = function(framesPerSecond) {
  this.framesPerSecond = framesPerSecond;
};

main.Animation.prototype.getFrameNumber = function() {
  return this.frameNumber;
};

main.Animation.prototype.getFrameRateMonitor = function() {
  return this.frameRateMonitor;
};

main.Animation.prototype.start = function() {};

main.Animation.prototype.stop = function() {};

main.Animation.prototype.step = function(elapsedMs) {
  this.frameNumber++;
  this.lastStepTimeMs = elapsedMs;
  this.frameRateMonitor.step();
};

/**
 * @constructor
 * @extends {main.Animation}
 */
main.PaintRateMonitor = function() {
  main.Animation.call(this, 2);
  goog.asserts.assert(main.PaintRateMonitor.isAvailable());
  this.paintCountHistory_ = [];
};
goog.inherits(main.PaintRateMonitor, main.Animation);

main.PaintRateMonitor.monitors_ = [];

main.PaintRateMonitor.registerMonitor = function(monitorClass) {
  main.PaintRateMonitor.monitors_.push(monitorClass);
};

main.PaintRateMonitor.getAvailableMonitor_ = function() {
  for (var i = 0; i < main.PaintRateMonitor.monitors_.length; i++) {
    if (main.PaintRateMonitor.monitors_[i].isAvailable()) {
      return main.PaintRateMonitor.monitors_[i];
    }
  }
  return null;
};

main.PaintRateMonitor.isAvailable = function() {
  return !!main.PaintRateMonitor.getAvailableMonitor_();
};

main.PaintRateMonitor.create = function() {
  var monitor = main.PaintRateMonitor.getAvailableMonitor_();
  if (monitor) {
    return new monitor();
  } else {
    throw new Error('No PaintRateMonitors available');
  }
};

main.PaintRateMonitor.prototype.getCurrentPaintCount_ = goog.abstractMethod;

main.PaintRateMonitor.prototype.getPaintsPerSecond = function() {
  if (this.paintCountHistory_.length > 1) {
    var start = this.paintCountHistory_[this.paintCountHistory_.length-2];
    var end = this.paintCountHistory_[this.paintCountHistory_.length-1];
    return (end.count - start.count) / ((end.timeMs - start.timeMs) / 1000);
  }
  return 0;
};

main.PaintRateMonitor.prototype.isAccurate = goog.abstractMethod;

main.PaintRateMonitor.prototype.step = function(elapsedMs) {
  main.PaintRateMonitor.superClass_.step.call(this, elapsedMs);
  var paintCount = this.getCurrentPaintCount_();
  while (this.paintCountHistory_.length > 3) {
    this.paintCountHistory_.splice(0, 1);
  }
  this.paintCountHistory_.push({count: paintCount, timeMs: elapsedMs});
};

/**
 * @constructor
 * @extends {main.PaintRateMonitor}
 */
main.MozillaPaintRateMonitor = function() {
  main.PaintRateMonitor.call(this);
  goog.asserts.assert(main.MozillaPaintRateMonitor.isAvailable());
};
goog.inherits(main.MozillaPaintRateMonitor, main.PaintRateMonitor);
main.PaintRateMonitor.registerMonitor(main.MozillaPaintRateMonitor);

main.MozillaPaintRateMonitor.isAvailable = function() {
  return 'mozPaintCount' in window;
};

main.MozillaPaintRateMonitor.prototype.getCurrentPaintCount_ = function() {
  return window['mozPaintCount'];
};

main.MozillaPaintRateMonitor.prototype.isAccurate = function() {
  return true;
};

/**
 * @constructor
 * @extends {main.PaintRateMonitor}
 */
main.ChromePaintRateMonitor = function() {
  main.PaintRateMonitor.call(this);
  goog.asserts.assert(main.ChromePaintRateMonitor.isAvailable());
  this.running_ = false;
  this.chromePaintCount_ = 0;
  this.handleAnimationFrameCallback_ = goog.bind(
      this.handleAnimationFrame_, this);
};
goog.inherits(main.ChromePaintRateMonitor, main.PaintRateMonitor);
main.PaintRateMonitor.registerMonitor(main.ChromePaintRateMonitor);

main.ChromePaintRateMonitor.isAvailable = function() {
  return 'webkitRequestAnimationFrame' in window;
};

main.ChromePaintRateMonitor.prototype.getCurrentPaintCount_ = function() {
  return this.chromePaintCount_;
};

main.ChromePaintRateMonitor.prototype.isAccurate = function() {
  return false;
};

main.ChromePaintRateMonitor.prototype.start = function() {
  main.ChromePaintRateMonitor.superClass_.start.call(this);
  this.running_ = true;
  this.maybeRequestFrame_();
};

main.ChromePaintRateMonitor.prototype.stop = function() {
  main.ChromePaintRateMonitor.superClass_.stop.call(this);
  this.running_ = false;
};

main.ChromePaintRateMonitor.prototype.maybeRequestFrame_ = function() {
  if (!this.running_) {
    return;
  }
  window['webkitRequestAnimationFrame'](this.handleAnimationFrameCallback_);
};

main.ChromePaintRateMonitor.prototype.handleAnimationFrame_ = function(time) {
  this.chromePaintCount_++;
  this.maybeRequestFrame_();
};

/** @constructor */
main.FrameRateMonitor = function(animation) {
  this.animation = animation;
  this.frameHistory = [];
  this.lastAnnounceTimeMs = 0;
};

main.FrameRateMonitor.HISTORY_SECONDS = 2;

main.FrameRateMonitor.prototype.step = function() {
  var frameTimeMs = new Date().getTime();
  while (this.frameHistory.length && this.frameHistory[0]
         <= frameTimeMs - main.FrameRateMonitor.HISTORY_SECONDS * 1000) {
    this.frameHistory.splice(0, 1);
  }
  this.frameHistory.push(frameTimeMs);

  if (frameTimeMs > this.lastAnnounceTimeMs + 5000) {
    this.lastAnnounceTimeMs = frameTimeMs;
  }
};

main.FrameRateMonitor.prototype.getFrameRate = function() {
  return this.frameHistory.length / main.FrameRateMonitor.HISTORY_SECONDS;
};

main.FrameRateMonitor.prototype.getFrameVariance = function() {
  var avgStep = (this.frameHistory[this.frameHistory.length - 1] - this.frameHistory[0])
      / (this.frameHistory.length - 1);
  var sumDist = 0;
  for (var i = 0; i < this.frameHistory.length - 1; i++) {
    var step = this.frameHistory[i+1] - this.frameHistory[i];
    sumDist += (step - avgStep) * (step - avgStep);
  }
  return sumDist / (this.frameHistory.length - 1);
};

/**
 * @constructor
 * @extends {main.Animation}
 */
main.FramesIndicator = function(el) {
  main.Animation.call(this, 2);
  this.el = el;
  this.el.addEventListener('mouseover',
      goog.bind(this.setFullDisplay, this, true), false);
  this.el.addEventListener('mouseout', goog.bind(this.setFullDisplay, this, false), false);

  this.tableEl = document.createElement('table');
  this.el.appendChild(this.tableEl);

  this.arrowEl = document.createElement('div');
  goog.dom.classes.add(this.arrowEl, 'frames-indicator-arrow');
  this.el.appendChild(this.arrowEl);

  this.ballEl = document.createElement('div');
  goog.dom.classes.add(this.ballEl, 'frames-indicator-ball', 'error');
  this.el.appendChild(this.ballEl);

  this.fullDisplay = null;
  this.setFullDisplay(false);

  var row = this.addRow();
  this.addCell(row, '');
  this.addCell(row, 'Frames per second');
  this.addCell(row, 'Timing error (stddev)');
};
goog.inherits(main.FramesIndicator, main.Animation);

main.FramesIndicator.prototype.step = function(elapsedMs) {
  main.FramesIndicator.superClass_.step.call(this, elapsedMs);
  this.renderDisplay();
};

main.FramesIndicator.prototype.setFullDisplay = function(fullDisplay) {
  this.fullDisplay = fullDisplay;
  this.tableEl.style.display = this.fullDisplay ? '' : 'none';
  this.arrowEl.style.display = this.fullDisplay ? 'none' : '';
}

main.FramesIndicator.prototype.addRow = function() {
  var row = document.createElement('tr');
  this.tableEl.appendChild(row);
  return row;
};

/**
 * @param {Element} row
 * @param {string} text
 * @param {string=} opt_className
 */
main.FramesIndicator.prototype.addCell = function(row, text, opt_className) {
  var cell = document.createElement('td');
  if (opt_className) {
    cell.className = opt_className;
  }
  row.appendChild(cell);
  cell.appendChild(document.createTextNode(text));
  return cell;
};

main.FramesIndicator.prototype.renderDisplay = function() {
  while (this.tableEl.firstChild.nextSibling) {
    this.tableEl.removeChild(this.tableEl.firstChild.nextSibling);
  }

  var hasWarnings = false;
  var hasErrors = false;

  var animations = this.manager.getAnimations();
  var paintRateMonitor = null;
  var animationNumber = 0;
  var maxFpsDesired = 0;
  for (var i = 0; i < animations.length; i++) {
    if (animations[i] instanceof main.PaintRateMonitor) {
      paintRateMonitor = animations[i];
    }
    if (!(animations[i] instanceof main.SpriteBounceAnimation)) {
      continue;
    }
    var row = this.addRow();

    animationNumber++;
    this.addCell(row, 'Animation ' + animationNumber, 'name');

    var frameMonitor = animations[i].getFrameRateMonitor();
    var fps = frameMonitor.getFrameRate();
    var fpsDesired = animations[i].getFramesPerSecond();
    var fpsErrorPercent = (Math.abs(fps - fpsDesired) / fpsDesired) * 100;
    var timingStddev = Math.sqrt(frameMonitor.getFrameVariance());
    maxFpsDesired = Math.max(maxFpsDesired, fpsDesired);

    var fpsCell = this.addCell(row, Math.round(fps) + ' / ' + fpsDesired);
    if (fpsErrorPercent > 20) {
      hasErrors = true;
      goog.dom.classes.add(fpsCell, 'error');
    } else if (fpsErrorPercent > 5) {
      hasWarnings = true;
      goog.dom.classes.add(fpsCell, 'warning');
    }

    var timingError = '' + (Math.round(timingStddev * 100) / 100);
    if (timingError.indexOf('.') < 0) {
      timingError += '.00';
    } else if (timingError[timingError.length-3] != '.') {
      timingError += '0';
    }
    var timingErrorCell = this.addCell(row, timingError + 'ms');
    if (timingStddev > 10) {
      hasErrors = true;
      goog.dom.classes.add(timingErrorCell, 'error');
    } else if (timingStddev > 5) {
      hasWarnings = true;
      goog.dom.classes.add(timingErrorCell, 'warning');
    }
  }
  if (paintRateMonitor) {
    var row = this.addRow();

    var accurate = paintRateMonitor.isAccurate();

    var cell = this.addCell(
        row, 'Browser Paint' + (accurate ? '' : ' (Flawed)'), 'name');
    if (!accurate) {
      cell.title = 'The method used to determine paint rate is not correct ' +
          'for this browser.';
    }

    var pps = paintRateMonitor.getPaintsPerSecond();
    var ppsMissPercent = ((maxFpsDesired - pps) / maxFpsDesired) * 100;

    var ppsCell = this.addCell(row, Math.round(pps) + ' / ' + maxFpsDesired);
    if (ppsMissPercent > 20) {
      if (accurate) {
        hasErrors = true;
      }
      goog.dom.classes.add(ppsCell, 'error');
    } else if (ppsMissPercent > 5) {
      if (accurate) {
        hasWarnings = true;
      }
      goog.dom.classes.add(ppsCell, 'warning');
    }

    this.addCell(row, '');
  }

  goog.dom.classes.remove(this.ballEl, 'warning', 'error');
  if (hasErrors) {
    goog.dom.classes.add(this.ballEl, 'error');
  } else if (hasWarnings) {
    goog.dom.classes.add(this.ballEl, 'warning');
  }
};

/**
 * @constructor
 * @extends {main.Animation}
 */
main.BounceAnimation = function(framesPerSecond, velocityPxPerSec, min, max) {
  main.Animation.call(this, framesPerSecond);
  this.velocityPxPerSec = velocityPxPerSec;
  this.min = min;
  this.max = max;
};
goog.inherits(main.BounceAnimation, main.Animation);

main.BounceAnimation.prototype.move = function(pos) {};

main.BounceAnimation.prototype.setVelocity = function(velocityPxPerSec) {
  this.velocityPxPerSec = velocityPxPerSec;
};

main.BounceAnimation.prototype.getVelocity = function() {
  return this.velocityPxPerSec;
};

main.BounceAnimation.prototype.setRange = function(min, max) {
  this.min = min;
  this.max = max;
};

main.BounceAnimation.prototype.step = function(elapsedMs) {
  main.BounceAnimation.superClass_.step.call(this, elapsedMs);
  var distance = this.velocityPxPerSec * elapsedMs / 1000;
  var span = this.max - this.min;
  var extendedSpan = span * 2;
  var extendedPos = distance - extendedSpan * Math.floor(distance / extendedSpan);
  var pos;
  if (extendedPos < span) {
    pos = extendedPos + this.min;
  } else {
    pos = 2 * span - extendedPos + this.min;
  }
  this.move(Math.floor(pos));
};

/**
 * @constructor
 * @extends {main.BounceAnimation}
 */
main.SpriteBounceAnimation = function(sprite, framesPerSecond, velocityPxPerSec) {
  main.BounceAnimation.call(this, framesPerSecond, velocityPxPerSec, 0, 0);
  this.sprite = sprite;
  this.motionBlurConfig = new main.MotionBlurConfig(false);
  if (!this.sprite.isLoaded()) {
    this.sprite.onload.addListener(goog.bind(this.handleLoad, this));
  } else {
    this.handleLoad();
  }
};
goog.inherits(main.SpriteBounceAnimation, main.BounceAnimation);

main.SpriteBounceAnimation.prototype.setMotionBlur = function(motionBlurConfig) {
  this.motionBlurConfig = motionBlurConfig;
  this.updateMotionBlur();
};

main.SpriteBounceAnimation.prototype.updateMotionBlur = function() {
  if (!this.motionBlurConfig.isEnabled()) {
    this.sprite.setMotionBlur(null);
  }
};

main.SpriteBounceAnimation.prototype.setFramesPerSecond = function(framesPerSecond) {
  main.SpriteBounceAnimation.superClass_.setFramesPerSecond.call(this, framesPerSecond);
  this.updateMotionBlur();
};

main.SpriteBounceAnimation.prototype.setVelocity = function(velocityPxPerSec) {
  main.SpriteBounceAnimation.superClass_.setVelocity.call(this, velocityPxPerSec);
  this.updateMotionBlur();
};

main.SpriteBounceAnimation.prototype.setRange = function(min, max) {
  main.SpriteBounceAnimation.superClass_.setRange.call(this, min, max);
};

main.SpriteBounceAnimation.prototype.move = function(pos) {};

main.SpriteBounceAnimation.prototype.handleLoad = function() {};

/**
 * @constructor
 * @extends {main.SpriteBounceAnimation}
 */
main.BallBounceAnimation = function(sprite, framesPerSecond, velocityPxPerSec) {
  main.SpriteBounceAnimation.call(this, sprite, framesPerSecond, velocityPxPerSec);
};
goog.inherits(main.BallBounceAnimation, main.SpriteBounceAnimation);

main.BallBounceAnimation.prototype.updateMotionBlur = function() {
  main.BallBounceAnimation.superClass_.updateMotionBlur.call(this);
  if (this.motionBlurConfig.isEnabled()) {
    var blurPixelLength = Math.max(1, Math.ceil(this.getVelocity() / this.getFramesPerSecond())
        * this.motionBlurConfig.getWeight());
    this.sprite.setMotionBlur(main.MotionBlurSpec.forHorizontalLinearPath(blurPixelLength));
  }
};

main.BallBounceAnimation.prototype.move = function(pos) {
  this.sprite.setLeft(pos);
};

main.BallBounceAnimation.prototype.handleLoad = function() {
  var containerSize = this.sprite.getContainer().getSize();
  this.setRange(0, containerSize.width - this.sprite.getSize().width);
};

/**
 * @constructor
 * @extends {main.SpriteBounceAnimation}
 */
main.BackgroundBounceAnimation = function(sprite, framesPerSecond, velocityPxPerSec) {
  main.SpriteBounceAnimation.call(this, sprite, framesPerSecond, velocityPxPerSec);
};
goog.inherits(main.BackgroundBounceAnimation, main.SpriteBounceAnimation);

main.BackgroundBounceAnimation.prototype.updateMotionBlur = function() {
  main.BackgroundBounceAnimation.superClass_.updateMotionBlur.call(this);
  if (this.motionBlurConfig.isEnabled()) {
    var blurPixelLength = Math.max(1, Math.ceil(this.getVelocity() / this.getFramesPerSecond())
        * this.motionBlurConfig.getWeight());
    this.sprite.setMotionBlur(main.MotionBlurSpec.forDiagonalLinearPath(blurPixelLength));
  }
};

main.BackgroundBounceAnimation.prototype.move = function(pos) {
  this.sprite.setLeft(pos);
  this.sprite.setTop(pos);
};

main.BackgroundBounceAnimation.prototype.handleLoad = function() {
  var containerSize = this.sprite.getContainer().getSize();
  var spriteSize = this.sprite.getSize();
  var distance = Math.min(spriteSize.width - containerSize.width,
      spriteSize.height, containerSize.height);
  this.setRange(-distance, 0);
};

/** @constructor */
main.DetectRefreshRates = function() {
  this.onstatechange = new main.EventHost();
  this.state = main.DetectRefreshRates.State.NONE;
  this.screenRefreshRates = null;
  this.startLookupOnFrameLoad = false;
  this.window = window;
  this.document = document;

  this.iframe = null;
  this.frameDetectRefreshRates = null;
};

main.DetectRefreshRates.getInstance = function() {
  if (main.DetectRefreshRates.instance == null) {
    main.DetectRefreshRates.instance = new main.DetectRefreshRates();
  }
  return main.DetectRefreshRates.instance;
};

main.DetectRefreshRates.JAVA_VERSION_MATCHER = '1.5+';

main.DetectRefreshRates.State = {
  NONE: 'NONE',
  LOADING_JAVA: 'LOADING_JAVA',
  LOADING_JAVA_ERROR: 'LOADING_JAVA_ERROR',
  JAVA_MISSING: 'JAVA_MISSING',
  LOADING_APPLET: 'LOADING_APPLET',
  LOADING_APPLET_TIMEOUT: 'LOADING_APPLET_TIMEOUT',
  COMPLETE: 'COMPLETE'
};

main.DetectRefreshRates.prototype.startLookup = function() {
  goog.asserts.assert(this.state == main.DetectRefreshRates.State.NONE,
      'Unexpected state: ' + this.state);

  if (this.iframe) {
    return;
  }

  var count = 0;
  var failed = false;
  function onSuccess() {
    ++count;
    if (count == 2) {
      this.handleJavaLoad();
    }
  };
  function onFailure() {
    if (!failed) {
      failed = true;
      this.handleJavaError();
    }
  };

  this.stateChange(main.DetectRefreshRates.State.LOADING_JAVA);

  this.iframe = this.document.createElement('iframe');
  this.iframe.style.visibility = 'hidden';
  this.iframe.style.width = '0px';
  this.iframe.style.height = '0px';
  this.iframe.style.position = 'absolute';
  this.iframe.style.left = '0px';
  this.iframe.style.top = '0px';
  this.iframe.setAttribute('src', 'detect-refresh-rates.htm');
  this.iframe.addEventListener('load', goog.bind(onSuccess, this), false);
  this.iframe.addEventListener('error', goog.bind(onFailure, this), false);
  this.document.body.appendChild(this.iframe);

  var script = this.document.createElement('script');
  script.setAttribute('type', 'text/javascript');
  script.setAttribute('src', 'http://java.com/js/deployJava.js');
  script.addEventListener('load', goog.bind(onSuccess, this), false);
  script.addEventListener('error', goog.bind(onFailure, this), false);
  this.document.getElementsByTagName('head')[0].appendChild(script);
};

main.DetectRefreshRates.prototype.getState = function() {
  return this.state;
};

main.DetectRefreshRates.prototype.stateChange = function(newState) {
  this.state = newState;
  this.onstatechange.fire(this.state);
};

main.DetectRefreshRates.prototype.getScreenRefreshRates = function() {
  return this.screenRefreshRates;
};

main.DetectRefreshRates.prototype.handleJavaLoad = function(e) {
  this.frameDetectRefreshRates = this.iframe.contentWindow['detectRefreshRates'];
  this.javaDeploy = this.window['deployJava'];

  goog.asserts.assert(this.javaDeploy && this.frameDetectRefreshRates,
      'Expected javaDeploy and frameDetectRefreshRates to have loaded');

  this.javaDeploy['returnPage'] = this.window.location.href;

  if (this.frameDetectRefreshRates['getJavaMissing']()) {
    this.stateChange(main.DetectRefreshRates.State.JAVA_MISSING);
    return;
  }

  this.stateChange(main.DetectRefreshRates.State.LOADING_APPLET);
  this.appletPollInterval = this.window.setInterval(goog.bind(this.handleAppletPoll, this), 500);
  this.appletPollStartTimeMs = (new Date()).getTime();
};

main.DetectRefreshRates.prototype.installJava = function() {
  this.javaDeploy['installJRE'](main.DetectRefreshRates.JAVA_VERSION_MATCHER);
};

main.DetectRefreshRates.prototype.handleAppletPoll = function() {
  var nowTime = (new Date()).getTime();
  var refreshRates = this.frameDetectRefreshRates['getRefreshRates']();
  if (!refreshRates && nowTime < this.appletPollStartTimeMs + 60 * 1000) {
    return;
  }
  this.window.clearInterval(this.appletPollInterval);

  if (refreshRates) {
    this.screenRefreshRates = refreshRates;
    this.stateChange(main.DetectRefreshRates.State.COMPLETE);
  } else {
    this.stateChange(main.DetectRefreshRates.State.LOADING_APPLET_TIMEOUT);
  }
};

main.DetectRefreshRates.prototype.handleJavaError = function(e) {
  this.stateChange(main.DetectRefreshRates.State.LOADING_JAVA_ERROR);
};

main.VideoSizes = {
  VHS: new main.Size(480, 320),
  DVD: new main.Size(720, 480),
  SEVEN_TWENTY_P: new main.Size(1280, 720)
};

/** @constructor */
main.SpriteContainer = function(containerEl, size) {
  this.containerEl = containerEl;
  this.sprites = {};
  this.spriteWrappers = {};
  this.nextSpriteId = 0;
  this.setSize(size);
};

main.SpriteContainer.prototype.setSize = function(size) {
  this.containerEl.style.width = size.width + 'px';
  this.containerEl.style.height = size.height + 'px';
};

main.SpriteContainer.prototype.getSize = function() {
  return new main.Size(this.containerEl.offsetWidth, this.containerEl.offsetHeight);
};

main.SpriteContainer.prototype.addSprite = function(sprite) {
  this.addSpriteBefore(sprite, null);
};

main.SpriteContainer.prototype.addSpriteBefore = function(sprite, otherSprite) {
  var spriteWrapper = document.createElement('div');
  spriteWrapper.style.position = 'relative';
  spriteWrapper.style.width = '0px';
  spriteWrapper.style.height = '0px';
  spriteWrapper.appendChild(sprite.getElement());
  sprite.spriteId = (this.nextSpriteId++);
  this.sprites[sprite.spriteId] = sprite;
  this.spriteWrappers[sprite.spriteId] = spriteWrapper;
  sprite.setContainer(this);

  var otherWrapper = otherSprite ? this.spriteWrappers[otherSprite.spriteId] : null;
  this.containerEl.insertBefore(spriteWrapper, otherWrapper);

  this.positionSprite(sprite);
};

main.SpriteContainer.prototype.removeSprite = function(sprite) {
  if (sprite.spriteId in this.sprites) {
    delete this.sprites[sprite.spriteId];
    this.containerEl.removeChild(this.spriteWrappers[sprite.spriteId]);
    delete this.spriteWrappers[sprite.spriteId];
    sprite.setContainer(null);
  }
};

main.SpriteContainer.prototype.positionSprite = function(sprite) {
  var spriteWrapper = this.spriteWrappers[sprite.spriteId];
  goog.asserts.assert(spriteWrapper);
  var pt = sprite.getPosition();
  spriteWrapper.style.left = pt.x + 'px';
  spriteWrapper.style.top = pt.y + 'px';
};

/** @constructor */
main.Sprite = function() {
  this.motionBlurSpec = null;
  /** @type {main.SpriteContainer} */
  this.container = null;
  this.pos = new main.Point(0, 0);
  this.loaded = false;
  this.onload = new main.EventHost();
};

main.Sprite.prototype.isLoaded = function() {
  return this.loaded;
};

main.Sprite.prototype.getSize = goog.abstractMethod;

main.Sprite.prototype.setTop = function(top) {
  this.move(this.getPosition().setY(top));
};

main.Sprite.prototype.setLeft = function(left) {
  this.move(this.getPosition().setX(left));
};

main.Sprite.prototype.move = function(pt) {
  this.pos = pt;
  if (this.container) {
    this.container.positionSprite(this);
  }
};

main.Sprite.prototype.getPosition = function() {
  return this.pos.clone();
};

main.Sprite.prototype.getElement = goog.abstractMethod;

main.Sprite.prototype.setContainer = function(container) {
  goog.asserts.assert(container == null || this.container == null);
  this.container = container;
};

main.Sprite.prototype.getContainer = function() {
  return this.container;
};

main.Sprite.prototype.setMotionBlur = function(motionBlurSpec) {
  this.motionBlurSpec = motionBlurSpec;
};

/**
 * @param {string} imgSrc
 * @param {number=} opt_width
 * @param {number=} opt_height
 * @constructor
 * @extends {main.Sprite}
 */
main.ImageSprite = function(imgSrc, opt_width, opt_height) {
  main.Sprite.call(this);
  this.img = new Image();
  this.img.addEventListener('load', goog.bind(function() {
    // Delay the handling of the onload event to work around an IE9 image
    // loading bug.
    window.setTimeout(goog.bind(this.handleLoad, this), 1);
  }, this), false);
  this.imgLoadSpin = main.Spinner.getInstance().spin(100, 'Loading image...');
  this.imgWidth = opt_width;
  this.imgHeight = opt_height;
  this.leftOffset = 0;
  this.topOffset = 0;
  this.el = document.createElement('div');
  this.canvas = document.createElement('canvas');
  this.el.appendChild(this.canvas);
  this.ctx = this.canvas.getContext('2d');
  this.canvasWidth = null;
  this.canvasHeight = null;
  this.imgCanvas = document.createElement('canvas');
  this.imgCtx = this.imgCanvas.getContext('2d');

  // Image load may trigger immediately if the image is cached.
  this.img.src = imgSrc;
};
goog.inherits(main.ImageSprite, main.Sprite);

main.ImageSprite.prototype.setMotionBlur = function(motionBlurSpec) {
  main.ImageSprite.superClass_.setMotionBlur.call(this, motionBlurSpec);
  if (this.loaded) {
    this.draw();
  }
};

main.ImageSprite.prototype.getElement = function() {
  return this.el;
};

main.ImageSprite.prototype.handleLoad = function() {
  this.imgWidth = this.imgWidth || this.img.width;
  this.imgHeight = this.imgHeight || this.img.height;

  if (!this.drawImgCanvas()) {
    // There appears to be a bug in IE9's canvas and image handling.  It is possible
    // for an image to have been loaded but when drawn to a canvas to produce no
    // content.  In this case, simply stall using setTimeout and try again.
    window.setTimeout(goog.bind(this.handleLoad, this), 100);
    return;
  }

  this.imgLoadSpin.release();
  this.imgLoadSpin = null;
  this.draw(true);
  if (!this.loaded) {
    this.loaded = true;
    this.onload.fire();
  }
};

main.ImageSprite.prototype.getSize = function() {
  return new main.Size(this.imgWidth, this.imgHeight);
};

/**
 * Draw the image to this.imgCanvas, and return whether the image had content.
 */
main.ImageSprite.prototype.drawImgCanvas = function() {
  this.imgCanvas.width = this.imgWidth;
  this.imgCanvas.height = this.imgHeight;
  this.imgCtx.clearRect(0, 0, this.imgWidth, this.imgHeight);
  this.imgCtx.drawImage(this.img, 0, 0, this.imgWidth, this.imgHeight);

  // Check whether the drawn image produced content.
  var imgData = this.imgCtx.getImageData(0, 0, this.imgWidth, this.imgHeight);
  var imgPixels = imgData.data;

  var imgPixelsLength = imgPixels.length;
  for (var i = 0; i < imgPixelsLength; i++) {
    if (imgPixels[i] != 0) {
      return true;
    }
  }
  return false;
};

/**
 * @param {boolean=} opt_initialDraw
 */
main.ImageSprite.prototype.draw = function(opt_initialDraw) {
  var motionBlurBounds = this.motionBlurSpec ? this.motionBlurSpec.getBounds() :
      new main.Bounds(0, 0, 0, 0);

  this.leftOffset = motionBlurBounds.left;
  this.topOffset = motionBlurBounds.top;
  this.canvasWidth = this.imgWidth + motionBlurBounds.getWidth();
  this.canvasHeight = this.imgHeight + motionBlurBounds.getHeight();

  this.el.width = this.imgWidth;
  this.el.height = this.imgHeight;
  // Don't make canvas relative, see:
  // http://code.google.com/p/chromium/issues/detail?id=119893
  // this.canvas.style.position = 'relative';
  this.canvas.style.left = this.leftOffset + 'px';
  this.canvas.style.top = this.topOffset + 'px';

  if (opt_initialDraw || !this.motionBlurSpec) {
    this.drawPlain();
  }
  if (this.motionBlurSpec) {
    this.drawMotionBlur();
  }
};

main.ImageSprite.prototype.drawPlain = function() {
  this.canvas.width = this.canvasWidth;
  this.canvas.height = this.canvasHeight;
  this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  this.ctx.drawImage(this.img, 0, 0, this.imgWidth, this.imgHeight);
};

main.ImageSprite.prototype.drawMotionBlur = function() {
  var imgData = this.imgCtx.getImageData(0, 0, this.imgWidth, this.imgHeight);
  var imgPixels = imgData.data;
  var outputData = this.ctx.createImageData(this.canvasWidth, this.canvasHeight);
  var outputPixels = outputData.data;

  var points = this.motionBlurSpec.getPoints();
  var numPoints = points.length;

  var spin = main.Spinner.getInstance().spin(100, 'Generating motion blur...');

  var leftOffset = this.leftOffset;
  var topOffset = this.topOffset;
  var canvasWidth = this.canvasWidth;
  var canvasHeight = this.canvasHeight;
  var j = 0;
  var i = 0;
  var y = 0;
  var process = goog.bind(function() {
    if (this.leftOffset != leftOffset || this.topOffset != topOffset
        || this.canvasWidth != canvasWidth || this.canvasHeight != canvasHeight) {
      spin.release();
      return;
    }

    var count = 0;
    var startTimeMs = new Date().getTime();
    var shouldReturn = function (workDone) {
      count -= workDone;
      if (count <= 0) {
        var elapsedMs = new Date().getTime() - startTimeMs;
        if (elapsedMs > 10) {
          window.setTimeout(process, 0);
          return true;
        }
        count = 10000;
      }
      return false;
    };
    for (; j < imgPixels.length; j++) {
      imgPixels[j] /= numPoints;
      if (shouldReturn(1)) return;
    }

    while (i < numPoints) {
      var point = points[i];
      while (y < this.imgHeight) {
        for (var x = 0; x < this.imgWidth; x++) {
          var outX = x + point.x - leftOffset;
          var outY = y + point.y - topOffset;
          if (outX < 0 || outX >= canvasWidth || outY < 0 || outY >= canvasHeight) {
            continue;
          }
          var imgOff = (y * this.imgWidth + x) * 4;
          var outOff = (outY * canvasWidth + outX) * 4;
          for (var k = 0; k < 4; k++) {
            outputPixels[outOff+k] += imgPixels[imgOff+k];
          }
        }
        y++;
        if (shouldReturn(this.imgWidth * 10)) return;
      }
      y = 0;
      i++;
    }
    this.canvas.width = canvasWidth;
    this.canvas.height = canvasHeight;
    this.ctx.putImageData(outputData, 0, 0);
    spin.release();
  }, this);

  window.setTimeout(process, 0);
};

/** @constructor */
main.ImageAsset = function(name, src, thumbSrc, attribLink) {
  this.name = name;
  this.src = src;
  this.thumbSrc = thumbSrc;
  this.attribLink = attribLink;
};

main.BACKGROUND_NAMES = {
  AUTUMN: 'Autumn',
  AUTUMN2: 'Autumn 2',
  FOREST: 'Forest',
  MILKY_WAY: 'Milky Way',
  RIVER: 'River',
  STARS: 'Stars',
  SUNSET: 'Sunset',
  WINTER: 'Winter'
};

main.BACKGROUND_IMAGE_ASSETS = [
  new main.ImageAsset(main.BACKGROUND_NAMES.AUTUMN, 'images/backgrounds/autumn.jpg',
      'images/backgrounds/thumbs/autumn.jpg',
      'http://commons.wikimedia.org/wiki/File:Autumn_on_the_Indiana_University_campus.jpg'),
  new main.ImageAsset(main.BACKGROUND_NAMES.AUTUMN2, 'images/backgrounds/autumn2.jpg',
      'images/backgrounds/thumbs/autumn2.jpg',
      'http://commons.wikimedia.org/wiki/File:Autumn_scenery.jpg'),
  new main.ImageAsset(main.BACKGROUND_NAMES.FOREST, 'images/backgrounds/forest.jpg',
      'images/backgrounds/thumbs/forest.jpg',
      'http://commons.wikimedia.org/wiki/File:Dunns_Pond_Mound.jpg'),
  new main.ImageAsset(main.BACKGROUND_NAMES.MILKY_WAY, 'images/backgrounds/milky-way.jpg',
      'images/backgrounds/thumbs/milky-way.jpg',
      'http://commons.wikimedia.org/wiki/File:ESO-VLT-Laser-phot-33a-07.jpg'),
  new main.ImageAsset(main.BACKGROUND_NAMES.RIVER, 'images/backgrounds/river.jpg',
      'images/backgrounds/thumbs/river.jpg',
      'http://commons.wikimedia.org/wiki/File:Blanchard_River_at_Gilboa.jpg'),
  new main.ImageAsset(main.BACKGROUND_NAMES.STARS, 'images/backgrounds/stars.jpg',
      'images/backgrounds/thumbs/stars.jpg',
      'http://commons.wikimedia.org/wiki/File:Central_region_of_the_Milky_Way.jpg'),
  new main.ImageAsset(main.BACKGROUND_NAMES.SUNSET, 'images/backgrounds/sunset.jpg',
      'images/backgrounds/thumbs/sunset.jpg',
      'http://commons.wikimedia.org/wiki/File:Sunset_on_the_Victoria_lake.JPG'),
  new main.ImageAsset(main.BACKGROUND_NAMES.WINTER, 'images/backgrounds/winter.jpg',
      'images/backgrounds/thumbs/winter.jpg',
      'http://commons.wikimedia.org/wiki/File:Wintry_scenery.jpg')
];

main.BALL_NAMES = {
  SOCCER_BALL: 'Soccer Ball',
  BASEBALL: 'Baseball',
  WORLD_CUP_FOOTBALL: 'World Cup Football',
  MOON: 'Moon',
  SPHERE: 'Sphere'
};

main.BALL_IMAGE_ASSETS = [
  new main.ImageAsset(main.BALL_NAMES.SOCCER_BALL, 'images/sprites/ball1.png',
      'images/sprites/thumbs/ball1.png',
      'http://commons.wikimedia.org/wiki/File:Soccer_ball.svg'),
  new main.ImageAsset(main.BALL_NAMES.BASEBALL, 'images/sprites/ball2.png',
      'images/sprites/thumbs/ball2.png',
      'http://commons.wikimedia.org/wiki/File:Baseball_(crop).jpg'),
  new main.ImageAsset(main.BALL_NAMES.WORLD_CUP_FOOTBALL, 'images/sprites/ball3.png',
      'images/sprites/thumbs/ball3.png',
      'http://commons.wikimedia.org/wiki/File:Adidas_African_Cup_of_Nations_2008_match_ball_Wawa_Aba.jpg'),
  new main.ImageAsset(main.BALL_NAMES.MOON, 'images/sprites/moon.png',
      'images/sprites/thumbs/moon.png',
      'http://commons.wikimedia.org/wiki/File:Full_moon.png'),
  new main.ImageAsset(main.BALL_NAMES.SPHERE, 'images/sprites/sphere.png',
      'images/sprites/thumbs/sphere.png',
      'http://commons.wikimedia.org/wiki/File:Blue-sphere.png')
];

main.GOOD_SPRITE_PAIRINGS = [
  {background: main.BACKGROUND_NAMES.RIVER, ball: main.BALL_NAMES.BASEBALL},
  {background: main.BACKGROUND_NAMES.AUTUMN, ball: main.BALL_NAMES.SOCCER_BALL},
  {background: main.BACKGROUND_NAMES.MILKY_WAY, ball: main.BALL_NAMES.MOON},
  {background: main.BACKGROUND_NAMES.SUNSET, ball: main.BALL_NAMES.SPHERE},
  {background: main.BACKGROUND_NAMES.AUTUMN2, ball: main.BALL_NAMES.WORLD_CUP_FOOTBALL}
];

main.STANDARD_FRAMES_PER_SECONDS = [
  5, 10, 15, 24, 25, 30, 48, 60, 90, 120
];

main.STANDARD_VELOCITY_PER_SECONDS = [
  0, 50, 100, 200, 500, 1000, 2000
];

main.STANDARD_MOTION_BLURS = [
  new main.MotionBlurConfig(false),
  new main.MotionBlurConfig(true, 0.5),
  new main.MotionBlurConfig(true, 1.0),
  new main.MotionBlurConfig(true, 1.5),
  new main.MotionBlurConfig(true, 2.0),
  new main.MotionBlurConfig(true, 2.5),
  new main.MotionBlurConfig(true, 3.0)
];

/** @constructor */
main.AnimationController = function(el, attributionsLinkEl, spriteContainer,
    animationManager) {
  this.el = el;
  this.controlContainerEl = this.el.getElementsByClassName('control-container')[0];
  this.addControlButtonEl = this.el.getElementsByClassName(
      'control-add')[0];
  this.attributionsLinkEl = attributionsLinkEl;
  this.spriteContainer = spriteContainer;
  this.animationManager = animationManager;
  this.spriteControls = [];
  this.attributionsShown = false;
  this.ignoreLargeFpsWarning = false;
  this.largeFpsWarning = false;
};

main.AnimationController.prototype.addSpriteControl = function(control) {
  var controlEl = control.render(this.controlContainerEl);
  this.controlContainerEl.insertBefore(controlEl, this.addControlButtonEl);
  if (this.spriteControls.length) {
    this.addSpacerBefore(controlEl);
  }
  control.installSprite(this, this.spriteContainer, this.animationManager);
  this.spriteControls.push(control);
  this.positionSprites();
  if (this.attributionsShown) {
    control.showAttribution();
  }
  return control;
};

main.AnimationController.prototype.removeSpriteControl = function(control) {
  var index = this.spriteControls.indexOf(control);
  var prevEl = control.el.previousSibling;
  var nextEl = control.el.nextSibling;
  control.dispose();
  if (index == 0 && nextEl && goog.dom.classes.has(nextEl, 'spacer')) {
    nextEl.parentNode.removeChild(nextEl);
  } else if (prevEl && goog.dom.classes.has(prevEl, 'spacer')) {
    prevEl.parentNode.removeChild(prevEl);
  }
  this.spriteControls.splice(index, 1);
  this.positionSprites();
};

main.AnimationController.prototype.clearControls = function() {
  while (this.spriteControls.length) {
    this.removeSpriteControl(this.spriteControls[0]);
  }
};

main.AnimationController.prototype.positionSprites = function() {
  // Simple heuristic, find all bouncing ball sprites and set their top positions.
  var ballControls = [];
  for (var i = 0; i < this.spriteControls.length; i++) {
    if (this.spriteControls[i].getAnimation() instanceof main.BallBounceAnimation) {
      ballControls.push(this.spriteControls[i]);
    }
  }
  if (ballControls.length) {
    var packedHeight = 0;
    for (var i = 0; i < ballControls.length; i++) {
      packedHeight += ballControls[i].getSprite().getSize().height;
    }
    var spacing = (this.spriteContainer.getSize().height - packedHeight) /
        (ballControls.length+1);
    var top = spacing;
    for (var i = 0; i < ballControls.length; i++) {
      ballControls[i].getSprite().setTop(top);
      top += spacing + ballControls[i].getSprite().getSize().height;
    }
  }
};

main.AnimationController.prototype.addSpacerBefore = function(beforeEl) {
  var spacerEl = document.createElement('div');
  spacerEl.className = 'spacer';
  for (var i = 0; i < 5; i++) {
    var rowEl = document.createElement('div');
    if (i == 0) {
      rowEl.className = 'title-cell control-row';
    } else if (i == 1) {
      rowEl.className = 'attribution-cell control-row';
      rowEl.style.display = this.attributionsShown ? '' : 'none';
    } else {
      rowEl.className = 'control-row';
    }
    rowEl.innerHTML = '&nbsp;';
    spacerEl.appendChild(rowEl);
  }
  this.controlContainerEl.insertBefore(spacerEl, beforeEl);
};

main.AnimationController.prototype.render = function() {
  this.el.style.visibility = 'visible';
  var nodes = this.el.childNodes;
  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i].nodeType != Node.ELEMENT_NODE) {
      this.el.removeChild(nodes[i]);
    }
  }
  this.attributionsLinkEl.addEventListener('click',
      goog.bind(this.handleAttributionsLinkClick_, this), false);
  this.addControlButtonEl.addEventListener('click',
      goog.bind(this.handleAddControlButtonClick_, this), false);
};

main.AnimationController.prototype.spriteAnimationSetToLargeFps = function(sprite) {
  if (this.ignoreLargeFpsWarning) {
    return;
  }

  if (!this.largeFpsWarning) {
    this.largeFpsWarning = new main.LargeFpsWarning();
    this.largeFpsWarning.onignore.addListener(goog.bind(function() {
      this.ignoreLargeFpsWarning = true;
    }, this));
  }
  this.largeFpsWarning.show();
};

main.AnimationController.prototype.getRandomBackgroundAndSpritePairing = function() {
  return main.GOOD_SPRITE_PAIRINGS[
      Math.round(Math.random() * main.GOOD_SPRITE_PAIRINGS.length - 0.5)];
};

main.AnimationController.prototype.loadDefaultPreset = function() {
  this.clearControls();
  var pair = this.getRandomBackgroundAndSpritePairing();
  this.addSpriteControl(new main.BackgroundSpriteControl(
      main.BACKGROUND_IMAGE_ASSETS, pair.background)).
      setVelocity(50).
      setFramesPerSecond(25).
      setMotionBlur(new main.MotionBlurConfig(true));
  this.addSpriteControl(new main.BallSpriteControl(main.BALL_IMAGE_ASSETS, pair.ball)).
      setVelocity(1000).
      setFramesPerSecond(60).
      setMotionBlur(new main.MotionBlurConfig(true));
  this.addSpriteControl(new main.BallSpriteControl(main.BALL_IMAGE_ASSETS, pair.ball)).
      setVelocity(1000).
      setFramesPerSecond(25).
      setMotionBlur(new main.MotionBlurConfig(true));
};

main.AnimationController.prototype.load15Vs25Vs48Vs60Preset = function(opt_exaggerateBlur) {
  this.clearControls();
  var pair = this.getRandomBackgroundAndSpritePairing();
  this.addSpriteControl(new main.BackgroundSpriteControl(
      main.BACKGROUND_IMAGE_ASSETS, pair.background)).
      setVelocity(50).
      setFramesPerSecond(60).
      setMotionBlur(new main.MotionBlurConfig(true));
  var fpss = [15, 25, 48, 60];
  var exaggeratedBlurs = [1.0, 1.0, 2.0, 3.0];
  for (var i = 0; i < fpss.length; i++) {
    var weight = opt_exaggerateBlur ? exaggeratedBlurs[i] : 1.0;
    this.addSpriteControl(new main.BallSpriteControl(main.BALL_IMAGE_ASSETS, pair.ball)).
        setVelocity(1000).
        setFramesPerSecond(fpss[i]).
      setMotionBlur(new main.MotionBlurConfig(true, weight));
  }
};

main.AnimationController.prototype.loadMotionBlurOnOffPreset = function(fps) {
  this.clearControls();
  var pair = this.getRandomBackgroundAndSpritePairing();
  this.addSpriteControl(new main.BackgroundSpriteControl(
      main.BACKGROUND_IMAGE_ASSETS, pair.background)).
      setVelocity(50).
      setFramesPerSecond(fps).
      setMotionBlur(new main.MotionBlurConfig(true));
  this.addSpriteControl(new main.BallSpriteControl(main.BALL_IMAGE_ASSETS, pair.ball)).
      setVelocity(1000).
      setFramesPerSecond(fps).
      setMotionBlur(new main.MotionBlurConfig(true));
  this.addSpriteControl(new main.BallSpriteControl(main.BALL_IMAGE_ASSETS, pair.ball)).
      setVelocity(1000).
      setFramesPerSecond(fps).
      setMotionBlur(new main.MotionBlurConfig(false));
};

main.AnimationController.prototype.handleAttributionsLinkClick_ = function() {
  if (this.attributionsShown) {
    return;
  }
  this.attributionsShown = true;
  this.attributionsLinkEl.style.display = 'none';
  window.scrollTo(0, 0);

  var attributionCells = this.el.getElementsByClassName('attribution-cell');
  for (var i = 0; i < attributionCells.length; i++) {
    attributionCells[i].style.display = '';
  }
  for (var i = 0; i < this.spriteControls.length; i++) {
    this.spriteControls[i].showAttribution();
  }
};

main.AnimationController.prototype.handleAddControlButtonClick_ = function() {
  var protoControl = this.spriteControls[this.spriteControls.length-1];
  var assetName = main.BALL_NAMES.SOCCER_BALL;
  if (protoControl && protoControl instanceof main.BallSpriteControl) {
    assetName = protoControl.getAssetName();
  }
  if (protoControl) {
    this.addSpriteControl(new main.BallSpriteControl(main.BALL_IMAGE_ASSETS, assetName)).
        setVelocity(protoControl.getVelocity()).
        setFramesPerSecond(protoControl.getFramesPerSecond()).
        setMotionBlur(protoControl.getMotionBlurConfig());
  } else {
    this.addSpriteControl(new main.BallSpriteControl(main.BALL_IMAGE_ASSETS, assetName)).
        setVelocity(1000).
        setFramesPerSecond(60).
        setMotionBlur(new main.MotionBlurConfig(true));
  }
};

/** @constructor */
main.SpriteControl = function(spriteAssets, assetName) {
  this.spriteAssets = spriteAssets;
  this.assetName = assetName;
  this.allowRemove = true;
  this.sprite = null;
  this.animation = null;
  this.controller = null;
  this.el = null;
  this.titleImgEl = null;
  this.titleNameEl = null;

  this.assetDropList = null;
  this.attributionCell = null;
  this.attributionLinkEl = null;
  this.fpsDropList = null;
  this.motionBlurDropList = null;
  this.velocityDropList = null;

  this.velocity = 200;
  this.framesPerSecond = 30;
  this.motionBlurConfig = new main.MotionBlurConfig(false);

  this.createSprite();
  this.createAnimation();
};

main.SpriteControl.prototype.getAnimation = function() {
  return this.animation;
};

main.SpriteControl.prototype.getSprite = function() {
  return this.sprite;
};

main.SpriteControl.prototype.getAssetName = function() {
  return this.assetName;
};

main.SpriteControl.prototype.getVelocity = function() {
  return this.velocity;
};

main.SpriteControl.prototype.getFramesPerSecond = function() {
  return this.framesPerSecond;
};

main.SpriteControl.prototype.getMotionBlurConfig = function() {
  return this.motionBlurConfig;
};

main.SpriteControl.prototype.setAllowRemove = function(allowRemove) {
  goog.asserts.assert(!this.el, 'Must be called before render');
  this.allowRemove = allowRemove;
};

main.SpriteControl.prototype.dispose = function() {
  var spriteContainer = this.sprite.getContainer();
  spriteContainer.removeSprite(this.sprite);
  this.sprite = null;

  var animationManager = this.animation.getManager();
  animationManager.removeAnimation(this.animation);
  this.animation = null;

  if (this.el.parentNode) {
    this.el.parentNode.removeChild(this.el);
  }
  this.controller = null;
};

main.SpriteControl.prototype.render = function() {
  this.el = document.createElement('div');
  this.el.className = 'sprite';

  if (this.allowRemove) {
    var removeButtonContainer = document.createElement('div');
    removeButtonContainer.className = 'control-remove-container';
    this.el.appendChild(removeButtonContainer);
    this.removeButtonEl = document.createElement('div');
    this.removeButtonEl.className = 'control-remove';
    removeButtonContainer.appendChild(this.removeButtonEl);
    this.removeButtonEl.addEventListener('click',
        goog.bind(this.handleRemoveButtonClick_, this), false);
  }

  var titleCell = document.createElement('div');
  titleCell.className = 'title-cell control-row';
  this.assetDropList = new main.DropList();
  this.assetDropList.render(titleCell);
  for (var i = 0; i < this.spriteAssets.length; i++) {
    var spriteAsset = this.spriteAssets[i];
    var option = this.assetDropList.createOption(spriteAsset.name);
    var titleImgEl = document.createElement('img');
    titleImgEl.src = spriteAsset.thumbSrc;
    option.appendChild(titleImgEl);
    var titleNameEl = document.createElement('span');
    titleNameEl.appendChild(document.createTextNode(spriteAsset.name));
    option.appendChild(titleNameEl);
  }
  this.assetDropList.setSelected(this.assetName);
  this.assetDropList.onchange.addListener(goog.bind(this.handleAssetChange_, this));
  this.el.appendChild(titleCell);

  this.attributionCell = document.createElement('div');
  this.attributionCell.className = 'attribution-cell control-row';
  this.attributionCell.style.display = 'none';
  this.attributionLinkEl = document.createElement('a');
  this.attributionLinkEl.appendChild(document.createTextNode('Image source'));
  this.attributionLinkEl.target = '_blank';
  this.attributionLinkEl.href = this.attributionLinkEl.title =
      this.getAssetByName(this.assetName).attribLink;
  this.attributionCell.appendChild(this.attributionLinkEl);
  this.el.appendChild(this.attributionCell);

  var fpsCell = document.createElement('div');
  fpsCell.className = 'fps-cell control-row';
  this.fpsDropList = new main.DropList();
  this.fpsDropList.render(fpsCell);
  for (var i = 0; i < main.STANDARD_FRAMES_PER_SECONDS.length; i++) {
    var fps = main.STANDARD_FRAMES_PER_SECONDS[i];
    var option = this.fpsDropList.createOption(fps);
    option.appendChild(document.createTextNode(fps + ' fps'));
  }
  this.fpsDropList.setSelected(this.framesPerSecond);
  this.fpsDropList.onchange.addListener(goog.bind(this.handleFpsChange_, this));
  this.el.appendChild(fpsCell);

  var motionBlurCell = document.createElement('div');
  motionBlurCell.className = 'motion-blur-cell control-row';
  this.motionBlurDropList = new main.DropList();
  this.motionBlurDropList.render(motionBlurCell);
  for (var i = 0; i < main.STANDARD_MOTION_BLURS.length; i++) {
    var motionBlur = main.STANDARD_MOTION_BLURS[i];
    var option = this.motionBlurDropList.createOption(motionBlur.toString());
    option.appendChild(document.createTextNode(motionBlur.toFriendlyString()));
  }
  this.motionBlurDropList.setSelected(this.motionBlurConfig.toString());
  this.motionBlurDropList.onchange.addListener(
      goog.bind(this.handleMotionBlurChange_, this));
  this.el.appendChild(motionBlurCell);

  var velocityCell = document.createElement('div');
  velocityCell.className = 'velocity-cell control-row';
  this.velocityDropList = new main.DropList();
  this.velocityDropList.render(velocityCell);
  for (var i = 0; i < main.STANDARD_VELOCITY_PER_SECONDS.length; i++) {
    var v = main.STANDARD_VELOCITY_PER_SECONDS[i];
    var option = this.velocityDropList.createOption(v);
    option.appendChild(document.createTextNode(v + ' px/s'));
  }
  this.velocityDropList.setSelected(this.velocity);
  this.velocityDropList.onchange.addListener(goog.bind(this.handleVelocityChange_, this));
  this.el.appendChild(velocityCell);

  return this.el;
};

main.SpriteControl.prototype.showAttribution = function() {
  this.attributionCell.style.display = '';
};

main.SpriteControl.prototype.setVelocity = function(velocity) {
  this.velocityDropList.setSelected(velocity);
  return this;
};

main.SpriteControl.prototype.setFramesPerSecond = function(framesPerSecond) {
  this.fpsDropList.setSelected(framesPerSecond);
  return this;
};

main.SpriteControl.prototype.setMotionBlur = function(motionBlurConfig) {
  this.motionBlurDropList.setSelected(motionBlurConfig.toString());
  return this;
};

main.SpriteControl.prototype.getAssetByName = function(assetName) {
  for (var i = 0; i < this.spriteAssets.length; i++) {
    if (this.spriteAssets[i].name == assetName) {
      return this.spriteAssets[i];
    }
  }
  return null;
};

main.SpriteControl.prototype.handleRemoveButtonClick_ = function() {
  this.controller.removeSpriteControl(this);
};

main.SpriteControl.prototype.handleAssetChange_ = function(assetName) {
  this.assetName = assetName;
  var position = this.sprite.getPosition();
  var spriteContainer = this.sprite.getContainer();
  var oldSprite = this.sprite;
  this.sprite = null;
  var animationManager = this.animation.getManager();
  animationManager.removeAnimation(this.animation);
  this.animation = null;
  this.createSprite();
  spriteContainer.addSpriteBefore(this.sprite, oldSprite);
  spriteContainer.removeSprite(oldSprite);
  this.sprite.move(position);
  this.createAnimation();
  animationManager.addAnimation(this.animation);
  this.attributionLinkEl.href = this.attributionLinkEl.title =
      this.getAssetByName(this.assetName).attribLink;
};

main.SpriteControl.prototype.handleFpsChange_ = function(fps) {
  this.framesPerSecond = fps;
  if (this.animation) {
    this.animation.setFramesPerSecond(this.framesPerSecond);
  }
  if (fps > 60 && this.controller) {
    this.controller.spriteAnimationSetToLargeFps(this, fps);
  }
};

main.SpriteControl.prototype.handleVelocityChange_ = function(velocity) {
  this.velocity = velocity;
  if (this.animation) {
    this.animation.setVelocity(this.velocity);
  }
};

main.SpriteControl.prototype.handleMotionBlurChange_ = function(motionBlurStr) {
  this.motionBlurConfig = main.MotionBlurConfig.fromString(motionBlurStr);
  if (this.animation) {
    this.animation.setMotionBlur(this.motionBlurConfig);
  }
};

main.SpriteControl.prototype.installSprite = function(
    controller, spriteContainer, animationManager) {
  this.controller = controller;
  spriteContainer.addSprite(this.sprite);
  animationManager.addAnimation(this.animation);
};

main.SpriteControl.prototype.createSprite = function() {
  this.sprite = new main.ImageSprite(this.getAssetByName(this.assetName).src);
};

main.SpriteControl.prototype.createAnimation = function() {};

/**
 * @constructor
 * @extends {main.SpriteControl}
 */
main.BallSpriteControl = function(spriteAssets, assetName) {
  main.SpriteControl.call(this, spriteAssets, assetName);
};
goog.inherits(main.BallSpriteControl, main.SpriteControl);

main.BallSpriteControl.prototype.createAnimation = function() {
  this.animation = new main.BallBounceAnimation(this.sprite, this.framesPerSecond, this.velocity);
  this.animation.setMotionBlur(this.motionBlurConfig);
};

main.BallSpriteControl.prototype.createSprite = function() {
  this.sprite = new main.ImageSprite(this.getAssetByName(this.assetName).src, 100, 100);
};

/**
 * @constructor
 * @extends {main.SpriteControl}
 */
main.BackgroundSpriteControl = function(spriteAssets, assetName) {
  main.SpriteControl.call(this, spriteAssets, assetName);
  this.setAllowRemove(false);
};
goog.inherits(main.BackgroundSpriteControl, main.SpriteControl);

main.BackgroundSpriteControl.prototype.createAnimation = function() {
  this.animation = new main.BackgroundBounceAnimation(
      this.sprite, this.framesPerSecond, this.velocity);
  this.animation.setMotionBlur(this.motionBlurConfig);
};

/** @constructor */
main.LargeFpsWarning = function() {
  this.onignore = new main.EventHost();

  this.el = document.createElement('div');
  this.el.style.display = 'none';
  goog.dom.classes.add(this.el, 'dialog');
  document.body.appendChild(this.el);

  this.messageEl = document.createElement('div');
  this.el.appendChild(this.messageEl);

  this.buttonContainerEl = document.createElement('div');
  this.el.appendChild(this.buttonContainerEl);

  this.checkUsingJava = false;
  this.installJava = false;

  this.refreshRateDetector = main.DetectRefreshRates.getInstance();
  this.refreshRateDetector.onstatechange.addListener(
      goog.bind(this.handleRefreshRateTesterState, this));
};

main.LargeFpsWarning.prototype.show = function() {
  this.el.style.display = '';
  this.updateDisplay();
};

main.LargeFpsWarning.prototype.hide = function() {
  this.el.style.display = 'none';
};

main.LargeFpsWarning.prototype.handleRefreshRateTesterState = function() {
  this.updateDisplay();
};

main.LargeFpsWarning.prototype.updateDisplay = function() {
  var message = 'You have chosen an animation rate that is faster than 60 ' +
      'frames per second. Many computer monitors default to a refresh ' +
      'rate of 60 Hz. Animations faster than the native refresh rate ' +
      'will not appear visibly smoother.';

  this.buttonContainerEl.innerHTML = '';

  if (this.installJava) {
    message = 'In a moment you should be redirected to install java...';
  } else if (!this.checkUsingJava) {
    var javaButton = document.createElement('button');
    javaButton.innerHTML = '<span>Look up my monitor\'s refresh rate using java</span>';
    javaButton.addEventListener('click',
        goog.bind(this.handleCheckUsingJavaClick, this), false);
    this.buttonContainerEl.appendChild(javaButton);
  } else {
    var State = main.DetectRefreshRates.State;
    var state = this.refreshRateDetector.getState();
    if (state == State.LOADING_JAVA) {
      message = 'Loading java...';
    } else if (state == State.LOADING_JAVA_ERROR) {
      message = 'Error while loading java';
    } else if (state == State.JAVA_MISSING) {
      message = 'You do not appear to have java ' +
          main.DetectRefreshRates.JAVA_VERSION_MATCHER +
          ' installed.';
      var javaInstallButton = document.createElement('button');
      javaInstallButton.innerHTML = '<span>Redirect to install java if available</span>';
      javaInstallButton.addEventListener('click',
          goog.bind(this.handleInstallJavaClick, this), false);
      this.buttonContainerEl.appendChild(javaInstallButton);
    } else if (state == State.LOADING_APPLET) {
      message = 'Loading applet...';
    } else if (state == State.LOADING_APPLET_TIMEOUT) {
      message = 'Timed out while waiting for applet to load.';
    } else if (state == State.COMPLETE) {
      var refreshRates = this.refreshRateDetector.getScreenRefreshRates();
      var knownRefreshRates = [];
      for (var i = 0; i < refreshRates.length; i++) {
        var refreshRate = parseInt(refreshRates[i], 10);
        if (refreshRate && knownRefreshRates.indexOf(refreshRate) < 0) {
          knownRefreshRates.push(refreshRate);
        }
      }
      if (knownRefreshRates.length == 1) {
        message = 'Your monitor(s) are running at a refresh rate of ' +
            knownRefreshRates[0] + ' Hz.  The animations in this demo should work up to ' +
            knownRefreshRates[0] + ' frames per second.';
      } else if (knownRefreshRates.length > 1) {
        message = 'Your monitors are running at the refresh rates of ' +
            knownRefreshRates.join(', ') + ' Hz.  The animations in this demo should work ' +
            'up to these levels depending on which monitor your browser is in.';
      } else {
        message = 'The applet loaded but your monitor\'s refresh rate could not be ' +
            'determined. If you are using an LCD monitor you are most likely running at ' +
            '60 Hz. As such, the animations in this demo should work up to 60 frames per ' +
            'second.';
      }
    } else {
      throw new Error('Unexpected state: ' + state);
    }
  }

  var ignoreButton = document.createElement('button');
  ignoreButton.innerHTML = '<span>Ignore this warning</span>';
  ignoreButton.addEventListener('click',
      goog.bind(this.handleIgnoreClick, this), false);
  this.buttonContainerEl.appendChild(ignoreButton);

  this.messageEl.innerHTML = message;

  this.el.style.marginLeft = -(this.el.offsetWidth/2) + 'px';
  this.el.style.marginTop = -(this.el.offsetHeight/2) + 'px';
};

main.LargeFpsWarning.prototype.handleCheckUsingJavaClick = function() {
  this.checkUsingJava = true;
  this.refreshRateDetector.startLookup();
  this.updateDisplay();
};

main.LargeFpsWarning.prototype.handleInstallJavaClick = function() {
  this.installJava = true;
  this.refreshRateDetector.installJava();
  this.updateDisplay();
};

main.LargeFpsWarning.prototype.handleIgnoreClick = function() {
  this.onignore.fire();
  this.hide();
};

/** @constructor */
main.BrowserVersionWarning = function() {
  this.el = document.createElement('div');
  this.el.style.display = 'none';
  this.el.className = 'dialog';
  document.body.appendChild(this.el);

  this.messageEl = document.createElement('div');
  this.el.appendChild(this.messageEl);

  this.buttonContainerEl = document.createElement('div');
  this.el.appendChild(this.buttonContainerEl);
};

main.BrowserVersionWarning.prototype.check = function() {
  var supported = false;
  if (goog.userAgent.WEBKIT &&
      goog.string.compareVersions(goog.userAgent.VERSION, '533') >= 0) {
    supported = true;
  } else if (goog.userAgent.GECKO &&
      goog.string.compareVersions(goog.userAgent.VERSION, '1.9.2') >= 0) {
    supported = true;
  } else if (goog.userAgent.IE &&
      goog.string.compareVersions(goog.userAgent.VERSION, '9') >= 0) {
    supported = true;
  } else if (goog.userAgent.OPERA &&
      goog.string.compareVersions(goog.userAgent.VERSION, '11') >= 0) {
    supported = true;
  }
  if (!supported) {
    this.show();
  }
};

main.BrowserVersionWarning.prototype.show = function() {
  this.el.style.display = '';
  this.updateDisplay();
};

main.BrowserVersionWarning.prototype.hide = function() {
  this.el.style.display = 'none';
};

main.BrowserVersionWarning.prototype.updateDisplay = function() {
  var message = 'Your browser may not be supported by this tool.  Tested ' +
      'browsers include Chrome, Firefox 3.6+, Internet Explorer 9, ' +
      'Safari 5, and Opera 11.';
  this.messageEl.innerHTML = message;

  this.buttonContainerEl.innerHTML = '';

  var ignoreButton = document.createElement('button');
  ignoreButton.innerHTML = '<span>Ignore this warning</span>';
  var self = this;
  ignoreButton.onclick = function() { self.hide(); };
  this.buttonContainerEl.appendChild(ignoreButton);

  this.el.style.marginLeft = -(this.el.offsetWidth/2) + 'px';
  this.el.style.marginTop = -(this.el.offsetHeight/2) + 'px';
};

window.onload = function() {
  var browserVersionWarning = new main.BrowserVersionWarning();
  browserVersionWarning.check();

  var spriteContainer = new main.SpriteContainer(
      document.getElementById('animation-container'),
      main.VideoSizes.DVD);

  var animationManager = new main.AnimationManager();

  var animationController = new main.AnimationController(
      document.getElementById('control-bar'),
      document.getElementById('show-attributions-link'),
      spriteContainer, animationManager);
  animationController.render();
  animationController.loadDefaultPreset();
  window.animationController = animationController;

  var framesIndicator = new main.FramesIndicator(
      document.getElementById('frames-indicator'));
  if (main.PaintRateMonitor.isAvailable()) {
    var paintRateMonitor = main.PaintRateMonitor.create();
    animationManager.addAnimation(paintRateMonitor);
  }
  animationManager.addAnimation(framesIndicator);

  animationManager.start();
};
