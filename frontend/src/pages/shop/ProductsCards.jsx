import React from 'react'
import RatingStar from '../../components/RatingStar'
import { Link } from 'react-router'
import { useDispatch } from 'react-redux'
import { addToCart } from '../../redux/features/cart/cartSlice'

const ProductsCards = ({products}) => {
  const dispatch = useDispatch();
  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  }
    // console.log(products)
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8'>
        {
           products.length > 0 ? (products.map((product, index) => (
                <div key={index} className="product__card">
            <div className="relative">
              <Link to={`/shop/${product?._id}`}
                ><img
                  src={product?.image}
                  alt={product?.name}
                  className="max-h-96 md:h-64 w-full object-cover hover:scale-105 transition-all duration-300"
              /></Link>
              <div className="hover:block absolute top-3 right-3">
                <button
                className="hover:scale-105 transition-all duration-300"
                onClick={() => handleAddToCart(product)}
                
                >
                  <i
                    className="ri-shopping-cart-2-line bg-primary p-1.5 text-white hover:bg-primary-dark"
                  ></i>
                </button>
              </div>
            </div>
            <div className="product__card__content">
              <h4>{product?.name}</h4>
              <p>${product?.price} {product?.oldPrice ? <s>{product?.oldPrice}</s> : null }</p>
              <RatingStar rating={product?.rating}/>
            </div>
          </div>
            ))) : <h1 className='text-red-500'>No products found!!!</h1>
        }
    </div>
  )
}

export default ProductsCards