"use client";

import { useEffect, useRef, useState, useCallback } from "react";

type Mode = "menu" | "crawl" | "chance";

export default function Markus4Page() {
  const [mode, setMode] = useState<Mode>("menu");

  return (
    <div className="-m-6 min-h-[calc(100vh-60px)] bg-gradient-to-br from-fuchsia-900 via-red-900 to-amber-700 text-yellow-200 font-mono relative overflow-hidden">
      <ScrollingWarning />
      <div className="relative z-10 p-6">
        <header className="text-center py-6">
          <h1
            className="text-6xl md:text-8xl font-black tracking-tight"
            style={{
              color: "#fde047",
              textShadow:
                "4px 4px 0 #dc2626, -2px -2px 0 #22d3ee, 6px 6px 20px #000",
              transform: "rotate(-2deg)",
            }}
          >
            MARKUS 4
          </h1>
          <p className="mt-3 text-lg text-pink-200 italic animate-pulse">
            The only video game your therapist will beg you to stop playing
          </p>
        </header>

        {mode === "menu" && <MainMenu onPick={setMode} />}
        {mode === "crawl" && <CactusCrawl onExit={() => setMode("menu")} />}
        {mode === "chance" && <ChanceGame onExit={() => setMode("menu")} />}
      </div>
    </div>
  );
}

function MainMenu({ onPick }: { onPick: (m: Mode) => void }) {
  return (
    <div className="max-w-3xl mx-auto mt-10 space-y-6">
      <div className="border-4 border-dashed border-yellow-300 bg-black/60 p-6 rounded-lg">
        <p className="text-center text-sm uppercase tracking-widest text-yellow-300">
          ⚠ Choose your suffering ⚠
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <button
          onClick={() => onPick("crawl")}
          className="group relative p-6 bg-red-700 hover:bg-red-600 border-4 border-yellow-300 rounded-lg text-left transition transform hover:scale-[1.02] hover:rotate-1"
        >
          <div className="text-3xl font-black text-yellow-200 mb-2">
            1. CACTUS HALLWAY CRAWL
          </div>
          <p className="text-pink-100 text-sm">
            Markus is trapped in a never-ending hallway of sentient cacti.
            Drag him to the exit. The exit moves. The cursor is lying. The
            cacti scream. Your keyboard no longer does what it used to.
          </p>
          <span className="absolute top-2 right-2 text-xs bg-yellow-300 text-red-800 px-2 py-1 rounded">
            CRAZY • STUPID
          </span>
        </button>

        <button
          onClick={() => onPick("chance")}
          className="group relative p-6 bg-fuchsia-800 hover:bg-fuchsia-700 border-4 border-cyan-300 rounded-lg text-left transition transform hover:scale-[1.02] hover:-rotate-1"
        >
          <div className="text-3xl font-black text-cyan-200 mb-2">
            2. THE CHANCE GAME
          </div>
          <p className="text-cyan-100 text-sm">
            A fair and honest Plinko ball. 30 slots. 29 say LIVES. 1 says
            MARKUS DIES. The odds are in Markus&apos;s favor. Everything is
            fine. Press drop. You&apos;ll see.
          </p>
          <span className="absolute top-2 right-2 text-xs bg-cyan-300 text-fuchsia-900 px-2 py-1 rounded">
            100% FAIR
          </span>
        </button>
      </div>

      <p className="text-center text-xs text-yellow-200/60 pt-4">
        v4.0.0 • Unrated • Ships with regret
      </p>
    </div>
  );
}

