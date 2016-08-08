/*global describe, it, expect, beforeEach */
var ImagePreloader = require('../src/ImagePreloader.js').default;

describe('ImagePreloader', function () {
	beforeEach(function (done) {
        done();
	});
	
	it('throws an error on preloadImage when path is null', function () {
		var threwError = false;
		try {
			ImagePreloader.preloadImage(null);
		}
		catch (error) {
			expect(error.message).toBe('path is a required string');
			threwError = true;
		}
		
		expect(threwError).toBe(true);
	});
	
	it('throws an error on preloadImage when path is undefined', function () {
		var threwError = false;
		try {
			ImagePreloader.preloadImage(undefined);
		}
		catch (error) {
			expect(error.message).toBe('path is a required string');
			threwError = true;
		}
		
		expect(threwError).toBe(true);
	});
	
	it('throws an error on preloadImage when image does not exist', function (done) {
		var imagePath = 'http://somesite/someimage.gif';
			
		ImagePreloader.preloadImage(imagePath)
			.then(function (data) {
				done.fail("the image does not exist.")
			})
			.catch(function (err) {
				expect(err.path[0].src).toBe(imagePath);
                done();
			});
	});
    
    it('calls the then method of preloadImage when the image does exist', function (done) {
        var imagePath = 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png';
        
        ImagePreloader.preloadImage(imagePath)
			.then(function (data) {
                done();
			})
			.catch(function (err) {
				done.fail("the image should exist and this should not fire.")
			});
    });
    
    it('throws an error if preloadImages is called with a null argument', function (done) {
        try {
            ImagePreloader.preloadImages(null);
            done.fail('an error should have been thrown');
        }
        catch(err) {
            expect(err.message).toBe('paths must be an array of strings or a single string');
            done();
        }
    });
    
    it('calls the then method of preloadImages when a single image reference is passed for an image that exists and one that doesn\'t', function (done) {
        var imagePath = ['https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png', 'http://somesite/someimage.gif'];
        
        ImagePreloader.preloadImages(imagePath)
			.then(function (data) {
                expect(data[0].state).toBe('fulfilled');
                expect(data[1].state).toBe('rejected');
                done();
			})
			.catch(function (err) {
				done.fail("the image should exist and this should not fire.");
			});
    });
});