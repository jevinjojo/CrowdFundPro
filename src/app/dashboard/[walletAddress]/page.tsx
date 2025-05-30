'use client';
import { client } from "@/app/client"
import CampaignCard from "@/app/components/CampaignCard";
import { CROWDFUNDING_FACTORY } from "@/app/constants/contracts"
import { useSetIsWalletModalOpen } from "@thirdweb-dev/react";
import { useState, useEffect } from "react";
import { getContract } from "thirdweb"
import { sepolia } from "thirdweb/chains"
import { deployPublishedContract } from "thirdweb/deploys";
import { useActiveAccount, useReadContract } from "thirdweb/react";

export default function DashboardPage() { 
  const account = useActiveAccount();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const contract = getContract({
    client: client, 
    chain: sepolia, 
    address: CROWDFUNDING_FACTORY, 
  }); 

  const { data, isLoading, refetch} = useReadContract({
    contract,
    method:
      "function getUserCampaigns(address _user) view returns ((address campaignAddress, address owner, string name, uint256 creationTime)[])",
    params: [account?.address as string],
  });

  useEffect(() => {
    // Set loaded state after initial load
    if (!isLoading) {
      setIsLoaded(true);
    }
  }, [isLoading]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Dashboard Header */}
      <div className="mb-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Your Dashboard</h1>
            <p className="text-gray-600">Manage your crowdfunding campaigns</p>
          </div>
          <div className="relative group">
            {/* Button glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-200 group-hover:duration-200"></div>
            
            <button
              className="relative px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2 border border-indigo-700"
              onClick={() => setIsModalOpen(true)}
            >
              <span className="absolute inset-0 overflow-hidden rounded-lg">
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-0 bg-gradient-to-r from-[rgba(255,255,255,0.2)] to-[rgba(255,255,255,0)] transition-transform duration-700 ease-in-out"></span>
              </span>
              <span className="relative flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Create Campaign
              </span>
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Total Campaigns</h3>
              <div className="p-2 bg-indigo-100 rounded-lg">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-800">{data?.length || 0}</p>
            <p className="text-sm text-gray-500 mt-1">Active campaigns</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Wallet</h3>
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-800 truncate max-w-[250px]">{account?.address ? `${account.address.substring(0, 6)}...${account.address.substring(account.address.length - 4)}` : 'Not connected'}</p>
            <p className="text-sm text-gray-500 mt-1">Connected wallet</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Network</h3>
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-800">Sepolia</p>
            <p className="text-sm text-gray-500 mt-1">Ethereum testnet</p>
          </div>
        </div>
      </div>

      {/* Campaigns Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">My Campaigns</h2>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : isLoaded && (!data || data.length === 0) ? (
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-10 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
            </svg>
            <h3 className="text-xl font-medium text-gray-700 mb-2">No Campaigns Found</h3>
            <p className="text-gray-500 mb-6">You havent created any campaigns yet. Start your first one now!</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-200"
            >
              Create Your First Campaign
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.map((campaign, index) => (
              <CampaignCard 
                key={index} 
                campaignAddress={campaign.campaignAddress}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Campaign Modal */}
      {isModalOpen && (
        <CreateCampaignModal
          setIsModalOpen={setIsModalOpen}
          refetch={refetch}
        />
      )}
    </div>
  )
}

type CreateCampaignModalProps = {
  setIsModalOpen: (value: boolean) => void; 
  refetch: () => void
};


