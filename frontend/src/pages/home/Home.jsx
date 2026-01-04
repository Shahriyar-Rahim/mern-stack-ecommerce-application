import React from 'react'
import Banner from './Banner'
import Categorise from './Categorise'
import Trends from './Trends'
import TrendingProducts from './TrendingProducts'
import DealsSection from './DealsSection'
import Features from './Features'
import Blog from '../blog/Blog'

const Home = () => {
  return (
    <>
      <Banner />
      <Categorise />
      <Trends />
      <TrendingProducts />
      <DealsSection />
      <Features />
      <Blog />
    </>
  )
}

export default Home