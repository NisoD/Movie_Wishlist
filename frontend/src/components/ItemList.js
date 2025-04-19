import React from 'react';
import { ListGroup, Button, Badge, Spinner } from 'react-bootstrap';

const ItemList = ({ items, loading, deleteItem, toggleDownloaded }) => {
  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
      </div>
    );
  }

  if (!items.length) {
    return <p className="text-center text-muted fs-5 mt-4">🎯 No items in your wishlist. Add some!</p>;
  }

  return (
    <ListGroup className="rounded-3 shadow-sm">
      {items.map(item => (
        <ListGroup.Item
          key={item.id}
          className="d-flex justify-content-between align-items-start flex-wrap"
        >
          <div className="me-auto">
            <div className="fw-bold mb-1">
              {item.name}
              {item.category && <Badge bg="secondary" className="ms-2">{item.category}</Badge>}
              <Badge
                bg={item.downloaded ? "success" : "warning"}
                className="ms-2"
              >
                {item.downloaded ? "Downloaded" : "Not Downloaded"}
              </Badge>
            </div>
            {item.description && <div className="mb-1">{item.description}</div>}
            {item.url && (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-decoration-none small"
              >
                🔗 Visit Link
              </a>
            )}
          </div>

          <div className="mt-2 mt-md-0 d-flex flex-column gap-2 align-items-end">
            <Button
              variant={item.downloaded ? "outline-warning" : "outline-success"}
              size="sm"
              onClick={() => toggleDownloaded(item)}
            >
              {item.downloaded ? "Mark Not Downloaded" : "Mark Downloaded"}
            </Button>
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => deleteItem(item.id)}
            >
              Delete
            </Button>
          </div>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default ItemList;
