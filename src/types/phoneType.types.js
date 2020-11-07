export default `
    type PhoneType {
        id: ID!
        type: String!
    }

    type StatusTypes {
        types: [PhoneType]
        loading: Boolean!
    }

    extend type Query {
        getPhoneTypes: StatusTypes
    }

    extend type Mutation {
        newPhoneType(type: String!): Status
        updatePhoneType(id: ID!, type: String!): Status
        deletePhoneType(id: ID!): Status
    }
`;
