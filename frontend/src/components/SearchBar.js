import React from 'react';
import { Form, Row, Col, InputGroup, Button } from 'react-bootstrap';

const SearchBar = ({ 
  searchTerm, setSearchTerm, 
  category, setCategory, 
  downloadedFilter, setDownloadedFilter 
}) => {
  const handleReset = () => {
    setSearchTerm('');
    setCategory('');
    setDownloadedFilter(null);
  };

  return (
    <Form className="mb-4 px-2">
      <Row className="gy-2 align-items-end">
        <Col md={4}>
          <Form.Label>🔍 Search</Form.Label>
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>

        <Col md={3}>
          <Form.Label>📂 Category</Form.Label>
          <Form.Control
            type="text"
            placeholder="Filter by category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </Col>

        <Col md={3}>
          <Form.Label>⬇️ Download Status</Form.Label>
          <Form.Select
            value={downloadedFilter === null ? '' : downloadedFilter.toString()}
            onChange={(e) =>
              setDownloadedFilter(e.target.value === '' ? null : e.target.value === 'true')
            }
          >
            <option value="">All Items</option>
            <option value="true">Downloaded</option>
            <option value="false">Not Downloaded</option>
          </Form.Select>
        </Col>

        <Col md={2}>
          <Button variant="outline-secondary" onClick={handleReset} className="w-100">
            Reset
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default SearchBar;
