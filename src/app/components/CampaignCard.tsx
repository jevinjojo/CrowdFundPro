import { getContract } from "thirdweb";
import { client } from "../client";
import { sepolia } from "thirdweb/chains";
import { useReadContract } from "thirdweb/react";
import Link from "next/link";
import { useState, useEffect } from "react";

type CampaignCardProps = {
  campaignAddress: string, 
};

export default function CampaignCard({ campaignAddress } : CampaignCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    
    const contract = getContract({
      client: client, 
      chain: sepolia, 
      address: campaignAddress, 
    });

    const { data: campaignName } = useReadContract({
      contract,
      method: "function name() view returns (string)",
      params: [],
    });

    const { data: campaignDescription } = useReadContract({
      contract,
      method: "function description() view returns (string)",
      params: [],
    });

    const { data: goal, isPending: isLoadingGoal} = useReadContract({
      contract,
      method: "function goal() view returns (uint256)",
      params: [],
    });

    const { data: balance, isPending: isLoadingBalance } = useReadContract({
      contract,
      method: "function getContractBalance() view returns (uint256)",
      params: [],
    });

    const totalBalance = balance?.toString() || "0";
    const totalGoal = goal?.toString() || "1";
    let balancePercentage = (parseInt(totalBalance) / parseInt(totalGoal)) * 100;
    balancePercentage = isNaN(balancePercentage) ? 0 : balancePercentage;
    
    if(balancePercentage >= 100) {
      balancePercentage = 100;
    }
    
    // Format currency values
    const formatCurrency = (value: string) => {
      const num = parseInt(value);
      if (isNaN(num)) return "0";
      
      // Format with commas
      return new Intl.NumberFormat('en-US').format(num);
    };
    
    // Truncate description if too long
    const truncateDescription = (desc: string, maxLength = 100) => {
      if (!desc) return "";
      return desc.length > maxLength ? `${desc.substring(0, maxLength)}...` : desc;
    };
    
    return (
      <div 
        className={`flex flex-col justify-between h-full max-w-sm p-6 bg-white border-2 rounded-xl ${isHovered ? 'border-indigo-300 shadow-lg' : 'border-indigo-200 shadow'} transition-all duration-300 ease-in-out`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div>
          {!isLoadingBalance && !isLoadingGoal && (
            <div className="mb-6"> 
              <div className="flex justify-between mb-2">
                <span className="text-sm font-semibold text-gray-600">
                  {formatCurrency(totalBalance)} / {formatCurrency(totalGoal)}
                </span>
                <span className="text-sm font-bold text-indigo-600">
                  {balancePercentage.toFixed(1)}%
                </span>
              </div>
              <div className="relative w-full h-4 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                <div 
                  className={`h-4 rounded-full ${balancePercentage >= 100 ? 'bg-gradient-to-r from-green-400 to-green-600' : 'bg-gradient-to-r from-indigo-500 to-purple-600'} transition-all duration-500 ease-out`} 
                  style={{width: `${balancePercentage}%`}}
                >
                  {/* Subtle shine effect */}
                  <div className="absolute inset-0 bg-white opacity-20 h-1/2"></div>
                </div>
                {/* Progress markers */}
                <div className="absolute inset-0 flex justify-between px-2 pointer-events-none">
                  {[25, 50, 75].map(mark => (
                    <div key={mark} className="h-full w-px bg-gray-300 opacity-50"></div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          <h3 className="mb-3 text-xl font-bold tracking-tight text-gray-800">
            {campaignName || "Campaign"}
          </h3>
          
          <p className="mb-5 text-sm font-normal text-gray-600 leading-relaxed">
            {truncateDescription(campaignDescription as string)}
          </p>
        </div>
        
        <Link 
          href={`/campaign/${campaignAddress}`}
          passHref={true}
          className="w-full"
        >
          <div className="inline-flex items-center justify-center w-full px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg hover:from-indigo-600 hover:to-purple-700 focus:ring-2 focus:ring-indigo-300 transition-all duration-200 ease-in-out shadow-sm">
            View Campaign
            <svg className="w-4 h-4 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
            </svg>
          </div>
        </Link>
      </div>
    );
}