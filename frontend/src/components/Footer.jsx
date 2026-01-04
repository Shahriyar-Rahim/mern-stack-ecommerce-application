import React from "react";
import instagram1 from "../assets/instagram-1.jpg";
import instagram2 from "../assets/instagram-2.jpg";
import instagram3 from "../assets/instagram-3.jpg";
import instagram4 from "../assets/instagram-4.jpg";
import instagram5 from "../assets/instagram-5.jpg";
import instagram6 from "../assets/instagram-6.jpg";
import { Link } from "react-router";

const Footer = () => {
  return (
    <>
      {/* <!-- footer section --> */}
      <footer className="section__container footer__container">
        <div className="footer__col">
          <h4>CONTACT INFO</h4>
          <p>
            <span>
              <i className="ri-map-pin-2-fill"></i>
            </span>
            123, London Bridge Street, London
          </p>
          <p>
            <span>
              <i className="ri-mail-fill"></i>
            </span>
            support@Lebaba.com
          </p>
          <p>
            <span>
              <i className="ri-phone-fill"></i>
            </span>
            (+012) 3456 789
          </p>
        </div>
        <div className="footer__col">
          <h4>COMPANY</h4>
          <Link to="#">Home</Link>
          <Link to="#">About Us</Link>
          <Link to="#">Work With Us</Link>
          <Link to="#">Our Blog</Link>
          <Link to="#">Terms &amp; Conditions</Link>
        </div>
        <div className="footer__col">
          <h4>USEFUL LINK</h4>
          <Link to="#">Help</Link>
          <Link to="#">Track My Order</Link>
          <Link to="#">Men</Link>
          <Link to="#">Women</Link>
          <Link to="#">Dresses</Link>
        </div>
        <div className="footer__col">
          <h4>INSTAGRAM</h4>
          <div className="instagram__grid">
            <img src={instagram1} alt="instagram" />
            <img src={instagram5} alt="instagram" />
            <img src={instagram2} alt="instagram" />
            <img src={instagram3} alt="instagram" />
            <img src={instagram4} alt="instagram" />
            <img src={instagram6} alt="instagram" />
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
