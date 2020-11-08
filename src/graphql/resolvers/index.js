import Query from "./Query";
import Mutation from "./Mutation";
import Parents from "./Parents";
const GraphQLJSON = require("graphql-type-json");

export default {
    JSON: GraphQLJSON,
    Query,
    Mutation,
    ...Parents,
};
