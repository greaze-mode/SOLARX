import React from "react";
import {
  Lightbulb,
  DollarSign,
  Globe,
  TrendingUp,
  ChevronDown,
} from "lucide-react";

const AboutSolarXChallenge = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="w-full mx-auto px-36">
        {/* Header */}
        <h2 className="text-4xl md:text-5xl font-extrabold mb-5 text-center">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-red-600 ">
            About the SolarX Startup Challenge
          </span>
        </h2>
        <div className="w-28 h-1.5 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full mb-6"></div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Side - Images Grid */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              {/* Top Row */}
              <div className="bg-orange-100 rounded-2xl p-8 shadow-lg">
                <img
                  src="/api/placeholder/200/150"
                  alt="Solar Innovation"
                  className="w-full h-32 object-cover rounded-lg mb-4"
                />
                <p className="text-sm text-gray-600 font-medium text-center">
                  Solar Innovation
                </p>
              </div>

              <div className="bg-orange-100 rounded-2xl p-8 shadow-lg">
                <img
                  src="/api/placeholder/200/150"
                  alt="Solar Impact"
                  className="w-full h-32 object-cover rounded-lg mb-4"
                />
                <p className="text-sm text-gray-600 font-medium text-center">
                  Solar Impact
                </p>
              </div>

              {/* Bottom Row */}
              <div className="bg-orange-100 rounded-2xl p-8 shadow-lg">
                <img
                  src="/api/placeholder/200/150"
                  alt="Solar Technology"
                  className="w-full h-32 object-cover rounded-lg mb-4"
                />
                <p className="text-sm text-gray-600 font-medium text-center">
                  Solar Technology
                </p>
              </div>

              <div className="bg-orange-100 rounded-2xl p-8 shadow-lg">
                <img
                  src="/api/placeholder/200/150"
                  alt="Solar Implementation"
                  className="w-full h-32 object-cover rounded-lg mb-4"
                />
                <p className="text-sm text-gray-600 font-medium text-center">
                  Solar Implementation
                </p>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-orange-200 rounded-full opacity-30"></div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-orange-200 rounded-full opacity-30"></div>
          </div>

          {/* Right Side - Content */}
          <div className="space-y-8">
            {/* Description */}
            <div className="space-y-6">
              <p className="text-gray-700 text-lg leading-relaxed">
                The SolarX Startup Challenge is a flagship program by the
                International Solar Alliance (ISA) designed to identify,
                nurture, and accelerate solar startups across Africa,
                Asia-Pacific, Latin America & Caribbean, and the Middle East &
                North Africa.
              </p>

              <p className="text-gray-700 text-lg leading-relaxed">
                Our mission is to mobilize over USD 1 trillion in investments
                for solar projects by 2030 and enable energy access in
                underserved regions through innovative entrepreneurship.
              </p>
            </div>

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Innovation Card */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <Lightbulb className="w-6 h-6 text-orange-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  Innovation
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Supporting groundbreaking solar technologies that solve
                  real-world problems
                </p>
              </div>

              {/* Global Impact Card */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-orange-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  Global Impact
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Creating sustainable solutions for communities across four
                  major regions
                </p>
              </div>

              {/* Investment Card */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <DollarSign className="w-6 h-6 text-orange-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  Investment
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Connecting promising startups with funding opportunities and
                  resources
                </p>
              </div>

              {/* Sustainability Card */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-orange-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  Sustainability
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Promoting clean energy solutions aligned with UN Sustainable
                  Development Goals
                </p>
              </div>
            </div>
          </div>
        </div>

        
      </div>
    </section>
  );
};

export default AboutSolarXChallenge;
