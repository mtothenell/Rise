import { useMemo, useState } from "react";
import type { FormEvent } from "react";

type LifeEvent = {
  id: number;
  title: string;
  date: string;
  category: string;
  summary: string;
  story: string;
};

const initialEvents: LifeEvent[] = [
  {
    id: 1,
    title: "Moved Out",
    date: "2020-08-10",
    category: "Personal Milestone",
    summary: "The first apartment and the start of a new chapter.",
    story:
      "I carried in the last boxes late that evening and realized everything was my responsibility now. It was intimidating, but it was also the first time life felt completely my own.",
  },
  {
    id: 2,
    title: "Got Married",
    date: "2021-05-17",
    category: "Relationships",
    summary: "A day that changed everything and set the tone for the future.",
    story:
      "We got married on May 17, 2021 surrounded by family and friends. It was warm, chaotic, beautiful, and exactly right. I never want to forget the feeling of everything standing still in that moment.",
  },
  {
    id: 3,
    title: "Had a Child",
    date: "2022-06-22",
    category: "Family",
    summary: "The world became bigger and more important at the same time.",
    story:
      "On June 22, 2022, our child entered the world. Nothing had ever felt so fragile and so powerful at the same time. From that day on, everything had a new center.",
  },
  {
    id: 4,
    title: "Changed Careers",
    date: "2024-01-08",
    category: "Career",
    summary: "Left the safe option and chose something that actually felt meaningful.",
    story:
      "I resigned after a long period of hesitation and stepped into work that felt more aligned with who I am. The decision was heavy, but the relief afterward was even greater.",
  },
  {
    id: 5,
    title: "Graduated",
    date: "2018-06-14",
    category: "Personal Milestone",
    summary: "Finished a long chapter and stepped into something unknown.",
    story:
      "Graduation felt less like an ending and more like a threshold. There was pride, relief, and a quiet fear about what came next, all at once.",
  },
  {
    id: 6,
    title: "Started Therapy",
    date: "2019-11-03",
    category: "Personal Milestone",
    summary: "A private decision that changed how I understood myself.",
    story:
      "Starting therapy was one of the most important invisible milestones in my life. It did not look dramatic from the outside, but it shifted the way I thought, coped, and related to people.",
  },
  {
    id: 7,
    title: "Moved Abroad",
    date: "2023-02-18",
    category: "Travel",
    summary: "Left home behind and learned how much of life can be rebuilt.",
    story:
      "Moving to another country meant rebuilding routines, friendships, and confidence from scratch. It was disorienting at first, but it made the world feel far bigger and more open.",
  },
  {
    id: 8,
    title: "Bought a Home",
    date: "2024-09-05",
    category: "Family",
    summary: "Turned a long-term dream into something solid and real.",
    story:
      "Signing the final papers felt surreal. The house was not just a purchase, it was a symbol of stability, effort, and the life we were trying to build together.",
  },
  {
    id: 9,
    title: "Lost Someone Close",
    date: "2025-01-27",
    category: "Relationships",
    summary: "A painful moment that permanently changed the shape of things.",
    story:
      "Loss rearranged my sense of time. It made old memories sharper, ordinary days heavier, and the people still around me feel more precious than before.",
  },
  {
    id: 10,
    title: "Learned to Drive",
    date: "2015-09-02",
    category: "Personal Milestone",
    summary: "A new kind of freedom arrived with a license in hand.",
    story:
      "Passing my driving test felt bigger than it looked from the outside. It meant independence, movement, and the first real taste of going where I wanted on my own terms.",
  },
  {
    id: 11,
    title: "First Job",
    date: "2016-04-11",
    category: "Career",
    summary: "The first paycheck made adulthood feel real.",
    story:
      "My first job was tiring, awkward, and formative. It taught me responsibility, patience, and what it meant to earn something through time and effort.",
  },
  {
    id: 12,
    title: "Met My Best Friend",
    date: "2016-11-19",
    category: "Relationships",
    summary: "A random meeting became one of the most important relationships in my life.",
    story:
      "We met in a way that felt completely ordinary at the time. Looking back, that meeting changed more about my life than I could have understood then.",
  },
  {
    id: 13,
    title: "Took My First Solo Trip",
    date: "2017-08-07",
    category: "Travel",
    summary: "Being alone in a new place changed the way I saw myself.",
    story:
      "Traveling alone made every choice feel sharper. I learned that confidence sometimes appears only after you are already far from what feels familiar.",
  },
  {
    id: 14,
    title: "Started University",
    date: "2017-09-04",
    category: "Personal Milestone",
    summary: "A new environment, new people, and a different version of the future.",
    story:
      "The first weeks felt overwhelming and electric at the same time. Everything was unfamiliar, which also meant everything felt possible.",
  },
  {
    id: 15,
    title: "Got My Own Dog",
    date: "2018-10-21",
    category: "Family",
    summary: "Daily life changed in small ways that became meaningful.",
    story:
      "It was not just about having a pet. It was about routine, comfort, companionship, and realizing how much joy can come from being needed every day.",
  },
  {
    id: 16,
    title: "Ran My First Half Marathon",
    date: "2019-05-12",
    category: "Personal Milestone",
    summary: "Proof that consistency can become something visible.",
    story:
      "I remember the exhaustion, but even more the quiet pride afterward. It was one of those rare moments where effort turned into something undeniable.",
  },
  {
    id: 17,
    title: "Moved in Together",
    date: "2020-02-14",
    category: "Relationships",
    summary: "Love became practical, shared, and real in everyday ways.",
    story:
      "Moving in together changed the relationship from occasional moments into a full shared life. It brought closeness, friction, laughter, and a stronger sense of us.",
  },
  {
    id: 18,
    title: "Lost My Job",
    date: "2020-12-03",
    category: "Career",
    summary: "A hard ending that forced a different beginning.",
    story:
      "At the time it felt like failure. Later it became clear that losing that job pushed me into decisions I would not have made otherwise, and many of them were necessary.",
  },
  {
    id: 19,
    title: "Started a Business",
    date: "2021-02-08",
    category: "Career",
    summary: "An uncertain leap into something fully my own.",
    story:
      "Starting a business meant choosing uncertainty on purpose. It demanded more courage, discipline, and patience than I expected, but it also made me feel more alive.",
  },
  {
    id: 20,
    title: "Got Engaged",
    date: "2021-09-26",
    category: "Relationships",
    summary: "A promise that made the future feel tangible.",
    story:
      "The proposal itself was a blur of surprise and emotion. What stayed with me afterward was the calm certainty that we were building toward the same life.",
  },
  {
    id: 21,
    title: "Welcomed a Second Child",
    date: "2023-11-14",
    category: "Family",
    summary: "The family expanded, and so did the heart of the home.",
    story:
      "The second child changed the rhythm of everything. Life became louder, fuller, more chaotic, and somehow even more tender than before.",
  },
  {
    id: 22,
    title: "Published My First Book",
    date: "2024-03-29",
    category: "Career",
    summary: "Years of private work finally became public.",
    story:
      "Seeing my name on a finished book felt unreal. It was one of those achievements that carries not just pride, but relief that the invisible effort mattered.",
  },
  {
    id: 23,
    title: "Reconnected With Family",
    date: "2024-05-18",
    category: "Relationships",
    summary: "A difficult conversation opened the door to healing.",
    story:
      "The reconnection did not erase the years in between, but it changed what came after. Sometimes growth looks less like triumph and more like choosing to return.",
  },
  {
    id: 24,
    title: "Took a Year Off",
    date: "2024-07-01",
    category: "Personal Milestone",
    summary: "Stepping back made space for reflection and reset.",
    story:
      "A year off felt risky in a world that rewards constant momentum. But it gave me room to breathe, recover, and decide what kind of life I actually wanted to build.",
  },
  {
    id: 25,
    title: "Saw the Northern Lights",
    date: "2024-12-12",
    category: "Travel",
    summary: "A rare night that felt almost unreal.",
    story:
      "Watching the sky move like that made everything else feel small for a while. It was one of the clearest reminders that wonder still exists in adulthood.",
  },
  {
    id: 30,
    title: "Started Journaling Again",
    date: "2024-01-19",
    category: "Personal Milestone",
    summary: "Returned to a habit that made daily life feel more visible.",
    story:
      "Writing again helped slow everything down. It gave shape to thoughts that had been moving too quickly to understand in real time.",
  },
  {
    id: 31,
    title: "Launched a Side Project",
    date: "2024-02-11",
    category: "Career",
    summary: "An idea finally moved from notes into the real world.",
    story:
      "The launch was small by most standards, but important to me. It marked the moment something private became something shared.",
  },
  {
    id: 32,
    title: "Hosted a Big Family Dinner",
    date: "2024-02-25",
    category: "Family",
    summary: "A crowded evening that made home feel fully alive.",
    story:
      "The table was loud, imperfect, and full. It reminded me that some of the best milestones do not look historic while they are happening.",
  },
  {
    id: 33,
    title: "Visited Japan",
    date: "2024-04-21",
    category: "Travel",
    summary: "A long-held dream finally became real.",
    story:
      "Being there felt both exciting and strangely calm. Some places live in your imagination for years, and it changes you when they finally become real.",
  },
  {
    id: 34,
    title: "Started Learning Piano",
    date: "2024-05-07",
    category: "Personal Milestone",
    summary: "Became a beginner again on purpose.",
    story:
      "Learning piano was humbling in the best way. It reminded me how growth feels when progress is slow, awkward, and still worth pursuing.",
  },
  {
    id: 35,
    title: "Got Promoted",
    date: "2024-06-03",
    category: "Career",
    summary: "Recognition arrived at a moment when confidence needed it.",
    story:
      "The promotion meant more than the title itself. It felt like evidence that quiet work, done consistently, had actually been seen.",
  },
  {
    id: 36,
    title: "Renewed Wedding Vows",
    date: "2024-08-16",
    category: "Relationships",
    summary: "A softer, deeper version of a promise made years earlier.",
    story:
      "There was less spectacle this time and more clarity. It felt less like a ceremony and more like a meaningful pause in the middle of a shared life.",
  },
  {
    id: 37,
    title: "Finished a Major Renovation",
    date: "2024-09-28",
    category: "Family",
    summary: "A stressful project finally turned into a better home.",
    story:
      "The renovation tested our patience for months. Finishing it brought relief, pride, and the satisfying feeling of seeing effort become something physical.",
  },
  {
    id: 38,
    title: "Spoke at a Conference",
    date: "2024-10-10",
    category: "Career",
    summary: "Stepped into public visibility with more confidence than expected.",
    story:
      "I was nervous until the moment I started. After that, it turned into one of those experiences that permanently changes how capable you think you are.",
  },
  {
    id: 39,
    title: "Took a Winter Cabin Trip",
    date: "2024-11-23",
    category: "Travel",
    summary: "A quiet weekend that reset everything.",
    story:
      "The cold, the silence, and the distance from normal life made everything feel clearer. It was one of those small experiences that lingers much longer than expected.",
  },
  {
    id: 26,
    title: "Adopted a Cat",
    date: "2025-02-20",
    category: "Family",
    summary: "A small presence that changed the atmosphere of home.",
    story:
      "The cat arrived quietly and somehow changed the mood of the apartment almost immediately. Home felt softer, calmer, and a little more alive.",
  },
  {
    id: 27,
    title: "Finished Paying Off Debt",
    date: "2025-04-03",
    category: "Personal Milestone",
    summary: "A quiet victory that brought relief more than celebration.",
    story:
      "There was no dramatic moment, just a number finally reaching zero. But that silence carried years of work, discipline, and anxiety finally lifting.",
  },
  {
    id: 28,
    title: "Won an Award",
    date: "2025-06-16",
    category: "Career",
    summary: "Recognition arrived after a long stretch of doubt.",
    story:
      "The award was meaningful not because it was public, but because it arrived after a season where I had questioned whether any of the work was good enough.",
  },
  {
    id: 29,
    title: "Moved to the Coast",
    date: "2025-08-24",
    category: "Travel",
    summary: "A new landscape reshaped daily life and pace.",
    story:
      "Living near the water changed more than the view. It changed my mornings, my nervous system, and the speed at which everyday life seemed to move.",
  },
];

