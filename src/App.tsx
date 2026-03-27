/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import * as XLSX from 'xlsx';
import { 
  Heart, 
  LayoutDashboard, 
  Settings, 
  LogOut, 
  Plus, 
  Search, 
  CheckCircle2, 
  X, 
  ChevronRight, 
  Upload, 
  Trophy,
  Users,
  MessageSquare,
  Bell,
  MoreHorizontal,
  Trash2,
  Edit2,
  Lock,
  Unlock,
  Building2,
  Sparkles,
  LayoutGrid,
  Image as ImageIcon,
  Camera,
  FileSpreadsheet,
  Calendar,
  UserPlus,
  Paperclip,
  Download,
  Maximize2,
  Rocket,
  Handshake,
  Target,
  Lightbulb,
  Shield,
  Zap,
  Star,
  Award,
  Smile,
  ThumbsUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Company, Value, Collaborator, Recognition, AppConfig, Period } from './types';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const VALUE_ICONS: Record<string, any> = {
  Rocket,
  Handshake,
  Target,
  Lightbulb,
  Shield,
  Zap,
  Star,
  Award,
  Smile,
  ThumbsUp,
  Heart,
  Sparkles,
  Users,
  Trophy,
  Building2,
  Calendar,
  CheckCircle2,
  LayoutGrid,
  MessageSquare,
  Search,
  Settings,
  UserPlus,
};

const ValueIcon = ({ name, size = 24, className }: { name: string, size?: number, className?: string }) => {
  const Icon = VALUE_ICONS[name] || Sparkles;
  return <Icon size={size} className={cn("text-brand-500", className)} />;
};

// --- Components ---

