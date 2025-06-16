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
      <div className="w-full mx-auto px-4 lg:px-36">
        {/* Header */}
        <h2 className="text-4xl md:text-5xl font-extrabold mb-5 text-center">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-red-600 ">
            About the SolarX Startup Challenge
          </span>
        </h2>
        <div className="w-28 h-1.5 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full mb-6"></div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Side - Content */}
          <div className="space-y-8 col-span-1">
            {/* Description */}
            <div className="space-y-6">
              <p className="text-gray-900 text-lg leading-relaxed">
                The SolarX Startup Challenge is an initiative by the
                International Solar Alliance (ISA) to foster entrepreneurship
                and develop scalable solar solutions across ISA member
                countries.
              </p>

              <p className="text-gray-900 text-lg leading-relaxed">
                It aims to bridge the gap between solar potential and deployment
                by empowering local innovators and advancing clean energy
                transitions. The challenge involves crowdsourcing cost-effective
                solutions, accelerating the shift to renewable energy, and
                building capacity across the solar value chain.
              </p>
              <p className="text-gray-900 text-lg leading-relaxed">
                The challenge has expanded from an Africa-focused edition in
                2023 to include Asia-Pacific (including India) and Latin America
                and the Caribbean (LAC) regions. Each edition focuses on a
                specific region, seeking innovative and scalable solutions to
                address local challenges within the solar energy sector.
              </p>
            </div>
          </div>
          {/* Left Side */}

          {/* Right Side */}
          <div className="flex space-y-4 flex-col w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 col-span-1">
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
            <button className="bg-orange-600 text-white font-semibold rounded-xl px-6 py-3 shadow-md hover:bg-orange-500 hover:-translate-y-0.5 transition-all duration-50 mt-6">
              <a href="https://solarx.isa.int/registration_lac">
                Apply for SolarX Startup Challenge - Latin America and the
                Caribbean
              </a>
            </button>
          </div>
          {/* Right Side */}
        </div>
      </div>
    </section>
  );
};

export default AboutSolarXChallenge;
