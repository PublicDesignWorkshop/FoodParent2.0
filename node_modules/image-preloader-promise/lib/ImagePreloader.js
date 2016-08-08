'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _q = require('q');

var _q2 = _interopRequireDefault(_q);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ImagePreloader = function () {
	function ImagePreloader() {
		_classCallCheck(this, ImagePreloader);
	}

	_createClass(ImagePreloader, null, [{
		key: 'preloadImage',
		value: function preloadImage(path) {
			if (!path) {
				throw new Error('path is a required string');
			}

			return new Promise(function (resolve, reject) {
				var img = document.createElement('img');
				img.onerror = function (err) {
					reject(err);
				};

				img.onload = function () {
					resolve(img);
				};

				img.src = path;
			});
		}
	}, {
		key: 'preloadImages',
		value: function preloadImages(paths) {
			if (typeof paths === 'string') {
				paths = [paths];
			}

			if (!Array.isArray(paths)) {
				throw new Error('paths must be an array of strings or a single string');
			}

			var promises = [];

			for (var x = 0; x < paths.length; x++) {
				promises.push(ImagePreloader.preloadImage(paths[x]));
			}

			return _q2.default.allSettled(promises);
		}
	}]);

	return ImagePreloader;
}();

exports.default = ImagePreloader;
//# sourceMappingURL=ImagePreloader.js.map