import React from 'react'
import Banner from '../components/Layout/Hero'
import CollectionSection from '@/components/Products/CollectionSection'
import NewArrival from '@/components/Products/NewArrival'
import ProductsDetail from '@/Page/products/ProductsDetail'

const Home = () => {
  return (
    <div className='pt-24 -mt-1'>
      <Banner/>
      <CollectionSection/>
      <NewArrival/>
    </div>
  )
}

export default Home