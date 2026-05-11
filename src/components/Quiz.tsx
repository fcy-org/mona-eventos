import { useState, useEffect, type ReactNode } from "react";
import {
  ArrowLeft, ArrowRight, Check, X, MessageCircle, MapPin,
  Sparkles, Utensils, Monitor, BedDouble, Building2, Heart,
  GraduationCap, Mic2, Cake, Star, Users,
} from "lucide-react";
import { z } from "zod";

import mockupAuditorio from "@/assets/mockup-auditorio.jpeg";
import mockupEscolar    from "@/assets/mockup-escolar.jpeg";
import mockupFormatoU   from "@/assets/mockup-formato-u.jpeg";
import mockupBanquete   from "@/assets/mockup-banquete-grande.jpeg";
import mockupStands     from "@/assets/mockup-stands.jpeg";
import mockupEspinha    from "@/assets/mockup-espinha.jpeg";

/* ─── meta pixel ─────────────────────────────────────────────────────────────── */

declare global {
  interface Window { fbq?: (...args: unknown[]) => void; }
}

function trackMeta(event: string, params?: Record<string, unknown>) {
  window.fbq?.("trackCustom", event, params);
}

/* ─── constants ─────────────────────────────────────────────────────────────── */

const SHEETS_URL =
  (import.meta.env.VITE_SHEETS_URL as string | undefined) ??
  "https://script.google.com/macros/s/AKfycbwF1ieY6H5AnsiEaNPPnBiG4BXegarNFZiJQKgv8i3UnbHnZDTKVtrhrG4jDoDxpmyOXA/exec";

const WA_NUMBER = "5586922221001";
const TOTAL_STEPS = 6;

const OCCASIONS = [
  { id: "Casamento",   label: "Casamento & Social",  desc: "Cerimônias e celebrações",       Icon: Heart         },
  { id: "Corporativo", label: "Evento Corporativo",  desc: "Convenções e palestras",          Icon: Building2     },
  { id: "Formatura",   label: "Formatura",            desc: "Colações de grau",                Icon: GraduationCap },
  { id: "Reunião",     label: "Reunião & Palestra",   desc: "Workshops e treinamentos",        Icon: Mic2          },
  { id: "Aniversário", label: "Aniversário",          desc: "Festas e celebrações especiais",  Icon: Cake          },
  { id: "Outro",       label: "Outro evento",         desc: "Showrooms, rodadas e mais",       Icon: Star          },
];

const EVENT_TYPES = [
  "Palestra","Reunião","Rodada de Negócios","Seminário","Showroom",
  "Treinamento","Mesa redonda","Convenção","Confraternização",
  "Casamento","Café de Negócios","Aniversário","Formatura","Outro",
];

const ROOM_CONFIGS = [
  { id: "Auditório",        label: "Auditório",         desc: "Cadeiras em fileiras voltadas ao palco", cap: "até 120 pax", img: mockupAuditorio },
  { id: "Escolar",          label: "Escolar",           desc: "Mesas com cadeiras em fileiras",         cap: "até 80 pax",  img: mockupEscolar   },
  { id: "U",                label: 'Formato "U"',       desc: "Mesas em U para debate e interação",     cap: "até 40 pax",  img: mockupFormatoU  },
  { id: "Banquete",         label: "Banquete",          desc: "Mesas redondas com serviço completo",    cap: "até 150 pax", img: mockupBanquete  },
  { id: "Coquetel",         label: "Coquetel & Stands", desc: "Espaço aberto com expositores",          cap: "até 200 pax", img: mockupStands    },
  { id: "Espinha de Peixe", label: "Espinha de Peixe",  desc: "Mesas inclinadas, melhor visibilidade",  cap: "até 60 pax",  img: mockupEspinha   },
];

const EQUIPMENT = [
  { id: "Sistema de Som",      e: "🔊", label: "Som"        },
  { id: "Projetor Multimídia", e: "📽️", label: "Projetor"   },
  { id: "Tela de Projeção",    e: "🖼️", label: "Tela"       },
  { id: "TV",                  e: "📺", label: "TV"         },
  { id: "Flip Chart",          e: "📋", label: "Flip Chart" },
  { id: "Porta Banner",        e: "🏳️", label: "Banner"     },
  { id: "Notebook",            e: "💻", label: "Notebook"   },
  { id: "Passador de Slide",   e: "🖱️", label: "Passador"   },
  { id: "Internet",            e: "🌐", label: "Wi-Fi"      },
  { id: "Operador Tecnico",    e: "👨‍💻", label: "Operador"   },
];

