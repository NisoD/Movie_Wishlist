import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import ItemList from './components/ItemList';
import AddItemForm from './components/AddItemForm';
import SearchBar from './components/SearchBar';
import axios from 'axios';

const API_URL = '/api';

function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [downloadedFilter, setDownloadedFilter] = useState(null);

  const fetchItems = async () => {
    setLoading(true);
    try {
      let url = `${API_URL}/wishlist/`;
      if (searchTerm || category || downloadedFilter !== null) {
        url = `${API_URL}/wishlist/search/?`;
        if (searchTerm) url += `query=${searchTerm}&`;
        if (category) url += `category=${category}&`;
        if (downloadedFilter !== null) url += `downloaded=${downloadedFilter}`;
      }
      
      const response = await axios.get(url);
      setItems(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch wishlist items');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [searchTerm, category, downloadedFilter]);

  const addItem = async (item) => {
    setLoading(true);
    try {
      await axios.post(`${API_URL}/wishlist/`, item);
      fetchItems();
    } catch (err) {
      setError('Failed to add item');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`${API_URL}/wishlist/${id}`);
      fetchItems();
    } catch (err) {
      setError('Failed to delete item');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleDownloaded = async (item) => {
    setLoading(true);
    try {
      await axios.patch(`${API_URL}/wishlist/${item.id}`, {
        downloaded: !item.downloaded
      });
      fetchItems();
    } catch (err) {
      setError('Failed to update item');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4">
      <h1 className="text-center mb-4">My Wishlist</h1>
      
      <Row className="mb-4">
        <Col>
          <SearchBar 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            category={category}
            setCategory={setCategory}
            downloadedFilter={downloadedFilter}
            setDownloadedFilter={setDownloadedFilter}
          />
        </Col>
      </Row>
      
      <Row>
        <Col md={4}>
          <AddItemForm addItem={addItem} />
        </Col>
        <Col md={8}>
          {error && <div className="alert alert-danger">{error}</div>}
          <ItemList 
            items={items} 
            loading={loading} 
            deleteItem={deleteItem}
            toggleDownloaded={toggleDownloaded}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default App;
