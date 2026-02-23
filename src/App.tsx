import { useEffect, useState } from "react";
import type { DragEvent } from "react";

type TodoItem = {
  id: number;
  text: string;
  done: boolean;
};

type TodoList = {
  id: number;
  title: string;
  input: string;
  items: TodoItem[];
};

type SummaryItem = {
  id: number;
  type: string;
  amount: number;
};

type SummaryCard = {
  id: number;
  title: string;
  typeInput: string;
  amountInput: string;
  items: SummaryItem[];
};

type CalendarEntry = {
  id: number;
  date: string;
  title: string;
};

type MovieTip = {
  id: number;
  title: string;
  overview: string;
  releaseDate: string;
  voteAverage: number;
  posterPath: string | null;
};

type SummaryBoardCard = `summary-${number}`;
type ListBoardCard = `list-${number}`;
type BoardCard = "calendar" | SummaryBoardCard | ListBoardCard;

const summaryBoardCardId = (id: number): SummaryBoardCard => `summary-${id}`;
const listBoardCardId = (id: number): ListBoardCard => `list-${id}`;

const initialLists: TodoList[] = [
  {
    id: 1,
    title: "Morning Routine",
    input: "",
    items: [
      { id: 101, text: "Drink water", done: true },
      { id: 102, text: "10 min stretch", done: false },
      { id: 103, text: "Plan top 3 tasks", done: false },
    ],
  },
  {
    id: 2,
    title: "Work Sprint",
    input: "",
    items: [
      { id: 201, text: "Review pull requests", done: false },
      { id: 202, text: "Ship drag-and-drop feature", done: true },
      { id: 203, text: "Write release notes", done: false },
    ],
  },
];

const initialSummaryCards: SummaryCard[] = [
  {
    id: 1,
    title: "Bills",
    typeInput: "",
    amountInput: "",
    items: [
      { id: 1, type: "Electricity", amount: 775 },
      { id: 2, type: "Internet", amount: 499 },
    ],
  },
];

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function weatherLabel(code: number) {
  if (code === 0) return "Clear";
  if (code >= 1 && code <= 3) return "Cloudy";
  if (code >= 45 && code <= 48) return "Fog";
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return "Rain";
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return "Snow";
  if (code >= 95) return "Storm";
  return "Weather";
}

function formatLocalDateTime(date: Date) {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

function extractThemeDays(markdown: string, date: Date) {
  const day = new Intl.DateTimeFormat("sv-SE", {
    day: "numeric",
    timeZone: "Europe/Stockholm",
  }).format(date);
  const month = new Intl.DateTimeFormat("sv-SE", {
    month: "long",
    timeZone: "Europe/Stockholm",
  }).format(date);
  const dateKey = `${day} ${month}`.toLowerCase();

  const lines = markdown.split("\n").map((line) => line.trim());
  const datePattern =
    /^\[\*\*(\d{1,2}\s+[\p{L}]+)\*\*\]\(https?:\/\/temadagar\.se\/[^)]+\)/u;
  const dayPattern = /^\[([^\]]+)\]\(https?:\/\/temadagar\.se\/[^)]+\)/;

  let startIndex = -1;
  for (let i = 0; i < lines.length; i += 1) {
    const match = lines[i].match(datePattern);
    if (match?.[1]?.toLowerCase() === dateKey) {
      startIndex = i + 1;
      break;
    }
  }

  if (startIndex === -1) {
    return [];
  }

  const themeDays: string[] = [];
  for (let i = startIndex; i < lines.length; i += 1) {
    if (datePattern.test(lines[i])) {
      break;
    }
    const match = lines[i].match(dayPattern);
    if (match?.[1] && !match[1].includes("**")) {
      themeDays.push(match[1]);
    }
  }

  return themeDays;
}

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getCalendarCells(currentMonth: Date) {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const offset = (firstDayOfMonth.getDay() + 6) % 7;
  const gridStart = new Date(year, month, 1 - offset);

  return Array.from({ length: 42 }, (_, index) => {
    const cellDate = new Date(gridStart);
    cellDate.setDate(gridStart.getDate() + index);
    return {
      date: cellDate,
      dateKey: toDateKey(cellDate),
      inCurrentMonth: cellDate.getMonth() === month,
    };
  });
}

