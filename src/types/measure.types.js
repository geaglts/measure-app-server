export default `
    type Measure {
        id: ID!
        height: Int!
        waist: Int!
    }

    input measureInput {
        height: Int
        waist: Int
    }

    extend type Mutation {
        addMeasure(clientId: ID!, measures: measureInput!): Status!
        deleteMeasure(medidasId: ID!, clienteId: ID!): Status!
        updateMeasure(medidasId: ID!, clienteId: ID!, medidas: measureInput!): Status!
    }
`;
