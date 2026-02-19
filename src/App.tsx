import { useEffect, useState } from "react";

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

function App() {
  const [weatherText, setWeatherText] = useState("Checking weather...");
  const [dateTimeText, setDateTimeText] = useState(
    formatLocalDateTime(new Date()),
  );
  const [themeDayText, setThemeDayText] = useState("Temadag laddas...");
  const [newListTitle, setNewListTitle] = useState("");
  const [lists, setLists] = useState<TodoList[]>([]);

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

  const createList = () => {
    const title = newListTitle.trim();
    if (!title) {
      return;
    }

    setLists((prev) => [
      ...prev,
      { id: Date.now(), title, input: "", items: [] },
    ]);
    setNewListTitle("");
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

  const moveList = (fromIndex: number, toIndex: number) => {
    setLists((prev) => {
      if (toIndex < 0 || toIndex >= prev.length) {
        return prev;
      }

      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex w-full max-w-6xl flex-col px-6 py-16 sm:px-10">
        <header className="flex items-center justify-between gap-4">
          <p className="text-lg font-semibold tracking-tight">Rise</p>
          <div className="max-w-sm rounded-2xl border border-slate-700 px-4 py-2 text-right">
            <p className="text-sm text-slate-200">{weatherText}</p>
            <p className="text-xs text-slate-400">{dateTimeText}</p>
            <p className="text-xs text-cyan-300">{themeDayText}</p>
          </div>
        </header>

        <main className="flex flex-1 flex-col gap-8 py-10">
          <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <p className="mb-3 text-sm text-slate-300">Create a new todo list</p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                value={newListTitle}
                onChange={(event) => setNewListTitle(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    createList();
                  }
                }}
                placeholder="List name..."
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm outline-none transition focus:border-cyan-400"
              />
              <button
                type="button"
                onClick={createList}
                className="rounded-xl bg-cyan-400 px-5 py-2 font-semibold text-slate-950 transition hover:bg-cyan-300"
              >
                Add list
              </button>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            {lists.length === 0 && (
              <p className="rounded-2xl border border-dashed border-slate-700 p-6 text-sm text-slate-400">
                No lists yet. Create your first list above.
              </p>
            )}

            {lists.map((list, index) => (
              <article
                key={list.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5"
              >
                <div className="mb-4 flex items-center justify-between gap-4">
                  <h2 className="font-semibold">{list.title}</h2>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => moveList(index, index - 1)}
                      disabled={index === 0}
                      className="rounded-lg border border-slate-700 px-3 py-1 text-xs transition hover:border-cyan-400 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Up
                    </button>
                    <button
                      type="button"
                      onClick={() => moveList(index, index + 1)}
                      disabled={index === lists.length - 1}
                      className="rounded-lg border border-slate-700 px-3 py-1 text-xs transition hover:border-cyan-400 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Down
                    </button>
                  </div>
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
            ))}
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
