import React, { useState, useEffect } from 'react';
import { Registration, AppView } from './types';
import { RegistrationForm } from './components/RegistrationForm';
import { TicketView } from './components/TicketView';
import { AdminDashboard } from './components/AdminDashboard';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [currentView, setCurrentView] = useState<AppView>('form');
  const [activeTicket, setActiveTicket] = useState<Registration | null>(null);

  // Load registrations from localStorage on component mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('mano_maraton_registrations');
      if (stored) {
        setRegistrations(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Error reading localStorage data', e);
    }
  }, []);

  // Update registrations and save to localStorage
  const handleSetRegistrations = (newRegs: Registration[]) => {
    setRegistrations(newRegs);
    try {
      localStorage.setItem('mano_maraton_registrations', JSON.stringify(newRegs));
    } catch (e) {
      console.error('Error writing to localStorage', e);
    }
  };

  // Process user registration submission
  const handleRegisterSubmit = (data: { fullName: string; phone: string }) => {
    // Generate unique participant code e.g., MM-3850
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const uniqueId = `MM-${randomCode}`;
    const nextTicketNumber = registrations.length + 1;

    const newReg: Registration = {
      id: uniqueId,
      fullName: data.fullName,
      phone: data.phone,
      createdAt: new Date().toISOString(),
      ticketNumber: nextTicketNumber,
      checkedIn: false, // Default pending presencial checkin
    };

    const updatedRegs = [newReg, ...registrations];
    handleSetRegistrations(updatedRegs);
    setActiveTicket(newReg);
    setCurrentView('ticket');
  };

  return (
    <div className="relative min-h-screen bg-brand-yellow text-slate-900 flex flex-col justify-center items-center selection:bg-brand-pink selection:text-white selection:font-bold overflow-hidden">
      {/* High-fidelity replica of the flyer yellow/teal background */}
      {/* Lower Teal Section with skewed cut */}
      <div 
        className="absolute inset-x-0 bottom-0 top-[35%] bg-brand-teal pointer-events-none transition-all duration-300"
        style={{ clipPath: 'polygon(0 18%, 100% 0, 100% 100%, 0 100%)' }}
      />
      <div className="absolute inset-x-0 bottom-0 h-[45%] bg-brand-teal pointer-events-none" />

      {/* Scattered festive geometric triangles replicating the flyer */}
      <div className="absolute top-[18%] left-[7%] w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[18px] border-b-brand-pink transform rotate-[35deg] opacity-80 pointer-events-none" />
      <div className="absolute top-[10%] right-[8%] w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-b-[24px] border-b-white transform rotate-[-15deg] opacity-70 pointer-events-none" />
      <div className="absolute top-[38%] right-[5%] w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[18px] border-b-brand-pink transform rotate-[110deg] opacity-85 pointer-events-none" />
      <div className="absolute bottom-[35%] left-[5%] w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[20px] border-b-white transform rotate-[-45deg] opacity-80 pointer-events-none" />
      <div className="absolute bottom-[20%] right-[6%] w-0 h-0 border-l-[11px] border-l-transparent border-r-[11px] border-r-transparent border-b-[18px] border-b-brand-pink transform rotate-[75deg] opacity-90 pointer-events-none" />
      <div className="absolute bottom-[8%] left-[10%] w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-b-[26px] border-b-brand-yellow transform rotate-[15deg] opacity-90 pointer-events-none" />

      {/* Dynamic Content Frame with transitions - Centered */}
      <main className="w-full max-w-md mx-auto flex items-center justify-center p-3 select-none relative z-10">
        <AnimatePresence mode="wait">
          {currentView === 'form' && (
            <motion.div
              key="form"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              className="w-full"
            >
              <RegistrationForm
                onSubmit={handleRegisterSubmit}
                onNavigateToAdmin={() => setCurrentView('admin')}
              />
            </motion.div>
          )}

          {currentView === 'ticket' && activeTicket && (
            <motion.div
              key="ticket"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              className="w-full font-sans"
            >
              <TicketView
                registration={activeTicket}
                onBack={() => {
                  setCurrentView('form');
                  setActiveTicket(null);
                }}
              />
            </motion.div>
          )}

          {currentView === 'admin' && (
            <motion.div
              key="admin"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              className="w-full font-sans"
            >
              <AdminDashboard
                registrations={registrations}
                onBack={() => setCurrentView('form')}
                onSetRegistrations={handleSetRegistrations}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

