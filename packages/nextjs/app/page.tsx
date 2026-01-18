"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import type { NextPage } from "next";
import { VoteCard } from "~~/components/VoteCard";
// ✅ YOUR PATH: Using the location you specified for the API service
import { Vote, fetchVotes } from "~~/utils/scaffold-eth/snapshot";

// ✅ YOUR PATH (Fixed for SSR):
// We use your import source "@scaffold-ui/components", but we load it dynamically
// to stop the "localStorage is not a function" error.
const AddressInput = dynamic(() => import("@scaffold-ui/components").then(mod => mod.AddressInput), { ssr: false });

const Home: NextPage = () => {
  const [searchInput, setSearchInput] = useState("");

  const [votes, setVotes] = useState<Vote[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchInput) {
      console.warn("Input is empty");
      return;
    }

    setIsLoading(true);
    console.log("Searching for:", searchInput);

    // Uses the function from your updated utils path
    const data = await fetchVotes(searchInput);

    console.log("RAW API RESPONSE:", data);
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
        <div className="flex flex-col items-center mt-12 w-max max-w-lg gap-4 p-4 px-5 bg-gray-600 rounded-md">
          <div className="w-full px-6">
            <label className="label">
              <span className="label-text text-base font-semibold">Enter Wallet Address</span>
            </label>

            <AddressInput value={searchInput} placeholder="0x... or vitalik.eth" onChange={setSearchInput} />
          </div>

          <button
            className="btn btn-primary btn-lg w-48 mt-4 shadow-xl shadow-blue-500/20"
            onClick={handleSearch}
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
