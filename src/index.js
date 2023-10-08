import "core-js/stable";
import "regenerator-runtime/runtime";
import server from "./graphql/server";
import vars from "./configs/envVars";
import "./lib/db";

server.listen({ port: vars.app.port }).then(({ port }) => {
    console.log(`listening on port ${port}`);
});
