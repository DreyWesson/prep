In writing our testwe will try to use the "In-memory server instance"

Why This Approach Works
In-Memory Testing: By using supertest with an in-memory instance of our Express app, we avoid the overhead of starting and stopping a server for each test run.
Isolation: Tests run in isolation, ensuring that each test starts with a clean state and does not interfere with others.
Speed: Running tests against an in-memory app is faster than making network requests to a live server.


### start app
docker compose up --build

### Run the shell of mongodb
docker exec -it mongo_shell mongosh --host db_mongo

### Interact with postgre
docker exec -it <container_name> psql -U <db_name>


### interact with you app
docker exec -it <container_name_or_id> /bin/bash
### Enviroment variables
After ececuting the app you then run <env> to see your env variables are properly passed