const FOOD_BEV = [
  { id: "Café da Manhã", e: "☕", label: "Café da Manhã" },
  { id: "Coffee-break",  e: "🥐", label: "Coffee Break"  },
  { id: "Almoço",        e: "🍽️", label: "Almoço"        },
  { id: "Coquetel",      e: "🥂", label: "Coquetel"      },
  { id: "Jantar",        e: "🍷", label: "Jantar"        },
];

const BR_STATES = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA",
  "MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN",
  "RS","RO","RR","SC","SP","SE","TO",
];

const DURATIONS = ["1 dia","2 dias","3 dias","4 dias","5 dias","6 dias","7 dias"];

const STEP_LABELS = ["Ocasião","Evento","Espaço","Infraestrutura","Hospedagem","Seus Dados"];

type RoomKey = "qtdPremiumTwin" | "qtdPremiumCasalPCD" | "qtdPremiumCasal" | "qtdSuitePrivilege" | "qtdSuitePresidencial";

const ROOM_TYPES: Array<{ id: string; label: string; desc: string; key: RoomKey }> = [
  { id: "premiumTwin",       label: "Premium Twin",       desc: "38m² · 2 camas solteiro · até 2 pessoas",                  key: "qtdPremiumTwin"       },
  { id: "premiumCasalPCD",   label: "Premium Casal PCD",  desc: "38m² · cama King · acessível para cadeirante",             key: "qtdPremiumCasalPCD"   },
  { id: "premiumCasal",      label: "Premium Casal",      desc: "38m² · cama King · até 2 pessoas",                         key: "qtdPremiumCasal"      },
  { id: "suitePrivilege",    label: "Suíte Privilege",    desc: "77m² · quarto + sala · cama King · banheira hidromassagem", key: "qtdSuitePrivilege"    },
  { id: "suitePresidencial", label: "Suíte Presidencial", desc: "160m² · 4 ambientes · King + 2 solteiros · até 4 pessoas", key: "qtdSuitePresidencial" },
];

/* ─── types ─────────────────────────────────────────────────────────────────── */

type Answers = {
  occasion?: string;
  eventType?: string;
  pax?: string;
  eventDate?: string;
  noDateYet?: boolean;
  duration?: string;
  roomConfig?: string;
  equipment?: string[];
  foodBev?: string[];
  needsAccommodation?: boolean;
  qtdPremiumTwin?: string;
  qtdPremiumCasalPCD?: string;
  qtdPremiumCasal?: string;
  qtdSuitePrivilege?: string;
  qtdSuitePresidencial?: string;
  checkin?: string;
  checkout?: string;
  nome?: string;
  cpfCnpj?: string;
  email?: string;
  whatsapp?: string;
  phone?: string;
  state?: string;
  city?: string;
};

/* ─── utilities ─────────────────────────────────────────────────────────────── */

function getUtms() {
  const p = new URLSearchParams(window.location.search);
  return {
    utm_source:   p.get("utm_source")   ?? "",
    utm_medium:   p.get("utm_medium")   ?? "",
    utm_campaign: p.get("utm_campaign") ?? "",
    utm_term:     p.get("utm_term")     ?? "",
    utm_content:  p.get("utm_content")  ?? "",
  };
}

