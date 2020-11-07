export default `
    type Client {
        id: ID!
        name: String!
        user: User
        measures: [Measure]
        phones: [Phone]
    }

    input clientInput {
        name: String!
        user: ID!
        measures: measureInput!
        phone: phoneInput!
    }

    input clientUpdateInput {
        name: String!
    }

    type Clients {
        clients: [Client]
        loading: Boolean!
        message: String
    }

    extend type Query {
        getClients(userId: ID!): Clients!
    }

    extend type Mutation {
        addClient(input: clientInput!): Status!
        removeClient(clientId: ID!): Status!
        updateClient(clientId: ID!, newData: clientUpdateInput!): Status!
    }
`;
