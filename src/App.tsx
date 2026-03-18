import { useEffect, useState } from "react";

type EventItem = {
  id: number;
  name: string;
  dateTime: string;
  info: string;
  attendeeIds: number[];
};

const mockUsers = [
  {
    id: 1,
    fullName: "Emma Richardson",
    email: "emma.richardson@rise.app",
    location: "Stockholm",
    status: "Online",
    nextPlan: "Coffee after work",
  },
  {
    id: 2,
    fullName: "Lucas Bennett",
    email: "lucas.bennett@rise.app",
    location: "Gothenburg",
    status: "Away",
    nextPlan: "Gym session tonight",
  },
  {
    id: 3,
    fullName: "Sofia Martinez",
    email: "sofia.martinez@rise.app",
    location: "Malmo",
    status: "Online",
    nextPlan: "Lunch downtown",
  },
  {
    id: 4,
    fullName: "Noah Peterson",
    email: "noah.peterson@rise.app",
    location: "Uppsala",
    status: "Offline",
    nextPlan: "Weekend hiking plan",
  },
  {
    id: 5,
    fullName: "Ava Collins",
    email: "ava.collins@rise.app",
    location: "Oslo",
    status: "Online",
    nextPlan: "Remote coworking",
  },
  {
    id: 6,
    fullName: "Mason Lee",
    email: "mason.lee@rise.app",
    location: "Copenhagen",
    status: "Busy",
    nextPlan: "Late dinner meetup",
  },
];

