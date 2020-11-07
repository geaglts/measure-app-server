import "core-js/stable";
import "regenerator-runtime/runtime";
import app from "./server";
import "./db";

app.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
    console.log(`Server ready at ${url}`);
});
