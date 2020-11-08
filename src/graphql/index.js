import { ApolloServer } from "apollo-server";
import typeDefs from "./types";

export default new ApolloServer({
    typeDefs,
});
