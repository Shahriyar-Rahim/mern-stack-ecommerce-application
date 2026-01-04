import React, { useState } from "react";
import ProductsCards from "./ProductsCards";
import { useFetchAllProductsQuery } from "../../redux/features/products/productsApi";
import ShopFiltering from "./ShopFiltering";
import Loading from "../../components/Loading";
import { motion, AnimatePresence } from "framer-motion";

const filters = {
  categories: ["all", "accessories", "dress", "jewellery", "cosmetics"],
  colors: ["all", "black", "red", "green", "blue", "silver", "beige", "gold"],
  priceRanges: [
    { label: "Under $50", min: 0, max: 50 },
    { label: "$50 - $100", min: 50, max: 100 },
    { label: "$100 - $200", min: 100, max: 200 },
    { label: "$200 and above", min: 200, max: Infinity },
  ],
};

const ShopPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false); // Mobile state
  const [filterState, setFilterState] = useState({
    category: "all",
    color: "all",
    priceRange: "",
  });

  const { category, color, priceRange } = filterState;
  const [minPrice, maxPrice] = priceRange.split("-").map(Number);
  const [productsPerPage] = useState(9);

  const { data: productsData = {}, isLoading } = useFetchAllProductsQuery({
    category: category !== "all" ? category : "",
    color: color !== "all" ? color : "",
    minPrice: isNaN(minPrice) ? "" : minPrice,
    maxPrice: isNaN(maxPrice) ? "" : maxPrice,
    page: currentPage,
    limit: productsPerPage,
  });

  if (isLoading) return <Loading />;

  const { products = [], totalPages, totalProducts } = productsData?.data || {};

  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) setCurrentPage(pageNumber);
  };

  const clearFilters = () => {
    setFilterState({ category: "all", color: "all", priceRange: "" });
  };

  // Logic for display stats
  const startProduct = products.length > 0 ? (currentPage - 1) * productsPerPage + 1 : 0;
  const endProduct = startProduct + products.length - 1;

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="section__container rounded bg-primary-light">
        <h2 className="section__header">Shop Page</h2>
        <p className="section__subheader">Discover the hottest picks: Elevate Your Style.</p>
      </section>

      <section className="section__container">
        {/* Mobile Filter Header */}
        <div className="flex md:hidden items-center justify-between mb-4">
            <button 
                onClick={() => setIsFilterOpen(true)}
                className="bg-white px-4 py-2 rounded-lg border flex items-center gap-2 font-medium shadow-sm"
            >
                <i className="ri-filter-3-line"></i> Filters
            </button>
            <span className="text-sm text-gray-500">Showing {startProduct}-{endProduct} of {totalProducts} Products</span>
        </div>

        <div className="flex flex-col md:flex-row md:gap-12 gap-8">
          
          {/* LEFT SIDE: Filters */}
          <div className="md:w-1/4">
            {/* Desktop View: Always Visible */}
            <div className="hidden md:block sticky top-20">
               <ShopFiltering
                  filters={filters}
                  filterState={filterState}
                  setFilterState={setFilterState}
                  clearFilters={clearFilters}
                />
            </div>

            {/* Mobile View: Slide-in Drawer */}
            <AnimatePresence>
              {isFilterOpen && (
                <>
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsFilterOpen(false)}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-2000 md:hidden"
                  />
                  <motion.div 
                    initial={{ x: "-100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "-100%" }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="fixed left-0 top-0 h-full w-[280px] bg-white z-2001 p-5 shadow-xl md:hidden overflow-y-auto"
                  >
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-xl">Filters</h3>
                        <button onClick={() => setIsFilterOpen(false)} className="text-2xl">&times;</button>
                    </div>
                    <ShopFiltering
                      filters={filters}
                      filterState={filterState}
                      setFilterState={setFilterState}
                      clearFilters={clearFilters}
                    />
                    <button 
                        onClick={() => setIsFilterOpen(false)}
                        className="w-full mt-6 bg-primary text-white py-3 rounded-lg font-bold"
                    >
                        Apply Filters
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* RIGHT SIDE: Products Grid */}
          <div className="md:w-3/4">
            <h3 className="hidden md:block font-medium text-xl mb-4">
              Showing {startProduct} to {endProduct} of {totalProducts} results
            </h3>
            
            <ProductsCards products={products} />

            {/* Pagination remains the same, just wrapped for neatness */}
            {products.length > 0 && (
              <div className="flex mt-8 justify-center items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50 hover:bg-primary hover:text-white transition-colors"
                >
                  Prev
                </button>
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handlePageChange(index + 1)}
                    className={`size-10 rounded-md font-medium transition-all ${
                      currentPage === index + 1 ? "bg-primary text-white shadow-md" : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50 hover:bg-primary hover:text-white transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ShopPage;