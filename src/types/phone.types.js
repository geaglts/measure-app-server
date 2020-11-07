export default `
    type Phone {
        id: ID!
        phone: String!
        isMain: Boolean!
        phoneType: PhoneType
    }

    input phoneInput {
        phone: String!
        phoneType: ID!
        client: ID
    }

    type Phones {
        phones: [Phone]
        loading: Boolean!
    }

    type MainPhone {
        phone: Phone
        loading: Boolean!
    }

    extend type Query {
        getPhones(clientId: ID!): Phones!
        getMainPhone(clientId: ID!): MainPhone!
    }

    extend type Mutation {
        addPhone(phoneData: phoneInput!): Status!
        eliminarTelefono(telefonoId: ID!, clienteId: ID!): Status!
        actualizarTelefono(datos: phoneInput!, telefonoId: ID!): Status!
    }
`;
