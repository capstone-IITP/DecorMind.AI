"use client";

import { useUser } from "@clerk/nextjs";
import React, { useState } from "react";
import EmptyState from "../_components/EmptyState";

export default function Listing() {
  const { user } = useUser();
  const [userRoomList, setUserRoomList] = useState([]);

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-center items-center mb-8">
          <h2 className="text-5xl font-bold bg-gradient-to-r from-slate-800 via-cyan-400 to-green-400 text-transparent bg-clip-text">
            Hello, {user?.fullName?.toUpperCase()}
          </h2>
        </div>

        {userRoomList.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Listing Content will go here */}
          </div>
        )}
      </div>
    </div>
  );
}