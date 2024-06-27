const { buildSchema } = require("graphql");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const { ApolloServer } = require("apollo-server-express");

let users = [
  { id: "1", name: "Alice", age: 30 },
  { id: "2", name: "Bob", age: 25 },
];

const typeDefs = buildSchema(`
  type User {
    id: ID!
    name: String!
    age: Int!
  }

  type Query {
    getUser(id: ID!): User
    getUsers: [User]
  }

  type Mutation {
    addUser(name: String!, age: Int!): User
    updateUser(id: ID!, name: String, age: Int): User
    deleteUser(id: ID!): User
  }
`);

const resolvers = {
  Query: {
    getUser: (_, { id }, context) => {
      // Invoke middleware before resolver logic
      context.getUserMiddleware();
      return users.find((user) => user.id === id);
    },
    getUsers: () => users,
  },
  Mutation: {
    addUser: (_, { name, age }) => {
      const newUser = { id: String(users.length + 1), name, age };
      users.push(newUser);
      return newUser;
    },
    updateUser: (_, { id, name, age }) => {
      const index = users.findIndex((user) => user.id === id);
      if (index === -1) return null;

      if (name) users[index].name = name;
      if (age) users[index].age = age;

      return users[index];
    },
    deleteUser: (_, { id }) => {
      const index = users.findIndex((user) => user.id === id);
      if (index === -1) return null;

      const deletedUser = users.splice(index, 1)[0];
      return deletedUser;
    },
  },
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const middlewareForGetUser = (req, res, next) => {
  console.log("Middleware for getUser resolver");
  // Add custom logic here
  // next();
};

const server = new ApolloServer({
  schema,
  context: ({ req, res }) => {
    return {
      req,
      res,
      getUserMiddleware: middlewareForGetUser, // Attach middleware function to context
    };
  },
  introspection: true,
  playground: true,
});

module.exports = server;
