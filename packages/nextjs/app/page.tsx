"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { VoteCard } from "~~/components/VoteCard";
import { Vote, fetchVotes } from "~~/utils/scaffold-eth/snapshot";

const AddressInput = dynamic(() => import("@scaffold-ui/components").then(mod => mod.AddressInput), { ssr: false });

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const [searchInput, setSearchInput] = useState("");

  const [votes, setVotes] = useState<Vote[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (forcedAddress?: string) => {
    const targetAddress = typeof forcedAddress === "string" ? forcedAddress : searchInput;

    if (!targetAddress) {
      console.warn("Input is empty");
      return;
    }

    if (forcedAddress && typeof forcedAddress === "string") {
      setSearchInput(forcedAddress);
    }

    setIsLoading(true);

    const data = await fetchVotes(targetAddress);

    setVotes(data);
    setIsLoading(false);
  };

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-20">
        {/* HERO SECTION */}
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
              DAO Voter
            </span>
          </h1>
          <p className="text-center font-bold text-lg mt-4 max-w-md mx-auto text-gray-400">
            Track your governance history. See every vote, every DAO, all in one clean dashboard.
          </p>
        </div>

        {/* SEARCH BOX SECTION */}
        <div className="flex flex-col items-center mt-12 w-full max-w-lg gap-4 p-6 bg-base-200 rounded-xl shadow-lg">
          <div className="w-full">
            <div className="flex justify-between items-end mb-2">
              <label className="label p-0">
                <span className="label-text text-base font-semibold">Enter Wallet Address</span>
              </label>

              {connectedAddress && (
                <button
                  className="btn btn-xs btn-ghost text-primary no-underline hover:bg-transparent hover:text-primary-focus bg-orange-400"
                  onClick={() => handleSearch(connectedAddress)}
                >
                  Use my wallet
                </button>
              )}
            </div>

            <AddressInput value={searchInput} placeholder="0x... or vitalik.eth" onChange={setSearchInput} />
          </div>

          <button
            className="btn btn-primary btn-lg w-full mt-2 shadow-xl shadow-blue-500/20"
            onClick={() => handleSearch()}
            disabled={isLoading}
          >
            {isLoading ? <span className="loading loading-spinner"></span> : "Search History"}
          </button>
        </div>

        {/* RESULTS GRID */}
        {votes.length > 0 && (
          <div className="mt-10 w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-5 pb-20">
            {votes.map(vote => (
              <VoteCard key={vote.id} vote={vote} />
            ))}
          </div>
        )}

        {/* EMPTY STATE */}
        {votes.length === 0 && !isLoading && searchInput && (
          <div className="mt-10 text-center text-gray-500">
            <p>No votes found for this address.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
