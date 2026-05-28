import React from 'react';
import { Registration } from '../types';
import { DynamicQRCode, LaCasitaLogo, BedIcon } from './SponsorLogos';
import { Calendar, Clock, MapPin, Share2, CheckCircle2, ArrowLeft, Printer, AlertTriangle, LogOut, UserPlus } from 'lucide-react';
import { motion } from 'motion/react';

interface TicketViewProps {
  registration: Registration;
  onBack: () => void;
  onExit: () => void;
}

export const TicketView: React.FC<TicketViewProps> = ({ registration, onBack, onExit }) => {
  const shareMessage = encodeURIComponent(
    `¡Regístrate tú también a la Gran Mano Maratón de Almacenes La Casita para tener la gran oportunidad de ganar una espectacular Cama Florida de 1 Pillow! El registro es totalmente gratis aquí: ${window.location.origin}`
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 flex flex-col gap-5">

      {/* Floating Sparkle Animation banner */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-green-500/10 border border-green-500/20 rounded-3xl p-4 flex items-center justify-center gap-2.5 text-center"
      >
        <CheckCircle2 className="w-5 h-5 text-green-400" />
        <h4 className="text-sm font-black uppercase tracking-wider text-white">¡REGISTRO EXITOSO!</h4>
      </motion.div>

      {/* TICKET CONTAINER (The Ticket has left/right notch cuts styled with CSS) */}
      <div className="relative bg-gradient-to-b from-brand-blue to-[#00142D] rounded-[32px] p-1 border border-white/15 overflow-hidden shadow-2xl">
        
        {/* Inside white panel ticket representation */}
        <div className="bg-white text-gray-900 rounded-[28px] p-6 relative flex flex-col overflow-hidden">
          
          {/* Header branding */}
          <div className="flex justify-between items-start gap-4">
            <div className="text-left">
              <h2 className="text-2xl font-black text-brand-blue tracking-tight uppercase leading-none mt-1 font-display">
                Mano Maratón
              </h2>
              <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mt-1">
                Almacenes La Casita
              </p>
            </div>
            <LaCasitaLogo className="w-14 h-14" />
          </div>

          <div className="border-t border-dashed border-gray-300 my-4" />

          {/* Ticket Details - Participant and Phone highlighted */}
          <div className="space-y-3.5 text-left mb-4">
            <div className="bg-[#FAF8F5] border-2 border-brand-blue/10 rounded-2xl p-4 shadow-sm">
              <p className="text-[10px] text-brand-pink font-black uppercase tracking-widest leading-none">PARTICIPANTE</p>
              <p className="text-xl font-black text-brand-blue mt-2 uppercase leading-tight">{registration.fullName}</p>
            </div>
            <div className="bg-[#FAF8F5] border-2 border-brand-blue/10 rounded-2xl p-4 shadow-sm">
              <p className="text-[10px] text-[#FF8A00] font-black uppercase tracking-widest leading-none">TELÉFONO DE CONTACTO</p>
              <p className="text-lg font-black text-slate-800 font-mono mt-2">{registration.phone}</p>
            </div>
          </div>

          {/* SPECIFICATIONS LIST (Compact) */}
          <div className="bg-[#FAF8F5] border border-gray-100 rounded-2xl p-3.5 space-y-2.5 text-left mb-6">
            <div className="flex items-center gap-2.5 text-xs text-gray-700">
              <MapPin className="w-4 h-4 text-[#EC008C] shrink-0" />
              <div className="leading-tight">
                <strong className="text-brand-blue font-bold text-[11px]">Sucursal Almacenes La Casita:</strong>
                <p className="text-[10px] text-gray-500 font-medium">Santa María de Jesús (A la par de Pollo Pinulito)</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 text-xs text-gray-700">
              <Calendar className="w-4 h-4 text-brand-blue shrink-0" />
              <span className="text-[10px] font-bold text-gray-600">Domingo, 28 de Junio 2026</span>
            </div>

            <div className="flex items-center gap-2.5 text-xs text-gray-700">
              <Clock className="w-4 h-4 text-yellow-600 shrink-0" />
              <span className="text-[10px] font-bold text-gray-600">8:00 AM (Se solicita estar 15 min antes)</span>
            </div>
          </div>

          {/* Dash line with ticket notch cuts in CSS */}
          <div className="relative py-2 my-2 flex items-center justify-between">
            {/* Left Notch */}
            <div className="absolute left-[-31px] w-6 h-6 rounded-full bg-brand-teal border-r border-white/20 z-10" />
            {/* Right Notch */}
            <div className="absolute right-[-31px] w-6 h-6 rounded-full bg-brand-teal border-l border-white/20 z-10" />
            
            <div className="w-full border-t border-2 border-dashed border-gray-300" />
          </div>

          {/* Bottom segment: Image of the Bed in place of QR Code */}
          <div className="flex flex-col items-center justify-center p-3 mt-2">
            <div className="w-56 h-36 flex items-center justify-center overflow-hidden rounded-2xl border border-gray-100 bg-white p-2 shadow-sm">
              <img
                src="https://res.cloudinary.com/dbc6tihw1/image/upload/v1772143415/1744572362Continental-STD-1-Pillow_ado4y9.png"
                alt="Cama Continental Plus"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />
            </div>
            <p className="text-[10px] text-[#EC008C] font-black uppercase tracking-widest mt-3">¡Cama Continental Plus de 1 Pillow!</p>
          </div>



        </div>
      </div>

      {/* Share Action tools */}
      <div className="flex flex-col gap-3.5">
        <a
          href={`https://api.whatsapp.com/send?text=${shareMessage}`}
          target="_blank"
          referrerPolicy="no-referrer"
          rel="noopener noreferrer"
          className="w-full cursor-pointer bg-[#25D366] hover:bg-[#20ba5a] text-white font-black text-sm uppercase tracking-wider rounded-2xl px-5 py-4 flex flex-col items-center justify-center text-center gap-1.5 shadow-lg shadow-green-500/10 transition-all select-none"
          id="btn-whatsapp-share"
        >
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 shrink-0" />
            <span>Compartir en WhatsApp</span>
          </div>
          <span className="text-[11px] font-bold text-white/90 normal-case tracking-normal leading-tight">
            ¡Comparte con tus conocidos para que se registren y ganen una Cama Florida!
          </span>
        </a>

        {/* Dynamic Navigation Actions: Register New & Exit */}
        <div className="grid grid-cols-2 gap-3 mt-0.5">
          <button
            onClick={onBack}
            className="w-full cursor-pointer bg-brand-yellow hover:bg-yellow-400 text-brand-blue font-black text-xs uppercase tracking-wider rounded-2xl py-3.5 px-3 flex items-center justify-center gap-1.5 shadow-md hover:shadow-yellow-400/10 transition-all select-none border-2 border-brand-blue"
            id="btn-ticket-register-another"
          >
            <UserPlus className="w-4 h-4 shrink-0" />
            <span>Registrar Nuevo</span>
          </button>

          <button
            onClick={onExit}
            className="w-full cursor-pointer bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider rounded-2xl py-3.5 px-3 flex items-center justify-center gap-1.5 shadow-md hover:shadow-red-600/10 transition-all select-none"
            id="btn-ticket-exit"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Salir</span>
          </button>
        </div>
      </div>

      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider text-center mt-2">
        La Casita Muebles - Organizando con transparencia el 5º Aniversario.
      </p>
    </div>
  );
};
