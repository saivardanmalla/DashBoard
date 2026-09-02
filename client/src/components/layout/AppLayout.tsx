import React from 'react';
import { Outlet } from 'react-router-dom';
import { AnimatedSidebar } from './AnimatedSidebar';
import { Header } from './Header';
import { CommandPalette } from '../command/CommandPalette';
import { AICopilotDrawer } from '../ai/AICopilotDrawer';
import { AICommandCenter } from '../ai/AICommandCenter';

export const AppLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-base text-gray-200 overflow-hidden relative">
      <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none mix-blend-overlay" />
      <AnimatedSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden z-10">
        <Header />
        <main className="flex-1 overflow-y-auto bg-base relative">
          <Outlet />
        </main>
      </div>
      <CommandPalette />
      <AICopilotDrawer />
      <AICommandCenter />
    </div>
  );
};


