require('dotenv')
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require("cors");

const graphqlSchema = require('./graphql/schema/index');
const graphqlresolver = require('./graphql/resolver/index');
const { ApolloServer } = require('apollo-server');
const { verify } = require('jsonwebtoken');

const app = express();

const server = new ApolloServer({
    typeDefs: graphqlSchema, resolvers: graphqlresolver,
    context: async ({ req }) => {
        try {
            const Token = req.headers.authorization.split(' ')[1];
            const userData = await verify(Token, "somesupersecretkey");
            return userData
        } catch (error) {
            return { message: error.message };
        }
    }
});

app.use(bodyParser.json());
app.use(cors());

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.5or1o.mongodb.net/graphql-testing?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection errror:'));
db.once('open', function () {
});


server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});