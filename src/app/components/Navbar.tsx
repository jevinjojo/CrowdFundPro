'use client';
import { client } from "@/app/client";
import Link from "next/link";
import { ConnectButton, lightTheme, useActiveAccount } from "thirdweb/react";
import Image from 'next/image';
import crowdfundLogo from "@public/crowdfund-logo.svg";

const Navbar = () => {
    const account = useActiveAccount();

    return (
        <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="relative flex h-20 items-center justify-between">
                    <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                        <div className="flex flex-shrink-0 items-center">
                            <div className="flex items-center gap-2">
                                <Image 
                                    src={crowdfundLogo} 
                                    alt="CrowdFund Pro" 
                                    width={40} 
                                    height={40} 
                                    className="rounded-full p-0.5"
                                    style={{
                                        filter: "drop-shadow(0px 0px 8px rgba(255, 255, 255, 0.6))",
                                    }}
                                />
                                <span className="text-xl font-bold text-white tracking-tight">CrowdFund<span className="text-yellow-300">Pro</span></span>
                            </div>
                        </div>
                        <div className="hidden sm:ml-8 sm:block">
                            <div className="flex space-x-6">
                                <Link href={'/'}>
                                    <p className="rounded-md px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 hover:bg-opacity-50 transition-colors duration-200 ease-in-out">
                                        Campaigns
                                    </p>
                                </Link>
                                {account && (
                                    <Link href={`/dashboard/${account?.address}`}>
                                        <p className="rounded-md px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 hover:bg-opacity-50 transition-colors duration-200 ease-in-out">
                                            Dashboard
                                        </p>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                        <ConnectButton 
                            client={client}
                            theme={{
                                ...lightTheme(),
                                colors: {
                                    ...lightTheme().colors,
                                    accentText: "#4F46E5",
                                    accentButtonBg: "#4F46E5",
                                    modalBg: "#FFFFFF"
                                },   
                            }}
                            detailsButton={{
                                style: {
                                    maxHeight: "50px",
                                    borderRadius: "8px",
                                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                                    fontWeight: "600"
                                }
                            }}
                        />
                    </div>
                </div>
            </div>
        </nav>
    )
};

export default Navbar;