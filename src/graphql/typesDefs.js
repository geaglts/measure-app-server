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
        email: String!
        clients: [Client]
    }

    input clientInput {
        name: String!
        measures: measureInput
        phone: phoneInput
    }

    # input clientUpdateInput {
    #     name: String!
    # }

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
        email: String!
        password: String!
    }

    type Query {
        getClients: [Client]

        getPhoneTypes: [PhoneType]

        me: User
    }

    type Mutation {
        addClient(input: clientInput!): JSON
        dropClient(clientId: ID!): JSON
        #     updateClient(clientId: ID!, newData: clientUpdateInput!): Status!

        addMeasure(clientId: ID!, measures: measureInput!): JSON
        updateMeasure(measureData: updateMeasureInput!): JSON
        dropMeasure(measureId: ID!, clientId: ID!): JSON

        addPhone(phoneData: phoneInput!): Phone
        updatePhone(phoneData: phoneInput!, phoneId: ID!): JSON
        dropPhone(phoneId: ID!, clientId: ID!): JSON

        addPhoneType(type: String!): PhoneType

        login(email: String!, password: String!): JSON
        register(input: userInput!): JSON
    }
`;
