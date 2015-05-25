# path-ninja
Path Ninja wraps up some common fuctions for negotiating and walking file directories in a Node.js project.

# Install
```bash
  npm install path-ninja
```

# Usage
## pathNinja.registerBase('/base/path/to/files', *[callback]*)
Typically this will be your projects' base directory, but you can make it any directory that you'll be loading (read 'require'-ing) files from.  Later when registering directories

**Callback** signature:
 * *err* Null, or Error object if error occured.
 * *paths* Object registrar of registerd paths; see **pathNinja.paths**.

```bash
//Project layout
//  /Users/people/project_dir
//    |_ lib
//    |_ images

var pathNinja = require('path-ninja');
pathNinja.registerBase('/Users/people/project_dir');
```

#### ProTip
If you're setting up Path Ninja from a base project file (like 'app.js' in an Express server) then you can use **__dirname** to set you're base dynamically whenever your project is deployed on differnent machines/operating systems.


## pathNinja.register('dir1', ['dir2', ...], *[callback]*)
**register** will recursivly add all the given directories listed and all sub-directories to the internal registrar.

**Callback** signature:
 * *err* Null, or Error object if error occured.
 * *paths* Object registrar of registerd paths; see **pathNinja.paths**.
 
```bash
//Project layout
//  /Users/people/project_dir
//    |_ lib
//       |_ modules
//    |_ images

var pathNinja = require('path-ninja');
pathNinja.registerBase('/Users/people/project_dir');
pathNinja.register(['lib', 'images'])

//Effective Internal Registrar
{
  lib: '/Users/people/project_dir/lib',
  lib/modules: '/Users/people/project_dir/lib/modules',
  images: '/Users/people/project_dir/images'
}
```


## pathNinja.paths(*[callback]*)
Returns the registrar object used to navigate the paths as object defreferencing.

**Callback** signature:
 * *err* Null, or Error object if error occured.
 * *paths* Object registrar of registerd paths; see **pathNinja.paths**.

```bash
//Project layout
//  /Users/people/project_dir
//    |_ lib
//      |_ file.txt
//      |_ modules
//        |_ some.module.js
//    |_ images

var pathNinja = require('path-ninja');
pathNinja.registerBase('/Users/people/project_dir');
pathNinja.register(['lib', 'images'])
var Paths = pathNinja.paths();

Paths.lib()                   //returns '/Users/people/project_dir/lib'
```

### pathNinja.paths().*directory*(*[string]*, *[opts]*, *[callback]*)
Signature:
  * **string**: appends it to the registered path and returns result if the file/directory exists, or null.
  * **opts**: applies per-call options, manipulating the results.
  * **callback**:
    * **err**  Null, or Error object if error occured.
    * **result** String or array of string paths depending on **opts**; defaults to returning a single path.

You can navigate to lower paths by using object dereferencing syntax on the paths registrar object and calling the sub-directory as function to scope requests to that directory.

```bash
//Project layout
//  /Users/people/project_dir
//    |_ lib
//      |_ file.txt
//      |_ modules
//        |_ some.module.js
//    |_ images

var pathNinja = require('path-ninja');
pathNinja.registerBase('/Users/people/project_dir');
pathNinja.register(['lib', 'images'])
var Paths = pathNinja.paths();

Paths.lib()                             //returns '/Users/people/project_dir/lib'
Paths.lib('file.txt')                   //returns '/Users/people/project_dir/lib/file.txt'
Paths.lib('anything/else')              //returns null since that directory doesn't exist

Paths.lib.modules('some.module.js')     //returns '/Users/people/project_dir/lib/modules/some.module.js'
```

## Path Options
The following path options can be supplied to alter the results of the registrar function.
  * *recursive*: Returns sorted list of all sub-directories and files in that path.
  * *isFile*: Returns sorted list of all files in that path.

```bash
//Project layout
//  /Users/people/project_dir
//    |_ lib
//      |_ file.txt
//      |_ modules
//        |_ some.module.js
//    |_ images

var pathNinja = require('path-ninja');
pathNinja.registerBase('/Users/people/project_dir');
pathNinja.register(['lib', 'images'])
var Paths = pathNinja.paths();

var results = Paths.lib({ recursive: true }) 
//'results' contains the array of strings:
// ['/Users/people/project_dir/lib', 
//  '/Users/people/project_dir/lib/file.txt',
//  '/Users/people/project_dir/lib/modules',
//  '/Users/people/project_dir/lib/modules/some.module.js']

var results = Paths.lib({ recursive: true, isFile: true }) 
//'results' contains the array of strings:
// ['/Users/people/project_dir/lib/file.txt',
//  '/Users/people/project_dir/lib/modules/some.module.js']
```