const FilePreviewModal = ({ file, onClose }: { file: string, onClose: () => void }) => {
  const isImage = file.startsWith('data:image');
  
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = file;
    link.download = `adjunto_${Date.now()}.${isImage ? 'png' : 'file'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-[2.5rem] overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
              {isImage ? <ImageIcon size={20} /> : <Paperclip size={20} />}
            </div>
            <p className="font-bold text-slate-900">Previsualización de Archivo</p>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleDownload}
              className="p-3 rounded-xl bg-brand-50 text-brand-600 hover:bg-brand-100 transition-all flex items-center gap-2 font-bold text-sm"
            >
              <Download size={18} />
              Descargar
            </button>
            <button 
              onClick={onClose}
              className="p-3 rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-100 transition-all"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-8 bg-slate-50 flex items-center justify-center min-h-[400px]">
          {isImage ? (
            <img src={file} alt="Preview" className="max-w-full max-h-full object-contain shadow-lg rounded-xl" referrerPolicy="no-referrer" />
          ) : (
            <div className="text-center space-y-6">
              <div className="w-24 h-24 bg-white rounded-3xl shadow-sm flex items-center justify-center mx-auto text-slate-200">
                <Paperclip size={48} />
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900 mb-2">Archivo no previsualizable</p>
                <p className="text-slate-500">Este tipo de archivo no se puede mostrar directamente, pero puedes descargarlo.</p>
              </div>
              <Button onClick={handleDownload} variant="secondary" className="px-8">
                Descargar Archivo
              </Button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

const SidebarItem = ({ 
  icon: Icon, 
  label, 
  active, 
  onClick, 
  collapsed 
}: { 
  icon: any, 
  label: string, 
  active?: boolean, 
  onClick: () => void,
  collapsed?: boolean
}) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group w-full",
      active 
        ? "sidebar-active" 
        : "text-slate-400 hover:text-slate-900 hover:bg-white/50"
    )}
  >
    <Icon size={20} className={cn(active ? "text-brand-600" : "group-hover:scale-110 transition-transform")} />
    {!collapsed && <span className="font-semibold text-[15px]">{label}</span>}
  </button>
);

const Card = ({ children, className, ...props }: { children: React.ReactNode, className?: string, [key: string]: any }) => (
  <div className={cn("premium-card p-6 flex flex-col h-full", className)} {...props}>
    <div className="flex-1">
      {children}
    </div>
  </div>
);

const Footer = () => (
  <div className="py-10 text-[14px] text-slate-400 font-medium text-center border-t border-slate-100 mt-auto">
    Una herramienta elaborada por <span className="text-[#fa5800] font-bold">FT Group</span>
  </div>
);

const Button = ({ 
  children, 
  variant = 'primary', 
  className, 
  ...props 
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' }) => {
  const variants = {
    primary: "bg-slate-900 text-white hover:bg-slate-800 shadow-sm",
    secondary: "bg-brand-600 text-white hover:bg-brand-700 shadow-sm",
    outline: "border border-slate-200 text-slate-700 hover:bg-slate-50",
    ghost: "text-slate-400 hover:text-slate-900 hover:bg-white/50",
    danger: "bg-red-50 text-red-600 hover:bg-red-100"
  };

  return (
    <button 
      className={cn(
        "px-5 py-2.5 rounded-2xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

// --- Views ---

const LandingView = ({ config, onLogin }: { config: AppConfig | null, onLogin: (email: string) => void }) => {
  const [email, setEmail] = useState('');

  return (
    <div className="min-h-screen flex bg-white">
      <div className="flex-1 flex flex-col justify-center p-12 lg:p-24">
        <div className="max-w-md w-full mx-auto">
          <div className="flex items-center gap-3 mb-16">
            {config?.company.logo ? (
              <img src={config.company.logo} alt={config.company.name} className="h-12 object-contain" referrerPolicy="no-referrer" />
            ) : (
              <>
                <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center shadow-xl">
                  <Heart className="text-white" size={24} />
                </div>
                <span className="font-bold text-3xl tracking-tight text-slate-900">Reconocimiento</span>
              </>
            )}
          </div>

          <div className="mb-12">
            <h1 className="text-5xl font-bold text-slate-900 mb-4 tracking-tight">Bienvenido de nuevo.</h1>
            <p className="text-slate-500 text-xl">Reconoce el talento, celebra los valores y fortalece la cultura de tu equipo.</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Correo Corporativo</label>
              <input 
                type="email" 
                placeholder="nombre@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-6 py-5 rounded-[1.5rem] border border-slate-100 bg-white focus:bg-white focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all text-lg"
              />
            </div>
            <Button 
              className="w-full py-5 text-xl rounded-[1.5rem] shadow-xl shadow-brand-100" 
              onClick={() => onLogin(email)}
              disabled={!email.includes('@')}
            >
              Iniciar Sesión
            </Button>
            <div className="pt-8 border-t border-white">
              <p className="text-xs text-slate-400 leading-relaxed">
                <span className="font-bold text-slate-900">Acceso Master:</span><br />
                <span className="font-mono">kath@metodosft.com</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="hidden lg:block flex-1 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#fa5800,transparent_70%)]" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center p-24">
          <div className="relative">
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-brand-500/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl animate-pulse delay-700" />
            <div className="bg-white/10 backdrop-blur-2xl border border-white/10 p-12 rounded-[4rem] relative z-10 shadow-2xl">
              <Trophy className="text-brand-400 mb-8" size={64} />
              <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">Celebra lo extraordinario.</h2>
              <p className="text-brand-100/60 text-xl leading-relaxed">
                Una plataforma diseñada para hacer que el reconocimiento sea parte del día a día.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const RecognizeView = ({ config, currentUser, onNominate }: { config: AppConfig, currentUser: Collaborator, onNominate: (toId: number, valueId: number, story: string, attachments: string[]) => Promise<boolean> }) => {
  const [step, setStep] = useState(1);
  const [selectedValue, setSelectedValue] = useState<Value | null>(null);
  const [selectedCollab, setSelectedCollab] = useState<Collaborator | null>(null);
  const [story, setStory] = useState('');
  const [search, setSearch] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [attachments, setAttachments] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const activePeriods = config.periods.filter(p => p.isActive === 1);
  const activePeriod = activePeriods[0];

  const filteredCollabs = config.collaborators.filter(c => {
    const isSelf = c.id === currentUser.id;
    const isMaster = c.isMaster === 1;
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || 
                         c.email.toLowerCase().includes(search.toLowerCase()) ||
                         (c.area && c.area.toLowerCase().includes(search.toLowerCase()));
    
    if (isSelf || isMaster || !matchesSearch) return false;

    // Filter by linked collaborators if any are specified in active periods
    const linkedIds = new Set<number>();
    activePeriods.forEach(p => {
      if (p.linkedCollaboratorIds && p.linkedCollaboratorIds.length > 0) {
        p.linkedCollaboratorIds.forEach(id => linkedIds.add(id));
      }
    });

    if (linkedIds.size === 0) return true;
    return linkedIds.has(c.id);
  });

  const handleNominate = async () => {
    console.log('handleNominate called', { selectedValue, selectedCollab, storyLength: story.length, attachmentsCount: attachments.length });
    if (!selectedValue || !selectedCollab || !story.trim()) {
      console.warn('Missing required fields for nomination');
      return;
    }
    try {
      setIsSubmitting(true);
      console.log('Calling onNominate...');
      const success = await onNominate(selectedCollab.id, selectedValue.id, story.trim(), attachments);
      console.log('onNominate result:', success);
      if (success) {
        setShowSuccess(true);
      }
    } catch (error) {
      console.error('Error in handleNominate:', error);
      alert('Ocurrió un error inesperado al enviar el reconocimiento.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachments(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const availableValues = useMemo(() => {
    const linkedIds = new Set<number>();
    activePeriods.forEach(p => {
      if (p.linkedValueIds && p.linkedValueIds.length > 0) {
        p.linkedValueIds.forEach(id => linkedIds.add(id));
      }
    });
    
    if (linkedIds.size === 0) return config.values;
    return config.values.filter(v => linkedIds.has(v.id));
  }, [config.values, activePeriods]);

  if (config.company.votingOpen === 0 || activePeriods.length === 0) {
    return (
      <div className="h-full flex items-center justify-center p-12">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center mx-auto mb-8">
            <Lock className="text-slate-400" size={40} />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">
            {activePeriods.length === 0 ? "Sin periodo activo" : "Votaciones cerradas"}
          </h2>
          <p className="text-slate-500 text-lg leading-relaxed">
            {activePeriods.length === 0 
              ? "No hay un periodo de reconocimiento activo en este momento. Por favor, contacta al administrador."
              : "Las votaciones han finalizado por ahora. Gracias por reconocer a tus compañeros. Puedes ver los resultados en el Dashboard."
            }
          </p>
        </div>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-12 text-center">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-32 h-32 bg-emerald-500 rounded-[2.5rem] flex items-center justify-center text-white mb-8 shadow-2xl shadow-emerald-200"
        >
          <CheckCircle2 size={64} />
        </motion.div>
        <h2 className="text-5xl font-bold text-slate-900 mb-4 tracking-tight">¡Reconocimiento Enviado!</h2>
        <p className="text-slate-500 text-xl max-w-md mx-auto mb-12">
          Has compartido una historia increíble sobre {selectedCollab?.name}. Esto fortalece nuestra cultura.
        </p>
        <Button onClick={() => {
          setStep(1);
          setSelectedValue(null);
          setSelectedCollab(null);
          setStory('');
          setShowSuccess(false);
        }} className="px-12 py-4 text-lg">
          Hacer otro reconocimiento
        </Button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col max-w-7xl mx-auto p-12">
      <div className="mb-12 flex items-end justify-between">
        <div>
          <div className="flex items-center gap-4 mb-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center gap-2">
                <div className={cn(
                  "w-10 h-10 rounded-2xl flex items-center justify-center font-bold transition-all duration-500",
                  step === i ? "bg-slate-900 text-white shadow-lg scale-110" : 
                  step > i ? "bg-emerald-500 text-white" : "bg-white text-slate-400"
                )}>
                  {step > i ? <CheckCircle2 size={18} /> : i}
                </div>
                {i < 3 && <div className={cn("w-12 h-1 bg-white rounded-full", step > i && "bg-emerald-500")} />}
              </div>
            ))}
          </div>
          <h1 className="text-6xl font-bold text-slate-900 tracking-tight">
            {step === 1 && "Selecciona un Pilar"}
            {step === 2 && "¿A quién quieres reconocer?"}
            {step === 3 && "Cuenta la historia"}
          </h1>
          <p className="text-slate-500 text-xl mt-4 max-w-2xl">
            {step === 1 && "Elige el pilar organizacional que mejor representa esta acción. Cada pilar es fundamental para nuestra cultura."}
            {step === 2 && `Has seleccionado ${selectedValue?.name}. Ahora busca al compañero que ha tenido un impacto positivo.`}
            {step === 3 && `Los detalles hacen que el reconocimiento sea más significativo para ${selectedCollab?.name}.`}
          </p>
        </div>
        {step > 1 && (
          <Button variant="ghost" onClick={() => setStep(step - 1)} className="mb-2">
            Volver al paso anterior
          </Button>
        )}
      </div>

      <div className="flex-1">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-10"
            >
              {availableValues.map(v => (
                <button
                  key={v.id}
                  onClick={() => { setSelectedValue(v); setStep(2); }}
                  className="group relative h-[320px] w-full rounded-[3.5rem] overflow-hidden shadow-2xl hover:shadow-brand-500/20 transition-all duration-700 border-4 border-transparent hover:border-slate-900 flex flex-col"
                >
                  <img 
                    src={v.image || `https://picsum.photos/seed/${v.name}/800/1200`} 
                    alt={v.name} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                  
                  <div className="absolute top-8 right-8 w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                    <ValueIcon name={v.icon} size={32} className="text-white" />
                  </div>

                  <div className="relative mt-auto p-10 text-left">
                    <h3 className="text-4xl font-bold text-white mb-3 tracking-tight">{v.name}</h3>
                    <p className="text-white/60 text-lg line-clamp-2 mb-6 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                      Reconoce a alguien que encarne este valor hoy.
                    </p>
                    <div className="flex items-center gap-3 text-white font-bold text-sm uppercase tracking-[0.2em]">
                      <span>Seleccionar</span>
                      <ChevronRight size={18} className="group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </button>
              ))}
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-10"
            >
              <div className="relative max-w-3xl">
                <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-400" size={28} />
                <input 
                  type="text"
                  placeholder="Busca por nombre, cargo o correo..."
                  className="w-full pl-20 pr-8 py-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl focus:outline-none focus:ring-8 focus:ring-brand-500/5 text-2xl placeholder:text-slate-300 transition-all"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCollabs.map(c => (
                  <button
                    key={c.id}
                    onClick={() => { setSelectedCollab(c); setStep(3); }}
                    className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex items-center gap-8 group text-left relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-10 transition-opacity">
                      <Sparkles size={40} className="text-brand-600" />
                    </div>
                    <div className="relative">
                      <img src={c.avatar} alt={c.name} className="w-24 h-24 rounded-[2rem] bg-white p-1.5 group-hover:scale-110 transition-transform duration-500 shadow-inner" referrerPolicy="no-referrer" />
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full border-4 border-white shadow-lg" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-900 text-2xl truncate mb-1">{c.name}</p>
                      <div className="flex flex-col gap-1">
                        <p className="text-slate-400 text-base truncate font-medium">{c.email}</p>
                        {c.area && (
                          <span className="text-[10px] text-brand-600 font-bold uppercase tracking-widest bg-brand-50 px-2 py-0.5 rounded-md w-fit">
                            {c.area}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-slate-300 group-hover:bg-slate-900 group-hover:text-white transition-all duration-500 shadow-sm">
                      <ChevronRight size={24} />
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-12"
            >
              <div className="lg:col-span-8 space-y-8">
                <Card className="p-12 rounded-[4rem] border border-slate-100 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-12 opacity-5">
                    <MessageSquare size={120} />
                  </div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-[0.3em] mb-10">Tu Historia de Reconocimiento</label>
                  <textarea 
                    className="w-full h-80 p-0 bg-transparent border-none focus:ring-0 text-3xl text-slate-900 placeholder:text-slate-200 resize-none leading-relaxed font-medium"
                    placeholder="Cuéntanos qué pasó... Sé específico y emocional."
                    value={story}
                    onChange={(e) => setStory(e.target.value)}
                    autoFocus
                  />
                  <div className="mt-10 pt-10 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-3 text-slate-400">
                        <Sparkles size={18} />
                        <span className="text-sm font-medium">Tu historia inspira a otros.</span>
                      </div>
                      <label className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl cursor-pointer transition-all border border-slate-100 group">
                        <Paperclip size={16} className="group-hover:rotate-12 transition-transform" />
                        <span className="text-xs font-bold uppercase tracking-wider">Adjuntar Archivos</span>
                        <input 
                          type="file" 
                          multiple 
                          className="hidden" 
                          accept="image/*,.pdf,.doc,.docx"
                          onChange={handleFileChange}
                        />
                      </label>
                    </div>
                    <p className="text-slate-300 text-sm font-bold">{story.length} caracteres</p>
                  </div>

                  {attachments.length > 0 && (
                    <div className="mt-8 grid grid-cols-4 sm:grid-cols-6 gap-4">
                      {attachments.map((att, i) => (
                        <div 
                          key={i} 
                          onClick={() => setSelectedFile(att)}
                          className="relative group aspect-square rounded-2xl overflow-hidden border border-slate-100 shadow-sm cursor-pointer"
                        >
                          {att.startsWith('data:image') ? (
                            <img src={att} alt="Attachment" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            <div className="w-full h-full bg-slate-50 flex items-center justify-center text-slate-400">
                              <Paperclip size={24} />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                            <Maximize2 className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
                          </div>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              removeAttachment(i);
                            }}
                            className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
                <div className="flex gap-6">
                  <Button 
                    type="button"
                    onClick={() => {
                      console.log('Button clicked');
                      handleNominate();
                    }} 
                    disabled={!story.trim() || isSubmitting}
                    className="flex-1 py-6 text-xl rounded-[2rem] shadow-2xl shadow-brand-100"
                    variant="secondary"
                  >
                    {isSubmitting ? "Enviando..." : "Confirmar y Enviar Reconocimiento"}
                  </Button>
                </div>
              </div>

              <div className="lg:col-span-4 space-y-8">
                <div className="bg-slate-900 p-10 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden group">
                  <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em] mb-12">Resumen del Reconocimiento</p>
                  
                  <div className="space-y-10 relative z-10">
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <img src={selectedCollab?.avatar} alt={selectedCollab?.name} className="w-20 h-20 rounded-[1.5rem] bg-white/10 p-1.5 border border-white/10" referrerPolicy="no-referrer" />
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full border-4 border-slate-900" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Para</p>
                        <p className="text-2xl font-bold tracking-tight">{selectedCollab?.name}</p>
                      </div>
                    </div>
                    
                    <div className="w-20 h-20 rounded-[1.5rem] bg-brand-50 border border-brand-100 flex items-center justify-center overflow-hidden shadow-inner">
                      {selectedValue && <ValueIcon name={selectedValue.icon} size={32} />}
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Bajo el Valor</p>
                      <p className="text-2xl font-bold tracking-tight">{selectedValue?.name}</p>
                    </div>
                  </div>
                </div>
                

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {selectedFile && (
          <FilePreviewModal file={selectedFile} onClose={() => setSelectedFile(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

type DashboardViewProps = {
  config: AppConfig;
  currentUser: Collaborator;
  recognitions: Recognition[];
  refreshRecognitions: (force?: boolean) => Promise<void>;
};

const DashboardView = ({ config, currentUser, recognitions, refreshRecognitions }: DashboardViewProps) => {
  const [topNominators, setTopNominators] = useState<{ id: number, name: string, avatar: string, count: number }[]>([]);
  const [ambassadors, setAmbassadors] = useState<{ valueId: number, valueName: string, collabId: number, collabName: string, collabAvatar: string, totalValidated: number }[]>([]);
  const [selectedCollab, setSelectedCollab] = useState<Collaborator | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const topAmbassadors = useMemo(() => {
    const seenValues = new Set();
    return ambassadors
      .filter(amb => {
        if (seenValues.has(amb.valueId)) return false;
        seenValues.add(amb.valueId);
        return true;
      })
      .sort((a, b) => b.totalValidated - a.totalValidated)
      .slice(0, 6);
  }, [ambassadors]);

const normalizeScore = (score: any): number | null => {
  if (score === 1 || score === '1') return 1;
  if (score === 0 || score === '0') return 0;
  if (score === -1 || score === '-1') return 0;
  if (score === '' || score === undefined) return null;
  if (score === null) return null;
  return null;
};

const normalizeRecognition = (recognition: any) => ({
  ...recognition,
  score: normalizeScore(recognition.score)
});

useEffect(() => {
  refreshRecognitions();

  Promise.all([
    fetch('/api/stats/top-nominators').then(res => res.json()),
    fetch('/api/stats/ambassadors').then(res => res.json())
  ])
    .then(([topData, ambData]) => {
      setTopNominators(topData);
      setAmbassadors(ambData);
      setLoading(false);
    })
    .catch(error => {
      console.error('Error loading dashboard:', error);
      setLoading(false);
    });
}, []);

  
  const statsByValue = useMemo(() => {
    return config.values.map(v => {
      const valueRecognitions = recognitions.filter(r => r.valueId === v.id && r.score === 1);
      const counts: Record<number, number> = {};
      valueRecognitions.forEach(r => {
        counts[r.toId] = (counts[r.toId] || 0) + 1;
      });
      
      const ranking = Object.entries(counts)
        .map(([id, count]) => {
          const collab = config.collaborators.find(c => c.id === parseInt(id) && c.isMaster !== 1);
          return collab ? { collab, count } : null;
        })
        .filter((item): item is { collab: Collaborator, count: number } => item !== null)
        .sort((a, b) => b.count - a.count)
        .slice(0, 3);

      return { ...v, ranking, total: valueRecognitions.length };
    });
  }, [recognitions, config]);

  const collabRecognitions = useMemo(() => {
    if (!selectedCollab) return [];
    return recognitions.filter(r => r.toId === selectedCollab.id && r.score === 1);
  }, [selectedCollab, recognitions]);

  if (loading) return <div className="p-8 text-center text-slate-500 bg-white min-h-screen flex items-center justify-center">Cargando dashboard...</div>;

  return (
    <div className="flex h-full">
      <div className="flex-1 p-12 overflow-y-auto custom-scrollbar">
        <div className="flex items-center justify-between mb-16">
          <div>
            <h1 className="text-5xl font-bold text-slate-900 tracking-tight">Hola, {currentUser.name.split(' ')[0]} 👋</h1>
            <p className="text-slate-500 text-xl mt-2">Esto es lo que ha estado pasando en tu equipo hoy.</p>
          </div>
          <div className="flex gap-4">
            <button className="w-14 h-14 rounded-[1.5rem] bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all hover:shadow-lg shadow-sm">
              <Search size={24} />
            </button>
            <button className="w-14 h-14 rounded-[1.5rem] bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all hover:shadow-lg shadow-sm relative">
              <Bell size={24} />
              <div className="absolute top-4 right-4 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="p-10 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all duration-500">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <Trophy className="text-brand-600 mb-6 relative z-10" size={32} />
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 relative z-10">Reconocimientos Validados</p>
            <p className="text-6xl font-bold text-slate-900 relative z-10">{recognitions.filter(r => r.score === 1).length}</p>
          </Card>
          <Card className="p-10 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all duration-500">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <Users className="text-emerald-600 mb-6 relative z-10" size={32} />
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 relative z-10">Miembros</p>
            <p className="text-6xl font-bold text-slate-900 relative z-10">{config.collaborators.filter(c => c.isMaster !== 1).length}</p>
          </Card>
          <Card className="p-10 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all duration-500">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <Heart className="text-amber-600 mb-6 relative z-10" size={32} />
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 relative z-10">Pilares</p>
            <p className="text-6xl font-bold text-slate-900 relative z-10">{config.values.length}</p>
          </Card>
        </div>

        {(currentUser.isAdmin === 1 || config.company.showResults === 1) ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Embajadores de Cultura</h2>
                  <Sparkles className="text-amber-500" size={24} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {topAmbassadors.map(amb => (
                    <div key={`${amb.valueId}-${amb.collabId}`} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Trophy size={40} className="text-amber-500" />
                      </div>
                      <div className="flex items-center gap-4 mb-4">
                        <img src={amb.collabAvatar} alt={amb.collabName} className="w-12 h-12 rounded-2xl bg-white p-1" referrerPolicy="no-referrer" />
                        <div>
                          <p className="font-bold text-slate-900 truncate">{amb.collabName}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{amb.valueName}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-1">
                          <CheckCircle2 size={14} className="text-emerald-500" />
                          <span className="text-sm font-bold text-slate-900">{amb.totalValidated} Validados</span>
                        </div>
                        <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded-lg">Embajador</span>
                      </div>
                    </div>
                  ))}
                  {ambassadors.length === 0 && (
                    <div className="col-span-full py-12 text-center bg-white rounded-[2.5rem] border border-dashed border-slate-200">
                      <p className="text-slate-400 italic">Aún no hay embajadores calificados.</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Muro de la Comunidad</h2>
                  <button className="text-sm font-bold text-brand-600 hover:text-brand-700">Ver historial</button>
                </div>
                <div className="space-y-6">
                  {recognitions.filter(r => r.score !== 0 && r.fromIsMaster !== 1).slice(0, 5).map(r => (
                    <motion.div 
                      key={r.id} 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex gap-6 group hover:shadow-xl transition-all cursor-pointer"
                      onClick={() => setSelectedCollab(config.collaborators.find(c => c.id === r.toId) || null)}
                    >
                      <div className="relative shrink-0">
                        <img src={r.toAvatar} alt={r.toName} className="w-16 h-16 rounded-2xl bg-white p-1 group-hover:scale-110 transition-transform" referrerPolicy="no-referrer" />
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
                          <ValueIcon name={r.valueIcon} size={16} />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-bold text-slate-900 text-lg">{r.toName}</p>
                          <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">{new Date(r.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-slate-500 text-lg line-clamp-2 leading-relaxed italic">"{r.story}"</p>

{r.attachmentCount > 0 && (
  <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
    <Paperclip size={14} />
    <span>
      {r.attachmentCount} {r.attachmentCount === 1 ? 'archivo adjunto' : 'archivos adjuntos'}
    </span>
    {r.firstAttachmentType === 'image' && (
      <span className="text-[10px] px-2 py-1 rounded-lg bg-brand-50 text-brand-600 font-bold uppercase tracking-widest">
        Imagen
      </span>
    )}
  </div>
)}

                        
                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <img src={r.fromAvatar} alt={r.fromName} className="w-6 h-6 rounded-lg" referrerPolicy="no-referrer" />
                            <span className="text-xs text-slate-400 font-medium">Reconocido por <span className="text-slate-900 font-bold">{r.fromName}</span></span>
                          </div>
                          {r.score === 1 && (
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
                              <CheckCircle2 size={12} />
                              <span className="text-[10px] font-bold uppercase tracking-widest">Validado</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Top Nominadores</h2>
                </div>
                <Card className="p-10 rounded-[3rem] border border-slate-100 shadow-sm">
                  <div className="space-y-6">
                    {topNominators.map((n, i) => (
                      <div key={n.id} className="flex items-center justify-between p-5 bg-white rounded-[2rem] hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-slate-100">
                        <div className="flex items-center gap-5">
                          <div className={cn(
                            "w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-bold shadow-sm",
                            i === 0 ? "bg-amber-100 text-amber-600" : 
                            i === 1 ? "bg-slate-200 text-slate-600" :
                            i === 2 ? "bg-orange-100 text-orange-600" : "bg-white text-slate-400"
                          )}>
                            {i + 1}
                          </div>
                          <img src={n.avatar} alt={n.name} className="w-12 h-12 rounded-2xl bg-white p-1 shadow-sm" referrerPolicy="no-referrer" />
                          <div>
                            <p className="font-bold text-slate-900 text-lg">{n.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Colaborador Estrella</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-brand-600">{n.count}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Nominaciones</p>
                        </div>
                      </div>
                    ))}
                    {topNominators.length === 0 && (
                      <div className="text-center py-12 text-slate-400 italic">
                        <Trophy size={40} className="mx-auto mb-4 opacity-20" />
                        <p>Aún no hay nominaciones este periodo.</p>
                      </div>
                    )}
                  </div>
                </Card>
              </div>

              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Líderes de Valores</h2>
                  <button className="text-sm font-bold text-brand-600 hover:text-brand-700">Ver todos</button>
                </div>
                <Card className="p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-10">
                  {statsByValue.slice(0, 4).map(v => (
                    <div key={v.id} className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center overflow-hidden shadow-inner">
                            <ValueIcon name={v.icon} size={24} />
                          </div>
                          <p className="font-bold text-xl text-slate-900">{v.name}</p>
                        </div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{v.total} Reconocimientos</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex -space-x-3">
                          {v.ranking.map((rank, i) => (
                            <img 
                              key={rank.collab.id} 
                              src={rank.collab.avatar} 
                              alt={rank.collab.name} 
                              className="w-10 h-10 rounded-xl border-4 border-white bg-white shadow-sm"
                              title={`${rank.collab.name}: ${rank.count}`}
                              referrerPolicy="no-referrer"
                            />
                          ))}
                        </div>
                        <div className="flex-1 h-2 bg-white rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, (v.total / (recognitions.length || 1)) * 200)}%` }}
                            className="h-full bg-slate-900 rounded-full"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </Card>
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-8 mb-16">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Muro de la Comunidad</h2>
              <button className="text-sm font-bold text-brand-600 hover:text-brand-700">Ver historial</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recognitions.filter(r => r.score !== 0 && r.fromIsMaster !== 1).slice(0, 6).map(r => (
                <motion.div 
                  key={r.id} 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex gap-6 group hover:shadow-xl transition-all cursor-pointer"
                  onClick={() => setSelectedCollab(config.collaborators.find(c => c.id === r.toId) || null)}
                >
                  <div className="relative shrink-0">
                    <img src={r.toAvatar} alt={r.toName} className="w-16 h-16 rounded-2xl bg-white p-1 group-hover:scale-110 transition-transform" referrerPolicy="no-referrer" />
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
                      <ValueIcon name={r.valueIcon} size={16} />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-bold text-slate-900 text-lg">{r.toName}</p>
                      <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">{new Date(r.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-slate-500 text-lg line-clamp-2 leading-relaxed italic">"{r.story}"</p>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img src={r.fromAvatar} alt={r.fromName} className="w-6 h-6 rounded-lg" referrerPolicy="no-referrer" />
                        <span className="text-xs text-slate-400 font-medium">Reconocido por <span className="text-slate-900 font-bold">{r.fromName}</span></span>
                      </div>
                      {r.score === 1 && (
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
                          <CheckCircle2 size={12} />
                          <span className="text-[10px] font-bold uppercase tracking-widest">Validado</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Collaborator Detail Modal */}
      <AnimatePresence>
        {selectedCollab && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCollab(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-3xl rounded-[4rem] overflow-hidden shadow-2xl relative z-10 flex flex-col max-h-[90vh]"
            >
              <div className="bg-brand-600 p-12 text-white relative">
                <button 
                  onClick={() => setSelectedCollab(null)}
                  className="absolute top-8 right-8 p-3 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X size={28} />
                </button>
                <div className="flex items-center gap-10">
                  <div className="relative">
                    <img src={selectedCollab.avatar} alt={selectedCollab.name} className="w-32 h-32 rounded-[3rem] bg-white/10 p-1.5" referrerPolicy="no-referrer" />
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 rounded-full border-4 border-brand-600" />
                  </div>
                  <div>
                    <h2 className="text-5xl font-bold tracking-tight">{selectedCollab.name}</h2>
                    <p className="text-white/70 font-bold text-lg mt-2 uppercase tracking-widest">{selectedCollab.email}</p>
                    <div className="flex gap-4 mt-8">
                      <div className="bg-white/10 px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-[0.2em]">
                        {collabRecognitions.length} Reconocimientos
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-12 space-y-10 custom-scrollbar">
                <div className="flex items-center justify-between">
                  <h3 className="text-3xl font-bold text-slate-900 tracking-tight">Muro de Apreciación</h3>
                  <div className="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center">
                    <MessageSquare size={24} className="text-brand-600" />
                  </div>
                </div>
                
                {collabRecognitions.length > 0 ? (
                  <div className="space-y-8">
                    {collabRecognitions.map(r => (
                      <div key={r.id} className="bg-white p-10 rounded-[3rem] border border-slate-100 relative group hover:bg-white hover:shadow-2xl transition-all duration-500">
                        <div className="flex items-center justify-between mb-8">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-[1.5rem] bg-brand-50 flex items-center justify-center overflow-hidden shadow-sm">
                              <ValueIcon name={r.valueIcon} size={24} />
                            </div>
                            <div>
                              <p className="font-bold text-xl text-slate-900">{r.valueName}</p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{new Date(r.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>
                        <p className="text-slate-600 text-2xl leading-relaxed italic font-medium">"{r.story}"</p>
                        
{r.attachmentCount > 0 && (
  <div className="mt-6 flex items-center gap-3 text-sm text-slate-500">
    <Paperclip size={16} />
    <span>
      {r.attachmentCount} {r.attachmentCount === 1 ? 'archivo adjunto' : 'archivos adjuntos'}
    </span>
    {r.firstAttachmentType === 'image' && (
      <span className="text-[10px] px-2 py-1 rounded-lg bg-brand-50 text-brand-600 font-bold uppercase tracking-widest">
        Imagen
      </span>
    )}
  </div>
)}

                        

                        <div className="mt-10 pt-10 border-t border-slate-100 flex items-center gap-4">
                          <img src={r.fromAvatar} alt={r.fromName} className="w-10 h-10 rounded-xl" referrerPolicy="no-referrer" />
                          <span className="text-sm text-slate-500 font-medium">Reconocido por <span className="text-slate-900 font-bold">{r.fromName}</span></span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-24 text-slate-400">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8">
                      <Heart size={40} className="text-slate-200" />
                    </div>
                    <p className="text-xl italic">Aún no hay historias compartidas para {selectedCollab.name}.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};


type EvaluationsViewProps = {
  config: AppConfig;
  recognitions: Recognition[];
  setRecognitions: React.Dispatch<React.SetStateAction<Recognition[]>>;
  recognitionsLoading: boolean;
  refreshRecognitions: (force?: boolean) => Promise<void>;
};

const EvaluationsView = ({
  config,
  recognitions,
  setRecognitions,
  recognitionsLoading,
}: EvaluationsViewProps) => {
const [activeTab, setActiveTab] = useState<'pending' | 'validated' | 'discarded'>('pending');
const [selectedFile, setSelectedFile] = useState<string | null>(null);
const [selectedRecognition, setSelectedRecognition] = useState<Recognition | null>(null);
const [selectedRecognitionAttachments, setSelectedRecognitionAttachments] = useState<string[]>([]);
const [attachmentsLoading, setAttachmentsLoading] = useState(false);

  const allRecognitions = recognitions;
  const loading = recognitionsLoading;

  if (loading) {
    return (
      <div className="p-12 max-w-7xl mx-auto">
        <div className="bg-white rounded-[3rem] border border-slate-100 py-24 text-center text-slate-500">
          Cargando evaluaciones...
        </div>
      </div>
    );
  }



const handleSetScore = async (id: number, score: 1 | 0) => {
  const previous = allRecognitions;

  setRecognitions(prev =>
    prev.map(r => (r.id === id ? { ...r, score } : r))
  );

  try {
    const response = await fetch('/api/recognitions', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, score })
    });

    if (!response.ok) {
      throw new Error('Failed to set score');
    }
  } catch (error) {
    console.error('Error setting score:', error);
    setRecognitions(previous);
    alert('Error al guardar la calificación');
  }
};

  const openRecognitionDetail = async (recognition: Recognition) => {
  setSelectedRecognition(recognition);
  setSelectedRecognitionAttachments([]);

  if (!recognition.attachmentCount) return;

  try {
    setAttachmentsLoading(true);
    const res = await fetch(`/api/recognitions?id=${recognition.id}`);
    const data = await res.json();

    setSelectedRecognitionAttachments(
      Array.isArray(data.attachments) ? data.attachments : []
    );
  } catch (error) {
    console.error('Error loading recognition attachments:', error);
  } finally {
    setAttachmentsLoading(false);
  }
};


const filteredRecognitions = allRecognitions.filter(r => {
  if (activeTab === 'pending') return r.score === null;
  if (activeTab === 'validated') return r.score === 1;
  if (activeTab === 'discarded') return r.score === 0;
  return false;
});

const tabs = [
  { id: 'pending', label: 'Sin evaluar', count: allRecognitions.filter(r => r.score === null).length },
  { id: 'validated', label: 'Validadas', count: allRecognitions.filter(r => r.score === 1).length },
  { id: 'discarded', label: 'Descartadas', count: allRecognitions.filter(r => r.score === 0).length },
];

  return (
    <div className="p-12 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h2 className="text-4xl font-bold text-slate-900 tracking-tight mb-2">Evaluaciones de Impacto</h2>
          <p className="text-slate-500 text-lg">Valida o descarta los reconocimientos enviados por el equipo.</p>
        </div>
        <div className="bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
          <div className="w-3 h-3 bg-brand-600 rounded-full animate-pulse" />
          <span className="text-sm font-bold text-slate-600 uppercase tracking-widest">Periodo Activo</span>
        </div>
      </div>

      <div className="flex gap-4 mb-10">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "px-8 py-4 rounded-2xl font-bold text-sm transition-all flex items-center gap-3",
              activeTab === tab.id 
                ? "bg-brand-600 text-white shadow-lg shadow-brand-200" 
                : "bg-white text-slate-500 hover:bg-slate-50 border border-slate-100"
            )}
          >
            {tab.label}
            <span className={cn(
              "px-2 py-0.5 rounded-lg text-[10px]",
              activeTab === tab.id ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
            )}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      <div className="space-y-6">
      {filteredRecognitions.slice(0, 20).map(r => (
  <Card
    key={r.id}
    onClick={() => openRecognitionDetail(r)}
    className="p-8 hover:shadow-lg transition-all border border-slate-100 overflow-hidden relative cursor-pointer"
  >
        <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-1/3 space-y-4">
                <div className="flex items-center gap-4">
                  <img src={r.toAvatar} alt={r.toName} className="w-12 h-12 rounded-2xl bg-white" referrerPolicy="no-referrer" />
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Para</p>
                    <p className="font-bold text-slate-900">{r.toName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center overflow-hidden">
                    <ValueIcon name={r.valueIcon} size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Valor</p>
                    <p className="font-bold text-slate-900">{r.valueName}</p>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-100">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-3">¿Aplica este reconocimiento?</p>
                  <div className="flex gap-3">
<button
  onClick={(e) => {
    e.stopPropagation();
    handleSetScore(r.id, 1);
  }}
  className={cn(
                        "flex-1 py-3 rounded-xl flex items-center justify-center gap-2 transition-all font-bold text-sm",
                        r.score === 1 
                          ? "bg-emerald-100 text-emerald-600 border-2 border-emerald-200" 
                          : "bg-white text-slate-400 border-2 border-slate-100 hover:border-emerald-200 hover:text-emerald-500"
                      )}
                    >
                      <CheckCircle2 size={18} />
                      Aplica
                    </button>
<button
  onClick={(e) => {
    e.stopPropagation();
    handleSetScore(r.id, 0);
  }}
  className={cn(
                        "flex-1 py-3 rounded-xl flex items-center justify-center gap-2 transition-all font-bold text-sm",
                        r.score === 0 
                          ? "bg-rose-100 text-rose-600 border-2 border-rose-200" 
                          : "bg-white text-slate-400 border-2 border-slate-100 hover:border-rose-200 hover:text-rose-500"
                      )}
                    >
                      <X size={18} />
                      No aplica
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="lg:w-2/3 bg-white p-8 rounded-[2rem] relative border border-slate-50">
                <div className="absolute top-6 right-6 opacity-10">
                  <MessageSquare size={40} />
                </div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-4">Historia compartida por {r.fromName}</p>
                <p className="text-xl text-slate-700 leading-relaxed italic font-medium mb-6">"{r.story}"</p>
                
{r.attachmentCount > 0 && (
  <div className="mt-4 flex items-center gap-3 text-sm text-slate-500">
    <Paperclip size={16} />
    <span>
      {r.attachmentCount} {r.attachmentCount === 1 ? 'archivo adjunto' : 'archivos adjuntos'}
    </span>
    {r.firstAttachmentType === 'image' && (
      <span className="px-2 py-1 rounded-lg bg-brand-50 text-brand-600 text-[10px] font-bold uppercase tracking-widest">
        Imagen
      </span>
    )}
  </div>
)}
                

            
              </div>
            </div>
          </Card>
        ))}
        {filteredRecognitions.length === 0 && (
          <div className="text-center py-32 bg-white rounded-[3rem] border border-slate-100">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageSquare size={32} className="text-slate-200" />
            </div>
            <p className="text-slate-400 italic text-lg">No hay reconocimientos en la categoría "{tabs.find(t => t.id === activeTab)?.label}".</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedRecognition && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => {
              setSelectedRecognition(null);
              setSelectedRecognitionAttachments([]);
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl max-h-[90vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">Detalle de reconocimiento</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    {selectedRecognition.fromName} → {selectedRecognition.toName}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setSelectedRecognition(null);
                    setSelectedRecognitionAttachments([]);
                  }}
                  className="w-12 h-12 rounded-2xl bg-slate-100 hover:bg-slate-200 transition-all flex items-center justify-center"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 overflow-y-auto space-y-8">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                    Historia
                  </p>
                  <div className="bg-slate-50 rounded-[2rem] p-6 text-slate-700 text-lg leading-relaxed italic">
                    "{selectedRecognition.story}"
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                    Adjuntos
                  </p>

                  {attachmentsLoading ? (
                    <div className="text-slate-500">Cargando adjuntos...</div>
                  ) : selectedRecognitionAttachments.length === 0 ? (
                    <div className="text-slate-400">No hay adjuntos para esta historia.</div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {selectedRecognitionAttachments.map((att, i) => {
                        const isImage = String(att).startsWith('data:image');

                        return (
                          <div
                            key={i}
                            className="rounded-[2rem] border border-slate-100 overflow-hidden bg-white shadow-sm"
                          >
                            <div
                              className="aspect-square cursor-pointer"
                              onClick={() => {
                                if (isImage) setSelectedFile(att);
                              }}
                            >
                              {isImage ? (
                                <img
                                  src={att}
                                  alt={`Adjunto ${i + 1}`}
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-50">
                                  <Paperclip size={28} />
                                </div>
                              )}
                            </div>

                            <div className="p-4">
                              <button
                                onClick={() => {
                                  const link = document.createElement('a');
                                  link.href = att;
                                  link.download = isImage ? `adjunto-${i + 1}.png` : `adjunto-${i + 1}`;
                                  document.body.appendChild(link);
                                  link.click();
                                  document.body.removeChild(link);
                                }}
                                className="w-full px-4 py-3 rounded-2xl bg-brand-600 text-white text-sm font-bold hover:bg-brand-700 transition-all flex items-center justify-center gap-2"
                              >
                                <Download size={16} />
                                Descargar
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {selectedFile && (
          <FilePreviewModal file={selectedFile} onClose={() => setSelectedFile(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

const AdminView = ({ config, onUpdateConfig, currentUser }: { config: AppConfig, onUpdateConfig: (newConfig: Partial<AppConfig>) => void, currentUser: Collaborator }) => {
  const [activeTab, setActiveTab] = useState<'company' | 'campaign' | 'culture' | 'collaborators' | 'voting' | 'areas'>('company');
  const [companyForm, setCompanyForm] = useState(config.company);
  const [newValue, setNewValue] = useState({ name: '', icon: 'Sparkles', image: '' });
  const [editingValue, setEditingValue] = useState<Value | null>(null);
  const [newCollab, setNewCollab] = useState({ name: '', email: '', area: '', isAdmin: false });
  const [editingCollab, setEditingCollab] = useState<Collaborator | null>(null);
  const [newAreaName, setNewAreaName] = useState('');
  const [newPeriod, setNewPeriod] = useState({ name: '', startDate: '', endDate: '' });
  const [editingPeriod, setEditingPeriod] = useState<Period | null>(null);
  const [editingArea, setEditingArea] = useState<{ id: number, name: string } | null>(null);
  const [deletingCollabId, setDeletingCollabId] = useState<number | null>(null);
  const [topNominators, setTopNominators] = useState<{ id: number, name: string, avatar: string, count: number }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (activeTab === 'voting') {
      fetch('/api/stats/top-nominators')
        .then(res => res.json())
        .then(data => setTopNominators(data));
    }
  }, [activeTab]);

  const handleAddPeriod = async () => {
    if (!newPeriod.name || !newPeriod.startDate || !newPeriod.endDate) return;
    await fetch('/api/periods', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPeriod)
    });
    setNewPeriod({ name: '', startDate: '', endDate: '' });
    const res = await fetch('/api/config');
    const data = await res.json();
    onUpdateConfig(data);
  };

  const handleActivatePeriod = async (id: number) => {
    await fetch(`/api/periods/${id}/activate`, { method: 'PATCH' });
    const res = await fetch('/api/config');
    const data = await res.json();
    onUpdateConfig(data);
  };

  const handleUpdatePeriod = async () => {
    if (!editingPeriod) return;
    await fetch(`/api/periods/${editingPeriod.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingPeriod)
    });
    setEditingPeriod(null);
    const res = await fetch('/api/config');
    const data = await res.json();
    onUpdateConfig(data);
  };

  const handleDeletePeriod = async (id: number) => {
    await fetch(`/api/periods/${id}`, { method: 'DELETE' });
    const res = await fetch('/api/config');
    const data = await res.json();
    onUpdateConfig(data);
  };

  const toggleShowResults = async () => {
    const newShowResults = companyForm.showResults === 1 ? 0 : 1;
    setCompanyForm({ ...companyForm, showResults: newShowResults });
    await fetch('/api/company', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...companyForm, showResults: newShowResults })
    });
    onUpdateConfig({ company: { ...companyForm, showResults: newShowResults } });
  };

  const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const data = evt.target?.result;
      if (!data) return;
      const wb = XLSX.read(data, { type: 'array' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const jsonData = XLSX.utils.sheet_to_json(ws) as any[];

      const members = jsonData.map(item => ({
        name: item.Nombre || item.name || item.Name,
        email: item.Email || item.email || item.Correo,
        area: item.Area || item.area || item.Departamento || item.Department,
        isAdmin: item.Admin === 'Si' || item.admin === true || item.Admin === 1
      })).filter(m => m.name && m.email);

      if (members.length > 0) {
        await fetch('/api/collaborators/bulk', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ members })
        });
        const res = await fetch('/api/config');
        const configData = await res.json();
        onUpdateConfig(configData);
        alert(`Se han importado ${members.length} miembros exitosamente.`);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleSaveCompany = async () => {
    await fetch('/api/company', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(companyForm)
    });
    onUpdateConfig({ company: companyForm });
  };

  const handleAddValue = async () => {
    if (!newValue.name) return;
    await fetch('/api/values', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newValue)
    });
    setNewValue({ name: '', icon: 'Sparkles', image: '' });
    const res = await fetch('/api/config');
    const data = await res.json();
    onUpdateConfig(data);
  };

  const handleUpdateValue = async () => {
    if (!editingValue || !editingValue.name) return;
    await fetch(`/api/values/${editingValue.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingValue)
    });
    setEditingValue(null);
    const res = await fetch('/api/config');
    const data = await res.json();
    onUpdateConfig(data);
  };

  const handleDeleteValue = async (id: number) => {
    try {
      const response = await fetch(`/api/values/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete value');
      
      const res = await fetch('/api/config');
      const data = await res.json();
      onUpdateConfig(data);
    } catch (error) {
      console.error('Error deleting value:', error);
      alert('Error al eliminar el valor. Es posible que esté siendo utilizado.');
    }
  };

  const handleAddArea = async () => {
    if (!newAreaName.trim()) return;
    const response = await fetch('/api/areas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newAreaName.trim() })
    });
    if (response.ok) {
      setNewAreaName('');
      const res = await fetch('/api/config');
      const data = await res.json();
      onUpdateConfig(data);
    } else {
      const err = await response.json();
      alert(err.error);
    }
  };

  const handleDeleteArea = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar esta área?')) return;
    await fetch(`/api/areas/${id}`, { method: 'DELETE' });
    const res = await fetch('/api/config');
    const data = await res.json();
    onUpdateConfig(data);
  };

  const handleUpdateArea = async () => {
    if (!editingArea || !editingArea.name.trim()) return;
    const response = await fetch(`/api/areas/${editingArea.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: editingArea.name.trim() })
    });
    if (response.ok) {
      setEditingArea(null);
      const res = await fetch('/api/config');
      const data = await res.json();
      onUpdateConfig(data);
    } else {
      const err = await response.json();
      alert(err.error);
    }
  };

  const handleUpdateCollab = async () => {
    if (!editingCollab) return;
    await fetch(`/api/collaborators/${editingCollab.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: editingCollab.name,
        email: editingCollab.email,
        area: editingCollab.area,
        isAdmin: editingCollab.isAdmin === 1
      })
    });
    setEditingCollab(null);
    const res = await fetch('/api/config');
    const data = await res.json();
    onUpdateConfig(data);
  };

  const handleAddCollab = async () => {
    if (!newCollab.name || !newCollab.email) return;
    await fetch('/api/collaborators', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCollab)
    });
    setNewCollab({ name: '', email: '', area: '', isAdmin: false });
    const res = await fetch('/api/config');
    const data = await res.json();
    onUpdateConfig(data);
  };

  const handleDeleteCollab = async () => {
    if (deletingCollabId === null) return;
    await fetch(`/api/collaborators/${deletingCollabId}`, { method: 'DELETE' });
    setDeletingCollabId(null);
    const res = await fetch('/api/config');
    const data = await res.json();
    onUpdateConfig(data);
  };

  const toggleAdmin = async (id: number, current: number) => {
    await fetch(`/api/collaborators/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isAdmin: current === 1 ? 0 : 1 })
    });
    const res = await fetch('/api/config');
    const data = await res.json();
    onUpdateConfig(data);
  };

  const toggleVoting = async () => {
    const newState = companyForm.votingOpen === 1 ? 0 : 1;
    const updated = { ...companyForm, votingOpen: newState };
    setCompanyForm(updated);
    await fetch('/api/company', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    });
    onUpdateConfig({ company: updated });
  };

  return (
    <div className="p-12 max-w-6xl mx-auto overflow-y-auto custom-scrollbar h-full">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Configuración</h1>
        <p className="text-slate-500 text-lg mt-1">Gestiona la identidad, campaña y equipo de tu organización.</p>
      </div>

      <div className="flex gap-2 mb-10 bg-white p-1.5 rounded-[1.5rem] w-fit">
        {[
          { id: 'company', label: 'Empresa', icon: Building2 },
          { id: 'campaign', label: 'Campaña', icon: Calendar },
          { id: 'collaborators', label: 'Equipo', icon: Users },
          { id: 'areas', label: 'Áreas', icon: LayoutGrid },
          { id: 'voting', label: 'Votaciones', icon: Lock }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-300",
              activeTab === tab.id 
                ? "bg-white text-slate-900 shadow-sm" 
                : "text-slate-400 hover:text-slate-600"
            )}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'company' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Card className="p-10">
                  <h3 className="text-xl font-bold text-slate-900 mb-8">Información General</h3>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Nombre de la Empresa</label>
                        <input 
                          type="text" 
                          value={companyForm.name}
                          onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                          className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-white focus:bg-white focus:ring-4 focus:ring-brand-500/10 outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Eslogan</label>
                        <input 
                          type="text" 
                          value={companyForm.slogan}
                          onChange={(e) => setCompanyForm({ ...companyForm, slogan: e.target.value })}
                          className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-white focus:bg-white focus:ring-4 focus:ring-brand-500/10 outline-none transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Logo de la Empresa</label>
                      <div className="flex items-center gap-6">
                        <div className="w-24 h-24 rounded-3xl bg-white border border-slate-100 flex items-center justify-center overflow-hidden shadow-inner group relative">
                          {companyForm.logo ? (
                            <img src={companyForm.logo} alt="Logo" className="w-full h-full object-contain p-2" referrerPolicy="no-referrer" />
                          ) : (
                            <Building2 className="text-slate-200" size={32} />
                          )}
                          <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                            <Upload className="text-white" size={20} />
                            <input 
                              type="file" 
                              className="hidden" 
                              accept="image/*" 
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onload = (evt) => {
                                    setCompanyForm({ ...companyForm, logo: evt.target?.result as string });
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                          </label>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-slate-900 mb-1">Subir nuevo logo</p>
                          <p className="text-xs text-slate-400">Se recomienda formato PNG o SVG con fondo transparente.</p>
                        </div>
                      </div>
                    </div>
                    <div className="pt-4">
                      <Button onClick={handleSaveCompany} className="px-8">Guardar Cambios</Button>
                    </div>

                    {currentUser.email === 'kath@metodosft.com' && (
                      <div className="pt-8 border-t border-slate-100">
                        <div className="flex items-center justify-between p-6 bg-brand-50 rounded-[2rem] border border-brand-100">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-brand-600 rounded-2xl flex items-center justify-center text-white">
                              <Calendar size={24} />
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">Múltiples Campañas Activas</p>
                              <p className="text-xs text-slate-500">Permite que más de una campaña esté activa al mismo tiempo.</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => setCompanyForm({ ...companyForm, allowMultipleCampaigns: companyForm.allowMultipleCampaigns === 1 ? 0 : 1 })}
                            className={cn(
                              "w-14 h-8 rounded-full transition-all duration-300 relative",
                              companyForm.allowMultipleCampaigns === 1 ? "bg-brand-600" : "bg-slate-200"
                            )}
                          >
                            <div className={cn(
                              "absolute top-1 w-6 h-6 bg-white rounded-full transition-all duration-300 shadow-sm",
                              companyForm.allowMultipleCampaigns === 1 ? "left-7" : "left-1"
                            )} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              </div>
              <div className="space-y-6">
                <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl">
                  <h4 className="font-bold text-lg mb-4">Vista Previa</h4>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                      <Heart size={24} />
                    </div>
                    <div>
                      <p className="font-bold text-xl">{companyForm.name}</p>
                      <p className="text-slate-400 text-sm">{companyForm.slogan}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}


          {activeTab === 'collaborators' && (
            <div className="space-y-12">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-1">
                  <Card className="p-8 sticky top-0">
                    <h3 className="text-xl font-bold text-slate-900 mb-8">Nuevo Miembro</h3>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Nombre Completo</label>
                        <input 
                          type="text" 
                          placeholder="Ej: Juan Pérez" 
                          value={newCollab.name}
                          onChange={(e) => setNewCollab({ ...newCollab, name: e.target.value })}
                          className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-white focus:bg-white focus:ring-4 focus:ring-brand-500/10 outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Correo Electrónico</label>
                        <input 
                          type="email" 
                          placeholder="juan@empresa.com" 
                          value={newCollab.email}
                          onChange={(e) => setNewCollab({ ...newCollab, email: e.target.value })}
                          className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-white focus:bg-white focus:ring-4 focus:ring-brand-500/10 outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Área / Departamento</label>
                        <select 
                          value={newCollab.area}
                          onChange={(e) => setNewCollab({ ...newCollab, area: e.target.value })}
                          className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-white focus:bg-white focus:ring-4 focus:ring-brand-500/10 outline-none transition-all appearance-none"
                        >
                          <option value="">Seleccionar área...</option>
                          {config.areas.map(a => (
                            <option key={a.id} value={a.name}>{a.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100">
                        <input 
                          type="checkbox" 
                          id="isAdmin"
                          checked={newCollab.isAdmin}
                          onChange={(e) => setNewCollab({ ...newCollab, isAdmin: e.target.checked })}
                          className="w-5 h-5 rounded-lg text-brand-600 focus:ring-brand-500 border-slate-300"
                        />
                        <label htmlFor="isAdmin" className="text-sm font-bold text-slate-700 cursor-pointer">Permisos de Administrador</label>
                      </div>
                      <Button onClick={handleAddCollab} className="w-full py-4">
                        <UserPlus size={18} /> Crear Manualmente
                      </Button>
                      
                      <div className="pt-6 border-t border-slate-100">
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          onChange={handleExcelUpload} 
                          accept=".xlsx, .xls" 
                          className="hidden" 
                        />
                        <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="w-full">
                          <FileSpreadsheet size={18} /> Importar desde Excel
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>

                <div className="lg:col-span-2">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Equipo ({config.collaborators.filter(c => c.isMaster !== 1).length})</h3>
                  </div>
                  <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                      <thead className="bg-white text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">
                        <tr>
                          <th className="px-8 py-6">Colaborador</th>
                          <th className="px-8 py-6">Área</th>
                          <th className="px-8 py-6">Correo</th>
                          <th className="px-8 py-6">Rol</th>
                          <th className="px-8 py-6 text-right">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {config.collaborators.filter(c => c.isMaster !== 1).map(c => (
                          <tr key={c.id} className="hover:bg-brand-50/50 transition-colors group">
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-4">
                                <img src={c.avatar} alt={c.name} className="w-12 h-12 rounded-2xl bg-slate-100 group-hover:scale-110 transition-transform shadow-sm" referrerPolicy="no-referrer" />
                                <span className="font-bold text-slate-900">{c.name}</span>
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <span className="px-3 py-1 bg-brand-50 text-brand-600 text-[10px] font-bold uppercase tracking-widest rounded-lg">
                                {c.area || 'General'}
                              </span>
                            </td>
                            <td className="px-8 py-6 text-slate-500 text-sm font-medium">{c.email}</td>
                            <td className="px-8 py-6">
                              <button 
                                onClick={() => toggleAdmin(c.id, c.isAdmin)}
                                className={cn(
                                  "px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
                                  c.isAdmin === 1 ? "bg-brand-50 text-brand-600" : "bg-white text-slate-400 border border-slate-100"
                                )}
                              >
                                {c.isAdmin === 1 ? 'Admin' : 'Usuario'}
                              </button>
                            </td>
                            <td className="px-8 py-6 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button 
                                  onClick={() => setEditingCollab(c)}
                                  className="p-2 text-slate-300 hover:text-brand-600 transition-colors"
                                  title="Editar"
                                >
                                  <Edit2 size={18} />
                                </button>
                                <button 
                                  onClick={() => setDeletingCollabId(c.id)}
                                  className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                                  title="Eliminar"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'voting' && (
            <div className="space-y-8">
              <div className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-sm flex items-center justify-between">
                <div className="space-y-2">
                  <h3 className="text-3xl font-bold text-slate-900 tracking-tight">Estado de las Votaciones</h3>
                  <p className="text-slate-500 text-lg">Controla cuándo el equipo puede enviar nuevos reconocimientos.</p>
                </div>
                <button 
                  onClick={toggleVoting}
                  className={cn(
                    "relative w-24 h-12 rounded-full transition-all duration-500 flex items-center px-1.5 shadow-inner",
                    companyForm.votingOpen === 1 ? "bg-emerald-500" : "bg-slate-200"
                  )}
                >
                  <div className={cn(
                    "w-9 h-9 bg-white rounded-full shadow-xl transition-transform duration-500 flex items-center justify-center",
                    companyForm.votingOpen === 1 ? "translate-x-12" : "translate-x-0"
                  )}>
                    {companyForm.votingOpen === 1 ? <Unlock size={18} className="text-emerald-500" /> : <Lock size={18} className="text-slate-300" />}
                  </div>
                </button>
              </div>

              <div className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-sm flex items-center justify-between">
                <div className="space-y-2">
                  <h3 className="text-3xl font-bold text-slate-900 tracking-tight">Mostrar Resultados</h3>
                  <p className="text-slate-500 text-lg">Habilita la visualización de embajadores y rankings para todos los usuarios.</p>
                </div>
                <button 
                  onClick={toggleShowResults}
                  className={cn(
                    "relative w-24 h-12 rounded-full transition-all duration-500 flex items-center px-1.5 shadow-inner",
                    companyForm.showResults === 1 ? "bg-brand-500" : "bg-slate-200"
                  )}
                >
                  <div className={cn(
                    "w-9 h-9 bg-white rounded-full shadow-xl transition-transform duration-500 flex items-center justify-center",
                    companyForm.showResults === 1 ? "translate-x-12" : "translate-x-0"
                  )}>
                    {companyForm.showResults === 1 ? <CheckCircle2 size={18} className="text-brand-500" /> : <Lock size={18} className="text-slate-300" />}
                  </div>
                </button>
              </div>

              <div className="p-8 bg-brand-50 rounded-[2rem] border border-brand-100 flex gap-6">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                  <Bell className="text-brand-600" size={28} />
                </div>
                <div className="space-y-2">
                  <p className="font-bold text-xl text-brand-900">Información del Sistema</p>
                  <p className="text-brand-900/70 leading-relaxed">
                    {companyForm.votingOpen === 1 
                      ? "Las votaciones están actualmente ABIERTAS. Todos los colaboradores pueden nominar a sus compañeros y escribir historias."
                      : "Las votaciones están actualmente CERRADAS. Los colaboradores verán un mensaje informativo y solo podrán consultar el Dashboard de resultados."
                    }
                  </p>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'areas' && (
            <div className="space-y-12">
              <AnimatePresence>
                {editingArea && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm"
                  >
                    <Card className="w-full max-w-md p-10">
                      <div className="flex items-center justify-between mb-8">
                        <h3 className="text-2xl font-bold text-slate-900">Editar Área</h3>
                        <button onClick={() => setEditingArea(null)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                          <X size={24} />
                        </button>
                      </div>
                      
                      <div className="space-y-8">
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Nombre del Área</label>
                          <input 
                            type="text" 
                            value={editingArea.name}
                            onChange={(e) => setEditingArea({ ...editingArea, name: e.target.value })}
                            className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-white focus:bg-white focus:ring-4 focus:ring-brand-500/10 outline-none transition-all"
                            autoFocus
                          />
                        </div>
                        <div className="flex gap-4">
                          <Button onClick={() => setEditingArea(null)} variant="outline" className="flex-1 py-4">Cancelar</Button>
                          <Button onClick={handleUpdateArea} className="flex-1 py-4">Guardar Cambios</Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-1">
                  <Card className="p-8 sticky top-0">
                    <h3 className="text-xl font-bold text-slate-900 mb-8">Nueva Área</h3>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Nombre del Área</label>
                        <input 
                          type="text" 
                          placeholder="Ej: Marketing" 
                          value={newAreaName}
                          onChange={(e) => setNewAreaName(e.target.value)}
                          className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-white focus:bg-white focus:ring-4 focus:ring-brand-500/10 outline-none transition-all"
                        />
                      </div>
                      <Button onClick={handleAddArea} className="w-full py-4">
                        <Plus size={18} /> Crear Área
                      </Button>
                    </div>
                  </Card>
                </div>

                <div className="lg:col-span-2">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Áreas Registradas ({config.areas.length})</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {config.areas.map(area => (
                      <div key={area.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center text-brand-600">
                            <Sparkles size={18} />
                          </div>
                          <span className="font-bold text-slate-900">{area.name}</span>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => setEditingArea({ id: area.id, name: area.name })}
                            className="p-2 text-slate-300 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-all"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => handleDeleteArea(area.id)}
                            className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                    {config.areas.length === 0 && (
                      <div className="col-span-full py-12 text-center bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200 text-slate-400">
                        No hay áreas registradas aún.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'campaign' && (
            <div className="space-y-12">
              <AnimatePresence>
                {editingPeriod && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm"
                  >
                    <Card className="w-full max-w-2xl p-10 max-h-[90vh] overflow-y-auto">
                      <div className="flex items-center justify-between mb-8">
                        <h3 className="text-2xl font-bold text-slate-900">Editar Campaña</h3>
                        <button onClick={() => setEditingPeriod(null)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                          <X size={24} />
                        </button>
                      </div>
                      
                      <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Nombre</label>
                            <input 
                              type="text" 
                              value={editingPeriod.name}
                              onChange={(e) => setEditingPeriod({ ...editingPeriod, name: e.target.value })}
                              className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-white focus:bg-white focus:ring-4 focus:ring-brand-500/10 outline-none transition-all"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Inicio</label>
                              <input 
                                type="date" 
                                value={editingPeriod.startDate}
                                onChange={(e) => setEditingPeriod({ ...editingPeriod, startDate: e.target.value })}
                                className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-white focus:bg-white focus:ring-4 focus:ring-brand-500/10 outline-none transition-all"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Fin</label>
                              <input 
                                type="date" 
                                value={editingPeriod.endDate}
                                onChange={(e) => setEditingPeriod({ ...editingPeriod, endDate: e.target.value })}
                                className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-white focus:bg-white focus:ring-4 focus:ring-brand-500/10 outline-none transition-all"
                              />
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Vincular Pilares de Cultura</label>
                          <p className="text-sm text-slate-500 mb-6">Selecciona los pilares que estarán disponibles para evaluar en esta campaña.</p>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {config.values.map(v => {
                              const isLinked = editingPeriod.linkedValueIds?.includes(v.id);
                              return (
                                <button
                                  key={v.id}
                                  onClick={() => {
                                    const currentIds = editingPeriod.linkedValueIds || [];
                                    const newIds = isLinked 
                                      ? currentIds.filter(id => id !== v.id)
                                      : [...currentIds, v.id];
                                    setEditingPeriod({ ...editingPeriod, linkedValueIds: newIds });
                                  }}
                                  className={cn(
                                    "p-4 rounded-2xl border-2 transition-all flex items-center gap-3 text-left",
                                    isLinked 
                                      ? "border-brand-600 bg-brand-50" 
                                      : "border-slate-100 bg-white hover:border-slate-200"
                                  )}
                                >
                                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center shrink-0">
                                    <ValueIcon name={v.icon} size={20} />
                                  </div>
                                  <span className={cn("font-bold text-sm truncate", isLinked ? "text-brand-900" : "text-slate-600")}>
                                    {v.name}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Vincular Colaboradores Nominables</label>
                          <p className="text-sm text-slate-500 mb-6">Selecciona quiénes pueden ser nominados en esta campaña. Si no seleccionas ninguno, todos podrán ser nominados.</p>
                          <div className="max-h-[300px] overflow-y-auto pr-2 space-y-2">
                            {config.collaborators.filter(c => c.isMaster !== 1).map(c => {
                              const isLinked = editingPeriod.linkedCollaboratorIds?.includes(c.id);
                              return (
                                <button
                                  key={c.id}
                                  onClick={() => {
                                    const currentIds = editingPeriod.linkedCollaboratorIds || [];
                                    const newIds = isLinked 
                                      ? currentIds.filter(id => id !== c.id)
                                      : [...currentIds, c.id];
                                    setEditingPeriod({ ...editingPeriod, linkedCollaboratorIds: newIds });
                                  }}
                                  className={cn(
                                    "w-full p-4 rounded-2xl border-2 transition-all flex items-center gap-4 text-left",
                                    isLinked 
                                      ? "border-brand-600 bg-brand-50" 
                                      : "border-slate-100 bg-white hover:border-slate-200"
                                  )}
                                >
                                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold overflow-hidden shrink-0">
                                    {c.avatar ? <img src={c.avatar} alt={c.name} className="w-full h-full object-cover" /> : c.name[0]}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className={cn("font-bold text-sm truncate", isLinked ? "text-brand-900" : "text-slate-900")}>{c.name}</p>
                                    <p className="text-xs text-slate-500 truncate">{c.area || 'Sin área'}</p>
                                  </div>
                                  {isLinked && <CheckCircle2 size={18} className="text-brand-600" />}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                          <Button onClick={handleUpdatePeriod} className="flex-1 py-4">Guardar Cambios</Button>
                          <Button onClick={() => setEditingPeriod(null)} variant="outline" className="flex-1 py-4">Cancelar</Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-1">
                  <Card className="p-8 sticky top-0">
                    <h3 className="text-xl font-bold text-slate-900 mb-8">Nuevo Periodo</h3>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Nombre del Periodo</label>
                        <input 
                          type="text" 
                          placeholder="Ej: Q1 2024"
                          value={newPeriod.name}
                          onChange={(e) => setNewPeriod({ ...newPeriod, name: e.target.value })}
                          className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-white focus:bg-white focus:ring-4 focus:ring-brand-500/10 outline-none transition-all"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Inicio</label>
                          <input 
                            type="date" 
                            value={newPeriod.startDate}
                            onChange={(e) => setNewPeriod({ ...newPeriod, startDate: e.target.value })}
                            className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-white focus:bg-white focus:ring-4 focus:ring-brand-500/10 outline-none transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Fin</label>
                          <input 
                            type="date" 
                            value={newPeriod.endDate}
                            onChange={(e) => setNewPeriod({ ...newPeriod, endDate: e.target.value })}
                            className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-white focus:bg-white focus:ring-4 focus:ring-brand-500/10 outline-none transition-all"
                          />
                        </div>
                      </div>
                      <Button onClick={handleAddPeriod} className="w-full py-4">Crear Periodo</Button>
                    </div>
                  </Card>
                </div>
                <div className="lg:col-span-2 space-y-6">
                  {config.periods.map(p => (
                    <Card key={p.id} className={cn(
                      "p-8 border transition-all",
                      p.isActive === 1 ? "border-brand-500 bg-brand-50/30 shadow-lg" : "border-slate-100 hover:border-slate-200"
                    )}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                          <div className={cn(
                            "w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm",
                            p.isActive === 1 ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-400"
                          )}>
                            <Calendar size={28} />
                          </div>
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h4 className="text-xl font-bold text-slate-900">{p.name}</h4>
                              {p.isActive === 1 && <span className="px-3 py-1 bg-brand-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg">Activo</span>}
                            </div>
                            <p className="text-sm text-slate-500">{new Date(p.startDate).toLocaleDateString()} - {new Date(p.endDate).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <button 
                            onClick={() => setEditingPeriod(p)}
                            className="p-3 text-slate-300 hover:text-brand-600 transition-colors"
                          >
                            <Edit2 size={20} />
                          </button>
                          {p.isActive === 0 && (
                            <Button onClick={() => handleActivatePeriod(p.id)} variant="secondary">Activar</Button>
                          )}
                          <button 
                            onClick={() => handleDeletePeriod(p.id)}
                            className="p-3 text-slate-300 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                    </Card>
                  ))}
                  {config.periods.length === 0 && (
                    <div className="text-center py-24 bg-white rounded-[3rem] border border-slate-100">
                      <Calendar size={48} className="mx-auto text-slate-200 mb-4" />
                      <p className="text-slate-400 italic">No hay periodos configurados.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Integrated Culture Pillars Management */}
              <div className="pt-16 border-t border-slate-100">
                <div className="mb-10">
                  <h3 className="text-3xl font-bold text-slate-900 tracking-tight">Pilares de Cultura</h3>
                  <p className="text-slate-500 text-lg mt-1">Configura los valores, comportamientos y principios que se evaluarán en esta campaña.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                  <div className="lg:col-span-1">
                    <Card className="p-8 sticky top-0">
                      <h3 className="text-xl font-bold text-slate-900 mb-8">
                        {editingValue ? 'Editar Pilar' : 'Nuevo Pilar'}
                      </h3>
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Nombre</label>
                            <input 
                              type="text" 
                              placeholder="Ej: Innovación"
                              value={editingValue ? editingValue.name : newValue.name}
                              onChange={(e) => editingValue ? setEditingValue({ ...editingValue, name: e.target.value }) : setNewValue({ ...newValue, name: e.target.value })}
                              className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-white focus:bg-white focus:ring-4 focus:ring-brand-500/10 outline-none transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Icono</label>
                            <select 
                              value={editingValue ? editingValue.icon : newValue.icon}
                              onChange={(e) => editingValue ? setEditingValue({ ...editingValue, icon: e.target.value }) : setNewValue({ ...newValue, icon: e.target.value })}
                              className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-white focus:bg-white focus:ring-4 focus:ring-brand-500/10 outline-none transition-all appearance-none"
                            >
                              {Object.keys(VALUE_ICONS).map(iconName => (
                                <option key={iconName} value={iconName}>{iconName}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Imagen del Pilar</label>
                          <div className="space-y-4">
                            <div className="flex items-center gap-4">
                              <div className="flex-1">
                                <input 
                                  type="text" 
                                  placeholder="URL de la imagen..."
                                  value={editingValue ? editingValue.image || '' : newValue.image || ''}
                                  onChange={(e) => editingValue ? setEditingValue({ ...editingValue, image: e.target.value }) : setNewValue({ ...newValue, image: e.target.value })}
                                  className="w-full px-5 py-3 rounded-xl border border-slate-100 bg-white focus:bg-white focus:ring-4 focus:ring-brand-500/10 outline-none transition-all text-xs"
                                />
                              </div>
                              <label className="shrink-0">
                                <div className="p-3 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 cursor-pointer transition-colors shadow-sm">
                                  <Upload size={18} />
                                </div>
                                <input 
                                  type="file" 
                                  className="hidden" 
                                  accept="image/*" 
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const reader = new FileReader();
                                      reader.onload = (evt) => {
                                        const base64 = evt.target?.result as string;
                                        if (editingValue) {
                                          setEditingValue({ ...editingValue, image: base64 });
                                        } else {
                                          setNewValue({ ...newValue, image: base64 });
                                        }
                                      };
                                      reader.readAsDataURL(file);
                                    }
                                  }}
                                />
                              </label>
                            </div>
                            
                            <div className="h-40 rounded-2xl bg-slate-50 border border-dashed border-slate-200 flex items-center justify-center overflow-hidden group relative">
                              {(editingValue?.image || newValue.image) ? (
                                <img 
                                  src={editingValue?.image || newValue.image || ''} 
                                  alt="Preview" 
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                />
                              ) : (
                                <div className="text-center">
                                  <ImageIcon className="mx-auto text-slate-300 mb-2" size={24} />
                                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Vista Previa</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-3 pt-4">
                          {editingValue ? (
                            <>
                              <Button onClick={handleUpdateValue} className="flex-1">Guardar</Button>
                              <Button onClick={() => setEditingValue(null)} variant="outline">Cancelar</Button>
                            </>
                          ) : (
                            <Button onClick={handleAddValue} className="w-full"><Plus size={18} /> Añadir Pilar</Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  </div>

                  <div className="lg:col-span-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {config.values.map(v => (
                        <div key={v.id} className="premium-card p-0 overflow-hidden group relative">
                          <div className="h-48 relative">
                            <img 
                              src={v.image || `https://picsum.photos/seed/${v.name}/800/400`} 
                              alt={v.name} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-slate-900/60 transition-colors" />
                            <div className="absolute inset-0 flex items-center justify-center drop-shadow-2xl group-hover:scale-110 transition-transform duration-500">
                              <ValueIcon name={v.icon} size={64} className="text-white" />
                            </div>
                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                              <button 
                                onClick={() => setEditingValue(v)}
                                className="p-2 bg-white/20 backdrop-blur-md rounded-xl text-white hover:bg-white/40 transition-colors"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button 
                                onClick={() => handleDeleteValue(v.id)}
                                className="p-2 bg-red-500/20 backdrop-blur-md rounded-xl text-white hover:bg-red-500/40 transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                          <div className="p-8">
                            <h4 className="font-bold text-2xl text-slate-900 mb-2 tracking-tight">{v.name}</h4>
                            <div className="flex items-center gap-2 text-slate-400">
                              <CheckCircle2 size={14} className="text-emerald-500" />
                              <span className="text-xs font-bold uppercase tracking-widest">Activo</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingCollabId !== null && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeletingCollabId(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden p-10 text-center"
            >
              <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Trash2 className="text-red-500" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">¿Eliminar colaborador?</h3>
              <p className="text-slate-500 mb-8">
                Esta acción es permanente y eliminará todo el historial de este colaborador. ¿Deseas continuar?
              </p>
              <div className="flex gap-4">
                <Button onClick={() => setDeletingCollabId(null)} variant="outline" className="flex-1 py-4">Cancelar</Button>
                <Button onClick={handleDeleteCollab} variant="danger" className="flex-1 py-4 bg-red-500 hover:bg-red-600">Eliminar</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Collaborator Modal */}
      <AnimatePresence>
        {editingCollab && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingCollab(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl bg-white rounded-[3rem] shadow-2xl overflow-hidden"
            >
              <div className="p-10">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-bold text-slate-900">Editar Colaborador</h3>
                  <button onClick={() => setEditingCollab(null)} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                    <X size={24} className="text-slate-400" />
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Nombre Completo</label>
                    <input 
                      type="text" 
                      value={editingCollab.name}
                      onChange={(e) => setEditingCollab({ ...editingCollab, name: e.target.value })}
                      className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-white focus:bg-white focus:ring-4 focus:ring-brand-500/10 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Correo Electrónico</label>
                    <input 
                      type="email" 
                      value={editingCollab.email}
                      onChange={(e) => setEditingCollab({ ...editingCollab, email: e.target.value })}
                      className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-white focus:bg-white focus:ring-4 focus:ring-brand-500/10 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Área / Departamento</label>
                    <select 
                      value={editingCollab.area || ''}
                      onChange={(e) => setEditingCollab({ ...editingCollab, area: e.target.value })}
                      className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-white focus:bg-white focus:ring-4 focus:ring-brand-500/10 outline-none transition-all appearance-none"
                    >
                      <option value="">Seleccionar área...</option>
                      {config.areas.map(a => (
                        <option key={a.id} value={a.name}>{a.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100">
                    <input 
                      type="checkbox" 
                      id="editIsAdmin"
                      checked={editingCollab.isAdmin === 1}
                      onChange={(e) => setEditingCollab({ ...editingCollab, isAdmin: e.target.checked ? 1 : 0 })}
                      className="w-5 h-5 rounded-lg text-brand-600 focus:ring-brand-500 border-slate-300"
                    />
                    <label htmlFor="editIsAdmin" className="text-sm font-bold text-slate-700 cursor-pointer">Permisos de Administrador</label>
                  </div>
                  
                  <div className="flex gap-4 pt-4">
                    <Button onClick={() => setEditingCollab(null)} variant="outline" className="flex-1 py-4">Cancelar</Button>
                    <Button onClick={handleUpdateCollab} className="flex-1 py-4">Guardar Cambios</Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [user, setUser] = useState<Collaborator | null>(null);
  const [view, setView] = useState<'recognize' | 'dashboard' | 'admin' | 'evaluations'>('recognize');
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [loading, setLoading] = useState(true);

  const [recognitions, setRecognitions] = useState<Recognition[]>([]);
  const [recognitionsLoading, setRecognitionsLoading] = useState(false);
  const [recognitionsLoaded, setRecognitionsLoaded] = useState(false);

  const normalizeScore = (score: any): number | null => {
    if (score === 1 || score === '1') return 1;
    if (score === 0 || score === '0') return 0;
    if (score === -1 || score === '-1') return 0;
    if (score === '' || score === undefined || score === null) return null;
    return null;
  };

  const normalizeRecognition = (recognition: any) => ({
    ...recognition,
    score: normalizeScore(recognition.score)
  });

  const refreshRecognitions = async (force = false) => {
    if (recognitionsLoading) return;
    if (recognitionsLoaded && !force) return;

    try {
      setRecognitionsLoading(true);
      const res = await fetch('/api/recognitions');
      const data = await res.json();

      const normalizedData = Array.isArray(data)
        ? data.map(normalizeRecognition)
        : [];

      setRecognitions(normalizedData);
      setRecognitionsLoaded(true);
    } catch (error) {
      console.error('Error fetching recognitions:', error);
    } finally {
      setRecognitionsLoading(false);
    }
  };

  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        setConfig(data);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (view === 'evaluations' || view === 'dashboard') {
      refreshRecognitions();
    }
  }, [view]);

  const handleLogin = (email: string) => {
    if (!config) return;
    const found = config.collaborators.find(c => c.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setUser(found);
      if (found.isAdmin === 1) setView('admin');
      else setView('recognize');
    } else {
      alert('Usuario no encontrado en la base de datos corporativa.');
    }
  };


const handleNominate = async (toId: number, valueId: number, story: string, attachments: string[]) => {
  if (!user) return false;

  try {
    const response = await fetch('/api/recognitions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fromId: user.id, toId, valueId, story, attachments })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'No se pudo crear el reconocimiento');
    }

    await refreshRecognitions(true);
    return true;
  } catch (error) {
    console.error('Error creating recognition:', error);
    return false;
  }
};

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-white">Cargando...</div>;
  if (!user) return <LandingView config={config} onLogin={handleLogin} />;

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    
    const reader = new FileReader();
    reader.onload = async (evt) => {
      const avatar = evt.target?.result as string;
      await fetch(`/api/collaborators/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatar })
      });
      setUser({ ...user, avatar });
      // Refresh config to update avatar everywhere
      const res = await fetch('/api/config');
      const data = await res.json();
      setConfig(data);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <aside className="w-72 p-8 flex flex-col fixed h-full z-40">
        <div className="flex items-center gap-3 mb-12 px-2">
          {config?.company.logo ? (
            <img src={config.company.logo} alt={config.company.name} className="h-10 object-contain" referrerPolicy="no-referrer" />
          ) : (
            <>
              <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg">
                <Heart className="text-white" size={20} />
              </div>
              <span className="font-bold text-2xl tracking-tight text-slate-900">Reconocimiento</span>
            </>
          )}
        </div>

        <nav className="space-y-3 flex-1">
          <SidebarItem 
            icon={LayoutDashboard} 
            label="Inicio" 
            active={view === 'dashboard'} 
            onClick={() => setView('dashboard')} 
          />
          <SidebarItem 
            icon={Heart} 
            label="Reconocer" 
            active={view === 'recognize'} 
            onClick={() => setView('recognize')} 
          />
          {user.isAdmin === 1 && (
            <>
              <SidebarItem 
                icon={CheckCircle2} 
                label="Evaluaciones" 
                active={view === 'evaluations'} 
                onClick={() => setView('evaluations')} 
              />
              <SidebarItem 
                icon={Settings} 
                label="Configuración" 
                active={view === 'admin'} 
                onClick={() => setView('admin')} 
              />
            </>
          )}
        </nav>

        <div className="mt-auto space-y-6">
          <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm relative overflow-hidden group">
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-brand-50 rounded-full blur-2xl group-hover:bg-brand-100 transition-colors" />
            <div className="relative z-10 flex flex-col items-center">
              <div className="relative group/avatar cursor-pointer mb-3">
                <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-100" referrerPolicy="no-referrer" />
                <label className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                  <Camera className="text-white" size={20} />
                  <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                </label>
              </div>
              <p className="font-bold text-sm text-slate-900 text-center">{user.name}</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Mi Perfil</p>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100">
            <button 
              onClick={() => setUser(null)}
              className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-slate-900 transition-colors w-full font-semibold text-[15px]"
            >
              <LogOut size={20} />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72 min-h-screen flex flex-col">
        <div className="flex-1">
<AnimatePresence mode="wait">
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3 }}
    className="h-full"
  >
    {view === 'recognize' && config && <RecognizeView config={config} currentUser={user} onNominate={handleNominate} />}
    {view === 'dashboard' && config && (
      <DashboardView
        config={config}
        currentUser={user}
        recognitions={recognitions}
        refreshRecognitions={refreshRecognitions}
      />
    )}
    {view === 'evaluations' && config && (
      <EvaluationsView
        config={config}
        recognitions={recognitions}
        setRecognitions={setRecognitions}
        recognitionsLoading={recognitionsLoading}
        refreshRecognitions={refreshRecognitions}
      />
    )}
    {view === 'admin' && config && user && <AdminView config={config} onUpdateConfig={(newC) => setConfig({ ...config, ...newC })} currentUser={user} />}
  </motion.div>
</AnimatePresence>
        </div>
        <Footer />
      </main>
    </div>
  );
}
