'use client'
import { getContract } from "thirdweb";
import { client } from "./client";
import { sepolia } from "thirdweb/chains";
import { CROWDFUNDING_FACTORY } from "./constants/contracts";
import { useReadContract } from "thirdweb/react";
import CampaignCard from "./components/CampaignCard";
import { useState, useEffect } from "react";
import { useActiveAccount } from "thirdweb/react";
import Link from "next/link";

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const account = useActiveAccount();
  
  const contract = getContract({
    client: client, 
    chain: sepolia, 
    address: CROWDFUNDING_FACTORY,
  });
  
  const { data: campaigns, isPending } = useReadContract({
    contract,
    method:
      "function getAllCampaigns() view returns ((address campaignAddress, address owner, string name, uint256 creationTime)[])",
    params: [],
  });
  
  useEffect(() => {
    // Set loaded state after initial load
    if (!isPending) {
      setIsLoaded(true);
    }
  }, [isPending]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="mb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">CrowdFundPro</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Support innovative projects and ideas through blockchain-powered crowdfunding
        </p>
        <div className="inline-flex items-center justify-center p-1 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600">
          <div className="bg-white px-6 py-2 rounded-md">
            <p className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Powered by Ethereum on Sepolia Testnet
            </p>
          </div>
        </div>
      </div>

      {/* Campaigns Section */}
      <div className="mb-16">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Explore Campaigns</h2>
          {account ? (
            <Link href={`/dashboard/${account.address}`} className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-200 group-hover:duration-200"></div>
              <div className="relative px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2 border border-indigo-700">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Create Campaign
              </div>
            </Link>
          ) : (
            <div className="flex items-center gap-2 text-indigo-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span className="text-sm font-medium">Connect your wallet to create campaigns</span>
            </div>
          )}
        </div>

        {isPending ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : isLoaded && (!campaigns || campaigns.length === 0) ? (
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-10 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
            </svg>
            <h3 className="text-xl font-medium text-gray-700 mb-2">No Campaigns Found</h3>
            <p className="text-gray-500 mb-6">Be the first to create a campaign on our platform!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns?.map((campaign) => (
              <CampaignCard
                key={campaign.campaignAddress}
                campaignAddress={campaign.campaignAddress} 
              />
            ))}
          </div>
        )}
      </div>

      {/* Feature Section */}
      <div className="py-12 bg-gradient-to-b from-gray-50 to-white rounded-xl px-6 shadow-inner">
        <h2 className="text-2xl font-bold text-gray-800 mb-10 text-center">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Why Choose CrowdFundPro?</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Secure & Transparent Card */}
          <div className="group bg-white p-8 rounded-xl border-2 border-indigo-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all duration-300 relative overflow-hidden">
            {/* Decorative top border */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-indigo-600 transform origin-left transition-transform duration-300 group-hover:scale-x-100 scale-x-0"></div>
            
            <div className="p-4 bg-indigo-100 rounded-full w-fit mb-6 group-hover:bg-indigo-200 transition-colors duration-300">
              <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-indigo-700 transition-colors duration-300">Secure & Transparent</h3>
            <p className="text-gray-600 leading-relaxed">All transactions are secured by blockchain technology, ensuring complete transparency and trust for both creators and backers.</p>
          </div>
          
          {/* Multiple Tiers Card */}
          <div className="group bg-white p-8 rounded-xl border-2 border-purple-200 shadow-sm hover:shadow-md hover:border-purple-300 transition-all duration-300 relative overflow-hidden">
            {/* Decorative top border */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-purple-600 transform origin-left transition-transform duration-300 group-hover:scale-x-100 scale-x-0"></div>
            
            <div className="p-4 bg-purple-100 rounded-full w-fit mb-6 group-hover:bg-purple-200 transition-colors duration-300">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-purple-700 transition-colors duration-300">Multiple Tiers</h3>
            <p className="text-gray-600 leading-relaxed">Create campaigns with multiple funding tiers to offer different rewards to backers, maximizing your funding potential.</p>
          </div>
          
          {/* Easy to Use Card */}
          <div className="group bg-white p-8 rounded-xl border-2 border-green-200 shadow-sm hover:shadow-md hover:border-green-300 transition-all duration-300 relative overflow-hidden">
            {/* Decorative top border */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-green-600 transform origin-left transition-transform duration-300 group-hover:scale-x-100 scale-x-0"></div>
            
            <div className="p-4 bg-green-100 rounded-full w-fit mb-6 group-hover:bg-green-200 transition-colors duration-300">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-green-700 transition-colors duration-300">Easy to Use</h3>
            <p className="text-gray-600 leading-relaxed">Simple interface for both campaign creators and backers with no technical knowledge required. Launch your campaign in minutes.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
