import React from 'react';
import { MorningGreeting } from '../components/dashboard/MorningGreeting';
import { PriorityQueue } from '../components/dashboard/PriorityQueue';

export const MyDay: React.FC = () => {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-white tracking-tight">My Day</h1>
        <p className="text-gray-400 mt-2">Plan and focus on your priority tasks for today.</p>
      </header>
      
      <MorningGreeting />
      <PriorityQueue />
    </div>
  );
};
