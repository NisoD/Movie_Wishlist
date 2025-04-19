import React, { useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';

const AddItemForm = ({ addItem }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    url: '',
    category: '',
    downloaded: false
  });

  const handleChange = ({ target: { name, value, type, checked } }) => {
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addItem(formData);
    setFormData({
      name: '',
      description: '',
      url: '',
      category: '',
      downloaded: false
    });
  };

  return (
    <Card className="shadow-sm rounded-4 mb-4">
      <Card.Header className="bg-primary text-white fw-semibold">
        Add New Item
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit} className="px-1">
          {[
            ['Name', 'text', 'name', 'Item name'],
            ['Description', 'textarea', 'description', 'Item description'],
            ['URL', 'url', 'url', 'https://example.com'],
            ['Category', 'text', 'category', 'Category'],
          ].map(([label, type, name, placeholder], i) => (
            <Form.Group className="mb-3" key={i}>
              <Form.Label>{label}</Form.Label>
              <Form.Control
                as={type === 'textarea' ? 'textarea' : 'input'}
                type={type !== 'textarea' ? type : undefined}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                placeholder={placeholder}
                rows={type === 'textarea' ? 2 : undefined}
                required={name === 'name'}
              />
            </Form.Group>
          ))}

          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              name="downloaded"
              label="Already Downloaded"
              checked={formData.downloaded}
              onChange={handleChange}
            />
          </Form.Group>

          <Button type="submit" variant="success" className="w-100">
            Add to Wishlist
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default AddItemForm;