const CreateCampaignModal = ({ setIsModalOpen, refetch} : CreateCampaignModalProps) => {
  const account = useActiveAccount();
  const [isDeployingContract, setIsDeployingContract] = useState<boolean>(false);
  const [campaignName, setCampaignName] = useState<string>("");
  const [campaignDescription, setCampaignDescription] = useState<string>("");
  const [campaignGoal, setCampaignGoal] = useState<number>(1);
  const [campaignDeadline, setCampaignDeadline] = useState<number>(7);
  const [formErrors, setFormErrors] = useState({
    name: false,
    description: false
  });

  const validateForm = () => {
    const errors = {
      name: campaignName.trim() === "",
      description: campaignDescription.trim() === ""
    };
    
    setFormErrors(errors);
    return !Object.values(errors).some(error => error);
  };

  const handleDeployContract = async () => {
    if (!validateForm()) return;
    
    setIsDeployingContract(true);

    try { 
      const contractAddress = await deployPublishedContract({
        client: client, 
        chain: sepolia, 
        account: account!, 
        contractId: "Crowdfunding", 
        contractParams: {
          name: campaignName,
          description: campaignDescription,
          goal: campaignGoal,
          _durationInDays: campaignDeadline,
        }, 
        publisher: "0x818E9F62846fCC335a4090BAB9458748f34d5F28", 
        version: "1.0.6", 
      });
      
      // Success notification
      alert("Campaign Created Successfully!");
      refetch();

    } catch (error) { 
      console.error("Error creating campaign:", error);
      alert("Failed to create campaign. Please try again.");
    } finally {
      setIsDeployingContract(false);
      setIsModalOpen(false);
    }
  };

  const handleCampaignGoal = (value: number) => {
    if(value < 1) {
      setCampaignGoal(1);
    } else {
      setCampaignGoal(value);
    }
  };
  
  const handleCampaignLength = (value: number) => {
    if(value < 1){
      setCampaignDeadline(1);
    } else {
      setCampaignDeadline(value);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center backdrop-blur-sm z-50">
      <div className="w-full max-w-xl bg-white p-8 rounded-xl shadow-2xl relative overflow-hidden">
        {/* Decorative header */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-indigo-600 to-purple-600"></div>
        
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800">Create a Campaign</h3>

          <button 
            className="text-gray-500 hover:text-gray-700 transition-colors"
            onClick={() => setIsModalOpen(false)}
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <div className="flex flex-col gap-4"> 
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Campaign Name</label>
            <input 
              type="text"
              value={campaignName} 
              onChange={(e) => setCampaignName(e.target.value)}
              placeholder="Enter a catchy name for your campaign"
              className={`px-4 py-3 bg-gray-50 border ${formErrors.name ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
            />
            {formErrors.name && <p className="text-red-500 text-xs mt-1">Campaign name is required</p>}
          </div>
          
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Campaign Description</label>
            <textarea
              value={campaignDescription} 
              onChange={(e) => setCampaignDescription(e.target.value)}
              placeholder="Describe your campaign and what you're raising funds for"
              rows={4}
              className={`px-4 py-3 bg-gray-50 border ${formErrors.description ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none`}
            ></textarea>
            {formErrors.description && <p className="text-red-500 text-xs mt-1">Campaign description is required</p>}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Funding Goal (ETH)</label>
              <div className="relative">
                <input 
                  type="number"
                  value={campaignGoal}
                  onChange={(e) => handleCampaignGoal(parseInt(e.target.value))}
                  min="1"
                  className="pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <span className="text-gray-500">Ξ</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Minimum amount needed for your campaign</p>
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Campaign Duration (Days)</label>
              <div className="relative">
                <input 
                  type="number"
                  value={campaignDeadline}
                  onChange={(e) => handleCampaignLength(parseInt(e.target.value))}
                  min="1"
                  max="365"
                  className="pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">How long your campaign will accept funds</p>
            </div>
          </div>
          
          <button
            className={`mt-6 px-6 py-3 rounded-lg text-white font-medium flex items-center justify-center gap-2 ${isDeployingContract ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transform hover:-translate-y-0.5 transition-all duration-200'}`}
            onClick={handleDeployContract}
            disabled={isDeployingContract}
          >
            {isDeployingContract ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Campaign...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Launch Campaign
              </>
            )}
          </button>
          
          <p className="text-xs text-gray-500 text-center mt-4">
            Your campaign will be deployed on the Sepolia testnet and visible to all users.
          </p>
        </div>
      </div>
    </div>
  );
};