import React from "react";

const Blog = () => {
  return (
    <section className="section__container blog__container">
      <h2 className="section__header">Latest From Blog</h2>
      <p className="section__subheader">
        Elevate your wardrobe with our freshest style tips, trends, and
        inspiration on our blog.
      </p>
      <div className="md:p-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        <div className="blog__card cursor-pointer hover:scale-105 transition-all duration-200">
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&amp;w=2070&amp;auto=format&amp;fit=crop&amp;ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Mastering the Art of Capsule Wardrobes"
          />
          <div className="blog__card__content">
            <h6>Timeless Elegance</h6>
            <h4>Mastering the Art of Capsule Wardrobes</h4>
            <p>12th August 2022</p>
          </div>
        </div>
        <div className="blog__card cursor-pointer hover:scale-105 transition-all duration-200">
          <img
            src="https://images.unsplash.com/photo-1700159017572-de76bb0c5719?q=80&amp;w=2072&amp;auto=format&amp;fit=crop&amp;ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Unveiling the Hottest Beachwear Trends"
          />
          <div className="blog__card__content">
            <h6>Summer Breeze</h6>
            <h4>Unveiling the Hottest Beachwear Trends</h4>
            <p>18th January 2023</p>
          </div>
        </div>
        <div className="blog__card cursor-pointer hover:scale-105 transition-all duration-200">
          <img
            src="https://plus.unsplash.com/premium_photo-1682142715511-27bfbfdc044f?q=80&amp;w=2069&amp;auto=format&amp;fit=crop&amp;ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Navigating the World of Women's Tailoring"
          />
          <div className="blog__card__content">
            <h6>Power Dressing</h6>
            <h4>Navigating the World of Women's Tailoring</h4>
            <p>5th January 2025</p>
          </div>
        </div>
        <div className="blog__card cursor-pointer hover:scale-105 transition-all duration-200">
          <img
            src="https://plus.unsplash.com/premium_photo-1713720663924-4e3fe8f20f79?q=80&amp;w=1948&amp;auto=format&amp;fit=crop&amp;ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="The World's Best Fashion Fair 2025"
          />
          <div className="blog__card__content">
            <h6>New York Times</h6>
            <h4>The World's Best Fashion Fair 2025</h4>
            <p>25th May 2025</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Blog;
