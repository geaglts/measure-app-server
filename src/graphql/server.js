import { ApolloServer } from "apollo-server";
import path from "path";
import { readFileSync } from "fs";
import isAuthenticated from "../functions/isAuthenticated";

const graphqlSchemaPath = path.resolve(__dirname, "typeDefs.graphql");
const typeDefs = readFileSync(graphqlSchemaPath, "utf-8");
import resolvers from "./resolvers";

export default new ApolloServer({
    typeDefs,
    resolvers,
    context: isAuthenticated,
    introspection: true,
    playground: true,
});
