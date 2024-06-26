import { Headtags, FilterModal } from '../components';
import SIdeControls from '../components/SideControls';
import { IoGridOutline } from "react-icons/io5";
import { MdKeyboardArrowDown } from "react-icons/md";
import { CiBoxList } from "react-icons/ci";
import { IoFilter } from "react-icons/io5";
import { useState, useContext, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Card } from '../components';
import { ImSpinner2 } from "react-icons/im";
import ListView from '../components/ListView';
import { motion, AnimatePresence } from 'framer-motion';

const Shop = () => {
  const [amount, setAmount] = useState(16);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const { allProducts } = useContext(ShopContext); // handles all products fetching
  const [view, setView] = useState('grid');
  const [filters, setFilters] = useState({ selectedCategory: [], selectedColor: [], selectedSize: [], range: 0 });
  const [ isFilterOpen, setIsFilterOpen] = useState(false)
  const handleAmountChange = (event) => {
    setAmount(parseInt(event.target.value));
    setCurrentPage(1); // reset to the first page whenever amount changes
  };

  const handlePageChange = (pageNumber) => {
    window.scrollTo(0, 0);
    setLoading(true);
    setCurrentPage(pageNumber);
  };

  const handleFilterChange = (newFilter) => {
    setFilters(newFilter);
    setCurrentPage(1); // reset to the first page whenever a filter is applied
  }

  const filterProducts = () => {
    let filteredProducts = allProducts;

    if (filters.selectedCategory.length > 0) {
      const selectedCategoriesLowerCase = filters.selectedCategory.map(cat => cat.toLowerCase());
      filteredProducts = filteredProducts.filter(product =>
        product.category.some(cat => selectedCategoriesLowerCase.includes(cat.name.toLowerCase()))
      );
    }

    
    if (filters.selectedColor.length > 0) {
      filteredProducts = filteredProducts.filter(product =>
        product.colors && product.colors.some(col => filters.selectedColor.includes(col.name))
      );
    }

    if (filters.selectedSize.length > 0) {
      filteredProducts = filteredProducts.filter(product =>
        product.size && product.size.some(size => filters.selectedSize.includes(size.name))
      );
    }

    if (filters.range > 0) {
      filteredProducts = filteredProducts.filter(product => product.new_price <= filters.range);
    }

    return filteredProducts;
  };

  const filteredProducts = filterProducts()

  useEffect(() => {
    // Simulate fetching products
    const fetchProducts = () => {
      setLoading(true);
      // setProducts(allProducts);
      setTimeout(() => {
        setLoading(false);
      }, 1000); // Simulate a 1 second fetch time
    };

    fetchProducts();
  }, [currentPage, amount]);

  // Calculate the total number of pages
  const totalPages = Math.ceil(filteredProducts.length / amount);

  // Get current products
  const indexOfLastProduct = currentPage * amount;
  const indexOfFirstProduct = indexOfLastProduct - amount;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  return (
    <>
    <section className="py-10 px-3 w-full max-w-[1300px] mx-auto">
      <Headtags pageTitle="Shop" />
      <div className='flex items-start gap-14'>
        <div className='flex-1 lg:flex flex-col sticky top-2 w-full hidden'>
          <SIdeControls onFilterChange={handleFilterChange}/>
        </div>
        <div className='flex-[3] flex-col gap-6 w-full'>
          <div className='bg-shop h-[250px] md:h-[350px] w-full bg-center lg:bg-contain bg-no-repeat'>
            <div className='p-4 md:p-8 lg:p-16 w-full max-w-[500px]'>
              <h1 className='text-[2rem] md:text-[2.5rem] leading-[3rem]'>Plus-Size Style for Every Season</h1>
              <p className='text-gray-500 text-[0.9rem] mt-6'>Quis ipsum suspendisse ultrice grvida. Risus commodo viverra maecenas</p>
            </div>
          </div>
          <div className='w-full flex items-center justify-between my-2'>
            <div className='hidden lg:flex items-center gap-3 text-gray-600'>
              <IoGridOutline onClick={() => setView('grid')} className={`cursor-pointer ${view === 'grid'? 'text-black' : 'text-gray-500'}`} />
              <CiBoxList onClick={() => setView("list")} className={`cursor-pointer ${view === 'list'? 'text-black' : 'text-gray-500'}`} />
              <span className='ml-5 text-[0.85rem]'>showing {indexOfFirstProduct + 1} -- {Math.min(indexOfLastProduct, filteredProducts.length)} of {filteredProducts.length} results</span>
            </div>
            <button onClick={()=> setIsFilterOpen(true)} className='flex lg:hidden items-center gap-1 text-[0.9rem]'>
              <IoFilter className='text-[1.1rem]'/>
              <span>Filter</span>
            </button>
            <div>
              <div className='flex items-center'>
                <span className='text-gray-400 text-[0.85rem]'>Show:</span>
                <div className='relative'>
                  <select
                    className='outline-none appearance-none w-full py-2 pl-3 pr-10'
                    defaultValue={amount}
                    onChange={handleAmountChange}
                  >
                    <option className='flex items-end gap-1' value="16">16 items</option>
                    <option className='flex items-end gap-1' value="32">32 items</option>
                    <option className='flex items-end gap-1' value="48">48 items</option>
                    <option className='flex items-end gap-1' value="64">64 items</option>
                  </select>
                  <MdKeyboardArrowDown className='absolute top-1/2 right-2 transform -translate-y-1/2 pointer-events-none' />
                </div>
              </div>
            </div>
          </div>
          {loading ? (
            <div className='flex justify-center items-center h-64'>
              <ImSpinner2 className='animate-spin text-gray-500 text-4xl' />
            </div>
          ) : (
            <div>
              {view === 'grid' && (
                <div className='grid grid-cols-2 lg:grid-cols-4 gap-x-8'>
                  {currentProducts.map((product) => (
                    <Card shop key={product.id} props={product} />
                  ))}
                </div>
              )}
              {view === 'list' && (
                <div className='flex flex-col gap-6'>
                  {currentProducts.map((product) => (
                    <ListView shop key={product.id} props={product} />
                  ))}
                </div>
              )}
            </div>
          )}
          <div className='flex justify-center mt-6'>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                className={`px-3 py-1 text-[0.9rem] mx-1 ${index + 1 === currentPage ? 'bg-gray-800 text-white' : 'border border-black text-gray-800'}`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
    <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={{
              closed: { x: '-100%', opacity: 0, transition: { duration: 0.5, ease: 'easeInOut' } },
              open: { x: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeInOut' } }
            }}
            className='fixed top-0 left-0 w-full h-full z-50'
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} // Adjust opacity here
          >
            <FilterModal handleFilterChange={handleFilterChange} onClose={() => setIsFilterOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Shop;