function RiseLogo() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative grid h-12 w-12 place-items-center overflow-hidden rounded-2xl border border-cyan-100/40 bg-slate-900 shadow-[0_0_42px_rgba(56,189,248,0.42)]">
        <div className="absolute -inset-3 rounded-[1.4rem] bg-cyan-300/25 blur-md" />
        <div className="absolute inset-[2px] rounded-xl bg-gradient-to-br from-sky-200 via-cyan-300 to-blue-500" />
        <div className="absolute inset-[2px] rounded-xl bg-[radial-gradient(circle_at_26%_18%,rgba(255,255,255,0.9),transparent_38%)]" />
        <div className="absolute inset-[2px] rounded-xl bg-[conic-gradient(from_210deg_at_55%_45%,rgba(255,255,255,0.12),transparent_28%,rgba(2,132,199,0.3),transparent_62%,rgba(255,255,255,0.15))]" />
        <div className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-white/90 shadow-[0_0_12px_rgba(255,255,255,0.9)]" />
        <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/20" />
        <span className="relative text-[0.82rem] font-black tracking-[0.08em] text-slate-900 drop-shadow-[0_1px_1px_rgba(255,255,255,0.35)]">
          RS
        </span>
      </div>
      <div className="leading-none">
        <p className="text-[1.8rem] font-black tracking-[-0.03em] text-transparent bg-gradient-to-r from-cyan-200 via-sky-200 to-cyan-300 bg-clip-text">
          Rise and shine
        </p>
      </div>
    </div>
  );
}

