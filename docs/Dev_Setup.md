# Dev Setup

## Build Tooling

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


## Local Server

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

