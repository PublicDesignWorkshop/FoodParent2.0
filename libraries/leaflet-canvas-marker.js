/*

*/

// let MapStore = require('./../client/stores/map.store');
// let MapSetting = require('./../setting/map.json');


(function (window, document, undefined) {

L.CanvasMarker = L.Circle.extend({
  statics: {
		//CLIP_PADDING: 0.02, // not sure if there's a need to set it to a small value
		CANVAS: true,
		SVG: false
	},

  initialize: function (latlng, radius, options) {
		L.Path.prototype.initialize.call(this, options);

		this._latlng = L.latLng(latlng);
		this._mRadius = radius;

    this._image = this.options.image;
    this._shadow = this.options.shadow;
    this._checkMode = this.options.checkMode;
    this._checked = this.options.checked;
	},

  // initialize: function (latlng, options) {
	// 	L.Circle.prototype.initialize.call(this, latlng, null, options);
	// 	this._radius = this.options.radius;
  //   this._img = this.options.img;
	// },


  _drawPath: function () {
    this._radius = this._map.getZoom() * 0.75;
    var p = this._point;
		// this._ctx.beginPath();
		// this._ctx.arc(p.x, p.y, this._radius, 0, Math.PI * 2, false);
    if (this._image) {
      var width = this._map.getZoom();
      var height = Math.floor(width * 32 / 20);
      this._ctx.save();
      this._ctx.globalAlpha = this._map.getZoom() / 28;
      this._ctx.drawImage(this._shadow, p.x - height * 0.5 + Math.floor(this._ctx.globalAlpha * 10), p.y - height, height, height);
      this._ctx.restore();
      if (this._checkMode) {

        if (this._checked) {
          this._ctx.save();
          this._ctx.globalAlpha = 1;
          this._ctx.drawImage(this._image, p.x - width * 0.5, p.y - height, width, height);
          this._ctx.restore();
          this._ctx.drawImage(this._checked, p.x - width * 0.5, p.y - height, width, height);
        } else {
          this._ctx.save();
          this._ctx.globalAlpha = 0.5;
          this._ctx.drawImage(this._image, p.x - width * 0.5, p.y - height, width, height);
          this._ctx.restore();
        }
      } else {
        this._ctx.drawImage(this._image, p.x - width * 0.5, p.y - height, width, height);
      }
    }
	},

  _containsPoint: function (p) {
    if (this._map == null) {
      return null;
      // this._map = MapStore.getMapModel(MapSetting.sMapId).map;
    }

		var center = new L.Point(this._point.x, this._point.y - this._map.getZoom()),
		    w2 = this.options.stroke ? this.options.weight / 2 : 0;

		return (p.distanceTo(center) <= this._radius + w2);
	},

  getPopup: function () {
		return this._popup;
	}

});
//
// L.CanvasActiveMarker = L.CircleMarker.extend({
//   statics: {
// 		//CLIP_PADDING: 0.02, // not sure if there's a need to set it to a small value
// 		CANVAS: true,
// 		SVG: false
// 	},
//
//   // initialize: function (latlng, radius, options) {
// 	// 	L.Path.prototype.initialize.call(this, options);
//   //
// 	// 	this._latlng = L.latLng(latlng);
// 	// 	this._mRadius = radius;
//   //
//   //   this._image = this.options.image;
//   //   this._shadow = this.options.shadow;
// 	// },
//
//   initialize: function (latlng, options) {
// 		L.Circle.prototype.initialize.call(this, latlng, null, options);
// 		this._radius = this.options.radius;
//     this._image = this.options.image;
//     this._shadow = this.options.shadow;
// 	},
//
//
//   _drawPath: function () {
//     this._radius = this._map.getZoom() * 0.35;
//     var p = this._point;
// 		// this._ctx.beginPath();
// 		// this._ctx.arc(p.x, p.y, this._radius, 0, Math.PI * 2, false);
//     if (this._image) {
//       var width = this._map.getZoom();
//       var height = Math.floor(width * 32 / 20);
//       this._ctx.save();
//       this._ctx.globalAlpha = this._map.getZoom() / 32;
//       this._ctx.drawImage(this._shadow, p.x - height * 0.5 + Math.floor(this._ctx.globalAlpha * 10), p.y - height, height, height);
//       this._ctx.restore();
//       this._ctx.drawImage(this._image, p.x - width * 0.5, p.y - height, width, height);
//     }
// 	},
//
//   _containsPoint: function (p) {
//     if (this._map == null)
//       return false;
// 		var center = new L.Point(this._point.x, this._point.y - this._map.getZoom()),
// 		    w2 = this.options.stroke ? this.options.weight / 2 : 0;
//
// 		return (p.distanceTo(center) <= this._radius + w2);
// 	},
//
//   getPopup: function () {
// 		return this._popup;
// 	}
//
// });


}(window, document));
