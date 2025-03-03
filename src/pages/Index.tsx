
import React from 'react';
import Layout from '@/components/Layout';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import HowItWorks from '@/components/home/HowItWorks';
import Testimonials from '@/components/home/Testimonials';
import CTASection from '@/components/home/CTASection';
import SearchForm from '@/components/search/SearchForm';

const Index = () => {
  return (
    <Layout>
      <Hero />
      
      <div className="container px-4 mx-auto -mt-8">
        <SearchForm />
      </div>
      
      <Features />
      <HowItWorks />
      <Testimonials />
      <CTASection />
    </Layout>
  );
};

export default Index;
