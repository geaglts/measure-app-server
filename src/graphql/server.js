import { ApolloServer } from "apollo-server";
import isAuthenticated from "../functions/isAuthenticated";

import typeDefs from "./typesDefs";
import resolvers from "./resolvers";

export default new ApolloServer({
    typeDefs,
    resolvers,
    context: isAuthenticated,
    introspection: true,
    playground: true,
});
