import q from 'q';

export default class ImagePreloader {
	static preloadImage(path) {
		if (!path) {
			throw new Error('path is a required string');
		}
		
		return new Promise((resolve, reject) => {
			let img = document.createElement('img');
			img.onerror = function (err) {
				reject(err);
			};
			
			img.onload = function () {
				resolve();
			};
			
			img.src = path;
		});
	}
	
	static preloadImages(paths) {
		if (typeof paths === 'string') {
			paths = [paths];
		}
		
		if (!Array.isArray(paths)) {
			throw new Error('paths must be an array of strings or a single string');
		}
		
		let promises = [];
		
		for (var x = 0; x < paths.length; x++) {
			promises.push(ImagePreloader.preloadImage(paths[x]));
		}
		
		return q.allSettled(promises);
	}
}