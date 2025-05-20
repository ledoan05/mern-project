import React from "react";
import { Link } from "react-router-dom";
import Button from "../Button/Button";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  const { id, name, price, image, description } = product;

  return (
    <div className="product-card">
      <Link to={`/product/${id}`} className="product-image">
        <img src={image} alt={name} />
      </Link>
      <div className="product-info">
        <h3 className="product-name">{name}</h3>
        <p className="product-description">{description}</p>
        <div className="product-price">${price}</div>
        <Button
          variant="primary"
          size="medium"
          fullWidth
          onClick={() => {
            /* Add to cart logic */
          }}
        >
          Add to Cart
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
