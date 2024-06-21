In writing our testwe will try to use the "In-memory server instance"

Why This Approach Works
In-Memory Testing: By using supertest with an in-memory instance of our Express app, we avoid the overhead of starting and stopping a server for each test run.
Isolation: Tests run in isolation, ensuring that each test starts with a clean state and does not interfere with others.
Speed: Running tests against an in-memory app is faster than making network requests to a live server.