import React from "react";
// import HeroSection from "@/components/home/HeroSection";
import FeaturedServices from "@/components/home/FeaturedServices";
// import HowItWorks from "@/components/home/HowItWorks";
import PopularCategories from "@/components/home/PopularCategories";
// import WhyChooseUs from "@/components/home/WhyChooseUs";

function Homepage() {
    return (
        <div>
            Home page || ui  Complete FixMate
            <PopularCategories />
            <FeaturedServices />
            {/* <HeroSection />
            <HowItWorks />
            <WhyChooseUs /> */}
        </div>
    );
}

export default Homepage;
