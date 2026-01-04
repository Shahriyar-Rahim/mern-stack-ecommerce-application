import React from "react";
import category1 from "../../assets/category-1.jpg";
import category2 from "../../assets/category-2.jpg";
import category3 from "../../assets/category-3.jpg";
import category4 from "../../assets/category-4.jpg";
import { Link } from "react-router";

const Categorise = () => {
  const categoris = [
    { id: 1, name: "Accessories", path: "accessories", image: category1 },
    { id: 2, name: "Dress Collection", path: "dress", image: category2 },
    { id: 3, name: "Jewellery", path: "jewellery", image: category3 },
    { id: 4, name: "Cosmetics", path: "cosmetics", image: category4 },
  ];
  return (
    <section className="product__grid">
      {categoris.map((category, index) => (
        <Link 
        key={index} 
        className="categories__card" to={`/categoris/${category.path}`}>
          <img src={category.image} alt="Accessories" />
          <h4>{category.name}</h4>
        </Link>
      ))}
    </section>
  );
};

export default Categorise;