const categoryStyles: Record<string, string> = {
  Family: "bg-amber-300/16 text-amber-100 border-amber-200/20",
  Relationships: "bg-rose-300/16 text-rose-100 border-rose-200/20",
  Career: "bg-cyan-300/16 text-cyan-100 border-cyan-200/20",
  "Personal Milestone":
    "bg-emerald-300/16 text-emerald-100 border-emerald-200/20",
  Travel: "bg-violet-300/16 text-violet-100 border-violet-200/20",
};

function PathLogo() {
  return (
    <div className="relative grid h-16 w-16 place-items-center overflow-hidden rounded-[1.5rem] border border-cyan-100/15 bg-[linear-gradient(145deg,rgba(6,14,24,0.98),rgba(16,39,60,0.96))] shadow-[0_18px_40px_rgba(2,12,27,0.45)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(103,232,249,0.18),transparent_40%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),transparent_45%,rgba(0,0,0,0.2))]" />
      <div className="absolute inset-[3px] rounded-[1.25rem] border border-white/8" />
      <div className="absolute inset-x-3 bottom-3 h-px bg-[linear-gradient(90deg,transparent,rgba(251,191,36,0.7),transparent)]" />
      <span className="relative bg-[linear-gradient(180deg,#f8fafc,#bae6fd_58%,#fbbf24)] bg-clip-text text-[0.78rem] font-black tracking-[0.28em] text-transparent [text-shadow:0_8px_24px_rgba(34,211,238,0.18)]">
        PATH
      </span>
    </div>
  );
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

function getYearProgress(date: string) {
  const value = new Date(date);
  const year = value.getFullYear();
  const start = new Date(year, 0, 1);
  const end = new Date(year + 1, 0, 1);
  const elapsed = value.getTime() - start.getTime();
  const total = end.getTime() - start.getTime();

  return total === 0 ? 0 : elapsed / total;
}

function getCurvePoint(progress: number) {
  const x = 10 + progress * 80;
  const y = 50 + Math.sin(progress * Math.PI * 1.35 - 0.35) * 10;

  return { x, y, progress };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

const monthLabels = ["Jan", "Mar", "May", "Jul", "Sep", "Nov", "Dec"];

function App() {
  const [events, setEvents] = useState<LifeEvent[]>(initialEvents);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [currentYear, setCurrentYear] = useState<number>(
    new Date(initialEvents[2].date).getFullYear(),
  );
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("Family");
  const [summary, setSummary] = useState("");
  const [story, setStory] = useState("");

  const sortedEvents = useMemo(
    () =>
      [...events].sort(
        (left, right) =>
          new Date(left.date).getTime() - new Date(right.date).getTime(),
      ),
    [events],
  );

  const latestEvent = sortedEvents[sortedEvents.length - 1];
  const years = useMemo(
    () =>
      Array.from(new Set(sortedEvents.map((event) => new Date(event.date).getFullYear()))),
    [sortedEvents],
  );
  const yearEvents = useMemo(
    () =>
      sortedEvents.filter(
        (event) => new Date(event.date).getFullYear() === currentYear,
      ),
    [currentYear, sortedEvents],
  );
  const selectedYearEvent =
    yearEvents.find((event) => event.id === selectedId) ?? null;

  const submitEvent = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim() || !date || !story.trim()) {
      return;
    }

    const nextEvent: LifeEvent = {
      id: Date.now(),
      title: title.trim(),
      date,
      category,
      summary: summary.trim() || "A new chapter worth remembering.",
      story: story.trim(),
    };

    setEvents((current) => [...current, nextEvent]);
    setSelectedId(nextEvent.id);
    setCurrentYear(new Date(nextEvent.date).getFullYear());
    setTitle("");
    setDate("");
    setCategory("Family");
    setSummary("");
    setStory("");
    setIsComposerOpen(false);
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#0b1930] text-slate-50">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(103,232,249,0.24),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(251,191,36,0.16),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent)]" />
      <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:88px_88px]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-8 sm:px-8 lg:px-10">
        <header className="flex flex-col gap-6 rounded-[2rem] border border-white/14 bg-white/9 px-6 py-6 shadow-[0_25px_80px_rgba(1,10,20,0.36)] backdrop-blur-xl lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="flex items-center gap-4">
              <PathLogo />
              <div>
                <h1 className="text-2xl font-semibold tracking-[-0.03em] text-white sm:text-3xl">
                  Your life, your path.
                </h1>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-[1.4rem] border border-white/14 bg-white/8 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                Events
              </p>
              <p className="mt-3 text-xl font-semibold tracking-[-0.03em]">
                {sortedEvents.length}
              </p>
            </div>
            <div className="rounded-[1.4rem] border border-white/14 bg-white/8 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                First Year
              </p>
              <p className="mt-3 text-xl font-semibold tracking-[-0.03em]">
                {new Date(sortedEvents[0].date).getFullYear()}
              </p>
            </div>
            <div className="rounded-[1.4rem] border border-white/14 bg-white/8 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                Latest Step
              </p>
              <p className="mt-3 text-sm font-semibold text-cyan-100">
                {latestEvent.title}
              </p>
            </div>
          </div>
        </header>

        <section className="mt-8 grid flex-1 gap-8">
          <div>
            <form
              onSubmit={submitEvent}
              className="rounded-[2rem] border border-white/14 bg-slate-900/55 p-6 shadow-[0_30px_100px_rgba(2,12,27,0.38)] backdrop-blur-xl"
            >
              <button
                type="button"
                onClick={() => setIsComposerOpen((current) => !current)}
                className="flex w-full items-center justify-between gap-4 text-left"
              >
                <div>
                  <p className="text-[0.72rem] uppercase tracking-[0.25em] text-orange-200/70">
                    New Life Event
                  </p>
                  <h2 className="mt-2 text-lg font-semibold tracking-[-0.03em] text-white">
                    Write a Memory
                  </h2>
                </div>
                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-200">
                  {isComposerOpen ? "Minimize" : "Maximize"}
                </span>
              </button>

              <div className={`${isComposerOpen ? "mt-6 grid gap-4" : "hidden"}`}>
                <label className="grid gap-2">
                  <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    Title
                  </span>
                  <input
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="Had a Child"
                    className="rounded-2xl border border-white/10 bg-slate-900/85 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/70"
                  />
                </label>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-2">
                    <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
                      Date
                    </span>
                    <input
                      type="date"
                      value={date}
                      onChange={(event) => setDate(event.target.value)}
                      className="rounded-2xl border border-white/10 bg-slate-900/85 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/70"
                    />
                  </label>

                  <label className="grid gap-2">
                    <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
                      Category
                    </span>
                    <select
                      value={category}
                      onChange={(event) => setCategory(event.target.value)}
                      className="rounded-2xl border border-white/10 bg-slate-900/85 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/70"
                    >
                      <option>Family</option>
                      <option>Relationships</option>
                      <option>Career</option>
                      <option>Personal Milestone</option>
                      <option>Travel</option>
                    </select>
                  </label>
                </div>

                <label className="grid gap-2">
                  <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    Short Summary
                  </span>
                  <input
                    value={summary}
                    onChange={(event) => setSummary(event.target.value)}
                    placeholder="A day that changed everything"
                    className="rounded-2xl border border-white/10 bg-slate-900/85 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/70"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    Full Entry
                  </span>
                  <textarea
                    value={story}
                    onChange={(event) => setStory(event.target.value)}
                    rows={6}
                    placeholder="Write what happened, how it felt, and why it mattered..."
                    className="resize-none rounded-[1.6rem] border border-white/10 bg-slate-900/85 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/70"
                  />
                </label>
              </div>

              {isComposerOpen ? (
                <button
                  type="submit"
                  className="mt-6 w-full rounded-[1.4rem] border border-cyan-300/25 bg-[linear-gradient(135deg,rgba(34,211,238,0.24),rgba(249,115,22,0.18))] px-5 py-4 text-sm font-semibold text-white transition hover:brightness-110"
                >
                  Add to My Story
                </button>
              ) : null}
            </form>
          </div>

          <section className="rounded-[2.2rem] border border-white/14 bg-slate-900/55 p-6 shadow-[0_35px_120px_rgba(2,12,27,0.42)] backdrop-blur-xl">
            {selectedYearEvent ? (
              <div className="min-h-[34rem] rounded-[1.8rem] border border-cyan-200/20 bg-cyan-300/10 p-6 backdrop-blur-xl">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-[0.68rem] uppercase tracking-[0.24em] text-cyan-100/70">
                      Open Moment
                    </p>
                    <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-white">
                      {selectedYearEvent.title}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedId(null)}
                    className="rounded-full border border-white/12 bg-white/7 px-3 py-2 text-xs text-slate-200 transition hover:border-white/22 hover:bg-white/10"
                  >
                    Close
                  </button>
                </div>
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-200">
                    {formatDate(selectedYearEvent.date)}
                  </span>
                  <span
                    className={`rounded-full border px-4 py-2 text-xs ${
                      categoryStyles[selectedYearEvent.category] ??
                      "bg-white/10 text-white border-white/10"
                    }`}
                  >
                    {selectedYearEvent.category}
                  </span>
                </div>
                <p className="mt-6 text-sm leading-7 text-cyan-50/90">
                  {selectedYearEvent.summary}
                </p>
                <p className="mt-6 max-w-3xl text-sm leading-8 text-slate-200">
                  {selectedYearEvent.story}
                </p>
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-[0.72rem] uppercase tracking-[0.25em] text-cyan-100/65">
                      Life Visualization
                    </p>
                    <h2 className="mt-3 text-xl font-semibold tracking-[-0.03em] text-white">
                      A Year on Your Path
                    </h2>
                  </div>
                  <p className="max-w-sm text-xs leading-6 text-slate-400 sm:text-sm">
                    One year at a time. Move through the years, then click a moment on
                    the path to open its full story here.
                  </p>
                </div>

                <div className="mt-8 flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      const currentIndex = years.indexOf(currentYear);
                      const previousYear = years[Math.max(currentIndex - 1, 0)];

                      setCurrentYear(previousYear);
                      setSelectedId(null);
                    }}
                    disabled={currentYear === years[0]}
                    className="rounded-full border border-white/12 bg-white/7 px-4 py-2 text-xs text-slate-200 transition hover:border-white/22 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Previous Year
                  </button>
                  <div className="text-center">
                    <p className="text-[0.68rem] uppercase tracking-[0.24em] text-slate-500">
                      Focus Year
                    </p>
                    <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">
                      {currentYear}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const currentIndex = years.indexOf(currentYear);
                      const nextYear = years[Math.min(currentIndex + 1, years.length - 1)];

                      setCurrentYear(nextYear);
                      setSelectedId(null);
                    }}
                    disabled={currentYear === years[years.length - 1]}
                    className="rounded-full border border-white/12 bg-white/7 px-4 py-2 text-xs text-slate-200 transition hover:border-white/22 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next Year
                  </button>
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                  {years.map((year) => (
                    <button
                      key={year}
                      type="button"
                      onClick={() => {
                        setCurrentYear(year);
                        setSelectedId(null);
                      }}
                      className={`rounded-full border px-3 py-2 text-xs transition ${
                        year === currentYear
                          ? "border-cyan-200/40 bg-cyan-300/14 text-cyan-50"
                          : "border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:bg-white/9"
                      }`}
                    >
                      {year}
                    </button>
                  ))}
                </div>

                <div className="relative mt-8">
                  <div className="relative h-[26rem] overflow-hidden rounded-[1.6rem] px-8 sm:px-10">
                    <svg
                      viewBox="0 0 100 100"
                      preserveAspectRatio="none"
                      aria-hidden="true"
                      className="absolute inset-x-0 top-1/2 h-[14rem] w-full -translate-y-1/2 overflow-visible"
                    >
                      <defs>
                        <linearGradient id="life-path-glow" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="rgba(103,232,249,0.2)" />
                          <stop offset="45%" stopColor="rgba(103,232,249,0.95)" />
                          <stop offset="100%" stopColor="rgba(251,191,36,0.8)" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M 0 44 C 12 26, 20 22, 30 32 S 48 70, 60 56 S 78 22, 100 38"
                        fill="none"
                        stroke="url(#life-path-glow)"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                      <path
                        d="M 0 44 C 12 26, 20 22, 30 32 S 48 70, 60 56 S 78 22, 100 38"
                        fill="none"
                        stroke="rgba(255,255,255,0.16)"
                        strokeWidth="0.45"
                        strokeLinecap="round"
                      />
                    </svg>

                    <div className="absolute inset-x-8 bottom-2 flex justify-between text-[0.64rem] uppercase tracking-[0.22em] text-slate-500 sm:inset-x-10">
                      {monthLabels.map((label) => (
                        <span key={label}>{label}</span>
                      ))}
                    </div>

                    <div className="absolute inset-0">
                      {yearEvents.map((event, index) => {
                        const point = getCurvePoint(getYearProgress(event.date));
                        const placeAbove = index % 2 === 0;
                        const clusterY = clamp(
                          point.y + (placeAbove ? -10 : -4),
                          28,
                          72,
                        );
                        const connectorStyle = placeAbove
                          ? "bg-[linear-gradient(180deg,rgba(103,232,249,0.02),rgba(103,232,249,0.45))]"
                          : "bg-[linear-gradient(180deg,rgba(103,232,249,0.45),rgba(103,232,249,0.02))]";

                        return (
                          <button
                            key={event.id}
                            type="button"
                            onClick={() => setSelectedId(event.id)}
                            className="group absolute -translate-x-1/2 -translate-y-1/2 text-center"
                            style={{
                              left: `${point.x}%`,
                              top: `${clusterY}%`,
                            }}
                          >
                            {placeAbove ? (
                              <div className="absolute bottom-0 left-1/2 flex -translate-x-1/2 flex-col items-center">
                                <div className="w-28 rounded-[1.4rem] border border-white/12 bg-white/[0.07] px-3 py-3 transition hover:border-white/24 hover:bg-white/[0.1]">
                                  <p className="text-[0.66rem] uppercase tracking-[0.24em] text-slate-500">
                                    {new Date(event.date).getFullYear()}
                                  </p>
                                  <h3 className="mt-2 text-sm font-semibold tracking-[-0.02em] text-white">
                                    {event.title}
                                  </h3>
                                  <p className="mt-1 text-[0.68rem] leading-4 text-slate-400">
                                    {formatDate(event.date)}
                                  </p>
                                </div>
                                <div className={`mt-1 h-4 w-px ${connectorStyle}`} />
                                <div className="mt-1 grid h-5 w-5 place-items-center rounded-full border-4 border-cyan-900 bg-cyan-200 shadow-[0_0_12px_rgba(103,232,249,0.28)] transition group-hover:border-cyan-100 group-hover:bg-cyan-300 group-hover:shadow-[0_0_26px_rgba(103,232,249,0.65)]" />
                              </div>
                            ) : (
                              <div className="absolute left-1/2 top-0 flex -translate-x-1/2 flex-col items-center">
                                <div className="grid h-5 w-5 place-items-center rounded-full border-4 border-cyan-900 bg-cyan-200 shadow-[0_0_12px_rgba(103,232,249,0.28)] transition group-hover:border-cyan-100 group-hover:bg-cyan-300 group-hover:shadow-[0_0_26px_rgba(103,232,249,0.65)]" />
                                <div className={`mt-1 h-4 w-px ${connectorStyle}`} />
                                <div className="mt-1 w-28 rounded-[1.4rem] border border-white/12 bg-white/[0.07] px-3 py-3 transition hover:border-white/24 hover:bg-white/[0.1]">
                                  <p className="text-[0.66rem] uppercase tracking-[0.24em] text-slate-500">
                                    {new Date(event.date).getFullYear()}
                                  </p>
                                  <h3 className="mt-2 text-sm font-semibold tracking-[-0.02em] text-white">
                                    {event.title}
                                  </h3>
                                  <p className="mt-1 text-[0.68rem] leading-4 text-slate-400">
                                    {formatDate(event.date)}
                                  </p>
                                </div>
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </>
            )}
          </section>
        </section>
      </div>
    </main>
  );
}

export default App;
