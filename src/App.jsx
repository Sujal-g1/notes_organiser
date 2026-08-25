
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import {
  X,
  Plus,
  Search,
  Sparkles,
  Command,
  Trash2,
  StickyNote,
  ArrowUpRight,
  Check,
} from "lucide-react";

gsap.registerPlugin(useGSAP);

const App = () => {
  const appRef = useRef(null);
  const titleRef = useRef(null);
  const orbRef = useRef(null);

  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem("notes-organiser");

      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [search, setSearch] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | GSAP INTRO
  |--------------------------------------------------------------------------
  */

  useGSAP(
    () => {
      const intro = gsap.timeline();

      intro
        .from(".ambient-orb", {
          scale: 0,
          opacity: 0,
          duration: 1.5,
          ease: "power4.out",
        })
        .from(
          ".top-bar > *",
          {
            y: -30,
            opacity: 0,
            stagger: 0.08,
            duration: 0.7,
            ease: "power3.out",
          },
          "-=0.8"
        )
        .from(
          ".hero-content > *",
          {
            y: 40,
            opacity: 0,
            stagger: 0.12,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.4"
        )
        .from(
          ".composer",
          {
            y: 50,
            opacity: 0,
            scale: 0.97,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.5"
        );

      gsap.to(".ambient-orb", {
        x: 120,
        y: -80,
        duration: 7,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".grid-background", {
        backgroundPosition: "100px 100px",
        duration: 12,
        repeat: -1,
        ease: "none",
      });
    },
    { scope: appRef }
  );

  /*
  |--------------------------------------------------------------------------
  | SAVE NOTES
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    localStorage.setItem("notes-organiser", JSON.stringify(tasks));
  }, [tasks]);

  /*
  |--------------------------------------------------------------------------
  | ADD NOTE
  |--------------------------------------------------------------------------
  */

  const submitHandler = (e) => {
    e.preventDefault();

    if (!title.trim() || !details.trim()) return;

    const newNote = {
      id: crypto.randomUUID(),
      title: title.trim(),
      details: details.trim(),
      createdAt: new Date().toISOString(),
    };

    setTasks((prev) => [newNote, ...prev]);

    setTitle("");
    setDetails("");
  };

  /*
  |--------------------------------------------------------------------------
  | DELETE NOTE
  |--------------------------------------------------------------------------
  */

  const deleteNote = (id) => {
    setTasks((prev) => prev.filter((note) => note.id !== id));
  };

  /*
  |--------------------------------------------------------------------------
  | FILTER
  |--------------------------------------------------------------------------
  */

  const filteredTasks = tasks.filter((note) => {
    const query = search.toLowerCase();

    return (
      note.title.toLowerCase().includes(query) ||
      note.details.toLowerCase().includes(query)
    );
  });

  /*
  |--------------------------------------------------------------------------
  | DATE
  |--------------------------------------------------------------------------
  */

  const formatDate = (date) => {
    return new Intl.DateTimeFormat("en", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(date));
  };

  return (
    <main
      ref={appRef}
      className="relative min-h-screen overflow-hidden bg-[#050505] text-white selection:bg-orange-500 selection:text-black"
    >
      {/* ================================================================
          BACKGROUND
      ================================================================= */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="grid-background absolute inset-0 opacity-[0.08]" />

        <div
          ref={orbRef}
          className="ambient-orb absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-orange-500/20 blur-[120px]"
        />

        <div className="absolute -bottom-60 -left-40 h-[500px] w-[500px] rounded-full bg-purple-600/10 blur-[140px]" />

        <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500/[0.03] blur-[100px]" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#050505_75%)]" />
      </div>

      {/* ================================================================
          NAV
      ================================================================= */}

      <header className="top-bar relative z-20 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
            <StickyNote size={20} className="text-orange-400" />
          </div>

          <div>
            <p className="text-sm font-bold tracking-[0.25em] text-white">
              N//O
            </p>

            <p className="text-[9px] uppercase tracking-[0.3em] text-white/30">
              Notes Operating System
            </p>
          </div>
        </motion.div>

        <div className="hidden items-center gap-3 sm:flex">
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />

            <span className="text-xs uppercase tracking-widest text-white/50">
              System Online
            </span>
          </div>

          <div className="rounded-full border border-white/10 px-4 py-2 text-xs text-white/40">
            {tasks.length.toString().padStart(2, "0")} NOTES
          </div>
        </div>
      </header>

      {/* ================================================================
          HERO
      ================================================================= */}

      <section className="hero-content relative z-10 mx-auto max-w-7xl px-6 pb-12 pt-12 lg:px-10 lg:pt-20">
        <div className="max-w-4xl">
          <div className="mb-6 flex items-center gap-3 text-orange-400">
            <Sparkles size={16} />

            <span className="text-xs font-bold uppercase tracking-[0.35em]">
              Personal Knowledge Interface
            </span>
          </div>

          <h1
            ref={titleRef}
            className="text-6xl font-black leading-[0.85] tracking-[-0.06em] sm:text-7xl md:text-8xl lg:text-[9rem]"
          >
            THINK.
            <br />

            <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-amber-300 bg-clip-text text-transparent">
              CAPTURE.
            </span>
            <br />

            REMEMBER.
          </h1>

          <p className="mt-8 max-w-xl text-sm leading-7 text-white/40 sm:text-base">
            A private space for thoughts, ideas, fragments and everything
            worth remembering.
          </p>
        </div>
      </section>

      {/* ================================================================
          COMPOSER
      ================================================================= */}

      <section className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10">
        <motion.form
          onSubmit={submitHandler}
          className={`composer relative overflow-hidden rounded-[2rem] border p-5 backdrop-blur-2xl transition-colors duration-500 sm:p-7 ${
            isFocused
              ? "border-orange-500/40 bg-orange-500/[0.04]"
              : "border-white/10 bg-white/[0.03]"
          }`}
        >
          {/* Decorative glow */}

          <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-orange-500/10 blur-[80px]" />

          <div className="relative">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500 text-black">
                  <Plus size={19} />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em]">
                    New Entry
                  </p>

                  <p className="text-[10px] uppercase tracking-widest text-white/30">
                    Capture something
                  </p>
                </div>
              </div>

              <div className="hidden items-center gap-2 text-[10px] uppercase tracking-widest text-white/20 sm:flex">
                <Command size={12} />
                <span>Quick Capture</span>
              </div>
            </div>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              type="text"
              placeholder="Give your thought a name..."
              className="w-full border-none bg-transparent text-2xl font-bold tracking-tight text-white outline-none placeholder:text-white/15 sm:text-3xl"
            />

            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Start writing..."
              className="mt-5 min-h-[130px] w-full resize-none border-none bg-transparent text-base leading-7 text-white/60 outline-none placeholder:text-white/15"
            />

            <div className="mt-5 flex flex-col justify-between gap-4 border-t border-white/10 pt-5 sm:flex-row sm:items-center">
              <div className="text-[10px] uppercase tracking-widest text-white/20">
                {details.length} characters
              </div>

              <motion.button
                type="submit"
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 0 40px rgba(249,115,22,0.25)",
                }}
                whileTap={{ scale: 0.96 }}
                disabled={!title.trim() || !details.trim()}
                className="group flex items-center justify-center gap-3 rounded-xl bg-orange-500 px-6 py-3 text-xs font-black uppercase tracking-widest text-black transition-all disabled:cursor-not-allowed disabled:opacity-30"
              >
                Save Thought

                <ArrowUpRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </motion.button>
            </div>
          </div>
        </motion.form>
      </section>

      {/* ================================================================
          NOTES HEADER
      ================================================================= */}

      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-20 pt-24 lg:px-10">
        <div className="mb-8 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-orange-400">
                Archive
              </span>

              <span className="h-px w-10 bg-orange-500/40" />
            </div>

            <h2 className="text-4xl font-black tracking-tight sm:text-5xl">
              Recent thoughts.
            </h2>
          </div>

          {/* Search */}

          <div className="relative w-full sm:w-72">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search notes..."
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-3 pl-11 pr-4 text-sm text-white outline-none transition-all placeholder:text-white/20 focus:border-orange-500/40"
            />
          </div>
        </div>

        {/* ================================================================
            NOTES
        ================================================================= */}

        <AnimatePresence mode="popLayout">
          {filteredTasks.length > 0 ? (
            <motion.div layout className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {filteredTasks.map((note, index) => (
                <motion.article
                  layout
                  key={note.id}
                  initial={{
                    opacity: 0,
                    y: 40,
                    scale: 0.9,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.7,
                    x: -100,
                    rotate: -8,
                    transition: {
                      duration: 0.35,
                    },
                  }}
                  transition={{
                    delay: Math.min(index * 0.06, 0.4),
                    type: "spring",
                    stiffness: 120,
                    damping: 18,
                  }}
                  drag
                  dragSnapToOrigin
                  whileDrag={{
                    scale: 1.04,
                    rotate: 2,
                    zIndex: 20,
                    boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
                  }}
                  whileHover={{
                    y: -8,
                  }}
                  className="group relative cursor-grab overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] p-6 backdrop-blur-xl active:cursor-grabbing"
                >
                  {/* Number */}

                  <div className="mb-8 flex items-center justify-between">
                    <span className="font-mono text-[10px] text-white/20">
                      #{String(index + 1).padStart(2, "0")}
                    </span>

                    <motion.button
                      whileHover={{
                        scale: 1.15,
                        rotate: 90,
                      }}
                      whileTap={{
                        scale: 0.8,
                      }}
                      onClick={() => deleteNote(note.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-white/30 transition-colors hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
                      aria-label="Delete note"
                    >
                      <X size={15} />
                    </motion.button>
                  </div>

                  {/* Accent */}

                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "35%" }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    className="mb-6 h-[2px] bg-gradient-to-r from-orange-500 to-transparent"
                  />

                  <h3 className="mb-4 text-xl font-black uppercase leading-tight tracking-tight text-white">
                    {note.title}
                  </h3>

                  <p className="line-clamp-5 min-h-[120px] text-sm leading-7 text-white/40">
                    {note.details}
                  </p>

                  <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-5">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-white/20">
                      {formatDate(note.createdAt)}
                    </span>

                    <div className="flex items-center gap-2 text-[9px] uppercase tracking-widest text-orange-400/50">
                      <Check size={11} />
                      Saved
                    </div>
                  </div>

                  {/* Hover glow */}

                  <div className="pointer-events-none absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-orange-500/10 opacity-0 blur-[60px] transition-opacity duration-500 group-hover:opacity-100" />
                </motion.article>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex min-h-[350px] flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/[0.02] text-center"
            >
              <motion.div
                animate={{
                  y: [0, -8, 0],
                  rotate: [0, -3, 3, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]"
              >
                <StickyNote size={30} className="text-orange-500/60" />
              </motion.div>

              <h3 className="text-xl font-bold">
                {search ? "Nothing found." : "Your archive is empty."}
              </h3>

              <p className="mt-2 max-w-sm text-sm leading-6 text-white/30">
                {search
                  ? "Try a different search term."
                  : "Capture your first thought above and start building your personal archive."}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ================================================================
          FOOTER
      ================================================================= */}

      <footer className="relative z-10 border-t border-white/10 px-6 py-8 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-[10px] uppercase tracking-[0.25em] text-white/20 sm:flex-row">
          <span>Notes Operating System © 2026</span>

          <span>Built for thoughts that matter.</span>
        </div>
      </footer>
    </main>
  );
};

export default App;
