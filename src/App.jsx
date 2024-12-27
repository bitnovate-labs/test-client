import { useState } from "react";
import "./App.css";

import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  useMutation,
  useQuery,
  gql,
} from "@apollo/client";

const client = new ApolloClient({
  uri: "https://13.250.60.69:8080/graphql",
  cache: new InMemoryCache(),
});

// const endpoint = "http://localhost:80/graphql";
// const endpoint = "http://13.250.60.69:80/graphql";

const GET_ITEMS = gql`
  query {
    items {
      item_id
      name
      description
      price
      quantity
      created_at
    }
  }
`;

const ADD_ITEM = gql`
  mutation addItem(
    $name: String!
    $description: String
    $price: Float!
    $quantity: Int!
  ) {
    addItem(
      name: $name
      description: $description
      price: $price
      quantity: $quantity
    ) {
      item_id
      name
      description
      price
      quantity
      created_at
    }
  }
`;

function App() {
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
  });

  const { loading, error, data } = useQuery(GET_ITEMS);
  const [addItem] = useMutation(ADD_ITEM);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error! {error.message}</p>;

  const handleAddItem = () => {
    const { name, description, price, quantity } = newItem;
    addItem({
      variables: {
        name,
        description: description || null,
        price: parseFloat(price),
        quantity: parseInt(quantity, 10),
      },
    })
      .then(() =>
        setNewItem({ name: "", description: "", price: "", quantity: "" })
      )
      .catch((err) => console.error(err));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <h1>Items</h1>
      <ul>
        {data.items.map((item) => (
          <li key={item.id}>
            <strong>{item.name}</strong> - {item.description} - ${item.price} -{" "}
            {item.quantity} in stock
            <br />
            <small>
              Added on: {new Date(item.created_at).toLocaleString()}
            </small>
          </li>
        ))}
      </ul>
      <h2>Add New Item</h2>
      <div>
        <input
          type="text"
          name="name"
          value={newItem.name}
          onChange={handleInputChange}
          placeholder="Name"
        />
        <input
          type="text"
          name="description"
          value={newItem.description}
          onChange={handleInputChange}
          placeholder="Description"
        />
        <input
          type="number"
          name="price"
          value={newItem.price}
          onChange={handleInputChange}
          placeholder="Price"
        />
        <input
          type="number"
          name="quantity"
          value={newItem.quantity}
          onChange={handleInputChange}
          placeholder="Quantity"
        />
        <button onClick={handleAddItem}>Add Item</button>
      </div>
    </div>
  );
}

// AppWrapper with ApolloProvider
export default function AppWrapper() {
  return (
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  );
}
