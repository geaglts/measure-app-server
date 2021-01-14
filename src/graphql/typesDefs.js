import { gql } from "apollo-server";

export default gql`
    scalar JSON

    type Client {
        id: ID!
        name: String!
        user: User
        mainPhone: Phone
        measures: [Measure]
        phones: [Phone]
    }

    type Measure {
        id: ID!
        height: Int!
        waist: Int!
        creadoEl: String!
    }

    type Phone {
        id: ID!
        phone: String!
        isMain: Boolean!
        phoneType: PhoneType
    }

    type PhoneType {
        id: ID!
        type: String!
    }

    type User {
        id: ID!
        userName: String!
        clients: [Client]
    }

    input clientInput {
        name: String!
        measures: measureInput
        phone: phoneInput
    }

    input clientUpdateInput {
        clientId: ID!
        name: String!
    }

    input measureInput {
        height: Int!
        waist: Int!
    }

    input updateMeasureInput {
        measureId: ID!
        clientId: ID!
        measures: measureInput!
    }

    input phoneInput {
        phone: String!
        phoneType: ID!
        client: ID
    }

    input userInput {
        userName: String!
        password: String!
    }

    type Query {
        getClients: [Client]

        getPhoneTypes: [PhoneType]

        me: User
    }

    type Mutation {
        addClient(input: clientInput!): Client
        dropClient(clientId: ID!): JSON
        updateClient(input: clientUpdateInput!): Client

        addMeasure(clientId: ID!, measures: measureInput!): JSON
        updateMeasure(measureData: updateMeasureInput!): JSON
        dropMeasure(measureId: ID!, clientId: ID!): JSON

        addPhone(phoneData: phoneInput!): Phone
        updatePhone(phoneData: phoneInput!, phoneId: ID!): JSON
        dropPhone(phoneId: ID!, clientId: ID!): JSON

        addPhoneType(type: String!): PhoneType

        login(userName: String!, password: String!): JSON
        register(input: userInput!): JSON
    }
`;
