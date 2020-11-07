export default `
    type User {
        id: ID!
        email: String!
        password: String!
        clients: [Client]
        token: String
    }

    input userInput {
        email: String!
        password: String!
    }

    type AboutMe {
        userData: User
        loading: Boolean!
    }

    type LoginData {
        message: String
        user: User
        loading: Boolean!
    }

    extend type Query {
        getUser: AboutMe
    }

    extend type Mutation {
        login(input: userInput!): LoginData!
        register(input: userInput!): Status!
    }
`;
