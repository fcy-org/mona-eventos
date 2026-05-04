import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  Sparkles,
  Utensils,
  Users,
  BedDouble,
  LayoutGrid,
  Check,
  X,
  MapPin,
} from "lucide-react";
import heroImg from "@/assets/hero-event.jpg";
import celebrationsImg from "@/assets/LP2S.png";
import corporateImg from "@/assets/LP3S.png";
import gastronomyImg from "@/assets/LP1S.png";
import monaLogo from "@/assets/mona-logo.png";
import occasionCorporateImg from "@/assets/corporativo.png";
import occasionGastronomyImg from "@/assets/xp gratronomico.png";
import mockupAuditorio   from "@/assets/mockup-auditorio.jpeg";
import mockupEscolar     from "@/assets/mockup-escolar.jpeg";
import mockupFormatoU    from "@/assets/mockup-formato-u.jpeg";
import mockupBanquete    from "@/assets/mockup-banquete-grande.jpeg";
import mockupStands      from "@/assets/mockup-stands.jpeg";
import mockupEspinha     from "@/assets/mockup-espinha.jpeg";
import { Quiz } from "@/components/Quiz";
import { StickyCTA } from "@/components/StickyCTA";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Monã Hotel — Eventos premium em Teresina" },
      {
        name: "description",
        content:
          "Espaço, gastronomia e equipe dedicada em um só lugar. Realize casamentos, eventos corporativos e celebrações no Monã Hotel, em Teresina.",
      },
      { property: "og:title", content: "Monã Hotel — Eventos premium em Teresina" },
      {
        property: "og:description",
        content:
          "Tudo integrado: do espaço ao prato na mesa do seu convidado. Faça o diagnóstico gratuito.",
      },
      { property: "og:image", content: heroImg },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: heroImg },
    ],
  }),
  component: Index,
});

function Index() {
  const [quizOpen, setQuizOpen] = useState(false);
  const open = () => setQuizOpen(true);

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header onCTA={open} />
      <Hero onCTA={open} />
      <Occasions />
      <Spaces onCTA={open} />
      <Comparison />
      <EventGallery />
      <FinalCTA onCTA={open} />
      <Footer />

      <StickyCTA onClick={open} />
      <Quiz open={quizOpen} onClose={() => setQuizOpen(false)} />
    </div>
  );
}

/* ----------------------------- HEADER ----------------------------- */
function Header({ onCTA }: { onCTA: () => void }) {
  return (
    <header className="absolute inset-x-0 top-0 z-30 px-6 py-4 sm:px-10 sm:py-5">
      <nav className="mx-auto flex max-w-7xl items-center justify-between">
        <a href="/" className="flex items-center gap-3">
          <img
            src={monaLogo}
            alt="Monã Hotel"
            className="h-10 w-auto sm:h-12 object-contain"
            style={{ filter: "invert(1) brightness(2)" }}
          />
          <span className="hidden text-[9px] uppercase tracking-[0.35em] text-cream/70 leading-none sm:block">
            Hotel · Teresina
          </span>
        </a>
        <button
          onClick={onCTA}
          className="hidden items-center gap-2 rounded-md border border-cream/25 bg-background/30 px-5 py-2.5 text-sm font-medium text-cream backdrop-blur-md transition hover:border-accent hover:bg-background/50 md:inline-flex"
        >
          Diagnóstico gratuito
          <ArrowRight className="h-4 w-4" />
        </button>
      </nav>
    </header>
  );
}

