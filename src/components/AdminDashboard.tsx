import React, { useState, useEffect } from 'react';
import { Registration } from '../types';
import { Search, Download, Trash2, ArrowLeft, UserPlus, RefreshCw, Trophy, Check, X, ShieldAlert, Award, Sparkles, SlidersHorizontal, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AdminDashboardProps {
  registrations: Registration[];
  onBack: () => void;
  onSetRegistrations: (regs: Registration[]) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  registrations,
  onBack,
  onSetRegistrations,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'checkedIn' | 'pending'>('all');
  const [winner, setWinner] = useState<Registration | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawCycleName, setDrawCycleName] = useState('');
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(true); // By default, let's keep it easily accessible or offer setting a pincode
  const [authError, setAuthError] = useState('');

  // Search and filter logic
  const filteredRegs = registrations.filter((reg) => {
    const matchesSearch =
      reg.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.phone.includes(searchTerm) ||
      reg.id.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterType === 'checkedIn') return matchesSearch && reg.checkedIn;
    if (filterType === 'pending') return matchesSearch && !reg.checkedIn;
    return matchesSearch;
  });

  // Calculate statistics
  const totalCount = registrations.length;
  const checkedInCount = registrations.filter((r) => r.checkedIn).length;
  const pendingCount = totalCount - checkedInCount;

  // Toggle checkedIn state
  const handleToggleCheckIn = (id: string) => {
    const updated = registrations.map((r) => {
      if (r.id === id) {
        return { ...r, checkedIn: !r.checkedIn };
      }
      return r;
    });
    onSetRegistrations(updated);
  };

  // Delete registration
  const handleDeleteRegistration = (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este registro?')) {
      const updated = registrations.filter((r) => r.id !== id);
      onSetRegistrations(updated);
      if (winner && winner.id === id) {
        setWinner(null);
      }
    }
  };

  // Export to Excel-compatible CSV with UTF-8 BOM
  const handleExportCSV = () => {
    if (registrations.length === 0) {
      alert('No hay registros para exportar.');
      return;
    }
    const headers = 'ID,Nombre Completo,Teléfono,Fecha de Registro,Asistencia (Mano en Cama)\n';
    const rows = registrations
      .map(
        (reg) =>
          `"${reg.id}","${reg.fullName}","${reg.phone}","${new Date(
            reg.createdAt
          ).toLocaleString()}","${reg.checkedIn ? 'ASISTIÓ' : 'PENDIENTE'}"`
      )
      .join('\n');

    // Add UTF-8 BOM to prevent spreadsheet encoding issues with Spanish characters
    const blob = new Blob(['\ufeff' + headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `participantes_mano_maraton_casita_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Populate realistic test data for illustration
  const handleLoadTestData = () => {
    const testData: Registration[] = [
      {
        id: 'MM-3580',
        fullName: 'Juan Carlos Gómez Hernández',
        phone: '4589-6515',
        createdAt: '2026-05-28T10:15:30Z',
        ticketNumber: 1,
        checkedIn: true,
      },
      {
        id: 'MM-9214',
        fullName: 'María Francisca López Pérez',
        phone: '5841-3210',
        createdAt: '2026-05-28T10:45:10Z',
        ticketNumber: 2,
        checkedIn: false,
      },
      {
        id: 'MM-4820',
        fullName: 'Pedro Antonio Alvarado Ortiz',
        phone: '3025-9844',
        createdAt: '2026-05-28T11:22:45Z',
        ticketNumber: 3,
        checkedIn: true,
      },
      {
        id: 'MM-1049',
        fullName: 'Rosa Elizabeth Méndez Castro',
        phone: '4112-5569',
        createdAt: '2026-05-28T12:05:12Z',
        ticketNumber: 4,
        checkedIn: false,
      },
      {
        id: 'MM-7832',
        fullName: 'Luis Fernando Rodas Chajón',
        phone: '5998-0125',
        createdAt: '2026-05-28T14:30:00Z',
        ticketNumber: 5,
        checkedIn: false,
      },
    ];

    if (window.confirm('¿Deseas agregar 5 participantes de prueba para ensayar el sistema?')) {
      onSetRegistrations([...registrations, ...testData]);
    }
  };

  // Clear all registrations
  const handleClearAll = () => {
    if (window.confirm('⚠️ ADVERTENCIA: ¿Estás seguro de que deseas ELIMINAR TODOS los registros? Esta acción es irreversible.')) {
      onSetRegistrations([]);
      setWinner(null);
    }
  };

  // Perform raffle winner selection
  const handleSelectWinnerRaffle = () => {
    const activeParticipants = registrations.filter((r) => r.checkedIn);
    
    if (activeParticipants.length === 0) {
      alert('Debe haber al menos un participante con la asistencia confirmada ("Mano en Cama") para participar en la tómbola.');
      return;
    }

    setIsDrawing(true);
    setWinner(null);

    let counter = 0;
    const interval = setInterval(() => {
      // Pick random name to show dynamic rolling effect
      const randomIndex = Math.floor(Math.random() * activeParticipants.length);
      setDrawCycleName(activeParticipants[randomIndex].fullName);
      counter++;

      if (counter > 25) {
        clearInterval(interval);
        const finalWinner = activeParticipants[Math.floor(Math.random() * activeParticipants.length)];
        setWinner(finalWinner);
        setIsDrawing(false);
      }
    }, 90);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Header and Back navigation */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="text-left">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition-all cursor-pointer bg-white/5 px-4.5 py-2.5 rounded-xl border border-white/5 hover:border-white/10"
            id="btn-admin-back"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al Registro</span>
          </button>
          <h1 className="text-2xl font-black text-white font-display uppercase tracking-tight mt-3">
            Panel Organizador
          </h1>
          <p className="text-xs text-gray-400">Control de asistencia y sorteos para la Mano Maratón</p>
        </div>

        {/* Administration utilities */}
        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={handleLoadTestData}
            className="cursor-pointer flex items-center gap-1.5 text-xs font-bold bg-white/5 hover:bg-white/10 border border-white/10 text-brand-yellow px-4 py-2.5 rounded-xl transition-all"
            title="Cargar registros demostrativos"
          >
            <UserPlus className="w-4 h-4" />
            <span>Cargar Datos Demostrativos</span>
          </button>

          <button
            onClick={handleClearAll}
            className="cursor-pointer flex items-center gap-1.5 text-xs font-bold bg-brand-red/10 border border-brand-red/20 text-brand-red hover:bg-brand-red/25 px-4 py-2.5 rounded-xl transition-all"
            title="Limpiar base de datos"
          >
            <Trash2 className="w-4 h-4" />
            <span>Vaciar Lista</span>
          </button>
        </div>
      </div>

      {/* Numerical Indicators panel */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-905 bg-slate-900 border border-white/5 p-5 rounded-2xl flex items-center justify-between text-left">
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase">Registros Totales</p>
            <h3 className="text-2xl font-black text-white font-display mt-1">{totalCount}</h3>
          </div>
          <div className="p-3.5 bg-brand-blue/30 rounded-xl text-brand-blue-light">
            <Users className="w-5 h-5 text-blue-500" />
          </div>
        </div>

        <div className="bg-gray-905 bg-slate-900 border border-white/5 p-5 rounded-2xl flex items-center justify-between text-left">
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase">En el Lugar (Asistió)</p>
            <h3 className="text-2xl font-black text-green-400 font-display mt-1">{checkedInCount}</h3>
          </div>
          <div className="p-3.5 bg-green-500/10 rounded-xl text-green-400">
            <Check className="w-5 h-5 text-green-400" />
          </div>
        </div>

        <div className="bg-gray-905 bg-slate-900 border border-white/5 p-5 rounded-2xl flex items-center justify-between text-left">
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase">Pendientes por Registrar</p>
            <h3 className="text-2xl font-black text-amber-500 font-display mt-1">{pendingCount}</h3>
          </div>
          <div className="p-3.5 bg-amber-500/10 rounded-xl text-amber-500">
            <RefreshCw className="w-5 h-5 text-amber-500 animate-spin-slow" />
          </div>
        </div>
      </div>

      {/* RAFFLE - THE EXCITING LUCKY DRAW TOMBOLA CARD */}
      <div className="bg-gradient-to-r from-brand-blue/40 to-brand-red/10 border border-brand-blue-light/15 rounded-3xl p-6 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-b from-brand-yellow/10 to-transparent rounded-full" />
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
          <div className="p-4 bg-brand-yellow/10 rounded-2xl text-brand-yellow shrink-0">
            <Trophy className="w-10 h-10 text-brand-yellow" />
          </div>
          <div className="text-left flex-1">
            <h3 className="text-lg font-black text-white font-display uppercase tracking-tight">Tómbola Digital Mano Maratón</h3>
            <p className="text-xs text-gray-300">
              Selecciona aleatoriamente un ganador entre los participantes registrados que se encuentran <strong className="text-green-400 font-bold">presentes con la mano en la cama</strong>.
            </p>
          </div>
          
          <div className="shrink-0">
            <button
              onClick={handleSelectWinnerRaffle}
              disabled={isDrawing || checkedInCount === 0}
              className="cursor-pointer bg-brand-yellow text-brand-blue font-black text-xs uppercase tracking-wider px-6 py-3.5 rounded-2xl border-2 border-white hover:scale-102 active:scale-98 transition-all shadow-md flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Award className="w-4 h-4" />
              <span>Realizar Sorteo</span>
            </button>
          </div>
        </div>

        {/* Drawing Screen with animated cycles */}
        <AnimatePresence mode="wait">
          {isDrawing && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-6 p-6 bg-brand-blue/30 border border-white/5 rounded-2xl flex flex-col items-center justify-center text-center overflow-hidden"
            >
              <p className="text-xs font-bold text-brand-yellow uppercase tracking-widest flex items-center gap-1.5 animate-pulse">
                <Sparkles className="w-4 h-4 text-brand-yellow fill-brand-yellow" />
                <span>Girando tómbola...</span>
              </p>
              <h4 className="text-2xl font-black text-white font-display uppercase mt-3 transition-all duration-75">
                {drawCycleName}
              </h4>
            </motion.div>
          )}

          {winner && !isDrawing && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mt-6 p-6 bg-brand-yellow/10 border-2 border-brand-yellow rounded-2xl flex flex-col items-center justify-center text-center text-gray-200"
            >
              <p className="text-xs font-black text-brand-yellow uppercase tracking-widest flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-yellow fill-brand-yellow" />
                <span>¡GANADOR SELECCIONADO!</span>
                <Sparkles className="w-4 h-4 text-brand-yellow fill-brand-yellow" />
              </p>
              <h4 className="text-3xl font-black text-white font-display uppercase tracking-tight mt-2">
                {winner.fullName}
              </h4>
              <p className="text-xs text-gray-300 font-semibold mt-1">
                Teléfono: <span className="font-mono text-xs">{winner.phone}</span> • Ticket: <span className="font-mono font-bold text-brand-yellow">#{winner.ticketNumber} ({winner.id})</span>
              </p>
              <button
                onClick={() => setWinner(null)}
                className="mt-4 text-[10px] uppercase font-bold text-slate-400 hover:text-white transition-all bg-white/5 py-1 px-3 rounded-full hover:bg-white/10"
              >
                Cerrar Ganador
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* FILTER & SEARCH TABLE CONTROLS */}
      <div className="bg-slate-900 border border-white/5 rounded-3xl p-6">
        
        {/* Search header container */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          
          {/* Search box input */}
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre, código ID o teléfono..."
              className="w-full bg-black/40 text-xs md:text-sm text-white pl-11 pr-4 py-3 rounded-xl border border-white/10 focus:outline-none focus:border-brand-blue/80 transition-all font-semibold"
            />
          </div>

          {/* Action filters */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mr-1.5 hidden lg:inline flex items-center gap-1">
              <SlidersHorizontal className="w-3 h-3" /> Filtrar:
            </span>
            <button
              onClick={() => setFilterType('all')}
              className={`cursor-pointer px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                filterType === 'all'
                  ? 'bg-brand-blue text-white border border-brand-blue-light/50'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/5'
              }`}
            >
              Todos ({totalCount})
            </button>
            <button
              onClick={() => setFilterType('checkedIn')}
              className={`cursor-pointer px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                filterType === 'checkedIn'
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/5'
              }`}
            >
              Asistió ({checkedInCount})
            </button>
            <button
              onClick={() => setFilterType('pending')}
              className={`cursor-pointer px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                filterType === 'pending'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/5'
              }`}
            >
              Pendientes ({pendingCount})
            </button>

            {/* CSV export button */}
            <button
              onClick={handleExportCSV}
              className="cursor-pointer bg-green-500/10 hover:bg-green-500/20 border border-green-500/25 text-green-400 font-bold text-xs px-4 py-2.5 rounded-xl hover:scale-102 active:scale-98 transition-all flex items-center gap-1.5 select-none shrink-0"
              title="Exportar a CSV"
            >
              <Download className="w-4 h-4" />
              <span>Exportar Excel</span>
            </button>
          </div>
        </div>

        {/* DATA CONTAINER TABLE */}
        <div className="overflow-x-auto">
          {filteredRegs.length === 0 ? (
            <div className="text-center py-16 px-4 bg-black/10 rounded-2xl border border-dashed border-white/5">
              <ShieldAlert className="w-10 h-10 text-gray-500 mx-auto mb-3" />
              <h4 className="text-sm font-bold text-gray-200">No se encontraron resultados</h4>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                No hay participantes para mostrar con ese patrón de búsqueda. Intenta modificar tus filtros o agrega participantes.
              </p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[550px]">
              <thead>
                <tr className="border-b border-white/5 pb-3">
                  <th className="py-3 px-4 text-[10px] font-black text-gray-400 uppercase tracking-wider">Código ID</th>
                  <th className="py-3 px-4 text-[10px] font-black text-gray-400 uppercase tracking-wider">Nombre Completo</th>
                  <th className="py-3 px-4 text-[10px] font-black text-gray-400 uppercase tracking-wider">Teléfono</th>
                  <th className="py-3 px-4 text-[10px] font-black text-gray-400 uppercase tracking-wider">Registrado</th>
                  <th className="py-3 px-4 text-[10px] font-black text-gray-400 uppercase tracking-wider text-center">Mano en Cama?</th>
                  <th className="py-3 px-4 text-[10px] font-black text-gray-400 uppercase tracking-wide text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredRegs.map((reg) => (
                  <tr key={reg.id} className="hover:bg-white/[0.02] transition-colors leading-normal group">
                    {/* Participant Code */}
                    <td className="py-4.5 px-4 font-mono text-xs font-bold text-brand-yellow">
                      {reg.id}
                    </td>

                    {/* Participant Name */}
                    <td className="py-4.5 px-4">
                      <div>
                        <p className="text-xs font-extrabold text-white uppercase">{reg.fullName}</p>
                        <p className="text-[10px] text-gray-500 font-semibold font-mono">Ticket No. #{reg.ticketNumber}</p>
                      </div>
                    </td>

                    {/* Participant phone */}
                    <td className="py-4.5 px-4 font-mono text-xs font-medium text-gray-300">
                      {reg.phone}
                    </td>

                    {/* Registration Date */}
                    <td className="py-4.5 px-4 text-[10px] text-gray-400">
                      {new Date(reg.createdAt).toLocaleDateString()}
                      <p className="text-[9px] text-gray-500 font-mono">{new Date(reg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </td>

                    {/* MARATHON PRESENT FLAG CHECK */}
                    <td className="py-4.5 px-4">
                      <div className="flex justify-center">
                        <button
                          onClick={() => handleToggleCheckIn(reg.id)}
                          className={`cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase transition-all shadow-sm ${
                            reg.checkedIn
                              ? 'bg-green-500/20 text-green-400 border border-green-500/30 font-bold'
                              : 'bg-amber-500/10 text-amber-500 border border-amber-500/20 font-bold hover:bg-amber-500/15'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${reg.checkedIn ? 'bg-green-400 animate-pulse' : 'bg-amber-500'}`} />
                          <span>{reg.checkedIn ? 'Mano en Cama' : 'Pendiente'}</span>
                        </button>
                      </div>
                    </td>

                    {/* ACTIONS */}
                    <td className="py-4.5 px-4 text-right">
                      <button
                        onClick={() => handleDeleteRegistration(reg.id)}
                        className="cursor-pointer text-gray-500 hover:text-brand-red p-2 rounded-lg hover:bg-brand-red/10 transition-all inline-flex items-center"
                        title="Eliminar Registro"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer info within table container card */}
        <div className="border-t border-white/5 pt-4 mt-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-[11px] text-gray-500">
          <span>Mostrando {filteredRegs.length} de {totalCount} participantes registrados.</span>
          <span>Haga clic para alternar asistencia ("Mano en Cama") e integrarlos a la tómbola de sorteos.</span>
        </div>

      </div>
    </div>
  );
};