function ScrollingWarning() {
  return (
    <div className="absolute top-0 left-0 right-0 bg-black border-b-2 border-yellow-400 overflow-hidden z-20">
      <div className="whitespace-nowrap text-yellow-300 text-xs py-1 animate-[scroll_18s_linear_infinite]">
        ⚠ MARKUS 4 ⚠ NOT RESPONSIBLE FOR LOST TIME ⚠ CACTI ARE NOT REAL ⚠
        SIDE EFFECTS INCLUDE CRYING, EYE TWITCHING, DISAPPOINTMENT ⚠ REFUNDS
        DENIED ⚠ MARKUS CANNOT BE SAVED ⚠ PRESS START TO REGRET ⚠ MARKUS 4 ⚠
        NOT RESPONSIBLE FOR LOST TIME ⚠ CACTI ARE NOT REAL ⚠
      </div>
      <style>{`
        @keyframes scroll {
          from { transform: translateX(100%); }
          to { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
}

/* -------------------- MODE 1: CACTUS HALLWAY CRAWL -------------------- */

function CactusCrawl({ onExit }: { onExit: () => void }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [markus, setMarkus] = useState({ x: 40, y: 200 });
  const [exitPos, setExitPos] = useState({ x: 700, y: 200 });
  const [dragging, setDragging] = useState(false);
  const [score, setScore] = useState(0);
  const [deaths, setDeaths] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [invert, setInvert] = useState(false);
  const [popups, setPopups] = useState<{ id: number; text: string; x: number; y: number }[]>([]);
  const [cacti, setCacti] = useState<{ id: number; x: number; y: number; vx: number; vy: number }[]>([]);
  const popId = useRef(0);

  // Spawn cacti that bounce around
  useEffect(() => {
    const initial = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: 150 + Math.random() * 500,
      y: 60 + Math.random() * 320,
      vx: (Math.random() - 0.5) * 3,
      vy: (Math.random() - 0.5) * 3,
    }));
    setCacti(initial);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCacti((prev) =>
        prev.map((c) => {
          let { x, y, vx, vy } = c;
          x += vx;
          y += vy;
          if (x < 40 || x > 760) vx = -vx;
          if (y < 40 || y > 420) vy = -vy;
          return { ...c, x, y, vx, vy };
        })
      );
    }, 30);
    return () => clearInterval(interval);
  }, []);

  // Collision detection with cacti
  useEffect(() => {
    for (const c of cacti) {
      const dx = c.x - markus.x;
      const dy = c.y - markus.y;
      if (Math.sqrt(dx * dx + dy * dy) < 32) {
        setDeaths((d) => d + 1);
        setMarkus({ x: 40, y: 200 });
        pushPopup("OUCH! CACTUS!");
        break;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markus, cacti]);

  // Exit teleports away whenever Markus gets close
  useEffect(() => {
    const dx = exitPos.x - markus.x;
    const dy = exitPos.y - markus.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 120) {
      // Exit teleports to somewhere "hard"
      setExitPos({
        x: 150 + Math.random() * 600,
        y: 60 + Math.random() * 340,
      });
      pushPopup("THE EXIT WAS A LIE");
    }
  }, [markus, exitPos]);

  // Periodic chaos
  useEffect(() => {
    const chaos = setInterval(() => {
      const roll = Math.random();
      if (roll < 0.25) {
        setRotation((r) => (r + (Math.random() > 0.5 ? 1 : -1) * 8) % 360);
      }
      if (roll < 0.15) {
        setInvert((i) => !i);
        pushPopup("CONTROLS SCRAMBLED");
      }
      if (roll < 0.4) {
        const sillies = [
          "MARKUS IS DISAPPOINTED",
          "WRONG",
          "NO",
          "TRY HARDER",
          "WHY ARE YOU STILL HERE",
          "MARKUS DOES NOT LOVE YOU",
          "KEEP CRAWLING",
          "THE CACTI SEE YOU",
          "404: DIGNITY NOT FOUND",
          "GOOD JOB! just kidding",
        ];
        pushPopup(sillies[Math.floor(Math.random() * sillies.length)]);
      }
    }, 1800);
    return () => clearInterval(chaos);
  }, []);

  function pushPopup(text: string) {
    const id = popId.current++;
    const newPop = {
      id,
      text,
      x: 60 + Math.random() * 600,
      y: 60 + Math.random() * 300,
    };
    setPopups((p) => [...p, newPop]);
    setTimeout(() => {
      setPopups((p) => p.filter((x) => x.id !== id));
    }, 1400);
  }

  const onMouseDown = () => setDragging(true);
  const onMouseUp = () => setDragging(false);

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!dragging) return;
      const rect = stageRef.current?.getBoundingClientRect();
      if (!rect) return;
      let x = e.clientX - rect.left;
      let y = e.clientY - rect.top;
      if (invert) {
        x = rect.width - x;
        y = rect.height - y;
      }
      // Add jitter so dragging is painful
      x += (Math.random() - 0.5) * 14;
      y += (Math.random() - 0.5) * 14;
      x = Math.max(20, Math.min(780, x));
      y = Math.max(20, Math.min(440, y));
      setMarkus({ x, y });
    },
    [dragging, invert]
  );

  const onExitClick = () => {
    // Actually reaching the exit (you never will): fake win
    setScore((s) => s + 1);
    pushPopup("NOPE. KEEP GOING.");
    setExitPos({
      x: 150 + Math.random() * 600,
      y: 60 + Math.random() * 340,
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-3">
      <div className="flex items-center justify-between text-sm">
        <button
          onClick={onExit}
          className="px-3 py-1 bg-black/60 border border-yellow-300 rounded text-yellow-300 hover:bg-yellow-300 hover:text-black"
        >
          ← BACK TO MENU
        </button>
        <div className="flex gap-4">
          <span className="bg-black/60 px-3 py-1 rounded text-green-300">
            EXIT TOUCHES: {score}
          </span>
          <span className="bg-black/60 px-3 py-1 rounded text-red-300">
            CACTUS DEATHS: {deaths}
          </span>
          <span
            className={`px-3 py-1 rounded ${
              invert ? "bg-red-600 text-white animate-pulse" : "bg-black/60 text-yellow-200"
            }`}
          >
            {invert ? "CONTROLS: INVERTED" : "CONTROLS: NORMAL-ISH"}
          </span>
        </div>
      </div>

      <p className="text-yellow-200 text-sm italic text-center">
        DRAG Markus (the little circle) to the green door. Do not stop. Do not
        think. Do not blink.
      </p>

      <div
        ref={stageRef}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onMouseMove={onMouseMove}
        className="relative w-full h-[480px] bg-gradient-to-b from-orange-200 to-yellow-400 border-8 border-yellow-900 rounded-xl overflow-hidden cursor-grab active:cursor-grabbing select-none"
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: "transform 0.4s ease",
        }}
      >
        {/* Hallway stripes */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, #000 0 4px, transparent 4px 40px)",
          }}
        />

        {/* Exit door */}
        <button
          onClick={onExitClick}
          className="absolute w-14 h-20 bg-green-500 border-4 border-green-900 rounded-t-full flex items-center justify-center text-xs font-bold text-white shadow-2xl"
          style={{ left: exitPos.x - 28, top: exitPos.y - 40 }}
        >
          EXIT
        </button>

        {/* Cacti */}
        {cacti.map((c) => (
          <div
            key={c.id}
            className="absolute text-4xl"
            style={{ left: c.x - 16, top: c.y - 16, filter: "drop-shadow(0 0 4px #000)" }}
          >
            🌵
          </div>
        ))}

        {/* Markus */}
        <div
          className="absolute w-8 h-8 rounded-full bg-blue-500 border-4 border-white shadow-xl flex items-center justify-center text-xs font-bold text-white pointer-events-none"
          style={{
            left: markus.x - 16,
            top: markus.y - 16,
            transition: "left 0.08s linear, top 0.08s linear",
          }}
          title="Markus"
        >
          M
        </div>

        {/* Popups */}
        {popups.map((p) => (
          <div
            key={p.id}
            className="absolute text-lg font-black text-red-700 bg-yellow-200 border-2 border-red-700 px-2 py-1 rounded pointer-events-none animate-bounce"
            style={{ left: p.x, top: p.y }}
          >
            {p.text}
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------- MODE 2: THE CHANCE GAME (RIGGED PLINKO) -------------------- */

type Ball = { x: number; y: number; vx: number; vy: number };

function ChanceGame({ onExit }: { onExit: () => void }) {
  const WIDTH = 900;
  const HEIGHT = 560;
  const ROWS = 10;
  const SLOTS = 30;
  // The doomed slot — always the middle-ish one, but it doesn't matter because
  // we cheat and make the ball always land there regardless.
  const DEATH_SLOT = 14;

  const [ball, setBall] = useState<Ball | null>(null);
  const [landed, setLanded] = useState<number | null>(null);
  const [dropping, setDropping] = useState(false);
  const [attempts, setAttempts] = useState(0);

  // Build peg layout
  const pegs: { x: number; y: number }[] = [];
  for (let r = 0; r < ROWS; r++) {
    const count = 6 + r * 2;
    const spacing = WIDTH / (count + 1);
    const y = 80 + r * 38;
    for (let i = 1; i <= count; i++) {
      pegs.push({ x: i * spacing, y });
    }
  }

  const slotWidth = WIDTH / SLOTS;
  const slotTopY = 80 + ROWS * 38 + 30;
  const targetX = DEATH_SLOT * slotWidth + slotWidth / 2;

  const drop = useCallback(() => {
    if (dropping) return;
    setLanded(null);
    setAttempts((a) => a + 1);
    setBall({ x: WIDTH / 2, y: 20, vx: 0, vy: 0 });
    setDropping(true);
  }, [dropping]);

  // Physics loop — rigged so the ball is gently nudged toward the death slot
  useEffect(() => {
    if (!ball || !dropping) return;

    const id = setInterval(() => {
      setBall((prev) => {
        if (!prev) return prev;
        let { x, y, vx, vy } = prev;

        // Gravity
        vy += 0.35;

        // Peg collisions
        for (const p of pegs) {
          const dx = x - p.x;
          const dy = y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 10) {
            // Bounce
            const nx = dx / (dist || 1);
            const ny = dy / (dist || 1);
            const dot = vx * nx + vy * ny;
            vx = vx - 2 * dot * nx;
            vy = vy - 2 * dot * ny;
            vx *= 0.6;
            vy *= 0.6;

            // THE RIG: after each peg, nudge toward the death slot
            const bias = targetX - x;
            vx += Math.sign(bias) * Math.min(Math.abs(bias) * 0.04, 2.2);

            // Push out of the peg so we don't get stuck
            x = p.x + nx * 11;
            y = p.y + ny * 11;
          }
        }

        // Constant sinister drift toward the death slot
        vx += Math.sign(targetX - x) * 0.05;
        vx *= 0.985;

        x += vx;
        y += vy;

        // Walls
        if (x < 8) {
          x = 8;
          vx = -vx * 0.6;
        }
        if (x > WIDTH - 8) {
          x = WIDTH - 8;
          vx = -vx * 0.6;
        }

        // Landed
        if (y >= slotTopY + 30) {
          let slot = Math.floor(x / slotWidth);
          // Final rig: if physics somehow disagreed, force it anyway.
          slot = DEATH_SLOT;
          setLanded(slot);
          setDropping(false);
          return { ...prev, x: DEATH_SLOT * slotWidth + slotWidth / 2, y: slotTopY + 20 };
        }

        return { x, y, vx, vy };
      });
    }, 16);

    return () => clearInterval(id);
  }, [ball, dropping, pegs, slotWidth, slotTopY, targetX]);

  const reset = () => {
    setBall(null);
    setLanded(null);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-3">
      <div className="flex items-center justify-between text-sm">
        <button
          onClick={onExit}
          className="px-3 py-1 bg-black/60 border border-cyan-300 rounded text-cyan-300 hover:bg-cyan-300 hover:text-black"
        >
          ← BACK TO MENU
        </button>
        <div className="flex gap-4">
          <span className="bg-black/60 px-3 py-1 rounded text-cyan-200">
            ATTEMPTS: {attempts}
          </span>
          <span className="bg-black/60 px-3 py-1 rounded text-green-300">
            ODDS MARKUS LIVES: 29/30 (96.67%)
          </span>
        </div>
      </div>

      <p className="text-cyan-100 text-sm italic text-center">
        A completely fair Plinko. Only ONE slot means Markus dies. The odds
        are overwhelmingly in his favor. Click DROP.
      </p>

      <div className="flex justify-center">
        <div
          className="relative bg-gradient-to-b from-indigo-950 via-purple-900 to-black border-4 border-cyan-400 rounded-lg shadow-2xl"
          style={{ width: WIDTH, height: HEIGHT }}
        >
          {/* Pegs */}
          {pegs.map((p, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_6px_#22d3ee]"
              style={{ left: p.x - 4, top: p.y - 4 }}
            />
          ))}

          {/* Slot divider walls */}
          {Array.from({ length: SLOTS + 1 }).map((_, i) => (
            <div
              key={i}
              className="absolute bg-cyan-500/40"
              style={{
                left: i * slotWidth - 0.5,
                top: slotTopY,
                width: 1,
                height: HEIGHT - slotTopY,
              }}
            />
          ))}

          {/* Slot labels */}
          {Array.from({ length: SLOTS }).map((_, i) => {
            const isDeath = i === DEATH_SLOT;
            return (
              <div
                key={i}
                className={`absolute flex items-end justify-center text-[8px] font-bold pb-1 ${
                  isDeath ? "bg-red-600/70 text-white" : "bg-green-600/20 text-green-200"
                }`}
                style={{
                  left: i * slotWidth,
                  top: slotTopY,
                  width: slotWidth,
                  height: HEIGHT - slotTopY,
                  writingMode: "vertical-rl",
                  transform: "rotate(180deg)",
                }}
              >
                {isDeath ? "MARKUS DIES" : "lives"}
              </div>
            );
          })}

          {/* Ball */}
          {ball && (
            <div
              className="absolute w-4 h-4 rounded-full bg-yellow-300 border-2 border-white shadow-[0_0_12px_#fde047]"
              style={{ left: ball.x - 8, top: ball.y - 8 }}
            />
          )}

          {/* Drop button area label */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 text-cyan-200 text-xs">
            ▼ DROP ZONE ▼
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-3 pt-2">
        <button
          onClick={drop}
          disabled={dropping}
          className="px-6 py-2 bg-cyan-400 hover:bg-cyan-300 disabled:bg-slate-600 disabled:text-slate-400 text-black font-black rounded-lg border-2 border-white shadow-lg"
        >
          {dropping ? "DROPPING..." : "DROP THE BALL"}
        </button>
        {landed !== null && (
          <button
            onClick={reset}
            className="px-6 py-2 bg-pink-500 hover:bg-pink-400 text-white font-black rounded-lg border-2 border-white shadow-lg"
          >
            TRY AGAIN (it won&apos;t help)
          </button>
        )}
      </div>

      {landed !== null && <DeathVerdict />}
    </div>
  );
}

function DeathVerdict() {
  return (
    <div className="mt-4 border-4 border-red-500 bg-black rounded-lg p-6 text-center animate-pulse">
      <p className="text-red-400 text-xs uppercase tracking-widest">
        OFFICIAL RULING
      </p>
      <p
        className="mt-3 text-2xl md:text-4xl font-black text-red-500 leading-tight"
        style={{
          textShadow: "2px 2px 0 #000, 0 0 20px #ef4444",
        }}
      >
        The Markus 4 Video Game says markus MUST die by super cactus eyeball
        torture
      </p>
      <p className="mt-4 text-yellow-300 text-sm italic">
        (the odds were 1 in 30. incredible luck. again.)
      </p>
    </div>
  );
}