/* ------------------------------ HERO ------------------------------ */
function Hero({ onCTA }: { onCTA: () => void }) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroImg}
          alt="Salão do Monã Hotel preparado para evento"
          width={1920}
          height={1280}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/30 via-foreground/40 to-background" />
      </div>

      <div className="relative mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-6 pb-16 pt-32 sm:px-10 sm:pb-24 sm:pt-40 lg:pb-32">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-cream/30 bg-background/10 px-4 py-1.5 text-[11px] uppercase tracking-[0.25em] text-cream backdrop-blur-md">
            <Sparkles className="h-3 w-3 text-accent" />
            Eventos premium em Teresina
          </div>

          <h1 className="mt-6 font-display text-balance text-4xl leading-[1.05] text-cream sm:text-6xl lg:text-7xl">
            Seu evento com espaço, gastronomia e equipe dedicada —{" "}
            <span className="italic text-accent">tudo no mesmo lugar.</span>
          </h1>

          <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-cream/85 sm:text-lg">
            No Monã Hotel, você não precisa coordenar fornecedor, buffet e decoração. A gente cuida
            de tudo — do espaço ao prato na mesa do seu convidado.
          </p>

          {/* Benefit grid 2x2 */}
          <div className="mt-10 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
            {[
              { icon: Users, text: "Espaço + equipe no mesmo contrato" },
              { icon: Utensils, text: "Gastronomia regional inclusa" },
              { icon: BedDouble, text: "Hospedagem para convidados" },
              { icon: LayoutGrid, text: "Salas adaptáveis para qualquer evento" },
            ].map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-3 rounded-md border border-cream/15 bg-background/10 px-4 py-3 backdrop-blur-md"
              >
                <Icon className="h-4 w-4 flex-none text-accent" />
                <span className="text-sm text-cream/95">{text}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-10 flex flex-col items-start gap-3">
            <button
              onClick={onCTA}
              className="group flex items-center gap-2 rounded-md bg-accent px-7 py-4 text-sm font-medium text-accent-foreground shadow-gold transition-all hover:scale-[1.02] hover:bg-accent/90 active:scale-[0.99]"
            >
              Fazer meu diagnóstico gratuito
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
            <p className="text-xs text-cream/70">Leva menos de 2 minutos. Sem compromisso.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------- SOCIAL PROOF -------------------------- */

function Occasions() {
  const cards = [
    {
      img: celebrationsImg,
      tag: "Sociais",
      title: "Celebrações e jantares",
      desc: "Casamentos, aniversários e jantares íntimos com a estética que sua história merece.",
    },
    {
      img: corporateImg,
      tag: "Profissionais",
      title: "Eventos profissionais",
      desc: "Convenções, palestras e reuniões executivas com infraestrutura completa.",
    },
    {
      img: gastronomyImg,
      tag: "Sabor",
      title: "Gastronomia & hospitalidade",
      desc: "Cardápio assinado pela nossa cozinha, com identidade regional e execução refinada.",
    },
  ];
  return (
    <section className="bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.3em] text-accent">Para cada ocasião</p>
          <h2 className="mt-4 font-display text-balance text-4xl text-foreground sm:text-5xl">
            Um espaço, infinitas possibilidades.
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {cards.map((c) => (
            <article
              key={c.title}
              className="group overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-elegant"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={c.img}
                  alt={c.title}
                  loading="lazy"
                  width={1024}
                  height={1280}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <span className="text-[10px] uppercase tracking-[0.3em] text-accent">{c.tag}</span>
                <h3 className="mt-2 font-display text-2xl text-foreground">{c.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------- COMPARISON --------------------------- */
function Comparison() {
  const left = [
    "Buffet, decoração e espaço em contratos separados",
    "Cinco fornecedores, cinco horários, cinco riscos",
    "Você vira gerente de projeto no próprio evento",
    "Erro de um afeta a experiência de todos",
  ];
  const right = [
    "Espaço, gastronomia e equipe em um único contrato",
    "Uma equipe coordenando tudo do briefing à última taça",
    "Você vive o evento. A gente executa.",
    "Padrão único de qualidade, do welcome ao café final",
  ];

  return (
    <section className="bg-secondary py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-accent">A diferença na prática</p>
          <h2 className="mt-4 font-display text-balance text-4xl text-foreground sm:text-5xl">
            Caos coordenado. <span className="italic">Ou execução fluida.</span>
          </h2>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-background/60 p-8">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-muted-foreground">
              <X className="h-4 w-4" /> Modelo tradicional
            </div>
            <ul className="mt-6 space-y-4">
              {left.map((t) => (
                <li key={t} className="flex gap-3 text-sm text-muted-foreground">
                  <X className="mt-0.5 h-4 w-4 flex-none text-destructive/70" />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-accent/40 bg-background p-8 shadow-elegant">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-accent">
              <Check className="h-4 w-4" /> Experiência Monã
            </div>
            <ul className="mt-6 space-y-4">
              {right.map((t) => (
                <li key={t} className="flex gap-3 text-sm text-foreground">
                  <Check className="mt-0.5 h-4 w-4 flex-none text-accent" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------- EVENT GALLERY ----------------------- */
function EventGallery() {
  const galleryImages = [
    {
      img: occasionCorporateImg,
      title: "Eventos Corporativos",
      description: "Reuniões e convenções",
    },
    {
      img: occasionGastronomyImg,
      title: "Experiências Gastronômicas",
      description: "Cardápios assinados",
    },
    {
      img: celebrationsImg,
      title: "Festas e Celebrações",
      description: "Momentos memoráveis",
    },
    {
      img: gastronomyImg,
      title: "Banquetes",
      description: "Jantares e experiências gastronômicas",
    },
  ];

  return (
    <section className="bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.3em] text-accent">Galeria de eventos</p>
          <h2 className="mt-4 font-display text-balance text-4xl text-foreground sm:text-5xl">
            Histórias que aconteceram aqui.
          </h2>
        </div>

        <div className="mt-14">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {galleryImages.map((item, index) => (
                <CarouselItem key={index} className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                  <div className="relative overflow-hidden rounded-xl h-80 sm:h-96 group cursor-pointer">
                    <img
                      src={item.img}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    
                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="font-display text-2xl font-bold">{item.title}</h3>
                      <p className="mt-2 text-sm text-white/80">{item.description}</p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute -left-12 top-1/2 -translate-y-1/2 hidden lg:flex" />
            <CarouselNext className="absolute -right-12 top-1/2 -translate-y-1/2 hidden lg:flex" />
          </Carousel>

          {/* Mobile indicator */}
          <p className="mt-6 text-center text-sm text-muted-foreground lg:hidden">
            Deslize para ver mais
          </p>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- SPACES ------------------------------ */
function Spaces({ onCTA }: { onCTA: () => void }) {
  const configs = [
    { label: "Auditório",         desc: "Cadeiras em fileiras voltadas ao palco", cap: "até 120 pessoas", img: mockupAuditorio   },
    { label: "Escolar",           desc: "Mesas com cadeiras em fileiras",          cap: "até 80 pessoas",  img: mockupEscolar     },
    { label: 'Formato "U"',       desc: "Mesas em U para debate e interação",      cap: "até 40 pessoas",  img: mockupFormatoU    },
    { label: "Banquete",          desc: "Mesas redondas com serviço completo",     cap: "até 150 pessoas", img: mockupBanquete    },
    { label: "Coquetel & Stands", desc: "Espaço aberto com expositores",           cap: "até 200 pessoas", img: mockupStands      },
    { label: "Espinha de Peixe",  desc: "Mesas inclinadas, melhor visibilidade",   cap: "até 60 pessoas",  img: mockupEspinha     },
  ];

  return (
    <section className="bg-secondary py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.3em] text-accent">Nossos espaços</p>
          <h2 className="mt-4 font-display text-balance text-4xl text-foreground sm:text-5xl">
            Um espaço que se adapta ao seu evento.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground max-w-lg">
            6 configurações de sala, do auditório corporativo ao banquete de casamento. Veja como o Monã tomaria a forma do <em>seu</em> evento.
          </p>
        </div>

        <div className="mt-14">
          <Carousel opts={{ align: "start", loop: true }} className="w-full">
            <CarouselContent className="-ml-4">
              {configs.map((c, i) => (
                <CarouselItem key={i} className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                  <article className="group overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-elegant">
                    <div className="relative overflow-hidden h-56">
                      <img
                        src={c.img}
                        alt={`Configuração ${c.label}`}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                      <div className="absolute bottom-0 left-0 p-4">
                        <span className="text-[9px] uppercase tracking-[0.3em] text-accent">Configuração</span>
                        <h3 className="mt-1 font-display text-xl text-white">{c.label}</h3>
                      </div>
                    </div>
                    <div className="p-4 flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">{c.desc}</p>
                      <div className="flex items-center gap-1.5 shrink-0 ml-3">
                        <Users className="h-3.5 w-3.5 text-accent" />
                        <span className="text-xs font-medium text-accent whitespace-nowrap">{c.cap}</span>
                      </div>
                    </div>
                  </article>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute -left-12 top-1/2 -translate-y-1/2 hidden lg:flex" />
            <CarouselNext className="absolute -right-12 top-1/2 -translate-y-1/2 hidden lg:flex" />
          </Carousel>
          <p className="mt-6 text-center text-sm text-muted-foreground lg:hidden">Deslize para ver todas as configurações</p>
        </div>

        <div className="mt-12 flex flex-col items-center gap-3 text-center">
          <p className="text-sm text-muted-foreground">Quer ver ao vivo como ficaria o seu evento?</p>
          <button
            onClick={onCTA}
            className="group inline-flex items-center gap-2 rounded-md border border-accent/35 bg-background px-6 py-3 text-sm font-medium text-foreground transition hover:bg-accent hover:text-accent-foreground hover:border-accent"
          >
            <MapPin className="h-4 w-4" />
            Fazer diagnóstico e agendar visita
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- FINAL CTA --------------------------- */
function FinalCTA({ onCTA }: { onCTA: () => void }) {
  return (
    <section className="relative overflow-hidden bg-primary py-24 text-primary-foreground sm:py-32">
      <div className="absolute inset-0 gradient-radial-warm opacity-60" />
      <div className="relative mx-auto max-w-3xl px-6 text-center sm:px-10">
        <p className="text-xs uppercase tracking-[0.3em] text-accent">Pronto para conhecer?</p>
        <h2 className="mt-4 font-display text-balance text-4xl text-cream sm:text-6xl">
          O seu evento começa com uma visita.
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-pretty text-base text-cream/80">
          Agende uma visita guiada de 30 minutos e saia com proposta personalizada,
          configuração do espaço e data confirmada em mãos — sem compromisso.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4">
          <button
            onClick={onCTA}
            className="group inline-flex items-center gap-2 rounded-md bg-accent px-8 py-4 text-sm font-medium text-accent-foreground shadow-gold transition-all hover:scale-[1.02] hover:bg-accent/90"
          >
            <MapPin className="h-4 w-4" />
            Quero agendar minha visita
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
          <p className="text-xs text-cream/50">
            ✦ 9 em cada 10 clientes fecham contrato após a visita guiada
          </p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- FOOTER ---------------------------- */
function Footer() {
  return (
    <footer className="border-t border-border bg-cream py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-6 sm:flex-row sm:items-center sm:px-10">
        <div>
          <div className="font-display text-2xl text-foreground">Monã Hotel</div>
          <p className="mt-1 text-xs uppercase tracking-[0.25em] text-muted-foreground">
            Teresina · Piauí
          </p>
        </div>
        <div className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Monã Hotel. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
