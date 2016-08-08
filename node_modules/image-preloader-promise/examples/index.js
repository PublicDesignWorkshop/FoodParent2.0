import ImagePreloader from '../src/ImagePreloader.js';

let imageSrc = 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png';

ImagePreloader.preloadImage(imageSrc)
	.then(() => {
		console.log('Image loaded!');		
	})
	.catch((error) => {
		console.log('The image was not able to be loaded!');
	});
	
let imagePath = ['https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png', 'http://somesite/someimage.gif'];
ImagePreloader.preloadImages(imagePath)
	.then(function (data) {
		console.log('At least one image was loaded!');
		for (var x = 0; x < data.length; x++) {
			console.log(`image ${x} was ${data[x].state}`);
		}
	})
	.catch(function (err) {
		console.log('None of the images were not able to be loaded!');
	});