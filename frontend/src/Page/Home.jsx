import React from 'react'
import Banner from '../components/Layout/Banner'
import CollectionSection from '@/components/Products/CollectionSection'
import NewArrival from '@/components/Products/NewArrival'
import BestSeller from '@/components/Products/BestSeller'

const Home = () => {
  return (
    <div className='pt-24 -mt-1'>
      <Banner/>
      <CollectionSection/>
      <NewArrival/>
      <BestSeller/>
    </div>
  )
}

export default Home