function maskPhone(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (!d) return "";
  if (d.length <= 2)  return `(${d}`;
  if (d.length <= 6)  return `(${d.slice(0,2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0,2)}) ${d.slice(2,6)}-${d.slice(6)}`;
  return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`;
}

function maskCpfCnpj(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 14);
  if (d.length <= 11) {
    if (d.length <= 3) return d;
    if (d.length <= 6) return `${d.slice(0,3)}.${d.slice(3)}`;
    if (d.length <= 9) return `${d.slice(0,3)}.${d.slice(3,6)}.${d.slice(6)}`;
    return `${d.slice(0,3)}.${d.slice(3,6)}.${d.slice(6,9)}-${d.slice(9)}`;
  }
  if (d.length <= 2)  return d;
  if (d.length <= 5)  return `${d.slice(0,2)}.${d.slice(2)}`;
  if (d.length <= 8)  return `${d.slice(0,2)}.${d.slice(2,5)}.${d.slice(5)}`;
  if (d.length <= 12) return `${d.slice(0,2)}.${d.slice(2,5)}.${d.slice(5,8)}/${d.slice(8)}`;
  return `${d.slice(0,2)}.${d.slice(2,5)}.${d.slice(5,8)}/${d.slice(8,12)}-${d.slice(12)}`;
}

function maskEmail(v: string) { return v.replace(/[^a-zA-Z0-9@._%+\-]/g, ""); }

function formatAccommodation(a: Answers): string {
  const rooms = [
    Number(a.qtdPremiumTwin)       > 0 && `${a.qtdPremiumTwin}× Premium Twin`,
    Number(a.qtdPremiumCasalPCD)   > 0 && `${a.qtdPremiumCasalPCD}× Premium Casal PCD`,
    Number(a.qtdPremiumCasal)      > 0 && `${a.qtdPremiumCasal}× Premium Casal`,
    Number(a.qtdSuitePrivilege)    > 0 && `${a.qtdSuitePrivilege}× Suíte Privilege`,
    Number(a.qtdSuitePresidencial) > 0 && `${a.qtdSuitePresidencial}× Suíte Presidencial`,
  ].filter(Boolean);
  const roomStr = rooms.length ? rooms.join(", ") : "Quartos a definir";
  return `${roomStr} (check-in: ${a.checkin ?? "—"} / check-out: ${a.checkout ?? "—"})`;
}

async function sendLead(a: Answers) {
  const payload = {
    nome:        a.nome        ?? "",
    cpf_cnpj:    a.cpfCnpj    ?? "",
    email:       a.email       ?? "",
    whatsapp:    a.whatsapp    ?? "",
    telefone:    a.phone       ?? "",
    estado:      a.state       ?? "",
    cidade:      a.city        ?? "",
    tipo_evento: a.eventType   ?? a.occasion ?? "",
    pax:         a.pax         ?? "",
    data_evento: a.eventDate   ?? "",
    duracao:     a.duration    ?? "",
    montagem:    a.roomConfig  ?? "",
    equipamentos:(a.equipment  ?? []).join(", "),
    alimentacao: (a.foodBev    ?? []).join(", "),
    hospedagem:  a.needsAccommodation ? formatAccommodation(a) : "Não",
    ...getUtms(),
  };
  try {
    await fetch(SHEETS_URL, { method: "POST", body: JSON.stringify(payload), mode: "no-cors" });
  } catch { /* silent */ }
}

function buildWaMessage(a: Answers) {
  const name  = a.nome ?? "";
  const equip = a.equipment?.length ? `\n• Equipamentos: ${a.equipment.join(", ")}` : "";
  const food  = a.foodBev?.length   ? `\n• Alimentação: ${a.foodBev.join(", ")}`    : "";
  const hotel = a.needsAccommodation
    ? `\n• Hospedagem: ${formatAccommodation(a)}`
    : "";

  return `Olá! Sou ${name}, acabei de preencher o formulário no site do Monã e gostaria de agendar uma visita guiada.

📋 *Resumo do meu evento:*
• Tipo: ${a.eventType ?? a.occasion ?? "—"}
• Configuração: ${a.roomConfig ?? "—"}
• Participantes: ${a.pax ?? "—"} pessoas
• Data prevista: ${a.eventDate ?? "a definir"}
• Duração: ${a.duration ?? "—"}${equip}${food}${hotel}

📍 *Gostaria de agendar uma visita guiada ao espaço.*

*Meus dados:*
• CPF/CNPJ: ${a.cpfCnpj ?? "—"}
• E-mail: ${a.email ?? "—"}
• Cidade/Estado: ${a.city ?? "—"} / ${a.state ?? "—"}`;
}

/* ─── step validation ────────────────────────────────────────────────────────── */

function validateStep(step: number, a: Answers): Record<string, string> {
  const e: Record<string, string> = {};
  if (step === 0) {
    if (!a.occasion) e.occasion = "Selecione uma ocasião para continuar";
  }
  if (step === 1) {
    if (!a.eventType)             e.eventType  = "Selecione o tipo de evento";
    if (!a.pax)                   e.pax        = "Informe o número de participantes";
    if (!a.noDateYet && !a.eventDate) e.eventDate = "Informe a data ou marque 'Sem data prevista'";
    if (!a.duration)              e.duration   = "Selecione a duração";
  }
  if (step === 2) {
    if (!a.roomConfig) e.roomConfig = "Selecione uma configuração de espaço";
  }
  if (step === 4) {
    if (a.needsAccommodation === undefined) e.needsAccommodation = "Selecione uma opção de hospedagem";
    if (a.needsAccommodation === true) {
      if (!a.checkin)  e.checkin  = "Informe a data de check-in";
      if (!a.checkout) e.checkout = "Informe a data de check-out";
    }
  }
  return e;
}

const contactSchema = z.object({
  nome:     z.string().trim().min(4, "Informe nome e sobrenome"),
  cpfCnpj:  z.string().trim().min(11, "CPF/CNPJ inválido"),
  email:    z.string().trim().email("E-mail inválido"),
  whatsapp: z.string().trim().min(10, "WhatsApp inválido"),
  state:    z.string().min(2, "Selecione o estado"),
  city:     z.string().trim().min(2, "Informe a cidade"),
});

/* ─── main component ─────────────────────────────────────────────────────────── */

export function Quiz({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step,      setStep]      = useState(0);
  const [dir,       setDir]       = useState<"fwd"|"bck">("fwd");
  const [answers,   setAnswers]   = useState<Answers>({});
  const [errors,    setErrors]    = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [sending,   setSending]   = useState(false);

  useEffect(() => {
    if (!open) return;
    trackMeta(`etapa_${step + 1}`, { etapa: step + 1, nome_etapa: STEP_LABELS[step] });
  }, [open, step]);

  if (!open) return null;

  const progress = submitted ? 100 : (step / TOTAL_STEPS) * 100;

  const close = () => {
    onClose();
    setTimeout(() => { setStep(0); setDir("fwd"); setAnswers({}); setErrors({}); setSubmitted(false); }, 300);
  };

  const advanceStep = () => { setDir("fwd"); setStep(s => Math.min(s + 1, TOTAL_STEPS - 1)); };
  const back = () => { setErrors({}); setDir("bck"); setStep(s => Math.max(s - 1, 0)); };

  const set = (key: keyof Answers, value: Answers[keyof Answers]) =>
    setAnswers(prev => ({ ...prev, [key]: value }));

  const toggle = (key: "equipment" | "foodBev", value: string) =>
    setAnswers(prev => {
      const arr = (prev[key] ?? []) as string[];
      return { ...prev, [key]: arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value] };
    });

  const goNext = () => {
    const errs = validateStep(step, answers);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    advanceStep();
  };

  const submit = async () => {
    const parsed = contactSchema.safeParse({
      nome:     answers.nome      ?? "",
      cpfCnpj:  answers.cpfCnpj  ?? "",
      email:    answers.email     ?? "",
      whatsapp: answers.whatsapp  ?? "",
      state:    answers.state     ?? "",
      city:     answers.city      ?? "",
    });
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach(i => { errs[String(i.path[0])] = i.message; });
      setErrors(errs);
      return;
    }
    setErrors({});
    setSending(true);
    await sendLead(answers);
    setSending(false);
    setSubmitted(true);
    window.fbq?.("track", "Lead", { content_name: "Quiz Agendamento Visita Monã", content_category: answers.occasion ?? "" });
    trackMeta("quiz_concluido", { occasion: answers.occasion, event_type: answers.eventType, pax: answers.pax });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 backdrop-blur-sm bg-black/55">
      <div className="quiz-modal relative flex max-h-[94vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl shadow-2xl">
        <div className="quiz-aurora" />

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between border-b border-white/8 px-6 py-4">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-[var(--gold)]/70">
            <Sparkles className="h-3.5 w-3.5 text-[var(--gold)]" />
            Agende sua visita
          </div>
          <button onClick={close} aria-label="Fechar" className="rounded-full p-1.5 text-white/35 transition hover:bg-white/10 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Progress */}
        {!submitted && (
          <div className="relative z-10 px-6 pt-5 pb-3">
            <div className="flex items-start justify-between mb-3">
              {STEP_LABELS.map((label, i) => (
                <div key={label} className="flex flex-col items-center gap-1 flex-1">
                  <div className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold transition-all duration-400 ${
                    i < step   ? "bg-[var(--gold)] text-[oklch(0.13_0.022_155)]" :
                    i === step ? "border border-[var(--gold)] text-[var(--gold)] bg-[var(--gold)]/10" :
                                 "border border-white/10 text-white/20 bg-white/3"
                  }`}>
                    {i < step ? <Check className="h-3 w-3" /> : i + 1}
                  </div>
                  <span className={`hidden sm:block text-[9px] uppercase tracking-wider text-center leading-tight transition-colors ${
                    i === step ? "text-[var(--gold)]" : i < step ? "text-white/50" : "text-white/15"
                  }`}>{label}</span>
                </div>
              ))}
            </div>
            <div className="h-0.5 w-full rounded-full bg-white/8">
              <div className="quiz-progress-bar h-full rounded-full transition-[width] duration-700" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {/* Content */}
        <div className="relative z-10 flex-1 overflow-y-auto px-6 py-6 sm:px-10">
          {!submitted && (
            <div key={step} className={dir === "fwd" ? "quiz-step-forward" : "quiz-step-back"}>
              {step === 0 && <Step0 answers={answers} errors={errors} onPick={v => { set("occasion", v); setErrors({}); advanceStep(); }} />}
              {step === 1 && <Step1 answers={answers} set={set} setAnswers={setAnswers} errors={errors} />}
              {step === 2 && <Step2 answers={answers} set={set} errors={errors} />}
              {step === 3 && <Step3 answers={answers} toggle={toggle} />}
              {step === 4 && <Step4 answers={answers} set={set} errors={errors} />}
              {step === 5 && <Step5 answers={answers} set={set} errors={errors} />}
            </div>
          )}
          {submitted && <ResultStep answers={answers} />}
        </div>

        {/* Footer */}
        {!submitted && (
          <div className="relative z-10 flex items-center justify-between border-t border-white/8 px-6 py-4">
            <button
              onClick={back}
              className={`flex items-center gap-1.5 text-sm text-white/35 transition hover:text-white/70 ${step === 0 ? "invisible" : ""}`}
            >
              <ArrowLeft className="h-4 w-4" /> Voltar
            </button>
            <div className="flex items-center gap-3">
              {step < TOTAL_STEPS - 1 && (
                <button onClick={goNext} className="quiz-btn-primary flex items-center gap-2 rounded-xl px-6 py-3 text-sm">
                  Continuar <ArrowRight className="h-4 w-4" />
                </button>
              )}
              {step === TOTAL_STEPS - 1 && (
                <button onClick={submit} disabled={sending} className="quiz-btn-primary flex items-center gap-2 rounded-xl px-6 py-3 text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                  {sending ? "Enviando…" : "Confirmar minha visita"}
                  {!sending && <ArrowRight className="h-4 w-4" />}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── step components ────────────────────────────────────────────────────────── */

function StepHeader({ step, title, sub }: { step: number; title: string; sub: string }) {
  return (
    <div className="mb-7">
      <p className="text-[11px] uppercase tracking-[0.3em] text-[var(--gold)] mb-1.5">
        Passo {step} de {TOTAL_STEPS}
      </p>
      <h3 className="font-display text-3xl sm:text-4xl text-white leading-tight">{title}</h3>
      <p className="mt-2 text-sm text-white/45 leading-relaxed">{sub}</p>
    </div>
  );
}

function Step0({ answers, onPick, errors }: {
  answers: Answers;
  onPick: (v: string) => void;
  errors: Record<string, string>;
}) {
  return (
    <div>
      <StepHeader step={1} title="Qual é a ocasião?" sub="Escolha a categoria que melhor descreve seu evento" />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {OCCASIONS.map((o, i) => {
          const active = answers.occasion === o.id;
          return (
            <button
              key={o.id}
              onClick={() => onPick(o.id)}
              style={{ "--ci": i } as React.CSSProperties}
              className={`quiz-card group relative flex flex-col items-start rounded-xl border p-4 text-left transition-all ${
                active ? "quiz-card-active" : "border-white/10 bg-white/4 hover:border-white/22 hover:bg-white/7"
              }`}
            >
              <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
                active ? "bg-[var(--gold)]/20 text-[var(--gold)]" : "bg-white/6 text-white/40 group-hover:text-white/70"
              }`}>
                <o.Icon className="h-5 w-5" />
              </div>
              <span className={`font-semibold text-sm leading-tight ${active ? "text-[var(--gold)]" : "text-white/80"}`}>{o.label}</span>
              <span className="mt-1 text-[11px] text-white/30 leading-tight">{o.desc}</span>
              {active && <Check className="absolute top-3 right-3 h-3.5 w-3.5 text-[var(--gold)]" />}
            </button>
          );
        })}
      </div>
      {errors.occasion && (
        <p className="mt-4 text-center text-xs text-red-400">{errors.occasion}</p>
      )}
    </div>
  );
}

function Step1({ answers, set, setAnswers, errors }: {
  answers: Answers;
  set: (k: keyof Answers, v: Answers[keyof Answers]) => void;
  setAnswers: React.Dispatch<React.SetStateAction<Answers>>;
  errors: Record<string, string>;
}) {
  const noDate = answers.noDateYet ?? false;

  const toggleNoDate = (checked: boolean) => {
    setAnswers(prev => ({
      ...prev,
      noDateYet: checked,
      eventDate: checked ? "Sem data definida" : "",
    }));
  };

  return (
    <div>
      <StepHeader step={2} title="Detalhes do evento" sub="Quanto mais detalhes, mais personalizada será sua visita guiada" />
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <DField label="Tipo de evento *" error={errors.eventType}>
            <select className="quiz-input" value={answers.eventType ?? ""} onChange={e => set("eventType", e.target.value)}>
              <option value="">Selecione...</option>
              {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </DField>
          <DField label="Nº de participantes *" error={errors.pax}>
            <input type="number" className="quiz-input" placeholder="Ex: 80" min={1} max={500}
              value={answers.pax ?? ""} onChange={e => set("pax", e.target.value)} />
          </DField>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <DField label="Data prevista *" error={noDate ? undefined : errors.eventDate}>
              <input
                type="date"
                className={`quiz-input ${noDate ? "opacity-30 cursor-not-allowed" : ""}`}
                value={noDate ? "" : (answers.eventDate ?? "")}
                disabled={noDate}
                onChange={e => set("eventDate", e.target.value)}
              />
            </DField>
            <label className="mt-2 flex cursor-pointer select-none items-center gap-2">
              <input
                type="checkbox"
                checked={noDate}
                onChange={e => toggleNoDate(e.target.checked)}
                className="h-3.5 w-3.5 accent-[var(--gold)] rounded"
              />
              <span className="text-[11px] text-white/40">Sem data prevista ainda</span>
            </label>
          </div>
          <DField label="Duração *" error={errors.duration}>
            <select className="quiz-input" value={answers.duration ?? ""} onChange={e => set("duration", e.target.value)}>
              <option value="">Selecione...</option>
              {DURATIONS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </DField>
        </div>
      </div>
    </div>
  );
}

function Step2({ answers, set, errors }: {
  answers: Answers;
  set: (k: keyof Answers, v: Answers[keyof Answers]) => void;
  errors: Record<string, string>;
}) {
  const selected = ROOM_CONFIGS.find(r => r.id === answers.roomConfig);
  return (
    <div>
      <StepHeader step={3} title="Configuração do espaço" sub="Como você imagina a disposição do seu evento?" />
      <div className="flex flex-col lg:flex-row gap-5">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2.5 lg:flex-1">
          {ROOM_CONFIGS.map((rc, i) => {
            const active = answers.roomConfig === rc.id;
            return (
              <button
                key={rc.id}
                onClick={() => set("roomConfig", rc.id)}
                style={{ "--ci": i } as React.CSSProperties}
                className={`quiz-card relative flex flex-col items-start rounded-xl border p-3.5 text-left transition-all ${
                  active ? "quiz-card-active" : "border-white/10 bg-white/4 hover:border-white/22"
                }`}
              >
                <span className={`font-semibold text-sm ${active ? "text-[var(--gold)]" : "text-white/80"}`}>{rc.label}</span>
                <span className="mt-1 text-[10px] text-white/30 leading-tight">{rc.desc}</span>
                <span className={`mt-2 text-[10px] font-medium ${active ? "text-[var(--gold)]/60" : "text-white/20"}`}>{rc.cap}</span>
                {active && <Check className="absolute top-2.5 right-2.5 h-3 w-3 text-[var(--gold)]" />}
              </button>
            );
          })}
        </div>

        <div className="lg:w-72 shrink-0">
          {selected ? (
            <div key={selected.id} className="quiz-mockup-reveal rounded-xl overflow-hidden border border-[var(--gold)]/20">
              <img src={selected.img} alt={selected.label} className="w-full h-44 lg:h-52 object-cover" />
              <div className="p-3 bg-[var(--gold)]/6 border-t border-[var(--gold)]/15">
                <p className="text-xs font-semibold text-[var(--gold)]">{selected.label}</p>
                <p className="text-[11px] text-white/40 mt-0.5">{selected.desc} · {selected.cap}</p>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-white/6 bg-white/3 h-44 lg:h-52 flex flex-col items-center justify-center gap-2">
              <span className="text-3xl opacity-20">🏛️</span>
              <p className="text-[11px] text-white/20 text-center px-4 leading-relaxed">
                Selecione uma configuração<br />para ver o espaço em 3D
              </p>
            </div>
          )}
        </div>
      </div>
      {errors.roomConfig && (
        <p className="mt-3 text-center text-xs text-red-400">{errors.roomConfig}</p>
      )}
    </div>
  );
}

function Step3({ answers, toggle }: {
  answers: Answers;
  toggle: (k: "equipment"|"foodBev", v: string) => void;
}) {
  const equip = answers.equipment ?? [];
  const food  = answers.foodBev   ?? [];
  return (
    <div>
      <StepHeader step={4} title="Infraestrutura" sub="Selecione tudo o que você precisará no evento" />
      <div className="space-y-7">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Monitor className="h-4 w-4 text-[var(--gold)]" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-white/50">Equipamentos</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {EQUIPMENT.map(e => (
              <button key={e.id} onClick={() => toggle("equipment", e.id)}
                className={`quiz-chip ${equip.includes(e.id) ? "active" : ""}`}>
                <span>{e.e}</span>{e.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Utensils className="h-4 w-4 text-[var(--gold)]" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-white/50">Alimentos & Bebidas</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {FOOD_BEV.map(f => (
              <button key={f.id} onClick={() => toggle("foodBev", f.id)}
                className={`quiz-chip ${food.includes(f.id) ? "active" : ""}`}>
                <span>{f.e}</span>{f.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Step4({ answers, set, errors }: {
  answers: Answers;
  set: (k: keyof Answers, v: Answers[keyof Answers]) => void;
  errors: Record<string, string>;
}) {
  const needs = answers.needsAccommodation;

  const stepper = (key: RoomKey, delta: number) => {
    const curr = Number(answers[key] ?? 0);
    const next = Math.max(0, curr + delta);
    set(key, String(next));
  };

  return (
    <div>
      <StepHeader step={5} title="Hospedagem" sub="Vai precisar de quartos para hóspedes ou participantes?" />
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {([true, false] as const).map(v => (
            <button
              key={String(v)}
              onClick={() => set("needsAccommodation", v)}
              className={`quiz-card flex items-center gap-3 rounded-xl border p-4 transition-all ${
                needs === v ? "quiz-card-active" : "border-white/10 bg-white/4 hover:border-white/22"
              }`}
            >
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg shrink-0 ${
                needs === v ? "bg-[var(--gold)]/20 text-[var(--gold)]" : "bg-white/5 text-white/35"
              }`}>
                {v ? <BedDouble className="h-4 w-4" /> : <X className="h-4 w-4" />}
              </div>
              <span className={`font-semibold text-sm ${needs === v ? "text-[var(--gold)]" : "text-white/70"}`}>
                {v ? "Sim, precisarei" : "Não, obrigado"}
              </span>
            </button>
          ))}
        </div>
        {errors.needsAccommodation && (
          <p className="text-xs text-red-400">{errors.needsAccommodation}</p>
        )}

        {needs && (
          <div key="hotel-details" className="quiz-step-forward rounded-xl border border-white/8 bg-white/3 p-5 space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <BedDouble className="h-4 w-4 text-[var(--gold)]" />
                <span className="text-[11px] font-semibold uppercase tracking-wider text-white/50">Tipos de quarto</span>
              </div>
              <div className="space-y-2">
                {ROOM_TYPES.map(rt => {
                  const qty = Number(answers[rt.key] ?? 0);
                  return (
                    <div
                      key={rt.id}
                      className={`flex items-center justify-between rounded-lg border px-4 py-3 transition-colors ${
                        qty > 0 ? "border-[var(--gold)]/30 bg-[var(--gold)]/5" : "border-white/8 bg-white/2"
                      }`}
                    >
                      <div className="flex-1 min-w-0 pr-3">
                        <p className={`text-sm font-semibold leading-tight ${qty > 0 ? "text-[var(--gold)]" : "text-white/75"}`}>
                          {rt.label}
                        </p>
                        <p className="text-[11px] text-white/30 mt-0.5 leading-tight">{rt.desc}</p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <button
                          type="button"
                          onClick={() => stepper(rt.key, -1)}
                          disabled={qty === 0}
                          className="flex h-7 w-7 items-center justify-center rounded-full border border-white/15 text-white/40 text-base transition hover:border-[var(--gold)]/60 hover:text-[var(--gold)] disabled:opacity-20 disabled:cursor-not-allowed"
                        >−</button>
                        <span className={`w-5 text-center text-sm font-bold tabular-nums ${qty > 0 ? "text-[var(--gold)]" : "text-white/40"}`}>
                          {qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => stepper(rt.key, +1)}
                          className="flex h-7 w-7 items-center justify-center rounded-full border border-white/15 text-white/40 text-base transition hover:border-[var(--gold)]/60 hover:text-[var(--gold)]"
                        >+</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <DField label="Check-in *" error={errors.checkin}>
                <input type="date" className="quiz-input" value={answers.checkin ?? ""} onChange={e => set("checkin", e.target.value)} />
              </DField>
              <DField label="Check-out *" error={errors.checkout}>
                <input type="date" className="quiz-input" value={answers.checkout ?? ""} onChange={e => set("checkout", e.target.value)} />
              </DField>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Step5({ answers, set, errors }: {
  answers: Answers;
  set: (k: keyof Answers, v: Answers[keyof Answers]) => void;
  errors: Record<string, string>;
}) {
  return (
    <div>
      <StepHeader step={6} title="Seus dados" sub="Para confirmarmos sua visita guiada e enviarmos os detalhes" />
      <div className="space-y-4">
        <DField label="Nome completo *" error={errors.nome}>
          <input className="quiz-input" placeholder="Nome e sobrenome"
            value={answers.nome ?? ""} onChange={e => set("nome", e.target.value)} />
        </DField>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <DField label="CPF / CNPJ *" error={errors.cpfCnpj}>
            <input className="quiz-input" placeholder="000.000.000-00" inputMode="numeric"
              value={answers.cpfCnpj ?? ""} onChange={e => set("cpfCnpj", maskCpfCnpj(e.target.value))} />
          </DField>
          <DField label="E-mail *" error={errors.email}>
            <input className="quiz-input" type="email" inputMode="email" placeholder="seu@email.com"
              value={answers.email ?? ""} onChange={e => set("email", maskEmail(e.target.value))} />
          </DField>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <DField label="WhatsApp *" error={errors.whatsapp}>
            <input className="quiz-input" inputMode="tel" placeholder="(86) 9 9999-9999"
              value={answers.whatsapp ?? ""} onChange={e => set("whatsapp", maskPhone(e.target.value))} />
          </DField>
          <DField label="Telefone">
            <input className="quiz-input" inputMode="tel" placeholder="(86) 3333-3333"
              value={answers.phone ?? ""} onChange={e => set("phone", maskPhone(e.target.value))} />
          </DField>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <DField label="Estado *" error={errors.state}>
            <select className="quiz-input" value={answers.state ?? ""} onChange={e => set("state", e.target.value)}>
              <option value="">UF</option>
              {BR_STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </DField>
          <DField label="Cidade *" error={errors.city} cls="col-span-2">
            <input className="quiz-input" placeholder="Sua cidade"
              value={answers.city ?? ""} onChange={e => set("city", e.target.value)} />
          </DField>
        </div>
      </div>
    </div>
  );
}

/* ─── result ─────────────────────────────────────────────────────────────────── */

function ResultStep({ answers }: { answers: Answers }) {
  const name = answers.nome?.split(" ")[0] ?? "";
  const room = ROOM_CONFIGS.find(r => r.id === answers.roomConfig);
  const msg  = buildWaMessage(answers);
  const msgProposal = msg.replace(
    "📍 *Gostaria de agendar uma visita guiada ao espaço.*",
    "Antes de agendar, gostaria de tirar algumas dúvidas por aqui."
  );

  return (
    <div className="text-center py-2" style={{ animation: "quizFadeUp 0.5s ease both" }}>
      {room && (
        <div className="quiz-mockup-reveal mb-6 mx-auto max-w-xs rounded-xl overflow-hidden border border-[var(--gold)]/20">
          <img src={room.img} alt={room.label} className="w-full h-36 object-cover" />
          <div className="p-2 bg-[var(--gold)]/6 border-t border-[var(--gold)]/15 flex items-center justify-between px-3">
            <span className="text-xs font-semibold text-[var(--gold)]">{room.label}</span>
            <span className="flex items-center gap-1 text-[11px] text-white/35">
              <Users className="h-3 w-3" />{room.cap}
            </span>
          </div>
        </div>
      )}

      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--gold)]/12 text-[var(--gold)]">
        <Check className="h-7 w-7" />
      </div>

      <p className="text-[11px] uppercase tracking-[0.28em] text-[var(--gold)]">Visita solicitada</p>
      <h3 className="mt-3 font-display text-3xl sm:text-4xl text-white leading-tight">
        {name ? `${name}, seu evento` : "Seu evento"} já tem um espaço aqui.
      </h3>
      <p className="mx-auto mt-4 max-w-md text-sm text-white/50 leading-relaxed">
        A melhor forma de sentir o Monã é visitando ao vivo. Em <strong className="text-white/75">30 minutos</strong> você conhece o espaço e sai com proposta e data confirmadas em mãos.
      </p>

      <div className="my-6 inline-flex items-center gap-2 rounded-full border border-[var(--gold)]/18 bg-[var(--gold)]/5 px-4 py-2 text-[11px] text-white/40">
        <span className="text-[var(--gold)]">✦</span>
        9 em cada 10 clientes fecham contrato após a visita guiada
      </div>

      <div className="flex flex-col items-center gap-3">
        <button
          onClick={() => window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`)}
          className="quiz-btn-primary flex w-full max-w-sm items-center justify-center gap-2 rounded-xl px-8 py-4 text-sm"
        >
          <MapPin className="h-4 w-4" />
          Agendar minha visita guiada
        </button>
        <button
          onClick={() => window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msgProposal)}`)}
          className="flex items-center gap-2 text-sm text-white/30 transition hover:text-white/60"
        >
          <MessageCircle className="h-4 w-4" />
          Tirar dúvidas antes por WhatsApp
        </button>
      </div>
    </div>
  );
}

/* ─── atoms ──────────────────────────────────────────────────────────────────── */

function DField({ label, children, error, cls }: { label: string; children: ReactNode; error?: string; cls?: string }) {
  return (
    <div className={cls}>
      <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-white/35">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}
