import React, { useState } from 'react';
import ProductsCards from '../shop/ProductsCards';
import { useFetchAllProductsQuery } from '../../redux/features/products/productsApi';
import Loading from '../../components/Loading';
import ErrorComponent from '../../components/ErrorComponent';

const TrendingProducts = () => {
    const [visibleProducts, setVisibleProducts] = useState(6);

    // Fetching data from the DB using your existing Redux API
    // We pass the limit to the query to fetch only what we need
    const { data: productsData, isLoading, error } = useFetchAllProductsQuery({
        limit: visibleProducts, // Dynamically fetch more when visibleProducts increases
    });

    const loadMoreProducts = () => {
        setVisibleProducts(prevCount => prevCount + 4);
    };

    if (isLoading && visibleProducts === 8) return <Loading />;
    if (error) return <ErrorComponent />;

    // Adjusting based on your API response structure (data.data.products)
    const products = productsData?.data?.products || [];
    const totalProducts = productsData?.data?.totalProducts || 0;

    return (
        <section className='section__container product__container'>
            <h2 className='section__header'>Trending Products</h2>
            <p className='section__subheader'>
                Discover our most popular picks: Elevate your style with the latest trends.
            </p>

            {/* Products Card */}
            <div className='mt-10'>
                <ProductsCards products={products} />
            </div>

            {/* Load More Button */}
            <div className='product__btn'>
                {
                    visibleProducts < totalProducts && (
                        <button 
                            onClick={loadMoreProducts}
                            className='btn'
                            disabled={isLoading} // Disable while fetching more
                        >
                            {isLoading ? <Loading /> : 'Load More'}
                        </button>
                    )
                }
            </div>
        </section>
    );
};

export default TrendingProducts;