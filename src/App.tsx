import React, { useState, useEffect } from 'react';
import { Registration, AppView } from './types';
import { RegistrationForm } from './components/RegistrationForm';
import { TicketView } from './components/TicketView';
import { AdminDashboard } from './components/AdminDashboard';
import { motion, AnimatePresence } from 'motion/react';
import { initAuth } from './lib/firebase';
import { appendRegistrationToSheet } from './lib/sheetsService';

export default function App() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [currentView, setCurrentView] = useState<AppView>('form');
  const [activeTicket, setActiveTicket] = useState<Registration | null>(null);
  const [googleUser, setGoogleUser] = useState<any>(null);
  const [googleToken, setGoogleToken] = useState<string | null>(null);

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

    // Initialize Auth listener
    const unsubscribe = initAuth(
      (user, token) => {
        setGoogleUser(user);
        setGoogleToken(token);
      },
      () => {
        setGoogleUser(null);
        setGoogleToken(null);
      }
    );
    return () => unsubscribe();
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

  // Scroll to the top of the page automatically on view change
  useEffect(() => {
    try {
      window.scrollTo(0, 0);
    } catch (e) {
      console.error('Error scrolling to top', e);
    }
  }, [currentView]);

  // Process user registration submission
  const handleRegisterSubmit = async (data: { fullName: string; phone: string }) => {
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
      syncedToSheets: false,
    };

    // Save and display the ticket INSTANTLY (Optimistic UI)
    const updatedRegs = [newReg, ...registrations];
    handleSetRegistrations(updatedRegs);
    setActiveTicket(newReg);
    setCurrentView('ticket');

    // Perform direct sync with Google Apps Script Web App in the background (Non-blocking)
    appendRegistrationToSheet(newReg)
      .then((success) => {
        if (success) {
          setRegistrations(prevRegs => {
            const updated = prevRegs.map(r => r.id === uniqueId ? { ...r, syncedToSheets: true } : r);
            try {
              localStorage.setItem('mano_maraton_registrations', JSON.stringify(updated));
            } catch (e) {
              console.error('Error writing background sync to localStorage', e);
            }
            return updated;
          });
          console.log('Real-time sync to Google Apps Script succeeded in the background!');
        }
      })
      .catch((e) => {
        console.error('Background Google Apps Script sync failed, marked as unsynced.', e);
      });
  };

  return (
    <div className="relative min-h-screen bg-brand-yellow text-slate-900 flex flex-col justify-center items-center selection:bg-brand-pink selection:text-white selection:font-bold overflow-x-hidden">
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
                onExit={() => setCurrentView('exit')}
              />
            </motion.div>
          )}

          {currentView === 'exit' && (
            <motion.div
              key="exit"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              className="w-full"
            >
              <div className="bg-brand-blue border-3 border-white/20 rounded-[32px] p-8 shadow-2xl text-white text-center relative flex flex-col items-center">
                {/* Embedded brand visual */}
                <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-lg border-3 border-brand-pink mb-5 p-1">
                  <img
                    src="https://res.cloudinary.com/dbc6tihw1/image/upload/v1772143448/images_mk1pkl.jpg"
                    alt="Camas Florida"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                
                <h3 className="text-2xl font-black uppercase tracking-tight font-display text-brand-yellow mb-2">
                  ¡Gracias por Participar!
                </h3>
                <p className="text-xs text-slate-300 font-bold uppercase tracking-wider mb-6">
                  Tu registro ha sido guardado exitosamente
                </p>

                <p className="text-sm font-medium leading-relaxed max-w-xs text-gray-200 mb-8">
                  Te esperamos en la competencia para ganar una espectacular <span className="text-brand-pink font-bold">Cama Florida</span>. ¡Mucha suerte!
                </p>

                <div className="flex flex-col gap-3 w-full">
                  <button
                    onClick={() => {
                      setCurrentView('form');
                      setActiveTicket(null);
                    }}
                    className="w-full cursor-pointer bg-brand-yellow text-brand-blue hover:bg-yellow-400 font-black text-xs uppercase tracking-wider rounded-2xl py-3.5 shadow-md hover:shadow-yellow-400/10 transition-all select-none border-2 border-brand-blue"
                  >
                    Registrar Nuevo Participante
                  </button>
                  
                  <button
                    onClick={() => {
                      try {
                        window.location.href = "https://www.google.com";
                      } catch (e) {
                        console.error(e);
                      }
                    }}
                    className="w-full cursor-pointer bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider rounded-2xl py-3 transition-all select-none"
                  >
                    Salir de la Aplicación
                  </button>
                </div>
              </div>
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
                googleUser={googleUser}
                googleToken={googleToken}
                onSetGoogleAuth={(user, token) => {
                  setGoogleUser(user);
                  setGoogleToken(token);
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

