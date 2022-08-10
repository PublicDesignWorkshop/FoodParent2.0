# Dev Setup

## Local Setup

Steps taken on macOS 12.4 intel
- install node v6
- npm install

Get ssh access to the development server: `nate`
- `ssh <your_user>_nate@ssh.phx.nearlyfreespeech.net`

Why node v6?
- If you see errors when building that node-sass does not yet support your runtime environment, the version of node-sass used here
  - only supports up to node v7
  - However, if you need to run 'npm install' then be careful, node v6 ships with npm v3 which does not read the package-lock file
  - The lock file is needed to ensure the exact same dependencies are installed

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

Steps taken on macOS 12.4 intel, personal fork of repo, master branch
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
- If you forget to change this then you will see this error in the console:
- `Warning: [react-router] Location "/" did not match any routes`

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
 
---
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

Why doesn't the package-lock file restore the correct version of node_modules?
- looks like I am missing some dependencies. /searching package-lock.json reveals that pinch-zoom and react-select for example are not present
- these were stored in the git repo, perhaps that is related. using github to save the exact version instead of package-lock file
- also the version of npm i was using (v3) does not read or write to package-lock

How do I install npm v6 or later?
- oddly when I run `npm install -g npm@latest`, zsh complains the `npm` command is not longer found
- use n to switch to node v16, npm install latest and then `npm install --package-lock-only`
- this created a new package-lock file with npm v8. it contains the dependencies for the app
- the original is a list of both deps and dev-deps mixed together and still missing many deps like image-preloader-promise
- switch node version back to node v6
- npm run publish 
- excellent now I have only one error generated 

```
ERROR in ./client/client.scss
Module build failed: ModuleNotFoundError: Module not found: Error: Cannot resolve 'file' or 'directory' ../fonts/fontawesome-webfont.eot in /Users/natobyte/Programming/data/FoodParent_Prod/orig_site copy/food-map/client
```
- fontawesome-webfont does exist in orig github node_modules/font-awesome/fonts dir
- rg `font-aweseome-webfont` does not appear in the repo (so this is likely in node_modules since rg ignores that dir)
- fontawesome-webfont does exist in our copy of node_modules/font-awesome/fonts ... so why cant webpack find it?
- ill try the same technique from previous attempt and comment out the require(client.scss) in client.js
- now webpack runs without errors, deploying
- now the map loads without tree-markers like my own personal branch, however this doesn't log `DEV mod is active.` like my branch and production do.

Why are the tree-markers missing?
- most likely its from removing require(client.scss) in client.js
  - can i just ignore the webpack error and deploy anyway?
  - no, throws an error

```
Uncaught Error: Cannot find module "./client.scss"
    at client-bundle.js:1:1311
```
  - seems that perhaps a relative url `../fonts/` is confusing webpack, also webpack creates a `dist/font/` dir that is singular.
  - also the dev build creates a client-bundle and the prod build creates a broken.css bundle.

```
var devPluginList = [
  new ExtractTextPlugin('./../css/client-bundle.css', {
    allChunks: true
  }),
 
var productionPluginList = [
  new ExtractTextPlugin('./../css/broken-bundle.css', {
    allChunks: true
  }),
```
  - try changing config to say client-bundle.css same as dev
    - this simply changed the emmitted file, same error
  - try running dev, 
    - same error
  - try just moving the fonts into /client where webpack is expecting them, then publish
    - error still occurs even though the fonts now exist under `/client/fonts/fontawesome-webfont` as the error wants
  - following an [SO article](https://stackoverflow.com/questions/33649761/how-do-i-load-font-awesome-using-scss-sass-in-webpack-using-relative-paths)
    - editing the path in client.scss loading /scss/font-awesome.scss seems to call a file that then calls a relative url
    - from node_modules/font-awesome/scss/_variables `$fa-font-path: "../fonts" !default;`
    - this works, no errors. but its going to get overwritten when node_modules reinstalled
    - rsync to server, no change in map, still loads blue dots for tree markers

- but wrt to the console.log Dev mode comment missing, perhaps i should run the `npm run dev` command
  - dev is not using the uglify script, this might not matter, hard to know for sure
  - deployed the dev mode bundle and now get the same log statements PLUS these "intro: " logs wrt to recent changes
  - so I thought those changes to the intro step were running in prod, but since nothing is logged this is probably not true 
  - still the tree markers do not render!

- trace the code that creates the markers:
  - cant find anything from greping the code for gingko, or background-image, or url(
  - craig says leaflet probably loads the custom markers, seems helpful but looking at code I cant quickly tell what type of data is stored in a var
  - unable to add breakpoints to look around in the code because i cant get it running locally and have to create a bundle and deploy it to see what is logged
  - this takes too long. its time to fix the problem with the code locally so I can debug it.
  - how do i debug production code
  - - add debugger stmts and deploy them, slow iteration ~4 min

- Setup local devlopment with a full mysql db to get this working
  - `brew install mysql@5.7`
  - `brew link --force mysql@5.7`
  - `mysql_secure_installation`
  - `mysql -u root -p`
  - GRANT CREATE, ALTER, DROP, INSERT, UPDATE, DELETE, SELECT, REFERENCES, RELOAD on *.* TO 'my_user'@'localhost' WITH GRANT OPTION;
  - SHOW GRANTS FOR 'my_user'@'localhost';
  - CREATE DATABASE tree_parent
  - `head -n 5 tree_parent.dump`
  - `mysql -u username -p tree_parent < tree_parent.dump`
  - login and > USE tree_parent; SHOW TABLES;


- try reversing those changes to the map and tree components found in code deployed to prod but not in the bundle
  - then run the dev mode, now the log stmts match prod exactly, but still no tree-markers

- check prod site orig for changes to fontawesome node_modules
  - looks like it was edited, from node_modules in git origin/scss node_modules/font-awesome/scss/font-awesome.scss

```
$fa-font-path:        "./../node_modules/font-awesome/fonts" !default;
```

  - here is the expected value when running npm install

```
$fa-font-path: "../fonts" !default;
```


- Add debbuger stmt and deploy
  - webpack config needs to be set to stop dropping the debugger statements
  - this is slow

- Build locally
  - add the users pw to dbpass.php, remove "food-map" from the server/config uBase for react-router to stop throwing that error
  - `brew services start mysql` & `httpd`
  - `npm run dev`
  - http://localhost:3000/

```
PUT http://localhost:3000/server/filter.php 405 (Method Not Allowed)
```

- TODO: maybe something wrong with server setup, is it possible to setup phpmyadmin as a test?


### Setup PHP

macOS
- brew install php@7.4
- brew link php@7.4
- php -v

Note: If you have already done this before but notice php is pointing to v8 check that the sym links were not overwritten.
- `brew link --overwrite --dry-run php@7.4`
- if you see links to another version such as `/usr/local/bin/pear -> /usr/local/Cellar/php/8.1.8/bin/pear` then overwrite

### Setup Apache on MacOS 12.0 Monterrey (Intel Basedql

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

Remember to start this service
- `brew services start httpd`

### Setup the database

- `brew install mysql@5.7`
- `brew link --force mysql@5.7`

Note: If you make a mistake you can remove and reinstall
- `brew uninstall mysql@5.7`
- `rm -rf /usr/local/var/mysql`
- `rm /usr/local/etc/my.cnf`
- you may need to edit your PATH var if a 2nd version of mysql installed that is hidden by PATH export
- source
- check: `mysql --version`
- `brew uninstall mysql`
