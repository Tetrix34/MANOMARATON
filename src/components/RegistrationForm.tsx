import React, { useState } from 'react';
import { BedIcon, LaCasitaLogo, CamasFloridaLogo } from './SponsorLogos';
import { Registration } from '../types';
import { Zap, MapPin, Calendar, Clock, Clipboard, Sparkles, Smartphone, User, ArrowRight, ShieldCheck } from 'lucide-react';

interface RegistrationFormProps {
  onSubmit: (data: { fullName: string; phone: string }) => void;
  recentRegistrations: Registration[];
  totalCount: number;
  onNavigateToAdmin: () => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  onSubmit,
  onNavigateToAdmin,
}) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-format phone input to ####-#### structure
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/\D/g, '');
    if (rawVal.length <= 8) {
      if (rawVal.length > 4) {
        setPhone(`${rawVal.slice(0, 4)}-${rawVal.slice(4)}`);
      } else {
        setPhone(rawVal);
      }
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validations
    if (!fullName.trim()) {
      setError('Por favor, ingresa tu nombre completo.');
      return;
    }
    if (fullName.trim().length < 5) {
      setError('Por favor, ingresa tu nombre y apellido (mínimo 5 letras).');
      return;
    }
    
    const cleanPhone = phone.replace(/\D/g, '');
    if (!cleanPhone) {
      setError('Por favor, ingresa tu número de teléfono.');
      return;
    }
    if (cleanPhone.length !== 8) {
      setError('El número de teléfono debe tener exactamente 8 dígitos (ej: 4589-6515).');
      return;
    }

    setIsSubmitting(true);

    // Simular un procesamiento rápido y fluido
    setTimeout(() => {
      onSubmit({
        fullName: fullName.trim(),
        phone: phone,
      });
      setIsSubmitting(false);
      setFullName('');
      setPhone('');
    }, 700);
  };

  return (
    <div className="w-full flex justify-center items-center py-4 px-3 md:py-8">
      {/* Outer wrapper: simulates the rounded mockup frame with gold highlight */}
      <div className="w-full max-w-[420px] bg-white rounded-[40px] p-4 shadow-2xl border-4 border-brand-yellow relative transition-transform duration-300">
        
        {/* Subtle, hidden trigger: Double clicking the outer frame triggers the admin dashboard */}
        <div 
          onDoubleClick={onNavigateToAdmin}
          className="absolute top-4 right-4 text-brand-blue/10 hover:text-brand-blue/30 transition-all cursor-pointer p-2 z-30"
          title="Panel de Organizador (Doble clic)"
        >
          <ShieldCheck className="w-5 h-5 opacity-70" />
        </div>

        {/* SECTION 1: HEADER BANNER (YELLOW) */}
        <div className="bg-brand-yellow rounded-[28px] p-5 text-center flex flex-col items-center border-[2.5px] border-brand-blue relative">
          {/* Top Mattress avatar in a styled circle frame with dual outline */}
          <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-md transform -translate-y-8 border-3 border-brand-pink relative z-10 p-1">
            <div className="w-full h-full rounded-full border border-gray-100 flex items-center justify-center overflow-hidden bg-white">
              <img
                src="https://res.cloudinary.com/dbc6tihw1/image/upload/v1772143415/1744572362Continental-STD-1-Pillow_ado4y9.png"
                alt="Cama Continental 1 Pillow"
                referrerPolicy="no-referrer"
                className="w-[90%] h-[90%] object-contain"
              />
            </div>
          </div>

          <h2 className="text-brand-blue text-[1.4rem] font-black tracking-tight uppercase leading-none mt-[-24px] font-display">
            ¡GÁNETE UNA CAMA
          </h2>

          {/* Oval Badge 'EN LA' */}
          <div className="border-[2.5px] border-brand-pink bg-white px-5 py-0.5 rounded-full inline-block my-2.5 shadow-sm">
            <span className="text-brand-pink font-black text-xs tracking-wider uppercase">
              EN LA
            </span>
          </div>

          {/* MANO MARATÓN container box with thick border and drop shadow appearance as requested */}
          <div className="bg-white border-[3px] border-brand-blue rounded-3xl py-3.5 px-6 w-full shadow-[0_4px_0_rgba(8,30,64,1)]">
            <h1 className="text-brand-red text-2xl md:text-[1.8rem] font-black tracking-tight uppercase leading-none flex flex-col font-display">
              <span className="text-[1.3rem] tracking-[1.5px] text-[#EC008C]">MANO</span>
              <span className="text-[1.6rem] tracking-[2px] mt-1 text-[#EC008C]">MARATÓN</span>
            </h1>
          </div>
        </div>

        {/* SEPARATOR: ✨ GRACIAS A ✨ */}
        <div className="my-4 flex items-center justify-center gap-2 overflow-hidden">
          <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-brand-pink to-brand-yellow" />
          <div className="bg-brand-pink border-2 border-white px-4 py-1 rounded-full inline-flex items-center gap-1 shadow-md">
            <span className="text-brand-yellow text-xs">✨</span>
            <span className="text-white font-black text-[10px] uppercase tracking-wider pl-0.5 leading-none">
              GRACIAS A
            </span>
            <span className="text-brand-yellow text-xs">✨</span>
          </div>
          <div className="h-[2px] flex-1 bg-gradient-to-l from-transparent via-brand-pink to-brand-yellow" />
        </div>

        {/* SECTION 2: SPONSOR CONTAINER (LA CASITA) */}
        <div className="bg-white border-2 border-brand-blue/20 rounded-[32px] p-4 text-center flex flex-col items-center shadow-sm">
          <LaCasitaLogo className="w-16 h-16" />
          
          <h3 className="mt-3 font-display text-brand-blue text-[1.2rem] font-bold tracking-tight uppercase leading-none flex flex-col items-center">
            ALMACENES
            <span className="text-[#EC008C] font-black text-2xl tracking-[0.5px] mt-1 leading-none block">
              LA CASITA
            </span>
          </h3>

          <p className="text-brand-blue text-[10px] font-black tracking-wider uppercase mt-1">
            MUEBLES PARA TU HOGAR
          </p>

          {/* Yellow badge: 5º ANIVERSARIO */}
          <div className="bg-[#FFE012] border-2 border-[#FFE012] rounded-full px-6 py-1 my-3 shadow-sm">
            <span className="text-brand-blue font-black text-xs uppercase tracking-wide">
              5º ANIVERSARIO
            </span>
          </div>

          <p className="text-[#EC008C] font-black text-xs tracking-widest uppercase">
            SANTA MARÍA DE JESÚS
          </p>
        </div>

        {/* SECTION 3: RULES */}
        <div className="bg-white border-2 border-brand-pink/20 rounded-[28px] p-4 my-4 text-left shadow-sm">
          <div className="flex items-center justify-center gap-1.5 text-brand-blue font-black text-sm uppercase mb-3">
            <span className="text-[#FF8A00]">⚡</span>
            <span className="tracking-wide text-brand-blue">REGLAS OFICIALES</span>
            <span className="text-[#FF8A00]">⚡</span>
          </div>

          <ul className="space-y-3 text-xs text-slate-800 font-bold px-1">
            <li className="flex items-start gap-2.5">
              <span className="text-base shrink-0 select-none">✋</span>
              <span className="leading-tight text-slate-700">Mantén tu mano sobre la cama.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-base shrink-0 select-none">⏱️</span>
              <span className="leading-tight text-slate-700">Gana el último participante en retirarse.</span>
            </li>
            <li className="flex items-start gap-2.5 text-brand-pink font-black">
              <span className="text-base shrink-0 select-none">🏆</span>
              <span className="leading-tight">¡TE LLEVAS LA CAMA COMPLETAMENTE NUEVA!</span>
            </li>
          </ul>
        </div>

        {/* SECTION 4: SPECIFICATIONS */}
        <div className="bg-white border-2 border-brand-blue/20 rounded-[28px] p-4 my-4 text-left shadow-sm">
          <div className="flex items-center justify-center gap-1.5 text-brand-blue font-black text-sm uppercase mb-3 px-1">
            <span>📋</span>
            <span className="tracking-wider">ESPECIFICACIONES</span>
            <span>📋</span>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-brand-pink/10 rounded-xl text-brand-pink shrink-0">
                <MapPin className="w-4 h-4 fill-brand-pink/20" />
              </div>
              <div>
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider leading-none">DIRECCIÓN</p>
                <p className="text-xs font-black text-brand-pink mt-1 leading-tight">Sucursal La Casita</p>
                <p className="text-[10px] text-slate-500 leading-tight">A la par de Pollo Pinulito, Santa María de Jesús</p>
              </div>
            </div>

            <div className="w-full border-t border-dashed border-gray-150 my-1.5" />

            <div className="flex items-start gap-3">
              <div className="p-2 bg-brand-blue/10 rounded-xl text-brand-blue shrink-0">
                <Calendar className="w-4 h-4 text-brand-blue" />
              </div>
              <div>
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider leading-none">FECHA</p>
                <p className="text-xs font-black text-brand-blue mt-1">28 de Junio 2026</p>
              </div>
            </div>

            <div className="w-full border-t border-dashed border-gray-150 my-1.5" />

            <div className="flex items-start gap-3">
              <div className="p-2 bg-yellow-500/10 rounded-xl text-yellow-600 shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider leading-none">HORA</p>
                <p className="text-xs font-black text-brand-blue mt-1">8:00 AM</p>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 5: LOWER SPONSORS MATTRESS */}
        <div className="bg-white border-2 border-brand-blue/20 rounded-[28px] p-4 my-4 text-center shadow-sm">
          <div className="flex items-center justify-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-full border-2 border-brand-blue bg-white flex items-center justify-center overflow-hidden">
              <img
                src="https://res.cloudinary.com/dbc6tihw1/image/upload/v1772143415/1744572362Continental-STD-1-Pillow_ado4y9.png"
                alt="Cama Continental 1 Pillow"
                referrerPolicy="no-referrer"
                className="w-[90%] h-[90%] object-contain"
              />
            </div>
            <CamasFloridaLogo className="w-12 h-12" />
          </div>
          
          <h4 className="text-brand-blue text-sm font-black uppercase tracking-wider leading-none font-display">
            ¡CAMA NUEVA!
          </h4>
          <div className="inline-block bg-brand-pink/5 border border-brand-pink/10 rounded-full px-4 py-1.5 mt-2">
            <p className="text-brand-pink font-black text-[10px] uppercase tracking-wide leading-none">
              Edición 5º Aniversario
            </p>
          </div>
        </div>

        {/* INTERACTIVE FORM FIELDS */}
        <form onSubmit={handleFormSubmit} className="space-y-4 mt-6 text-left">
          {error && (
            <div className="bg-red-50 text-brand-pink text-xs p-3 rounded-2xl border border-brand-pink/15 font-bold flex items-start gap-2">
              <span className="text-sm shrink-0">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Input 1: NOMBRE COMPLETO */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-black tracking-wider text-brand-blue uppercase flex items-center gap-1.5 pl-0.5">
              <User className="w-4 h-4 text-brand-blue" />
              <span>NOMBRE COMPLETO <span className="text-brand-pink font-bold">*</span></span>
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Ej: Juan Pérez González"
              className="w-full bg-[#F4F6F9] border-2 border-gray-250 text-gray-900 rounded-2xl px-4 py-3 text-xs md:text-sm font-bold placeholder:text-[#A0AEC0] focus:outline-none focus:border-brand-blue focus:bg-white transition-all shadow-inner"
              required
            />
          </div>

          {/* Input 2: TELÉFONO */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-black tracking-wider text-brand-blue uppercase flex items-center gap-1.5 pl-0.5">
              <Smartphone className="w-4 h-4 text-brand-blue" />
              <span>TELÉFONO <span className="text-brand-pink font-bold">*</span></span>
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center gap-1 text-slate-500 text-xs font-bold font-mono">
                <span className="text-[10px] text-gray-400">GT</span>
                <span className="text-slate-400 font-bold">+502</span>
              </div>
              <input
                type="text"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="4589-6515"
                className="w-full bg-[#F4F6F9] border-2 border-gray-250 text-gray-900 rounded-2xl pl-20 pr-4 py-3 text-xs md:text-sm font-bold font-mono placeholder:text-[#A0AEC0] focus:outline-none focus:border-brand-blue focus:bg-white transition-all shadow-inner"
                required
              />
            </div>
          </div>

          {/* Big SUBMIT button replicating ¡QUIERO PARTICIPAR! style */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full hover:scale-[1.01] active:scale-[0.99] cursor-pointer bg-brand-blue text-white font-black text-xs md:text-sm uppercase tracking-wider py-4 px-6 rounded-3xl border-[2.5px] border-brand-pink shadow-[0_5px_0_rgba(236,0,140,1)] transition-all flex items-center justify-center gap-2 mt-6 overflow-hidden disabled:opacity-80"
            id="btn-submit-registration"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-1.5">
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>REGISTRANDO...</span>
              </div>
            ) : (
              <>
                <span>¡QUIERO PARTICIPAR!</span>
                <ArrowRight className="w-5 h-5 text-brand-yellow font-extrabold" />
              </>
            )}
          </button>
        </form>

        <p className="text-[9px] text-gray-400 font-bold text-center mt-3 uppercase tracking-wider select-none leading-tight">
          AL REGISTRARTE ACEPTAS LAS REGLAS OFICIALES DEL EVENTO
        </p>



      </div>
    </div>
  );
};
