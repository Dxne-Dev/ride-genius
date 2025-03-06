
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import HowItWorks from '@/components/home/HowItWorks';
import Testimonials from '@/components/home/Testimonials';
import CTASection from '@/components/home/CTASection';
import SearchForm, { SearchData } from '@/components/search/SearchForm';

const Index = () => {
  const navigate = useNavigate();
  
  const handleSearch = (searchData: SearchData) => {
    // Navigate to search page with search data
    navigate('/search', { state: { searchData } });
  };
  
  return (
    <Layout>
      <Hero />
      
      <div className="container px-4 mx-auto -mt-8">
        <SearchForm onSearch={handleSearch} />
      </div>
      
      <Features />
      <HowItWorks />
      <Testimonials />
      <CTASection />
    </Layout>
  );
};

export default Index;