function App() {
  const [weatherText, setWeatherText] = useState("Checking weather...");
  const [dateTimeText, setDateTimeText] = useState(
    formatLocalDateTime(new Date()),
  );
  const [themeDayText, setThemeDayText] = useState("Temadag laddas...");
  const [newListTitle, setNewListTitle] = useState("");
  const [isTodoCreatorOpen, setIsTodoCreatorOpen] = useState(false);
  const [lists, setLists] = useState<TodoList[]>(initialLists);
  const [newSummaryCardTitle, setNewSummaryCardTitle] = useState("");
  const [isSummaryCreatorOpen, setIsSummaryCreatorOpen] = useState(false);
  const [summaryCards, setSummaryCards] = useState<SummaryCard[]>(
    initialSummaryCards,
  );
  const [boardCards, setBoardCards] = useState<BoardCard[]>(() => [
    "calendar",
    ...initialSummaryCards.map((card) => summaryBoardCardId(card.id)),
    ...initialLists.map((list) => listBoardCardId(list.id)),
  ]);
  const [draggedBoardCard, setDraggedBoardCard] = useState<BoardCard | null>(
    null,
  );
  const [dragOverBoardCard, setDragOverBoardCard] = useState<BoardCard | null>(
    null,
  );
  const [currentMonth, setCurrentMonth] = useState(
    () => new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  );
  const [selectedDateKey, setSelectedDateKey] = useState(() =>
    toDateKey(new Date()),
  );
  const [calendarInput, setCalendarInput] = useState("");
  const [calendarEntries, setCalendarEntries] = useState<CalendarEntry[]>([]);
  const [isCalendarMinimized, setIsCalendarMinimized] = useState(false);
  const [showMovieTip, setShowMovieTip] = useState(false);
  const [movieTip, setMovieTip] = useState<MovieTip | null>(null);
  const [movieTipDateKey, setMovieTipDateKey] = useState<string | null>(null);
  const [movieTipStatus, setMovieTipStatus] = useState<
    "idle" | "loading" | "missingKey" | "error"
  >("idle");

  useEffect(() => {
    const timer = setInterval(() => {
      setDateTimeText(formatLocalDateTime(new Date()));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const loadThemeDays = async () => {
      try {
        const response = await fetch(
          "https://r.jina.ai/http://temadagar.se/kalender/",
        );
        if (!response.ok) {
          throw new Error("Theme day request failed");
        }

        const markdown = await response.text();
        const days = extractThemeDays(markdown, new Date());

        if (days.length === 0) {
          setThemeDayText("Temadag saknas idag");
          return;
        }

        const firstTwo = days.slice(0, 2).join(", ");
        const remaining = days.length - 2;
        setThemeDayText(
          remaining > 0 ? `${firstTwo} (+${remaining})` : firstTwo,
        );
      } catch {
        setThemeDayText("Temadagar kunde inte laddas");
      }
    };

    void loadThemeDays();
  }, []);

  useEffect(() => {
    const loadWeather = async (
      latitude: number,
      longitude: number,
      fallbackName: string,
    ) => {
      try {
        const weatherUrl =
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}` +
          `&longitude=${longitude}&current=temperature_2m,weather_code`;
        const locationUrl =
          `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${latitude}` +
          `&longitude=${longitude}&count=1&language=en&format=json`;

        const weatherResponse = await fetch(weatherUrl);
        if (!weatherResponse.ok) {
          throw new Error("Weather request failed");
        }

        const weatherData: {
          current?: {
            temperature_2m?: number;
            weather_code?: number;
          };
        } = await weatherResponse.json();

        const temp = weatherData.current?.temperature_2m;
        const code = weatherData.current?.weather_code;
        if (typeof temp !== "number" || typeof code !== "number") {
          setWeatherText("Weather unavailable");
          return;
        }

        let locationName = fallbackName;
        try {
          const locationResponse = await fetch(locationUrl);
          if (locationResponse.ok) {
            const locationData: {
              results?: Array<{
                name?: string;
                admin1?: string;
                country?: string;
              }>;
            } = await locationResponse.json();

            const place = locationData.results?.[0];
            locationName =
              place?.name ?? place?.admin1 ?? place?.country ?? fallbackName;
          }
        } catch {
          // Keep fallback location name if reverse geocoding fails.
        }

        setWeatherText(`${locationName} ${Math.round(temp)}C ${weatherLabel(code)}`);
      } catch {
        setWeatherText("Weather unavailable");
      }
    };

    const fallbackWeather = () => {
      void loadWeather(40.7128, -74.006, "New York");
    };

    if (!("geolocation" in navigator)) {
      fallbackWeather();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        void loadWeather(coords.latitude, coords.longitude, "Your area");
      },
      () => {
        fallbackWeather();
      },
      { timeout: 8000 },
    );
  }, []);

  useEffect(() => {
    if (!showMovieTip) {
      return;
    }

    const todayKey = toDateKey(new Date());
    if (movieTip && movieTipDateKey === todayKey) {
      return;
    }

    const env = import.meta.env as Record<string, string | undefined>;
    const tmdbApiKey = env.VITE_TMDB_API_KEY;
    const tmdbReadToken = env.VITE_TMDB_READ_TOKEN;

    if (!tmdbApiKey && !tmdbReadToken) {
      setMovieTipStatus("missingKey");
      return;
    }

    const loadMovieTip = async () => {
      try {
        setMovieTipStatus("loading");

        const endpoint = tmdbApiKey
          ? `https://api.themoviedb.org/3/trending/movie/day?language=en-US&api_key=${tmdbApiKey}`
          : "https://api.themoviedb.org/3/trending/movie/day?language=en-US";

        const response = await fetch(endpoint, {
          headers: tmdbReadToken
            ? {
                Authorization: `Bearer ${tmdbReadToken}`,
              }
            : undefined,
        });

        if (!response.ok) {
          throw new Error("Movie tip request failed");
        }

        const data: {
          results?: Array<{
            id?: number;
            title?: string;
            overview?: string;
            release_date?: string;
            vote_average?: number;
            poster_path?: string | null;
          }>;
        } = await response.json();

        const candidate = data.results?.find(
          (result) =>
            typeof result.id === "number" && typeof result.title === "string",
        );
        if (!candidate || typeof candidate.id !== "number" || !candidate.title) {
          throw new Error("Movie tip missing");
        }

        setMovieTip({
          id: candidate.id,
          title: candidate.title,
          overview: candidate.overview ?? "",
          releaseDate: candidate.release_date ?? "",
          voteAverage: candidate.vote_average ?? 0,
          posterPath: candidate.poster_path ?? null,
        });
        setMovieTipDateKey(todayKey);
        setMovieTipStatus("idle");
      } catch {
        setMovieTipStatus("error");
      }
    };

    void loadMovieTip();
  }, [movieTip, movieTipDateKey, showMovieTip]);

  const createList = () => {
    const title = newListTitle.trim();
    if (!title) {
      return;
    }

    const id = Date.now();
    setLists((prev) => [...prev, { id, title, input: "", items: [] }]);
    setBoardCards((prev) => [...prev, listBoardCardId(id)]);
    setNewListTitle("");
    setIsTodoCreatorOpen(false);
  };

  const removeList = (listId: number) => {
    setLists((prev) => prev.filter((list) => list.id !== listId));
    setBoardCards((prev) =>
      prev.filter((card) => card !== listBoardCardId(listId)),
    );
  };

  const updateListInput = (listId: number, input: string) => {
    setLists((prev) =>
      prev.map((list) => (list.id === listId ? { ...list, input } : list)),
    );
  };

  const addItemToList = (listId: number) => {
    setLists((prev) =>
      prev.map((list) => {
        if (list.id !== listId) {
          return list;
        }

        const text = list.input.trim();
        if (!text) {
          return list;
        }

        return {
          ...list,
          input: "",
          items: [...list.items, { id: Date.now(), text, done: false }],
        };
      }),
    );
  };

  const toggleItem = (listId: number, itemId: number) => {
    setLists((prev) =>
      prev.map((list) => {
        if (list.id !== listId) {
          return list;
        }

        return {
          ...list,
          items: list.items.map((item) =>
            item.id === itemId ? { ...item, done: !item.done } : item,
          ),
        };
      }),
    );
  };

  const moveBoardCard = (fromIndex: number, toIndex: number) => {
    setBoardCards((prev) => {
      if (toIndex < 0 || toIndex >= prev.length) {
        return prev;
      }

      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  };

  const handleBoardCardDragStart = (
    event: DragEvent<HTMLElement>,
    cardId: BoardCard,
  ) => {
    event.dataTransfer.effectAllowed = "move";
    setDraggedBoardCard(cardId);
  };

  const handleBoardCardDragOver = (
    event: DragEvent<HTMLElement>,
    cardId: BoardCard,
  ) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    if (dragOverBoardCard !== cardId) {
      setDragOverBoardCard(cardId);
    }
  };

  const handleBoardCardDrop = (
    event: DragEvent<HTMLElement>,
    targetCardId: BoardCard,
  ) => {
    event.preventDefault();

    if (draggedBoardCard === null || draggedBoardCard === targetCardId) {
      setDragOverBoardCard(null);
      return;
    }

    const fromIndex = boardCards.findIndex((card) => card === draggedBoardCard);
    const toIndex = boardCards.findIndex((card) => card === targetCardId);

    if (fromIndex !== -1 && toIndex !== -1) {
      moveBoardCard(fromIndex, toIndex);
    }

    setDragOverBoardCard(null);
    setDraggedBoardCard(null);
  };

  const handleBoardCardDragEnd = () => {
    setDragOverBoardCard(null);
    setDraggedBoardCard(null);
  };

  const createSummaryCard = () => {
    const title = newSummaryCardTitle.trim();
    if (!title) {
      return;
    }

    const id = Date.now();
    setSummaryCards((prev) => [
      ...prev,
      { id, title, typeInput: "", amountInput: "", items: [] },
    ]);
    setBoardCards((prev) => [...prev, summaryBoardCardId(id)]);
    setNewSummaryCardTitle("");
    setIsSummaryCreatorOpen(false);
  };

  const updateSummaryInputs = (
    cardId: number,
    nextTypeInput: string,
    nextAmountInput: string,
  ) => {
    setSummaryCards((prev) =>
      prev.map((card) =>
        card.id === cardId
          ? {
              ...card,
              typeInput: nextTypeInput,
              amountInput: nextAmountInput,
            }
          : card,
      ),
    );
  };

  const addSummaryItem = (cardId: number) => {
    setSummaryCards((prev) =>
      prev.map((card) => {
        if (card.id !== cardId) {
          return card;
        }

        const type = card.typeInput.trim();
        const amount = Number(card.amountInput);
        if (!type || Number.isNaN(amount) || amount < 0) {
          return card;
        }

        return {
          ...card,
          typeInput: "",
          amountInput: "",
          items: [...card.items, { id: Date.now(), type, amount }],
        };
      }),
    );
  };

  const removeSummaryItem = (cardId: number, itemId: number) => {
    setSummaryCards((prev) =>
      prev.map((card) =>
        card.id === cardId
          ? {
              ...card,
              items: card.items.filter((item) => item.id !== itemId),
            }
          : card,
      ),
    );
  };

  const removeSummaryCard = (cardId: number) => {
    setSummaryCards((prev) => prev.filter((card) => card.id !== cardId));
    setBoardCards((prev) =>
      prev.filter((card) => card !== summaryBoardCardId(cardId)),
    );
  };

  const calendarCells = getCalendarCells(currentMonth);
  const selectedDateEntries = calendarEntries.filter(
    (entry) => entry.date === selectedDateKey,
  );
  const todayDateKey = toDateKey(new Date());
  const todayEntries = calendarEntries.filter((entry) => entry.date === todayDateKey);
  const todayLabel = new Date(`${todayDateKey}T00:00:00`).toLocaleDateString(
    undefined,
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    },
  );
  const selectedDateLabel = new Date(`${selectedDateKey}T00:00:00`).toLocaleDateString(
    undefined,
    {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );

  const addCalendarEntry = () => {
    const title = calendarInput.trim();
    if (!title) {
      return;
    }
    setCalendarEntries((prev) => [
      ...prev,
      { id: Date.now(), date: selectedDateKey, title },
    ]);
    setCalendarInput("");
  };

  const removeCalendarEntry = (entryId: number) => {
    setCalendarEntries((prev) => prev.filter((entry) => entry.id !== entryId));
  };

  const previousMonth = () => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
    );
  };

  const closeCreateModal = () => {
    setIsTodoCreatorOpen(false);
    setIsSummaryCreatorOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex w-full max-w-6xl flex-col px-6 py-16 sm:px-10">
        <header className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-2">
            <RiseLogo />
            <p className="text-xs uppercase tracking-[0.12em] text-slate-400">
              Tip: Drag cards to reorder
            </p>
          </div>
          <div className="max-w-sm rounded-2xl border border-slate-700 px-4 py-2 text-right">
            <p className="text-sm text-slate-200">{weatherText}</p>
            <p className="text-xs text-slate-400">{dateTimeText}</p>
            <p className="text-xs text-cyan-300">{themeDayText}</p>
          </div>
        </header>

        <main className="flex flex-1 flex-col gap-8 py-10">
          <div className="grid w-full gap-4 md:grid-cols-[220px_minmax(0,1fr)]">
            <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Highlights
              </p>
              <div className="flex flex-wrap items-start gap-3">
                <button
                  type="button"
                  onClick={() => setShowMovieTip((prev) => !prev)}
                  className={`h-10 rounded-xl border px-4 text-xs font-semibold uppercase tracking-wide transition ${
                    showMovieTip
                      ? "border-cyan-400 bg-cyan-400/20 text-cyan-200"
                      : "border-slate-700 bg-slate-900/80 text-cyan-300 hover:scale-105 hover:border-cyan-400"
                  }`}
                >
                  MOVIE TIP
                </button>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Create
              </p>
              <div className="flex flex-wrap items-start gap-3">
                <button
                  type="button"
                  aria-label="Open todo list creator"
                  onClick={() => {
                    setIsSummaryCreatorOpen(false);
                    setIsTodoCreatorOpen(true);
                  }}
                  className="h-10 rounded-xl border border-slate-700 bg-slate-900/80 px-4 text-xs font-semibold uppercase tracking-wide text-cyan-300 transition hover:scale-105 hover:border-cyan-400"
                >
                  List
                </button>
                <button
                  type="button"
                  aria-label="Open summary card creator"
                  onClick={() => {
                    setIsTodoCreatorOpen(false);
                    setIsSummaryCreatorOpen(true);
                  }}
                  className="h-10 rounded-xl border border-slate-700 bg-slate-900/80 px-4 text-xs font-semibold uppercase tracking-wide text-cyan-300 transition hover:scale-105 hover:border-cyan-400"
                >
                  Summary
                </button>
              </div>
            </section>
          </div>

          {showMovieTip && (
            <section className="w-full rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Movie of the day
                </p>
                <span className="text-[0.7rem] uppercase tracking-[0.14em] text-cyan-300">
                  TMDB
                </span>
              </div>

              {movieTipStatus === "loading" && (
                <p className="text-sm text-slate-300">Loading movie tip...</p>
              )}

              {movieTipStatus === "missingKey" && (
                <p className="text-sm text-slate-300">
                  Add `VITE_TMDB_API_KEY` or `VITE_TMDB_READ_TOKEN` to show the movie tip.
                </p>
              )}

              {movieTipStatus === "error" && (
                <p className="text-sm text-slate-300">Could not load movie tip right now.</p>
              )}

              {movieTipStatus === "idle" && movieTip && (
                <a
                  href={`https://www.themoviedb.org/movie/${movieTip.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="grid gap-4 rounded-xl border border-slate-800 bg-slate-950/60 p-3 transition hover:border-cyan-400 md:grid-cols-[84px_1fr]"
                >
                  {movieTip.posterPath ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w185${movieTip.posterPath}`}
                      alt={`${movieTip.title} poster`}
                      className="h-28 w-20 rounded-lg object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="grid h-28 w-20 place-items-center rounded-lg border border-slate-800 text-[0.65rem] uppercase tracking-wide text-slate-500">
                      No poster
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-base font-semibold text-slate-100">{movieTip.title}</p>
                    <p className="mb-2 text-xs text-slate-400">
                      {movieTip.releaseDate || "Release date unknown"} • Rating{" "}
                      {movieTip.voteAverage.toFixed(1)}
                    </p>
                    <p className="text-sm text-slate-300">
                      {movieTip.overview || "No overview available."}
                    </p>
                  </div>
                </a>
              )}
            </section>
          )}

          <section className="grid gap-4 md:grid-cols-2">
            {boardCards.map((cardId) => {
            if (cardId === "calendar") {
              return (
                <section
                  key="calendar"
                  draggable
                  onDragStart={(event) => handleBoardCardDragStart(event, "calendar")}
                  onDragOver={(event) => handleBoardCardDragOver(event, "calendar")}
                  onDrop={(event) => handleBoardCardDrop(event, "calendar")}
                  onDragEnd={handleBoardCardDragEnd}
                  className={`rounded-2xl border bg-slate-900/70 p-5 transition ${
                    !isCalendarMinimized ? "md:col-span-2" : ""
                  } ${
                    dragOverBoardCard === "calendar"
                      ? "border-cyan-400"
                      : "border-slate-800"
                  } ${
                    draggedBoardCard === "calendar"
                      ? "cursor-grabbing opacity-70"
                      : "cursor-grab"
                  }`}
                >
                <div className="mb-4 flex items-center justify-between gap-4">
                  <p className="text-sm text-slate-300">Calendar</p>
                  <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsCalendarMinimized((prev) => !prev)}
                        className="mr-8 rounded-md border border-slate-700 px-2 py-1 text-xs text-slate-300 transition hover:border-cyan-400"
                      >
                        {isCalendarMinimized ? "Expand" : "Minimize"}
                      </button>
                      <button
                        type="button"
                        onClick={previousMonth}
                        aria-label="Previous month"
                        className="rounded-md border border-slate-700 px-3 py-1 text-xs text-slate-300 transition hover:border-cyan-400"
                      >
                        {"<"}
                      </button>
                      <p className="px-2 text-center text-sm font-semibold whitespace-nowrap">
                        {currentMonth.toLocaleDateString(undefined, {
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                      <button
                        type="button"
                        onClick={nextMonth}
                        aria-label="Next month"
                        className="rounded-md border border-slate-700 px-3 py-1 text-xs text-slate-300 transition hover:border-cyan-400"
                      >
                        {">"}
                      </button>
                    </div>
                  </div>

                  {isCalendarMinimized && (
                    <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">
                      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Today ({todayLabel})
                      </p>
                      <div className="space-y-2">
                        {todayEntries.length === 0 && (
                          <p className="text-sm text-slate-400">No entries for today.</p>
                        )}
                        {todayEntries.map((entry) => (
                          <div
                            key={entry.id}
                            className="flex items-center justify-between rounded-lg border border-slate-800 px-3 py-2 text-sm"
                          >
                            <span>{entry.title}</span>
                            <button
                              type="button"
                              onClick={() => removeCalendarEntry(entry.id)}
                              className="rounded-md border border-slate-700 px-2 py-1 text-xs text-slate-300 transition hover:border-rose-400 hover:text-rose-300"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {!isCalendarMinimized && (
                    <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
                      <div>
                        <div className="mb-2 grid grid-cols-7 gap-2">
                          {weekDays.map((day) => (
                            <p
                              key={day}
                              className="text-center text-xs font-semibold uppercase tracking-wide text-slate-400"
                            >
                              {day}
                            </p>
                          ))}
                        </div>
                        <div className="grid grid-cols-7 gap-2">
                          {calendarCells.map((cell) => {
                            const hasEntries = calendarEntries.some(
                              (entry) => entry.date === cell.dateKey,
                            );
                            const isSelected = cell.dateKey === selectedDateKey;
                            return (
                              <button
                                key={cell.dateKey}
                                type="button"
                                onClick={() => setSelectedDateKey(cell.dateKey)}
                                className={`relative rounded-lg border px-2 py-3 text-sm transition ${
                                  isSelected
                                    ? "border-cyan-400 bg-cyan-400/10"
                                    : "border-slate-800"
                                } ${cell.inCurrentMonth ? "text-slate-200" : "text-slate-500"}`}
                              >
                                {cell.date.getDate()}
                                {hasEntries && (
                                  <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-cyan-300" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">
                        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                          {selectedDateLabel}
                        </p>
                        <div className="mb-3 flex gap-2">
                          <input
                            value={calendarInput}
                            onChange={(event) => setCalendarInput(event.target.value)}
                            onKeyDown={(event) => {
                              if (event.key === "Enter") {
                                addCalendarEntry();
                              }
                            }}
                            placeholder="Add calendar item..."
                            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none transition focus:border-cyan-400"
                          />
                          <button
                            type="button"
                            onClick={addCalendarEntry}
                            className="rounded-lg bg-cyan-400 px-3 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
                          >
                            Add
                          </button>
                        </div>

                        <div className="space-y-2">
                          {selectedDateEntries.length === 0 && (
                            <p className="text-sm text-slate-400">No entries for this day.</p>
                          )}
                          {selectedDateEntries.map((entry) => (
                            <div
                              key={entry.id}
                              className="flex items-center justify-between rounded-lg border border-slate-800 px-3 py-2 text-sm"
                            >
                              <span>{entry.title}</span>
                              <button
                                type="button"
                                onClick={() => removeCalendarEntry(entry.id)}
                                className="rounded-md border border-slate-700 px-2 py-1 text-xs text-slate-300 transition hover:border-rose-400 hover:text-rose-300"
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </section>
              );
            }

            if (cardId.startsWith("list-")) {
              const listId = Number(cardId.replace("list-", ""));
              const list = lists.find((currentList) => currentList.id === listId);
              if (!list) {
                return null;
              }

              return (
                <article
                  key={cardId}
                  draggable
                  onDragStart={(event) => handleBoardCardDragStart(event, cardId)}
                  onDragOver={(event) => handleBoardCardDragOver(event, cardId)}
                  onDrop={(event) => handleBoardCardDrop(event, cardId)}
                  onDragEnd={handleBoardCardDragEnd}
                  className={`rounded-2xl border bg-slate-900/70 p-5 transition ${
                    dragOverBoardCard === cardId
                      ? "border-cyan-400"
                      : "border-slate-800"
                  } ${
                    draggedBoardCard === cardId
                      ? "cursor-grabbing opacity-70"
                      : "cursor-grab"
                  }`}
                >
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <h2 className="font-semibold">{list.title}</h2>
                    <button
                      type="button"
                      onClick={() => removeList(list.id)}
                      className="rounded-md border border-slate-700 px-2 py-1 text-xs text-slate-300 transition hover:border-rose-400 hover:text-rose-300"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="mb-4 flex gap-2">
                    <input
                      value={list.input}
                      onChange={(event) => updateListInput(list.id, event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          addItemToList(list.id);
                        }
                      }}
                      placeholder="Add task..."
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none transition focus:border-cyan-400"
                    />
                    <button
                      type="button"
                      onClick={() => addItemToList(list.id)}
                      className="rounded-lg bg-cyan-400 px-3 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
                    >
                      Add
                    </button>
                  </div>

                  <ul className="space-y-2">
                    {list.items.length === 0 && (
                      <li className="text-sm text-slate-400">No tasks yet.</li>
                    )}
                    {list.items.map((item) => (
                      <li key={item.id} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={item.done}
                          onChange={() => toggleItem(list.id, item.id)}
                          className="h-4 w-4"
                        />
                        <span className={item.done ? "text-slate-500 line-through" : ""}>
                          {item.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </article>
              );
            }

            if (!cardId.startsWith("summary-")) {
              return null;
            }

            const summaryId = Number(cardId.replace("summary-", ""));
            const summaryCard = summaryCards.find((card) => card.id === summaryId);
            if (!summaryCard) {
              return null;
            }

            const total = summaryCard.items.reduce(
              (sum, item) => sum + item.amount,
              0,
            );

            return (
              <section
                key={cardId}
                draggable
                onDragStart={(event) => handleBoardCardDragStart(event, cardId)}
                onDragOver={(event) => handleBoardCardDragOver(event, cardId)}
                onDrop={(event) => handleBoardCardDrop(event, cardId)}
                onDragEnd={handleBoardCardDragEnd}
                className={`rounded-2xl border bg-slate-900/70 p-5 transition ${
                  dragOverBoardCard === cardId ? "border-cyan-400" : "border-slate-800"
                } ${
                  draggedBoardCard === cardId
                    ? "cursor-grabbing opacity-70"
                    : "cursor-grab"
                }`}
              >
                <div className="mb-3 flex items-center justify-between gap-4">
                  <h2 className="font-semibold">{summaryCard.title}</h2>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => removeSummaryCard(summaryCard.id)}
                      className="rounded-md border border-slate-700 px-2 py-1 text-xs text-slate-300 transition hover:border-rose-400 hover:text-rose-300"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div className="mb-4 grid gap-3 md:grid-cols-[2fr_1fr_auto]">
                  <input
                    value={summaryCard.typeInput}
                    onChange={(event) =>
                      updateSummaryInputs(
                        summaryCard.id,
                        event.target.value,
                        summaryCard.amountInput,
                      )
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        addSummaryItem(summaryCard.id);
                      }
                    }}
                    placeholder="Type (e.g. Electricity)"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm outline-none transition focus:border-cyan-400"
                  />
                  <input
                    value={summaryCard.amountInput}
                    onChange={(event) =>
                      updateSummaryInputs(
                        summaryCard.id,
                        summaryCard.typeInput,
                        event.target.value,
                      )
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        addSummaryItem(summaryCard.id);
                      }
                    }}
                    placeholder="Amount (e.g. 775)"
                    inputMode="decimal"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm outline-none transition focus:border-cyan-400"
                  />
                  <button
                    type="button"
                    onClick={() => addSummaryItem(summaryCard.id)}
                    className="rounded-xl bg-cyan-400 px-5 py-2 font-semibold text-slate-950 transition hover:bg-cyan-300"
                  >
                    Add item
                  </button>
                </div>

                <div className="space-y-2">
                  {summaryCard.items.length === 0 && (
                    <p className="text-sm text-slate-400">No items yet.</p>
                  )}
                  {summaryCard.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-lg border border-slate-800 px-3 py-2 text-sm"
                    >
                      <span>{item.type}</span>
                      <div className="flex items-center gap-3">
                        <span>{item.amount.toFixed(2)}</span>
                        <button
                          type="button"
                          onClick={() => removeSummaryItem(summaryCard.id, item.id)}
                          className="rounded-md border border-slate-700 px-2 py-1 text-xs text-slate-300 transition hover:border-rose-400 hover:text-rose-300"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 border-t border-slate-800 pt-3 text-sm font-semibold text-cyan-300">
                  Total: {total.toFixed(2)}
                </div>
              </section>
            );
            })}
          </section>
        </main>
      </div>

      {(isTodoCreatorOpen || isSummaryCreatorOpen) && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 px-4"
          onClick={closeCreateModal}
        >
          <section
            className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-4 shadow-[0_20px_70px_rgba(0,0,0,0.55)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm text-slate-200">
                {isTodoCreatorOpen ? "Create a new todo list" : "Create a new summary card"}
              </p>
              <button
                type="button"
                onClick={closeCreateModal}
                className="rounded-md border border-slate-700 px-2 py-0.5 text-[0.7rem] text-slate-300 transition hover:border-cyan-400"
              >
                Close
              </button>
            </div>

            {isTodoCreatorOpen && (
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  value={newListTitle}
                  onChange={(event) => setNewListTitle(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      createList();
                    }
                  }}
                  placeholder="List name..."
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none transition focus:border-cyan-400"
                />
                <button
                  type="button"
                  onClick={createList}
                  className="rounded-lg bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
                >
                  Add
                </button>
              </div>
            )}

            {isSummaryCreatorOpen && (
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  value={newSummaryCardTitle}
                  onChange={(event) => setNewSummaryCardTitle(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      createSummaryCard();
                    }
                  }}
                  placeholder="Card title..."
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none transition focus:border-cyan-400"
                />
                <button
                  type="button"
                  onClick={createSummaryCard}
                  className="rounded-lg bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
                >
                  Add
                </button>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

export default App;
