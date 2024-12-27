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
  uri: "http://13.250.60.69:80/graphql",
  cache: new InMemoryCache(),
});

// const endpoint = "http://localhost:80/graphql";
// const endpoint = "http://13.250.60.69:80/graphql";

const GET_ITEMS = gql`
  query {
    items {
      id
      name
    }
  }
`;

const ADD_ITEM = gql`
  mutation addItem($name: String!) {
    addItem(name: $name) {
      id
      name
    }
  }
`;

function App() {
  const [newItem, setNewItem] = useState("");
  const { loading, error, data } = useQuery(GET_ITEMS);
  const [addItem] = useMutation(ADD_ITEM);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error! {error.message}</p>;

  const handleAddItem = () => {
    addItem({ variables: { name: newItem } })
      .then(() => setNewItem(""))
      .catch((err) => console.error(err));
  };

  return (
    <div>
      <h1>Items</h1>
      <ul>
        {data.items.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
      <input
        type="text"
        value={newItem}
        onChange={(e) => setNewItem(e.target.value)}
        placeholder="Add new item"
      />
      <button onClick={handleAddItem}>Add Item</button>
    </div>
  );
}

export default function AppWrapper() {
  return (
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  );
}
