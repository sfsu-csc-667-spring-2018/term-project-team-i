# Team-I-Chess 
San Francisco State University - Csc 667 
##### Authors
   
   * Jimmy He
   * Razmik Hakobyan
   * Kimyou By

-----------------------------------------------------

Link to sample site using Heroku : [Team-i-chess](http://team-i-chess.herokuapp.com)

----------------------------------------------------------
A simple chess game with user authentication and chat

## Built With
   [Node.js](https://nodejs.org/en/)
   [Express.js](https://expressjs.com/)
   [Handlebars.js](https://handlebarsjs.com/)
   [Socket.io](https://socket.io/)
   [Passport.js](http://www.passportjs.org/)
   [Sequelize](http://docs.sequelizejs.com/)
   [PostgreSQL](https://www.postgresql.org/)

   You need to have Nodejs and PostgreSQL installed to run this application
   
---------------------------------------------------------------------   
#### Local Enviornment
Start off by making a .env file:

          touch .env
   
This file needs to have our database information in it in this following format:

          DATABASE_URL=postgres://[username]:[password]@localhost:[port]/[database_name]
          
          
Where   
         
        "[username]" = the user of the databse

        "[password]" = password for this user
        
        "[port]" = the port number of the database (postgres defaults to port "5432")
        
        "[database_name]" = the name of the database (postgres defaults to "postgres")
        
You can edit the file manually or simply (example): 

         echo DATABASE_URL=postgres://razmikh:samplepass@localhost:5432/postgres >> .env



Once this is done now it is time to get our dependencies by running:
  
        npm install

To run the app, first make sure that the current environment is set to "development":

        set NODE_ENV=development

run:

        npm run start
        
##### The app defaults to: 

       localhost:3000

## Database Scripts

* Create all the tables onto the database:
      
     Note: this script is ran after the dependencies are installed
             
        npm run db:migrate
        
 * Drop the most recently made table on the database
 
        npm run db:rollback
        
* Drop all tables in the database

        npm run db:rollback:all
