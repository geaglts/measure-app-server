import "core-js/stable";
import "regenerator-runtime/runtime";
import server from "./graphql/server";
import "./db";

server.listen({ port: process.env.PORT }).then(({ url }) => {
    console.log(`Server ready at ${url}`);
});