const currentUser = {
  id: 99,
  fullName: "Mia Nelson",
  email: "mia.nelson@rise.app",
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

function initialsFor(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatEventDateTime(value: string) {
  if (!value) {
    return "No time selected";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

function RiseLogo() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative grid h-14 w-14 place-items-center overflow-hidden rounded-[1.6rem] border border-cyan-100/30 bg-[linear-gradient(160deg,rgba(14,116,144,0.95),rgba(15,23,42,0.98))] shadow-[0_0_45px_rgba(34,211,238,0.2)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(186,230,253,0.4),transparent_48%)]" />
        <div className="absolute inset-[3px] rounded-[1.35rem] border border-white/10" />
        <svg
          viewBox="0 0 64 64"
          aria-hidden="true"
          className="relative h-10 w-10 drop-shadow-[0_6px_16px_rgba(125,211,252,0.25)]"
        >
          <defs>
            <linearGradient id="rise-sun" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef3c7" />
              <stop offset="55%" stopColor="#fde68a" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
            <linearGradient id="rise-wave" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#67e8f9" />
              <stop offset="100%" stopColor="#0ea5e9" />
            </linearGradient>
          </defs>
          <path
            d="M14 42c5-6 12-9 18-9s13 3 18 9"
            fill="none"
            stroke="url(#rise-wave)"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M18 49c4-3 8-4 14-4s10 1 14 4"
            fill="none"
            stroke="#c4b5fd"
            strokeOpacity="0.35"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M22 34a10 10 0 0 1 20 0"
            fill="none"
            stroke="url(#rise-sun)"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <path
            d="M32 13v7M20 18l4 4M44 18l-4 4"
            fill="none"
            stroke="#fef9c3"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <div className="leading-none">
        <p className="bg-gradient-to-r from-cyan-100 via-sky-200 to-cyan-300 bg-clip-text text-[1.9rem] font-black tracking-[-0.04em] text-transparent">
          Rise
        </p>
        <p className="mt-1 text-[0.72rem] tracking-[0.08em] text-slate-400">
          Meet more. Do more. Rise.
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
  const [searchTerm, setSearchTerm] = useState("");
  const [friendIds, setFriendIds] = useState<number[]>([1, 3]);
  const [eventName, setEventName] = useState("");
  const [eventDateTime, setEventDateTime] = useState("");
  const [eventInfo, setEventInfo] = useState("");
  const [selectedEventFriendIds, setSelectedEventFriendIds] = useState<number[]>(
    [1],
  );
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isEventComposerOpen, setIsEventComposerOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setDateTimeText(formatLocalDateTime(new Date()));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const query = searchTerm.trim().toLowerCase();
  const filteredUsers = mockUsers.filter((user) => {
    if (!query) {
      return false;
    }

    return (
      user.fullName.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    );
  });

  const friends = mockUsers.filter((user) => friendIds.includes(user.id));
  const addFriend = (userId: number) => {
    setFriendIds((prev) => (prev.includes(userId) ? prev : [...prev, userId]));
  };
  const toggleEventFriend = (userId: number) => {
    setSelectedEventFriendIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };
  const createEvent = () => {
    const trimmedName = eventName.trim();
    if (!trimmedName || !eventDateTime || selectedEventFriendIds.length === 0) {
      return;
    }

    setEvents((prev) => [
      {
        id: Date.now(),
        name: trimmedName,
        dateTime: eventDateTime,
        info: eventInfo.trim(),
        attendeeIds: selectedEventFriendIds,
      },
      ...prev,
    ]);
    setEventName("");
    setEventDateTime("");
    setEventInfo("");
    setSelectedEventFriendIds(friends[0] ? [friends[0].id] : []);
  };

  useEffect(() => {
    setSelectedEventFriendIds((prev) => {
      const validIds = prev.filter((id) => friendIds.includes(id));
      if (validIds.length > 0) {
        return validIds;
      }

      return friendIds[0] ? [friendIds[0]] : [];
    });
  }, [friendIds]);

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
          // Keep the fallback location if reverse geocoding fails.
        }

        setWeatherText(
          `${locationName} ${Math.round(temp)}C ${weatherLabel(code)}`,
        );
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-16 sm:px-10">
        <header className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-5">
            <RiseLogo />
            <div>
              <h1 className="text-3xl font-semibold tracking-[-0.03em] text-slate-100">
                {currentUser.fullName}
              </h1>
            </div>
          </div>

          <div className="w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-left sm:text-right">
            <p className="text-sm text-slate-200">{weatherText}</p>
            <p className="text-xs text-slate-400">{dateTimeText}</p>
          </div>
        </header>

        <main className="mt-12">
          <section className="mb-6 rounded-[1.75rem] border border-slate-800/80 bg-slate-900/35 p-4 backdrop-blur">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[0.65rem] uppercase tracking-[0.18em] text-slate-500">
                  Friends
                </p>
              </div>
              <div className="flex flex-wrap gap-2 text-[0.65rem] uppercase tracking-[0.16em]">
                <span className="rounded-full border border-slate-700 bg-slate-950/60 px-3 py-1.5 text-slate-300">
                  {friends.length} total
                </span>
              </div>
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-2 xl:grid-cols-4">
              {friends.map((friend) => (
                <article
                  key={friend.id}
                  className="rounded-[1.35rem] border border-slate-800/80 bg-slate-950/45 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-xl border border-cyan-400/15 bg-cyan-400/8 text-xs font-semibold text-cyan-100">
                      {initialsFor(friend.fullName)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-100">
                        {friend.fullName}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        {friend.location} - {friend.nextPlan}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section>
            <article className="rounded-[2rem] border border-slate-800/80 bg-slate-900/35 p-5 shadow-[0_20px_80px_rgba(2,12,27,0.35)] backdrop-blur">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[0.7rem] uppercase tracking-[0.2em] text-slate-500">
                    Friends Search
                  </p>
                  <h2 className="mt-2 text-xl font-medium tracking-[-0.03em] text-slate-100">
                    Search for a friend
                  </h2>
                </div>
                <p className="text-sm text-slate-500">
                  Results only appear after you search.
                </p>
              </div>

              <div className="mt-5">
                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search by full name or email..."
                  className="w-full rounded-2xl border border-slate-800 bg-slate-950/55 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-slate-600"
                />
              </div>

              <div className="mt-5 space-y-3">
                {filteredUsers.map((user) => (
                  <article
                    key={user.id}
                    className="flex flex-col gap-3 rounded-2xl border border-slate-800/80 bg-slate-950/40 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="text-base font-medium text-slate-100">
                        {user.fullName}
                      </p>
                      <p className="text-sm text-slate-400">{user.email}</p>
                    </div>
                    {friendIds.includes(user.id) ? (
                      <span className="inline-flex w-fit rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs uppercase tracking-[0.16em] text-emerald-200">
                        Friend added
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => addFriend(user.id)}
                        className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-xs uppercase tracking-[0.16em] text-cyan-200 transition hover:border-cyan-300 hover:bg-cyan-400/20"
                      >
                        Add friend
                      </button>
                    )}
                  </article>
                ))}
                {!query && (
                  <div className="rounded-2xl border border-dashed border-slate-800 px-4 py-8 text-center text-sm text-slate-500">
                    Start typing to find a friend.
                  </div>
                )}
                {query && filteredUsers.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-slate-700 px-4 py-8 text-center text-sm text-slate-400">
                    No users matched your search.
                  </div>
                )}
              </div>
            </article>
          </section>

          <section className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            <article className="rounded-[2rem] border border-slate-800/80 bg-slate-900/35 p-5 shadow-[0_20px_80px_rgba(2,12,27,0.35)] backdrop-blur">
              <button
                type="button"
                onClick={() => setIsEventComposerOpen((prev) => !prev)}
                className="group w-full rounded-[1.6rem] border border-slate-800/80 bg-slate-950/35 p-4 text-left transition hover:border-slate-700 hover:bg-slate-950/50"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="relative grid h-11 w-11 place-items-center rounded-2xl border border-cyan-400/20 bg-cyan-400/8 text-cyan-200">
                      <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_top,rgba(103,232,249,0.16),transparent_65%)]" />
                      <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        className="relative h-5 w-5"
                      >
                        <path
                          d="M7 3v3M17 3v3M4 9h16M6 6h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[0.7rem] uppercase tracking-[0.2em] text-slate-500">
                        Event
                      </p>
                      <h2 className="mt-1 text-xl font-medium tracking-[-0.03em] text-slate-100">
                        Create an event
                      </h2>
                    </div>
                  </div>

                  <div
                    className={`grid h-10 w-10 place-items-center rounded-full border border-slate-700 bg-slate-900/80 text-slate-400 transition duration-200 ${
                      isEventComposerOpen ? "rotate-180 border-cyan-400/30 text-cyan-200" : ""
                    }`}
                  >
                    <svg
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                      className="h-4 w-4"
                    >
                      <path
                        d="m5 8 5 5 5-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>

              </button>

              {isEventComposerOpen ? (
                <>
                  <p className="mt-3 text-sm text-slate-500">
                    Invite people from your current friends only.
                  </p>

                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <label className="block">
                      <span className="text-xs uppercase tracking-[0.16em] text-slate-500">
                        Event name
                      </span>
                      <input
                        value={eventName}
                        onChange={(event) => setEventName(event.target.value)}
                        placeholder="Event name"
                        className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950/55 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-slate-600"
                      />
                    </label>

                    <label className="block">
                      <span className="text-xs uppercase tracking-[0.16em] text-slate-500">
                        Time
                      </span>
                      <input
                        type="datetime-local"
                        value={eventDateTime}
                        onChange={(event) => setEventDateTime(event.target.value)}
                        className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950/55 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-slate-600"
                      />
                    </label>
                  </div>

                  <div className="mt-4">
                    <label className="block">
                      <span className="text-xs uppercase tracking-[0.16em] text-slate-500">
                        Event info
                      </span>
                      <textarea
                        value={eventInfo}
                        onChange={(event) => setEventInfo(event.target.value)}
                        placeholder="Write something about the event..."
                        rows={4}
                        className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950/55 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-slate-600"
                      />
                    </label>
                  </div>

                  <div className="mt-5">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                        Add friends
                      </p>
                      <p className="text-xs text-slate-500">
                        {selectedEventFriendIds.length} selected
                      </p>
                    </div>

                    <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                      {friends.map((friend) => {
                        const isSelected = selectedEventFriendIds.includes(friend.id);

                        return (
                          <button
                            key={friend.id}
                            type="button"
                            onClick={() => toggleEventFriend(friend.id)}
                            className={`rounded-xl border px-3 py-2 text-left transition ${
                              isSelected
                                ? "border-cyan-400/40 bg-cyan-400/10"
                                : "border-slate-800 bg-slate-950/40 hover:border-slate-700"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <div className="grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-cyan-400/15 bg-cyan-400/8 text-[0.65rem] font-semibold text-cyan-100">
                                {initialsFor(friend.fullName)}
                              </div>
                              <div className="min-w-0">
                                <p className="truncate text-sm font-medium text-slate-100">
                                  {friend.fullName}
                                </p>
                                <p className="truncate text-[0.7rem] text-slate-500">
                                  {friend.location}
                                </p>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-5">
                    <button
                      type="button"
                      onClick={createEvent}
                      disabled={
                        !eventName.trim() ||
                        !eventDateTime ||
                        selectedEventFriendIds.length === 0
                      }
                      className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-5 py-2.5 text-xs uppercase tracking-[0.16em] text-cyan-200 transition hover:border-cyan-300 hover:bg-cyan-400/20 disabled:cursor-not-allowed disabled:border-slate-800 disabled:bg-slate-900 disabled:text-slate-500"
                    >
                      Create event
                    </button>
                  </div>
                </>
              ) : (
                <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                  <span className="rounded-full border border-slate-800 bg-slate-950/40 px-3 py-1.5">
                    {events.length} created
                  </span>
                  <span className="rounded-full border border-slate-800 bg-slate-950/40 px-3 py-1.5">
                    {friends.length} friends available
                  </span>
                </div>
              )}
            </article>

            <article className="rounded-[2rem] border border-slate-800/80 bg-slate-900/35 p-5 shadow-[0_20px_80px_rgba(2,12,27,0.35)] backdrop-blur">
              <div>
                <p className="text-[0.7rem] uppercase tracking-[0.2em] text-slate-500">
                  Planned
                </p>
                <h2 className="mt-2 text-xl font-medium tracking-[-0.03em] text-slate-100">
                  Upcoming events
                </h2>
              </div>

              <div className="mt-5 space-y-3">
                {events.map((eventItem) => {
                  const attendees = friends.filter((friend) =>
                    eventItem.attendeeIds.includes(friend.id),
                  );

                  return (
                    <article
                      key={eventItem.id}
                      className="rounded-2xl border border-slate-800 bg-slate-950/40 px-4 py-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-base font-medium text-slate-100">
                            {eventItem.name}
                          </p>
                          <p className="mt-1 text-sm text-slate-400">
                            {formatEventDateTime(eventItem.dateTime)}
                          </p>
                        </div>
                      </div>

                      {eventItem.info && (
                        <p className="mt-3 text-sm leading-6 text-slate-400">
                          {eventItem.info}
                        </p>
                      )}

                      <div className="mt-4 flex flex-wrap gap-2">
                        {attendees.map((friend) => (
                          <span
                            key={friend.id}
                            className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1 text-xs text-slate-300"
                          >
                            {friend.fullName}
                          </span>
                        ))}
                      </div>
                    </article>
                  );
                })}

                {events.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-slate-800 px-4 py-8 text-center text-sm text-slate-500">
                    No events created yet.
                  </div>
                )}
              </div>
            </article>
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
