import { useEffect, useState } from "react";
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
  uri: import.meta.env.VITE_API_URL,
  cache: new InMemoryCache(),
});

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

  const { loading, error, data, refetch } = useQuery(GET_ITEMS, {
    // Automatically fetch items when the page loads
    notifyOnNetworkStatusChange: true,
  });

  const [addItem] = useMutation(ADD_ITEM);

  useEffect(() => {
    // Optionally, you can refetch data after adding a new item to keep the list updated
    if (data) {
      refetch();
    }
  }, [data, refetch]);

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
      .then(() => {
        // Reset input fields after successful addition
        setNewItem({ name: "", description: "", price: "", quantity: "" });
        // Optionally, refetch items to get the updated list
        refetch();
      })
      .catch((err) => console.error(err));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({ ...prev, [name]: value }));
  };

  console.log("Fetched data:", data);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Item Manager</h1>
      </header>

      <main>
        <section className="item-list">
          <h2>Items</h2>
          <ul>
            {data.items.map((item) => (
              <li key={item.item_id} className="item-card">
                <div className="item-info">
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <p>
                    <strong>Price:</strong> ${item.price}
                  </p>
                  <p>
                    <strong>Quantity:</strong> {item.quantity}
                  </p>
                  <small>
                    Added on: {new Date(item.created_at).toLocaleString()}
                  </small>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="add-item">
          <h2>Add New Item</h2>
          <div className="form-group">
            <input
              type="text"
              name="name"
              value={newItem.name}
              onChange={handleInputChange}
              placeholder="Name"
              className="form-input"
            />
            <input
              type="text"
              name="description"
              value={newItem.description}
              onChange={handleInputChange}
              placeholder="Description"
              className="form-input"
            />
            <input
              type="number"
              name="price"
              value={newItem.price}
              onChange={handleInputChange}
              placeholder="Price"
              className="form-input"
            />
            <input
              type="number"
              name="quantity"
              value={newItem.quantity}
              onChange={handleInputChange}
              placeholder="Quantity"
              className="form-input"
            />
            <button onClick={handleAddItem} className="btn-primary">
              Add Item
            </button>
          </div>
        </section>
      </main>

      <footer className="app-footer">
        <p>Item Manager App &copy; 2024</p>
      </footer>
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
