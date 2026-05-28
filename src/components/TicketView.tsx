import React from 'react';
import { Registration } from '../types';
import { DynamicQRCode, LaCasitaLogo, BedIcon } from './SponsorLogos';
import { Calendar, Clock, MapPin, Share2, CheckCircle2, ArrowLeft, Printer, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';

interface TicketViewProps {
  registration: Registration;
  onBack: () => void;
}

export const TicketView: React.FC<TicketViewProps> = ({ registration, onBack }) => {
  const shareMessage = encodeURIComponent(
    `¡Ya me registré para ganar una Cama Florida en la Gran Mano Maratón de Almacenes La Casita! Es el 28 de Junio a las 8:00 AM. Mi código de participante es ${registration.id}. ¡Regístrate tú también!`
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8 flex flex-col gap-6">
      {/* Back button */}
      <div>
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition-all cursor-pointer bg-white/5 px-4 py-2.5 rounded-xl border border-white/5 hover:border-white/10"
          id="btn-ticket-back"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Registro</span>
        </button>
      </div>

      {/* Floating Sparkle Animation banner */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-green-500/10 border border-green-500/20 rounded-3xl p-4 flex items-center gap-4 text-left"
      >
        <div className="p-3 bg-green-500/20 rounded-2xl text-green-400">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-white">¡Registro Completado con Éxito!</h4>
          <p className="text-xs text-gray-400">Tu boleto digital ha sido generado. Guarda una captura o imprímelo.</p>
        </div>
      </motion.div>

      {/* TICKET CONTAINER (The Ticket has left/right notch cuts styled with CSS) */}
      <div className="relative bg-gradient-to-b from-brand-blue to-[#00142D] rounded-[32px] p-1 border border-white/15 overflow-hidden shadow-2xl">
        
        {/* Inside white panel ticket representation */}
        <div className="bg-white text-gray-900 rounded-[28px] p-6 relative flex flex-col overflow-hidden">
          
          {/* Header branding */}
          <div className="flex justify-between items-start gap-4">
            <div className="text-left">
              <span className="text-[10px] bg-brand-red/10 text-brand-red font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                Boleto Oficial de Participación
              </span>
              <h2 className="text-2xl font-black text-brand-blue tracking-tight uppercase leading-none mt-2 font-display">
                Mano Maratón
              </h2>
              <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mt-1">
                Almacenes La Casita
              </p>
            </div>
            <LaCasitaLogo className="w-14 h-14" />
          </div>

          <div className="border-t border-dashed border-gray-300 my-4" />

          {/* Ticket Details Grid */}
          <div className="grid grid-cols-2 gap-4 text-left mb-4">
            <div>
              <p className="text-[9px] text-gray-400 font-black uppercase tracking-wider">Participante</p>
              <p className="text-sm font-extrabold text-brand-blue truncate uppercase mt-0.5">{registration.fullName}</p>
            </div>
            <div>
              <p className="text-[9px] text-gray-400 font-black uppercase tracking-wider">No. Teléfono</p>
              <p className="text-sm font-bold text-slate-800 font-mono mt-0.5">{registration.phone}</p>
            </div>
            <div>
              <p className="text-[9px] text-gray-400 font-black uppercase tracking-wider">Código ID Único</p>
              <p className="text-sm font-extrabold text-brand-red font-mono tracking-tight mt-0.5">{registration.id}</p>
            </div>
            <div>
              <p className="text-[9px] text-gray-400 font-black uppercase tracking-wider">Número de Registro</p>
              <p className="text-sm font-extrabold text-slate-800 font-mono mt-0.5">#{registration.ticketNumber}</p>
            </div>
          </div>

          {/* SPECIFICATIONS LIST (Compact) */}
          <div className="bg-[#FAF8F5] border border-gray-100 rounded-2xl p-3.5 space-y-2.5 text-left mb-6">
            <div className="flex items-center gap-2.5 text-xs text-gray-700">
              <MapPin className="w-4 h-4 text-brand-red shrink-0" />
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
              <span className="text-[10px] font-bold text-gray-600">8:00 AM (Se solicita estar 30 min antes)</span>
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

          {/* Bottom segment: Large QR code */}
          <div className="flex flex-col items-center justify-center p-4 mt-2">
            <DynamicQRCode value={registration.id} className="w-36 h-36 border border-gray-100 p-2 bg-white rounded-xl shadow-sm" />
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-3">Escanear el día del evento</p>
          </div>

          {/* Important reminder warning */}
          <div className="bg-amber-50 rounded-2xl p-3 border border-amber-200/55 flex gap-2.5 items-start text-left mt-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-[10px] text-amber-800 leading-normal font-medium">
              <p className="font-bold uppercase tracking-wider">⚠️ REGLA CRÍTICA DE ASISTENCIA</p>
              Debes llegar antes de la hora indicada con este boleto digital. Si la competencia inicia, no se permitirán inscripciones tardías de último minuto.
            </div>
          </div>

        </div>
      </div>

      {/* Share / PDF Action tools */}
      <div className="flex flex-col sm:flex-row gap-3">
        <a
          href={`https://api.whatsapp.com/send?text=${shareMessage}`}
          target="_blank"
          referrerPolicy="no-referrer"
          rel="noopener noreferrer"
          className="flex-1 cursor-pointer bg-green-500 hover:bg-green-600 text-white font-bold text-sm rounded-2xl px-5 py-3.5 flex items-center justify-center gap-2 shadow-lg hover:shadow-green-500/10 transition-all"
        >
          <Share2 className="w-4 h-4" />
          <span>Compartir en WhatsApp</span>
        </a>

        <button
          onClick={handlePrint}
          className="flex-1 cursor-pointer bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold text-sm rounded-2xl px-5 py-3.5 flex items-center justify-center gap-2 transition-all"
        >
          <Printer className="w-4 h-4" />
          <span>Imprimir / PDF</span>
        </button>
      </div>

      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider text-center mt-2">
        La Casita Muebles - Organizando con transparencia el 5º Aniversario.
      </p>
    </div>
  );
};
