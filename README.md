#Quix Web App

##Branches

There are 3 main branches:

1. `dev`

    Where active development goes on. Features are added here or in additonal branches and merged here.

2. `master`

    The current stable state of the project. Dev is merged in whenit is deemed necessary.

3. `heroku`

    Due to the directory structure of the project and certain limitations, the master branch in its normal
    state should not be pushed to Heroku since its too big and contains all of the unminned and whatnot
    front end source.

    This branch exists to serve as an example of what the project should look like before deployed to Heroku,
    or generally any node hosting service.

##Structure

Since yeoman is used for the scaffolding of the front end, it has its own package.json, Gruntfile,
etc. all in the `front` subdirectory.

The server (built with expressjs on node) resides in the root directory and, when ran, serves the web
app's static files (built from the front end) in the `public` directory (__which will soon be configurable,
although you must only modify a line in 'server.js' to change this__).

##Requirements

The entire project is node.js-based so you must have npm and node installed to even begin. I would Google
around if you don't know how to do this.

The front end is built entirely off of yeoman scaffolding using the angular generator. This means that
to work on the front end, you need to have both grunt and bower installed globally through npm (Note: 
you might have to use `sudo` or whatever your OS uses to provide elevated permisions for global install):

    npm install -g grunt-cli bower

##Front End Development

###Easy Development with Grunt

When developing on the front end, `cd` into `front` and run:

    grunt server
    
which will provide VERY useful things like automatic watching of file changes, rebuilding of coffee/sass files,
and livereload which reloads the browser when any changes occur.

Read more about grunt usage in yeoman at the bottom of the page [here](http://yeoman.io/gettingstarted_1.0.html)

###Components with Bower

Along with yeoman scaffolding comes the package manager bower which installs and provides front end JS
packages and components. Just `cd front` and run bower as described [here](http://twitter.github.com/bower/).

You must manually include these components using `<script>` tags in `index.html`.

##Building

__If you plan on deploying the app to Heroku, follow the *Deploying to Heroku* instructions below__

1. Begin by cloning this repo

        git clone git://github.com/bericp1/quix.git
        cd quix

2. Install dependencies for the front end

        cd front
        npm install
        cd ../
    
3. Optionally, install dependencies for the back end. If you plan on deploying to Heroku, you might not
    want to do this since it will keep your uploaded package small and Heroku will install dependencies
    on their side during their automated server build process if there is no node_modules anyway.
    
        npm install

4. Build the front end so that static, ready-to-serve files are outputted to `front/dist`

        cd front
        grunt build
        cd ../

5. Move the built front end to the root directory under `public` where server.js looks for
    and serves the necessary static files by default. (and optionally delete the `front`
    directory to free up some space)

        cp front/dist public -r
        rm front -r

##Running the server

The server (in the root directory) is ready to go as is so long as your static files were built
and placed correctly as described above. Just use foreman (`npm install foreman`) to
run the server:

    foreman start

Or just run server.js with node:

    node server.js

##Deploying to Heroku

If you plan on deploying the app to heroku, it is *strongly* suggested that you create a seperate
`staging` branch and preform the installation procedure in that branch since heroku deployment
requires a bit of demolition.

__Before following the above *Building* instructions, create the new branch.__ This should be done
immediately after cloning:

    git checkout -b staging

__Now follow the above *Building* instrucitons before continuing.__

The following commits the changes made during the build process locally, creates a new heroku app
(which requires the heroku toolbelt to be installed on your machine), and finally pushes the `staging`
branch to `master` on Heroku's servers where it is built and served.

    git add -A
    git commit -m "Deploying to Heroku"
    heroku create <app_name_here>
    git push heroku staging:master

Then one can switch back to the master or dev branch to continue development:

    git checkout {dev or master or whichever branch your developing on}

When changes need to be deployed to Heroku again, just make sure your changes are commited on your
current development branch:

    git add -A
    git commit -m "Your commit message"

Now switch to `staging` and merge in your changes:

    git checkout staging
    git merge {your dev or master or whatever branch}

You would now follow the *Building* instructions again to prepare it for deployment.

And finally deploy to Heroku (after commiting build changes locally) as you have done before:

    git add -A
    git commit -m "Deploying again"
    git push heroku staging:master

##Build Automation

__I do plan on working on some form of build automation but, despite first appearence, this really isn't a whole lot to do.__