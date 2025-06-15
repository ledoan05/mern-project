import React from 'react'
import Banner from '../components/Banner'
import CollectionSection from '../components/CollectionSection'
import NewArrival from '@/components/NewArrival'
import BestSeller from '@/components/BestSeller'

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