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

    # type AboutMe {
    #     userData: User
    #     loading: Boolean!
    # }

    # type LoginData {
    #     message: String
    #     user: User
    #     loading: Boolean!
    # }

    # type Clients {
    #     clients: [Client]eso
    #     loading: Boolean!
    #     message: String
    # }

    # type Phones {
    #     phones: [Phone]
    #     loading: Boolean!
    # }

    # type MainPhone {
    #     phone: Phone
    #     loading: Boolean!
    # }

    # type StatusTypes {
    #     types: [PhoneType]
    #     loading: Boolean!
    # }

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
        #     removeClient(clientId: ID!): Status!
        #     updateClient(clientId: ID!, newData: clientUpdateInput!): Status!

        #     addMeasure(clientId: ID!, measures: measureInput!): Status!
        #     deleteMeasure(medidasId: ID!, clienteId: ID!): Status!
        #     updateMeasure(medidasId: ID!, clienteId: ID!, medidas: measureInput!): Status!

        addPhone(phoneData: phoneInput!): Phone
        updatePhone(phoneData: phoneInput!, phoneId: ID!): JSON
        dropPhone(phoneId: ID!, clientId: ID!): JSON

        addPhoneType(type: String!): PhoneType

        login(email: String!, password: String!): JSON
        register(input: userInput!): JSON
    }
`;
