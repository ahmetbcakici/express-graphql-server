const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
} = require('graphql');

const axios = require('axios');

/* const customers = [
  {id: '1', name: 'John', email: 'john@gmail.com', age: 14},
  {id: '2', name: 'Doe', email: 'doe@ymail.com', age: 18},
  {id: '3', name: 'Sara', email: 'sara@gmail.com', age: 22},
];
 */
const CustomerType = new GraphQLObjectType({
  name: 'Customer',
  fields: {
    id: {type: GraphQLString},
    name: {type: GraphQLString},
    email: {type: GraphQLString},
    age: {type: GraphQLInt},
  },
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    customer: {
      type: CustomerType,
      args: {
        id: {type: GraphQLString},
      },
      resolve(parentValues, args) {
        return axios.get(`http://localhost:3000/customers/${args.id}`).then(res => res.data);
/*         const x = customers.filter((customer) => {
          console.log('object');
          if (customer.id == args.id) {
            console.log(customer);
            return customer;
          }
        });

        console.log(x);
        return x[0];

        console.log('----');

        for (let i = 0; i < customers.length; i++) {
          console.log('object');
          if (customers[i].id == args.id) {
            console.log(customers[i]);
            return customers[i];
          }
        } */
      },
    },
    customers: {
      type: new GraphQLList(CustomerType),
      resolve() {
        /* return customers; */
        return axios.get('http://localhost:3000/customers').then(res => res.data);
      },
    },
  },
});

const mutation = new GraphQLObjectType({
    name:'Mutation',
    fields:{
        addCustomer:{
            type:CustomerType,
            args:{
                name: {type: new GraphQLNonNull(GraphQLString)},
                email: {type: new GraphQLNonNull(GraphQLString)},
                age: {type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve(parentValue, args){
                return axios.post('http://localhost:3000/customers', {
                    name:args.name,
                    email: args.email,
                    age:args.age
                })
                .then(res => res.data);
            }
        },
        deleteCustomer:{
            type:CustomerType,
            args:{
                id:{type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parentValue, args){
                return axios.delete('http://localhost:3000/customers/'+args.id)
                .then(res => res.data);
            }
        },
        editCustomer:{
            type:CustomerType,
            args:{
                id:{type: new GraphQLNonNull(GraphQLString)},
                name: {type: GraphQLString},
                email: {type: GraphQLString},
                age: {type: GraphQLInt}
            },
            resolve(parentValue, args){
                return axios.patch('http://localhost:3000/customers/'+args.id, args)
                .then(res => res.data);
            }
        },
    }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation
});
