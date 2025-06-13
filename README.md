# About
- users can login/register either through email/username/password or through GitHub/Google
- a **user** can create posts and like/unlike other posts, change their account information, password, etc.
- a **moderator** can delete any post of any user as well as do anything a regular user can
- an **admin** can give/take users moderator roles as well as do anything a moderator/user can, there is a default ***admin*** user with the password '*admin*' and email '*admin@admin*'
- *note*: some features of the Spring Boot backend have not yet been implemented on the React frontend


****disclaimer***: the Spring Boot application uses the H2 in-memory database, so most of the data saved on the server will be gone after the application shuts down or restarts

## How to run
- Google and GitHub OAuth 2.0 clients need to be set up beforehand: use the client url for the Authorised JavaScript origins field/Homepage URL and use the server url + '/login/oauth2/code/google (or github)' for the Authorised redirect/callback urls
- create an **application.yml** file according to the **exampleApplication.yml** file in *src/main/resources*
- See the [official docs](https://docs.spring.io/spring-boot/docs/1.5.16.RELEASE/reference/html/using-boot-running-your-application.html)
- **or** if you have [Java 17+](https://www.oracle.com/java/technologies/downloads/#java17) run `./mvnw clean spring-boot:run`
- Should be running on **localhost** on port 8080
- To run the frontend: `cd frontend` from root directory then `npm install` and `npm run dev` which should then be running on port 5173
- to make a user an admin, insert his id with the desired role id into the user_roles table; admins can manage other users' moderator roles
