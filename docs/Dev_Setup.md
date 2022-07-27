# Dev Setup

## Local Setup

Steps taken on macOS 12.4 intel
- install node v6
- npm install

Get ssh access to the development server: `nate`
- `ssh <your_user>_nate@ssh.phx.nearlyfreespeech.net`


Make a change to the js, then:
- `npm run publish`
- `rsync -azP ./dist/js/ <your_user>_nate@ssh.phx.nearlyfreespeech.net:/home/public/food-map/dist/js`
- visit [nate.nfshost.com to see changes](https://nate.nfshost.com/food-map/)

Note: Google API key is hardcoded in a couple files
- index.html: `<script src="https://maps.googleapis.com/maps/api/js?key=`
- settings/map.json: `"uReverseGeoCoding": "https://maps.googleapis.com/maps/api/geocode/json?key=`
- settings/map.json: `"uGeoCoding": "https://maps.googleapis.com/maps/api/geocode/json?key=`
To prevent alerts a member of the team with google admin access to the key needs to add restrictions to how the key can be used
The key is used by the users browser. It is bundled in the client-bundle.js. Deploying a new key will require changing
these values in the source code and then creating a new dist/js/client-bundle.

Note: MapBox API key is also exposed
- map.json: `"sMapboxAccessToken": "..."`

# Setup Notes

## Work Log
- node v6, webpack v1
- [Node v6 to v8 Breaking Changes](https://github.com/nodejs/wiki-archive/blob/master/Breaking-changes-between-v6-LTS-and-v8-LTS.md)
- [Webpack v1 documentation](https://github.com/webpack/docs/wiki/contents)

Steps taken on macOS 12.4 intel
- install node v6
- npm install
- npm install -g webpack-dev-server@1
- webpack-dev-server --port 3000
- npm run dev
- visit localhost:3000
- in network tab verify by checking the line with name "localhost" and in the response tab you can should see the contents of the index.html file 

Note: index.html loads scripts with an href that starts with `/food-map/dist`. 

There is no `food-map` dir by default, only the `dist` folder.

You could...
`mkdir food-map`
`mv dist food-map`

Then the hrefs dont need to change in the index.html file.

However I chose to load the bundle by removing the `/food-map` string in each script in the index.html
Also changed the uBase from `"/food-map"` to `""` in server/settings.json

Now when I `npm run dev` and start `webpack-dev-server --port 3000` I see an error in console about missing dependencies
I look up the version in the commit history that was the original target then add the dependency to package.json
After adding these dependencies, about 6 of them, the console complains about:

```
client.js:8 Uncaught Error: Cannot find module "./client.scss"
    at webpackMissingModule (client.js:8:9)
    at Object.<anonymous> (client.js:8:9)
    at __webpack_require__ (bootstrap cf687e843de6629ab6f1:50:1)
    at webpackJsonpCallback (bootstrap cf687e843de6629ab6f1:21:1)
    at client-bundle.js:1:1
```

This seems like webpack's css loader is not able to find the module to inline. 
Perhaps the relative url "./client.scss" is a problem?
- changing this url generates an error in shell that module cant be found
- but the url as its written appears to be found by webpack

If I comment out the call into client.css the app loads further showing the concrete-jungle logo
and these errors in console:

```
client.js:44 DEV mod is active.

jquery.js:9392          PUT http://localhost:3000/server/filter.php 405 (Method Not Allowed)

Uncaught (in promise) TypeError: Cannot read properties of undefined (reading 'setMessage')
    at init.actions.js:66:16
```

Furthermore, the splash page that appears shows styling applied from the css bundle, so its effectively being applied.
Is the require statement even necessary?
Webpack does not appear to be appending a hash to the classnames, so they dont seem to be local by default as
is the case with CSSModules.

Although package.json depends on style-loader/sass-loader/css-loader, webpack does not use them.
Perhaps these dependencies are not needed.

Webpack is only using [ExtractText plugin which seems to be deprecated after v1](https://github.com/webpack-contrib/extract-text-webpack-plugin/blob/webpack-1/README.md)

Skipping the require css import error, the next problem is the PUT .../filter.php 405 response
I cannot simply add a print stmt to the php, it will not get written anywhere i can see it.
`❯ tail -f /usr/local/var/log/httpd/access_log` simply reflects the same fact, a 405 is returned
 
Set up a new private nfs host and copied over the code from production, created a dump of the database and set it up on the new host.
Update the dbpass.php file, settings/server.json and a few other files to reflect the new host.
Kept the same dir structure, so the index.html references a /food-map

There is an undefined this error, caused by executing an error block that executed without a defined this value.
This was updated and then the error block surfaced a parseerror introduced by leaving off a semi-colon when updating the dbpass.php file.

After this was resolved the map loaded without any tiles, it was still using mapbox street v4 (prod uses v11, but that
change was not in the codebase). To fix this the url base variable "uGrayTiles" was updated to match the structure of
the prod url.

Also I downloaded a copy of production code and the editor highlighted a number of changes in production files that were not
tracked. I updated the code to include those changes.
- Production code is on the `scss` branch with a number of file changes that are not tracked
- Github's `master` branch has 1 commit ahead of the `scss` branch where the intro-js code was removed

This worked and loads the map with streets, however the tree markers do not appear, though they are successfully loaded in the network panel.
If I copy over the contents of the dist folder from prod to the nfshost, the site loads as expected.

If I `npm run publish` in the...
prod_site scss branch OR
prod_site updated master branch,
then rsync the /js dir, the site fails with:

```
Uncaught Error: Cannot find module "image-preloader-promise"
    at vendor-bundle.js:1:1267

Uncaught Error: Cannot find module "./search.component.scss"
    at client-bundle.js:14:9908
```

If I `npm run publish` in the...
fork's master branch,
then copy over the /js dir, the site renders the map without tree markers.

I can reset the code to the production server state by switching to the copy downloaded earlier and `rsync` the /js dir.
Why the difference in the original `/dist` folder and the `/dist` folder after I re-run npm publish?
Could the node modules be a different version than the ones used to create original js?
Running `git diff --stat` on the package-lock.json file shows over 30k changed lines `1 file changed, 15001 insertions(+), 15847 deletions(-)`

Fist, I need a reliable way to generate a bundle of js that is safe to deploy.
Then, I need to be able to deploy the bundled .css and any other assets.


### Setup PHP

macOS
- brew install php@7.4
- brew link php@7.4
- php -v

### Setup Apache on MacOS 12.0 Monterrey (Intel Based)

Note: Apple silicon (M1+) computers may store files in a different location.

[Setting up Apache Server on macOS 12](https://getgrav.org/blog/macos-monterey-apache-multiple-php-versions)

Also following instructions to load apache from: https://www.git-tower.com/blog/apache-on-macos/

```sh
❯ which httpd
/usr/sbin/httpd
```

Make changes to the conf file already used by MacOS.

`/usr/local/etc/httpd/httpd.conf`

- Change the port from 8080 to 80
- Enable PHP@7.4 module
- Enable vhosts
- Change the user/group to your username/staff

In the `extras/vhosts` file remove dummy vhosts and create a new one

