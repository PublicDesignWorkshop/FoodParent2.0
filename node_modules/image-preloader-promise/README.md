# image-preloader-promise
Preload an image or a collection of images and return a promise (ES6)

## installation

node:
```
npm install image-preloader-promise
```

## usage

preload a single image
```js
ImagePreloader.preloadImage(imageSrc)
	.then(() => {
		console.log('Image loaded!');		
	})
	.catch((error) => {
		console.log('The image was not able to be loaded!');
	});
```

preload multiple images
```js
let imagePath = ['https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png', 'http://somesite/someimage.gif'];
ImagePreloader.preloadImages(imagePath)
	.then(function (data) {
		console.log('At least one image was loaded!');
		for (var x = 0; x < data.length; x++) {
			console.log(`image ${x} was ${data[x].state}`);
		}
	})
	.catch(function (err) {
		console.log('None of the images were able to be loaded!');
	});
```