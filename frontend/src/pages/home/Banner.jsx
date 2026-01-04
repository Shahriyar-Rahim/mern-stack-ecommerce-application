import React from 'react'
import bannerImg from "../../assets/header.png";

const Banner = () => {
  return (
    <section className="section__container header__container">
        <div className="header__content z-30">
          <h4>UP TO 20% DISCOUNT ON</h4>
          <h1>Girl's Fashion</h1>
          <p>
            Discover the latest trends and express your unique style with our
            Women's Fashion website. Explore a curated collection of clothing,
            accessories, and footwear that caters to every taste and occasion.
          </p>
          <button className="btn"><a href="/shop">EXPLORE NOW</a></button>
        </div>
        <div className="header__image">
          <img src={bannerImg} alt="Banner" />
        </div>
      </section>

  )
}

export default Banner