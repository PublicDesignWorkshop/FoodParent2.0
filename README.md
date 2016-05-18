# FoodParent
_FoodParent_ is a web-based application as a part of Concrete Jungle’s _FoodParent_ project. The project helps to create virtual connection between trees and citizens who can provide status of fruits in Atlanta. The application provides a tool for creating a connection between trees and people by posting status notes via smart devices and tracking history of trees over years to help Concrete Jungle decide the proper time for foraging fruits and distribute to the needy.

## Installation
_*{} is variable that can be different based on your environment._

### Prerequisites
* FoodParent package file from https://github.com/PublicDesignWorkshop/FoodParent2.0.git.
* [node.js](https://nodejs.org/en/) to use npm command in OSX and Windows.
* Apache server / PHP
* MySQL ^5.0

### Compile Configuration
* Open `settings.json` file under {app-root-directory}/src/constraint directory.
* Change `uBaseName` and `uBaseNameForWebPack` values based on the relative location of {app-root-directory} from {apach-htdocs} directory. If {app-root-directory} is the {apach-htdocs}, put `"uBaseName": ""` and `"uBaseNameForWebPack": "/"`. If the {app-root-directory} is located under {apach-htdocs} directory, such as {apach-htdocs}/{app-root-directory}, put `"uBaseName": "/{app-root-directory}"` and `"uBaseNameForWebPack": "/{app-root-directory}/"`.
* Open `index.html` file under {app-root-directory}.
* Find all `/FoodParent2.0` change into relative location of {app-root-directory}. If the {app-root-directory} is the {apach-htdocs}, remove all `/FoodParent2.0`.

### Compilation and Bundle
* Open terminal or command prompt and move to the app directory.
* Run `npm install` to install all dependency libaries.
* Run `npm run dev` or `npm run build` to generate compiled `foodparent.js` and `foodparent.map.js` file under {app-root-directory}/dist directory.

### Server Configuration
* Open `php.ini` configuration file under {apach} directory. If you are using external hosting service, ask hosting manager.
* Find `upload_max_filesize` and set the value higher than 6M. This value defines the maximum size of file, and some of image files generated from smart devices exceeds 4M.
```
; Maximum allowed size for uploaded files.
; http://php.net/upload-max-filesize
upload_max_filesize=6M
```

### Database Setup
* Create a MySQL database, and admin user account and password for the database.
* 
* Copy `database.php` and `dbpass.php` files from {app-root-directory}/serverconfig to {app-root-directory}/server directory.
* Open `database.php` file and put your database information.
```php
class database extends dbpass {
    public $host = "{database host address}";    //ex> localhost
    public $username = "{database account name}"; //ex> root (not recommended)
    public $port = {database port number};    //ex> 3306.
    public $db_name = "{database name}";    // ex> foodparent
}
```
* Open `dbpass.php` file and put your database account password.
```php
class dbpass {
    public $password = "";
}
```
## Installation - Server

<<<<<<< HEAD
  class database extends dbpass {
    public $host = "localhost";
    public $username = "cj";
    public $port = 3306;
    public $db_name = "tree_parent";
  }
=======
>>>>>>> f35cf9b941a291ffec59522a063fa34878f4d18b
