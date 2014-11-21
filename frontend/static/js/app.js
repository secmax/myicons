require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var appCtrl, collectionAddCtrl, collectionCtrl, dashboardCtrl, menuCtrl, modelManager, packAddCtrl, packCtrl, settingsCtrl, template;

window.Hammer = require('hammer');

require('angular.fileuploadshim');

require('angular');

require('angular.aria');

require('angular.route');

require('angular.animate');

require('angular.resource');

require('angular.material');

require('angular.loadingbar');

require('angular.fileupload');

appCtrl = require('./controllers/app');

menuCtrl = require('./controllers/menu');

packCtrl = require('./controllers/pack');

packAddCtrl = require('./controllers/pack_add');

collectionCtrl = require('./controllers/collection');

collectionAddCtrl = require('./controllers/collection_add');

settingsCtrl = require('./controllers/settings');

dashboardCtrl = require('./controllers/dashboard');

modelManager = require('./modelmanager');

template = function(name) {
  return "/static/templates/" + name + ".html";
};

angular.module('myiconsApp', ['ngMaterial', 'ngRoute', 'ngResource', 'angular-loading-bar', 'angularFileUpload']).controller('appCtrl', appCtrl).controller('menuCtrl', menuCtrl).controller('packCtrl', packCtrl).controller('packAddCtrl', packAddCtrl).controller('collectionCtrl', collectionCtrl).controller('collectionAddCtrl', collectionAddCtrl).controller('DashboardCtrl', dashboardCtrl).controller('SettingsCtrl', settingsCtrl).factory('$modelManager', modelManager).config(function($routeProvider, $resourceProvider) {
  $routeProvider.when('/home/dashboard', {
    templateUrl: template('dashboard'),
    controller: 'DashboardCtrl'
  }).when('/home/settings', {
    templateUrl: template('settings'),
    controller: 'SettingsCtrl'
  }).when('/packs/add', {
    templateUrl: template('pack_add'),
    controller: 'packAddCtrl',
    controllerAs: 'pack'
  }).when('/packs/:id', {
    templateUrl: template('pack'),
    controller: 'packCtrl',
    controllerAs: 'pack'
  }).when('/collections/add', {
    templateUrl: template('collection_add'),
    controller: 'collectionAddCtrl',
    controllerAs: 'collection'
  }).when('/collections/:id', {
    templateUrl: template('collection'),
    controller: 'collectionCtrl',
    controllerAs: 'collection'
  }).otherwise({
    redirectTo: '/home/dashboard'
  });
  return $resourceProvider.defaults.stripTrailingSlashes = false;
}).config(function(cfpLoadingBarProvider) {
  return cfpLoadingBarProvider.includeSpinner = false;
}).config(function($httpProvider) {
  var csrf_token;
  csrf_token = document.querySelector('meta[name=csrf-token]').content;
  return $httpProvider.defaults.headers.common['X-CSRFToken'] = csrf_token;
});



},{"./controllers/app":2,"./controllers/collection":3,"./controllers/collection_add":4,"./controllers/dashboard":5,"./controllers/menu":6,"./controllers/pack":7,"./controllers/pack_add":8,"./controllers/settings":9,"./modelmanager":11,"angular":"angular","angular.animate":"angular.animate","angular.aria":"angular.aria","angular.fileupload":"angular.fileupload","angular.fileuploadshim":"angular.fileuploadshim","angular.loadingbar":"angular.loadingbar","angular.material":"angular.material","angular.resource":"angular.resource","angular.route":"angular.route","hammer":"hammer"}],2:[function(require,module,exports){
var AppController, md5;

md5 = require('../deps/md5.js');

AppController = (function() {
  AppController.prototype.theme = 'mydark';

  AppController.prototype.currentUser = null;

  AppController.prototype.gravatar = function(email, size) {
    if (size == null) {
      size = 100;
    }
    if (email) {
      return "https://secure.gravatar.com/avatar/" + (md5(email)) + "?s=" + size + "&d=mm";
    }
  };

  AppController.prototype.openMenu = function() {
    return this.$mdSidenav('left').open();
  };

  function AppController($mdSidenav, $modelManager) {
    this.$mdSidenav = $mdSidenav;
    this.$modelManager = $modelManager;
    this.currentUser = this.$modelManager.currentUser;
    this.$modelManager.ready((function(_this) {
      return function() {
        return console.log('models ready');
      };
    })(this));
  }

  return AppController;

})();

module.exports = AppController;



},{"../deps/md5.js":10}],3:[function(require,module,exports){
var CollectionController;

CollectionController = (function() {
  CollectionController.prototype.info = {};

  CollectionController.prototype.icons = [];

  CollectionController.prototype.iconNames = {};

  CollectionController.prototype.currentTab = 'icons';

  CollectionController.prototype.isTab = function(name) {
    return name === this.currentTab;
  };

  CollectionController.prototype.setTab = function(name) {
    return this.currentTab = name;
  };

  CollectionController.prototype.reset = function() {
    return this.info = angular.copy(this._info);
  };

  CollectionController.prototype.save = function() {
    angular.extend(this._info, this.info);
    return this._info.$update();
  };

  CollectionController.prototype.saveIconName = function(icon) {
    var save;
    save = (function(_this) {
      return function() {
        if (icon.name && _this.iconNameChanged(icon)) {
          _this.iconNames[icon.id] = icon.name;
          return icon.$update();
        }
      };
    })(this);
    return setTimeout(save, 100);
  };

  CollectionController.prototype.iconNameChanged = function(icon) {
    var oldName;
    oldName = this.iconNames[icon.id];
    return oldName !== icon.name;
  };

  CollectionController.prototype.iconNameReset = function(icon) {
    return icon.name = this.iconNames[icon.id];
  };

  CollectionController.prototype.deleteIcon = function(icon) {
    var idx;
    idx = this.icons.indexOf(icon);
    this.icons.splice(idx, 1);
    return icon.$delete();
  };

  CollectionController.prototype.unchanged = function() {
    return angular.equals(this.info, this._info);
  };

  CollectionController.prototype.liveURL = function() {
    return "" + window.location.origin + "/build/livetesting/" + this.info.token + ".css";
  };

  CollectionController.prototype.retoken = function() {
    return this.info.$retoken((function(_this) {
      return function(info) {
        _this._info.token = info.token;
        return _this.info.token = info.token;
      };
    })(this));
  };

  CollectionController.prototype["delete"] = function() {
    var ok;
    ok = confirm('Are you sure?');
    if (ok) {
      this.$modelManager.deleteCollection(this._info);
      return this.$location.path('#/home/dashboard');
    }
  };

  function CollectionController($routeParams, $rootScope, $location, $modelManager) {
    var id;
    this.$routeParams = $routeParams;
    this.$rootScope = $rootScope;
    this.$location = $location;
    this.$modelManager = $modelManager;
    id = parseInt(this.$routeParams.id);
    this.$modelManager.getCollection(id, (function(_this) {
      return function(collection, icons) {
        _this._info = collection;
        _this.icons = icons;
        _this.iconNames = {};
        _this.icons.$promise.then(function() {
          var icon, _i, _len, _results;
          _results = [];
          for (_i = 0, _len = icons.length; _i < _len; _i++) {
            icon = icons[_i];
            _results.push(_this.iconNames[icon.id] = icon.name);
          }
          return _results;
        });
        _this.reset();
        return _this.$rootScope.$broadcast('$reselectMenuItem');
      };
    })(this));
  }

  return CollectionController;

})();

module.exports = CollectionController;



},{}],4:[function(require,module,exports){
var CollectionAddController;

CollectionAddController = (function() {
  CollectionAddController.prototype.info = {};

  CollectionAddController.prototype.reset = function() {
    return this.info = {};
  };

  CollectionAddController.prototype.save = function() {
    return this.$modelManager.addCollection(this.info, (function(_this) {
      return function(collection) {
        _this.reset();
        return _this.$location.path("/collections/" + collection.id);
      };
    })(this));
  };

  function CollectionAddController($location, $modelManager) {
    this.$location = $location;
    this.$modelManager = $modelManager;
    this.reset();
  }

  return CollectionAddController;

})();

module.exports = CollectionAddController;



},{}],5:[function(require,module,exports){
module.exports = function($scope) {};



},{}],6:[function(require,module,exports){
var MenuController, MenuSection;

MenuSection = (function() {
  MenuSection.prototype.sectionIcon = '';

  MenuSection.prototype.isExpanded = false;

  MenuSection.prototype.addItemUrl = null;

  function MenuSection(name, sectionIcon, items) {
    this.name = name;
    this.sectionIcon = sectionIcon;
    this.items = items;
  }

  MenuSection.prototype.pathForItem = function(item) {
    return "/" + this.name + "/" + item.id;
  };

  MenuSection.prototype.toggleExpand = function() {
    return this.isExpanded = !this.isExpanded;
  };

  return MenuSection;

})();

MenuController = (function() {
  MenuController.prototype.sections = [];

  MenuController.prototype.currentSection = null;

  MenuController.prototype.currentItem = null;

  MenuController.prototype.isSelectedSection = function(section) {
    return section === this.currentSection && !section.isExpanded;
  };

  MenuController.prototype.isSelectedItem = function(section, item) {
    return item === this.currentItem && section.isExpanded;
  };

  MenuController.prototype.goto = function(section, item) {
    return this.$location.path(section.pathForItem(item));
  };

  MenuController.prototype.selectItem = function() {
    var item, path, section, _i, _len, _ref, _results;
    path = this.$location.path();
    _ref = this.sections;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      section = _ref[_i];
      _results.push((function() {
        var _j, _len1, _ref1, _results1;
        _ref1 = section.items;
        _results1 = [];
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          item = _ref1[_j];
          if (section.pathForItem(item) === path) {
            this.currentSection = section;
            this.currentItem = item;
            _results1.push(this.currentSection.isExpanded = true);
          } else {
            _results1.push(void 0);
          }
        }
        return _results1;
      }).call(this));
    }
    return _results;
  };

  function MenuController($rootScope, $location, $modelManager) {
    this.$rootScope = $rootScope;
    this.$location = $location;
    this.$modelManager = $modelManager;
    this.home = new MenuSection('home', 'icon-home', [
      {
        id: 'dashboard',
        name: 'Dashboard'
      }, {
        id: 'settings',
        name: 'Settings'
      }
    ]);
    this.packs = new MenuSection('packs', 'icon-packs', this.$modelManager.packs);
    this.collections = new MenuSection('collections', 'icon-collections', this.$modelManager.collections);
    this.packs.addItemUrl = '#/packs/add';
    this.collections.addItemUrl = '#/collections/add';
    this.sections = [this.home, this.packs, this.collections];
    this.$rootScope.$on('$reselectMenuItem', (function(_this) {
      return function() {
        return _this.selectItem();
      };
    })(this));
  }

  return MenuController;

})();

module.exports = MenuController;



},{}],7:[function(require,module,exports){
var PackController, PackIconInfoController;

PackIconInfoController = (function() {
  PackIconInfoController.prototype.sendto = function(collection) {
    var newIconData;
    newIconData = {
      name: this.icon.name,
      packicon: this.icon.id,
      collection: collection.id
    };
    return this.$modelManager.addCollectionIcon(newIconData, (function(_this) {
      return function() {
        return _this.$mdBottomSheet.hide();
      };
    })(this));
  };

  function PackIconInfoController($mdBottomSheet, $modelManager, icon) {
    this.$mdBottomSheet = $mdBottomSheet;
    this.$modelManager = $modelManager;
    this.icon = icon;
    this.collections = this.$modelManager.collections;
  }

  return PackIconInfoController;

})();

PackController = (function() {
  PackController.prototype.info = {};

  PackController.prototype.icons = [];

  PackController.prototype.currentTab = 'icons';

  PackController.prototype.isTab = function(name) {
    return name === this.currentTab;
  };

  PackController.prototype.setTab = function(name) {
    return this.currentTab = name;
  };

  PackController.prototype.reset = function() {
    return this.info = angular.copy(this._info);
  };

  PackController.prototype.save = function() {
    angular.extend(this._info, this.info);
    return this._info.$update();
  };

  PackController.prototype.unchanged = function() {
    return angular.equals(this.info, this._info);
  };

  PackController.prototype.showIconInfo = function(icon) {
    return this.$mdBottomSheet.show({
      controller: PackIconInfoController,
      controllerAs: 'info',
      templateUrl: '/static/templates/pack_icon_info.html',
      locals: {
        icon: icon
      }
    });
  };

  function PackController($routeParams, $rootScope, $modelManager, $mdBottomSheet) {
    var id;
    this.$routeParams = $routeParams;
    this.$rootScope = $rootScope;
    this.$modelManager = $modelManager;
    this.$mdBottomSheet = $mdBottomSheet;
    id = parseInt(this.$routeParams.id);
    this.$modelManager.getPack(id, (function(_this) {
      return function(pack, icons) {
        _this._info = pack;
        _this.icons = icons;
        _this.reset();
        return _this.$rootScope.$broadcast('$reselectMenuItem');
      };
    })(this));
  }

  return PackController;

})();

module.exports = PackController;



},{}],8:[function(require,module,exports){
var PackAddController;

PackAddController = (function() {
  PackAddController.prototype.info = {};

  PackAddController.prototype.fontStatus = '';

  PackAddController.prototype.cssStatus = '';

  PackAddController.prototype.icons = [];

  PackAddController.prototype.iconNames = [];

  PackAddController.prototype.reset = function() {
    this.info = {};
    this.icons = [];
    this.iconNames = [];
    this.fontStatus = '';
    return this.cssStatus = '';
  };

  PackAddController.prototype.fontFileSelected = function(files) {
    var fontfile;
    if (files.length && this.fontStatus !== 'processing') {
      fontfile = files[0];
      if (!fontfile.name.match(/\.(ttf|woff|eot|svg)$/)) {
        return this.fontStatus = 'error';
      } else {
        this.fontStatus = 'processing';
        return this.$upload.upload({
          url: '/convert/font/',
          file: fontfile
        }).success((function(_this) {
          return function(data) {
            _this.icons = data.content.glyphs;
            _this.fontStatus = 'success';
            return _this.info.name = data.content.fontname;
          };
        })(this)).error((function(_this) {
          return function() {
            return _this.fontStatus = 'error';
          };
        })(this));
      }
    }
  };

  PackAddController.prototype.cssFileSelected = function(files) {
    var cssfile;
    if (files.length && this.cssStatus !== 'processing') {
      cssfile = files[0];
      if (!cssfile.name.match(/\.css$/)) {
        return this.cssStatus = 'error';
      } else {
        this.cssStatus = 'processing';
        return this.$upload.upload({
          url: '/convert/css',
          file: cssfile
        }).success((function(_this) {
          return function(data) {
            _this.iconNames = data.content;
            return _this.cssStatus = 'success';
          };
        })(this)).error((function(_this) {
          return function() {
            return _this.cssStatus = 'error';
          };
        })(this));
      }
    }
  };

  PackAddController.prototype.fontInfo = function() {
    if (this.fontStatus === 'error') {
      return 'Invalid font file!';
    } else if (this.fontStatus === 'success') {
      return "" + this.icons.length + " icons detected";
    } else if (this.fontStatus === 'processing') {
      return 'Processing';
    } else {
      return 'Drag font(.ttf, .eot, .woff, .svg) file here to retrive all icons\' shape.';
    }
  };

  PackAddController.prototype.cssInfo = function() {
    if (this.cssStatus === 'error') {
      return 'Invalid css file!';
    } else if (this.cssStatus === 'success') {
      return "" + this.iconNames.length + " icon names detected";
    } else if (this.cssStatus === 'processing') {
      return 'Processing';
    } else {
      return 'Drag StyleSheet(.css) file here to retrive all icon names.';
    }
  };

  PackAddController.prototype.iconsInvalid = function() {
    var _ref;
    return !((this.cssStatus === (_ref = this.fontStatus) && _ref === 'success'));
  };

  PackAddController.prototype.pairIcons = function() {
    var glyph, glyphDict, icon, icons, namepair, _i, _j, _len, _len1, _ref, _ref1;
    glyphDict = {};
    _ref = this.icons;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      glyph = _ref[_i];
      glyphDict[glyph.svg_unicode] = glyph;
    }
    icons = [];
    _ref1 = this.iconNames;
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      namepair = _ref1[_j];
      glyph = glyphDict[namepair.unicode];
      if (glyph) {
        icon = angular.copy(glyph);
        icon.name = namepair.name;
        icons.push(icon);
      }
    }
    return icons;
  };

  PackAddController.prototype.save = function() {
    var icons, info;
    icons = this.pairIcons();
    if (!icons.length > 0) {
      return alert('Unmatched font and css, please upload the correct file!');
    } else {
      info = angular.copy(this.info);
      info.icons = icons;
      return this.$modelManager.addPack(info, (function(_this) {
        return function(pack) {
          return _this.$location.path("/pack/" + pack.id);
        };
      })(this));
    }
  };

  function PackAddController($location, $modelManager, $upload) {
    this.$location = $location;
    this.$modelManager = $modelManager;
    this.$upload = $upload;
  }

  return PackAddController;

})();

module.exports = PackAddController;



},{}],9:[function(require,module,exports){
module.exports = function($scope) {};



},{}],10:[function(require,module,exports){
/*
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.1 Copyright (C) Paul Johnston 1999 - 2002.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */

/*
 * Configurable variables. You may need to tweak these to be compatible with
 * the server-side, but the defaults work in most cases.
 */
var hexcase = 0;  /* hex output format. 0 - lowercase; 1 - uppercase        */
var b64pad  = ""; /* base-64 pad character. "=" for strict RFC compliance   */
var chrsz   = 8;  /* bits per input character. 8 - ASCII; 16 - Unicode      */

/*
 * These are the functions you'll usually want to call
 * They take string arguments and return either hex or base-64 encoded strings
 */
function hex_md5(s){ return binl2hex(core_md5(str2binl(s), s.length * chrsz));}
function b64_md5(s){ return binl2b64(core_md5(str2binl(s), s.length * chrsz));}
function str_md5(s){ return binl2str(core_md5(str2binl(s), s.length * chrsz));}
function hex_hmac_md5(key, data) { return binl2hex(core_hmac_md5(key, data)); }
function b64_hmac_md5(key, data) { return binl2b64(core_hmac_md5(key, data)); }
function str_hmac_md5(key, data) { return binl2str(core_hmac_md5(key, data)); }

/*
 * Perform a simple self-test to see if the VM is working
 */
function md5_vm_test()
{
  return hex_md5("abc") == "900150983cd24fb0d6963f7d28e17f72";
}

/*
 * Calculate the MD5 of an array of little-endian words, and a bit length
 */
function core_md5(x, len)
{
  /* append padding */
  x[len >> 5] |= 0x80 << ((len) % 32);
  x[(((len + 64) >>> 9) << 4) + 14] = len;

  var a =  1732584193;
  var b = -271733879;
  var c = -1732584194;
  var d =  271733878;

  for(var i = 0; i < x.length; i += 16)
  {
    var olda = a;
    var oldb = b;
    var oldc = c;
    var oldd = d;

    a = md5_ff(a, b, c, d, x[i+ 0], 7 , -680876936);
    d = md5_ff(d, a, b, c, x[i+ 1], 12, -389564586);
    c = md5_ff(c, d, a, b, x[i+ 2], 17,  606105819);
    b = md5_ff(b, c, d, a, x[i+ 3], 22, -1044525330);
    a = md5_ff(a, b, c, d, x[i+ 4], 7 , -176418897);
    d = md5_ff(d, a, b, c, x[i+ 5], 12,  1200080426);
    c = md5_ff(c, d, a, b, x[i+ 6], 17, -1473231341);
    b = md5_ff(b, c, d, a, x[i+ 7], 22, -45705983);
    a = md5_ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
    d = md5_ff(d, a, b, c, x[i+ 9], 12, -1958414417);
    c = md5_ff(c, d, a, b, x[i+10], 17, -42063);
    b = md5_ff(b, c, d, a, x[i+11], 22, -1990404162);
    a = md5_ff(a, b, c, d, x[i+12], 7 ,  1804603682);
    d = md5_ff(d, a, b, c, x[i+13], 12, -40341101);
    c = md5_ff(c, d, a, b, x[i+14], 17, -1502002290);
    b = md5_ff(b, c, d, a, x[i+15], 22,  1236535329);

    a = md5_gg(a, b, c, d, x[i+ 1], 5 , -165796510);
    d = md5_gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
    c = md5_gg(c, d, a, b, x[i+11], 14,  643717713);
    b = md5_gg(b, c, d, a, x[i+ 0], 20, -373897302);
    a = md5_gg(a, b, c, d, x[i+ 5], 5 , -701558691);
    d = md5_gg(d, a, b, c, x[i+10], 9 ,  38016083);
    c = md5_gg(c, d, a, b, x[i+15], 14, -660478335);
    b = md5_gg(b, c, d, a, x[i+ 4], 20, -405537848);
    a = md5_gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
    d = md5_gg(d, a, b, c, x[i+14], 9 , -1019803690);
    c = md5_gg(c, d, a, b, x[i+ 3], 14, -187363961);
    b = md5_gg(b, c, d, a, x[i+ 8], 20,  1163531501);
    a = md5_gg(a, b, c, d, x[i+13], 5 , -1444681467);
    d = md5_gg(d, a, b, c, x[i+ 2], 9 , -51403784);
    c = md5_gg(c, d, a, b, x[i+ 7], 14,  1735328473);
    b = md5_gg(b, c, d, a, x[i+12], 20, -1926607734);

    a = md5_hh(a, b, c, d, x[i+ 5], 4 , -378558);
    d = md5_hh(d, a, b, c, x[i+ 8], 11, -2022574463);
    c = md5_hh(c, d, a, b, x[i+11], 16,  1839030562);
    b = md5_hh(b, c, d, a, x[i+14], 23, -35309556);
    a = md5_hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
    d = md5_hh(d, a, b, c, x[i+ 4], 11,  1272893353);
    c = md5_hh(c, d, a, b, x[i+ 7], 16, -155497632);
    b = md5_hh(b, c, d, a, x[i+10], 23, -1094730640);
    a = md5_hh(a, b, c, d, x[i+13], 4 ,  681279174);
    d = md5_hh(d, a, b, c, x[i+ 0], 11, -358537222);
    c = md5_hh(c, d, a, b, x[i+ 3], 16, -722521979);
    b = md5_hh(b, c, d, a, x[i+ 6], 23,  76029189);
    a = md5_hh(a, b, c, d, x[i+ 9], 4 , -640364487);
    d = md5_hh(d, a, b, c, x[i+12], 11, -421815835);
    c = md5_hh(c, d, a, b, x[i+15], 16,  530742520);
    b = md5_hh(b, c, d, a, x[i+ 2], 23, -995338651);

    a = md5_ii(a, b, c, d, x[i+ 0], 6 , -198630844);
    d = md5_ii(d, a, b, c, x[i+ 7], 10,  1126891415);
    c = md5_ii(c, d, a, b, x[i+14], 15, -1416354905);
    b = md5_ii(b, c, d, a, x[i+ 5], 21, -57434055);
    a = md5_ii(a, b, c, d, x[i+12], 6 ,  1700485571);
    d = md5_ii(d, a, b, c, x[i+ 3], 10, -1894986606);
    c = md5_ii(c, d, a, b, x[i+10], 15, -1051523);
    b = md5_ii(b, c, d, a, x[i+ 1], 21, -2054922799);
    a = md5_ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
    d = md5_ii(d, a, b, c, x[i+15], 10, -30611744);
    c = md5_ii(c, d, a, b, x[i+ 6], 15, -1560198380);
    b = md5_ii(b, c, d, a, x[i+13], 21,  1309151649);
    a = md5_ii(a, b, c, d, x[i+ 4], 6 , -145523070);
    d = md5_ii(d, a, b, c, x[i+11], 10, -1120210379);
    c = md5_ii(c, d, a, b, x[i+ 2], 15,  718787259);
    b = md5_ii(b, c, d, a, x[i+ 9], 21, -343485551);

    a = safe_add(a, olda);
    b = safe_add(b, oldb);
    c = safe_add(c, oldc);
    d = safe_add(d, oldd);
  }
  return Array(a, b, c, d);

}

/*
 * These functions implement the four basic operations the algorithm uses.
 */
function md5_cmn(q, a, b, x, s, t)
{
  return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s),b);
}
function md5_ff(a, b, c, d, x, s, t)
{
  return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
}
function md5_gg(a, b, c, d, x, s, t)
{
  return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
}
function md5_hh(a, b, c, d, x, s, t)
{
  return md5_cmn(b ^ c ^ d, a, b, x, s, t);
}
function md5_ii(a, b, c, d, x, s, t)
{
  return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
}

/*
 * Calculate the HMAC-MD5, of a key and some data
 */
function core_hmac_md5(key, data)
{
  var bkey = str2binl(key);
  if(bkey.length > 16) bkey = core_md5(bkey, key.length * chrsz);

  var ipad = Array(16), opad = Array(16);
  for(var i = 0; i < 16; i++)
  {
    ipad[i] = bkey[i] ^ 0x36363636;
    opad[i] = bkey[i] ^ 0x5C5C5C5C;
  }

  var hash = core_md5(ipad.concat(str2binl(data)), 512 + data.length * chrsz);
  return core_md5(opad.concat(hash), 512 + 128);
}

/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */
function safe_add(x, y)
{
  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xFFFF);
}

/*
 * Bitwise rotate a 32-bit number to the left.
 */
function bit_rol(num, cnt)
{
  return (num << cnt) | (num >>> (32 - cnt));
}

/*
 * Convert a string to an array of little-endian words
 * If chrsz is ASCII, characters >255 have their hi-byte silently ignored.
 */
function str2binl(str)
{
  var bin = Array();
  var mask = (1 << chrsz) - 1;
  for(var i = 0; i < str.length * chrsz; i += chrsz)
    bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (i%32);
  return bin;
}

/*
 * Convert an array of little-endian words to a string
 */
function binl2str(bin)
{
  var str = "";
  var mask = (1 << chrsz) - 1;
  for(var i = 0; i < bin.length * 32; i += chrsz)
    str += String.fromCharCode((bin[i>>5] >>> (i % 32)) & mask);
  return str;
}

/*
 * Convert an array of little-endian words to a hex string.
 */
function binl2hex(binarray)
{
  var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
  var str = "";
  for(var i = 0; i < binarray.length * 4; i++)
  {
    str += hex_tab.charAt((binarray[i>>2] >> ((i%4)*8+4)) & 0xF) +
           hex_tab.charAt((binarray[i>>2] >> ((i%4)*8  )) & 0xF);
  }
  return str;
}

/*
 * Convert an array of little-endian words to a base-64 string
 */
function binl2b64(binarray)
{
  var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var str = "";
  for(var i = 0; i < binarray.length * 4; i += 3)
  {
    var triplet = (((binarray[i   >> 2] >> 8 * ( i   %4)) & 0xFF) << 16)
                | (((binarray[i+1 >> 2] >> 8 * ((i+1)%4)) & 0xFF) << 8 )
                |  ((binarray[i+2 >> 2] >> 8 * ((i+2)%4)) & 0xFF);
    for(var j = 0; j < 4; j++)
    {
      if(i * 8 + j * 6 > binarray.length * 32) str += b64pad;
      else str += tab.charAt((triplet >> 6*(3-j)) & 0x3F);
    }
  }
  return str;
}

module.exports = hex_md5;

},{}],11:[function(require,module,exports){
var ModelManger, models;

models = require('./models');

ModelManger = (function() {
  function ModelManger($resource, $q) {
    this.$resource = $resource;
    this.$q = $q;
    this.$models = models(this.$resource);
    this.currentUser = this.$models.User.current();
    this.packs = this.$models.Pack.query();
    this.collections = this.$models.Collection.query();
  }

  ModelManger.prototype.ready = function(callback) {
    return this.$q.all(this.currentUser.$promise, this.packs.$promise, this.collections.promise).then(callback);
  };

  ModelManger.prototype.getPack = function(id, callback) {
    return this.ready((function(_this) {
      return function() {
        var pack, _i, _len, _ref;
        _ref = _this.packs;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          pack = _ref[_i];
          if (pack.id === id) {
            callback(pack, _this.$models.PackIcon.query({
              pack: pack.id
            }));
            return;
          }
        }
      };
    })(this));
  };

  ModelManger.prototype.getCollection = function(id, callback) {
    return this.ready((function(_this) {
      return function() {
        var collection, _i, _len, _ref;
        _ref = _this.collections;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          collection = _ref[_i];
          if (collection.id === id) {
            callback(collection, _this.$models.CollectionIcon.query({
              collection: collection.id
            }));
            return;
          }
        }
      };
    })(this));
  };

  ModelManger.prototype.addPack = function(pack, callback) {
    var newPack;
    newPack = new this.$models.Pack(pack);
    return newPack.$save((function(_this) {
      return function() {
        _this.packs.push(newPack);
        if (callback) {
          return callback(newPack);
        }
      };
    })(this));
  };

  ModelManger.prototype.addCollection = function(collection, callback) {
    var newCollection;
    newCollection = new this.$models.Collection(collection);
    return newCollection.$save((function(_this) {
      return function() {
        _this.collections.push(newCollection);
        if (callback) {
          return callback(newCollection);
        }
      };
    })(this));
  };

  ModelManger.prototype.addCollectionIcon = function(icon, callback) {
    var newIcon;
    newIcon = new this.$models.CollectionIcon(icon);
    return newIcon.$save((function(_this) {
      return function() {
        if (callback) {
          return callback(newIcon);
        }
      };
    })(this));
  };

  ModelManger.prototype.deleteCollection = function(col) {
    var idx;
    idx = this.collections.indexOf(col);
    this.collections.splice(idx, 1);
    return col.$delete();
  };

  return ModelManger;

})();

module.exports = (function(_this) {
  return function($resource, $q) {
    return new ModelManger($resource, $q);
  };
})(this);



},{"./models":12}],12:[function(require,module,exports){
module.exports = function($resource) {
  return {
    'User': $resource('/accounts/users/:username/', {
      username: '@username'
    }, {
      current: {
        method: 'GET',
        url: '/accounts/users/current/'
      }
    }),
    'Pack': $resource('/packs/:id/', {
      id: '@id'
    }, {
      update: {
        method: 'PATCH'
      }
    }),
    'PackIcon': $resource('/packicons/:id/', {
      id: '@id'
    }, {
      update: {
        method: 'PATCH'
      }
    }),
    'Collection': $resource('/collections/:id/', {
      id: '@id'
    }, {
      update: {
        method: 'PATCH'
      },
      retoken: {
        url: '/collections/:id/retoken/',
        params: {
          id: '@id'
        },
        method: 'POST'
      }
    }),
    'CollectionIcon': $resource('/collectionicons/:id/', {
      id: '@id'
    }, {
      update: {
        method: 'PATCH'
      }
    })
  };
};



},{}],"angular.animate":[function(require,module,exports){
/*
 AngularJS v1.3.0
 (c) 2010-2014 Google, Inc. http://angularjs.org
 License: MIT
*/
(function(M,f,S){'use strict';f.module("ngAnimate",["ng"]).directive("ngAnimateChildren",function(){return function(T,B,k){k=k.ngAnimateChildren;f.isString(k)&&0===k.length?B.data("$$ngAnimateChildren",!0):T.$watch(k,function(f){B.data("$$ngAnimateChildren",!!f)})}}).factory("$$animateReflow",["$$rAF","$document",function(f,B){return function(k){return f(function(){k()})}}]).config(["$provide","$animateProvider",function(T,B){function k(f){for(var g=0;g<f.length;g++){var k=f[g];if(1==k.nodeType)return k}}
function N(f,g){return k(f)==k(g)}var s=f.noop,g=f.forEach,ba=B.$$selectors,$=f.isArray,ca=f.isString,da=f.isObject,t={running:!0};T.decorator("$animate",["$delegate","$$q","$injector","$sniffer","$rootElement","$$asyncCallback","$rootScope","$document","$templateRequest",function(O,M,I,U,x,C,P,S,V){function A(a,c){var b=a.data("$$ngAnimateState")||{};c&&(b.running=!0,b.structural=!0,a.data("$$ngAnimateState",b));return b.disabled||b.running&&b.structural}function z(a){var c,b=M.defer();b.promise.$$cancelFn=
function(){c&&c()};P.$$postDigest(function(){c=a(function(){b.resolve()})});return b.promise}function J(a){if(da(a))return a.tempClasses&&ca(a.tempClasses)&&(a.tempClasses=a.tempClasses.split(/\s+/)),a}function W(a,c,b){b=b||{};var e={};g(b,function(a,d){g(d.split(" "),function(d){e[d]=a})});var m=Object.create(null);g((a.attr("class")||"").split(/\s+/),function(a){m[a]=!0});var f=[],k=[];g(c.classes,function(a,d){var b=m[d],c=e[d]||{};!1===a?(b||"addClass"==c.event)&&k.push(d):!0===a&&(b&&"removeClass"!=
c.event||f.push(d))});return 0<f.length+k.length&&[f.join(" "),k.join(" ")]}function Q(a){if(a){var c=[],b={};a=a.substr(1).split(".");(U.transitions||U.animations)&&c.push(I.get(ba[""]));for(var e=0;e<a.length;e++){var f=a[e],k=ba[f];k&&!b[f]&&(c.push(I.get(k)),b[f]=!0)}return c}}function R(a,c,b,e){function m(a,d){var b=a[d],c=a["before"+d.charAt(0).toUpperCase()+d.substr(1)];if(b||c)return"leave"==d&&(c=b,b=null),l.push({event:d,fn:b}),H.push({event:d,fn:c}),!0}function k(c,h,G){var w=[];g(c,function(a){a.fn&&
w.push(a)});var f=0;g(w,function(c,n){var u=function(){a:{if(h){(h[n]||s)();if(++f<w.length)break a;h=null}G()}};switch(c.event){case "setClass":h.push(c.fn(a,F,d,u,e));break;case "animate":h.push(c.fn(a,b,e.from,e.to,u));break;case "addClass":h.push(c.fn(a,F||b,u,e));break;case "removeClass":h.push(c.fn(a,d||b,u,e));break;default:h.push(c.fn(a,u,e))}});h&&0===h.length&&G()}var p=a[0];if(p){e&&(e.to=e.to||{},e.from=e.from||{});var F,d;$(b)&&(F=b[0],d=b[1],F?d?b=F+" "+d:(b=F,c="addClass"):(b=d,c="removeClass"));
var h="setClass"==c,G=h||"addClass"==c||"removeClass"==c||"animate"==c,w=a.attr("class")+" "+b;if(X(w)){var u=s,n=[],H=[],q=s,r=[],l=[],w=(" "+w).replace(/\s+/g,".");g(Q(w),function(a){!m(a,c)&&h&&(m(a,"addClass"),m(a,"removeClass"))});return{node:p,event:c,className:b,isClassBased:G,isSetClassOperation:h,applyStyles:function(){e&&a.css(f.extend(e.from||{},e.to||{}))},before:function(a){u=a;k(H,n,function(){u=s;a()})},after:function(a){q=a;k(l,r,function(){q=s;a()})},cancel:function(){n&&(g(n,function(a){(a||
s)(!0)}),u(!0));r&&(g(r,function(a){(a||s)(!0)}),q(!0))}}}}}function y(a,c,b,e,m,k,p,F){function d(d){var h="$animate:"+d;H&&H[h]&&0<H[h].length&&C(function(){b.triggerHandler(h,{event:a,className:c})})}function h(){d("before")}function G(){d("after")}function w(){w.hasBeenRun||(w.hasBeenRun=!0,k())}function u(){if(!u.hasBeenRun){n&&n.applyStyles();u.hasBeenRun=!0;p&&p.tempClasses&&g(p.tempClasses,function(a){b.removeClass(a)});var h=b.data("$$ngAnimateState");h&&(n&&n.isClassBased?l(b,c):(C(function(){var d=
b.data("$$ngAnimateState")||{};v==d.index&&l(b,c,a)}),b.data("$$ngAnimateState",h)));d("close");F()}}var n=R(b,a,c,p);if(!n)return w(),h(),G(),u(),s;a=n.event;c=n.className;var H=f.element._data(n.node),H=H&&H.events;e||(e=m?m.parent():b.parent());if(Y(b,e))return w(),h(),G(),u(),s;e=b.data("$$ngAnimateState")||{};var q=e.active||{},r=e.totalActive||0,t=e.last;m=!1;if(0<r){r=[];if(n.isClassBased)"setClass"==t.event?(r.push(t),l(b,c)):q[c]&&(aa=q[c],aa.event==a?m=!0:(r.push(aa),l(b,c)));else if("leave"==
a&&q["ng-leave"])m=!0;else{for(var aa in q)r.push(q[aa]);e={};l(b,!0)}0<r.length&&g(r,function(a){a.cancel()})}!n.isClassBased||n.isSetClassOperation||"animate"==a||m||(m="addClass"==a==b.hasClass(c));if(m)return w(),h(),G(),d("close"),F(),s;q=e.active||{};r=e.totalActive||0;if("leave"==a)b.one("$destroy",function(a){a=f.element(this);var d=a.data("$$ngAnimateState");d&&(d=d.active["ng-leave"])&&(d.cancel(),l(a,"ng-leave"))});b.addClass("ng-animate");p&&p.tempClasses&&g(p.tempClasses,function(a){b.addClass(a)});
var v=Z++;r++;q[c]=n;b.data("$$ngAnimateState",{last:n,active:q,index:v,totalActive:r});h();n.before(function(d){var h=b.data("$$ngAnimateState");d=d||!h||!h.active[c]||n.isClassBased&&h.active[c].event!=a;w();!0===d?u():(G(),n.after(u))});return n.cancel}function K(a){if(a=k(a))a=f.isFunction(a.getElementsByClassName)?a.getElementsByClassName("ng-animate"):a.querySelectorAll(".ng-animate"),g(a,function(a){a=f.element(a);(a=a.data("$$ngAnimateState"))&&a.active&&g(a.active,function(a){a.cancel()})})}
function l(a,c){if(N(a,x))t.disabled||(t.running=!1,t.structural=!1);else if(c){var b=a.data("$$ngAnimateState")||{},e=!0===c;!e&&b.active&&b.active[c]&&(b.totalActive--,delete b.active[c]);if(e||!b.totalActive)a.removeClass("ng-animate"),a.removeData("$$ngAnimateState")}}function Y(a,c){if(t.disabled)return!0;if(N(a,x))return t.running;var b,e,k;do{if(0===c.length)break;var g=N(c,x),p=g?t:c.data("$$ngAnimateState")||{};if(p.disabled)return!0;g&&(k=!0);!1!==b&&(g=c.data("$$ngAnimateChildren"),f.isDefined(g)&&
(b=g));e=e||p.running||p.last&&!p.last.isClassBased}while(c=c.parent());return!k||!b&&e}x.data("$$ngAnimateState",t);var L=P.$watch(function(){return V.totalPendingRequests},function(a,c){0===a&&(L(),P.$$postDigest(function(){P.$$postDigest(function(){t.running=!1})}))}),Z=0,E=B.classNameFilter(),X=E?function(a){return E.test(a)}:function(){return!0};return{animate:function(a,c,b,e,g){e=e||"ng-inline-animate";g=J(g)||{};g.from=b?c:null;g.to=b?b:c;return z(function(b){return y("animate",e,f.element(k(a)),
null,null,s,g,b)})},enter:function(a,c,b,e){e=J(e);a=f.element(a);c=c&&f.element(c);b=b&&f.element(b);A(a,!0);O.enter(a,c,b);return z(function(g){return y("enter","ng-enter",f.element(k(a)),c,b,s,e,g)})},leave:function(a,c){c=J(c);a=f.element(a);K(a);A(a,!0);return z(function(b){return y("leave","ng-leave",f.element(k(a)),null,null,function(){O.leave(a)},c,b)})},move:function(a,c,b,e){e=J(e);a=f.element(a);c=c&&f.element(c);b=b&&f.element(b);K(a);A(a,!0);O.move(a,c,b);return z(function(g){return y("move",
"ng-move",f.element(k(a)),c,b,s,e,g)})},addClass:function(a,c,b){return this.setClass(a,c,[],b)},removeClass:function(a,c,b){return this.setClass(a,[],c,b)},setClass:function(a,c,b,e){e=J(e);a=f.element(a);a=f.element(k(a));if(A(a))return O.$$setClassImmediately(a,c,b,e);var m,l=a.data("$$animateClasses"),p=!!l;l||(l={classes:{}});m=l.classes;c=$(c)?c:c.split(" ");g(c,function(a){a&&a.length&&(m[a]=!0)});b=$(b)?b:b.split(" ");g(b,function(a){a&&a.length&&(m[a]=!1)});if(p)return e&&l.options&&(l.options=
f.extend(l.options||{},e)),l.promise;a.data("$$animateClasses",l={classes:m,options:e});return l.promise=z(function(b){var d=a.parent(),h=k(a),c=h.parentNode;if(!c||c.$$NG_REMOVED||h.$$NG_REMOVED)b();else{h=a.data("$$animateClasses");a.removeData("$$animateClasses");var c=a.data("$$ngAnimateState")||{},e=W(a,h,c.active);return e?y("setClass",e,a,d,null,function(){e[0]&&O.$$addClassImmediately(a,e[0]);e[1]&&O.$$removeClassImmediately(a,e[1])},h.options,b):b()}})},cancel:function(a){a.$$cancelFn()},
enabled:function(a,c){switch(arguments.length){case 2:if(a)l(c);else{var b=c.data("$$ngAnimateState")||{};b.disabled=!0;c.data("$$ngAnimateState",b)}break;case 1:t.disabled=!a;break;default:a=!t.disabled}return!!a}}}]);B.register("",["$window","$sniffer","$timeout","$$animateReflow",function(t,B,I,U){function x(){e||(e=U(function(){b=[];e=null;a={}}))}function C(c,d){e&&e();b.push(d);e=U(function(){g(b,function(a){a()});b=[];e=null;a={}})}function P(a,d){var h=k(a);a=f.element(h);p.push(a);h=Date.now()+
d;h<=N||(I.cancel(m),N=h,m=I(function(){T(p);p=[]},d,!1))}function T(a){g(a,function(a){(a=a.data("$$ngAnimateCSS3Data"))&&g(a.closeAnimationFns,function(a){a()})})}function V(b,d){var h=d?a[d]:null;if(!h){var c=0,e=0,f=0,k=0;g(b,function(a){if(1==a.nodeType){a=t.getComputedStyle(a)||{};c=Math.max(A(a[L+"Duration"]),c);e=Math.max(A(a[L+"Delay"]),e);k=Math.max(A(a[E+"Delay"]),k);var d=A(a[E+"Duration"]);0<d&&(d*=parseInt(a[E+"IterationCount"],10)||1);f=Math.max(d,f)}});h={total:0,transitionDelay:e,
transitionDuration:c,animationDelay:k,animationDuration:f};d&&(a[d]=h)}return h}function A(a){var d=0;a=ca(a)?a.split(/\s*,\s*/):[];g(a,function(a){d=Math.max(parseFloat(a)||0,d)});return d}function z(b,d,h,e){b=0<=["ng-enter","ng-leave","ng-move"].indexOf(h);var f,g=d.parent(),n=g.data("$$ngAnimateKey");n||(g.data("$$ngAnimateKey",++c),n=c);f=n+"-"+k(d).getAttribute("class");var g=f+" "+h,n=a[g]?++a[g].total:0,l={};if(0<n){var q=h+"-stagger",l=f+" "+q;(f=!a[l])&&d.addClass(q);l=V(d,l);f&&d.removeClass(q)}d.addClass(h);
var q=d.data("$$ngAnimateCSS3Data")||{},r=V(d,g);f=r.transitionDuration;r=r.animationDuration;if(b&&0===f&&0===r)return d.removeClass(h),!1;h=e||b&&0<f;b=0<r&&0<l.animationDelay&&0===l.animationDuration;d.data("$$ngAnimateCSS3Data",{stagger:l,cacheKey:g,running:q.running||0,itemIndex:n,blockTransition:h,closeAnimationFns:q.closeAnimationFns||[]});g=k(d);h&&(W(g,!0),e&&d.css(e));b&&(g.style[E+"PlayState"]="paused");return!0}function J(a,d,b,c,e){function f(){d.off(C,l);d.removeClass(q);d.removeClass(r);
z&&I.cancel(z);K(d,b);var a=k(d),c;for(c in p)a.style.removeProperty(p[c])}function l(a){a.stopPropagation();var d=a.originalEvent||a;a=d.$manualTimeStamp||d.timeStamp||Date.now();d=parseFloat(d.elapsedTime.toFixed(3));Math.max(a-B,0)>=A&&d>=x&&c()}var m=k(d);a=d.data("$$ngAnimateCSS3Data");if(-1!=m.getAttribute("class").indexOf(b)&&a){var q="",r="";g(b.split(" "),function(a,d){var b=(0<d?" ":"")+a;q+=b+"-active";r+=b+"-pending"});var p=[],t=a.itemIndex,v=a.stagger,s=0;if(0<t){s=0;0<v.transitionDelay&&
0===v.transitionDuration&&(s=v.transitionDelay*t);var y=0;0<v.animationDelay&&0===v.animationDuration&&(y=v.animationDelay*t,p.push(Y+"animation-play-state"));s=Math.round(100*Math.max(s,y))/100}s||(d.addClass(q),a.blockTransition&&W(m,!1));var D=V(d,a.cacheKey+" "+q),x=Math.max(D.transitionDuration,D.animationDuration);if(0===x)d.removeClass(q),K(d,b),c();else{!s&&e&&(D.transitionDuration||(d.css("transition",D.animationDuration+"s linear all"),p.push("transition")),d.css(e));var t=Math.max(D.transitionDelay,
D.animationDelay),A=1E3*t;0<p.length&&(v=m.getAttribute("style")||"",";"!==v.charAt(v.length-1)&&(v+=";"),m.setAttribute("style",v+" "));var B=Date.now(),C=X+" "+Z,t=1E3*(s+1.5*(t+x)),z;0<s&&(d.addClass(r),z=I(function(){z=null;0<D.transitionDuration&&W(m,!1);0<D.animationDuration&&(m.style[E+"PlayState"]="");d.addClass(q);d.removeClass(r);e&&(0===D.transitionDuration&&d.css("transition",D.animationDuration+"s linear all"),d.css(e),p.push("transition"))},1E3*s,!1));d.on(C,l);a.closeAnimationFns.push(function(){f();
c()});a.running++;P(d,t);return f}}else c()}function W(a,d){a.style[L+"Property"]=d?"none":""}function Q(a,d,b,c){if(z(a,d,b,c))return function(a){a&&K(d,b)}}function R(a,d,b,c,e){if(d.data("$$ngAnimateCSS3Data"))return J(a,d,b,c,e);K(d,b);c()}function y(a,d,b,c,e){var f=Q(a,d,b,e.from);if(f){var g=f;C(d,function(){g=R(a,d,b,c,e.to)});return function(a){(g||s)(a)}}x();c()}function K(a,d){a.removeClass(d);var b=a.data("$$ngAnimateCSS3Data");b&&(b.running&&b.running--,b.running&&0!==b.running||a.removeData("$$ngAnimateCSS3Data"))}
function l(a,d){var b="";a=$(a)?a:a.split(/\s+/);g(a,function(a,c){a&&0<a.length&&(b+=(0<c?" ":"")+a+d)});return b}var Y="",L,Z,E,X;M.ontransitionend===S&&M.onwebkittransitionend!==S?(Y="-webkit-",L="WebkitTransition",Z="webkitTransitionEnd transitionend"):(L="transition",Z="transitionend");M.onanimationend===S&&M.onwebkitanimationend!==S?(Y="-webkit-",E="WebkitAnimation",X="webkitAnimationEnd animationend"):(E="animation",X="animationend");var a={},c=0,b=[],e,m=null,N=0,p=[];return{animate:function(a,
d,b,c,e,f){f=f||{};f.from=b;f.to=c;return y("animate",a,d,e,f)},enter:function(a,b,c){c=c||{};return y("enter",a,"ng-enter",b,c)},leave:function(a,b,c){c=c||{};return y("leave",a,"ng-leave",b,c)},move:function(a,b,c){c=c||{};return y("move",a,"ng-move",b,c)},beforeSetClass:function(a,b,c,e,f){f=f||{};b=l(c,"-remove")+" "+l(b,"-add");if(f=Q("setClass",a,b,f.from))return C(a,e),f;x();e()},beforeAddClass:function(a,b,c,e){e=e||{};if(b=Q("addClass",a,l(b,"-add"),e.from))return C(a,c),b;x();c()},beforeRemoveClass:function(a,
b,c,e){e=e||{};if(b=Q("removeClass",a,l(b,"-remove"),e.from))return C(a,c),b;x();c()},setClass:function(a,b,c,e,f){f=f||{};c=l(c,"-remove");b=l(b,"-add");return R("setClass",a,c+" "+b,e,f.to)},addClass:function(a,b,c,e){e=e||{};return R("addClass",a,l(b,"-add"),c,e.to)},removeClass:function(a,b,c,e){e=e||{};return R("removeClass",a,l(b,"-remove"),c,e.to)}}}])}])})(window,window.angular);
//# sourceMappingURL=angular-animate.min.js.map

},{}],"angular.aria":[function(require,module,exports){
/*
 AngularJS v1.3.0
 (c) 2010-2014 Google, Inc. http://angularjs.org
 License: MIT
*/
(function(h,k,p){'use strict';h=["$aria",function(c){return function(e,f,a){c.config("tabindex")&&!f.attr("tabindex")&&f.attr("tabindex",0)}}];k.module("ngAria",["ng"]).provider("$aria",function(){function c(a){return a.replace(/-./g,function(b,a){return b[1].toUpperCase()})}function e(a,b,g){var d=c(b);return function(c,e,l){f[d]&&!l[d]&&c.$watch(l[a],function(a){g&&(a=!a);e.attr(b,a)})}}var f={ariaHidden:!0,ariaChecked:!0,ariaDisabled:!0,ariaRequired:!0,ariaInvalid:!0,ariaMultiline:!0,ariaValue:!0,
tabindex:!0};this.config=function(a){f=k.extend(f,a)};this.$get=function(){return{config:function(a){return f[c(a)]},$$watchExpr:e}}}).directive("ngShow",["$aria",function(c){return c.$$watchExpr("ngShow","aria-hidden",!0)}]).directive("ngHide",["$aria",function(c){return c.$$watchExpr("ngHide","aria-hidden",!1)}]).directive("ngModel",["$aria",function(c){function e(a,b){return c.config(a)&&!b.attr(a)}function f(a,b){var c=a.type,d=a.role;return"checkbox"===(c||d)||"menuitemcheckbox"===d?"checkbox":
"radio"===(c||d)||"menuitemradio"===d?"radio":"range"===c||"progressbar"===d||"slider"===d?"range":"textbox"===(c||d)||"TEXTAREA"===b[0].nodeName?"multiline":""}return{restrict:"A",require:"?ngModel",link:function(a,b,g,d){function h(){return d.$modelValue}function k(){return m?(m=!1,function(a){a=a===g.value;b.attr("aria-checked",a);b.attr("tabindex",0-!a)}):function(a){b.attr("aria-checked",a===g.value)}}function l(a){b.attr("aria-checked",!!a)}var n=f(g,b),m=e("tabindex",b);switch(n){case "radio":case "checkbox":e("aria-checked",
b)&&a.$watch(h,"radio"===n?k():l);break;case "range":c.config("ariaValue")&&(g.min&&!b.attr("aria-valuemin")&&b.attr("aria-valuemin",g.min),g.max&&!b.attr("aria-valuemax")&&b.attr("aria-valuemax",g.max),b.attr("aria-valuenow")||a.$watch(h,function(a){b.attr("aria-valuenow",a)}));break;case "multiline":e("aria-multiline",b)&&b.attr("aria-multiline",!0)}m&&b.attr("tabindex",0);d.$validators.required&&e("aria-required",b)&&a.$watch(function(){return d.$error.required},function(a){b.attr("aria-required",
!!a)});e("aria-invalid",b)&&a.$watch(function(){return d.$invalid},function(a){b.attr("aria-invalid",!!a)})}}}]).directive("ngDisabled",["$aria",function(c){return c.$$watchExpr("ngDisabled","aria-disabled")}]).directive("ngClick",h).directive("ngDblclick",h)})(window,window.angular);
//# sourceMappingURL=angular-aria.min.js.map

},{}],"angular.fileuploadshim":[function(require,module,exports){
/*! 1.6.12 */
!function(){var a=function(){try{var a=new ActiveXObject("ShockwaveFlash.ShockwaveFlash");if(a)return!0}catch(b){if(void 0!=navigator.mimeTypes["application/x-shockwave-flash"])return!0}return!1},b=function(a,b){window.XMLHttpRequest.prototype[a]=b(window.XMLHttpRequest.prototype[a])};if(window.XMLHttpRequest){if(!window.FormData||window.FileAPI&&FileAPI.forceLoad){var c=function(a){if(!a.__listeners){a.upload||(a.upload={}),a.__listeners=[];var b=a.upload.addEventListener;a.upload.addEventListener=function(c,d){a.__listeners[c]=d,b&&b.apply(this,arguments)}}};b("open",function(a){return function(b,d,e){c(this),this.__url=d;try{a.apply(this,[b,d,e])}catch(f){f.message.indexOf("Access is denied")>-1&&a.apply(this,[b,"_fix_for_ie_crossdomain__",e])}}}),b("getResponseHeader",function(a){return function(b){return this.__fileApiXHR&&this.__fileApiXHR.getResponseHeader?this.__fileApiXHR.getResponseHeader(b):null==a?null:a.apply(this,[b])}}),b("getAllResponseHeaders",function(a){return function(){return this.__fileApiXHR&&this.__fileApiXHR.getAllResponseHeaders?this.__fileApiXHR.getAllResponseHeaders():null==a?null:a.apply(this)}}),b("abort",function(a){return function(){return this.__fileApiXHR&&this.__fileApiXHR.abort?this.__fileApiXHR.abort():null==a?null:a.apply(this)}}),b("setRequestHeader",function(a){return function(b,d){if("__setXHR_"===b){c(this);var e=d(this);e instanceof Function&&e(this)}else this.__requestHeaders=this.__requestHeaders||{},this.__requestHeaders[b]=d,a.apply(this,arguments)}}),b("send",function(b){return function(){var c=this;if(arguments[0]&&arguments[0].__isShim){var d=arguments[0],e={url:c.__url,jsonp:!1,cache:!0,complete:function(a,b){c.__completed=!0,!a&&c.__listeners.load&&c.__listeners.load({type:"load",loaded:c.__loaded,total:c.__total,target:c,lengthComputable:!0}),!a&&c.__listeners.loadend&&c.__listeners.loadend({type:"loadend",loaded:c.__loaded,total:c.__total,target:c,lengthComputable:!0}),"abort"===a&&c.__listeners.abort&&c.__listeners.abort({type:"abort",loaded:c.__loaded,total:c.__total,target:c,lengthComputable:!0}),void 0!==b.status&&Object.defineProperty(c,"status",{get:function(){return 0==b.status&&a&&"abort"!==a?500:b.status}}),void 0!==b.statusText&&Object.defineProperty(c,"statusText",{get:function(){return b.statusText}}),Object.defineProperty(c,"readyState",{get:function(){return 4}}),void 0!==b.response&&Object.defineProperty(c,"response",{get:function(){return b.response}});var d=b.responseText||(a&&0==b.status&&"abort"!==a?a:void 0);Object.defineProperty(c,"responseText",{get:function(){return d}}),Object.defineProperty(c,"response",{get:function(){return d}}),a&&Object.defineProperty(c,"err",{get:function(){return a}}),c.__fileApiXHR=b,c.onreadystatechange&&c.onreadystatechange()},fileprogress:function(a){if(a.target=c,c.__listeners.progress&&c.__listeners.progress(a),c.__total=a.total,c.__loaded=a.loaded,a.total===a.loaded){var b=this;setTimeout(function(){c.__completed||(c.getAllResponseHeaders=function(){},b.complete(null,{status:204,statusText:"No Content"}))},1e4)}},headers:c.__requestHeaders};e.data={},e.files={};for(var f=0;f<d.data.length;f++){var g=d.data[f];null!=g.val&&null!=g.val.name&&null!=g.val.size&&null!=g.val.type?e.files[g.key]=g.val:e.data[g.key]=g.val}setTimeout(function(){if(!a())throw'Adode Flash Player need to be installed. To check ahead use "FileAPI.hasFlash"';c.__fileApiXHR=FileAPI.upload(e)},1)}else b.apply(c,arguments)}})}else b("setRequestHeader",function(a){return function(b,c){if("__setXHR_"===b){var d=c(this);d instanceof Function&&d(this)}else a.apply(this,arguments)}});window.XMLHttpRequest.__isShim=!0}if(!window.FormData||window.FileAPI&&FileAPI.forceLoad){var d=function(b){if(!a())throw'Adode Flash Player need to be installed. To check ahead use "FileAPI.hasFlash"';var c=angular.element(b);if(!(c.attr("disabled")||c.hasClass("js-fileapi-wrapper")||null==b.getAttribute("ng-file-select")&&null==b.getAttribute("data-ng-file-select")))if(FileAPI.wrapInsideDiv){var d=document.createElement("div");d.innerHTML='<div class="js-fileapi-wrapper" style="position:relative; overflow:hidden"></div>',d=d.firstChild;var e=b.parentNode;e.insertBefore(d,b),e.removeChild(b),d.appendChild(b)}else c.addClass("js-fileapi-wrapper"),c.parent()[0].__file_click_fn_delegate_&&((""===c.parent().css("position")||"static"===c.parent().css("position"))&&c.parent().css("position","relative"),c.css("top",0).css("bottom",0).css("left",0).css("right",0).css("width","100%").css("height","100%").css("padding",0).css("margin",0),c.parent().unbind("click",c.parent()[0].__file_click_fn_delegate_))},e=function(a){return function(b){for(var c=FileAPI.getFiles(b),d=0;d<c.length;d++)void 0===c[d].size&&(c[d].size=0),void 0===c[d].name&&(c[d].name="file"),void 0===c[d].type&&(c[d].type="undefined");b.target||(b.target={}),b.target.files=c,b.target.files!=c&&(b.__files_=c),(b.__files_||b.target.files).item=function(a){return(b.__files_||b.target.files)[a]||null},a&&a.apply(this,[b])}},f=function(a,b){return("change"===b.toLowerCase()||"onchange"===b.toLowerCase())&&"file"==a.getAttribute("type")};HTMLInputElement.prototype.addEventListener&&(HTMLInputElement.prototype.addEventListener=function(a){return function(b,c,g,h){f(this,b)?(d(this),a.apply(this,[b,e(c),g,h])):a.apply(this,[b,c,g,h])}}(HTMLInputElement.prototype.addEventListener)),HTMLInputElement.prototype.attachEvent&&(HTMLInputElement.prototype.attachEvent=function(a){return function(b,c){f(this,b)?(d(this),window.jQuery?angular.element(this).bind("change",e(null)):a.apply(this,[b,e(c)])):a.apply(this,[b,c])}}(HTMLInputElement.prototype.attachEvent)),window.FormData=FormData=function(){return{append:function(a,b,c){this.data.push({key:a,val:b,name:c})},data:[],__isShim:!0}},function(){if(window.FileAPI||(window.FileAPI={}),FileAPI.forceLoad&&(FileAPI.html5=!1),!FileAPI.upload){var b,c,d,e,f,g=document.createElement("script"),h=document.getElementsByTagName("script");if(window.FileAPI.jsUrl)b=window.FileAPI.jsUrl;else if(window.FileAPI.jsPath)c=window.FileAPI.jsPath;else for(d=0;d<h.length;d++)if(f=h[d].src,e=f.indexOf("angular-file-upload-shim.js"),-1==e&&(e=f.indexOf("angular-file-upload-shim.min.js")),e>-1){c=f.substring(0,e);break}null==FileAPI.staticPath&&(FileAPI.staticPath=c),g.setAttribute("src",b||c+"FileAPI.min.js"),document.getElementsByTagName("head")[0].appendChild(g),FileAPI.hasFlash=a()}}(),FileAPI.disableFileInput=function(a,b){b?a.removeClass("js-fileapi-wrapper"):a.addClass("js-fileapi-wrapper")}}window.FileReader||(window.FileReader=function(){var a=this,b=!1;this.listeners={},this.addEventListener=function(b,c){a.listeners[b]=a.listeners[b]||[],a.listeners[b].push(c)},this.removeEventListener=function(b,c){a.listeners[b]&&a.listeners[b].splice(a.listeners[b].indexOf(c),1)},this.dispatchEvent=function(b){var c=a.listeners[b.type];if(c)for(var d=0;d<c.length;d++)c[d].call(a,b)},this.onabort=this.onerror=this.onload=this.onloadstart=this.onloadend=this.onprogress=null;var c=function(b,c){var d={type:b,target:a,loaded:c.loaded,total:c.total,error:c.error};return null!=c.result&&(d.target.result=c.result),d},d=function(d){if(b||(b=!0,a.onloadstart&&this.onloadstart(c("loadstart",d))),"load"===d.type){a.onloadend&&a.onloadend(c("loadend",d));var e=c("load",d);a.onload&&a.onload(e),a.dispatchEvent(e)}else if("progress"===d.type){var e=c("progress",d);a.onprogress&&a.onprogress(e),a.dispatchEvent(e)}else{var e=c("error",d);a.onerror&&a.onerror(e),a.dispatchEvent(e)}};this.readAsArrayBuffer=function(a){FileAPI.readAsBinaryString(a,d)},this.readAsBinaryString=function(a){FileAPI.readAsBinaryString(a,d)},this.readAsDataURL=function(a){FileAPI.readAsDataURL(a,d)},this.readAsText=function(a){FileAPI.readAsText(a,d)}})}();
},{}],"angular.fileupload":[function(require,module,exports){
/*! 1.6.12 */
!function(){var a=angular.module("angularFileUpload",[]);a.service("$upload",["$http","$q","$timeout",function(a,b,c){function d(d){d.method=d.method||"POST",d.headers=d.headers||{},d.transformRequest=d.transformRequest||function(b,c){return window.ArrayBuffer&&b instanceof window.ArrayBuffer?b:a.defaults.transformRequest[0](b,c)};var e=b.defer();window.XMLHttpRequest.__isShim&&(d.headers.__setXHR_=function(){return function(a){a&&(d.__XHR=a,d.xhrFn&&d.xhrFn(a),a.upload.addEventListener("progress",function(a){e.notify(a)},!1),a.upload.addEventListener("load",function(a){a.lengthComputable&&e.notify(a)},!1))}}),a(d).then(function(a){e.resolve(a)},function(a){e.reject(a)},function(a){e.notify(a)});var f=e.promise;return f.success=function(a){return f.then(function(b){a(b.data,b.status,b.headers,d)}),f},f.error=function(a){return f.then(null,function(b){a(b.data,b.status,b.headers,d)}),f},f.progress=function(a){return f.then(null,null,function(b){a(b)}),f},f.abort=function(){return d.__XHR&&c(function(){d.__XHR.abort()}),f},f.xhr=function(a){return d.xhrFn=function(b){return function(){b&&b.apply(f,arguments),a.apply(f,arguments)}}(d.xhrFn),f},f}this.upload=function(b){b.headers=b.headers||{},b.headers["Content-Type"]=void 0,b.transformRequest=b.transformRequest||a.defaults.transformRequest;var c=new FormData,e=b.transformRequest,f=b.data;return b.transformRequest=function(a,c){if(f)if(b.formDataAppender)for(var d in f){var g=f[d];b.formDataAppender(a,d,g)}else for(var d in f){var g=f[d];if("function"==typeof e)g=e(g,c);else for(var h=0;h<e.length;h++){var i=e[h];"function"==typeof i&&(g=i(g,c))}a.append(d,g)}if(null!=b.file){var j=b.fileFormDataName||"file";if("[object Array]"===Object.prototype.toString.call(b.file))for(var k="[object String]"===Object.prototype.toString.call(j),h=0;h<b.file.length;h++)a.append(k?j:j[h],b.file[h],b.fileName&&b.fileName[h]||b.file[h].name);else a.append(j,b.file,b.fileName||b.file.name)}return a},b.data=c,d(b)},this.http=function(a){return d(a)}}]),a.directive("ngFileSelect",["$parse","$timeout",function(a,b){return function(c,d,e){var f=a(e.ngFileSelect);if("input"!==d[0].tagName.toLowerCase()||"file"!==(d.attr("type")&&d.attr("type").toLowerCase())){for(var g=angular.element('<input type="file">'),h=d[0].attributes,i=0;i<h.length;i++)"type"!==h[i].name.toLowerCase()&&g.attr(h[i].name,h[i].value);e.multiple&&g.attr("multiple","true"),g.css("width","1px").css("height","1px").css("opacity",0).css("position","absolute").css("filter","alpha(opacity=0)").css("padding",0).css("margin",0).css("overflow","hidden"),g.attr("__wrapper_for_parent_",!0),d.append(g),d[0].__file_click_fn_delegate_=function(){g[0].click()},d.bind("click",d[0].__file_click_fn_delegate_),d.css("overflow","hidden"),d=g}d.bind("change",function(a){var d,e,g=[];if(d=a.__files_||a.target.files,null!=d)for(e=0;e<d.length;e++)g.push(d.item(e));b(function(){f(c,{$files:g,$event:a})})})}}]),a.directive("ngFileDropAvailable",["$parse","$timeout",function(a,b){return function(c,d,e){if("draggable"in document.createElement("span")){var f=a(e.ngFileDropAvailable);b(function(){f(c)})}}}]),a.directive("ngFileDrop",["$parse","$timeout","$location",function(a,b,c){return function(d,e,f){function g(a){return/^[\000-\177]*$/.test(a)}function h(a,d){var e=[],f=a.dataTransfer.items;if(f&&f.length>0&&f[0].webkitGetAsEntry&&"file"!=c.protocol()&&f[0].webkitGetAsEntry().isDirectory)for(var h=0;h<f.length;h++){var j=f[h].webkitGetAsEntry();null!=j&&(g(j.name)?i(e,j):f[h].webkitGetAsEntry().isDirectory||e.push(f[h].getAsFile()))}else{var k=a.dataTransfer.files;if(null!=k)for(var h=0;h<k.length;h++)e.push(k.item(h))}!function m(a){b(function(){l?m(10):d(e)},a||0)}()}function i(a,b,c){if(null!=b)if(b.isDirectory){var d=b.createReader();l++,d.readEntries(function(d){for(var e=0;e<d.length;e++)i(a,d[e],(c?c:"")+b.name+"/");l--})}else l++,b.file(function(b){l--,b._relativePath=(c?c:"")+b.name,a.push(b)})}if("draggable"in document.createElement("span")){var j=null;e[0].addEventListener("dragover",function(c){if(c.preventDefault(),b.cancel(j),!e[0].__drag_over_class_)if(f.ngFileDragOverClass&&f.ngFileDragOverClass.search(/\) *$/)>-1){var g=a(f.ngFileDragOverClass)(d,{$event:c});e[0].__drag_over_class_=g}else e[0].__drag_over_class_=f.ngFileDragOverClass||"dragover";e.addClass(e[0].__drag_over_class_)},!1),e[0].addEventListener("dragenter",function(a){a.preventDefault()},!1),e[0].addEventListener("dragleave",function(){j=b(function(){e.removeClass(e[0].__drag_over_class_),e[0].__drag_over_class_=null},f.ngFileDragOverDelay||1)},!1);var k=a(f.ngFileDrop);e[0].addEventListener("drop",function(a){a.preventDefault(),e.removeClass(e[0].__drag_over_class_),e[0].__drag_over_class_=null,h(a,function(b){k(d,{$files:b,$event:a})})},!1);var l=0}}}])}();
},{}],"angular.loadingbar":[function(require,module,exports){
/*! 
 * angular-loading-bar v0.6.0
 * https://chieffancypants.github.io/angular-loading-bar
 * Copyright (c) 2014 Wes Cruver
 * License: MIT
 */
!function(){"use strict";angular.module("angular-loading-bar",["cfp.loadingBarInterceptor"]),angular.module("chieffancypants.loadingBar",["cfp.loadingBarInterceptor"]),angular.module("cfp.loadingBarInterceptor",["cfp.loadingBar"]).config(["$httpProvider",function(a){var b=["$q","$cacheFactory","$timeout","$rootScope","cfpLoadingBar",function(b,c,d,e,f){function g(){d.cancel(i),f.complete(),k=0,j=0}function h(b){var d,e=c.get("$http"),f=a.defaults;!b.cache&&!f.cache||b.cache===!1||"GET"!==b.method&&"JSONP"!==b.method||(d=angular.isObject(b.cache)?b.cache:angular.isObject(f.cache)?f.cache:e);var g=void 0!==d?void 0!==d.get(b.url):!1;return void 0!==b.cached&&g!==b.cached?b.cached:(b.cached=g,g)}var i,j=0,k=0,l=f.latencyThreshold;return{request:function(a){return a.ignoreLoadingBar||h(a)||(e.$broadcast("cfpLoadingBar:loading",{url:a.url}),0===j&&(i=d(function(){f.start()},l)),j++,f.set(k/j)),a},response:function(a){return a.config.ignoreLoadingBar||h(a.config)||(k++,e.$broadcast("cfpLoadingBar:loaded",{url:a.config.url}),k>=j?g():f.set(k/j)),a},responseError:function(a){return a.config.ignoreLoadingBar||h(a.config)||(k++,e.$broadcast("cfpLoadingBar:loaded",{url:a.config.url}),k>=j?g():f.set(k/j)),b.reject(a)}}}];a.interceptors.push(b)}]),angular.module("cfp.loadingBar",[]).provider("cfpLoadingBar",function(){this.includeSpinner=!0,this.includeBar=!0,this.latencyThreshold=100,this.startSize=.02,this.parentSelector="body",this.spinnerTemplate='<div id="loading-bar-spinner"><div class="spinner-icon"></div></div>',this.loadingBarTemplate='<div id="loading-bar"><div class="bar"><div class="peg"></div></div></div>',this.$get=["$injector","$document","$timeout","$rootScope",function(a,b,c,d){function e(){k||(k=a.get("$animate"));var e=b.find(n).eq(0);c.cancel(m),r||(d.$broadcast("cfpLoadingBar:started"),r=!0,u&&k.enter(o,e),t&&k.enter(q,e),f(v))}function f(a){if(r){var b=100*a+"%";p.css("width",b),s=a,c.cancel(l),l=c(function(){g()},250)}}function g(){if(!(h()>=1)){var a=0,b=h();a=b>=0&&.25>b?(3*Math.random()+3)/100:b>=.25&&.65>b?3*Math.random()/100:b>=.65&&.9>b?2*Math.random()/100:b>=.9&&.99>b?.005:0;var c=h()+a;f(c)}}function h(){return s}function i(){s=0,r=!1}function j(){k||(k=a.get("$animate")),d.$broadcast("cfpLoadingBar:completed"),f(1),c.cancel(m),m=c(function(){var a=k.leave(o,i);a&&a.then&&a.then(i),k.leave(q)},500)}var k,l,m,n=this.parentSelector,o=angular.element(this.loadingBarTemplate),p=o.find("div").eq(0),q=angular.element(this.spinnerTemplate),r=!1,s=0,t=this.includeSpinner,u=this.includeBar,v=this.startSize;return{start:e,set:f,status:h,inc:g,complete:j,includeSpinner:this.includeSpinner,latencyThreshold:this.latencyThreshold,parentSelector:this.parentSelector,startSize:this.startSize}}]})}();
},{}],"angular.material":[function(require,module,exports){
!function(){angular.module("ngMaterial",["ng","ngAnimate","ngAria","material.core","material.decorators","material.animations","material.components.backdrop","material.components.bottomSheet","material.components.button","material.components.card","material.components.checkbox","material.components.content","material.components.dialog","material.components.divider","material.components.icon","material.components.list","material.components.progressCircular","material.components.progressLinear","material.components.radioButton","material.components.sidenav","material.components.slider","material.components.sticky","material.components.subheader","material.components.swipe","material.components.switch","material.components.tabs","material.components.textField","material.components.toast","material.components.toolbar","material.components.tooltip","material.components.whiteframe","material.services.aria","material.services.attrBind","material.services.compiler","material.services.interimElement","material.services.media","material.services.registry","material.services.theming"])}(),function(){angular.module("material.core",[]).run(function(){if("undefined"==typeof Hammer)throw new Error("ngMaterial requires HammerJS to be preloaded.")})}(),function(){angular.module("material.core").constant("$mdConstant",{KEY_CODE:{ENTER:13,ESCAPE:27,SPACE:32,LEFT_ARROW:37,UP_ARROW:38,RIGHT_ARROW:39,DOWN_ARROW:40}})}(),function(){angular.module("material.core").factory("$mdUtil",["$cacheFactory",function(e){function t(e,t){function n(){return[].concat($)}function i(){return $.length}function r(e){return $.length&&e>-1&&e<$.length}function a(e){return e?r(d(e)+1):!1}function o(e){return e?r(d(e)-1):!1}function c(e){return r(e)?$[e]:null}function l(e,t){return $.filter(function(n){return n[e]===t})}function s(e,t){return e?(angular.isNumber(t)||(t=$.length),$.splice(t,0,e),d(e)):-1}function u(e){m(e)&&$.splice(d(e),1)}function d(e){return $.indexOf(e)}function m(e){return e&&d(e)>-1}function f(e,n){if(n=n||g,m(e)){var i=d(e)+1,a=r(i)?$[i]:t?v():null;return n(a)?a:f(a,n)}return null}function p(e,n){if(n=n||g,m(e)){var i=d(e)-1,a=r(i)?$[i]:t?h():null;return n(a)?a:p(a,n)}return null}function v(){return $.length?$[0]:null}function h(){return $.length?$[$.length-1]:null}var g=function(){return!0};t=!!t;var $=e||[];return{items:n,count:i,inRange:r,contains:m,indexOf:d,itemAt:c,findBy:l,add:s,remove:u,first:v,last:h,next:f,previous:p,hasPrevious:o,hasNext:a}}function n(t,n){var i=e(t,n),r={};return i._put=i.put,i.put=function(e,t){return r[e]=!0,i._put(e,t)},i._remove=i.remove,i.remove=function(e){return delete r[e],i._remove(e)},i.keys=function(){return Object.keys(r)},i}var i,r=/([\:\-\_]+(.))/g,a=["0","0","0"];return i={now:window.performance?angular.bind(window.performance,window.performance.now):Date.now,ancestorHasAttribute:function(e,t,n){n=n||4;for(var i=e;n--&&i.length;){if(i[0].hasAttribute&&i[0].hasAttribute(t))return!0;i=i.parent()}return!1},isParentDisabled:function(e,t){return i.ancestorHasAttribute(e,"disabled",t)},elementIsSibling:function(e,t){return e.parent().length&&e.parent()[0]===t.parent()[0]},camelCase:function(e){return e.replace(r,function(e,t,n,i){return i?n.toUpperCase():n})},stringFromTextBody:function(e,t){var n=e.trim();return n.split(/\s+/).length>t&&(n=e.split(/\s+/).slice(1,t+1).join(" ")+"..."),n},iterator:t,cacheFactory:n,debounce:function(e,t,n){var i;return function(){var r=this,a=arguments;clearTimeout(i),i=setTimeout(function(){i=null,n||e.apply(r,a)},t),n&&!i&&e.apply(r,a)}},throttle:function(e,t){var n;return function(){var r=this,a=arguments,o=i.now();(!n||n-o>t)&&(e.apply(r,a),n=o)}},wrap:function(e,t,n){e.hasOwnProperty(0)&&(e=e[0]);var i=document.createElement(t);return i.className+=n,i.appendChild(e.parentNode.replaceChild(i,e)),angular.element(i)},nextUid:function(){for(var e,t=a.length;t;){if(t--,e=a[t].charCodeAt(0),57==e)return a[t]="A",a.join("");if(90!=e)return a[t]=String.fromCharCode(e+1),a.join("");a[t]="0"}return a.unshift("0"),a.join("")},disconnectScope:function(e){if(e&&e.$root!==e&&!e.$$destroyed){var t=e.$parent;e.$$disconnected=!0,t.$$childHead===e&&(t.$$childHead=e.$$nextSibling),t.$$childTail===e&&(t.$$childTail=e.$$prevSibling),e.$$prevSibling&&(e.$$prevSibling.$$nextSibling=e.$$nextSibling),e.$$nextSibling&&(e.$$nextSibling.$$prevSibling=e.$$prevSibling),e.$$nextSibling=e.$$prevSibling=null}},reconnectScope:function(e){if(e&&e.$root!==e&&e.$$disconnected){var t=e,n=t.$parent;t.$$disconnected=!1,t.$$prevSibling=n.$$childTail,n.$$childHead?(n.$$childTail.$$nextSibling=t,n.$$childTail=t):n.$$childHead=n.$$childTail=t}}}}]),angular.element.prototype.focus=angular.element.prototype.focus||function(){return this.length&&this[0].focus(),this},angular.element.prototype.blur=angular.element.prototype.blur||function(){return this.length&&this[0].blur(),this}}(),function(){angular.module("material.decorators",[]).config(["$provide",function(e){function t(e){return e.debounce=function(t){var n,i,r,a;return function(){n=arguments,a=this,r=t,i||(i=!0,e(function(){r.apply(a,n),i=!1}))}},e}e.decorator("$$rAF",["$delegate","$rootScope",t])}])}(),function(){function e(e,t,n,i){function r(e){return l?"webkit"+e.charAt(0).toUpperCase()+e.substring(1):e}function a(e,n,r){function a(t){t.target===e[0]&&(e.off(c.TRANSITIONEND_EVENT,a),l.resolve())}var l=i.defer();n.append(e);var s;if(r){var u=r[0].getBoundingClientRect();s=o(u.left-e[0].offsetWidth,u.top-e[0].offsetHeight,0)+" scale(0.2)"}else s="translate3d(0,100%,0) scale(0.5)";return e.css(c.TRANSFORM,s).css("opacity",0),t(function(){t(function(){e.addClass("md-active").css(c.TRANSFORM,"").css("opacity","").on(c.TRANSITIONEND_EVENT,a)})}),l.promise}function o(e,t,n){return"translate3d("+Math.floor(e)+"px,"+Math.floor(t)+"px,"+Math.floor(n)+"px)"}var c,l=/webkit/i.test(n.vendorPrefix);return c={popIn:a,TRANSITIONEND_EVENT:"transitionend"+(l?" webkitTransitionEnd":""),ANIMATIONEND_EVENT:"animationend"+(l?" webkitAnimationEnd":""),TRANSFORM:r("transform"),TRANSITION:r("transition"),TRANSITION_DURATION:r("transitionDuration"),ANIMATION_PLAY_STATE:r("animationPlayState"),ANIMATION_DURATION:r("animationDuration"),ANIMATION_NAME:r("animationName"),ANIMATION_TIMING:r("animationTimingFunction"),ANIMATION_DIRECTION:r("animationDirection")}}angular.module("material.animations",["material.core"]).service("$mdEffects",["$rootElement","$$rAF","$sniffer","$q",e])}(),function(){function e(e){return function(t,n,i){"checkbox"==i.inkRipple?e.attachCheckboxBehavior(n):e.attachButtonBehavior(n)}}function t(e,t,n,i){function r(e){return o(e,{mousedown:!0,center:!1,animationDuration:350,mousedownPauseTime:175,animationName:"inkRippleButton",animationTimingFunction:"linear"})}function a(e){return o(e,{mousedown:!0,center:!0,animationDuration:300,mousedownPauseTime:180,animationName:"inkRippleCheckbox",animationTimingFunction:"linear"})}function o(t,r){function a(){return!t[0].hasAttribute("disabled")}function o(i,a,o){var c=angular.element('<div class="md-ripple">').css(n.ANIMATION_DURATION,r.animationDuration+"ms").css(n.ANIMATION_NAME,r.animationName).css(n.ANIMATION_TIMING,r.animationTimingFunction).on(n.ANIMATIONEND_EVENT,function(){c.remove()});s||(s=angular.element('<div class="md-ripple-container">'),t.append(s)),s.append(c);var d=s.prop("offsetWidth");if(r.center)i=d/2,a=s.prop("offsetHeight")/2;else if(o){var m=u.getBoundingClientRect();i-=m.left,a-=m.top}l&&(a+=l.$element.prop("scrollTop"));var f={"background-color":e.getComputedStyle(c[0]).color||e.getComputedStyle(u).color,"border-radius":d/2+"px",left:i-d/2+"px",width:d+"px",top:a-d/2+"px",height:d+"px"};return f[n.ANIMATION_DURATION]=r.fadeoutDuration+"ms",c.css(f),c}function c(e){e.eventType===Hammer.INPUT_START&&e.isFirst&&a()?(f=o(e.center.x,e.center.y,!0),m=i(function(){f&&f.css(n.ANIMATION_PLAY_STATE,"paused")},r.mousedownPauseTime,!1),f.on("$destroy",function(){f=null})):e.eventType===Hammer.INPUT_END&&e.isFinal&&(i.cancel(m),f&&f.css(n.ANIMATION_PLAY_STATE,""))}if(t.controller("noink"))return angular.noop;var l=t.controller("mdContent");r=angular.extend({mousedown:!0,hover:!0,focus:!0,center:!1,animationDuration:300,mousedownPauseTime:150,animationName:"",animationTimingFunction:"linear"},r||{});var s,u=t[0],d=new Hammer(u);return r.mousedown&&d.on("hammer.input",c),function(){d.destroy(),s&&s.remove()};var m,f}return{attachButtonBehavior:r,attachCheckboxBehavior:a,attach:o}}angular.module("material.animations").directive("inkRipple",["$mdInkRipple",e]).factory("$mdInkRipple",["$window","$$rAF","$mdEffects","$timeout","$mdUtil",t])}(),function(){function e(){return function(){return{controller:angular.noop}}}angular.module("material.animations").directive({noink:e(),nobar:e(),nostretch:e()})}(),function(){function e(e){return e}angular.module("material.components.backdrop",["material.services.theming"]).directive("mdBackdrop",["$mdTheming",e])}(),function(){function e(){return{restrict:"E"}}function t(e,t,n,i,r,a,o){function c(e,n,r){u=a('<md-backdrop class="md-opaque ng-enter">')(e),u.on("click touchstart",function(){i(d.cancel)}),o.inherit(u,r.parent),t.enter(u,r.parent,null);var c=new s(n);return r.bottomSheet=c,r.targetEvent&&angular.element(r.targetEvent.target).blur(),o.inherit(c.element,r.parent),t.enter(c.element,r.parent)}function l(e,n,i){var r=i.bottomSheet;return t.leave(u),t.leave(r.element).then(function(){r.cleanup(),i.targetEvent&&angular.element(i.targetEvent.target).focus()})}function s(e){function t(t){t.preventDefault(),p=t.target,s=o(t),f=e.css(n.TRANSITION_DURATION),e.css(n.TRANSITION_DURATION,"0s")}function r(t){e.css(n.TRANSITION_DURATION,f);var r=o(t);Math.abs(r-s)<5&&t.target==p?angular.element(t.target).triggerHandler("click"):m>g?i(d.cancel):c(void 0)}function a(e){var t=o(e),n=t-s;m=t-u,u=t,n=l(n),c(n+v)}function o(e){var t=e.touches&&e.touches.length?e.touches[0]:e.changedTouches[0];return t.clientY}function c(t){null===t||void 0===t?e.css(n.TRANSFORM,""):e.css(n.TRANSFORM,"translate3d(0, "+t+"px, 0)")}function l(e){if(0>e&&-v+h>e){e=-e;var t=v-h;e=Math.max(-v,-Math.min(v-5,t+h*(e-t)/v)-e/50)}return e}var s,u,m,f,p,v=80,h=20,g=10;return e=e.eq(0),e.on("touchstart",t),e.on("touchmove",a),e.on("touchend",r),{element:e,cleanup:function(){e.off("touchstart",t),e.off("touchmove",a),e.off("touchend",r)}}}var u,d;return d=e({themable:!0,targetEvent:null,onShow:c,onRemove:l})}angular.module("material.components.bottomSheet",["material.components.backdrop","material.services.interimElement","material.services.theming"]).directive("mdBottomSheet",[e]).factory("$mdBottomSheet",["$$interimElement","$animate","$mdEffects","$timeout","$$rAF","$compile","$mdTheming",t])}(),function(){function e(e,t,n,i,r){e[0];return{restrict:"E",compile:function(e,a){var o,c;return a.ngHref||a.href?(o=angular.element("<a>"),c=["ng-href","href","rel","target"]):(o=angular.element("<button>"),c=["type","disabled","ng-disabled","form"]),angular.forEach(c,function(e){var t=i.camelCase(e);a.hasOwnProperty(t)&&o.attr(e,a[t])}),o.addClass("md-button-inner").append(e.contents()).on("focus",function(){e.addClass("focus")}).on("blur",function(){e.removeClass("focus")}),e.append(o).attr("tabIndex",-1).on("focus",function(){o.focus()}),function(e,i){r(i),n.expect(i,"aria-label",i.text()),t.attachButtonBehavior(i)}}}}angular.module("material.components.button",["material.core","material.animations","material.services.aria","material.services.theming"]).directive("mdButton",["ngHrefDirective","$mdInkRipple","$mdAria","$mdUtil","$mdTheming",e])}(),function(){function e(){return{restrict:"E",link:function(){}}}angular.module("material.components.card",[]).directive("mdCard",[e])}(),function(){function e(e,t,n,i,r){function a(e,t){return t.type="checkbox",t.tabIndex=0,e.attr("role",t.type),function(t,a,l,s){function u(e){e.which===i.KEY_CODE.SPACE&&(e.preventDefault(),d(e))}function d(e){a[0].hasAttribute("disabled")||t.$apply(function(){f=!f,s.$setViewValue(f,e&&e.type),s.$render()})}function m(){f=s.$viewValue,f?a.addClass(c):a.removeClass(c)}var f=!1;r(a),s=s||{$setViewValue:function(e){this.$viewValue=e},$parsers:[],$formatters:[]},n.expect(e,"aria-label",!0),o.link.pre(t,{on:angular.noop,0:{}},l,[s]),a.on("click",d),a.on("keypress",u),s.$render=m}}var o=e[0],c="md-checked";return{restrict:"E",transclude:!0,require:"?ngModel",template:'<div class="md-container" ink-ripple="checkbox"><div class="md-icon"></div></div><div ng-transclude class="md-label"></div>',compile:a}}angular.module("material.components.checkbox",["material.core","material.animations","material.services.theming","material.services.aria"]).directive("mdCheckbox",["inputDirective","$mdInkRipple","$mdAria","$mdConstant","$mdTheming",e])}(),function(){function e(e){function t(e,t){this.$scope=e,this.$element=t}return{restrict:"E",controller:["$scope","$element",t],link:function(t,n){e(n),t.$broadcast("$mdContentLoaded",n)}}}angular.module("material.components.content",["material.services.theming","material.services.registry"]).directive("mdContent",["$mdTheming",e])}(),function(){function e(e,t){return{restrict:"E",link:function(n,i){t(i),e(function(){var e=i[0].querySelector("md-content");e&&e.scrollHeight>e.clientHeight&&i.addClass("md-content-overflow")})}}}function t(e,t,n,i,r,a,o,c,l,s){function u(a,o,c){function u(){var e=o[0].querySelector(".dialog-close");if(!e){var t=o[0].querySelectorAll(".md-actions button");e=t[t.length-1]}return angular.element(e)}c.parent=angular.element(c.parent),c.popInTarget=angular.element((c.targetEvent||{}).target);var d=u();return m(o.find("md-dialog")),c.hasBackdrop&&(c.backdrop=n('<md-backdrop class="md-opaque ng-enter">')(a),s.inherit(c.backdrop,c.parent),r.enter(c.backdrop,c.parent,null)),i.popIn(o,c.parent,c.popInTarget.length&&c.popInTarget).then(function(){c.escapeToClose&&(c.rootElementKeyupCallback=function(t){t.keyCode===l.KEY_CODE.ESCAPE&&e(f.cancel)},t.on("keyup",c.rootElementKeyupCallback)),c.clickOutsideToClose&&(c.dialogClickOutsideCallback=function(t){t.target===o[0]&&e(f.cancel)},o.on("click",c.dialogClickOutsideCallback)),d.focus()})}function d(e,n,i){return i.backdrop&&(r.leave(i.backdrop),n.data("backdrop",void 0)),i.escapeToClose&&t.off("keyup",i.rootElementKeyupCallback),i.clickOutsideToClose&&n.off("click",i.dialogClickOutsideCallback),r.leave(n).then(function(){n.remove(),i.popInTarget&&i.popInTarget.focus()})}function m(e){e.attr({role:"dialog"});var t=e.find("md-content");0===t.length&&(t=e);var n=c.stringFromTextBody(t.text(),3);a.expect(e,"aria-label",!0,n)}var f;return f=o({hasBackdrop:!0,isolateScope:!0,onShow:u,onRemove:d,clickOutsideToClose:!0,escapeToClose:!0,targetEvent:null,transformTemplate:function(e){return'<div class="md-dialog-container">'+e+"</div>"}})}angular.module("material.components.dialog",["material.core","material.animations","material.components.backdrop","material.services.compiler","material.services.aria","material.services.interimElement","material.services.theming"]).directive("mdDialog",["$$rAF","$mdTheming",e]).factory("$mdDialog",["$timeout","$rootElement","$compile","$mdEffects","$animate","$mdAria","$$interimElement","$mdUtil","$mdConstant","$mdTheming",t])}(),function(){function e(){}function t(t){return{restrict:"E",link:t,controller:[e]}}angular.module("material.components.divider",["material.animations","material.services.aria","material.services.theming"]).directive("mdDivider",["$mdTheming",t])}(),function(){function e(){return{restrict:"E",template:'<object class="md-icon"></object>',compile:function(e,t){var n=angular.element(e[0].children[0]);angular.isDefined(t.icon)&&n.attr("data",t.icon)}}}angular.module("material.components.icon",[]).directive("mdIcon",[e])}(),function(){function e(){return{restrict:"E",link:function(e,t){t.attr({role:"list"})}}}function t(){return{restrict:"E",link:function(e,t){t.attr({role:"listitem"})}}}angular.module("material.components.list",[]).directive("mdList",[e]).directive("mdItem",[t])}(),function(){function e(e,t,n){function i(e){return e.attr("aria-valuemin",0),e.attr("aria-valuemax",100),e.attr("role","progressbar"),r}function r(e,i,r){n(i);var l,s,u,d,m=i[0],f=m.querySelectorAll(".md-fill, .md-mask.md-full"),p=m.querySelectorAll(".md-fill.md-fix"),v=r.diameter||48,h=v/48;m.style[t.TRANSFORM]="scale("+h.toString()+")",r.$observe("value",function(e){for(s=a(e),u=o[s],d=c[s],i.attr("aria-valuenow",s),l=0;l<f.length;l++)f[l].style[t.TRANSFORM]=u;for(l=0;l<p.length;l++)p[l].style[t.TRANSFORM]=d})}function a(e){return e>100?100:0>e?0:Math.ceil(e||0)}for(var o=new Array(101),c=new Array(101),l=0;101>l;l++){var s=l/100,u=Math.floor(180*s);o[l]="rotate("+u.toString()+"deg)",c[l]="rotate("+(2*u).toString()+"deg)"}return{restrict:"E",template:'<div class="md-wrapper1"><div class="md-wrapper2"><div class="md-circle"><div class="md-mask md-full"><div class="md-fill"></div></div><div class="md-mask md-half"><div class="md-fill"></div><div class="md-fill md-fix"></div></div><div class="md-shadow"></div></div><div class="md-inset"></div></div></div>',compile:i}}angular.module("material.components.progressCircular",["material.animations","material.services.aria","material.services.theming"]).directive("mdProgressCircular",["$$rAF","$mdEffects","$mdTheming",e])}(),function(){function e(e,n,i){function r(e){return e.attr("aria-valuemin",0),e.attr("aria-valuemax",100),e.attr("role","progressbar"),a}function a(r,a,c){i(a);var l=a[0].querySelector(".md-bar1").style,s=a[0].querySelector(".md-bar2").style,u=angular.element(a[0].querySelector(".md-container"));c.$observe("value",function(e){if("query"!=c.mode){var i=o(e);a.attr("aria-valuenow",i),s[n.TRANSFORM]=t[i]}}),c.$observe("secondaryvalue",function(e){l[n.TRANSFORM]=t[o(e)]}),e(function(){u.addClass("md-ready")})}function o(e){return e>100?100:0>e?0:Math.ceil(e||0)}return{restrict:"E",template:'<div class="md-container"><div class="md-dashed"></div><div class="md-bar md-bar1"></div><div class="md-bar md-bar2"></div></div>',compile:r}}angular.module("material.components.progressLinear",["material.animations","material.services.theming","material.services.aria"]).directive("mdProgressLinear",["$$rAF","$mdEffects","$mdTheming",e]);var t=function(){function e(e){var t=e/100,n=(e-100)/2;return"translateX("+n.toString()+"%) scale("+t.toString()+", 1)"}for(var t=new Array(101),n=0;101>n;n++)t[n]=e(n);return t}()}(),function(){function e(e,t,n){function i(e,i,r,a){function o(e){e.which===t.KEY_CODE.LEFT_ARROW?(e.preventDefault(),c.selectPrevious()):e.which===t.KEY_CODE.RIGHT_ARROW&&(e.preventDefault(),c.selectNext())}n(i);var c=a[0],l=a[1]||{$setViewValue:angular.noop};c.init(l),i.attr({role:"radiogroup",tabIndex:"0"}).on("keydown",o)}function r(e){this._radioButtonRenderFns=[],this.$element=e}function a(){return{init:function(e){this._ngModelCtrl=e,this._ngModelCtrl.$render=angular.bind(this,this.render)},add:function(e){this._radioButtonRenderFns.push(e)},remove:function(e){var t=this._radioButtonRenderFns.indexOf(e);-1!==t&&this._radioButtonRenderFns.splice(t,1)},render:function(){this._radioButtonRenderFns.forEach(function(e){e()})},setViewValue:function(e,t){this._ngModelCtrl.$setViewValue(e,t),this.render()},getViewValue:function(){return this._ngModelCtrl.$viewValue},selectNext:function(){return o(this.$element,1)},selectPrevious:function(){return o(this.$element,-1)},setActiveDescendant:function(e){this.$element.attr("aria-activedescendant",e)}}}function o(t,n){var i=e.iterator(Array.prototype.slice.call(t[0].querySelectorAll("md-radio-button")),!0);if(i.count()){var r=t[0].querySelector("md-radio-button.md-checked"),a=i[0>n?"previous":"next"](r)||i.first();angular.element(a).triggerHandler("click")}}return r.prototype=a(),{restrict:"E",controller:["$element",r],require:["mdRadioGroup","?ngModel"],link:i}}function t(e,t,n){function i(i,a,o,c){function l(e){a[0].hasAttribute("disabled")||i.$apply(function(){c.setViewValue(o.value,e&&e.type)})}function s(){var e=c.getViewValue()===o.value;e!==d&&(d=e,a.attr("aria-checked",e),e?(a.addClass(r),c.setActiveDescendant(a.attr("id"))):a.removeClass(r))}function u(n,i){function r(){return o.id||"radio_"+t.nextUid()}i.ariaId=r(),n.attr({id:i.ariaId,role:"radio","aria-checked":"false"}),e.expect(n,"aria-label",!0)}var d;n(a),u(a,i),c.add(s),o.$observe("value",s),a.on("click",l).on("$destroy",function(){c.remove(s)})}var r="md-checked";return{restrict:"E",require:"^mdRadioGroup",transclude:!0,template:'<div class="md-container" ink-ripple="checkbox"><div class="md-off"></div><div class="md-on"></div></div><div ng-transclude class="md-label"></div>',link:i}}angular.module("material.components.radioButton",["material.core","material.animations","material.services.aria","material.services.theming"]).directive("mdRadioGroup",["$mdUtil","$mdConstant","$mdTheming",e]).directive("mdRadioButton",["$mdAria","$mdUtil","$mdTheming",t])}(),function(){function e(e,t,n,i,r,a){a.register(this,n.componentId),this.isOpen=function(){return!!e.isOpen},this.toggle=function(){e.isOpen=!e.isOpen},this.open=function(){e.isOpen=!0},this.close=function(){e.isOpen=!1}}function t(e){return function(t){var n=e.get(t);return n||e.notFoundError(t),{isOpen:function(){return n&&n.isOpen()},toggle:function(){n&&n.toggle()},open:function(){n&&n.open()},close:function(){n&&n.close()}}}}function n(e,t,n,i,r,a,o){function c(c,l,s,u){function d(e){var n=l.parent();n[e?"on":"off"]("keydown",m),t[e?"enter":"leave"](v,n),v[e?"on":"off"]("click",f),t[e?"removeClass":"addClass"](l,"md-closed").then(function(){c.isOpen&&l.focus()})}function m(e){e.which===r.KEY_CODE.ESCAPE&&(f(),e.preventDefault(),e.stopPropagation())}function f(){e(function(){u.close()})}var p=n(s.isLockedOpen),v=a('<md-backdrop class="md-sidenav-backdrop md-opaque">')(c);o.inherit(v,l),c.$watch("isOpen",d),c.$watch(function(){return p(c.$parent,{$media:i})},function(e){l.toggleClass("md-locked-open",!!e),v.toggleClass("md-locked-open",!!e)})}return{restrict:"E",scope:{isOpen:"=?"},controller:"$mdSidenavController",compile:function(e){return e.addClass("md-closed"),e.attr("tabIndex","-1"),c}}}angular.module("material.components.sidenav",["material.core","material.services.registry","material.services.media","material.components.backdrop","material.services.theming","material.animations"]).factory("$mdSidenav",["$mdComponentRegistry",t]).directive("mdSidenav",["$timeout","$animate","$parse","$mdMedia","$mdConstant","$compile","$mdTheming",n]).controller("$mdSidenavController",["$scope","$element","$attrs","$timeout","$mdSidenav","$mdComponentRegistry",e])}(),function(){function e(e){function n(t,n,i,r){e(n);var a=r[0]||{$setViewValue:function(e){this.$viewValue=e,this.$viewChangeListeners.forEach(function(e){e()})},$parsers:[],$formatters:[],$viewChangeListeners:[]},o=r[1];o.init(a)}return{scope:{},require:["?ngModel","mdSlider"],controller:["$scope","$element","$attrs","$$rAF","$window","$mdEffects","$mdAria","$mdUtil","$mdConstant",t],template:'<div class="md-track-container"><div class="md-track"></div><div class="md-track md-track-fill"></div><div class="md-track-ticks"></div></div><div class="md-thumb-container"><div class="md-thumb"></div><div class="md-focus-thumb"></div><div class="md-focus-ring"></div><div class="md-sign"><span class="md-thumb-text" ng-bind="modelValue"></span></div><div class="md-disabled-thumb"></div></div>',link:n}}function t(e,t,n,i,r,a,o,c,l){this.init=function(s){function u(){h(),T(),v()}function d(e){U=parseFloat(e),t.attr("aria-valuemin",e)}function m(e){L=parseFloat(e),t.attr("aria-valuemax",e)}function f(e){W=parseFloat(e),v()}function p(e){t.attr("aria-disabled",!!e)}function v(){if(angular.isDefined(n.discrete)){var e=Math.floor((L-U)/W);Y||(Y=angular.element('<canvas style="position:absolute;">'),K=Y[0].getContext("2d"),K.fillStyle="black",P.append(Y));var t=g();Y[0].width=t.width,Y[0].height=t.height;for(var i,r=0;e>=r;r++)i=Math.floor(t.width*(r/e)),K.fillRect(i-1,0,2,t.height)}}function h(){z=_[0].getBoundingClientRect()}function g(){return H(),z}function $(n){if(!t[0].hasAttribute("disabled")){var i;n.which===l.KEY_CODE.LEFT_ARROW?i=-W:n.which===l.KEY_CODE.RIGHT_ARROW&&(i=W),i&&((n.metaKey||n.ctrlKey||n.altKey)&&(i*=4),n.preventDefault(),n.stopPropagation(),e.$evalAsync(function(){b(s.$viewValue+i)}))}}function b(e){s.$setViewValue(w(y(e)))}function T(){isNaN(s.$viewValue)&&(s.$viewValue=s.$modelValue);var n=(s.$viewValue-U)/(L-U);e.modelValue=s.$viewValue,t.attr("aria-valuenow",s.$viewValue),k(n)}function w(e){return angular.isNumber(e)?Math.max(U,Math.min(L,e)):void 0}function y(e){return angular.isNumber(e)?Math.round(e/W)*W:void 0}function k(e){F.css("width",100*e+"%"),M.css(a.TRANSFORM,"translate3d("+g().width*e+"px,0,0)"),t.toggleClass("md-min",0===e)}function A(e){G||e.eventType!==Hammer.INPUT_START||t[0].hasAttribute("disabled")?G&&e.eventType===Hammer.INPUT_END&&(G&&j&&S(e),G=!1,t.removeClass("panning active")):(G=!0,t.addClass("active"),t[0].focus(),h(),C(e),e.srcEvent.stopPropagation())}function x(){G&&t.addClass("panning")}function C(e){G&&(j?R(e.center.x):E(e.center.x),e.preventDefault(),e.srcEvent.stopPropagation())}function S(e){if(j&&!t[0].hasAttribute("disabled")){var n=I(N(e.center.x)),r=w(y(n));k(O(r)),i(function(){b(r)}),e.preventDefault(),e.srcEvent.stopPropagation()}}function E(t){e.$evalAsync(function(){b(I(N(t)))})}function R(e){k(N(e))}function N(e){return Math.max(0,Math.min(1,(e-z.left)/z.width))}function I(e){return U+e*(L-U)}function O(e){return(e-U)/(L-U)}var D=angular.element(t[0].querySelector(".md-thumb")),M=D.parent(),_=angular.element(t[0].querySelector(".md-track-container")),F=angular.element(t[0].querySelector(".md-track-fill")),P=angular.element(t[0].querySelector(".md-track-ticks")),H=c.throttle(h,5e3);n.min?n.$observe("min",d):d(0),n.max?n.$observe("max",m):m(100),n.step?n.$observe("step",f):f(1);var V=angular.noop;n.ngDisabled?V=e.$parent.$watch(n.ngDisabled,p):p(!!n.disabled),o.expect(t,"aria-label",!1),t.attr("tabIndex",0),t.attr("role","slider"),t.on("keydown",$);var q=new Hammer(t[0],{recognizers:[[Hammer.Pan,{direction:Hammer.DIRECTION_HORIZONTAL}]]});q.on("hammer.input",A),q.on("panstart",x),q.on("pan",C),q.on("panend",S),setTimeout(u);var B=i.debounce(u);angular.element(r).on("resize",B),e.$on("$destroy",function(){angular.element(r).off("resize",B),q.destroy(),V()}),s.$render=T,s.$viewChangeListeners.push(T),s.$formatters.push(w),s.$formatters.push(y);var U,L,W,Y,K,z={};h();var G=!1,j=angular.isDefined(n.discrete);this._onInput=A,this._onPanStart=x,this._onPan=C}}angular.module("material.components.slider",["material.core","material.animations","material.services.aria","material.services.theming"]).directive("mdSlider",["$mdTheming",e])}(),function(){function e(e,t,n,i,r){function a(e){function n(e,t){t.addClass("md-sticky-clone");var n={element:e,clone:t};return f.items.push(n),d.parent().prepend(n.clone),m(),function(){f.items.forEach(function(t,n){t.element[0]===e[0]&&(f.items.splice(n,1),t.clone.remove())}),m()}}function r(){d[0].getBoundingClientRect();f.items.forEach(a),f.items=f.items.sort(function(e,t){return e.top<t.top?-1:1});for(var e,t=d.prop("scrollTop"),n=f.items.length-1;n>=0;n--)if(t>f.items[n].top){e=f.items[n];break}l(e)}function a(e){var t=e.element[0];for(e.top=0,e.left=0;t&&t!==d[0];)e.top+=t.offsetTop,e.left+=t.offsetLeft,t=t.offsetParent;e.height=e.element.prop("offsetHeight"),e.clone.css("margin-left",e.left+"px")}function o(){var e=d.prop("scrollTop"),t=e>(o.prevScrollTop||0);o.prevScrollTop=e,0===e?l(null):t&&f.next?f.next.top-e<=0?l(f.next):f.current&&(f.next.top-e<=f.next.height?u(f.current,f.next.top-f.next.height-e):u(f.current,null)):!t&&f.current&&(e<f.current.top&&l(f.prev),f.current&&f.next&&(e>=f.next.top-f.current.height?u(f.current,f.next.top-e-f.current.height):u(f.current,null)))}function l(e){if(f.current!==e){f.current&&(u(f.current,null),s(f.current,null)),e&&s(e,"active"),f.current=e;var t=f.items.indexOf(e);f.next=f.items[t+1],f.prev=f.items[t-1],s(f.next,"next"),s(f.prev,"prev")}}function s(e,t){e&&e.state!==t&&(e.state&&(e.clone.attr("sticky-prev-state",e.state),e.element.attr("sticky-prev-state",e.state)),e.clone.attr("sticky-state",t),e.element.attr("sticky-state",t),e.state=t)}function u(e,n){e&&(null===n||void 0===n?e.translateY&&(e.translateY=null,e.clone.css(t.TRANSFORM,"")):(e.translateY=n,e.clone.css(t.TRANSFORM,"translate3d("+e.left+"px,"+n+"px,0)")))}var d=e.$element,m=i.debounce(r);c(d),d.on("$scrollstart",m),d.on("$scroll",o);var f;return f={prev:null,current:null,next:null,items:[],add:n,refreshElements:r}}function o(){var t,n=angular.element("<div>");e[0].body.appendChild(n[0]);for(var i=["sticky","-webkit-sticky"],r=0;r<i.length;++r)if(n.css({position:i[r],top:0,"z-index":2}),n.css("position")==i[r]){t=i[r];break}return n.remove(),t}function c(e){function t(){+r.now()-a>o?(n=!1,e.triggerHandler("$scrollend")):(e.triggerHandler("$scroll"),i(t))}var n,a,o=200;e.on("scroll touchmove",function(){n||(n=!0,i(t),e.triggerHandler("$scrollstart")),e.triggerHandler("$scroll"),a=+r.now()})}var l=o();return function(e,t,n){var i=t.controller("mdContent");if(i)if(l)t.css({position:l,top:0,"z-index":2});else{var r=i.$element.data("$$sticky");r||(r=a(i),i.$element.data("$$sticky",r));var o=r.add(t,n||t.clone());e.$on("$destroy",o)}}}angular.module("material.components.sticky",["material.core","material.components.content","material.decorators","material.animations"]).factory("$mdSticky",["$document","$mdEffects","$compile","$$rAF","$mdUtil",e])}(),function(){function e(e,t,n){return{restrict:"E",replace:!0,transclude:!0,template:'<h2 class="md-subheader"><span class="md-subheader-content"></span></h2>',compile:function(i,r,a){var o=i[0].outerHTML;return function(i,r){function c(e){return angular.element(e[0].querySelector(".md-subheader-content"))}n(r),a(i,function(e){c(r).append(e)}),a(i,function(a){var l=t(angular.element(o))(i);n(l),c(l).append(a),e(i,r,l)})}}}}angular.module("material.components.subheader",["material.components.sticky","material.services.theming"]).directive("mdSubheader",["$mdSticky","$compile","$mdTheming",e])}(),function(){!function(){function e(e,t,n){return function(i,r,a){var o=n.toLowerCase(),c="md"+n,l=e(a[c])||angular.noop,s=t(i,o),u=function(e){l(i,e)};s(r,function(e){e.type==o&&u()})}}angular.module("material.components.swipe",["ng"]).factory("$mdSwipe",function(){return function(e,t){return t||(t="swipeleft swiperight"),function(n,i,r){function a(t){t.srcEvent.stopPropagation(),angular.isFunction(i)&&e.$apply(function(){i(t)})}function o(){return l.on(t,a),function(){l.off(t)}}function c(e,t){var n=t.indexOf("pan")>-1,i=t.indexOf("swipe")>-1;return n&&e.push([Hammer.Pan,{direction:Hammer.DIRECTION_HORIZONTAL}]),i&&e.push([Hammer.Swipe,{direction:Hammer.DIRECTION_HORIZONTAL}]),e}var l=new Hammer(n[0],{recognizers:c([],t)});return r||o(),e.$on("$destroy",function(){l.destroy()}),o}}}).directive("mdSwipeLeft",["$parse","$mdSwipe",function(t,n){return{restrict:"A",link:e(t,n,"SwipeLeft")}}]).directive("mdSwipeRight",["$parse","$mdSwipe",function(t,n){return{restrict:"A",link:e(t,n,"SwipeRight")}}])}()}(),function(){function e(e,t,n){function i(e,t){var i=angular.element(e[0].querySelector(".md-switch-thumb"));i.attr("disabled",t.disabled),i.attr("ngDisabled",t.ngDisabled);var a=r.compile(i,t);return function(e,t,i,r){n(t);var o=angular.element(t[0].querySelector(".md-switch-thumb"));return a(e,o,i,r)}}var r=e[0],a=t[0];return{restrict:"E",transclude:!0,template:'<div class="md-switch-bar"></div><div class="md-switch-thumb">'+a.template+"</div>",require:"?ngModel",compile:i}}angular.module("material.components.switch",["material.components.checkbox","material.components.radioButton","material.services.theming"]).directive("mdSwitch",["mdCheckboxDirective","mdRadioButtonDirective","$mdTheming",e])}(),function(){angular.module("material.components.tabs",["material.core","material.animations","material.components.swipe","material.services.theming"])
}(),function(){function e(e,t){return{restrict:"E",replace:!0,scope:{fid:"@?",label:"@?",value:"=ngModel"},compile:function(n,i){return angular.isUndefined(i.fid)&&(i.fid=t.nextUid()),{pre:function(e,t,n){angular.isDefined(n.disabled)&&(t.attr("disabled",!0),e.isDisabled=!0),e.inputType=n.type||"text",t.removeAttr("type"),t.attr("class",n.class)},post:e}},template:'<md-input-group ng-disabled="isDisabled" tabindex="-1"> <label for="{{fid}}" >{{label}}</label> <md-input id="{{fid}}" ng-model="value" type="{{inputType}}"></md-input></md-input-group>'}}function t(){return{restrict:"CE",controller:["$element",function(e){this.setFocused=function(t){e.toggleClass("md-input-focused",!!t)},this.setHasValue=function(t){e.toggleClass("md-input-has-value",t)}}]}}function n(e){return{restrict:"E",replace:!0,template:"<input >",require:["^?mdInputGroup","?ngModel"],link:function(t,n,i,r){function a(e){return e=angular.isUndefined(e)?n.val():e,angular.isDefined(e)&&null!==e&&""!=e.toString().trim()}var o=r[0],c=r[1];if(o){var l=e.isParentDisabled(n);n.attr("tabindex",l?-1:0),n.attr("aria-disabled",l?"true":"false"),n.attr("type",i.type||n.parent().attr("type")||"text"),c&&c.$formatters.push(function(e){return o.setHasValue(a(e)),e}),n.on("input",function(){o.setHasValue(a())}),n.on("focus",function(){o.setFocused(!0)}),n.on("blur",function(){o.setFocused(!1),o.setHasValue(a())}),t.$on("$destroy",function(){o.setFocused(!1),o.setHasValue(!1)})}}}}angular.module("material.components.textField",["material.core","material.services.theming"]).directive("mdInputGroup",[t]).directive("mdInput",["$mdUtil",n]).directive("mdTextFloat",["$mdTheming","$mdUtil",e])}(),function(){function e(){return{restrict:"E"}}function t(e,t,n,i){function r(t,r,a){r.addClass(a.position.split(" ").map(function(e){return"md-"+e}).join(" ")),a.parent.addClass(o(a.position));var c=i(t,"swipeleft swiperight");return a.detachSwipe=c(r,function(t){r.addClass("md-"+t.type),e(l.hide)}),n.enter(r,a.parent)}function a(e,t,i){return i.detachSwipe(),i.parent.removeClass(o(i.position)),n.leave(t)}function o(e){return"md-toast-open-"+(e.indexOf("top")>-1?"top":"bottom")}var c={onShow:r,onRemove:a,position:"bottom left",themable:!0,hideDelay:3e3},l=t(c);return l}angular.module("material.components.toast",["material.services.interimElement","material.components.swipe"]).directive("mdToast",[e]).factory("$mdToast",["$timeout","$$interimElement","$animate","$mdSwipe",t])}(),function(){function e(e,t,n,i){return{restrict:"E",controller:angular.noop,link:function(r,a,o){function c(){function i(t,i){n.elementIsSibling(a,i)&&(u&&u.off("scroll",p),i.on("scroll",p),i.attr("scroll-shrink","true"),u=i,e(c))}function c(){s=a.prop("offsetHeight"),u.css("margin-top",-s*f+"px"),l()}function l(e){var n=e?e.target.scrollTop:m;v(),d=Math.min(s/f,Math.max(0,d+n-m)),a.css(t.TRANSFORM,"translate3d(0,"+-d*f+"px,0)"),u.css(t.TRANSFORM,"translate3d(0,"+(s-d)*f+"px,0)"),m=n}var s,u,d=0,m=0,f=o.shrinkSpeedFactor||.5,p=e.debounce(l),v=n.debounce(c,5e3);r.$on("$mdContentLoaded",i)}i(a),angular.isDefined(o.scrollShrink)&&c()}}}angular.module("material.components.toolbar",["material.core","material.components.content","material.services.theming","material.animations"]).directive("mdToolbar",["$$rAF","$mdEffects","$mdUtil","$mdTheming",e])}(),function(){function e(e,t,n,i,r,a){function o(o,u,d,m){function f(){o.visible&&g()}function p(t){p.value=!!t,p.queued||(t?(p.queued=!0,e(function(){o.visible=p.value,p.queued=!1},c)):e(function(){o.visible=!1}))}function v(){u.removeClass("md-hide"),$.attr("aria-describedby",u.attr("id")),s.append(u),n(function(){n(function(){g(),o.visible&&u.addClass("md-show")})})}function h(){u.removeClass("md-show").addClass("md-hide"),$.removeAttr("aria-describedby"),e(function(){o.visible||u.detach()},200,!1)}function g(){var e=u[0].getBoundingClientRect(),n=$[0].getBoundingClientRect();m&&(n.top+=m.$element.prop("scrollTop"),n.left+=m.$element.prop("scrollLeft"));var i="bottom",r={left:n.left+n.width/2-e.width/2,top:n.top+n.height};r.left=Math.min(r.left,t.innerWidth-e.width-l),r.left=Math.max(r.left,l),r.top+e.height>t.innerHeight&&(r.top=n.top-e.height,i="top"),u.css({top:r.top+"px",left:r.left+"px"}),u.attr("width-32",Math.ceil(e.width/32)),u.attr("md-direction",i)}a(u);var $=u.parent();u.detach(),u.attr("role","tooltip"),u.attr("id",d.id||"tooltip_"+r.nextUid()),$.on("focus mouseenter touchstart",function(){p(!0)}),$.on("blur mouseleave touchend touchcancel",function(){i.activeElement!==$[0]&&p(!1)}),o.$watch("visible",function(e){e?v():h()});var b=n.debounce(f);angular.element(t).on("resize",b),o.$on("$destroy",function(){o.visible=!1,u.remove(),angular.element(t).off("resize",b)})}var c=400,l=8,s=angular.element(document.body);return{restrict:"E",transclude:!0,require:"^?mdContent",template:'<div class="md-background"></div><div class="md-content" ng-transclude></div>',scope:{visible:"=?"},link:o}}angular.module("material.components.tooltip",["material.core","material.services.theming"]).directive("mdTooltip",["$timeout","$window","$$rAF","$document","$mdUtil","$mdTheming",e])}(),function(){angular.module("material.components.whiteframe",[])}(),function(){function e(e,t){function n(n,r,a,o){e(function(){var e=n[0];if(!e.hasAttribute(r)){var c;a===!0&&(o||(o=n.text().trim()),c=angular.isDefined(o)&&o.length),c?(o=String(o).trim(),n.attr(r,o)):(t.warn(i,r,e),t.warn(e))}})}var i='ARIA: Attribute "%s", required for accessibility, is missing on "%s"';return{expect:n}}angular.module("material.services.aria",[]).service("$mdAria",["$$rAF","$log",e])}(),function(){function e(e,t){var n=/^\s*([@=&])(\??)\s*(\w*)\s*$/;return function(i,r,a,o){function c(e,t,n){if(!angular.isDefined(r[e])){var a=o&&o.hasOwnProperty(t);return i[t]=a?o[t]:n,!0}return!1}angular.forEach(a||{},function(a,o){var l,s,u=a.match(n)||[],d=u[3]||o,m=u[1];switch(m){case"@":r.$observe(d,function(e){i[o]=e}),r.$$observers[d].$$scope=i,c(d,o)||(i[o]=t(r[d])(i));break;case"=":c(d,o)||(i[o]=""===r[d]?!0:i.$eval(r[d]),s=i.$watch(r[d],function(e){i[o]=e}),i.$on("$destroy",s));break;case"&":if(!c(d,o,angular.noop)){if(r[d]&&r[d].match(RegExp(o+"(.*?)")))throw new Error('& expression binding "'+o+'" looks like it will recursively call "'+r[d]+'" and cause a stack overflow! Please choose a different scopeName.');l=e(r[d]),i[o]=function(e){return l(i,e)}}}})}}angular.module("material.services.attrBind",[]).factory("$attrBind",["$parse","$interpolate",e])}(),function(){function e(e,t,n,i,r,a){this.compile=function(o){var c=o.templateUrl,l=o.template||"",s=o.controller,u=o.controllerAs,d=o.resolve||{},m=o.locals||{},f=o.transformTemplate||angular.identity;return angular.forEach(d,function(e,t){d[t]=angular.isString(e)?n.get(e):n.invoke(e)}),angular.extend(d,m),d.$template=c?t.get(c,{cache:a}).then(function(e){return e.data}):e.when(l),e.all(d).then(function(e){var t=f(e.$template),n=angular.element("<div>").html(t).contents(),a=i(n);return{locals:e,element:n,link:function(t){if(e.$scope=t,s){var i=r(s,e);n.data("$ngControllerController",i),n.children().data("$ngControllerController",i),u&&(t[u]=i)}return a(t)}}})}}angular.module("material.services.compiler",[]).service("$mdCompiler",["$q","$http","$injector","$compile","$controller","$templateCache",e])}(),function(){function e(e,t,n,i,r,a,o){return function(c){function l(e){m.length&&f.hide();var t=new d(e);return m.push(t),t.show().then(function(){return t.deferred.promise})}function s(e){var t=m.shift();t&&t.remove().then(function(){t.deferred.resolve(e)})}function u(e){var t=m.shift();t&&t.remove().then(function(){t.deferred.reject(e)})}function d(r){var l,s,u;return r=r||{},r=angular.extend({scope:r.scope||t.$new(r.isolateScope)},c,r),l={options:r,deferred:e.defer(),show:function(){return a.compile(r).then(function(t){function a(){r.hideDelay&&(s=n(f.hide,r.hideDelay))}r.parent||(r.parent=i.find("body"),r.parent.length||(r.parent=i)),u=t.link(r.scope),r.themable&&o(u);var c=r.onShow(r.scope,u,r);return e.when(c).then(a)})},cancelTimeout:function(){s&&(n.cancel(s),s=void 0)},remove:function(){l.cancelTimeout();var t=r.onRemove(r.scope,u,r);return e.when(t).then(function(){r.scope.$destroy()})}}}var m=[];c=angular.extend({onShow:function(e,t,n){return r.enter(t,n.parent)},onRemove:function(e,t){return r.leave(t)}},c||{});var f;return f={show:l,hide:s,cancel:u}}}angular.module("material.services.interimElement",["material.services.compiler","material.services.theming"]).factory("$$interimElement",["$q","$rootScope","$timeout","$rootElement","$animate","$mdCompiler","$mdTheming",e])}(),function(){function e(e,t,n){function i(e){e=r(e);var t;return angular.isDefined(t=c.get(e))?t:a(e)}function r(e){return l[e]||("("!=e.charAt(0)?"("+e+")":e)}function a(t){return c.put(t,!!e.matchMedia(t).matches)}function o(){var t=c.keys();if(t.length){for(var i=0,r=t.length;r>i;i++)c.put(t[i],!!e.matchMedia(t[i]).matches);n(angular.noop)}}var c=t.cacheFactory("$mdMedia",{capacity:15}),l={sm:"(min-width: 600px)",md:"(min-width: 960px)",lg:"(min-width: 1200px)"};return angular.element(e).on("resize",o),i}angular.module("material.services.media",["material.core"]).factory("$mdMedia",["$window","$mdUtil","$timeout",e])}(),function(){function e(e){var t=[];return{notFoundError:function(t){e.error("No instance found for handle",t)},getInstances:function(){return t},get:function(e){var n,i,r;for(n=0,i=t.length;i>n;n++)if(r=t[n],r.$$mdHandle===e)return r;return null},register:function(e,n){return e.$$mdHandle=n,t.push(e),function(){var n=t.indexOf(e);-1!==n&&t.splice(n,1)}}}}angular.module("material.services.registry",[]).factory("$mdComponentRegistry",["$log",e])}(),function(){function e(){function e(e,n){function i(e,t){void 0===t&&(t=e,e=void 0),void 0===e&&(e=n),i.inherit(t,t)}return i.inherit=function(e,i){function r(t){var n=e.data("$mdThemeName");n&&e.removeClass("md-"+n+"-theme"),e.addClass("md-"+t+"-theme"),e.data("$mdThemeName",t)}var a=i.controller("mdTheme");if(angular.isDefined(e.attr("md-theme-watch"))){var o=n.$watch(function(){return a&&a.$mdTheme||t},r);e.on("$destroy",o)}else{var c=a&&a.$mdTheme||t;r(c)}},i}var t="default";return{setDefaultTheme:function(e){t=e},$get:["$rootElement","$rootScope",e]}}function t(e){return{priority:100,link:{pre:function(t,n,i){var r={$setTheme:function(e){r.$mdTheme=e}};n.data("$mdThemeController",r),r.$setTheme(e(i.mdTheme)(t)),i.$observe("mdTheme",r.$setTheme)}}}}function n(e){return e}angular.module("material.services.theming",[]).directive("mdTheme",["$interpolate",t]).directive("mdThemable",["$mdTheming",n]).provider("$mdTheming",[e])}(),function(){function e(e,t,n,i){function r(r,a,o,c){function l(){m(),i(m,100,!1)}function s(){var t=d.selected()&&d.selected().element;if(!t||d.count()<2)a.css({display:"none",width:"0px"});else{var n=t.prop("offsetWidth"),i=t.prop("offsetLeft")+(d.$$pagingOffset||0);a.css({display:n>0?"block":"none",width:n+"px"}),a.css(e.TRANSFORM,"translate3d("+i+"px,0,0)")}}var u=c[0],d=c[1];if(!u){var m=n.debounce(s);r.$watch(d.selected,s),r.$on("$mdTabsChanged",m),r.$on("$mdTabsPaginationChanged",m),angular.element(t).on("resize",l),r.$on("$destroy",function(){angular.element(t).off("resize",l)})}}return{restrict:"E",require:["^?nobar","^mdTabs"],link:r}}angular.module("material.components.tabs").directive("mdTabsInkBar",["$mdEffects","$window","$$rAF","$timeout",e])}(),function(){function e(e,t,n,i,r){function a(a,l,s,u){function d(e){if(b.active){var t=angular.element(e.target).controller("mdTab"),n=h(t);n!==b.page&&(t.element.blur(),g(n).then(function(){t.element.focus()}))}}function m(e){if(e)if(b.active){var t=h(e);g(t)}else T()}function f(e){var t,n=b.page+e;if(!u.selected()||h(u.selected())!==n){var i;0>e?(i=(n+1)*b.itemsPerPage,t=u.previous(u.itemAt(i))):(i=n*b.itemsPerPage-1,t=u.next(u.itemAt(i)))}g(n).then(function(){t&&t.element.focus()}),t&&u.select(t)}function p(){var e=l.find("md-tab"),t=l.parent().prop("clientWidth")-c,n=t&&o*u.count()>t,i=n!==b.active;if(b.active=n,n){b.pagesCount=Math.ceil(o*u.count()/t),b.itemsPerPage=Math.max(1,Math.floor(u.count()/b.pagesCount)),b.tabWidth=t/b.itemsPerPage,$.css("width",b.tabWidth*u.count()+"px"),e.css("width",b.tabWidth+"px");var a=h(u.selected());g(a)}else i&&r(function(){$.css("width",""),e.css("width",""),v(0),b.page=-1})}function v(t){function n(t){t.target===$[0]&&($.off(e.TRANSITIONEND_EVENT,n),r.resolve())}if(u.pagingOffset===t)return i.when();var r=i.defer();return u.$$pagingOffset=t,$.css(e.TRANSFORM,"translate3d("+t+"px,0,0)"),$.on(e.TRANSITIONEND_EVENT,n),r.promise}function h(e){var t=u.indexOf(e);return-1===t?0:Math.floor(t/b.itemsPerPage)}function g(e){if(e!==b.page){var t=b.pagesCount;return 0>e&&(e=0),e>t&&(e=t),b.hasPrev=e>0,b.hasNext=(e+1)*b.itemsPerPage<u.count(),b.page=e,r(function(){a.$broadcast("$mdTabsPaginationChanged")}),v(-e*b.itemsPerPage*b.tabWidth)}}var $=l.children(),b=a.pagination={page:-1,active:!1,clickNext:function(){f(1)},clickPrevious:function(){f(-1)}};p();var T=n.debounce(p);a.$on("$mdTabsChanged",T),angular.element(t).on("resize",T),$.on("focusin",d),a.$on("$destroy",function(){angular.element(t).off("resize",T),$.off("focusin",d)}),a.$watch(u.selected,m)}var o=96,c=64;return{restrict:"A",require:"^mdTabs",link:a}}angular.module("material.components.tabs").directive("mdTabsPagination",["$mdEffects","$window","$$rAF","$$q","$timeout",e])}(),function(){function e(e,t,n,i,r,a){function o(){return t[0].hasAttribute("disabled")}function c(t){d.content.length&&(d.contentContainer.append(d.content),d.contentScope=e.$parent.$new(),t.append(d.contentContainer),n(d.contentContainer)(d.contentScope),a.disconnectScope(d.contentScope),f=v(d.contentContainer,function(e){d.$$onSwipe(e.type)},!0))}function l(){i.leave(d.contentContainer).then(function(){d.contentScope&&d.contentScope.$destroy(),d.contentScope=null})}function s(){a.reconnectScope(d.contentScope),m=f(),t.addClass("active"),t.attr("aria-selected",!0),t.attr("tabIndex",0),i.removeClass(d.contentContainer,"ng-hide"),e.onSelect()}function u(){a.disconnectScope(d.contentScope),m(),t.removeClass("active"),t.attr("aria-selected",!1),t.attr("tabIndex",-1),i.addClass(d.contentContainer,"ng-hide"),e.onDeselect()}var d=this,m=angular.noop,f=function(){return m},p="swipeleft swiperight",v=r(e,p);d.$$onSwipe=angular.noop,d.contentContainer=angular.element('<div class="md-tab-content ng-hide">'),d.element=t,d.isDisabled=o,d.onAdd=c,d.onRemove=l,d.onSelect=s,d.onDeselect=u}angular.module("material.components.tabs").controller("$mdTab",["$scope","$element","$compile","$animate","$mdSwipe","$mdUtil",e])}(),function(){function e(e,t,n,i,r){function a(a,o){var c=a.find("md-tab-label");c.length?c.remove():c=angular.isDefined(o.label)?angular.element("<md-tab-label>").html(o.label):angular.element("<md-tab-label>").append(a.contents().remove());var l=a.contents().remove();return function(a,o,s,u){function d(){var e=c.clone();o.append(e),t(e)(a.$parent),$.content=l.clone()}function m(){a.$apply(function(){b.select($),$.element.focus()})}function f(e){if(e.which==r.KEY_CODE.SPACE)o.triggerHandler("click"),e.preventDefault();else if(e.which===r.KEY_CODE.LEFT_ARROW){var t=b.previous($);t&&t.element.focus()}else if(e.which===r.KEY_CODE.RIGHT_ARROW){var n=b.next($);n&&n.element.focus()}}function p(){a.$watch("$parent.$index",function(e){b.move($,e)})}function v(){function e(e){var t=b.selected()===$;e&&!t?b.select($):!e&&t&&b.deselect($)}var t=a.$parent.$watch("!!("+s.active+")",e);a.$on("$destroy",t)}function h(){function e(e){o.attr("aria-disabled",e);var t=b.selected()===$;t&&e&&b.select(b.next()||b.previous())}a.$watch($.isDisabled,e)}function g(){var e=s.id||i.nextUid(),t="content_"+e;o.attr({id:e,role:"tabItemCtrl",tabIndex:"-1","aria-controls":t}),$.contentContainer.attr({id:t,role:"tabpanel","aria-labelledby":e}),n.expect(o,"aria-label",!0)}var $=u[0],b=u[1];d();var T=e.attachButtonBehavior(o);b.add($),a.$on("$destroy",function(){T(),b.remove($)}),angular.isDefined(s.ngClick)||o.on("click",m),o.on("keydown",f),angular.isNumber(a.$parent.$index)&&p(),angular.isDefined(s.active)&&v(),h(),g()}}return{restrict:"E",require:["mdTab","^mdTabs"],controller:"$mdTab",scope:{onSelect:"&",onDeselect:"&",label:"@"},compile:a}}angular.module("material.components.tabs").directive("mdTab",["$mdInkRipple","$compile","$mdAria","$mdUtil","$mdConstant",e])}(),function(){function e(e,t,n){function i(){return p.itemAt(e.selectedIndex)}function r(t,n){f.add(t,n),t.onAdd(p.contentArea),t.$$onSwipe=m,(-1===e.selectedIndex||e.selectedIndex===p.indexOf(t))&&p.select(t),e.$broadcast("$mdTabsChanged")}function a(t,n){f.contains(t)&&(n||p.selected()===t&&(f.count()>1?p.select(p.previous()||p.next()):p.deselect(t)),f.remove(t),t.onRemove(),e.$broadcast("$mdTabsChanged"))}function o(t,n){var i=p.selected()===t;f.remove(t),f.add(t,n),i&&p.select(t),e.$broadcast("$mdTabsChanged")}function c(t){!t||t.isSelected||t.isDisabled()||f.contains(t)&&(p.deselect(p.selected()),e.selectedIndex=p.indexOf(t),t.isSelected=!0,t.onSelect())}function l(t){t&&t.isSelected&&f.contains(t)&&(e.selectedIndex=-1,t.isSelected=!1,t.onDeselect())}function s(e,t){return f.next(e||p.selected(),t||d)}function u(e,t){return f.previous(e||p.selected(),t||d)}function d(e){return e&&!e.isDisabled()}function m(e){if(p.selected())switch(e){case"swiperight":case"panright":p.select(p.previous());break;case"swipeleft":case"panleft":p.select(p.next())}}var f=n.iterator([],!1),p=this;p.element=t,p.contentArea=angular.element(t[0].querySelector(".md-tabs-content")),p.inRange=f.inRange,p.indexOf=f.indexOf,p.itemAt=f.itemAt,p.count=f.count,p.selected=i,p.add=r,p.remove=a,p.move=o,p.select=c,p.deselect=l,p.next=s,p.previous=u,p.swipe=m,e.$on("$destroy",function(){p.deselect(p.selected());for(var e=f.count()-1;e>=0;e--)p.remove(f[e],!0)})}angular.module("material.components.tabs").controller("$mdTabs",["$scope","$element","$mdUtil",e])}(),function(){function e(e,t){function n(e,n,i,r){function a(){n.attr({role:"tablist"})}function o(){e.$watch("selectedIndex",function(e,t){if(r.deselect(r.itemAt(t)),r.inRange(e)){var n=r.itemAt(e);n&&n.isDisabled()&&(n=e>t?r.next(n):r.previous(n)),r.select(n)}})}t(n),a(),o()}return{restrict:"E",controller:"$mdTabs",require:"mdTabs",transclude:!0,scope:{selectedIndex:"=?selected"},template:'<section class="md-header" ng-class="{\'md-paginating\': pagination.active}"><div class="md-paginator md-prev" ng-if="pagination.active && pagination.hasPrev" ng-click="pagination.clickPrevious()"></div><div class="md-header-items-container" md-tabs-pagination><div class="md-header-items" ng-transclude></div><md-tabs-ink-bar></md-tabs-ink-bar></div><div class="md-paginator md-next" ng-if="pagination.active && pagination.hasNext" ng-click="pagination.clickNext()"></div></section><section class="md-tabs-content"></section>',link:n}}angular.module("material.components.tabs").directive("mdTabs",["$parse","$mdTheming",e])}();
},{}],"angular.resource":[function(require,module,exports){
/*
 AngularJS v1.3.1
 (c) 2010-2014 Google, Inc. http://angularjs.org
 License: MIT
*/
(function(I,d,B){'use strict';function D(f,q){q=q||{};d.forEach(q,function(d,h){delete q[h]});for(var h in f)!f.hasOwnProperty(h)||"$"===h.charAt(0)&&"$"===h.charAt(1)||(q[h]=f[h]);return q}var w=d.$$minErr("$resource"),C=/^(\.[a-zA-Z_$][0-9a-zA-Z_$]*)+$/;d.module("ngResource",["ng"]).provider("$resource",function(){var f=this;this.defaults={stripTrailingSlashes:!0,actions:{get:{method:"GET"},save:{method:"POST"},query:{method:"GET",isArray:!0},remove:{method:"DELETE"},"delete":{method:"DELETE"}}};
this.$get=["$http","$q",function(q,h){function t(d,g){this.template=d;this.defaults=s({},f.defaults,g);this.urlParams={}}function v(x,g,l,m){function c(b,k){var c={};k=s({},g,k);r(k,function(a,k){u(a)&&(a=a());var d;if(a&&a.charAt&&"@"==a.charAt(0)){d=b;var e=a.substr(1);if(null==e||""===e||"hasOwnProperty"===e||!C.test("."+e))throw w("badmember",e);for(var e=e.split("."),n=0,g=e.length;n<g&&d!==B;n++){var h=e[n];d=null!==d?d[h]:B}}else d=a;c[k]=d});return c}function F(b){return b.resource}function e(b){D(b||
{},this)}var G=new t(x,m);l=s({},f.defaults.actions,l);e.prototype.toJSON=function(){var b=s({},this);delete b.$promise;delete b.$resolved;return b};r(l,function(b,k){var g=/^(POST|PUT|PATCH)$/i.test(b.method);e[k]=function(a,y,m,x){var n={},f,l,z;switch(arguments.length){case 4:z=x,l=m;case 3:case 2:if(u(y)){if(u(a)){l=a;z=y;break}l=y;z=m}else{n=a;f=y;l=m;break}case 1:u(a)?l=a:g?f=a:n=a;break;case 0:break;default:throw w("badargs",arguments.length);}var t=this instanceof e,p=t?f:b.isArray?[]:new e(f),
A={},v=b.interceptor&&b.interceptor.response||F,C=b.interceptor&&b.interceptor.responseError||B;r(b,function(b,a){"params"!=a&&"isArray"!=a&&"interceptor"!=a&&(A[a]=H(b))});g&&(A.data=f);G.setUrlParams(A,s({},c(f,b.params||{}),n),b.url);n=q(A).then(function(a){var c=a.data,g=p.$promise;if(c){if(d.isArray(c)!==!!b.isArray)throw w("badcfg",k,b.isArray?"array":"object",d.isArray(c)?"array":"object");b.isArray?(p.length=0,r(c,function(a){"object"===typeof a?p.push(new e(a)):p.push(a)})):(D(c,p),p.$promise=
g)}p.$resolved=!0;a.resource=p;return a},function(a){p.$resolved=!0;(z||E)(a);return h.reject(a)});n=n.then(function(a){var b=v(a);(l||E)(b,a.headers);return b},C);return t?n:(p.$promise=n,p.$resolved=!1,p)};e.prototype["$"+k]=function(a,b,c){u(a)&&(c=b,b=a,a={});a=e[k].call(this,a,this,b,c);return a.$promise||a}});e.bind=function(b){return v(x,s({},g,b),l)};return e}var E=d.noop,r=d.forEach,s=d.extend,H=d.copy,u=d.isFunction;t.prototype={setUrlParams:function(f,g,l){var m=this,c=l||m.template,h,
e,q=m.urlParams={};r(c.split(/\W/),function(b){if("hasOwnProperty"===b)throw w("badname");!/^\d+$/.test(b)&&b&&(new RegExp("(^|[^\\\\]):"+b+"(\\W|$)")).test(c)&&(q[b]=!0)});c=c.replace(/\\:/g,":");g=g||{};r(m.urlParams,function(b,k){h=g.hasOwnProperty(k)?g[k]:m.defaults[k];d.isDefined(h)&&null!==h?(e=encodeURIComponent(h).replace(/%40/gi,"@").replace(/%3A/gi,":").replace(/%24/g,"$").replace(/%2C/gi,",").replace(/%20/g,"%20").replace(/%26/gi,"&").replace(/%3D/gi,"=").replace(/%2B/gi,"+"),c=c.replace(new RegExp(":"+
k+"(\\W|$)","g"),function(b,a){return e+a})):c=c.replace(new RegExp("(/?):"+k+"(\\W|$)","g"),function(b,a,c){return"/"==c.charAt(0)?c:a+c})});m.defaults.stripTrailingSlashes&&(c=c.replace(/\/+$/,"")||"/");c=c.replace(/\/\.(?=\w+($|\?))/,".");f.url=c.replace(/\/\\\./,"/.");r(g,function(b,c){m.urlParams[c]||(f.params=f.params||{},f.params[c]=b)})}};return v}]})})(window,window.angular);
//# sourceMappingURL=angular-resource.min.js.map

},{}],"angular.route":[function(require,module,exports){
/*
 AngularJS v1.3.1
 (c) 2010-2014 Google, Inc. http://angularjs.org
 License: MIT
*/
(function(p,e,B){'use strict';function u(q,h,f){return{restrict:"ECA",terminal:!0,priority:400,transclude:"element",link:function(a,b,c,g,x){function y(){k&&(f.cancel(k),k=null);l&&(l.$destroy(),l=null);m&&(k=f.leave(m),k.then(function(){k=null}),m=null)}function w(){var c=q.current&&q.current.locals;if(e.isDefined(c&&c.$template)){var c=a.$new(),g=q.current;m=x(c,function(c){f.enter(c,null,m||b).then(function(){!e.isDefined(s)||s&&!a.$eval(s)||h()});y()});l=g.scope=c;l.$emit("$viewContentLoaded");
l.$eval(v)}else y()}var l,m,k,s=c.autoscroll,v=c.onload||"";a.$on("$routeChangeSuccess",w);w()}}}function z(e,h,f){return{restrict:"ECA",priority:-400,link:function(a,b){var c=f.current,g=c.locals;b.html(g.$template);var x=e(b.contents());c.controller&&(g.$scope=a,g=h(c.controller,g),c.controllerAs&&(a[c.controllerAs]=g),b.data("$ngControllerController",g),b.children().data("$ngControllerController",g));x(a)}}}p=e.module("ngRoute",["ng"]).provider("$route",function(){function q(a,b){return e.extend(new (e.extend(function(){},
{prototype:a})),b)}function h(a,e){var c=e.caseInsensitiveMatch,g={originalPath:a,regexp:a},f=g.keys=[];a=a.replace(/([().])/g,"\\$1").replace(/(\/)?:(\w+)([\?\*])?/g,function(a,e,c,b){a="?"===b?b:null;b="*"===b?b:null;f.push({name:c,optional:!!a});e=e||"";return""+(a?"":e)+"(?:"+(a?e:"")+(b&&"(.+?)"||"([^/]+)")+(a||"")+")"+(a||"")}).replace(/([\/$\*])/g,"\\$1");g.regexp=new RegExp("^"+a+"$",c?"i":"");return g}var f={};this.when=function(a,b){f[a]=e.extend({reloadOnSearch:!0},b,a&&h(a,b));if(a){var c=
"/"==a[a.length-1]?a.substr(0,a.length-1):a+"/";f[c]=e.extend({redirectTo:a},h(c,b))}return this};this.otherwise=function(a){"string"===typeof a&&(a={redirectTo:a});this.when(null,a);return this};this.$get=["$rootScope","$location","$routeParams","$q","$injector","$templateRequest","$sce",function(a,b,c,g,h,p,w){function l(b){var d=r.current;(u=(n=k())&&d&&n.$$route===d.$$route&&e.equals(n.pathParams,d.pathParams)&&!n.reloadOnSearch&&!v)||!d&&!n||a.$broadcast("$routeChangeStart",n,d).defaultPrevented&&
b&&b.preventDefault()}function m(){var t=r.current,d=n;if(u)t.params=d.params,e.copy(t.params,c),a.$broadcast("$routeUpdate",t);else if(d||t)v=!1,(r.current=d)&&d.redirectTo&&(e.isString(d.redirectTo)?b.path(s(d.redirectTo,d.params)).search(d.params).replace():b.url(d.redirectTo(d.pathParams,b.path(),b.search())).replace()),g.when(d).then(function(){if(d){var a=e.extend({},d.resolve),b,c;e.forEach(a,function(d,b){a[b]=e.isString(d)?h.get(d):h.invoke(d,null,null,b)});e.isDefined(b=d.template)?e.isFunction(b)&&
(b=b(d.params)):e.isDefined(c=d.templateUrl)&&(e.isFunction(c)&&(c=c(d.params)),c=w.getTrustedResourceUrl(c),e.isDefined(c)&&(d.loadedTemplateUrl=c,b=p(c)));e.isDefined(b)&&(a.$template=b);return g.all(a)}}).then(function(b){d==r.current&&(d&&(d.locals=b,e.copy(d.params,c)),a.$broadcast("$routeChangeSuccess",d,t))},function(b){d==r.current&&a.$broadcast("$routeChangeError",d,t,b)})}function k(){var a,d;e.forEach(f,function(c,g){var f;if(f=!d){var h=b.path();f=c.keys;var l={};if(c.regexp)if(h=c.regexp.exec(h)){for(var k=
1,m=h.length;k<m;++k){var n=f[k-1],p=h[k];n&&p&&(l[n.name]=p)}f=l}else f=null;else f=null;f=a=f}f&&(d=q(c,{params:e.extend({},b.search(),a),pathParams:a}),d.$$route=c)});return d||f[null]&&q(f[null],{params:{},pathParams:{}})}function s(a,b){var c=[];e.forEach((a||"").split(":"),function(a,e){if(0===e)c.push(a);else{var f=a.match(/(\w+)(.*)/),g=f[1];c.push(b[g]);c.push(f[2]||"");delete b[g]}});return c.join("")}var v=!1,n,u,r={routes:f,reload:function(){v=!0;a.$evalAsync(function(){l();m()})},updateParams:function(a){if(this.current&&
this.current.$$route){var c={},f=this;e.forEach(Object.keys(a),function(b){f.current.pathParams[b]||(c[b]=a[b])});a=e.extend({},this.current.params,a);b.path(s(this.current.$$route.originalPath,a));b.search(e.extend({},b.search(),c))}else throw A("norout");}};a.$on("$locationChangeStart",l);a.$on("$locationChangeSuccess",m);return r}]});var A=e.$$minErr("ngRoute");p.provider("$routeParams",function(){this.$get=function(){return{}}});p.directive("ngView",u);p.directive("ngView",z);u.$inject=["$route",
"$anchorScroll","$animate"];z.$inject=["$compile","$controller","$route"]})(window,window.angular);
//# sourceMappingURL=angular-route.min.js.map

},{}],"angular":[function(require,module,exports){
/*
 AngularJS v1.3.1
 (c) 2010-2014 Google, Inc. http://angularjs.org
 License: MIT
*/
(function(N,U,t){'use strict';function w(b){return function(){var a=arguments[0],c;c="["+(b?b+":":"")+a+"] http://errors.angularjs.org/1.3.1/"+(b?b+"/":"")+a;for(a=1;a<arguments.length;a++){c=c+(1==a?"?":"&")+"p"+(a-1)+"=";var d=encodeURIComponent,e;e=arguments[a];e="function"==typeof e?e.toString().replace(/ \{[\s\S]*$/,""):"undefined"==typeof e?"undefined":"string"!=typeof e?JSON.stringify(e):e;c+=d(e)}return Error(c)}}function Qa(b){if(null==b||Ra(b))return!1;var a=b.length;return b.nodeType===
ka&&a?!0:J(b)||H(b)||0===a||"number"===typeof a&&0<a&&a-1 in b}function s(b,a,c){var d,e;if(b)if(A(b))for(d in b)"prototype"==d||"length"==d||"name"==d||b.hasOwnProperty&&!b.hasOwnProperty(d)||a.call(c,b[d],d,b);else if(H(b)||Qa(b)){var f="object"!==typeof b;d=0;for(e=b.length;d<e;d++)(f||d in b)&&a.call(c,b[d],d,b)}else if(b.forEach&&b.forEach!==s)b.forEach(a,c,b);else for(d in b)b.hasOwnProperty(d)&&a.call(c,b[d],d,b);return b}function Cd(b,a,c){for(var d=Object.keys(b).sort(),e=0;e<d.length;e++)a.call(c,
b[d[e]],d[e]);return d}function jc(b){return function(a,c){b(c,a)}}function Dd(){return++gb}function kc(b,a){a?b.$$hashKey=a:delete b.$$hashKey}function F(b){for(var a=b.$$hashKey,c=1,d=arguments.length;c<d;c++){var e=arguments[c];if(e)for(var f=Object.keys(e),g=0,k=f.length;g<k;g++){var h=f[g];b[h]=e[h]}}kc(b,a);return b}function aa(b){return parseInt(b,10)}function lc(b,a){return F(new (F(function(){},{prototype:b})),a)}function y(){}function Sa(b){return b}function da(b){return function(){return b}}
function x(b){return"undefined"===typeof b}function z(b){return"undefined"!==typeof b}function P(b){return null!==b&&"object"===typeof b}function J(b){return"string"===typeof b}function X(b){return"number"===typeof b}function ea(b){return"[object Date]"===Ja.call(b)}function A(b){return"function"===typeof b}function hb(b){return"[object RegExp]"===Ja.call(b)}function Ra(b){return b&&b.window===b}function Ta(b){return b&&b.$evalAsync&&b.$watch}function Ua(b){return"boolean"===typeof b}function mc(b){return!(!b||
!(b.nodeName||b.prop&&b.attr&&b.find))}function Ed(b){var a={};b=b.split(",");var c;for(c=0;c<b.length;c++)a[b[c]]=!0;return a}function pa(b){return S(b.nodeName||b[0].nodeName)}function Va(b,a){var c=b.indexOf(a);0<=c&&b.splice(c,1);return a}function Ca(b,a,c,d){if(Ra(b)||Ta(b))throw Wa("cpws");if(a){if(b===a)throw Wa("cpi");c=c||[];d=d||[];if(P(b)){var e=c.indexOf(b);if(-1!==e)return d[e];c.push(b);d.push(a)}if(H(b))for(var f=a.length=0;f<b.length;f++)e=Ca(b[f],null,c,d),P(b[f])&&(c.push(b[f]),
d.push(e)),a.push(e);else{var g=a.$$hashKey;H(a)?a.length=0:s(a,function(b,c){delete a[c]});for(f in b)b.hasOwnProperty(f)&&(e=Ca(b[f],null,c,d),P(b[f])&&(c.push(b[f]),d.push(e)),a[f]=e);kc(a,g)}}else if(a=b)H(b)?a=Ca(b,[],c,d):ea(b)?a=new Date(b.getTime()):hb(b)?(a=new RegExp(b.source,b.toString().match(/[^\/]*$/)[0]),a.lastIndex=b.lastIndex):P(b)&&(e=Object.create(Object.getPrototypeOf(b)),a=Ca(b,e,c,d));return a}function qa(b,a){if(H(b)){a=a||[];for(var c=0,d=b.length;c<d;c++)a[c]=b[c]}else if(P(b))for(c in a=
a||{},b)if("$"!==c.charAt(0)||"$"!==c.charAt(1))a[c]=b[c];return a||b}function la(b,a){if(b===a)return!0;if(null===b||null===a)return!1;if(b!==b&&a!==a)return!0;var c=typeof b,d;if(c==typeof a&&"object"==c)if(H(b)){if(!H(a))return!1;if((c=b.length)==a.length){for(d=0;d<c;d++)if(!la(b[d],a[d]))return!1;return!0}}else{if(ea(b))return ea(a)?la(b.getTime(),a.getTime()):!1;if(hb(b)&&hb(a))return b.toString()==a.toString();if(Ta(b)||Ta(a)||Ra(b)||Ra(a)||H(a))return!1;c={};for(d in b)if("$"!==d.charAt(0)&&
!A(b[d])){if(!la(b[d],a[d]))return!1;c[d]=!0}for(d in a)if(!c.hasOwnProperty(d)&&"$"!==d.charAt(0)&&a[d]!==t&&!A(a[d]))return!1;return!0}return!1}function ib(b,a,c){return b.concat(Xa.call(a,c))}function nc(b,a){var c=2<arguments.length?Xa.call(arguments,2):[];return!A(a)||a instanceof RegExp?a:c.length?function(){return arguments.length?a.apply(b,c.concat(Xa.call(arguments,0))):a.apply(b,c)}:function(){return arguments.length?a.apply(b,arguments):a.call(b)}}function Fd(b,a){var c=a;"string"===typeof b&&
"$"===b.charAt(0)&&"$"===b.charAt(1)?c=t:Ra(a)?c="$WINDOW":a&&U===a?c="$DOCUMENT":Ta(a)&&(c="$SCOPE");return c}function ra(b,a){return"undefined"===typeof b?t:JSON.stringify(b,Fd,a?"  ":null)}function oc(b){return J(b)?JSON.parse(b):b}function sa(b){b=v(b).clone();try{b.empty()}catch(a){}var c=v("<div>").append(b).html();try{return b[0].nodeType===jb?S(c):c.match(/^(<[^>]+>)/)[1].replace(/^<([\w\-]+)/,function(a,b){return"<"+S(b)})}catch(d){return S(c)}}function pc(b){try{return decodeURIComponent(b)}catch(a){}}
function qc(b){var a={},c,d;s((b||"").split("&"),function(b){b&&(c=b.replace(/\+/g,"%20").split("="),d=pc(c[0]),z(d)&&(b=z(c[1])?pc(c[1]):!0,Hb.call(a,d)?H(a[d])?a[d].push(b):a[d]=[a[d],b]:a[d]=b))});return a}function Ib(b){var a=[];s(b,function(b,d){H(b)?s(b,function(b){a.push(Da(d,!0)+(!0===b?"":"="+Da(b,!0)))}):a.push(Da(d,!0)+(!0===b?"":"="+Da(b,!0)))});return a.length?a.join("&"):""}function kb(b){return Da(b,!0).replace(/%26/gi,"&").replace(/%3D/gi,"=").replace(/%2B/gi,"+")}function Da(b,a){return encodeURIComponent(b).replace(/%40/gi,
"@").replace(/%3A/gi,":").replace(/%24/g,"$").replace(/%2C/gi,",").replace(/%3B/gi,";").replace(/%20/g,a?"%20":"+")}function Gd(b,a){var c,d,e=lb.length;b=v(b);for(d=0;d<e;++d)if(c=lb[d]+a,J(c=b.attr(c)))return c;return null}function Hd(b,a){var c,d,e={};s(lb,function(a){a+="app";!c&&b.hasAttribute&&b.hasAttribute(a)&&(c=b,d=b.getAttribute(a))});s(lb,function(a){a+="app";var e;!c&&(e=b.querySelector("["+a.replace(":","\\:")+"]"))&&(c=e,d=e.getAttribute(a))});c&&(e.strictDi=null!==Gd(c,"strict-di"),
a(c,d?[d]:[],e))}function rc(b,a,c){P(c)||(c={});c=F({strictDi:!1},c);var d=function(){b=v(b);if(b.injector()){var d=b[0]===U?"document":sa(b);throw Wa("btstrpd",d.replace(/</,"&lt;").replace(/>/,"&gt;"));}a=a||[];a.unshift(["$provide",function(a){a.value("$rootElement",b)}]);c.debugInfoEnabled&&a.push(["$compileProvider",function(a){a.debugInfoEnabled(!0)}]);a.unshift("ng");d=Jb(a,c.strictDi);d.invoke(["$rootScope","$rootElement","$compile","$injector",function(a,b,c,d){a.$apply(function(){b.data("$injector",
d);c(b)(a)})}]);return d},e=/^NG_ENABLE_DEBUG_INFO!/,f=/^NG_DEFER_BOOTSTRAP!/;N&&e.test(N.name)&&(c.debugInfoEnabled=!0,N.name=N.name.replace(e,""));if(N&&!f.test(N.name))return d();N.name=N.name.replace(f,"");ta.resumeBootstrap=function(b){s(b,function(b){a.push(b)});d()}}function Id(){N.name="NG_ENABLE_DEBUG_INFO!"+N.name;N.location.reload()}function Jd(b){return ta.element(b).injector().get("$$testability")}function Kb(b,a){a=a||"_";return b.replace(Kd,function(b,d){return(d?a:"")+b.toLowerCase()})}
function Ld(){var b;sc||((ma=N.jQuery)&&ma.fn.on?(v=ma,F(ma.fn,{scope:Ka.scope,isolateScope:Ka.isolateScope,controller:Ka.controller,injector:Ka.injector,inheritedData:Ka.inheritedData}),b=ma.cleanData,ma.cleanData=function(a){var c;if(Lb)Lb=!1;else for(var d=0,e;null!=(e=a[d]);d++)(c=ma._data(e,"events"))&&c.$destroy&&ma(e).triggerHandler("$destroy");b(a)}):v=Q,ta.element=v,sc=!0)}function Mb(b,a,c){if(!b)throw Wa("areq",a||"?",c||"required");return b}function mb(b,a,c){c&&H(b)&&(b=b[b.length-1]);
Mb(A(b),a,"not a function, got "+(b&&"object"===typeof b?b.constructor.name||"Object":typeof b));return b}function La(b,a){if("hasOwnProperty"===b)throw Wa("badname",a);}function tc(b,a,c){if(!a)return b;a=a.split(".");for(var d,e=b,f=a.length,g=0;g<f;g++)d=a[g],b&&(b=(e=b)[d]);return!c&&A(b)?nc(e,b):b}function nb(b){var a=b[0];b=b[b.length-1];var c=[a];do{a=a.nextSibling;if(!a)break;c.push(a)}while(a!==b);return v(c)}function wa(){return Object.create(null)}function Md(b){function a(a,b,c){return a[b]||
(a[b]=c())}var c=w("$injector"),d=w("ng");b=a(b,"angular",Object);b.$$minErr=b.$$minErr||w;return a(b,"module",function(){var b={};return function(f,g,k){if("hasOwnProperty"===f)throw d("badname","module");g&&b.hasOwnProperty(f)&&(b[f]=null);return a(b,f,function(){function a(c,d,e,f){f||(f=b);return function(){f[e||"push"]([c,d,arguments]);return n}}if(!g)throw c("nomod",f);var b=[],d=[],e=[],q=a("$injector","invoke","push",d),n={_invokeQueue:b,_configBlocks:d,_runBlocks:e,requires:g,name:f,provider:a("$provide",
"provider"),factory:a("$provide","factory"),service:a("$provide","service"),value:a("$provide","value"),constant:a("$provide","constant","unshift"),animation:a("$animateProvider","register"),filter:a("$filterProvider","register"),controller:a("$controllerProvider","register"),directive:a("$compileProvider","directive"),config:q,run:function(a){e.push(a);return this}};k&&q(k);return n})}})}function Nd(b){F(b,{bootstrap:rc,copy:Ca,extend:F,equals:la,element:v,forEach:s,injector:Jb,noop:y,bind:nc,toJson:ra,
fromJson:oc,identity:Sa,isUndefined:x,isDefined:z,isString:J,isFunction:A,isObject:P,isNumber:X,isElement:mc,isArray:H,version:Od,isDate:ea,lowercase:S,uppercase:ob,callbacks:{counter:0},getTestability:Jd,$$minErr:w,$$csp:Ya,reloadWithDebugInfo:Id});Za=Md(N);try{Za("ngLocale")}catch(a){Za("ngLocale",[]).provider("$locale",Pd)}Za("ng",["ngLocale"],["$provide",function(a){a.provider({$$sanitizeUri:Qd});a.provider("$compile",uc).directive({a:Rd,input:vc,textarea:vc,form:Sd,script:Td,select:Ud,style:Vd,
option:Wd,ngBind:Xd,ngBindHtml:Yd,ngBindTemplate:Zd,ngClass:$d,ngClassEven:ae,ngClassOdd:be,ngCloak:ce,ngController:de,ngForm:ee,ngHide:fe,ngIf:ge,ngInclude:he,ngInit:ie,ngNonBindable:je,ngPluralize:ke,ngRepeat:le,ngShow:me,ngStyle:ne,ngSwitch:oe,ngSwitchWhen:pe,ngSwitchDefault:qe,ngOptions:re,ngTransclude:se,ngModel:te,ngList:ue,ngChange:ve,pattern:wc,ngPattern:wc,required:xc,ngRequired:xc,minlength:yc,ngMinlength:yc,maxlength:zc,ngMaxlength:zc,ngValue:we,ngModelOptions:xe}).directive({ngInclude:ye}).directive(pb).directive(Ac);
a.provider({$anchorScroll:ze,$animate:Ae,$browser:Be,$cacheFactory:Ce,$controller:De,$document:Ee,$exceptionHandler:Fe,$filter:Bc,$interpolate:Ge,$interval:He,$http:Ie,$httpBackend:Je,$location:Ke,$log:Le,$parse:Me,$rootScope:Ne,$q:Oe,$$q:Pe,$sce:Qe,$sceDelegate:Re,$sniffer:Se,$templateCache:Te,$templateRequest:Ue,$$testability:Ve,$timeout:We,$window:Xe,$$rAF:Ye,$$asyncCallback:Ze})}])}function $a(b){return b.replace($e,function(a,b,d,e){return e?d.toUpperCase():d}).replace(af,"Moz$1")}function Cc(b){b=
b.nodeType;return b===ka||!b||9===b}function Dc(b,a){var c,d,e=a.createDocumentFragment(),f=[];if(Nb.test(b)){c=c||e.appendChild(a.createElement("div"));d=(bf.exec(b)||["",""])[1].toLowerCase();d=ha[d]||ha._default;c.innerHTML=d[1]+b.replace(cf,"<$1></$2>")+d[2];for(d=d[0];d--;)c=c.lastChild;f=ib(f,c.childNodes);c=e.firstChild;c.textContent=""}else f.push(a.createTextNode(b));e.textContent="";e.innerHTML="";s(f,function(a){e.appendChild(a)});return e}function Q(b){if(b instanceof Q)return b;var a;
J(b)&&(b=T(b),a=!0);if(!(this instanceof Q)){if(a&&"<"!=b.charAt(0))throw Ob("nosel");return new Q(b)}if(a){a=U;var c;b=(c=df.exec(b))?[a.createElement(c[1])]:(c=Dc(b,a))?c.childNodes:[]}Ec(this,b)}function Pb(b){return b.cloneNode(!0)}function qb(b,a){a||rb(b);if(b.querySelectorAll)for(var c=b.querySelectorAll("*"),d=0,e=c.length;d<e;d++)rb(c[d])}function Fc(b,a,c,d){if(z(d))throw Ob("offargs");var e=(d=sb(b))&&d.events,f=d&&d.handle;if(f)if(a)s(a.split(" "),function(a){if(z(c)){var d=e[a];Va(d||
[],c);if(d&&0<d.length)return}b.removeEventListener(a,f,!1);delete e[a]});else for(a in e)"$destroy"!==a&&b.removeEventListener(a,f,!1),delete e[a]}function rb(b,a){var c=b.ng339,d=c&&tb[c];d&&(a?delete d.data[a]:(d.handle&&(d.events.$destroy&&d.handle({},"$destroy"),Fc(b)),delete tb[c],b.ng339=t))}function sb(b,a){var c=b.ng339,c=c&&tb[c];a&&!c&&(b.ng339=c=++ef,c=tb[c]={events:{},data:{},handle:t});return c}function Qb(b,a,c){if(Cc(b)){var d=z(c),e=!d&&a&&!P(a),f=!a;b=(b=sb(b,!e))&&b.data;if(d)b[a]=
c;else{if(f)return b;if(e)return b&&b[a];F(b,a)}}}function Rb(b,a){return b.getAttribute?-1<(" "+(b.getAttribute("class")||"")+" ").replace(/[\n\t]/g," ").indexOf(" "+a+" "):!1}function Sb(b,a){a&&b.setAttribute&&s(a.split(" "),function(a){b.setAttribute("class",T((" "+(b.getAttribute("class")||"")+" ").replace(/[\n\t]/g," ").replace(" "+T(a)+" "," ")))})}function Tb(b,a){if(a&&b.setAttribute){var c=(" "+(b.getAttribute("class")||"")+" ").replace(/[\n\t]/g," ");s(a.split(" "),function(a){a=T(a);-1===
c.indexOf(" "+a+" ")&&(c+=a+" ")});b.setAttribute("class",T(c))}}function Ec(b,a){if(a)if(a.nodeType)b[b.length++]=a;else{var c=a.length;if("number"===typeof c&&a.window!==a){if(c)for(var d=0;d<c;d++)b[b.length++]=a[d]}else b[b.length++]=a}}function Gc(b,a){return ub(b,"$"+(a||"ngController")+"Controller")}function ub(b,a,c){9==b.nodeType&&(b=b.documentElement);for(a=H(a)?a:[a];b;){for(var d=0,e=a.length;d<e;d++)if((c=v.data(b,a[d]))!==t)return c;b=b.parentNode||11===b.nodeType&&b.host}}function Hc(b){for(qb(b,
!0);b.firstChild;)b.removeChild(b.firstChild)}function Ic(b,a){a||qb(b);var c=b.parentNode;c&&c.removeChild(b)}function ff(b,a){a=a||N;if("complete"===a.document.readyState)a.setTimeout(b);else v(a).on("load",b)}function Jc(b,a){var c=vb[a.toLowerCase()];return c&&Kc[pa(b)]&&c}function gf(b,a){var c=b.nodeName;return("INPUT"===c||"TEXTAREA"===c)&&Lc[a]}function hf(b,a){var c=function(c,e){c.isDefaultPrevented=function(){return c.defaultPrevented};var f=a[e||c.type],g=f?f.length:0;if(g){if(x(c.immediatePropagationStopped)){var k=
c.stopImmediatePropagation;c.stopImmediatePropagation=function(){c.immediatePropagationStopped=!0;c.stopPropagation&&c.stopPropagation();k&&k.call(c)}}c.isImmediatePropagationStopped=function(){return!0===c.immediatePropagationStopped};1<g&&(f=qa(f));for(var h=0;h<g;h++)c.isImmediatePropagationStopped()||f[h].call(b,c)}};c.elem=b;return c}function Ma(b,a){var c=b&&b.$$hashKey;if(c)return"function"===typeof c&&(c=b.$$hashKey()),c;c=typeof b;return c="function"==c||"object"==c&&null!==b?b.$$hashKey=
c+":"+(a||Dd)():c+":"+b}function ab(b,a){if(a){var c=0;this.nextUid=function(){return++c}}s(b,this.put,this)}function jf(b){return(b=b.toString().replace(Mc,"").match(Nc))?"function("+(b[1]||"").replace(/[\s\r\n]+/," ")+")":"fn"}function Ub(b,a,c){var d;if("function"===typeof b){if(!(d=b.$inject)){d=[];if(b.length){if(a)throw J(c)&&c||(c=b.name||jf(b)),Ea("strictdi",c);a=b.toString().replace(Mc,"");a=a.match(Nc);s(a[1].split(kf),function(a){a.replace(lf,function(a,b,c){d.push(c)})})}b.$inject=d}}else H(b)?
(a=b.length-1,mb(b[a],"fn"),d=b.slice(0,a)):mb(b,"fn",!0);return d}function Jb(b,a){function c(a){return function(b,c){if(P(b))s(b,jc(a));else return a(b,c)}}function d(a,b){La(a,"service");if(A(b)||H(b))b=q.instantiate(b);if(!b.$get)throw Ea("pget",a);return p[a+"Provider"]=b}function e(a,b){return function(){var c=r.invoke(b,this,t,a);if(x(c))throw Ea("undef",a);return c}}function f(a,b,c){return d(a,{$get:!1!==c?e(a,b):b})}function g(a){var b=[],c;s(a,function(a){function d(a){var b,c;b=0;for(c=
a.length;b<c;b++){var e=a[b],f=q.get(e[0]);f[e[1]].apply(f,e[2])}}if(!m.get(a)){m.put(a,!0);try{J(a)?(c=Za(a),b=b.concat(g(c.requires)).concat(c._runBlocks),d(c._invokeQueue),d(c._configBlocks)):A(a)?b.push(q.invoke(a)):H(a)?b.push(q.invoke(a)):mb(a,"module")}catch(e){throw H(a)&&(a=a[a.length-1]),e.message&&e.stack&&-1==e.stack.indexOf(e.message)&&(e=e.message+"\n"+e.stack),Ea("modulerr",a,e.stack||e.message||e);}}});return b}function k(b,c){function d(a){if(b.hasOwnProperty(a)){if(b[a]===h)throw Ea("cdep",
a+" <- "+l.join(" <- "));return b[a]}try{return l.unshift(a),b[a]=h,b[a]=c(a)}catch(e){throw b[a]===h&&delete b[a],e;}finally{l.shift()}}function e(b,c,f,g){"string"===typeof f&&(g=f,f=null);var h=[];g=Ub(b,a,g);var k,l,n;l=0;for(k=g.length;l<k;l++){n=g[l];if("string"!==typeof n)throw Ea("itkn",n);h.push(f&&f.hasOwnProperty(n)?f[n]:d(n))}H(b)&&(b=b[k]);return b.apply(c,h)}return{invoke:e,instantiate:function(a,b,c){var d=function(){};d.prototype=(H(a)?a[a.length-1]:a).prototype;d=new d;a=e(a,d,b,
c);return P(a)||A(a)?a:d},get:d,annotate:Ub,has:function(a){return p.hasOwnProperty(a+"Provider")||b.hasOwnProperty(a)}}}a=!0===a;var h={},l=[],m=new ab([],!0),p={$provide:{provider:c(d),factory:c(f),service:c(function(a,b){return f(a,["$injector",function(a){return a.instantiate(b)}])}),value:c(function(a,b){return f(a,da(b),!1)}),constant:c(function(a,b){La(a,"constant");p[a]=b;n[a]=b}),decorator:function(a,b){var c=q.get(a+"Provider"),d=c.$get;c.$get=function(){var a=r.invoke(d,c);return r.invoke(b,
null,{$delegate:a})}}}},q=p.$injector=k(p,function(){throw Ea("unpr",l.join(" <- "));}),n={},r=n.$injector=k(n,function(a){var b=q.get(a+"Provider");return r.invoke(b.$get,b,t,a)});s(g(b),function(a){r.invoke(a||y)});return r}function ze(){var b=!0;this.disableAutoScrolling=function(){b=!1};this.$get=["$window","$location","$rootScope",function(a,c,d){function e(a){var b=null;Array.prototype.some.call(a,function(a){if("a"===pa(a))return b=a,!0});return b}function f(b){if(b){b.scrollIntoView();var c;
c=g.yOffset;A(c)?c=c():mc(c)?(c=c[0],c="fixed"!==a.getComputedStyle(c).position?0:c.getBoundingClientRect().bottom):X(c)||(c=0);c&&(b=b.getBoundingClientRect().top,a.scrollBy(0,b-c))}else a.scrollTo(0,0)}function g(){var a=c.hash(),b;a?(b=k.getElementById(a))?f(b):(b=e(k.getElementsByName(a)))?f(b):"top"===a&&f(null):f(null)}var k=a.document;b&&d.$watch(function(){return c.hash()},function(a,b){a===b&&""===a||ff(function(){d.$evalAsync(g)})});return g}]}function Ze(){this.$get=["$$rAF","$timeout",
function(b,a){return b.supported?function(a){return b(a)}:function(b){return a(b,0,!1)}}]}function mf(b,a,c,d){function e(a){try{a.apply(null,Xa.call(arguments,1))}finally{if(C--,0===C)for(;D.length;)try{D.pop()()}catch(b){c.error(b)}}}function f(a,b){(function xa(){s(G,function(a){a()});u=b(xa,a)})()}function g(){k();h()}function k(){I=b.history.state;I=x(I)?null:I;la(I,R)&&(I=R);R=I}function h(){if(E!==m.url()||K!==I)E=m.url(),K=I,s(V,function(a){a(m.url(),I)})}function l(a){try{return decodeURIComponent(a)}catch(b){return a}}
var m=this,p=a[0],q=b.location,n=b.history,r=b.setTimeout,O=b.clearTimeout,B={};m.isMock=!1;var C=0,D=[];m.$$completeOutstandingRequest=e;m.$$incOutstandingRequestCount=function(){C++};m.notifyWhenNoOutstandingRequests=function(a){s(G,function(a){a()});0===C?a():D.push(a)};var G=[],u;m.addPollFn=function(a){x(u)&&f(100,r);G.push(a);return a};var I,K,E=q.href,ca=a.find("base"),M=null;k();K=I;m.url=function(a,c,e){x(e)&&(e=null);q!==b.location&&(q=b.location);n!==b.history&&(n=b.history);if(a){var f=
K===e;if(E!==a||d.history&&!f){var g=E&&Fa(E)===Fa(a);E=a;K=e;!d.history||g&&f?(g||(M=a),c?q.replace(a):q.href=a):(n[c?"replaceState":"pushState"](e,"",a),k(),K=I);return m}}else return M||q.href.replace(/%27/g,"'")};m.state=function(){return I};var V=[],W=!1,R=null;m.onUrlChange=function(a){if(!W){if(d.history)v(b).on("popstate",g);v(b).on("hashchange",g);W=!0}V.push(a);return a};m.$$checkUrlChange=h;m.baseHref=function(){var a=ca.attr("href");return a?a.replace(/^(https?\:)?\/\/[^\/]*/,""):""};
var ba={},z="",fa=m.baseHref();m.cookies=function(a,b){var d,e,f,g;if(a)b===t?p.cookie=encodeURIComponent(a)+"=;path="+fa+";expires=Thu, 01 Jan 1970 00:00:00 GMT":J(b)&&(d=(p.cookie=encodeURIComponent(a)+"="+encodeURIComponent(b)+";path="+fa).length+1,4096<d&&c.warn("Cookie '"+a+"' possibly not set or overflowed because it was too large ("+d+" > 4096 bytes)!"));else{if(p.cookie!==z)for(z=p.cookie,d=z.split("; "),ba={},f=0;f<d.length;f++)e=d[f],g=e.indexOf("="),0<g&&(a=l(e.substring(0,g)),ba[a]===
t&&(ba[a]=l(e.substring(g+1))));return ba}};m.defer=function(a,b){var c;C++;c=r(function(){delete B[c];e(a)},b||0);B[c]=!0;return c};m.defer.cancel=function(a){return B[a]?(delete B[a],O(a),e(y),!0):!1}}function Be(){this.$get=["$window","$log","$sniffer","$document",function(b,a,c,d){return new mf(b,d,a,c)}]}function Ce(){this.$get=function(){function b(b,d){function e(a){a!=p&&(q?q==a&&(q=a.n):q=a,f(a.n,a.p),f(a,p),p=a,p.n=null)}function f(a,b){a!=b&&(a&&(a.p=b),b&&(b.n=a))}if(b in a)throw w("$cacheFactory")("iid",
b);var g=0,k=F({},d,{id:b}),h={},l=d&&d.capacity||Number.MAX_VALUE,m={},p=null,q=null;return a[b]={put:function(a,b){if(l<Number.MAX_VALUE){var c=m[a]||(m[a]={key:a});e(c)}if(!x(b))return a in h||g++,h[a]=b,g>l&&this.remove(q.key),b},get:function(a){if(l<Number.MAX_VALUE){var b=m[a];if(!b)return;e(b)}return h[a]},remove:function(a){if(l<Number.MAX_VALUE){var b=m[a];if(!b)return;b==p&&(p=b.p);b==q&&(q=b.n);f(b.n,b.p);delete m[a]}delete h[a];g--},removeAll:function(){h={};g=0;m={};p=q=null},destroy:function(){m=
k=h=null;delete a[b]},info:function(){return F({},k,{size:g})}}}var a={};b.info=function(){var b={};s(a,function(a,e){b[e]=a.info()});return b};b.get=function(b){return a[b]};return b}}function Te(){this.$get=["$cacheFactory",function(b){return b("templates")}]}function uc(b,a){function c(a,b){var c=/^\s*([@&]|=(\*?))(\??)\s*(\w*)\s*$/,d={};s(a,function(a,e){var f=a.match(c);if(!f)throw ia("iscp",b,e,a);d[e]={mode:f[1][0],collection:"*"===f[2],optional:"?"===f[3],attrName:f[4]||e}});return d}var d=
{},e=/^\s*directive\:\s*([\w\-]+)\s+(.*)$/,f=/(([\w\-]+)(?:\:([^;]+))?;?)/,g=Ed("ngSrc,ngSrcset,src,srcset"),k=/^(?:(\^\^?)?(\?)?(\^\^?)?)?/,h=/^(on[a-z]+|formaction)$/;this.directive=function p(a,e){La(a,"directive");J(a)?(Mb(e,"directiveFactory"),d.hasOwnProperty(a)||(d[a]=[],b.factory(a+"Directive",["$injector","$exceptionHandler",function(b,e){var f=[];s(d[a],function(d,g){try{var h=b.invoke(d);A(h)?h={compile:da(h)}:!h.compile&&h.link&&(h.compile=da(h.link));h.priority=h.priority||0;h.index=
g;h.name=h.name||a;h.require=h.require||h.controller&&h.name;h.restrict=h.restrict||"EA";P(h.scope)&&(h.$$isolateBindings=c(h.scope,h.name));f.push(h)}catch(k){e(k)}});return f}])),d[a].push(e)):s(a,jc(p));return this};this.aHrefSanitizationWhitelist=function(b){return z(b)?(a.aHrefSanitizationWhitelist(b),this):a.aHrefSanitizationWhitelist()};this.imgSrcSanitizationWhitelist=function(b){return z(b)?(a.imgSrcSanitizationWhitelist(b),this):a.imgSrcSanitizationWhitelist()};var l=!0;this.debugInfoEnabled=
function(a){return z(a)?(l=a,this):l};this.$get=["$injector","$interpolate","$exceptionHandler","$templateRequest","$parse","$controller","$rootScope","$document","$sce","$animate","$$sanitizeUri",function(a,b,c,r,O,B,C,D,G,u,I){function K(a,b){try{a.addClass(b)}catch(c){}}function E(a,b,c,d,e){a instanceof v||(a=v(a));s(a,function(b,c){b.nodeType==jb&&b.nodeValue.match(/\S+/)&&(a[c]=v(b).wrap("<span></span>").parent()[0])});var f=ca(a,b,a,c,d,e);E.$$addScopeClass(a);var g=null;return function(b,
c,d,e,h){Mb(b,"scope");g||(g=(h=h&&h[0])?"foreignobject"!==pa(h)&&h.toString().match(/SVG/)?"svg":"html":"html");h="html"!==g?v(N(g,v("<div>").append(a).html())):c?Ka.clone.call(a):a;if(d)for(var k in d)h.data("$"+k+"Controller",d[k].instance);E.$$addScopeInfo(h,b);c&&c(h,b);f&&f(b,h,h,e);return h}}function ca(a,b,c,d,e,f){function g(a,c,d,e){var f,k,l,q,n,r,D;if(p)for(D=Array(c.length),q=0;q<h.length;q+=3)f=h[q],D[f]=c[f];else D=c;q=0;for(n=h.length;q<n;)k=D[h[q++]],c=h[q++],f=h[q++],c?(c.scope?
(l=a.$new(),E.$$addScopeInfo(v(k),l)):l=a,r=c.transcludeOnThisElement?M(a,c.transclude,e,c.elementTranscludeOnThisElement):!c.templateOnThisElement&&e?e:!e&&b?M(a,b):null,c(f,l,k,d,r)):f&&f(a,k.childNodes,t,e)}for(var h=[],k,l,q,n,p,r=0;r<a.length;r++){k=new X;l=V(a[r],[],k,0===r?d:t,e);(f=l.length?ba(l,a[r],k,b,c,null,[],[],f):null)&&f.scope&&E.$$addScopeClass(k.$$element);k=f&&f.terminal||!(q=a[r].childNodes)||!q.length?null:ca(q,f?(f.transcludeOnThisElement||!f.templateOnThisElement)&&f.transclude:
b);if(f||k)h.push(r,f,k),n=!0,p=p||f;f=null}return n?g:null}function M(a,b,c,d){return function(d,e,f,g,h){d||(d=a.$new(!1,h),d.$$transcluded=!0);return b(d,e,f,c,g)}}function V(b,c,g,h,k){var l=g.$attr,q;switch(b.nodeType){case ka:fa(c,ua(pa(b)),"E",h,k);for(var n,r,D,B=b.attributes,O=0,G=B&&B.length;O<G;O++){var I=!1,E=!1;n=B[O];q=n.name;n=T(n.value);r=ua(q);if(D=ya.test(r))q=Kb(r.substr(6),"-");var K=r.replace(/(Start|End)$/,""),u;a:{var C=K;if(d.hasOwnProperty(C)){u=void 0;for(var C=a.get(C+"Directive"),
s=0,ca=C.length;s<ca;s++)if(u=C[s],u.multiElement){u=!0;break a}}u=!1}u&&r===K+"Start"&&(I=q,E=q.substr(0,q.length-5)+"end",q=q.substr(0,q.length-6));r=ua(q.toLowerCase());l[r]=q;if(D||!g.hasOwnProperty(r))g[r]=n,Jc(b,r)&&(g[r]=!0);Q(b,c,n,r,D);fa(c,r,"A",h,k,I,E)}b=b.className;if(J(b)&&""!==b)for(;q=f.exec(b);)r=ua(q[2]),fa(c,r,"C",h,k)&&(g[r]=T(q[3])),b=b.substr(q.index+q[0].length);break;case jb:Y(c,b.nodeValue);break;case 8:try{if(q=e.exec(b.nodeValue))r=ua(q[1]),fa(c,r,"M",h,k)&&(g[r]=T(q[2]))}catch(V){}}c.sort(w);
return c}function W(a,b,c){var d=[],e=0;if(b&&a.hasAttribute&&a.hasAttribute(b)){do{if(!a)throw ia("uterdir",b,c);a.nodeType==ka&&(a.hasAttribute(b)&&e++,a.hasAttribute(c)&&e--);d.push(a);a=a.nextSibling}while(0<e)}else d.push(a);return v(d)}function R(a,b,c){return function(d,e,f,g,h){e=W(e[0],b,c);return a(d,e,f,g,h)}}function ba(a,d,e,f,g,h,l,r,p){function D(a,b,c,d){if(a){c&&(a=R(a,c,d));a.require=L.require;a.directiveName=ga;if(M===L||L.$$isolateScope)a=Z(a,{isolateScope:!0});l.push(a)}if(b){c&&
(b=R(b,c,d));b.require=L.require;b.directiveName=ga;if(M===L||L.$$isolateScope)b=Z(b,{isolateScope:!0});r.push(b)}}function I(a,b,c,d){var e,f="data",g=!1,h=c,l;if(J(b)){l=b.match(k);b=b.substring(l[0].length);l[3]&&(l[1]?l[3]=null:l[1]=l[3]);"^"===l[1]?f="inheritedData":"^^"===l[1]&&(f="inheritedData",h=c.parent());"?"===l[2]&&(g=!0);e=null;d&&"data"===f&&(e=d[b])&&(e=e.instance);e=e||h[f]("$"+b+"Controller");if(!e&&!g)throw ia("ctreq",b,a);return e||null}H(b)&&(e=[],s(b,function(b){e.push(I(a,b,
c,d))}));return e}function G(a,c,f,g,h){function k(a,b,c){var d;Ta(a)||(c=b,b=a,a=t);F&&(d=u);c||(c=F?V.parent():V);return h(a,b,d,c,Vb)}var n,p,D,K,u,xb,V,R;d===f?(R=e,V=e.$$element):(V=v(f),R=new X(V,e));M&&(K=c.$new(!0));xb=h&&k;C&&(ca={},u={},s(C,function(a){var b={$scope:a===M||a.$$isolateScope?K:c,$element:V,$attrs:R,$transclude:xb};D=a.controller;"@"==D&&(D=R[a.name]);b=B(D,b,!0,a.controllerAs);u[a.name]=b;F||V.data("$"+a.name+"Controller",b.instance);ca[a.name]=b}));if(M){E.$$addScopeInfo(V,
K,!0,!(ba&&(ba===M||ba===M.$$originalDirective)));E.$$addScopeClass(V,!0);g=ca&&ca[M.name];var W=K;g&&g.identifier&&!0===M.bindToController&&(W=g.instance);s(K.$$isolateBindings=M.$$isolateBindings,function(a,d){var e=a.attrName,f=a.optional,g,h,k,l;switch(a.mode){case "@":R.$observe(e,function(a){W[d]=a});R.$$observers[e].$$scope=c;R[e]&&(W[d]=b(R[e])(c));break;case "=":if(f&&!R[e])break;h=O(R[e]);l=h.literal?la:function(a,b){return a===b||a!==a&&b!==b};k=h.assign||function(){g=W[d]=h(c);throw ia("nonassign",
R[e],M.name);};g=W[d]=h(c);f=function(a){l(a,W[d])||(l(a,g)?k(c,a=W[d]):W[d]=a);return g=a};f.$stateful=!0;f=a.collection?c.$watchCollection(R[e],f):c.$watch(O(R[e],f),null,h.literal);K.$on("$destroy",f);break;case "&":h=O(R[e]),W[d]=function(a){return h(c,a)}}})}ca&&(s(ca,function(a){a()}),ca=null);g=0;for(n=l.length;g<n;g++)p=l[g],$(p,p.isolateScope?K:c,V,R,p.require&&I(p.directiveName,p.require,V,u),xb);var Vb=c;M&&(M.template||null===M.templateUrl)&&(Vb=K);a&&a(Vb,f.childNodes,t,h);for(g=r.length-
1;0<=g;g--)p=r[g],$(p,p.isolateScope?K:c,V,R,p.require&&I(p.directiveName,p.require,V,u),xb)}p=p||{};for(var K=-Number.MAX_VALUE,u,C=p.controllerDirectives,ca,M=p.newIsolateScopeDirective,ba=p.templateDirective,fa=p.nonTlbTranscludeDirective,y=!1,Na=!1,F=p.hasElementTranscludeDirective,Y=e.$$element=v(d),L,ga,w,Ga=f,S,Q=0,ya=a.length;Q<ya;Q++){L=a[Q];var wb=L.$$start,aa=L.$$end;wb&&(Y=W(d,wb,aa));w=t;if(K>L.priority)break;if(w=L.scope)L.templateUrl||(P(w)?(xa("new/isolated scope",M||u,L,Y),M=L):xa("new/isolated scope",
M,L,Y)),u=u||L;ga=L.name;!L.templateUrl&&L.controller&&(w=L.controller,C=C||{},xa("'"+ga+"' controller",C[ga],L,Y),C[ga]=L);if(w=L.transclude)y=!0,L.$$tlb||(xa("transclusion",fa,L,Y),fa=L),"element"==w?(F=!0,K=L.priority,w=Y,Y=e.$$element=v(U.createComment(" "+ga+": "+e[ga]+" ")),d=Y[0],yb(g,Xa.call(w,0),d),Ga=E(w,f,K,h&&h.name,{nonTlbTranscludeDirective:fa})):(w=v(Pb(d)).contents(),Y.empty(),Ga=E(w,f));if(L.template)if(Na=!0,xa("template",ba,L,Y),ba=L,w=A(L.template)?L.template(Y,e):L.template,w=
Pc(w),L.replace){h=L;w=Nb.test(w)?Qc(N(L.templateNamespace,T(w))):[];d=w[0];if(1!=w.length||d.nodeType!==ka)throw ia("tplrt",ga,"");yb(g,Y,d);ya={$attr:{}};w=V(d,[],ya);var nf=a.splice(Q+1,a.length-(Q+1));M&&z(w);a=a.concat(w).concat(nf);Oc(e,ya);ya=a.length}else Y.html(w);if(L.templateUrl)Na=!0,xa("template",ba,L,Y),ba=L,L.replace&&(h=L),G=x(a.splice(Q,a.length-Q),Y,e,g,y&&Ga,l,r,{controllerDirectives:C,newIsolateScopeDirective:M,templateDirective:ba,nonTlbTranscludeDirective:fa}),ya=a.length;else if(L.compile)try{S=
L.compile(Y,e,Ga),A(S)?D(null,S,wb,aa):S&&D(S.pre,S.post,wb,aa)}catch(da){c(da,sa(Y))}L.terminal&&(G.terminal=!0,K=Math.max(K,L.priority))}G.scope=u&&!0===u.scope;G.transcludeOnThisElement=y;G.elementTranscludeOnThisElement=F;G.templateOnThisElement=Na;G.transclude=Ga;p.hasElementTranscludeDirective=F;return G}function z(a){for(var b=0,c=a.length;b<c;b++)a[b]=lc(a[b],{$$isolateScope:!0})}function fa(b,e,f,g,h,k,l){if(e===h)return null;h=null;if(d.hasOwnProperty(e)){var q;e=a.get(e+"Directive");for(var r=
0,D=e.length;r<D;r++)try{q=e[r],(g===t||g>q.priority)&&-1!=q.restrict.indexOf(f)&&(k&&(q=lc(q,{$$start:k,$$end:l})),b.push(q),h=q)}catch(B){c(B)}}return h}function Oc(a,b){var c=b.$attr,d=a.$attr,e=a.$$element;s(a,function(d,e){"$"!=e.charAt(0)&&(b[e]&&b[e]!==d&&(d+=("style"===e?";":" ")+b[e]),a.$set(e,d,!0,c[e]))});s(b,function(b,f){"class"==f?(K(e,b),a["class"]=(a["class"]?a["class"]+" ":"")+b):"style"==f?(e.attr("style",e.attr("style")+";"+b),a.style=(a.style?a.style+";":"")+b):"$"==f.charAt(0)||
a.hasOwnProperty(f)||(a[f]=b,d[f]=c[f])})}function x(a,b,c,d,e,f,g,h){var k=[],l,q,n=b[0],p=a.shift(),D=F({},p,{templateUrl:null,transclude:null,replace:null,$$originalDirective:p}),B=A(p.templateUrl)?p.templateUrl(b,c):p.templateUrl,O=p.templateNamespace;b.empty();r(G.getTrustedResourceUrl(B)).then(function(r){var G,I;r=Pc(r);if(p.replace){r=Nb.test(r)?Qc(N(O,T(r))):[];G=r[0];if(1!=r.length||G.nodeType!==ka)throw ia("tplrt",p.name,B);r={$attr:{}};yb(d,b,G);var u=V(G,[],r);P(p.scope)&&z(u);a=u.concat(a);
Oc(c,r)}else G=n,b.html(r);a.unshift(D);l=ba(a,G,c,e,b,p,f,g,h);s(d,function(a,c){a==G&&(d[c]=b[0])});for(q=ca(b[0].childNodes,e);k.length;){r=k.shift();I=k.shift();var E=k.shift(),C=k.shift(),u=b[0];if(!r.$$destroyed){if(I!==n){var R=I.className;h.hasElementTranscludeDirective&&p.replace||(u=Pb(G));yb(E,v(I),u);K(v(u),R)}I=l.transcludeOnThisElement?M(r,l.transclude,C):C;l(q,r,u,d,I)}}k=null});return function(a,b,c,d,e){a=e;b.$$destroyed||(k?(k.push(b),k.push(c),k.push(d),k.push(a)):(l.transcludeOnThisElement&&
(a=M(b,l.transclude,e)),l(q,b,c,d,a)))}}function w(a,b){var c=b.priority-a.priority;return 0!==c?c:a.name!==b.name?a.name<b.name?-1:1:a.index-b.index}function xa(a,b,c,d){if(b)throw ia("multidir",b.name,c.name,a,sa(d));}function Y(a,c){var d=b(c,!0);d&&a.push({priority:0,compile:function(a){a=a.parent();var b=!!a.length;b&&E.$$addBindingClass(a);return function(a,c){var e=c.parent();b||E.$$addBindingClass(e);E.$$addBindingInfo(e,d.expressions);a.$watch(d,function(a){c[0].nodeValue=a})}}})}function N(a,
b){a=S(a||"html");switch(a){case "svg":case "math":var c=U.createElement("div");c.innerHTML="<"+a+">"+b+"</"+a+">";return c.childNodes[0].childNodes;default:return b}}function Ga(a,b){if("srcdoc"==b)return G.HTML;var c=pa(a);if("xlinkHref"==b||"form"==c&&"action"==b||"img"!=c&&("src"==b||"ngSrc"==b))return G.RESOURCE_URL}function Q(a,c,d,e,f){var k=b(d,!0);if(k){if("multiple"===e&&"select"===pa(a))throw ia("selmulti",sa(a));c.push({priority:100,compile:function(){return{pre:function(c,d,l){d=l.$$observers||
(l.$$observers={});if(h.test(e))throw ia("nodomevents");l[e]&&(k=b(l[e],!0,Ga(a,e),g[e]||f))&&(l[e]=k(c),(d[e]||(d[e]=[])).$$inter=!0,(l.$$observers&&l.$$observers[e].$$scope||c).$watch(k,function(a,b){"class"===e&&a!=b?l.$updateClass(a,b):l.$set(e,a)}))}}}})}}function yb(a,b,c){var d=b[0],e=b.length,f=d.parentNode,g,h;if(a)for(g=0,h=a.length;g<h;g++)if(a[g]==d){a[g++]=c;h=g+e-1;for(var k=a.length;g<k;g++,h++)h<k?a[g]=a[h]:delete a[g];a.length-=e-1;a.context===d&&(a.context=c);break}f&&f.replaceChild(c,
d);a=U.createDocumentFragment();a.appendChild(d);v(c).data(v(d).data());ma?(Lb=!0,ma.cleanData([d])):delete v.cache[d[v.expando]];d=1;for(e=b.length;d<e;d++)f=b[d],v(f).remove(),a.appendChild(f),delete b[d];b[0]=c;b.length=1}function Z(a,b){return F(function(){return a.apply(null,arguments)},a,b)}function $(a,b,d,e,f,g){try{a(b,d,e,f,g)}catch(h){c(h,sa(d))}}var X=function(a,b){if(b){var c=Object.keys(b),d,e,f;d=0;for(e=c.length;d<e;d++)f=c[d],this[f]=b[f]}else this.$attr={};this.$$element=a};X.prototype=
{$normalize:ua,$addClass:function(a){a&&0<a.length&&u.addClass(this.$$element,a)},$removeClass:function(a){a&&0<a.length&&u.removeClass(this.$$element,a)},$updateClass:function(a,b){var c=Rc(a,b);c&&c.length&&u.addClass(this.$$element,c);(c=Rc(b,a))&&c.length&&u.removeClass(this.$$element,c)},$set:function(a,b,d,e){var f=this.$$element[0],g=Jc(f,a),h=gf(f,a),f=a;g?(this.$$element.prop(a,b),e=g):h&&(this[h]=b,f=h);this[a]=b;e?this.$attr[a]=e:(e=this.$attr[a])||(this.$attr[a]=e=Kb(a,"-"));g=pa(this.$$element);
if("a"===g&&"href"===a||"img"===g&&"src"===a)this[a]=b=I(b,"src"===a);else if("img"===g&&"srcset"===a){for(var g="",h=T(b),k=/(\s+\d+x\s*,|\s+\d+w\s*,|\s+,|,\s+)/,k=/\s/.test(h)?k:/(,)/,h=h.split(k),k=Math.floor(h.length/2),l=0;l<k;l++)var q=2*l,g=g+I(T(h[q]),!0),g=g+(" "+T(h[q+1]));h=T(h[2*l]).split(/\s/);g+=I(T(h[0]),!0);2===h.length&&(g+=" "+T(h[1]));this[a]=b=g}!1!==d&&(null===b||b===t?this.$$element.removeAttr(e):this.$$element.attr(e,b));(a=this.$$observers)&&s(a[f],function(a){try{a(b)}catch(d){c(d)}})},
$observe:function(a,b){var c=this,d=c.$$observers||(c.$$observers=wa()),e=d[a]||(d[a]=[]);e.push(b);C.$evalAsync(function(){!e.$$inter&&c.hasOwnProperty(a)&&b(c[a])});return function(){Va(e,b)}}};var Na=b.startSymbol(),ga=b.endSymbol(),Pc="{{"==Na||"}}"==ga?Sa:function(a){return a.replace(/\{\{/g,Na).replace(/}}/g,ga)},ya=/^ngAttr[A-Z]/;E.$$addBindingInfo=l?function(a,b){var c=a.data("$binding")||[];H(b)?c=c.concat(b):c.push(b);a.data("$binding",c)}:y;E.$$addBindingClass=l?function(a){K(a,"ng-binding")}:
y;E.$$addScopeInfo=l?function(a,b,c,d){a.data(c?d?"$isolateScopeNoTemplate":"$isolateScope":"$scope",b)}:y;E.$$addScopeClass=l?function(a,b){K(a,b?"ng-isolate-scope":"ng-scope")}:y;return E}]}function ua(b){return $a(b.replace(of,""))}function Rc(b,a){var c="",d=b.split(/\s+/),e=a.split(/\s+/),f=0;a:for(;f<d.length;f++){for(var g=d[f],k=0;k<e.length;k++)if(g==e[k])continue a;c+=(0<c.length?" ":"")+g}return c}function Qc(b){b=v(b);var a=b.length;if(1>=a)return b;for(;a--;)8===b[a].nodeType&&pf.call(b,
a,1);return b}function De(){var b={},a=!1,c=/^(\S+)(\s+as\s+(\w+))?$/;this.register=function(a,c){La(a,"controller");P(a)?F(b,a):b[a]=c};this.allowGlobals=function(){a=!0};this.$get=["$injector","$window",function(d,e){function f(a,b,c,d){if(!a||!P(a.$scope))throw w("$controller")("noscp",d,b);a.$scope[b]=c}return function(g,k,h,l){var m,p,q;h=!0===h;l&&J(l)&&(q=l);J(g)&&(l=g.match(c),p=l[1],q=q||l[3],g=b.hasOwnProperty(p)?b[p]:tc(k.$scope,p,!0)||(a?tc(e,p,!0):t),mb(g,p,!0));if(h)return h=function(){},
h.prototype=(H(g)?g[g.length-1]:g).prototype,m=new h,q&&f(k,q,m,p||g.name),F(function(){d.invoke(g,m,k,p);return m},{instance:m,identifier:q});m=d.instantiate(g,k,p);q&&f(k,q,m,p||g.name);return m}}]}function Ee(){this.$get=["$window",function(b){return v(b.document)}]}function Fe(){this.$get=["$log",function(b){return function(a,c){b.error.apply(b,arguments)}}]}function Wb(b,a){if(J(b)){b=b.replace(qf,"");var c=a("Content-Type");if(c&&0===c.indexOf(Sc)||rf.test(b)&&sf.test(b))b=oc(b)}return b}function Tc(b){var a=
{},c,d,e;if(!b)return a;s(b.split("\n"),function(b){e=b.indexOf(":");c=S(T(b.substr(0,e)));d=T(b.substr(e+1));c&&(a[c]=a[c]?a[c]+", "+d:d)});return a}function Uc(b){var a=P(b)?b:t;return function(c){a||(a=Tc(b));return c?a[S(c)]||null:a}}function Vc(b,a,c){if(A(c))return c(b,a);s(c,function(c){b=c(b,a)});return b}function Ie(){var b=this.defaults={transformResponse:[Wb],transformRequest:[function(a){return P(a)&&"[object File]"!==Ja.call(a)&&"[object Blob]"!==Ja.call(a)?ra(a):a}],headers:{common:{Accept:"application/json, text/plain, */*"},
post:qa(Xb),put:qa(Xb),patch:qa(Xb)},xsrfCookieName:"XSRF-TOKEN",xsrfHeaderName:"X-XSRF-TOKEN"},a=!1;this.useApplyAsync=function(b){return z(b)?(a=!!b,this):a};var c=this.interceptors=[];this.$get=["$httpBackend","$browser","$cacheFactory","$rootScope","$q","$injector",function(d,e,f,g,k,h){function l(a){function c(a){var b=F({},a);b.data=a.data?Vc(a.data,a.headers,d.transformResponse):a.data;a=a.status;return 200<=a&&300>a?b:k.reject(b)}var d={method:"get",transformRequest:b.transformRequest,transformResponse:b.transformResponse},
e=function(a){var c=b.headers,d=F({},a.headers),e,f,c=F({},c.common,c[S(a.method)]);a:for(e in c){a=S(e);for(f in d)if(S(f)===a)continue a;d[e]=c[e]}(function(a){var b;s(a,function(c,d){A(c)&&(b=c(),null!=b?a[d]=b:delete a[d])})})(d);return d}(a);F(d,a);d.headers=e;d.method=ob(d.method);var f=[function(a){e=a.headers;var d=Vc(a.data,Uc(e),a.transformRequest);x(d)&&s(e,function(a,b){"content-type"===S(b)&&delete e[b]});x(a.withCredentials)&&!x(b.withCredentials)&&(a.withCredentials=b.withCredentials);
return m(a,d,e).then(c,c)},t],g=k.when(d);for(s(n,function(a){(a.request||a.requestError)&&f.unshift(a.request,a.requestError);(a.response||a.responseError)&&f.push(a.response,a.responseError)});f.length;){a=f.shift();var h=f.shift(),g=g.then(a,h)}g.success=function(a){g.then(function(b){a(b.data,b.status,b.headers,d)});return g};g.error=function(a){g.then(null,function(b){a(b.data,b.status,b.headers,d)});return g};return g}function m(c,f,h){function n(b,c,d,e){function f(){m(c,b,d,e)}K&&(200<=b&&
300>b?K.put(s,[b,c,Tc(d),e]):K.remove(s));a?g.$applyAsync(f):(f(),g.$$phase||g.$apply())}function m(a,b,d,e){b=Math.max(b,0);(200<=b&&300>b?u.resolve:u.reject)({data:a,status:b,headers:Uc(d),config:c,statusText:e})}function G(){var a=l.pendingRequests.indexOf(c);-1!==a&&l.pendingRequests.splice(a,1)}var u=k.defer(),I=u.promise,K,E,s=p(c.url,c.params);l.pendingRequests.push(c);I.then(G,G);!c.cache&&!b.cache||!1===c.cache||"GET"!==c.method&&"JSONP"!==c.method||(K=P(c.cache)?c.cache:P(b.cache)?b.cache:
q);if(K)if(E=K.get(s),z(E)){if(E&&A(E.then))return E.then(G,G),E;H(E)?m(E[1],E[0],qa(E[2]),E[3]):m(E,200,{},"OK")}else K.put(s,I);x(E)&&((E=Wc(c.url)?e.cookies()[c.xsrfCookieName||b.xsrfCookieName]:t)&&(h[c.xsrfHeaderName||b.xsrfHeaderName]=E),d(c.method,s,f,n,h,c.timeout,c.withCredentials,c.responseType));return I}function p(a,b){if(!b)return a;var c=[];Cd(b,function(a,b){null===a||x(a)||(H(a)||(a=[a]),s(a,function(a){P(a)&&(a=ea(a)?a.toISOString():ra(a));c.push(Da(b)+"="+Da(a))}))});0<c.length&&
(a+=(-1==a.indexOf("?")?"?":"&")+c.join("&"));return a}var q=f("$http"),n=[];s(c,function(a){n.unshift(J(a)?h.get(a):h.invoke(a))});l.pendingRequests=[];(function(a){s(arguments,function(a){l[a]=function(b,c){return l(F(c||{},{method:a,url:b}))}})})("get","delete","head","jsonp");(function(a){s(arguments,function(a){l[a]=function(b,c,d){return l(F(d||{},{method:a,url:b,data:c}))}})})("post","put","patch");l.defaults=b;return l}]}function tf(){return new N.XMLHttpRequest}function Je(){this.$get=["$browser",
"$window","$document",function(b,a,c){return uf(b,tf,b.defer,a.angular.callbacks,c[0])}]}function uf(b,a,c,d,e){function f(a,b,c){var f=e.createElement("script"),m=null;f.type="text/javascript";f.src=a;f.async=!0;m=function(a){f.removeEventListener("load",m,!1);f.removeEventListener("error",m,!1);e.body.removeChild(f);f=null;var g=-1,n="unknown";a&&("load"!==a.type||d[b].called||(a={type:"error"}),n=a.type,g="error"===a.type?404:200);c&&c(g,n)};f.addEventListener("load",m,!1);f.addEventListener("error",
m,!1);e.body.appendChild(f);return m}return function(e,k,h,l,m,p,q,n){function r(){C&&C();D&&D.abort()}function O(a,d,e,f,g){u&&c.cancel(u);C=D=null;a(d,e,f,g);b.$$completeOutstandingRequest(y)}b.$$incOutstandingRequestCount();k=k||b.url();if("jsonp"==S(e)){var B="_"+(d.counter++).toString(36);d[B]=function(a){d[B].data=a;d[B].called=!0};var C=f(k.replace("JSON_CALLBACK","angular.callbacks."+B),B,function(a,b){O(l,a,d[B].data,"",b);d[B]=y})}else{var D=a();D.open(e,k,!0);s(m,function(a,b){z(a)&&D.setRequestHeader(b,
a)});D.onload=function(){var a=D.statusText||"",b="response"in D?D.response:D.responseText,c=1223===D.status?204:D.status;0===c&&(c=b?200:"file"==za(k).protocol?404:0);O(l,c,b,D.getAllResponseHeaders(),a)};e=function(){O(l,-1,null,null,"")};D.onerror=e;D.onabort=e;q&&(D.withCredentials=!0);if(n)try{D.responseType=n}catch(G){if("json"!==n)throw G;}D.send(h||null)}if(0<p)var u=c(r,p);else p&&A(p.then)&&p.then(r)}}function Ge(){var b="{{",a="}}";this.startSymbol=function(a){return a?(b=a,this):b};this.endSymbol=
function(b){return b?(a=b,this):a};this.$get=["$parse","$exceptionHandler","$sce",function(c,d,e){function f(a){return"\\\\\\"+a}function g(f,g,n,r){function O(c){return c.replace(l,b).replace(m,a)}function B(a){try{var b;var c=n?e.getTrusted(n,a):e.valueOf(a);if(null==c)b="";else{switch(typeof c){case "string":break;case "number":c=""+c;break;default:c=ra(c)}b=c}return b}catch(g){a=Yb("interr",f,g.toString()),d(a)}}r=!!r;for(var C,D,G=0,u=[],I=[],K=f.length,E=[],s=[];G<K;)if(-1!=(C=f.indexOf(b,G))&&
-1!=(D=f.indexOf(a,C+k)))G!==C&&E.push(O(f.substring(G,C))),G=f.substring(C+k,D),u.push(G),I.push(c(G,B)),G=D+h,s.push(E.length),E.push("");else{G!==K&&E.push(O(f.substring(G)));break}if(n&&1<E.length)throw Yb("noconcat",f);if(!g||u.length){var M=function(a){for(var b=0,c=u.length;b<c;b++){if(r&&x(a[b]))return;E[s[b]]=a[b]}return E.join("")};return F(function(a){var b=0,c=u.length,e=Array(c);try{for(;b<c;b++)e[b]=I[b](a);return M(e)}catch(g){a=Yb("interr",f,g.toString()),d(a)}},{exp:f,expressions:u,
$$watchDelegate:function(a,b,c){var d;return a.$watchGroup(I,function(c,e){var f=M(c);A(b)&&b.call(this,f,c!==e?d:f,a);d=f},c)}})}}var k=b.length,h=a.length,l=new RegExp(b.replace(/./g,f),"g"),m=new RegExp(a.replace(/./g,f),"g");g.startSymbol=function(){return b};g.endSymbol=function(){return a};return g}]}function He(){this.$get=["$rootScope","$window","$q","$$q",function(b,a,c,d){function e(e,k,h,l){var m=a.setInterval,p=a.clearInterval,q=0,n=z(l)&&!l,r=(n?d:c).defer(),O=r.promise;h=z(h)?h:0;O.then(null,
null,e);O.$$intervalId=m(function(){r.notify(q++);0<h&&q>=h&&(r.resolve(q),p(O.$$intervalId),delete f[O.$$intervalId]);n||b.$apply()},k);f[O.$$intervalId]=r;return O}var f={};e.cancel=function(b){return b&&b.$$intervalId in f?(f[b.$$intervalId].reject("canceled"),a.clearInterval(b.$$intervalId),delete f[b.$$intervalId],!0):!1};return e}]}function Pd(){this.$get=function(){return{id:"en-us",NUMBER_FORMATS:{DECIMAL_SEP:".",GROUP_SEP:",",PATTERNS:[{minInt:1,minFrac:0,maxFrac:3,posPre:"",posSuf:"",negPre:"-",
negSuf:"",gSize:3,lgSize:3},{minInt:1,minFrac:2,maxFrac:2,posPre:"\u00a4",posSuf:"",negPre:"(\u00a4",negSuf:")",gSize:3,lgSize:3}],CURRENCY_SYM:"$"},DATETIME_FORMATS:{MONTH:"January February March April May June July August September October November December".split(" "),SHORTMONTH:"Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "),DAY:"Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),SHORTDAY:"Sun Mon Tue Wed Thu Fri Sat".split(" "),AMPMS:["AM","PM"],medium:"MMM d, y h:mm:ss a",
"short":"M/d/yy h:mm a",fullDate:"EEEE, MMMM d, y",longDate:"MMMM d, y",mediumDate:"MMM d, y",shortDate:"M/d/yy",mediumTime:"h:mm:ss a",shortTime:"h:mm a"},pluralCat:function(b){return 1===b?"one":"other"}}}}function Zb(b){b=b.split("/");for(var a=b.length;a--;)b[a]=kb(b[a]);return b.join("/")}function Xc(b,a,c){b=za(b,c);a.$$protocol=b.protocol;a.$$host=b.hostname;a.$$port=aa(b.port)||vf[b.protocol]||null}function Yc(b,a,c){var d="/"!==b.charAt(0);d&&(b="/"+b);b=za(b,c);a.$$path=decodeURIComponent(d&&
"/"===b.pathname.charAt(0)?b.pathname.substring(1):b.pathname);a.$$search=qc(b.search);a.$$hash=decodeURIComponent(b.hash);a.$$path&&"/"!=a.$$path.charAt(0)&&(a.$$path="/"+a.$$path)}function va(b,a){if(0===a.indexOf(b))return a.substr(b.length)}function Fa(b){var a=b.indexOf("#");return-1==a?b:b.substr(0,a)}function $b(b){return b.substr(0,Fa(b).lastIndexOf("/")+1)}function ac(b,a){this.$$html5=!0;a=a||"";var c=$b(b);Xc(b,this,b);this.$$parse=function(a){var e=va(c,a);if(!J(e))throw bb("ipthprfx",
a,c);Yc(e,this,b);this.$$path||(this.$$path="/");this.$$compose()};this.$$compose=function(){var a=Ib(this.$$search),b=this.$$hash?"#"+kb(this.$$hash):"";this.$$url=Zb(this.$$path)+(a?"?"+a:"")+b;this.$$absUrl=c+this.$$url.substr(1)};this.$$parseLinkUrl=function(d,e){if(e&&"#"===e[0])return this.hash(e.slice(1)),!0;var f,g;(f=va(b,d))!==t?(g=f,g=(f=va(a,f))!==t?c+(va("/",f)||f):b+g):(f=va(c,d))!==t?g=c+f:c==d+"/"&&(g=c);g&&this.$$parse(g);return!!g}}function bc(b,a){var c=$b(b);Xc(b,this,b);this.$$parse=
function(d){var e=va(b,d)||va(c,d),e="#"==e.charAt(0)?va(a,e):this.$$html5?e:"";if(!J(e))throw bb("ihshprfx",d,a);Yc(e,this,b);d=this.$$path;var f=/^\/[A-Z]:(\/.*)/;0===e.indexOf(b)&&(e=e.replace(b,""));f.exec(e)||(d=(e=f.exec(d))?e[1]:d);this.$$path=d;this.$$compose()};this.$$compose=function(){var c=Ib(this.$$search),e=this.$$hash?"#"+kb(this.$$hash):"";this.$$url=Zb(this.$$path)+(c?"?"+c:"")+e;this.$$absUrl=b+(this.$$url?a+this.$$url:"")};this.$$parseLinkUrl=function(a,c){return Fa(b)==Fa(a)?(this.$$parse(a),
!0):!1}}function Zc(b,a){this.$$html5=!0;bc.apply(this,arguments);var c=$b(b);this.$$parseLinkUrl=function(d,e){if(e&&"#"===e[0])return this.hash(e.slice(1)),!0;var f,g;b==Fa(d)?f=d:(g=va(c,d))?f=b+a+g:c===d+"/"&&(f=c);f&&this.$$parse(f);return!!f};this.$$compose=function(){var c=Ib(this.$$search),e=this.$$hash?"#"+kb(this.$$hash):"";this.$$url=Zb(this.$$path)+(c?"?"+c:"")+e;this.$$absUrl=b+a+this.$$url}}function zb(b){return function(){return this[b]}}function $c(b,a){return function(c){if(x(c))return this[b];
this[b]=a(c);this.$$compose();return this}}function Ke(){var b="",a={enabled:!1,requireBase:!0,rewriteLinks:!0};this.hashPrefix=function(a){return z(a)?(b=a,this):b};this.html5Mode=function(b){return Ua(b)?(a.enabled=b,this):P(b)?(Ua(b.enabled)&&(a.enabled=b.enabled),Ua(b.requireBase)&&(a.requireBase=b.requireBase),Ua(b.rewriteLinks)&&(a.rewriteLinks=b.rewriteLinks),this):a};this.$get=["$rootScope","$browser","$sniffer","$rootElement",function(c,d,e,f){function g(a,b,c){var e=h.url(),f=h.$$state;
try{d.url(a,b,c),h.$$state=d.state()}catch(g){throw h.url(e),h.$$state=f,g;}}function k(a,b){c.$broadcast("$locationChangeSuccess",h.absUrl(),a,h.$$state,b)}var h,l;l=d.baseHref();var m=d.url(),p;if(a.enabled){if(!l&&a.requireBase)throw bb("nobase");p=m.substring(0,m.indexOf("/",m.indexOf("//")+2))+(l||"/");l=e.history?ac:Zc}else p=Fa(m),l=bc;h=new l(p,"#"+b);h.$$parseLinkUrl(m,m);h.$$state=d.state();var q=/^\s*(javascript|mailto):/i;f.on("click",function(b){if(a.rewriteLinks&&!b.ctrlKey&&!b.metaKey&&
2!=b.which){for(var e=v(b.target);"a"!==pa(e[0]);)if(e[0]===f[0]||!(e=e.parent())[0])return;var g=e.prop("href"),k=e.attr("href")||e.attr("xlink:href");P(g)&&"[object SVGAnimatedString]"===g.toString()&&(g=za(g.animVal).href);q.test(g)||!g||e.attr("target")||b.isDefaultPrevented()||!h.$$parseLinkUrl(g,k)||(b.preventDefault(),h.absUrl()!=d.url()&&(c.$apply(),N.angular["ff-684208-preventDefault"]=!0))}});h.absUrl()!=m&&d.url(h.absUrl(),!0);var n=!0;d.onUrlChange(function(a,b){c.$evalAsync(function(){var d=
h.absUrl(),e=h.$$state;h.$$parse(a);h.$$state=b;c.$broadcast("$locationChangeStart",a,d,b,e).defaultPrevented?(h.$$parse(d),h.$$state=e,g(d,!1,e)):(n=!1,k(d,e))});c.$$phase||c.$digest()});c.$watch(function(){var a=d.url(),b=d.state(),f=h.$$replace,l=a!==h.absUrl()||h.$$html5&&e.history&&b!==h.$$state;if(n||l)n=!1,c.$evalAsync(function(){c.$broadcast("$locationChangeStart",h.absUrl(),a,h.$$state,b).defaultPrevented?(h.$$parse(a),h.$$state=b):(l&&g(h.absUrl(),f,b===h.$$state?null:h.$$state),k(a,b))});
h.$$replace=!1});return h}]}function Le(){var b=!0,a=this;this.debugEnabled=function(a){return z(a)?(b=a,this):b};this.$get=["$window",function(c){function d(a){a instanceof Error&&(a.stack?a=a.message&&-1===a.stack.indexOf(a.message)?"Error: "+a.message+"\n"+a.stack:a.stack:a.sourceURL&&(a=a.message+"\n"+a.sourceURL+":"+a.line));return a}function e(a){var b=c.console||{},e=b[a]||b.log||y;a=!1;try{a=!!e.apply}catch(h){}return a?function(){var a=[];s(arguments,function(b){a.push(d(b))});return e.apply(b,
a)}:function(a,b){e(a,null==b?"":b)}}return{log:e("log"),info:e("info"),warn:e("warn"),error:e("error"),debug:function(){var c=e("debug");return function(){b&&c.apply(a,arguments)}}()}}]}function na(b,a){if("__defineGetter__"===b||"__defineSetter__"===b||"__lookupGetter__"===b||"__lookupSetter__"===b||"__proto__"===b)throw oa("isecfld",a);return b}function Aa(b,a){if(b){if(b.constructor===b)throw oa("isecfn",a);if(b.window===b)throw oa("isecwindow",a);if(b.children&&(b.nodeName||b.prop&&b.attr&&b.find))throw oa("isecdom",
a);if(b===Object)throw oa("isecobj",a);}return b}function cc(b){return b.constant}function Oa(b,a,c,d){Aa(b,d);a=a.split(".");for(var e,f=0;1<a.length;f++){e=na(a.shift(),d);var g=Aa(b[e],d);g||(g={},b[e]=g);b=g}e=na(a.shift(),d);Aa(b[e],d);return b[e]=c}function ad(b,a,c,d,e,f){na(b,f);na(a,f);na(c,f);na(d,f);na(e,f);return function(f,k){var h=k&&k.hasOwnProperty(b)?k:f;if(null==h)return h;h=h[b];if(!a)return h;if(null==h)return t;h=h[a];if(!c)return h;if(null==h)return t;h=h[c];if(!d)return h;if(null==
h)return t;h=h[d];return e?null==h?t:h=h[e]:h}}function bd(b,a,c){var d=cd[b];if(d)return d;var e=b.split("."),f=e.length;if(a.csp)d=6>f?ad(e[0],e[1],e[2],e[3],e[4],c):function(a,b){var d=0,g;do g=ad(e[d++],e[d++],e[d++],e[d++],e[d++],c)(a,b),b=t,a=g;while(d<f);return g};else{var g="";s(e,function(a,b){na(a,c);g+="if(s == null) return undefined;\ns="+(b?"s":'((l&&l.hasOwnProperty("'+a+'"))?l:s)')+"."+a+";\n"});g+="return s;";a=new Function("s","l",g);a.toString=da(g);d=a}d.sharedGetter=!0;d.assign=
function(a,c){return Oa(a,b,c,b)};return cd[b]=d}function dc(b){return A(b.valueOf)?b.valueOf():wf.call(b)}function Me(){var b=wa(),a={csp:!1};this.$get=["$filter","$sniffer",function(c,d){function e(a){var b=a;a.sharedGetter&&(b=function(b,c){return a(b,c)},b.literal=a.literal,b.constant=a.constant,b.assign=a.assign);return b}function f(a,b){for(var c=0,d=a.length;c<d;c++){var e=a[c];e.constant||(e.inputs?f(e.inputs,b):-1===b.indexOf(e)&&b.push(e))}return b}function g(a,b){return null==a||null==
b?a===b:"object"===typeof a&&(a=dc(a),"object"===typeof a)?!1:a===b||a!==a&&b!==b}function k(a,b,c,d){var e=d.$$inputs||(d.$$inputs=f(d.inputs,[])),h;if(1===e.length){var k=g,e=e[0];return a.$watch(function(a){var b=e(a);g(b,k)||(h=d(a),k=b&&dc(b));return h},b,c)}for(var l=[],m=0,p=e.length;m<p;m++)l[m]=g;return a.$watch(function(a){for(var b=!1,c=0,f=e.length;c<f;c++){var k=e[c](a);if(b||(b=!g(k,l[c])))l[c]=k&&dc(k)}b&&(h=d(a));return h},b,c)}function h(a,b,c,d){var e,f;return e=a.$watch(function(a){return d(a)},
function(a,c,d){f=a;A(b)&&b.apply(this,arguments);z(a)&&d.$$postDigest(function(){z(f)&&e()})},c)}function l(a,b,c,d){function e(a){var b=!0;s(a,function(a){z(a)||(b=!1)});return b}var f,g;return f=a.$watch(function(a){return d(a)},function(a,c,d){g=a;A(b)&&b.call(this,a,c,d);e(a)&&d.$$postDigest(function(){e(g)&&f()})},c)}function m(a,b,c,d){var e;return e=a.$watch(function(a){return d(a)},function(a,c,d){A(b)&&b.apply(this,arguments);e()},c)}function p(a,b){if(!b)return a;var c=function(c,d){var e=
a(c,d),f=b(e,c,d);return z(e)?f:e};a.$$watchDelegate&&a.$$watchDelegate!==k?c.$$watchDelegate=a.$$watchDelegate:b.$stateful||(c.$$watchDelegate=k,c.inputs=[a]);return c}a.csp=d.csp;return function(d,f){var g,O,B;switch(typeof d){case "string":return B=d=d.trim(),g=b[B],g||(":"===d.charAt(0)&&":"===d.charAt(1)&&(O=!0,d=d.substring(2)),g=new ec(a),g=(new cb(g,c,a)).parse(d),g.constant?g.$$watchDelegate=m:O?(g=e(g),g.$$watchDelegate=g.literal?l:h):g.inputs&&(g.$$watchDelegate=k),b[B]=g),p(g,f);case "function":return p(d,
f);default:return p(y,f)}}}]}function Oe(){this.$get=["$rootScope","$exceptionHandler",function(b,a){return dd(function(a){b.$evalAsync(a)},a)}]}function Pe(){this.$get=["$browser","$exceptionHandler",function(b,a){return dd(function(a){b.defer(a)},a)}]}function dd(b,a){function c(a,b,c){function d(b){return function(c){e||(e=!0,b.call(a,c))}}var e=!1;return[d(b),d(c)]}function d(){this.$$state={status:0}}function e(a,b){return function(c){b.call(a,c)}}function f(c){!c.processScheduled&&c.pending&&
(c.processScheduled=!0,b(function(){var b,d,e;e=c.pending;c.processScheduled=!1;c.pending=t;for(var f=0,g=e.length;f<g;++f){d=e[f][0];b=e[f][c.status];try{A(b)?d.resolve(b(c.value)):1===c.status?d.resolve(c.value):d.reject(c.value)}catch(h){d.reject(h),a(h)}}}))}function g(){this.promise=new d;this.resolve=e(this,this.resolve);this.reject=e(this,this.reject);this.notify=e(this,this.notify)}var k=w("$q",TypeError);d.prototype={then:function(a,b,c){var d=new g;this.$$state.pending=this.$$state.pending||
[];this.$$state.pending.push([d,a,b,c]);0<this.$$state.status&&f(this.$$state);return d.promise},"catch":function(a){return this.then(null,a)},"finally":function(a,b){return this.then(function(b){return l(b,!0,a)},function(b){return l(b,!1,a)},b)}};g.prototype={resolve:function(a){this.promise.$$state.status||(a===this.promise?this.$$reject(k("qcycle",a)):this.$$resolve(a))},$$resolve:function(b){var d,e;e=c(this,this.$$resolve,this.$$reject);try{if(P(b)||A(b))d=b&&b.then;A(d)?(this.promise.$$state.status=
-1,d.call(b,e[0],e[1],this.notify)):(this.promise.$$state.value=b,this.promise.$$state.status=1,f(this.promise.$$state))}catch(g){e[1](g),a(g)}},reject:function(a){this.promise.$$state.status||this.$$reject(a)},$$reject:function(a){this.promise.$$state.value=a;this.promise.$$state.status=2;f(this.promise.$$state)},notify:function(c){var d=this.promise.$$state.pending;0>=this.promise.$$state.status&&d&&d.length&&b(function(){for(var b,e,f=0,g=d.length;f<g;f++){e=d[f][0];b=d[f][3];try{e.notify(A(b)?
b(c):c)}catch(h){a(h)}}})}};var h=function(a,b){var c=new g;b?c.resolve(a):c.reject(a);return c.promise},l=function(a,b,c){var d=null;try{A(c)&&(d=c())}catch(e){return h(e,!1)}return d&&A(d.then)?d.then(function(){return h(a,b)},function(a){return h(a,!1)}):h(a,b)},m=function(a,b,c,d){var e=new g;e.resolve(a);return e.promise.then(b,c,d)},p=function n(a){if(!A(a))throw k("norslvr",a);if(!(this instanceof n))return new n(a);var b=new g;a(function(a){b.resolve(a)},function(a){b.reject(a)});return b.promise};
p.defer=function(){return new g};p.reject=function(a){var b=new g;b.reject(a);return b.promise};p.when=m;p.all=function(a){var b=new g,c=0,d=H(a)?[]:{};s(a,function(a,e){c++;m(a).then(function(a){d.hasOwnProperty(e)||(d[e]=a,--c||b.resolve(d))},function(a){d.hasOwnProperty(e)||b.reject(a)})});0===c&&b.resolve(d);return b.promise};return p}function Ye(){this.$get=["$window","$timeout",function(b,a){var c=b.requestAnimationFrame||b.webkitRequestAnimationFrame||b.mozRequestAnimationFrame,d=b.cancelAnimationFrame||
b.webkitCancelAnimationFrame||b.mozCancelAnimationFrame||b.webkitCancelRequestAnimationFrame,e=!!c,f=e?function(a){var b=c(a);return function(){d(b)}}:function(b){var c=a(b,16.66,!1);return function(){a.cancel(c)}};f.supported=e;return f}]}function Ne(){var b=10,a=w("$rootScope"),c=null,d=null;this.digestTtl=function(a){arguments.length&&(b=a);return b};this.$get=["$injector","$exceptionHandler","$parse","$browser",function(e,f,g,k){function h(){this.$id=++gb;this.$$phase=this.$parent=this.$$watchers=
this.$$nextSibling=this.$$prevSibling=this.$$childHead=this.$$childTail=null;this.$root=this;this.$$destroyed=!1;this.$$listeners={};this.$$listenerCount={};this.$$isolateBindings=null}function l(b){if(r.$$phase)throw a("inprog",r.$$phase);r.$$phase=b}function m(a,b,c){do a.$$listenerCount[c]-=b,0===a.$$listenerCount[c]&&delete a.$$listenerCount[c];while(a=a.$parent)}function p(){}function q(){for(;C.length;)try{C.shift()()}catch(a){f(a)}d=null}function n(){null===d&&(d=k.defer(function(){r.$apply(q)}))}
h.prototype={constructor:h,$new:function(a,b){function c(){d.$$destroyed=!0}var d;b=b||this;a?(d=new h,d.$root=this.$root):(this.$$ChildScope||(this.$$ChildScope=function(){this.$$watchers=this.$$nextSibling=this.$$childHead=this.$$childTail=null;this.$$listeners={};this.$$listenerCount={};this.$id=++gb;this.$$ChildScope=null},this.$$ChildScope.prototype=this),d=new this.$$ChildScope);d.$parent=b;d.$$prevSibling=b.$$childTail;b.$$childHead?(b.$$childTail.$$nextSibling=d,b.$$childTail=d):b.$$childHead=
b.$$childTail=d;(a||b!=this)&&d.$on("$destroy",c);return d},$watch:function(a,b,d){var e=g(a);if(e.$$watchDelegate)return e.$$watchDelegate(this,b,d,e);var f=this.$$watchers,h={fn:b,last:p,get:e,exp:a,eq:!!d};c=null;A(b)||(h.fn=y);f||(f=this.$$watchers=[]);f.unshift(h);return function(){Va(f,h);c=null}},$watchGroup:function(a,b){function c(){h=!1;k?(k=!1,b(e,e,g)):b(e,d,g)}var d=Array(a.length),e=Array(a.length),f=[],g=this,h=!1,k=!0;if(!a.length){var l=!0;g.$evalAsync(function(){l&&b(e,e,g)});return function(){l=
!1}}if(1===a.length)return this.$watch(a[0],function(a,c,f){e[0]=a;d[0]=c;b(e,a===c?e:d,f)});s(a,function(a,b){var k=g.$watch(a,function(a,f){e[b]=a;d[b]=f;h||(h=!0,g.$evalAsync(c))});f.push(k)});return function(){for(;f.length;)f.shift()()}},$watchCollection:function(a,b){function c(a){e=a;var b,d,g,h;if(P(e))if(Qa(e))for(f!==p&&(f=p,r=f.length=0,l++),a=e.length,r!==a&&(l++,f.length=r=a),b=0;b<a;b++)h=f[b],g=e[b],d=h!==h&&g!==g,d||h===g||(l++,f[b]=g);else{f!==q&&(f=q={},r=0,l++);a=0;for(b in e)e.hasOwnProperty(b)&&
(a++,g=e[b],h=f[b],b in f?(d=h!==h&&g!==g,d||h===g||(l++,f[b]=g)):(r++,f[b]=g,l++));if(r>a)for(b in l++,f)e.hasOwnProperty(b)||(r--,delete f[b])}else f!==e&&(f=e,l++);return l}c.$stateful=!0;var d=this,e,f,h,k=1<b.length,l=0,m=g(a,c),p=[],q={},n=!0,r=0;return this.$watch(m,function(){n?(n=!1,b(e,e,d)):b(e,h,d);if(k)if(P(e))if(Qa(e)){h=Array(e.length);for(var a=0;a<e.length;a++)h[a]=e[a]}else for(a in h={},e)Hb.call(e,a)&&(h[a]=e[a]);else h=e})},$digest:function(){var e,g,h,m,n,s,C=b,M,t=[],W,R,z;
l("$digest");k.$$checkUrlChange();this===r&&null!==d&&(k.defer.cancel(d),q());c=null;do{s=!1;for(M=this;O.length;){try{z=O.shift(),z.scope.$eval(z.expression)}catch(w){f(w)}c=null}a:do{if(m=M.$$watchers)for(n=m.length;n--;)try{if(e=m[n])if((g=e.get(M))!==(h=e.last)&&!(e.eq?la(g,h):"number"===typeof g&&"number"===typeof h&&isNaN(g)&&isNaN(h)))s=!0,c=e,e.last=e.eq?Ca(g,null):g,e.fn(g,h===p?g:h,M),5>C&&(W=4-C,t[W]||(t[W]=[]),R=A(e.exp)?"fn: "+(e.exp.name||e.exp.toString()):e.exp,R+="; newVal: "+ra(g)+
"; oldVal: "+ra(h),t[W].push(R));else if(e===c){s=!1;break a}}catch(v){f(v)}if(!(m=M.$$childHead||M!==this&&M.$$nextSibling))for(;M!==this&&!(m=M.$$nextSibling);)M=M.$parent}while(M=m);if((s||O.length)&&!C--)throw r.$$phase=null,a("infdig",b,ra(t));}while(s||O.length);for(r.$$phase=null;B.length;)try{B.shift()()}catch(y){f(y)}},$destroy:function(){if(!this.$$destroyed){var a=this.$parent;this.$broadcast("$destroy");this.$$destroyed=!0;if(this!==r){for(var b in this.$$listenerCount)m(this,this.$$listenerCount[b],
b);a.$$childHead==this&&(a.$$childHead=this.$$nextSibling);a.$$childTail==this&&(a.$$childTail=this.$$prevSibling);this.$$prevSibling&&(this.$$prevSibling.$$nextSibling=this.$$nextSibling);this.$$nextSibling&&(this.$$nextSibling.$$prevSibling=this.$$prevSibling);this.$destroy=this.$digest=this.$apply=this.$evalAsync=this.$applyAsync=y;this.$on=this.$watch=this.$watchGroup=function(){return y};this.$$listeners={};this.$parent=this.$$nextSibling=this.$$prevSibling=this.$$childHead=this.$$childTail=
this.$root=this.$$watchers=null}}},$eval:function(a,b){return g(a)(this,b)},$evalAsync:function(a){r.$$phase||O.length||k.defer(function(){O.length&&r.$digest()});O.push({scope:this,expression:a})},$$postDigest:function(a){B.push(a)},$apply:function(a){try{return l("$apply"),this.$eval(a)}catch(b){f(b)}finally{r.$$phase=null;try{r.$digest()}catch(c){throw f(c),c;}}},$applyAsync:function(a){function b(){c.$eval(a)}var c=this;a&&C.push(b);n()},$on:function(a,b){var c=this.$$listeners[a];c||(this.$$listeners[a]=
c=[]);c.push(b);var d=this;do d.$$listenerCount[a]||(d.$$listenerCount[a]=0),d.$$listenerCount[a]++;while(d=d.$parent);var e=this;return function(){var d=c.indexOf(b);-1!==d&&(c[d]=null,m(e,1,a))}},$emit:function(a,b){var c=[],d,e=this,g=!1,h={name:a,targetScope:e,stopPropagation:function(){g=!0},preventDefault:function(){h.defaultPrevented=!0},defaultPrevented:!1},k=ib([h],arguments,1),l,m;do{d=e.$$listeners[a]||c;h.currentScope=e;l=0;for(m=d.length;l<m;l++)if(d[l])try{d[l].apply(null,k)}catch(p){f(p)}else d.splice(l,
1),l--,m--;if(g)return h.currentScope=null,h;e=e.$parent}while(e);h.currentScope=null;return h},$broadcast:function(a,b){var c=this,d=this,e={name:a,targetScope:this,preventDefault:function(){e.defaultPrevented=!0},defaultPrevented:!1};if(!this.$$listenerCount[a])return e;for(var g=ib([e],arguments,1),h,k;c=d;){e.currentScope=c;d=c.$$listeners[a]||[];h=0;for(k=d.length;h<k;h++)if(d[h])try{d[h].apply(null,g)}catch(l){f(l)}else d.splice(h,1),h--,k--;if(!(d=c.$$listenerCount[a]&&c.$$childHead||c!==this&&
c.$$nextSibling))for(;c!==this&&!(d=c.$$nextSibling);)c=c.$parent}e.currentScope=null;return e}};var r=new h,O=r.$$asyncQueue=[],B=r.$$postDigestQueue=[],C=r.$$applyAsyncQueue=[];return r}]}function Qd(){var b=/^\s*(https?|ftp|mailto|tel|file):/,a=/^\s*((https?|ftp|file|blob):|data:image\/)/;this.aHrefSanitizationWhitelist=function(a){return z(a)?(b=a,this):b};this.imgSrcSanitizationWhitelist=function(b){return z(b)?(a=b,this):a};this.$get=function(){return function(c,d){var e=d?a:b,f;f=za(c).href;
return""===f||f.match(e)?c:"unsafe:"+f}}}function xf(b){if("self"===b)return b;if(J(b)){if(-1<b.indexOf("***"))throw Ba("iwcard",b);b=ed(b).replace("\\*\\*",".*").replace("\\*","[^:/.?&;]*");return new RegExp("^"+b+"$")}if(hb(b))return new RegExp("^"+b.source+"$");throw Ba("imatcher");}function fd(b){var a=[];z(b)&&s(b,function(b){a.push(xf(b))});return a}function Re(){this.SCE_CONTEXTS=ja;var b=["self"],a=[];this.resourceUrlWhitelist=function(a){arguments.length&&(b=fd(a));return b};this.resourceUrlBlacklist=
function(b){arguments.length&&(a=fd(b));return a};this.$get=["$injector",function(c){function d(a,b){return"self"===a?Wc(b):!!a.exec(b.href)}function e(a){var b=function(a){this.$$unwrapTrustedValue=function(){return a}};a&&(b.prototype=new a);b.prototype.valueOf=function(){return this.$$unwrapTrustedValue()};b.prototype.toString=function(){return this.$$unwrapTrustedValue().toString()};return b}var f=function(a){throw Ba("unsafe");};c.has("$sanitize")&&(f=c.get("$sanitize"));var g=e(),k={};k[ja.HTML]=
e(g);k[ja.CSS]=e(g);k[ja.URL]=e(g);k[ja.JS]=e(g);k[ja.RESOURCE_URL]=e(k[ja.URL]);return{trustAs:function(a,b){var c=k.hasOwnProperty(a)?k[a]:null;if(!c)throw Ba("icontext",a,b);if(null===b||b===t||""===b)return b;if("string"!==typeof b)throw Ba("itype",a);return new c(b)},getTrusted:function(c,e){if(null===e||e===t||""===e)return e;var g=k.hasOwnProperty(c)?k[c]:null;if(g&&e instanceof g)return e.$$unwrapTrustedValue();if(c===ja.RESOURCE_URL){var g=za(e.toString()),p,q,n=!1;p=0;for(q=b.length;p<q;p++)if(d(b[p],
g)){n=!0;break}if(n)for(p=0,q=a.length;p<q;p++)if(d(a[p],g)){n=!1;break}if(n)return e;throw Ba("insecurl",e.toString());}if(c===ja.HTML)return f(e);throw Ba("unsafe");},valueOf:function(a){return a instanceof g?a.$$unwrapTrustedValue():a}}}]}function Qe(){var b=!0;this.enabled=function(a){arguments.length&&(b=!!a);return b};this.$get=["$parse","$sceDelegate",function(a,c){if(b&&8>Ha)throw Ba("iequirks");var d=qa(ja);d.isEnabled=function(){return b};d.trustAs=c.trustAs;d.getTrusted=c.getTrusted;d.valueOf=
c.valueOf;b||(d.trustAs=d.getTrusted=function(a,b){return b},d.valueOf=Sa);d.parseAs=function(b,c){var e=a(c);return e.literal&&e.constant?e:a(c,function(a){return d.getTrusted(b,a)})};var e=d.parseAs,f=d.getTrusted,g=d.trustAs;s(ja,function(a,b){var c=S(b);d[$a("parse_as_"+c)]=function(b){return e(a,b)};d[$a("get_trusted_"+c)]=function(b){return f(a,b)};d[$a("trust_as_"+c)]=function(b){return g(a,b)}});return d}]}function Se(){this.$get=["$window","$document",function(b,a){var c={},d=aa((/android (\d+)/.exec(S((b.navigator||
{}).userAgent))||[])[1]),e=/Boxee/i.test((b.navigator||{}).userAgent),f=a[0]||{},g,k=/^(Moz|webkit|ms)(?=[A-Z])/,h=f.body&&f.body.style,l=!1,m=!1;if(h){for(var p in h)if(l=k.exec(p)){g=l[0];g=g.substr(0,1).toUpperCase()+g.substr(1);break}g||(g="WebkitOpacity"in h&&"webkit");l=!!("transition"in h||g+"Transition"in h);m=!!("animation"in h||g+"Animation"in h);!d||l&&m||(l=J(f.body.style.webkitTransition),m=J(f.body.style.webkitAnimation))}return{history:!(!b.history||!b.history.pushState||4>d||e),hasEvent:function(a){if("input"==
a&&9==Ha)return!1;if(x(c[a])){var b=f.createElement("div");c[a]="on"+a in b}return c[a]},csp:Ya(),vendorPrefix:g,transitions:l,animations:m,android:d}}]}function Ue(){this.$get=["$templateCache","$http","$q",function(b,a,c){function d(e,f){d.totalPendingRequests++;var g=a.defaults&&a.defaults.transformResponse;if(H(g))for(var k=g,g=[],h=0;h<k.length;++h){var l=k[h];l!==Wb&&g.push(l)}else g===Wb&&(g=null);return a.get(e,{cache:b,transformResponse:g}).then(function(a){a=a.data;d.totalPendingRequests--;
b.put(e,a);return a},function(){d.totalPendingRequests--;if(!f)throw ia("tpload",e);return c.reject()})}d.totalPendingRequests=0;return d}]}function Ve(){this.$get=["$rootScope","$browser","$location",function(b,a,c){return{findBindings:function(a,b,c){a=a.getElementsByClassName("ng-binding");var g=[];s(a,function(a){var d=ta.element(a).data("$binding");d&&s(d,function(d){c?(new RegExp("(^|\\s)"+ed(b)+"(\\s|\\||$)")).test(d)&&g.push(a):-1!=d.indexOf(b)&&g.push(a)})});return g},findModels:function(a,
b,c){for(var g=["ng-","data-ng-","ng\\:"],k=0;k<g.length;++k){var h=a.querySelectorAll("["+g[k]+"model"+(c?"=":"*=")+'"'+b+'"]');if(h.length)return h}},getLocation:function(){return c.url()},setLocation:function(a){a!==c.url()&&(c.url(a),b.$digest())},whenStable:function(b){a.notifyWhenNoOutstandingRequests(b)}}}]}function We(){this.$get=["$rootScope","$browser","$q","$$q","$exceptionHandler",function(b,a,c,d,e){function f(f,h,l){var m=z(l)&&!l,p=(m?d:c).defer(),q=p.promise;h=a.defer(function(){try{p.resolve(f())}catch(a){p.reject(a),
e(a)}finally{delete g[q.$$timeoutId]}m||b.$apply()},h);q.$$timeoutId=h;g[h]=p;return q}var g={};f.cancel=function(b){return b&&b.$$timeoutId in g?(g[b.$$timeoutId].reject("canceled"),delete g[b.$$timeoutId],a.defer.cancel(b.$$timeoutId)):!1};return f}]}function za(b,a){var c=b;Ha&&(Z.setAttribute("href",c),c=Z.href);Z.setAttribute("href",c);return{href:Z.href,protocol:Z.protocol?Z.protocol.replace(/:$/,""):"",host:Z.host,search:Z.search?Z.search.replace(/^\?/,""):"",hash:Z.hash?Z.hash.replace(/^#/,
""):"",hostname:Z.hostname,port:Z.port,pathname:"/"===Z.pathname.charAt(0)?Z.pathname:"/"+Z.pathname}}function Wc(b){b=J(b)?za(b):b;return b.protocol===gd.protocol&&b.host===gd.host}function Xe(){this.$get=da(N)}function Bc(b){function a(c,d){if(P(c)){var e={};s(c,function(b,c){e[c]=a(c,b)});return e}return b.factory(c+"Filter",d)}this.register=a;this.$get=["$injector",function(a){return function(b){return a.get(b+"Filter")}}];a("currency",hd);a("date",id);a("filter",yf);a("json",zf);a("limitTo",
Af);a("lowercase",Bf);a("number",jd);a("orderBy",kd);a("uppercase",Cf)}function yf(){return function(b,a,c){if(!H(b))return b;var d=typeof c,e=[];e.check=function(a,b){for(var c=0;c<e.length;c++)if(!e[c](a,b))return!1;return!0};"function"!==d&&(c="boolean"===d&&c?function(a,b){return ta.equals(a,b)}:function(a,b){if(a&&b&&"object"===typeof a&&"object"===typeof b){for(var d in a)if("$"!==d.charAt(0)&&Hb.call(a,d)&&c(a[d],b[d]))return!0;return!1}b=(""+b).toLowerCase();return-1<(""+a).toLowerCase().indexOf(b)});
var f=function(a,b){if("string"===typeof b&&"!"===b.charAt(0))return!f(a,b.substr(1));switch(typeof a){case "boolean":case "number":case "string":return c(a,b);case "object":switch(typeof b){case "object":return c(a,b);default:for(var d in a)if("$"!==d.charAt(0)&&f(a[d],b))return!0}return!1;case "array":for(d=0;d<a.length;d++)if(f(a[d],b))return!0;return!1;default:return!1}};switch(typeof a){case "boolean":case "number":case "string":a={$:a};case "object":for(var g in a)(function(b){"undefined"!==
typeof a[b]&&e.push(function(c){return f("$"==b?c:c&&c[b],a[b])})})(g);break;case "function":e.push(a);break;default:return b}d=[];for(g=0;g<b.length;g++){var k=b[g];e.check(k,g)&&d.push(k)}return d}}function hd(b){var a=b.NUMBER_FORMATS;return function(b,d,e){x(d)&&(d=a.CURRENCY_SYM);x(e)&&(e=2);return null==b?b:ld(b,a.PATTERNS[1],a.GROUP_SEP,a.DECIMAL_SEP,e).replace(/\u00A4/g,d)}}function jd(b){var a=b.NUMBER_FORMATS;return function(b,d){return null==b?b:ld(b,a.PATTERNS[0],a.GROUP_SEP,a.DECIMAL_SEP,
d)}}function ld(b,a,c,d,e){if(!isFinite(b)||P(b))return"";var f=0>b;b=Math.abs(b);var g=b+"",k="",h=[],l=!1;if(-1!==g.indexOf("e")){var m=g.match(/([\d\.]+)e(-?)(\d+)/);m&&"-"==m[2]&&m[3]>e+1?(g="0",b=0):(k=g,l=!0)}if(l)0<e&&-1<b&&1>b&&(k=b.toFixed(e));else{g=(g.split(md)[1]||"").length;x(e)&&(e=Math.min(Math.max(a.minFrac,g),a.maxFrac));b=+(Math.round(+(b.toString()+"e"+e)).toString()+"e"+-e);0===b&&(f=!1);b=(""+b).split(md);g=b[0];b=b[1]||"";var m=0,p=a.lgSize,q=a.gSize;if(g.length>=p+q)for(m=g.length-
p,l=0;l<m;l++)0===(m-l)%q&&0!==l&&(k+=c),k+=g.charAt(l);for(l=m;l<g.length;l++)0===(g.length-l)%p&&0!==l&&(k+=c),k+=g.charAt(l);for(;b.length<e;)b+="0";e&&"0"!==e&&(k+=d+b.substr(0,e))}h.push(f?a.negPre:a.posPre);h.push(k);h.push(f?a.negSuf:a.posSuf);return h.join("")}function Ab(b,a,c){var d="";0>b&&(d="-",b=-b);for(b=""+b;b.length<a;)b="0"+b;c&&(b=b.substr(b.length-a));return d+b}function $(b,a,c,d){c=c||0;return function(e){e=e["get"+b]();if(0<c||e>-c)e+=c;0===e&&-12==c&&(e=12);return Ab(e,a,d)}}
function Bb(b,a){return function(c,d){var e=c["get"+b](),f=ob(a?"SHORT"+b:b);return d[f][e]}}function nd(b){var a=(new Date(b,0,1)).getDay();return new Date(b,0,(4>=a?5:12)-a)}function od(b){return function(a){var c=nd(a.getFullYear());a=+new Date(a.getFullYear(),a.getMonth(),a.getDate()+(4-a.getDay()))-+c;a=1+Math.round(a/6048E5);return Ab(a,b)}}function id(b){function a(a){var b;if(b=a.match(c)){a=new Date(0);var f=0,g=0,k=b[8]?a.setUTCFullYear:a.setFullYear,h=b[8]?a.setUTCHours:a.setHours;b[9]&&
(f=aa(b[9]+b[10]),g=aa(b[9]+b[11]));k.call(a,aa(b[1]),aa(b[2])-1,aa(b[3]));f=aa(b[4]||0)-f;g=aa(b[5]||0)-g;k=aa(b[6]||0);b=Math.round(1E3*parseFloat("0."+(b[7]||0)));h.call(a,f,g,k,b)}return a}var c=/^(\d{4})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/;return function(c,e,f){var g="",k=[],h,l;e=e||"mediumDate";e=b.DATETIME_FORMATS[e]||e;J(c)&&(c=Df.test(c)?aa(c):a(c));X(c)&&(c=new Date(c));if(!ea(c))return c;for(;e;)(l=Ef.exec(e))?(k=ib(k,l,1),e=k.pop()):
(k.push(e),e=null);f&&"UTC"===f&&(c=new Date(c.getTime()),c.setMinutes(c.getMinutes()+c.getTimezoneOffset()));s(k,function(a){h=Ff[a];g+=h?h(c,b.DATETIME_FORMATS):a.replace(/(^'|'$)/g,"").replace(/''/g,"'")});return g}}function zf(){return function(b){return ra(b,!0)}}function Af(){return function(b,a){X(b)&&(b=b.toString());if(!H(b)&&!J(b))return b;a=Infinity===Math.abs(Number(a))?Number(a):aa(a);if(J(b))return a?0<=a?b.slice(0,a):b.slice(a,b.length):"";var c=[],d,e;a>b.length?a=b.length:a<-b.length&&
(a=-b.length);0<a?(d=0,e=a):(d=b.length+a,e=b.length);for(;d<e;d++)c.push(b[d]);return c}}function kd(b){return function(a,c,d){function e(a,b){return b?function(b,c){return a(c,b)}:a}function f(a,b){var c=typeof a,d=typeof b;return c==d?(ea(a)&&ea(b)&&(a=a.valueOf(),b=b.valueOf()),"string"==c&&(a=a.toLowerCase(),b=b.toLowerCase()),a===b?0:a<b?-1:1):c<d?-1:1}if(!Qa(a))return a;c=H(c)?c:[c];0===c.length&&(c=["+"]);c=c.map(function(a){var c=!1,d=a||Sa;if(J(a)){if("+"==a.charAt(0)||"-"==a.charAt(0))c=
"-"==a.charAt(0),a=a.substring(1);if(""===a)return e(function(a,b){return f(a,b)},c);d=b(a);if(d.constant){var g=d();return e(function(a,b){return f(a[g],b[g])},c)}}return e(function(a,b){return f(d(a),d(b))},c)});for(var g=[],k=0;k<a.length;k++)g.push(a[k]);return g.sort(e(function(a,b){for(var d=0;d<c.length;d++){var e=c[d](a,b);if(0!==e)return e}return 0},d))}}function Ia(b){A(b)&&(b={link:b});b.restrict=b.restrict||"AC";return da(b)}function pd(b,a,c,d,e){var f=this,g=[],k=f.$$parentForm=b.parent().controller("form")||
Cb;f.$error={};f.$$success={};f.$pending=t;f.$name=e(a.name||a.ngForm||"")(c);f.$dirty=!1;f.$pristine=!0;f.$valid=!0;f.$invalid=!1;f.$submitted=!1;k.$addControl(f);f.$rollbackViewValue=function(){s(g,function(a){a.$rollbackViewValue()})};f.$commitViewValue=function(){s(g,function(a){a.$commitViewValue()})};f.$addControl=function(a){La(a.$name,"input");g.push(a);a.$name&&(f[a.$name]=a)};f.$$renameControl=function(a,b){var c=a.$name;f[c]===a&&delete f[c];f[b]=a;a.$name=b};f.$removeControl=function(a){a.$name&&
f[a.$name]===a&&delete f[a.$name];s(f.$pending,function(b,c){f.$setValidity(c,null,a)});s(f.$error,function(b,c){f.$setValidity(c,null,a)});Va(g,a)};qd({ctrl:this,$element:b,set:function(a,b,c){var d=a[b];d?-1===d.indexOf(c)&&d.push(c):a[b]=[c]},unset:function(a,b,c){var d=a[b];d&&(Va(d,c),0===d.length&&delete a[b])},parentForm:k,$animate:d});f.$setDirty=function(){d.removeClass(b,Pa);d.addClass(b,Db);f.$dirty=!0;f.$pristine=!1;k.$setDirty()};f.$setPristine=function(){d.setClass(b,Pa,Db+" ng-submitted");
f.$dirty=!1;f.$pristine=!0;f.$submitted=!1;s(g,function(a){a.$setPristine()})};f.$setUntouched=function(){s(g,function(a){a.$setUntouched()})};f.$setSubmitted=function(){d.addClass(b,"ng-submitted");f.$submitted=!0;k.$setSubmitted()}}function fc(b){b.$formatters.push(function(a){return b.$isEmpty(a)?a:a.toString()})}function db(b,a,c,d,e,f){var g=a[0].placeholder,k={},h=S(a[0].type);if(!e.android){var l=!1;a.on("compositionstart",function(a){l=!0});a.on("compositionend",function(){l=!1;m()})}var m=
function(b){if(!l){var e=a.val(),f=b&&b.type;Ha&&"input"===(b||k).type&&a[0].placeholder!==g?g=a[0].placeholder:("password"===h||c.ngTrim&&"false"===c.ngTrim||(e=T(e)),(d.$viewValue!==e||""===e&&d.$$hasNativeValidators)&&d.$setViewValue(e,f))}};if(e.hasEvent("input"))a.on("input",m);else{var p,q=function(a){p||(p=f.defer(function(){m(a);p=null}))};a.on("keydown",function(a){var b=a.keyCode;91===b||15<b&&19>b||37<=b&&40>=b||q(a)});if(e.hasEvent("paste"))a.on("paste cut",q)}a.on("change",m);d.$render=
function(){a.val(d.$isEmpty(d.$modelValue)?"":d.$viewValue)}}function Eb(b,a){return function(c,d){var e,f;if(ea(c))return c;if(J(c)){'"'==c.charAt(0)&&'"'==c.charAt(c.length-1)&&(c=c.substring(1,c.length-1));if(Gf.test(c))return new Date(c);b.lastIndex=0;if(e=b.exec(c))return e.shift(),f=d?{yyyy:d.getFullYear(),MM:d.getMonth()+1,dd:d.getDate(),HH:d.getHours(),mm:d.getMinutes(),ss:d.getSeconds(),sss:d.getMilliseconds()/1E3}:{yyyy:1970,MM:1,dd:1,HH:0,mm:0,ss:0,sss:0},s(e,function(b,c){c<a.length&&
(f[a[c]]=+b)}),new Date(f.yyyy,f.MM-1,f.dd,f.HH,f.mm,f.ss||0,1E3*f.sss||0)}return NaN}}function eb(b,a,c,d){return function(e,f,g,k,h,l,m){function p(a){return z(a)?ea(a)?a:c(a):t}rd(e,f,g,k);db(e,f,g,k,h,l);var q=k&&k.$options&&k.$options.timezone,n;k.$$parserName=b;k.$parsers.push(function(b){return k.$isEmpty(b)?null:a.test(b)?(b=c(b,n),"UTC"===q&&b.setMinutes(b.getMinutes()-b.getTimezoneOffset()),b):t});k.$formatters.push(function(a){if(k.$isEmpty(a))n=null;else{if(!ea(a))throw Fb("datefmt",a);
if((n=a)&&"UTC"===q){var b=6E4*n.getTimezoneOffset();n=new Date(n.getTime()+b)}return m("date")(a,d,q)}return""});if(z(g.min)||g.ngMin){var r;k.$validators.min=function(a){return k.$isEmpty(a)||x(r)||c(a)>=r};g.$observe("min",function(a){r=p(a);k.$validate()})}if(z(g.max)||g.ngMax){var s;k.$validators.max=function(a){return k.$isEmpty(a)||x(s)||c(a)<=s};g.$observe("max",function(a){s=p(a);k.$validate()})}k.$isEmpty=function(a){return!a||a.getTime&&a.getTime()!==a.getTime()}}}function rd(b,a,c,d){(d.$$hasNativeValidators=
P(a[0].validity))&&d.$parsers.push(function(b){var c=a.prop("validity")||{};return c.badInput&&!c.typeMismatch?t:b})}function sd(b,a,c,d,e){if(z(d)){b=b(d);if(!b.constant)throw w("ngModel")("constexpr",c,d);return b(a)}return e}function qd(b){function a(a,b){b&&!f[a]?(l.addClass(e,a),f[a]=!0):!b&&f[a]&&(l.removeClass(e,a),f[a]=!1)}function c(b,c){b=b?"-"+Kb(b,"-"):"";a(fb+b,!0===c);a(td+b,!1===c)}var d=b.ctrl,e=b.$element,f={},g=b.set,k=b.unset,h=b.parentForm,l=b.$animate;f[td]=!(f[fb]=e.hasClass(fb));
d.$setValidity=function(b,e,f){e===t?(d.$pending||(d.$pending={}),g(d.$pending,b,f)):(d.$pending&&k(d.$pending,b,f),ud(d.$pending)&&(d.$pending=t));Ua(e)?e?(k(d.$error,b,f),g(d.$$success,b,f)):(g(d.$error,b,f),k(d.$$success,b,f)):(k(d.$error,b,f),k(d.$$success,b,f));d.$pending?(a(vd,!0),d.$valid=d.$invalid=t,c("",null)):(a(vd,!1),d.$valid=ud(d.$error),d.$invalid=!d.$valid,c("",d.$valid));e=d.$pending&&d.$pending[b]?t:d.$error[b]?!1:d.$$success[b]?!0:null;c(b,e);h.$setValidity(b,e,d)}}function ud(b){if(b)for(var a in b)return!1;
return!0}function gc(b,a){b="ngClass"+b;return["$animate",function(c){function d(a,b){var c=[],d=0;a:for(;d<a.length;d++){for(var e=a[d],m=0;m<b.length;m++)if(e==b[m])continue a;c.push(e)}return c}function e(a){if(!H(a)){if(J(a))return a.split(" ");if(P(a)){var b=[];s(a,function(a,c){a&&(b=b.concat(c.split(" ")))});return b}}return a}return{restrict:"AC",link:function(f,g,k){function h(a,b){var c=g.data("$classCounts")||{},d=[];s(a,function(a){if(0<b||c[a])c[a]=(c[a]||0)+b,c[a]===+(0<b)&&d.push(a)});
g.data("$classCounts",c);return d.join(" ")}function l(b){if(!0===a||f.$index%2===a){var l=e(b||[]);if(!m){var n=h(l,1);k.$addClass(n)}else if(!la(b,m)){var r=e(m),n=d(l,r),l=d(r,l),n=h(n,1),l=h(l,-1);n&&n.length&&c.addClass(g,n);l&&l.length&&c.removeClass(g,l)}}m=qa(b)}var m;f.$watch(k[b],l,!0);k.$observe("class",function(a){l(f.$eval(k[b]))});"ngClass"!==b&&f.$watch("$index",function(c,d){var g=c&1;if(g!==(d&1)){var l=e(f.$eval(k[b]));g===a?(g=h(l,1),k.$addClass(g)):(g=h(l,-1),k.$removeClass(g))}})}}}]}
var Hf=/^\/(.+)\/([a-z]*)$/,S=function(b){return J(b)?b.toLowerCase():b},Hb=Object.prototype.hasOwnProperty,ob=function(b){return J(b)?b.toUpperCase():b},Ha,v,ma,Xa=[].slice,pf=[].splice,If=[].push,Ja=Object.prototype.toString,Wa=w("ng"),ta=N.angular||(N.angular={}),Za,gb=0;Ha=U.documentMode;y.$inject=[];Sa.$inject=[];var H=Array.isArray,T=function(b){return J(b)?b.trim():b},ed=function(b){return b.replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g,"\\$1").replace(/\x08/g,"\\x08")},Ya=function(){if(z(Ya.isActive_))return Ya.isActive_;
var b=!(!U.querySelector("[ng-csp]")&&!U.querySelector("[data-ng-csp]"));if(!b)try{new Function("")}catch(a){b=!0}return Ya.isActive_=b},lb=["ng-","data-ng-","ng:","x-ng-"],Kd=/[A-Z]/g,sc=!1,Lb,ka=1,jb=3,Od={full:"1.3.1",major:1,minor:3,dot:1,codeName:"spectral-lobster"};Q.expando="ng339";var tb=Q.cache={},ef=1;Q._data=function(b){return this.cache[b[this.expando]]||{}};var $e=/([\:\-\_]+(.))/g,af=/^moz([A-Z])/,Jf={mouseleave:"mouseout",mouseenter:"mouseover"},Ob=w("jqLite"),df=/^<(\w+)\s*\/?>(?:<\/\1>|)$/,
Nb=/<|&#?\w+;/,bf=/<([\w:]+)/,cf=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,ha={option:[1,'<select multiple="multiple">',"</select>"],thead:[1,"<table>","</table>"],col:[2,"<table><colgroup>","</colgroup></table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:[0,"",""]};ha.optgroup=ha.option;ha.tbody=ha.tfoot=ha.colgroup=ha.caption=ha.thead;ha.th=ha.td;var Ka=Q.prototype={ready:function(b){function a(){c||(c=
!0,b())}var c=!1;"complete"===U.readyState?setTimeout(a):(this.on("DOMContentLoaded",a),Q(N).on("load",a))},toString:function(){var b=[];s(this,function(a){b.push(""+a)});return"["+b.join(", ")+"]"},eq:function(b){return 0<=b?v(this[b]):v(this[this.length+b])},length:0,push:If,sort:[].sort,splice:[].splice},vb={};s("multiple selected checked disabled readOnly required open".split(" "),function(b){vb[S(b)]=b});var Kc={};s("input select option textarea button form details".split(" "),function(b){Kc[b]=
!0});var Lc={ngMinlength:"minlength",ngMaxlength:"maxlength",ngMin:"min",ngMax:"max",ngPattern:"pattern"};s({data:Qb,removeData:rb},function(b,a){Q[a]=b});s({data:Qb,inheritedData:ub,scope:function(b){return v.data(b,"$scope")||ub(b.parentNode||b,["$isolateScope","$scope"])},isolateScope:function(b){return v.data(b,"$isolateScope")||v.data(b,"$isolateScopeNoTemplate")},controller:Gc,injector:function(b){return ub(b,"$injector")},removeAttr:function(b,a){b.removeAttribute(a)},hasClass:Rb,css:function(b,
a,c){a=$a(a);if(z(c))b.style[a]=c;else return b.style[a]},attr:function(b,a,c){var d=S(a);if(vb[d])if(z(c))c?(b[a]=!0,b.setAttribute(a,d)):(b[a]=!1,b.removeAttribute(d));else return b[a]||(b.attributes.getNamedItem(a)||y).specified?d:t;else if(z(c))b.setAttribute(a,c);else if(b.getAttribute)return b=b.getAttribute(a,2),null===b?t:b},prop:function(b,a,c){if(z(c))b[a]=c;else return b[a]},text:function(){function b(a,b){if(x(b)){var d=a.nodeType;return d===ka||d===jb?a.textContent:""}a.textContent=b}
b.$dv="";return b}(),val:function(b,a){if(x(a)){if(b.multiple&&"select"===pa(b)){var c=[];s(b.options,function(a){a.selected&&c.push(a.value||a.text)});return 0===c.length?null:c}return b.value}b.value=a},html:function(b,a){if(x(a))return b.innerHTML;qb(b,!0);b.innerHTML=a},empty:Hc},function(b,a){Q.prototype[a]=function(a,d){var e,f,g=this.length;if(b!==Hc&&(2==b.length&&b!==Rb&&b!==Gc?a:d)===t){if(P(a)){for(e=0;e<g;e++)if(b===Qb)b(this[e],a);else for(f in a)b(this[e],f,a[f]);return this}e=b.$dv;
g=e===t?Math.min(g,1):g;for(f=0;f<g;f++){var k=b(this[f],a,d);e=e?e+k:k}return e}for(e=0;e<g;e++)b(this[e],a,d);return this}});s({removeData:rb,on:function a(c,d,e,f){if(z(f))throw Ob("onargs");if(Cc(c)){var g=sb(c,!0);f=g.events;var k=g.handle;k||(k=g.handle=hf(c,f));for(var g=0<=d.indexOf(" ")?d.split(" "):[d],h=g.length;h--;){d=g[h];var l=f[d];l||(f[d]=[],"mouseenter"===d||"mouseleave"===d?a(c,Jf[d],function(a){var c=a.relatedTarget;c&&(c===this||this.contains(c))||k(a,d)}):"$destroy"!==d&&c.addEventListener(d,
k,!1),l=f[d]);l.push(e)}}},off:Fc,one:function(a,c,d){a=v(a);a.on(c,function f(){a.off(c,d);a.off(c,f)});a.on(c,d)},replaceWith:function(a,c){var d,e=a.parentNode;qb(a);s(new Q(c),function(c){d?e.insertBefore(c,d.nextSibling):e.replaceChild(c,a);d=c})},children:function(a){var c=[];s(a.childNodes,function(a){a.nodeType===ka&&c.push(a)});return c},contents:function(a){return a.contentDocument||a.childNodes||[]},append:function(a,c){var d=a.nodeType;if(d===ka||11===d){c=new Q(c);for(var d=0,e=c.length;d<
e;d++)a.appendChild(c[d])}},prepend:function(a,c){if(a.nodeType===ka){var d=a.firstChild;s(new Q(c),function(c){a.insertBefore(c,d)})}},wrap:function(a,c){c=v(c).eq(0).clone()[0];var d=a.parentNode;d&&d.replaceChild(c,a);c.appendChild(a)},remove:Ic,detach:function(a){Ic(a,!0)},after:function(a,c){var d=a,e=a.parentNode;c=new Q(c);for(var f=0,g=c.length;f<g;f++){var k=c[f];e.insertBefore(k,d.nextSibling);d=k}},addClass:Tb,removeClass:Sb,toggleClass:function(a,c,d){c&&s(c.split(" "),function(c){var f=
d;x(f)&&(f=!Rb(a,c));(f?Tb:Sb)(a,c)})},parent:function(a){return(a=a.parentNode)&&11!==a.nodeType?a:null},next:function(a){return a.nextElementSibling},find:function(a,c){return a.getElementsByTagName?a.getElementsByTagName(c):[]},clone:Pb,triggerHandler:function(a,c,d){var e,f,g=c.type||c,k=sb(a);if(k=(k=k&&k.events)&&k[g])e={preventDefault:function(){this.defaultPrevented=!0},isDefaultPrevented:function(){return!0===this.defaultPrevented},stopImmediatePropagation:function(){this.immediatePropagationStopped=
!0},isImmediatePropagationStopped:function(){return!0===this.immediatePropagationStopped},stopPropagation:y,type:g,target:a},c.type&&(e=F(e,c)),c=qa(k),f=d?[e].concat(d):[e],s(c,function(c){e.isImmediatePropagationStopped()||c.apply(a,f)})}},function(a,c){Q.prototype[c]=function(c,e,f){for(var g,k=0,h=this.length;k<h;k++)x(g)?(g=a(this[k],c,e,f),z(g)&&(g=v(g))):Ec(g,a(this[k],c,e,f));return z(g)?g:this};Q.prototype.bind=Q.prototype.on;Q.prototype.unbind=Q.prototype.off});ab.prototype={put:function(a,
c){this[Ma(a,this.nextUid)]=c},get:function(a){return this[Ma(a,this.nextUid)]},remove:function(a){var c=this[a=Ma(a,this.nextUid)];delete this[a];return c}};var Nc=/^function\s*[^\(]*\(\s*([^\)]*)\)/m,kf=/,/,lf=/^\s*(_?)(\S+?)\1\s*$/,Mc=/((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg,Ea=w("$injector");Jb.$$annotate=Ub;var Kf=w("$animate"),Ae=["$provide",function(a){this.$$selectors={};this.register=function(c,d){var e=c+"-animation";if(c&&"."!=c.charAt(0))throw Kf("notcsel",c);this.$$selectors[c.substr(1)]=e;
a.factory(e,d)};this.classNameFilter=function(a){1===arguments.length&&(this.$$classNameFilter=a instanceof RegExp?a:null);return this.$$classNameFilter};this.$get=["$$q","$$asyncCallback","$rootScope",function(a,d,e){function f(d){var f,g=a.defer();g.promise.$$cancelFn=function(){f&&f()};e.$$postDigest(function(){f=d(function(){g.resolve()})});return g.promise}function g(a,c){var d=[],e=[],f=wa();s((a.attr("class")||"").split(/\s+/),function(a){f[a]=!0});s(c,function(a,c){var g=f[c];!1===a&&g?e.push(c):
!0!==a||g||d.push(c)});return 0<d.length+e.length&&[d.length?d:null,e.length?e:null]}function k(a,c,d){for(var e=0,f=c.length;e<f;++e)a[c[e]]=d}function h(){m||(m=a.defer(),d(function(){m.resolve();m=null}));return m.promise}function l(a,c){if(ta.isObject(c)){var d=F(c.from||{},c.to||{});a.css(d)}}var m;return{animate:function(a,c,d){l(a,{from:c,to:d});return h()},enter:function(a,c,d,e){l(a,e);d?d.after(a):c.prepend(a);return h()},leave:function(a,c){a.remove();return h()},move:function(a,c,d,e){return this.enter(a,
c,d,e)},addClass:function(a,c,d){return this.setClass(a,c,[],d)},$$addClassImmediately:function(a,c,d){a=v(a);c=J(c)?c:H(c)?c.join(" "):"";s(a,function(a){Tb(a,c)});l(a,d);return h()},removeClass:function(a,c,d){return this.setClass(a,[],c,d)},$$removeClassImmediately:function(a,c,d){a=v(a);c=J(c)?c:H(c)?c.join(" "):"";s(a,function(a){Sb(a,c)});l(a,d);return h()},setClass:function(a,c,d,e){var h=this,l=!1;a=v(a);var m=a.data("$$animateClasses");m?e&&m.options&&(m.options=ta.extend(m.options||{},e)):
(m={classes:{},options:e},l=!0);e=m.classes;c=H(c)?c:c.split(" ");d=H(d)?d:d.split(" ");k(e,c,!0);k(e,d,!1);l&&(m.promise=f(function(c){var d=a.data("$$animateClasses");a.removeData("$$animateClasses");if(d){var e=g(a,d.classes);e&&h.$$setClassImmediately(a,e[0],e[1],d.options)}c()}),a.data("$$animateClasses",m));return m.promise},$$setClassImmediately:function(a,c,d,e){c&&this.$$addClassImmediately(a,c);d&&this.$$removeClassImmediately(a,d);l(a,e);return h()},enabled:y,cancel:y}}]}],ia=w("$compile");
uc.$inject=["$provide","$$sanitizeUriProvider"];var of=/^((?:x|data)[\:\-_])/i,Sc="application/json",Xb={"Content-Type":Sc+";charset=utf-8"},rf=/^\s*(\[|\{[^\{])/,sf=/[\}\]]\s*$/,qf=/^\)\]\}',?\n/,Yb=w("$interpolate"),Lf=/^([^\?#]*)(\?([^#]*))?(#(.*))?$/,vf={http:80,https:443,ftp:21},bb=w("$location"),Mf={$$html5:!1,$$replace:!1,absUrl:zb("$$absUrl"),url:function(a){if(x(a))return this.$$url;a=Lf.exec(a);a[1]&&this.path(decodeURIComponent(a[1]));(a[2]||a[1])&&this.search(a[3]||"");this.hash(a[5]||
"");return this},protocol:zb("$$protocol"),host:zb("$$host"),port:zb("$$port"),path:$c("$$path",function(a){a=null!==a?a.toString():"";return"/"==a.charAt(0)?a:"/"+a}),search:function(a,c){switch(arguments.length){case 0:return this.$$search;case 1:if(J(a)||X(a))a=a.toString(),this.$$search=qc(a);else if(P(a))a=Ca(a,{}),s(a,function(c,e){null==c&&delete a[e]}),this.$$search=a;else throw bb("isrcharg");break;default:x(c)||null===c?delete this.$$search[a]:this.$$search[a]=c}this.$$compose();return this},
hash:$c("$$hash",function(a){return null!==a?a.toString():""}),replace:function(){this.$$replace=!0;return this}};s([Zc,bc,ac],function(a){a.prototype=Object.create(Mf);a.prototype.state=function(c){if(!arguments.length)return this.$$state;if(a!==ac||!this.$$html5)throw bb("nostate");this.$$state=x(c)?null:c;return this}});var oa=w("$parse"),Nf=Function.prototype.call,Of=Function.prototype.apply,Pf=Function.prototype.bind,Gb=wa();s({"null":function(){return null},"true":function(){return!0},"false":function(){return!1},
undefined:function(){}},function(a,c){a.constant=a.literal=a.sharedGetter=!0;Gb[c]=a});Gb["this"]=function(a){return a};Gb["this"].sharedGetter=!0;var hc=F(wa(),{"+":function(a,c,d,e){d=d(a,c);e=e(a,c);return z(d)?z(e)?d+e:d:z(e)?e:t},"-":function(a,c,d,e){d=d(a,c);e=e(a,c);return(z(d)?d:0)-(z(e)?e:0)},"*":function(a,c,d,e){return d(a,c)*e(a,c)},"/":function(a,c,d,e){return d(a,c)/e(a,c)},"%":function(a,c,d,e){return d(a,c)%e(a,c)},"===":function(a,c,d,e){return d(a,c)===e(a,c)},"!==":function(a,
c,d,e){return d(a,c)!==e(a,c)},"==":function(a,c,d,e){return d(a,c)==e(a,c)},"!=":function(a,c,d,e){return d(a,c)!=e(a,c)},"<":function(a,c,d,e){return d(a,c)<e(a,c)},">":function(a,c,d,e){return d(a,c)>e(a,c)},"<=":function(a,c,d,e){return d(a,c)<=e(a,c)},">=":function(a,c,d,e){return d(a,c)>=e(a,c)},"&&":function(a,c,d,e){return d(a,c)&&e(a,c)},"||":function(a,c,d,e){return d(a,c)||e(a,c)},"!":function(a,c,d){return!d(a,c)},"=":!0,"|":!0}),Qf={n:"\n",f:"\f",r:"\r",t:"\t",v:"\v","'":"'",'"':'"'},
ec=function(a){this.options=a};ec.prototype={constructor:ec,lex:function(a){this.text=a;this.index=0;this.ch=t;for(this.tokens=[];this.index<this.text.length;)if(this.ch=this.text.charAt(this.index),this.is("\"'"))this.readString(this.ch);else if(this.isNumber(this.ch)||this.is(".")&&this.isNumber(this.peek()))this.readNumber();else if(this.isIdent(this.ch))this.readIdent();else if(this.is("(){}[].,;:?"))this.tokens.push({index:this.index,text:this.ch}),this.index++;else if(this.isWhitespace(this.ch))this.index++;
else{a=this.ch+this.peek();var c=a+this.peek(2),d=hc[this.ch],e=hc[a],f=hc[c];f?(this.tokens.push({index:this.index,text:c,fn:f}),this.index+=3):e?(this.tokens.push({index:this.index,text:a,fn:e}),this.index+=2):d?(this.tokens.push({index:this.index,text:this.ch,fn:d}),this.index+=1):this.throwError("Unexpected next character ",this.index,this.index+1)}return this.tokens},is:function(a){return-1!==a.indexOf(this.ch)},peek:function(a){a=a||1;return this.index+a<this.text.length?this.text.charAt(this.index+
a):!1},isNumber:function(a){return"0"<=a&&"9">=a},isWhitespace:function(a){return" "===a||"\r"===a||"\t"===a||"\n"===a||"\v"===a||"\u00a0"===a},isIdent:function(a){return"a"<=a&&"z">=a||"A"<=a&&"Z">=a||"_"===a||"$"===a},isExpOperator:function(a){return"-"===a||"+"===a||this.isNumber(a)},throwError:function(a,c,d){d=d||this.index;c=z(c)?"s "+c+"-"+this.index+" ["+this.text.substring(c,d)+"]":" "+d;throw oa("lexerr",a,c,this.text);},readNumber:function(){for(var a="",c=this.index;this.index<this.text.length;){var d=
S(this.text.charAt(this.index));if("."==d||this.isNumber(d))a+=d;else{var e=this.peek();if("e"==d&&this.isExpOperator(e))a+=d;else if(this.isExpOperator(d)&&e&&this.isNumber(e)&&"e"==a.charAt(a.length-1))a+=d;else if(!this.isExpOperator(d)||e&&this.isNumber(e)||"e"!=a.charAt(a.length-1))break;else this.throwError("Invalid exponent")}this.index++}a*=1;this.tokens.push({index:c,text:a,constant:!0,fn:function(){return a}})},readIdent:function(){for(var a=this.text,c="",d=this.index,e,f,g,k;this.index<
this.text.length;){k=this.text.charAt(this.index);if("."===k||this.isIdent(k)||this.isNumber(k))"."===k&&(e=this.index),c+=k;else break;this.index++}e&&"."===c[c.length-1]&&(this.index--,c=c.slice(0,-1),e=c.lastIndexOf("."),-1===e&&(e=t));if(e)for(f=this.index;f<this.text.length;){k=this.text.charAt(f);if("("===k){g=c.substr(e-d+1);c=c.substr(0,e-d);this.index=f;break}if(this.isWhitespace(k))f++;else break}this.tokens.push({index:d,text:c,fn:Gb[c]||bd(c,this.options,a)});g&&(this.tokens.push({index:e,
text:"."}),this.tokens.push({index:e+1,text:g}))},readString:function(a){var c=this.index;this.index++;for(var d="",e=a,f=!1;this.index<this.text.length;){var g=this.text.charAt(this.index),e=e+g;if(f)"u"===g?(f=this.text.substring(this.index+1,this.index+5),f.match(/[\da-f]{4}/i)||this.throwError("Invalid unicode escape [\\u"+f+"]"),this.index+=4,d+=String.fromCharCode(parseInt(f,16))):d+=Qf[g]||g,f=!1;else if("\\"===g)f=!0;else{if(g===a){this.index++;this.tokens.push({index:c,text:e,string:d,constant:!0,
fn:function(){return d}});return}d+=g}this.index++}this.throwError("Unterminated quote",c)}};var cb=function(a,c,d){this.lexer=a;this.$filter=c;this.options=d};cb.ZERO=F(function(){return 0},{sharedGetter:!0,constant:!0});cb.prototype={constructor:cb,parse:function(a){this.text=a;this.tokens=this.lexer.lex(a);a=this.statements();0!==this.tokens.length&&this.throwError("is an unexpected token",this.tokens[0]);a.literal=!!a.literal;a.constant=!!a.constant;return a},primary:function(){var a;if(this.expect("("))a=
this.filterChain(),this.consume(")");else if(this.expect("["))a=this.arrayDeclaration();else if(this.expect("{"))a=this.object();else{var c=this.expect();(a=c.fn)||this.throwError("not a primary expression",c);c.constant&&(a.constant=!0,a.literal=!0)}for(var d;c=this.expect("(","[",".");)"("===c.text?(a=this.functionCall(a,d),d=null):"["===c.text?(d=a,a=this.objectIndex(a)):"."===c.text?(d=a,a=this.fieldAccess(a)):this.throwError("IMPOSSIBLE");return a},throwError:function(a,c){throw oa("syntax",
c.text,a,c.index+1,this.text,this.text.substring(c.index));},peekToken:function(){if(0===this.tokens.length)throw oa("ueoe",this.text);return this.tokens[0]},peek:function(a,c,d,e){if(0<this.tokens.length){var f=this.tokens[0],g=f.text;if(g===a||g===c||g===d||g===e||!(a||c||d||e))return f}return!1},expect:function(a,c,d,e){return(a=this.peek(a,c,d,e))?(this.tokens.shift(),a):!1},consume:function(a){this.expect(a)||this.throwError("is unexpected, expecting ["+a+"]",this.peek())},unaryFn:function(a,
c){return F(function(d,e){return a(d,e,c)},{constant:c.constant,inputs:[c]})},binaryFn:function(a,c,d,e){return F(function(e,g){return c(e,g,a,d)},{constant:a.constant&&d.constant,inputs:!e&&[a,d]})},statements:function(){for(var a=[];;)if(0<this.tokens.length&&!this.peek("}",")",";","]")&&a.push(this.filterChain()),!this.expect(";"))return 1===a.length?a[0]:function(c,d){for(var e,f=0,g=a.length;f<g;f++)e=a[f](c,d);return e}},filterChain:function(){for(var a=this.expression();this.expect("|");)a=
this.filter(a);return a},filter:function(a){var c=this.expect(),d=this.$filter(c.text),e,f;if(this.peek(":"))for(e=[],f=[];this.expect(":");)e.push(this.expression());c=[a].concat(e||[]);return F(function(c,k){var h=a(c,k);if(f){f[0]=h;for(h=e.length;h--;)f[h+1]=e[h](c,k);return d.apply(t,f)}return d(h)},{constant:!d.$stateful&&c.every(cc),inputs:!d.$stateful&&c})},expression:function(){return this.assignment()},assignment:function(){var a=this.ternary(),c,d;return(d=this.expect("="))?(a.assign||
this.throwError("implies assignment but ["+this.text.substring(0,d.index)+"] can not be assigned to",d),c=this.ternary(),F(function(d,f){return a.assign(d,c(d,f),f)},{inputs:[a,c]})):a},ternary:function(){var a=this.logicalOR(),c,d;if(d=this.expect("?")){c=this.assignment();if(d=this.expect(":")){var e=this.assignment();return F(function(d,g){return a(d,g)?c(d,g):e(d,g)},{constant:a.constant&&c.constant&&e.constant})}this.throwError("expected :",d)}return a},logicalOR:function(){for(var a=this.logicalAND(),
c;c=this.expect("||");)a=this.binaryFn(a,c.fn,this.logicalAND(),!0);return a},logicalAND:function(){var a=this.equality(),c;if(c=this.expect("&&"))a=this.binaryFn(a,c.fn,this.logicalAND(),!0);return a},equality:function(){var a=this.relational(),c;if(c=this.expect("==","!=","===","!=="))a=this.binaryFn(a,c.fn,this.equality());return a},relational:function(){var a=this.additive(),c;if(c=this.expect("<",">","<=",">="))a=this.binaryFn(a,c.fn,this.relational());return a},additive:function(){for(var a=
this.multiplicative(),c;c=this.expect("+","-");)a=this.binaryFn(a,c.fn,this.multiplicative());return a},multiplicative:function(){for(var a=this.unary(),c;c=this.expect("*","/","%");)a=this.binaryFn(a,c.fn,this.unary());return a},unary:function(){var a;return this.expect("+")?this.primary():(a=this.expect("-"))?this.binaryFn(cb.ZERO,a.fn,this.unary()):(a=this.expect("!"))?this.unaryFn(a.fn,this.unary()):this.primary()},fieldAccess:function(a){var c=this.text,d=this.expect().text,e=bd(d,this.options,
c);return F(function(c,d,k){return e(k||a(c,d))},{assign:function(e,g,k){(k=a(e,k))||a.assign(e,k={});return Oa(k,d,g,c)}})},objectIndex:function(a){var c=this.text,d=this.expression();this.consume("]");return F(function(e,f){var g=a(e,f),k=d(e,f);na(k,c);return g?Aa(g[k],c):t},{assign:function(e,f,g){var k=na(d(e,g),c);(g=Aa(a(e,g),c))||a.assign(e,g={});return g[k]=f}})},functionCall:function(a,c){var d=[];if(")"!==this.peekToken().text){do d.push(this.expression());while(this.expect(","))}this.consume(")");
var e=this.text,f=d.length?[]:null;return function(g,k){var h=c?c(g,k):g,l=a(g,k,h)||y;if(f)for(var m=d.length;m--;)f[m]=Aa(d[m](g,k),e);Aa(h,e);if(l){if(l.constructor===l)throw oa("isecfn",e);if(l===Nf||l===Of||l===Pf)throw oa("isecff",e);}h=l.apply?l.apply(h,f):l(f[0],f[1],f[2],f[3],f[4]);return Aa(h,e)}},arrayDeclaration:function(){var a=[];if("]"!==this.peekToken().text){do{if(this.peek("]"))break;var c=this.expression();a.push(c)}while(this.expect(","))}this.consume("]");return F(function(c,
e){for(var f=[],g=0,k=a.length;g<k;g++)f.push(a[g](c,e));return f},{literal:!0,constant:a.every(cc),inputs:a})},object:function(){var a=[],c=[];if("}"!==this.peekToken().text){do{if(this.peek("}"))break;var d=this.expect();a.push(d.string||d.text);this.consume(":");d=this.expression();c.push(d)}while(this.expect(","))}this.consume("}");return F(function(d,f){for(var g={},k=0,h=c.length;k<h;k++)g[a[k]]=c[k](d,f);return g},{literal:!0,constant:c.every(cc),inputs:c})}};var cd=wa(),wf=Object.prototype.valueOf,
Ba=w("$sce"),ja={HTML:"html",CSS:"css",URL:"url",RESOURCE_URL:"resourceUrl",JS:"js"},ia=w("$compile"),Z=U.createElement("a"),gd=za(N.location.href,!0);Bc.$inject=["$provide"];hd.$inject=["$locale"];jd.$inject=["$locale"];var md=".",Ff={yyyy:$("FullYear",4),yy:$("FullYear",2,0,!0),y:$("FullYear",1),MMMM:Bb("Month"),MMM:Bb("Month",!0),MM:$("Month",2,1),M:$("Month",1,1),dd:$("Date",2),d:$("Date",1),HH:$("Hours",2),H:$("Hours",1),hh:$("Hours",2,-12),h:$("Hours",1,-12),mm:$("Minutes",2),m:$("Minutes",
1),ss:$("Seconds",2),s:$("Seconds",1),sss:$("Milliseconds",3),EEEE:Bb("Day"),EEE:Bb("Day",!0),a:function(a,c){return 12>a.getHours()?c.AMPMS[0]:c.AMPMS[1]},Z:function(a){a=-1*a.getTimezoneOffset();return a=(0<=a?"+":"")+(Ab(Math[0<a?"floor":"ceil"](a/60),2)+Ab(Math.abs(a%60),2))},ww:od(2),w:od(1)},Ef=/((?:[^yMdHhmsaZEw']+)|(?:'(?:[^']|'')*')|(?:E+|y+|M+|d+|H+|h+|m+|s+|a|Z|w+))(.*)/,Df=/^\-?\d+$/;id.$inject=["$locale"];var Bf=da(S),Cf=da(ob);kd.$inject=["$parse"];var Rd=da({restrict:"E",compile:function(a,
c){if(!c.href&&!c.xlinkHref&&!c.name)return function(a,c){var f="[object SVGAnimatedString]"===Ja.call(c.prop("href"))?"xlink:href":"href";c.on("click",function(a){c.attr(f)||a.preventDefault()})}}}),pb={};s(vb,function(a,c){if("multiple"!=a){var d=ua("ng-"+c);pb[d]=function(){return{restrict:"A",priority:100,link:function(a,f,g){a.$watch(g[d],function(a){g.$set(c,!!a)})}}}}});s(Lc,function(a,c){pb[c]=function(){return{priority:100,link:function(a,e,f){if("ngPattern"===c&&"/"==f.ngPattern.charAt(0)&&
(e=f.ngPattern.match(Hf))){f.$set("ngPattern",new RegExp(e[1],e[2]));return}a.$watch(f[c],function(a){f.$set(c,a)})}}}});s(["src","srcset","href"],function(a){var c=ua("ng-"+a);pb[c]=function(){return{priority:99,link:function(d,e,f){var g=a,k=a;"href"===a&&"[object SVGAnimatedString]"===Ja.call(e.prop("href"))&&(k="xlinkHref",f.$attr[k]="xlink:href",g=null);f.$observe(c,function(c){c?(f.$set(k,c),Ha&&g&&e.prop(g,f[k])):"href"===a&&f.$set(k,null)})}}}});var Cb={$addControl:y,$$renameControl:function(a,
c){a.$name=c},$removeControl:y,$setValidity:y,$setDirty:y,$setPristine:y,$setSubmitted:y};pd.$inject=["$element","$attrs","$scope","$animate","$interpolate"];var wd=function(a){return["$timeout",function(c){return{name:"form",restrict:a?"EAC":"E",controller:pd,compile:function(a){a.addClass(Pa).addClass(fb);return{pre:function(a,d,g,k){if(!("action"in g)){var h=function(c){a.$apply(function(){k.$commitViewValue();k.$setSubmitted()});c.preventDefault?c.preventDefault():c.returnValue=!1};d[0].addEventListener("submit",
h,!1);d.on("$destroy",function(){c(function(){d[0].removeEventListener("submit",h,!1)},0,!1)})}var l=k.$$parentForm,m=k.$name;m&&(Oa(a,m,k,m),g.$observe(g.name?"name":"ngForm",function(c){m!==c&&(Oa(a,m,t,m),m=c,Oa(a,m,k,m),l.$$renameControl(k,m))}));d.on("$destroy",function(){l.$removeControl(k);m&&Oa(a,m,t,m);F(k,Cb)})}}}}}]},Sd=wd(),ee=wd(!0),Gf=/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/,Rf=/^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/,
Sf=/^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i,Tf=/^\s*(\-|\+)?(\d+|(\d*(\.\d*)))\s*$/,xd=/^(\d{4})-(\d{2})-(\d{2})$/,yd=/^(\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d)(?::(\d\d)(\.\d{1,3})?)?$/,ic=/^(\d{4})-W(\d\d)$/,zd=/^(\d{4})-(\d\d)$/,Ad=/^(\d\d):(\d\d)(?::(\d\d)(\.\d{1,3})?)?$/,Uf=/(\s+|^)default(\s+|$)/,Fb=new w("ngModel"),Bd={text:function(a,c,d,e,f,g){db(a,c,d,e,f,g);fc(e)},date:eb("date",xd,Eb(xd,["yyyy","MM","dd"]),"yyyy-MM-dd"),"datetime-local":eb("datetimelocal",
yd,Eb(yd,"yyyy MM dd HH mm ss sss".split(" ")),"yyyy-MM-ddTHH:mm:ss.sss"),time:eb("time",Ad,Eb(Ad,["HH","mm","ss","sss"]),"HH:mm:ss.sss"),week:eb("week",ic,function(a,c){if(ea(a))return a;if(J(a)){ic.lastIndex=0;var d=ic.exec(a);if(d){var e=+d[1],f=+d[2],g=d=0,k=0,h=0,l=nd(e),f=7*(f-1);c&&(d=c.getHours(),g=c.getMinutes(),k=c.getSeconds(),h=c.getMilliseconds());return new Date(e,0,l.getDate()+f,d,g,k,h)}}return NaN},"yyyy-Www"),month:eb("month",zd,Eb(zd,["yyyy","MM"]),"yyyy-MM"),number:function(a,
c,d,e,f,g){rd(a,c,d,e);db(a,c,d,e,f,g);e.$$parserName="number";e.$parsers.push(function(a){return e.$isEmpty(a)?null:Tf.test(a)?parseFloat(a):t});e.$formatters.push(function(a){if(!e.$isEmpty(a)){if(!X(a))throw Fb("numfmt",a);a=a.toString()}return a});if(d.min||d.ngMin){var k;e.$validators.min=function(a){return e.$isEmpty(a)||x(k)||a>=k};d.$observe("min",function(a){z(a)&&!X(a)&&(a=parseFloat(a,10));k=X(a)&&!isNaN(a)?a:t;e.$validate()})}if(d.max||d.ngMax){var h;e.$validators.max=function(a){return e.$isEmpty(a)||
x(h)||a<=h};d.$observe("max",function(a){z(a)&&!X(a)&&(a=parseFloat(a,10));h=X(a)&&!isNaN(a)?a:t;e.$validate()})}},url:function(a,c,d,e,f,g){db(a,c,d,e,f,g);fc(e);e.$$parserName="url";e.$validators.url=function(a){return e.$isEmpty(a)||Rf.test(a)}},email:function(a,c,d,e,f,g){db(a,c,d,e,f,g);fc(e);e.$$parserName="email";e.$validators.email=function(a){return e.$isEmpty(a)||Sf.test(a)}},radio:function(a,c,d,e){x(d.name)&&c.attr("name",++gb);c.on("click",function(a){c[0].checked&&e.$setViewValue(d.value,
a&&a.type)});e.$render=function(){c[0].checked=d.value==e.$viewValue};d.$observe("value",e.$render)},checkbox:function(a,c,d,e,f,g,k,h){var l=sd(h,a,"ngTrueValue",d.ngTrueValue,!0),m=sd(h,a,"ngFalseValue",d.ngFalseValue,!1);c.on("click",function(a){e.$setViewValue(c[0].checked,a&&a.type)});e.$render=function(){c[0].checked=e.$viewValue};e.$isEmpty=function(a){return a!==l};e.$formatters.push(function(a){return la(a,l)});e.$parsers.push(function(a){return a?l:m})},hidden:y,button:y,submit:y,reset:y,
file:y},vc=["$browser","$sniffer","$filter","$parse",function(a,c,d,e){return{restrict:"E",require:["?ngModel"],link:{pre:function(f,g,k,h){h[0]&&(Bd[S(k.type)]||Bd.text)(f,g,k,h[0],c,a,d,e)}}}}],fb="ng-valid",td="ng-invalid",Pa="ng-pristine",Db="ng-dirty",vd="ng-pending",Vf=["$scope","$exceptionHandler","$attrs","$element","$parse","$animate","$timeout","$rootScope","$q","$interpolate",function(a,c,d,e,f,g,k,h,l,m){this.$modelValue=this.$viewValue=Number.NaN;this.$validators={};this.$asyncValidators=
{};this.$parsers=[];this.$formatters=[];this.$viewChangeListeners=[];this.$untouched=!0;this.$touched=!1;this.$pristine=!0;this.$dirty=!1;this.$valid=!0;this.$invalid=!1;this.$error={};this.$$success={};this.$pending=t;this.$name=m(d.name||"",!1)(a);var p=f(d.ngModel),q=null,n=this,r=function(){var c=p(a);n.$options&&n.$options.getterSetter&&A(c)&&(c=c());return c},O=function(c){var d;n.$options&&n.$options.getterSetter&&A(d=p(a))?d(n.$modelValue):p.assign(a,n.$modelValue)};this.$$setOptions=function(a){n.$options=
a;if(!(p.assign||a&&a.getterSetter))throw Fb("nonassign",d.ngModel,sa(e));};this.$render=y;this.$isEmpty=function(a){return x(a)||""===a||null===a||a!==a};var B=e.inheritedData("$formController")||Cb,C=0;qd({ctrl:this,$element:e,set:function(a,c){a[c]=!0},unset:function(a,c){delete a[c]},parentForm:B,$animate:g});this.$setPristine=function(){n.$dirty=!1;n.$pristine=!0;g.removeClass(e,Db);g.addClass(e,Pa)};this.$setUntouched=function(){n.$touched=!1;n.$untouched=!0;g.setClass(e,"ng-untouched","ng-touched")};
this.$setTouched=function(){n.$touched=!0;n.$untouched=!1;g.setClass(e,"ng-touched","ng-untouched")};this.$rollbackViewValue=function(){k.cancel(q);n.$viewValue=n.$$lastCommittedViewValue;n.$render()};this.$validate=function(){X(n.$modelValue)&&isNaN(n.$modelValue)||this.$$parseAndValidate()};this.$$runValidators=function(a,c,d,e){function f(){var a=!0;s(n.$validators,function(e,f){var g=e(c,d);a=a&&g;h(f,g)});return a?!0:(s(n.$asyncValidators,function(a,c){h(c,null)}),!1)}function g(){var a=[],e=
!0;s(n.$asyncValidators,function(f,g){var k=f(c,d);if(!k||!A(k.then))throw Fb("$asyncValidators",k);h(g,t);a.push(k.then(function(){h(g,!0)},function(a){e=!1;h(g,!1)}))});a.length?l.all(a).then(function(){k(e)},y):k(!0)}function h(a,c){m===C&&n.$setValidity(a,c)}function k(a){m===C&&e(a)}C++;var m=C;(function(a){var c=n.$$parserName||"parse";if(a===t)h(c,null);else if(h(c,a),!a)return s(n.$validators,function(a,c){h(c,null)}),s(n.$asyncValidators,function(a,c){h(c,null)}),!1;return!0})(a)?f()?g():
k(!1):k(!1)};this.$commitViewValue=function(){var a=n.$viewValue;k.cancel(q);if(n.$$lastCommittedViewValue!==a||""===a&&n.$$hasNativeValidators)n.$$lastCommittedViewValue=a,n.$pristine&&(n.$dirty=!0,n.$pristine=!1,g.removeClass(e,Pa),g.addClass(e,Db),B.$setDirty()),this.$$parseAndValidate()};this.$$parseAndValidate=function(){var a=n.$$lastCommittedViewValue,c=a,d=x(c)?t:!0;if(d)for(var e=0;e<n.$parsers.length;e++)if(c=n.$parsers[e](c),x(c)){d=!1;break}X(n.$modelValue)&&isNaN(n.$modelValue)&&(n.$modelValue=
r());var f=n.$modelValue,g=n.$options&&n.$options.allowInvalid;g&&(n.$modelValue=c,n.$modelValue!==f&&n.$$writeModelToScope());n.$$runValidators(d,c,a,function(a){g||(n.$modelValue=a?c:t,n.$modelValue!==f&&n.$$writeModelToScope())})};this.$$writeModelToScope=function(){O(n.$modelValue);s(n.$viewChangeListeners,function(a){try{a()}catch(d){c(d)}})};this.$setViewValue=function(a,c){n.$viewValue=a;n.$options&&!n.$options.updateOnDefault||n.$$debounceViewValueCommit(c)};this.$$debounceViewValueCommit=
function(c){var d=0,e=n.$options;e&&z(e.debounce)&&(e=e.debounce,X(e)?d=e:X(e[c])?d=e[c]:X(e["default"])&&(d=e["default"]));k.cancel(q);d?q=k(function(){n.$commitViewValue()},d):h.$$phase?n.$commitViewValue():a.$apply(function(){n.$commitViewValue()})};a.$watch(function(){var a=r();if(a!==n.$modelValue){n.$modelValue=a;for(var c=n.$formatters,d=c.length,e=a;d--;)e=c[d](e);n.$viewValue!==e&&(n.$viewValue=n.$$lastCommittedViewValue=e,n.$render(),n.$$runValidators(t,a,e,y))}return a})}],te=function(){return{restrict:"A",
require:["ngModel","^?form","^?ngModelOptions"],controller:Vf,priority:1,compile:function(a){a.addClass(Pa).addClass("ng-untouched").addClass(fb);return{pre:function(a,d,e,f){var g=f[0],k=f[1]||Cb;g.$$setOptions(f[2]&&f[2].$options);k.$addControl(g);e.$observe("name",function(a){g.$name!==a&&k.$$renameControl(g,a)});a.$on("$destroy",function(){k.$removeControl(g)})},post:function(a,d,e,f){var g=f[0];if(g.$options&&g.$options.updateOn)d.on(g.$options.updateOn,function(a){g.$$debounceViewValueCommit(a&&
a.type)});d.on("blur",function(d){g.$touched||a.$apply(function(){g.$setTouched()})})}}}}},ve=da({restrict:"A",require:"ngModel",link:function(a,c,d,e){e.$viewChangeListeners.push(function(){a.$eval(d.ngChange)})}}),xc=function(){return{restrict:"A",require:"?ngModel",link:function(a,c,d,e){e&&(d.required=!0,e.$validators.required=function(a){return!d.required||!e.$isEmpty(a)},d.$observe("required",function(){e.$validate()}))}}},wc=function(){return{restrict:"A",require:"?ngModel",link:function(a,
c,d,e){if(e){var f,g=d.ngPattern||d.pattern;d.$observe("pattern",function(a){J(a)&&0<a.length&&(a=new RegExp(a));if(a&&!a.test)throw w("ngPattern")("noregexp",g,a,sa(c));f=a||t;e.$validate()});e.$validators.pattern=function(a){return e.$isEmpty(a)||x(f)||f.test(a)}}}}},zc=function(){return{restrict:"A",require:"?ngModel",link:function(a,c,d,e){if(e){var f=0;d.$observe("maxlength",function(a){f=aa(a)||0;e.$validate()});e.$validators.maxlength=function(a,c){return e.$isEmpty(a)||c.length<=f}}}}},yc=
function(){return{restrict:"A",require:"?ngModel",link:function(a,c,d,e){if(e){var f=0;d.$observe("minlength",function(a){f=aa(a)||0;e.$validate()});e.$validators.minlength=function(a,c){return e.$isEmpty(a)||c.length>=f}}}}},ue=function(){return{restrict:"A",priority:100,require:"ngModel",link:function(a,c,d,e){var f=c.attr(d.$attr.ngList)||", ",g="false"!==d.ngTrim,k=g?T(f):f;e.$parsers.push(function(a){if(!x(a)){var c=[];a&&s(a.split(k),function(a){a&&c.push(g?T(a):a)});return c}});e.$formatters.push(function(a){return H(a)?
a.join(f):t});e.$isEmpty=function(a){return!a||!a.length}}}},Wf=/^(true|false|\d+)$/,we=function(){return{restrict:"A",priority:100,compile:function(a,c){return Wf.test(c.ngValue)?function(a,c,f){f.$set("value",a.$eval(f.ngValue))}:function(a,c,f){a.$watch(f.ngValue,function(a){f.$set("value",a)})}}}},xe=function(){return{restrict:"A",controller:["$scope","$attrs",function(a,c){var d=this;this.$options=a.$eval(c.ngModelOptions);this.$options.updateOn!==t?(this.$options.updateOnDefault=!1,this.$options.updateOn=
T(this.$options.updateOn.replace(Uf,function(){d.$options.updateOnDefault=!0;return" "}))):this.$options.updateOnDefault=!0}]}},Xd=["$compile",function(a){return{restrict:"AC",compile:function(c){a.$$addBindingClass(c);return function(c,e,f){a.$$addBindingInfo(e,f.ngBind);e=e[0];c.$watch(f.ngBind,function(a){e.textContent=a===t?"":a})}}}}],Zd=["$interpolate","$compile",function(a,c){return{compile:function(d){c.$$addBindingClass(d);return function(d,f,g){d=a(f.attr(g.$attr.ngBindTemplate));c.$$addBindingInfo(f,
d.expressions);f=f[0];g.$observe("ngBindTemplate",function(a){f.textContent=a===t?"":a})}}}}],Yd=["$sce","$parse","$compile",function(a,c,d){return{restrict:"A",compile:function(e,f){var g=c(f.ngBindHtml),k=c(f.ngBindHtml,function(a){return(a||"").toString()});d.$$addBindingClass(e);return function(c,e,f){d.$$addBindingInfo(e,f.ngBindHtml);c.$watch(k,function(){e.html(a.getTrustedHtml(g(c))||"")})}}}}],$d=gc("",!0),be=gc("Odd",0),ae=gc("Even",1),ce=Ia({compile:function(a,c){c.$set("ngCloak",t);a.removeClass("ng-cloak")}}),
de=[function(){return{restrict:"A",scope:!0,controller:"@",priority:500}}],Ac={},Xf={blur:!0,focus:!0};s("click dblclick mousedown mouseup mouseover mouseout mousemove mouseenter mouseleave keydown keyup keypress submit focus blur copy cut paste".split(" "),function(a){var c=ua("ng-"+a);Ac[c]=["$parse","$rootScope",function(d,e){return{restrict:"A",compile:function(f,g){var k=d(g[c]);return function(c,d){d.on(a,function(d){var f=function(){k(c,{$event:d})};Xf[a]&&e.$$phase?c.$evalAsync(f):c.$apply(f)})}}}}]});
var ge=["$animate",function(a){return{multiElement:!0,transclude:"element",priority:600,terminal:!0,restrict:"A",$$tlb:!0,link:function(c,d,e,f,g){var k,h,l;c.$watch(e.ngIf,function(c){c?h||g(function(c,f){h=f;c[c.length++]=U.createComment(" end ngIf: "+e.ngIf+" ");k={clone:c};a.enter(c,d.parent(),d)}):(l&&(l.remove(),l=null),h&&(h.$destroy(),h=null),k&&(l=nb(k.clone),a.leave(l).then(function(){l=null}),k=null))})}}}],he=["$templateRequest","$anchorScroll","$animate","$sce",function(a,c,d,e){return{restrict:"ECA",
priority:400,terminal:!0,transclude:"element",controller:ta.noop,compile:function(f,g){var k=g.ngInclude||g.src,h=g.onload||"",l=g.autoscroll;return function(f,g,q,n,r){var s=0,t,C,D,G=function(){C&&(C.remove(),C=null);t&&(t.$destroy(),t=null);D&&(d.leave(D).then(function(){C=null}),C=D,D=null)};f.$watch(e.parseAsResourceUrl(k),function(e){var k=function(){!z(l)||l&&!f.$eval(l)||c()},q=++s;e?(a(e,!0).then(function(a){if(q===s){var c=f.$new();n.template=a;a=r(c,function(a){G();d.enter(a,null,g).then(k)});
t=c;D=a;t.$emit("$includeContentLoaded",e);f.$eval(h)}},function(){q===s&&(G(),f.$emit("$includeContentError",e))}),f.$emit("$includeContentRequested",e)):(G(),n.template=null)})}}}}],ye=["$compile",function(a){return{restrict:"ECA",priority:-400,require:"ngInclude",link:function(c,d,e,f){/SVG/.test(d[0].toString())?(d.empty(),a(Dc(f.template,U).childNodes)(c,function(a){d.append(a)},t,t,d)):(d.html(f.template),a(d.contents())(c))}}}],ie=Ia({priority:450,compile:function(){return{pre:function(a,c,
d){a.$eval(d.ngInit)}}}}),je=Ia({terminal:!0,priority:1E3}),ke=["$locale","$interpolate",function(a,c){var d=/{}/g;return{restrict:"EA",link:function(e,f,g){var k=g.count,h=g.$attr.when&&f.attr(g.$attr.when),l=g.offset||0,m=e.$eval(h)||{},p={},q=c.startSymbol(),n=c.endSymbol(),r=/^when(Minus)?(.+)$/;s(g,function(a,c){r.test(c)&&(m[S(c.replace("when","").replace("Minus","-"))]=f.attr(g.$attr[c]))});s(m,function(a,e){p[e]=c(a.replace(d,q+k+"-"+l+n))});e.$watch(function(){var c=parseFloat(e.$eval(k));
if(isNaN(c))return"";c in m||(c=a.pluralCat(c-l));return p[c](e)},function(a){f.text(a)})}}}],le=["$parse","$animate",function(a,c){var d=w("ngRepeat"),e=function(a,c,d,e,l,m,p){a[d]=e;l&&(a[l]=m);a.$index=c;a.$first=0===c;a.$last=c===p-1;a.$middle=!(a.$first||a.$last);a.$odd=!(a.$even=0===(c&1))};return{restrict:"A",multiElement:!0,transclude:"element",priority:1E3,terminal:!0,$$tlb:!0,compile:function(f,g){var k=g.ngRepeat,h=U.createComment(" end ngRepeat: "+k+" "),l=k.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+track\s+by\s+([\s\S]+?))?\s*$/);
if(!l)throw d("iexp",k);var m=l[1],p=l[2],q=l[3],n=l[4],l=m.match(/^(?:([\$\w]+)|\(([\$\w]+)\s*,\s*([\$\w]+)\))$/);if(!l)throw d("iidexp",m);var r=l[3]||l[1],z=l[2];if(q&&(!/^[$a-zA-Z_][$a-zA-Z0-9_]*$/.test(q)||/^(null|undefined|this|\$index|\$first|\$middle|\$last|\$even|\$odd|\$parent)$/.test(q)))throw d("badident",q);var w,C,D,G,u={$id:Ma};n?w=a(n):(D=function(a,c){return Ma(c)},G=function(a){return a});return function(a,f,g,l,m){w&&(C=function(c,d,e){z&&(u[z]=c);u[r]=d;u.$index=e;return w(a,u)});
var n=wa();a.$watchCollection(p,function(g){var l,p,E=f[0],u,w=wa(),B,y,F,x,H,A,J;q&&(a[q]=g);if(Qa(g))H=g,p=C||D;else{p=C||G;H=[];for(J in g)g.hasOwnProperty(J)&&"$"!=J.charAt(0)&&H.push(J);H.sort()}B=H.length;J=Array(B);for(l=0;l<B;l++)if(y=g===H?l:H[l],F=g[y],x=p(y,F,l),n[x])A=n[x],delete n[x],w[x]=A,J[l]=A;else{if(w[x])throw s(J,function(a){a&&a.scope&&(n[a.id]=a)}),d("dupes",k,x,ra(F));J[l]={id:x,scope:t,clone:t};w[x]=!0}for(u in n){A=n[u];x=nb(A.clone);c.leave(x);if(x[0].parentNode)for(l=0,
p=x.length;l<p;l++)x[l].$$NG_REMOVED=!0;A.scope.$destroy()}for(l=0;l<B;l++)if(y=g===H?l:H[l],F=g[y],A=J[l],A.scope){u=E;do u=u.nextSibling;while(u&&u.$$NG_REMOVED);A.clone[0]!=u&&c.move(nb(A.clone),null,v(E));E=A.clone[A.clone.length-1];e(A.scope,l,r,F,z,y,B)}else m(function(a,d){A.scope=d;var f=h.cloneNode(!1);a[a.length++]=f;c.enter(a,null,v(E));E=f;A.clone=a;w[A.id]=A;e(A.scope,l,r,F,z,y,B)});n=w})}}}}],me=["$animate",function(a){return{restrict:"A",multiElement:!0,link:function(c,d,e){c.$watch(e.ngShow,
function(c){a[c?"removeClass":"addClass"](d,"ng-hide",{tempClasses:"ng-hide-animate"})})}}}],fe=["$animate",function(a){return{restrict:"A",multiElement:!0,link:function(c,d,e){c.$watch(e.ngHide,function(c){a[c?"addClass":"removeClass"](d,"ng-hide",{tempClasses:"ng-hide-animate"})})}}}],ne=Ia(function(a,c,d){a.$watch(d.ngStyle,function(a,d){d&&a!==d&&s(d,function(a,d){c.css(d,"")});a&&c.css(a)},!0)}),oe=["$animate",function(a){return{restrict:"EA",require:"ngSwitch",controller:["$scope",function(){this.cases=
{}}],link:function(c,d,e,f){var g=[],k=[],h=[],l=[],m=function(a,c){return function(){a.splice(c,1)}};c.$watch(e.ngSwitch||e.on,function(c){var d,e;d=0;for(e=h.length;d<e;++d)a.cancel(h[d]);d=h.length=0;for(e=l.length;d<e;++d){var r=nb(k[d].clone);l[d].$destroy();(h[d]=a.leave(r)).then(m(h,d))}k.length=0;l.length=0;(g=f.cases["!"+c]||f.cases["?"])&&s(g,function(c){c.transclude(function(d,e){l.push(e);var f=c.element;d[d.length++]=U.createComment(" end ngSwitchWhen: ");k.push({clone:d});a.enter(d,
f.parent(),f)})})})}}}],pe=Ia({transclude:"element",priority:1200,require:"^ngSwitch",multiElement:!0,link:function(a,c,d,e,f){e.cases["!"+d.ngSwitchWhen]=e.cases["!"+d.ngSwitchWhen]||[];e.cases["!"+d.ngSwitchWhen].push({transclude:f,element:c})}}),qe=Ia({transclude:"element",priority:1200,require:"^ngSwitch",multiElement:!0,link:function(a,c,d,e,f){e.cases["?"]=e.cases["?"]||[];e.cases["?"].push({transclude:f,element:c})}}),se=Ia({restrict:"EAC",link:function(a,c,d,e,f){if(!f)throw w("ngTransclude")("orphan",
sa(c));f(function(a){c.empty();c.append(a)})}}),Td=["$templateCache",function(a){return{restrict:"E",terminal:!0,compile:function(c,d){"text/ng-template"==d.type&&a.put(d.id,c[0].text)}}}],Yf=w("ngOptions"),re=da({restrict:"A",terminal:!0}),Ud=["$compile","$parse",function(a,c){var d=/^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+group\s+by\s+([\s\S]+?))?\s+for\s+(?:([\$\w][\$\w]*)|(?:\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)))\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?$/,e={$setViewValue:y};
return{restrict:"E",require:["select","?ngModel"],controller:["$element","$scope","$attrs",function(a,c,d){var h=this,l={},m=e,p;h.databound=d.ngModel;h.init=function(a,c,d){m=a;p=d};h.addOption=function(c,d){La(c,'"option value"');l[c]=!0;m.$viewValue==c&&(a.val(c),p.parent()&&p.remove());d&&d[0].hasAttribute("selected")&&(d[0].selected=!0)};h.removeOption=function(a){this.hasOption(a)&&(delete l[a],m.$viewValue==a&&this.renderUnknownOption(a))};h.renderUnknownOption=function(c){c="? "+Ma(c)+" ?";
p.val(c);a.prepend(p);a.val(c);p.prop("selected",!0)};h.hasOption=function(a){return l.hasOwnProperty(a)};c.$on("$destroy",function(){h.renderUnknownOption=y})}],link:function(e,g,k,h){function l(a,c,d,e){d.$render=function(){var a=d.$viewValue;e.hasOption(a)?(u.parent()&&u.remove(),c.val(a),""===a&&A.prop("selected",!0)):x(a)&&A?c.val(""):e.renderUnknownOption(a)};c.on("change",function(){a.$apply(function(){u.parent()&&u.remove();d.$setViewValue(c.val())})})}function m(a,c,d){var e;d.$render=function(){var a=
new ab(d.$viewValue);s(c.find("option"),function(c){c.selected=z(a.get(c.value))})};a.$watch(function(){la(e,d.$viewValue)||(e=qa(d.$viewValue),d.$render())});c.on("change",function(){a.$apply(function(){var a=[];s(c.find("option"),function(c){c.selected&&a.push(c.value)});d.$setViewValue(a)})})}function p(e,f,g){function h(a,c,d){S[y]=d;F&&(S[F]=c);return a(e,S)}function k(a){var c;if(n)if(I&&H(a)){c=new ab([]);for(var d=0;d<a.length;d++)c.put(h(I,null,a[d]),!0)}else c=new ab(a);else I&&(a=h(I,null,
a));return function(d,e){var f;f=I?I:v?v:B;return n?z(c.remove(h(f,d,e))):a==h(f,d,e)}}function l(){C||(e.$$postDigest(p),C=!0)}function m(a,c,d){a[c]=a[c]||0;a[c]+=d?1:-1}function p(){C=!1;var a={"":[]},c=[""],d,l,r,t,u;r=g.$viewValue;t=K(e)||[];var y=F?Object.keys(t).sort():t,v,x,H,B,R={};u=k(r);var N=!1,T,U;P={};for(B=0;H=y.length,B<H;B++){v=B;if(F&&(v=y[B],"$"===v.charAt(0)))continue;x=t[v];d=h(J,v,x)||"";(l=a[d])||(l=a[d]=[],c.push(d));d=u(v,x);N=N||d;x=h(A,v,x);x=z(x)?x:"";U=I?I(e,S):F?y[B]:
B;I&&(P[U]=v);l.push({id:U,label:x,selected:d})}n||(w||null===r?a[""].unshift({id:"",label:"",selected:!N}):N||a[""].unshift({id:"?",label:"",selected:!0}));v=0;for(y=c.length;v<y;v++){d=c[v];l=a[d];Q.length<=v?(r={element:G.clone().attr("label",d),label:l.label},t=[r],Q.push(t),f.append(r.element)):(t=Q[v],r=t[0],r.label!=d&&r.element.attr("label",r.label=d));N=null;B=0;for(H=l.length;B<H;B++)d=l[B],(u=t[B+1])?(N=u.element,u.label!==d.label&&(m(R,u.label,!1),m(R,d.label,!0),N.text(u.label=d.label)),
u.id!==d.id&&N.val(u.id=d.id),N[0].selected!==d.selected&&(N.prop("selected",u.selected=d.selected),Ha&&N.prop("selected",u.selected))):(""===d.id&&w?T=w:(T=D.clone()).val(d.id).prop("selected",d.selected).attr("selected",d.selected).text(d.label),t.push(u={element:T,label:d.label,id:d.id,selected:d.selected}),m(R,d.label,!0),N?N.after(T):r.element.append(T),N=T);for(B++;t.length>B;)d=t.pop(),m(R,d.label,!1),d.element.remove();s(R,function(a,c){0<a?q.addOption(c):0>a&&q.removeOption(c)})}for(;Q.length>
v;)Q.pop()[0].element.remove()}var u;if(!(u=r.match(d)))throw Yf("iexp",r,sa(f));var A=c(u[2]||u[1]),y=u[4]||u[6],x=/ as /.test(u[0])&&u[1],v=x?c(x):null,F=u[5],J=c(u[3]||""),B=c(u[2]?u[1]:y),K=c(u[7]),I=u[8]?c(u[8]):null,P={},Q=[[{element:f,label:""}]],S={};w&&(a(w)(e),w.removeClass("ng-scope"),w.remove());f.empty();f.on("change",function(){e.$apply(function(){var a=K(e)||[],c;if(n)c=[],s(f.val(),function(d){d=I?P[d]:d;c.push("?"===d?t:""===d?null:h(v?v:B,d,a[d]))});else{var d=I?P[f.val()]:f.val();
c="?"===d?t:""===d?null:h(v?v:B,d,a[d])}g.$setViewValue(c);p()})});g.$render=p;e.$watchCollection(K,l);e.$watchCollection(function(){var a=K(e),c;if(a&&H(a)){c=Array(a.length);for(var d=0,f=a.length;d<f;d++)c[d]=h(A,d,a[d])}else if(a)for(d in c={},a)a.hasOwnProperty(d)&&(c[d]=h(A,d,a[d]));return c},l);n&&e.$watchCollection(function(){return g.$modelValue},l)}if(h[1]){var q=h[0];h=h[1];var n=k.multiple,r=k.ngOptions,w=!1,A,C=!1,D=v(U.createElement("option")),G=v(U.createElement("optgroup")),u=D.clone();
k=0;for(var y=g.children(),F=y.length;k<F;k++)if(""===y[k].value){A=w=y.eq(k);break}q.init(h,w,u);n&&(h.$isEmpty=function(a){return!a||0===a.length});r?p(e,g,h):n?m(e,g,h):l(e,g,h,q)}}}}],Wd=["$interpolate",function(a){var c={addOption:y,removeOption:y};return{restrict:"E",priority:100,compile:function(d,e){if(x(e.value)){var f=a(d.text(),!0);f||e.$set("value",d.text())}return function(a,d,e){var l=d.parent(),m=l.data("$selectController")||l.parent().data("$selectController");m&&m.databound||(m=c);
f?a.$watch(f,function(a,c){e.$set("value",a);c!==a&&m.removeOption(c);m.addOption(a,d)}):m.addOption(e.value,d);d.on("$destroy",function(){m.removeOption(e.value)})}}}}],Vd=da({restrict:"E",terminal:!1});N.angular.bootstrap?console.log("WARNING: Tried to load angular more than once."):(Ld(),Nd(ta),v(U).ready(function(){Hd(U,rc)}))})(window,document);!window.angular.$$csp()&&window.angular.element(document).find("head").prepend('<style type="text/css">@charset "UTF-8";[ng\\:cloak],[ng-cloak],[data-ng-cloak],[x-ng-cloak],.ng-cloak,.x-ng-cloak,.ng-hide:not(.ng-hide-animate){display:none !important;}ng\\:form{display:block;}</style>');
//# sourceMappingURL=angular.min.js.map

},{}],"hammer":[function(require,module,exports){
/*! Hammer.JS - v2.0.4 - 2014-09-28
 * http://hammerjs.github.io/
 *
 * Copyright (c) 2014 Jorik Tangelder;
 * Licensed under the MIT license */
!function(a,b,c,d){"use strict";function e(a,b,c){return setTimeout(k(a,c),b)}function f(a,b,c){return Array.isArray(a)?(g(a,c[b],c),!0):!1}function g(a,b,c){var e;if(a)if(a.forEach)a.forEach(b,c);else if(a.length!==d)for(e=0;e<a.length;)b.call(c,a[e],e,a),e++;else for(e in a)a.hasOwnProperty(e)&&b.call(c,a[e],e,a)}function h(a,b,c){for(var e=Object.keys(b),f=0;f<e.length;)(!c||c&&a[e[f]]===d)&&(a[e[f]]=b[e[f]]),f++;return a}function i(a,b){return h(a,b,!0)}function j(a,b,c){var d,e=b.prototype;d=a.prototype=Object.create(e),d.constructor=a,d._super=e,c&&h(d,c)}function k(a,b){return function(){return a.apply(b,arguments)}}function l(a,b){return typeof a==kb?a.apply(b?b[0]||d:d,b):a}function m(a,b){return a===d?b:a}function n(a,b,c){g(r(b),function(b){a.addEventListener(b,c,!1)})}function o(a,b,c){g(r(b),function(b){a.removeEventListener(b,c,!1)})}function p(a,b){for(;a;){if(a==b)return!0;a=a.parentNode}return!1}function q(a,b){return a.indexOf(b)>-1}function r(a){return a.trim().split(/\s+/g)}function s(a,b,c){if(a.indexOf&&!c)return a.indexOf(b);for(var d=0;d<a.length;){if(c&&a[d][c]==b||!c&&a[d]===b)return d;d++}return-1}function t(a){return Array.prototype.slice.call(a,0)}function u(a,b,c){for(var d=[],e=[],f=0;f<a.length;){var g=b?a[f][b]:a[f];s(e,g)<0&&d.push(a[f]),e[f]=g,f++}return c&&(d=b?d.sort(function(a,c){return a[b]>c[b]}):d.sort()),d}function v(a,b){for(var c,e,f=b[0].toUpperCase()+b.slice(1),g=0;g<ib.length;){if(c=ib[g],e=c?c+f:b,e in a)return e;g++}return d}function w(){return ob++}function x(a){var b=a.ownerDocument;return b.defaultView||b.parentWindow}function y(a,b){var c=this;this.manager=a,this.callback=b,this.element=a.element,this.target=a.options.inputTarget,this.domHandler=function(b){l(a.options.enable,[a])&&c.handler(b)},this.init()}function z(a){var b,c=a.options.inputClass;return new(b=c?c:rb?N:sb?Q:qb?S:M)(a,A)}function A(a,b,c){var d=c.pointers.length,e=c.changedPointers.length,f=b&yb&&d-e===0,g=b&(Ab|Bb)&&d-e===0;c.isFirst=!!f,c.isFinal=!!g,f&&(a.session={}),c.eventType=b,B(a,c),a.emit("hammer.input",c),a.recognize(c),a.session.prevInput=c}function B(a,b){var c=a.session,d=b.pointers,e=d.length;c.firstInput||(c.firstInput=E(b)),e>1&&!c.firstMultiple?c.firstMultiple=E(b):1===e&&(c.firstMultiple=!1);var f=c.firstInput,g=c.firstMultiple,h=g?g.center:f.center,i=b.center=F(d);b.timeStamp=nb(),b.deltaTime=b.timeStamp-f.timeStamp,b.angle=J(h,i),b.distance=I(h,i),C(c,b),b.offsetDirection=H(b.deltaX,b.deltaY),b.scale=g?L(g.pointers,d):1,b.rotation=g?K(g.pointers,d):0,D(c,b);var j=a.element;p(b.srcEvent.target,j)&&(j=b.srcEvent.target),b.target=j}function C(a,b){var c=b.center,d=a.offsetDelta||{},e=a.prevDelta||{},f=a.prevInput||{};(b.eventType===yb||f.eventType===Ab)&&(e=a.prevDelta={x:f.deltaX||0,y:f.deltaY||0},d=a.offsetDelta={x:c.x,y:c.y}),b.deltaX=e.x+(c.x-d.x),b.deltaY=e.y+(c.y-d.y)}function D(a,b){var c,e,f,g,h=a.lastInterval||b,i=b.timeStamp-h.timeStamp;if(b.eventType!=Bb&&(i>xb||h.velocity===d)){var j=h.deltaX-b.deltaX,k=h.deltaY-b.deltaY,l=G(i,j,k);e=l.x,f=l.y,c=mb(l.x)>mb(l.y)?l.x:l.y,g=H(j,k),a.lastInterval=b}else c=h.velocity,e=h.velocityX,f=h.velocityY,g=h.direction;b.velocity=c,b.velocityX=e,b.velocityY=f,b.direction=g}function E(a){for(var b=[],c=0;c<a.pointers.length;)b[c]={clientX:lb(a.pointers[c].clientX),clientY:lb(a.pointers[c].clientY)},c++;return{timeStamp:nb(),pointers:b,center:F(b),deltaX:a.deltaX,deltaY:a.deltaY}}function F(a){var b=a.length;if(1===b)return{x:lb(a[0].clientX),y:lb(a[0].clientY)};for(var c=0,d=0,e=0;b>e;)c+=a[e].clientX,d+=a[e].clientY,e++;return{x:lb(c/b),y:lb(d/b)}}function G(a,b,c){return{x:b/a||0,y:c/a||0}}function H(a,b){return a===b?Cb:mb(a)>=mb(b)?a>0?Db:Eb:b>0?Fb:Gb}function I(a,b,c){c||(c=Kb);var d=b[c[0]]-a[c[0]],e=b[c[1]]-a[c[1]];return Math.sqrt(d*d+e*e)}function J(a,b,c){c||(c=Kb);var d=b[c[0]]-a[c[0]],e=b[c[1]]-a[c[1]];return 180*Math.atan2(e,d)/Math.PI}function K(a,b){return J(b[1],b[0],Lb)-J(a[1],a[0],Lb)}function L(a,b){return I(b[0],b[1],Lb)/I(a[0],a[1],Lb)}function M(){this.evEl=Nb,this.evWin=Ob,this.allow=!0,this.pressed=!1,y.apply(this,arguments)}function N(){this.evEl=Rb,this.evWin=Sb,y.apply(this,arguments),this.store=this.manager.session.pointerEvents=[]}function O(){this.evTarget=Ub,this.evWin=Vb,this.started=!1,y.apply(this,arguments)}function P(a,b){var c=t(a.touches),d=t(a.changedTouches);return b&(Ab|Bb)&&(c=u(c.concat(d),"identifier",!0)),[c,d]}function Q(){this.evTarget=Xb,this.targetIds={},y.apply(this,arguments)}function R(a,b){var c=t(a.touches),d=this.targetIds;if(b&(yb|zb)&&1===c.length)return d[c[0].identifier]=!0,[c,c];var e,f,g=t(a.changedTouches),h=[],i=this.target;if(f=c.filter(function(a){return p(a.target,i)}),b===yb)for(e=0;e<f.length;)d[f[e].identifier]=!0,e++;for(e=0;e<g.length;)d[g[e].identifier]&&h.push(g[e]),b&(Ab|Bb)&&delete d[g[e].identifier],e++;return h.length?[u(f.concat(h),"identifier",!0),h]:void 0}function S(){y.apply(this,arguments);var a=k(this.handler,this);this.touch=new Q(this.manager,a),this.mouse=new M(this.manager,a)}function T(a,b){this.manager=a,this.set(b)}function U(a){if(q(a,bc))return bc;var b=q(a,cc),c=q(a,dc);return b&&c?cc+" "+dc:b||c?b?cc:dc:q(a,ac)?ac:_b}function V(a){this.id=w(),this.manager=null,this.options=i(a||{},this.defaults),this.options.enable=m(this.options.enable,!0),this.state=ec,this.simultaneous={},this.requireFail=[]}function W(a){return a&jc?"cancel":a&hc?"end":a&gc?"move":a&fc?"start":""}function X(a){return a==Gb?"down":a==Fb?"up":a==Db?"left":a==Eb?"right":""}function Y(a,b){var c=b.manager;return c?c.get(a):a}function Z(){V.apply(this,arguments)}function $(){Z.apply(this,arguments),this.pX=null,this.pY=null}function _(){Z.apply(this,arguments)}function ab(){V.apply(this,arguments),this._timer=null,this._input=null}function bb(){Z.apply(this,arguments)}function cb(){Z.apply(this,arguments)}function db(){V.apply(this,arguments),this.pTime=!1,this.pCenter=!1,this._timer=null,this._input=null,this.count=0}function eb(a,b){return b=b||{},b.recognizers=m(b.recognizers,eb.defaults.preset),new fb(a,b)}function fb(a,b){b=b||{},this.options=i(b,eb.defaults),this.options.inputTarget=this.options.inputTarget||a,this.handlers={},this.session={},this.recognizers=[],this.element=a,this.input=z(this),this.touchAction=new T(this,this.options.touchAction),gb(this,!0),g(b.recognizers,function(a){var b=this.add(new a[0](a[1]));a[2]&&b.recognizeWith(a[2]),a[3]&&b.requireFailure(a[3])},this)}function gb(a,b){var c=a.element;g(a.options.cssProps,function(a,d){c.style[v(c.style,d)]=b?a:""})}function hb(a,c){var d=b.createEvent("Event");d.initEvent(a,!0,!0),d.gesture=c,c.target.dispatchEvent(d)}var ib=["","webkit","moz","MS","ms","o"],jb=b.createElement("div"),kb="function",lb=Math.round,mb=Math.abs,nb=Date.now,ob=1,pb=/mobile|tablet|ip(ad|hone|od)|android/i,qb="ontouchstart"in a,rb=v(a,"PointerEvent")!==d,sb=qb&&pb.test(navigator.userAgent),tb="touch",ub="pen",vb="mouse",wb="kinect",xb=25,yb=1,zb=2,Ab=4,Bb=8,Cb=1,Db=2,Eb=4,Fb=8,Gb=16,Hb=Db|Eb,Ib=Fb|Gb,Jb=Hb|Ib,Kb=["x","y"],Lb=["clientX","clientY"];y.prototype={handler:function(){},init:function(){this.evEl&&n(this.element,this.evEl,this.domHandler),this.evTarget&&n(this.target,this.evTarget,this.domHandler),this.evWin&&n(x(this.element),this.evWin,this.domHandler)},destroy:function(){this.evEl&&o(this.element,this.evEl,this.domHandler),this.evTarget&&o(this.target,this.evTarget,this.domHandler),this.evWin&&o(x(this.element),this.evWin,this.domHandler)}};var Mb={mousedown:yb,mousemove:zb,mouseup:Ab},Nb="mousedown",Ob="mousemove mouseup";j(M,y,{handler:function(a){var b=Mb[a.type];b&yb&&0===a.button&&(this.pressed=!0),b&zb&&1!==a.which&&(b=Ab),this.pressed&&this.allow&&(b&Ab&&(this.pressed=!1),this.callback(this.manager,b,{pointers:[a],changedPointers:[a],pointerType:vb,srcEvent:a}))}});var Pb={pointerdown:yb,pointermove:zb,pointerup:Ab,pointercancel:Bb,pointerout:Bb},Qb={2:tb,3:ub,4:vb,5:wb},Rb="pointerdown",Sb="pointermove pointerup pointercancel";a.MSPointerEvent&&(Rb="MSPointerDown",Sb="MSPointerMove MSPointerUp MSPointerCancel"),j(N,y,{handler:function(a){var b=this.store,c=!1,d=a.type.toLowerCase().replace("ms",""),e=Pb[d],f=Qb[a.pointerType]||a.pointerType,g=f==tb,h=s(b,a.pointerId,"pointerId");e&yb&&(0===a.button||g)?0>h&&(b.push(a),h=b.length-1):e&(Ab|Bb)&&(c=!0),0>h||(b[h]=a,this.callback(this.manager,e,{pointers:b,changedPointers:[a],pointerType:f,srcEvent:a}),c&&b.splice(h,1))}});var Tb={touchstart:yb,touchmove:zb,touchend:Ab,touchcancel:Bb},Ub="touchstart",Vb="touchstart touchmove touchend touchcancel";j(O,y,{handler:function(a){var b=Tb[a.type];if(b===yb&&(this.started=!0),this.started){var c=P.call(this,a,b);b&(Ab|Bb)&&c[0].length-c[1].length===0&&(this.started=!1),this.callback(this.manager,b,{pointers:c[0],changedPointers:c[1],pointerType:tb,srcEvent:a})}}});var Wb={touchstart:yb,touchmove:zb,touchend:Ab,touchcancel:Bb},Xb="touchstart touchmove touchend touchcancel";j(Q,y,{handler:function(a){var b=Wb[a.type],c=R.call(this,a,b);c&&this.callback(this.manager,b,{pointers:c[0],changedPointers:c[1],pointerType:tb,srcEvent:a})}}),j(S,y,{handler:function(a,b,c){var d=c.pointerType==tb,e=c.pointerType==vb;if(d)this.mouse.allow=!1;else if(e&&!this.mouse.allow)return;b&(Ab|Bb)&&(this.mouse.allow=!0),this.callback(a,b,c)},destroy:function(){this.touch.destroy(),this.mouse.destroy()}});var Yb=v(jb.style,"touchAction"),Zb=Yb!==d,$b="compute",_b="auto",ac="manipulation",bc="none",cc="pan-x",dc="pan-y";T.prototype={set:function(a){a==$b&&(a=this.compute()),Zb&&(this.manager.element.style[Yb]=a),this.actions=a.toLowerCase().trim()},update:function(){this.set(this.manager.options.touchAction)},compute:function(){var a=[];return g(this.manager.recognizers,function(b){l(b.options.enable,[b])&&(a=a.concat(b.getTouchAction()))}),U(a.join(" "))},preventDefaults:function(a){if(!Zb){var b=a.srcEvent,c=a.offsetDirection;if(this.manager.session.prevented)return void b.preventDefault();var d=this.actions,e=q(d,bc),f=q(d,dc),g=q(d,cc);return e||f&&c&Hb||g&&c&Ib?this.preventSrc(b):void 0}},preventSrc:function(a){this.manager.session.prevented=!0,a.preventDefault()}};var ec=1,fc=2,gc=4,hc=8,ic=hc,jc=16,kc=32;V.prototype={defaults:{},set:function(a){return h(this.options,a),this.manager&&this.manager.touchAction.update(),this},recognizeWith:function(a){if(f(a,"recognizeWith",this))return this;var b=this.simultaneous;return a=Y(a,this),b[a.id]||(b[a.id]=a,a.recognizeWith(this)),this},dropRecognizeWith:function(a){return f(a,"dropRecognizeWith",this)?this:(a=Y(a,this),delete this.simultaneous[a.id],this)},requireFailure:function(a){if(f(a,"requireFailure",this))return this;var b=this.requireFail;return a=Y(a,this),-1===s(b,a)&&(b.push(a),a.requireFailure(this)),this},dropRequireFailure:function(a){if(f(a,"dropRequireFailure",this))return this;a=Y(a,this);var b=s(this.requireFail,a);return b>-1&&this.requireFail.splice(b,1),this},hasRequireFailures:function(){return this.requireFail.length>0},canRecognizeWith:function(a){return!!this.simultaneous[a.id]},emit:function(a){function b(b){c.manager.emit(c.options.event+(b?W(d):""),a)}var c=this,d=this.state;hc>d&&b(!0),b(),d>=hc&&b(!0)},tryEmit:function(a){return this.canEmit()?this.emit(a):void(this.state=kc)},canEmit:function(){for(var a=0;a<this.requireFail.length;){if(!(this.requireFail[a].state&(kc|ec)))return!1;a++}return!0},recognize:function(a){var b=h({},a);return l(this.options.enable,[this,b])?(this.state&(ic|jc|kc)&&(this.state=ec),this.state=this.process(b),void(this.state&(fc|gc|hc|jc)&&this.tryEmit(b))):(this.reset(),void(this.state=kc))},process:function(){},getTouchAction:function(){},reset:function(){}},j(Z,V,{defaults:{pointers:1},attrTest:function(a){var b=this.options.pointers;return 0===b||a.pointers.length===b},process:function(a){var b=this.state,c=a.eventType,d=b&(fc|gc),e=this.attrTest(a);return d&&(c&Bb||!e)?b|jc:d||e?c&Ab?b|hc:b&fc?b|gc:fc:kc}}),j($,Z,{defaults:{event:"pan",threshold:10,pointers:1,direction:Jb},getTouchAction:function(){var a=this.options.direction,b=[];return a&Hb&&b.push(dc),a&Ib&&b.push(cc),b},directionTest:function(a){var b=this.options,c=!0,d=a.distance,e=a.direction,f=a.deltaX,g=a.deltaY;return e&b.direction||(b.direction&Hb?(e=0===f?Cb:0>f?Db:Eb,c=f!=this.pX,d=Math.abs(a.deltaX)):(e=0===g?Cb:0>g?Fb:Gb,c=g!=this.pY,d=Math.abs(a.deltaY))),a.direction=e,c&&d>b.threshold&&e&b.direction},attrTest:function(a){return Z.prototype.attrTest.call(this,a)&&(this.state&fc||!(this.state&fc)&&this.directionTest(a))},emit:function(a){this.pX=a.deltaX,this.pY=a.deltaY;var b=X(a.direction);b&&this.manager.emit(this.options.event+b,a),this._super.emit.call(this,a)}}),j(_,Z,{defaults:{event:"pinch",threshold:0,pointers:2},getTouchAction:function(){return[bc]},attrTest:function(a){return this._super.attrTest.call(this,a)&&(Math.abs(a.scale-1)>this.options.threshold||this.state&fc)},emit:function(a){if(this._super.emit.call(this,a),1!==a.scale){var b=a.scale<1?"in":"out";this.manager.emit(this.options.event+b,a)}}}),j(ab,V,{defaults:{event:"press",pointers:1,time:500,threshold:5},getTouchAction:function(){return[_b]},process:function(a){var b=this.options,c=a.pointers.length===b.pointers,d=a.distance<b.threshold,f=a.deltaTime>b.time;if(this._input=a,!d||!c||a.eventType&(Ab|Bb)&&!f)this.reset();else if(a.eventType&yb)this.reset(),this._timer=e(function(){this.state=ic,this.tryEmit()},b.time,this);else if(a.eventType&Ab)return ic;return kc},reset:function(){clearTimeout(this._timer)},emit:function(a){this.state===ic&&(a&&a.eventType&Ab?this.manager.emit(this.options.event+"up",a):(this._input.timeStamp=nb(),this.manager.emit(this.options.event,this._input)))}}),j(bb,Z,{defaults:{event:"rotate",threshold:0,pointers:2},getTouchAction:function(){return[bc]},attrTest:function(a){return this._super.attrTest.call(this,a)&&(Math.abs(a.rotation)>this.options.threshold||this.state&fc)}}),j(cb,Z,{defaults:{event:"swipe",threshold:10,velocity:.65,direction:Hb|Ib,pointers:1},getTouchAction:function(){return $.prototype.getTouchAction.call(this)},attrTest:function(a){var b,c=this.options.direction;return c&(Hb|Ib)?b=a.velocity:c&Hb?b=a.velocityX:c&Ib&&(b=a.velocityY),this._super.attrTest.call(this,a)&&c&a.direction&&a.distance>this.options.threshold&&mb(b)>this.options.velocity&&a.eventType&Ab},emit:function(a){var b=X(a.direction);b&&this.manager.emit(this.options.event+b,a),this.manager.emit(this.options.event,a)}}),j(db,V,{defaults:{event:"tap",pointers:1,taps:1,interval:300,time:250,threshold:2,posThreshold:10},getTouchAction:function(){return[ac]},process:function(a){var b=this.options,c=a.pointers.length===b.pointers,d=a.distance<b.threshold,f=a.deltaTime<b.time;if(this.reset(),a.eventType&yb&&0===this.count)return this.failTimeout();if(d&&f&&c){if(a.eventType!=Ab)return this.failTimeout();var g=this.pTime?a.timeStamp-this.pTime<b.interval:!0,h=!this.pCenter||I(this.pCenter,a.center)<b.posThreshold;this.pTime=a.timeStamp,this.pCenter=a.center,h&&g?this.count+=1:this.count=1,this._input=a;var i=this.count%b.taps;if(0===i)return this.hasRequireFailures()?(this._timer=e(function(){this.state=ic,this.tryEmit()},b.interval,this),fc):ic}return kc},failTimeout:function(){return this._timer=e(function(){this.state=kc},this.options.interval,this),kc},reset:function(){clearTimeout(this._timer)},emit:function(){this.state==ic&&(this._input.tapCount=this.count,this.manager.emit(this.options.event,this._input))}}),eb.VERSION="2.0.4",eb.defaults={domEvents:!1,touchAction:$b,enable:!0,inputTarget:null,inputClass:null,preset:[[bb,{enable:!1}],[_,{enable:!1},["rotate"]],[cb,{direction:Hb}],[$,{direction:Hb},["swipe"]],[db],[db,{event:"doubletap",taps:2},["tap"]],[ab]],cssProps:{userSelect:"none",touchSelect:"none",touchCallout:"none",contentZooming:"none",userDrag:"none",tapHighlightColor:"rgba(0,0,0,0)"}};var lc=1,mc=2;fb.prototype={set:function(a){return h(this.options,a),a.touchAction&&this.touchAction.update(),a.inputTarget&&(this.input.destroy(),this.input.target=a.inputTarget,this.input.init()),this},stop:function(a){this.session.stopped=a?mc:lc},recognize:function(a){var b=this.session;if(!b.stopped){this.touchAction.preventDefaults(a);var c,d=this.recognizers,e=b.curRecognizer;(!e||e&&e.state&ic)&&(e=b.curRecognizer=null);for(var f=0;f<d.length;)c=d[f],b.stopped===mc||e&&c!=e&&!c.canRecognizeWith(e)?c.reset():c.recognize(a),!e&&c.state&(fc|gc|hc)&&(e=b.curRecognizer=c),f++}},get:function(a){if(a instanceof V)return a;for(var b=this.recognizers,c=0;c<b.length;c++)if(b[c].options.event==a)return b[c];return null},add:function(a){if(f(a,"add",this))return this;var b=this.get(a.options.event);return b&&this.remove(b),this.recognizers.push(a),a.manager=this,this.touchAction.update(),a},remove:function(a){if(f(a,"remove",this))return this;var b=this.recognizers;return a=this.get(a),b.splice(s(b,a),1),this.touchAction.update(),this},on:function(a,b){var c=this.handlers;return g(r(a),function(a){c[a]=c[a]||[],c[a].push(b)}),this},off:function(a,b){var c=this.handlers;return g(r(a),function(a){b?c[a].splice(s(c[a],b),1):delete c[a]}),this},emit:function(a,b){this.options.domEvents&&hb(a,b);var c=this.handlers[a]&&this.handlers[a].slice();if(c&&c.length){b.type=a,b.preventDefault=function(){b.srcEvent.preventDefault()};for(var d=0;d<c.length;)c[d](b),d++}},destroy:function(){this.element&&gb(this,!1),this.handlers={},this.session={},this.input.destroy(),this.element=null}},h(eb,{INPUT_START:yb,INPUT_MOVE:zb,INPUT_END:Ab,INPUT_CANCEL:Bb,STATE_POSSIBLE:ec,STATE_BEGAN:fc,STATE_CHANGED:gc,STATE_ENDED:hc,STATE_RECOGNIZED:ic,STATE_CANCELLED:jc,STATE_FAILED:kc,DIRECTION_NONE:Cb,DIRECTION_LEFT:Db,DIRECTION_RIGHT:Eb,DIRECTION_UP:Fb,DIRECTION_DOWN:Gb,DIRECTION_HORIZONTAL:Hb,DIRECTION_VERTICAL:Ib,DIRECTION_ALL:Jb,Manager:fb,Input:y,TouchAction:T,TouchInput:Q,MouseInput:M,PointerEventInput:N,TouchMouseInput:S,SingleTouchInput:O,Recognizer:V,AttrRecognizer:Z,Tap:db,Pan:$,Swipe:cb,Pinch:_,Rotate:bb,Press:ab,on:n,off:o,each:g,merge:i,extend:h,inherit:j,bindFn:k,prefixed:v}),typeof define==kb&&define.amd?define(function(){return eb}):"undefined"!=typeof module&&module.exports?module.exports=eb:a[c]=eb}(window,document,"Hammer");
//# sourceMappingURL=hammer.min.map
},{}]},{},[1]);
