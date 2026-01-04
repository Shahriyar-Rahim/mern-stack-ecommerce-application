import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import ProductsCards from '../shop/ProductsCards';
import products from '../../data/products.json';

const CategoryPage = () => {
    const {categoryName} = useParams();
    const [filteredProducts, setFilteredProducts] = useState([]);


    useEffect(() => {
        const filtered = products.filter((product) => product.category === categoryName.toLowerCase());
        setFilteredProducts(filtered);
    }, [])
  return (
    <>
        <section className='section__container bg-primary-light'>
            <h2 className='section__header capitalize'>{categoryName}</h2>
            <p className='section__subheader'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. In facilis nesciunt odio? Nobis, ducimus natus.</p>
        </section>

        {/* products card */}
        <div className='section__container'>
            <ProductsCards products={filteredProducts} />
        </div>
    </>
  )
}

export default CategoryPage