import { config } from "dotenv";
config();

import { ApolloServer } from "apollo-server";
import { isAuthenticated } from "./functions/auth";

//typeDefs
import {
    UserTypes,
    PhoneTypeTypes,
    ClientTypes,
    MeasureTypes,
    PhoneTypes,
} from "./types";

//resolvers
import {
    UserResolvers,
    PhoneTypeResolvers,
    ClientResolvers,
    MeasureResolvers,
    PhoneResolvers,
} from "./resolvers";

import { merge } from "lodash";

const typeDefs = `
    type Status {
        message: String,
        loading: Boolean
        success: Boolean
        error: String
    }

    type Query {
        _ : Boolean
    }

    type Mutation {
        _ : Boolean
    }
`;

const server = new ApolloServer({
    typeDefs: [
        typeDefs,
        UserTypes,
        PhoneTypeTypes,
        ClientTypes,
        MeasureTypes,
        PhoneTypes,
    ],
    resolvers: merge(
        UserResolvers,
        PhoneTypeResolvers,
        ClientResolvers,
        MeasureResolvers,
        PhoneResolvers
    ),
    context: isAuthenticated,
    introspection: true,
    playground: true,
});

export default server;
