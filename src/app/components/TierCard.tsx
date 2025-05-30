import { prepareContractCall, ThirdwebContract } from "thirdweb";
import { TransactionButton } from "thirdweb/react";
import { useState } from "react";

type Tier = { 
  name: string; 
  amount: bigint;
  backers: bigint;
};

type TierCardProps = {
  tier: Tier;
  index: number;
  contract: ThirdwebContract;
  isEditing: boolean;
};

export default function TierCard({ tier, index, contract, isEditing} : TierCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Format the amount with commas
  const formatAmount = (amount: bigint) => {
    return new Intl.NumberFormat('en-US').format(Number(amount));
  };
  
  // Get tier badge color based on tier index
  const getTierBadgeColor = (index: number) => {
    const colors = [
      'bg-purple-100 text-purple-800', // First tier (premium)
      'bg-blue-100 text-blue-800',     // Second tier
      'bg-green-100 text-green-800',   // Third tier
      'bg-amber-100 text-amber-800',   // Fourth tier
      'bg-gray-100 text-gray-800',     // Default for any additional tiers
    ];
    
    return index < colors.length ? colors[index] : colors[colors.length - 1];
  };
  
  return (
    <div 
      className={`max-w-sm flex flex-col justify-between p-6 bg-white border ${isHovered ? 'border-indigo-300 shadow-lg' : 'border-slate-100 shadow'} rounded-xl transition-all duration-300 ease-in-out`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="mb-6">
        <div className="flex flex-row justify-between items-start mb-4">
          <div>
            <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getTierBadgeColor(index)} mb-2`}>
              Tier {index + 1}
            </span>
            <h3 className="text-xl font-bold text-gray-800">{tier.name}</h3>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-indigo-600">${formatAmount(tier.amount)}</p>
          </div>
        </div>
        
        <div className="flex items-center mb-2">
          <svg className="w-5 h-5 text-indigo-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
          </svg>
          <p className="text-sm font-medium text-gray-600">
            {tier.backers.toString()} {Number(tier.backers) === 1 ? 'Backer' : 'Backers'}
          </p>
        </div>
      </div>
      
      <div className="flex flex-col gap-3">
        <TransactionButton
          transaction={() => prepareContractCall({
            contract,
            method: "function fund(uint256 _tierIndex) payable",
            params: [BigInt(index)], 
            value: tier.amount,
          })}
          onTransactionConfirmed={async () => alert("Funded Successfully!")}
          onError={(error) => {
            console.error("Transaction failed:", error);
            alert("Transaction failed. Please try again.");
          }}
          style={{
            backgroundColor: "#4F46E5",
            backgroundImage: "linear-gradient(to right, #4F46E5, #7C3AED)",
            color: "white",
            padding: "0.75rem 1.5rem",
            borderRadius: "0.5rem",
            fontWeight: "600",
            cursor: "pointer",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            width: "100%",
            textAlign: "center",
            transition: "all 0.2s ease-in-out",
          }}
        >
          Select Tier
        </TransactionButton>
        
        {isEditing && (
          <TransactionButton
            transaction={() => prepareContractCall({
              contract,
              method: "function removeTier(uint256 _index)",
              params: [BigInt(index)],
            })}
            onTransactionConfirmed={async () => alert("Removed Successfully!")}
            onError={(error) => alert(`Error: ${error.message}`)}
            style={{
              backgroundColor: "#FEE2E2",
              color: "#B91C1C",
              padding: "0.5rem 1rem",
              borderRadius: "0.5rem",
              fontWeight: "600",
              cursor: "pointer",
              border: "1px solid #FCA5A5",
              width: "100%",
              textAlign: "center",
            }}
          >
            Remove Tier
          </TransactionButton>
        )}
      </div>
    </div>
  );
}