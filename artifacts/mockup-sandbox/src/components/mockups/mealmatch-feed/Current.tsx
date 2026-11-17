import { useMemo, useState } from "react";
import {
  Bookmark,
  Clock3,
  Compass,
  Leaf,
  MapPin,
  Search,
  SlidersHorizontal,
  TicketCheck,
  UserRound,
} from "lucide-react";
import "./_group.css";

type Drop = {
  id: string;
  title: string;
  event: string;
  location: string;
  distance: number;
  tags: string[];
  minutesLeft: number;
  portions: number;
  portionType: string;
  image: string;
};

const drops: Drop[] = [
  {
    id: "sandwiches",
    title: "Gourmet Sandwiches & Fruit",
    event: "Engineering Dept Reception",
    location: "Bechtel Hall, Room 210",
    distance: 0.2,
    tags: ["Halal", "Hot Meals"],
    minutesLeft: 35,
    portions: 12,
    portionType: "boxes",
    image: "/__mockup/images/sandwiches.jpg",
  },
  {
    id: "bowls",
    title: "Roasted Veggie Grain Bowls",
    event: "Campus Sustainability Forum",
    location: "Sutardja Dai Hall, Atrium 2",
    distance: 0.3,
    tags: ["Vegan", "Hot Meals"],
    minutesLeft: 55,
    portions: 8,
    portionType: "bowls",
    image: "/__mockup/images/bowls.jpg",
  },
  {
    id: "pastries",
    title: "Pastries & Fresh Fruit Platter",
    event: "ASUC Wellness Event",
    location: "MLK Student Union, Room 2",
    distance: 0.5,
    tags: ["Snacks"],
    minutesLeft: 70,
    portions: 24,
    portionType: "portions",
    image: "/__mockup/images/pastries.jpg",
  },
];

const filters = ["All", "Vegan", "Halal", "Hot Meals", "Snacks"];

export function Current() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [saved, setSaved] = useState<string[]>([]);
  const [sort, setSort] = useState("Closest first");

  const visibleDrops = useMemo(() => {
    const query = search.trim().toLowerCase();
    const result = drops.filter((drop) => {
      const matchesFilter =
        filter === "All" || drop.tags.some((tag) => tag.toLowerCase() === filter.toLowerCase());
      const searchable = `${drop.title} ${drop.event} ${drop.location} ${drop.tags.join(" ")}`.toLowerCase();
      return matchesFilter && (!query || searchable.includes(query));
    });
    if (sort === "Expiring soonest") return [...result].sort((a, b) => a.minutesLeft - b.minutesLeft);
    if (sort === "Most portions") return [...result].sort((a, b) => b.portions - a.portions);
    return [...result].sort((a, b) => a.distance - b.distance);
  }, [filter, search, sort]);

  return (
    <div className="meal-feed-enter mx-auto flex h-[100dvh] min-h-[720px] w-full max-w-[393px] flex-col overflow-hidden bg-slate-50 font-['Plus_Jakarta_Sans'] text-slate-800">
      <div className="flex h-11 shrink-0 items-center justify-between bg-white px-7 text-sm font-semibold text-slate-900">
        <span>9:41</span>
        <span className="h-5 w-[78px] rounded-full bg-black" aria-hidden="true" />
        <span className="text-[11px] tracking-wide">••• 100%</span>
      </div>

      <main className="meal-scroll flex-1 overflow-y-auto pb-4">
        <header className="border-b border-slate-100 bg-white px-4 pb-4 pt-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-extrabold leading-tight tracking-tight text-slate-900">
                MealMatch
              </h1>
              <button className="mt-0.5 flex items-center gap-1 text-xs font-semibold text-[#059669]">
                <MapPin className="h-3.5 w-3.5" />
                <span>North Campus • UC Berkeley</span>
                <span className="text-[10px]">⌄</span>
              </button>
            </div>
            <button
              aria-label="Your impact"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#10b981] text-white shadow-md shadow-emerald-500/20"
            >
              <Leaf className="h-5 w-5" />
            </button>
          </div>

          <div className="relative mt-3.5">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              aria-label="Search food, events or places"
              className="w-full rounded-full border border-slate-200/80 bg-slate-100 py-2.5 pl-10 pr-10 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search food, events or places"
              value={search}
            />
            <SlidersHorizontal className="absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>

          <div className="meal-scroll mt-3.5 flex gap-2 overflow-x-auto py-0.5 text-xs font-semibold">
            {filters.map((item) => (
              <button
                aria-pressed={filter === item}
                className={`shrink-0 rounded-full px-3.5 py-1.5 transition ${
                  filter === item
                    ? "bg-slate-900 text-white shadow-sm"
                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
                key={item}
                onClick={() => setFilter(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </header>

        <section className="px-4 pt-4">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#064e3b] to-[#022c22] p-4 text-white shadow-lg shadow-emerald-950/15">
            <div className="absolute -bottom-6 -right-6 h-28 w-28 rounded-full bg-emerald-400/20 blur-2xl" />
            <div className="relative flex items-center justify-between gap-3">
              <div>
                <span className="rounded-full border border-emerald-700/50 bg-emerald-800/80 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-widest text-emerald-300">
                  Campus food rescue
                </span>
                <h2 className="mt-1.5 text-lg font-bold leading-snug">
                  {drops.length} Active Drops Nearby
                </h2>
                <p className="mt-0.5 text-xs text-emerald-100/90">
                  Good food. Less waste. All yours.
                </p>
              </div>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#10b981]">
                <span className="text-lg leading-none">→</span>
              </span>
            </div>
          </div>
        </section>

        <section className="px-4 pb-5 pt-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold tracking-tight text-slate-900">Fresh around you</h2>
            <label className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
              <span className="sr-only">Sort drops</span>
              <select
                aria-label="Sort drops"
                className="max-w-[125px] appearance-none bg-transparent outline-none"
                onChange={(event) => setSort(event.target.value)}
                value={sort}
              >
                <option>Closest first</option>
                <option>Expiring soonest</option>
                <option>Most portions</option>
              </select>
              <span className="text-[10px]">⌄</span>
            </label>
          </div>

          <div className="mt-3 space-y-3">
            {visibleDrops.map((drop) => (
              <article
                className="flex cursor-pointer gap-3.5 rounded-2xl border border-slate-200/70 bg-white p-3 shadow-sm transition hover:shadow-md"
                key={drop.id}
              >
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                  <img alt={drop.title} className="h-full w-full object-cover" src={drop.image} />
                  <span className="absolute left-1 top-1 rounded bg-black/60 px-1.5 py-0.5 text-[9px] font-bold text-white">
                    FREE
                  </span>
                </div>
                <div className="flex min-w-0 flex-1 flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="block truncate text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {drop.event}
                      </span>
                      <button
                        aria-label={saved.includes(drop.id) ? "Remove saved drop" : "Save drop"}
                        aria-pressed={saved.includes(drop.id)}
                        className={`shrink-0 p-0.5 transition ${
                          saved.includes(drop.id) ? "text-[#059669]" : "text-slate-400"
                        }`}
                        onClick={() =>
                          setSaved((current) =>
                            current.includes(drop.id)
                              ? current.filter((id) => id !== drop.id)
                              : [...current, drop.id],
                          )
                        }
                      >
                        <Bookmark
                          className="h-3.5 w-3.5"
                          fill={saved.includes(drop.id) ? "currentColor" : "none"}
                        />
                      </button>
                    </div>
                    <h3 className="truncate text-sm font-bold leading-snug text-slate-900">
                      {drop.title}
                    </h3>
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                      <MapPin className="h-3 w-3 shrink-0 text-slate-400" />
                      <span className="truncate">{drop.location}</span>
                    </p>
                    <div className="mt-1.5 flex gap-1.5">
                      {drop.tags.map((tag) => (
                        <span
                          className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600"
                          key={tag}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-1 text-[11px] font-semibold">
                    <span className="flex items-center gap-1 text-amber-600">
                      <Clock3 className="h-3 w-3" />
                      Expires in {drop.minutesLeft}m
                    </span>
                    <span className="font-bold text-[#059669]">
                      {drop.portions} {drop.portionType} left
                    </span>
                  </div>
                </div>
              </article>
            ))}
            {visibleDrops.length === 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white px-5 py-10 text-center">
                <p className="text-sm font-bold text-slate-700">No active drops found</p>
                <p className="mt-1 text-xs text-slate-400">Try a different search or filter.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <nav aria-label="Main navigation" className="flex h-[72px] shrink-0 items-center justify-around border-t border-slate-200/80 bg-white px-2 pb-2">
        <button className="flex flex-col items-center gap-1 text-[#059669]" aria-current="page">
          <Compass className="h-5 w-5" />
          <span className="text-[10px] font-bold">Explore</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-400">
          <Bookmark className="h-5 w-5" />
          <span className="text-[10px] font-medium">Saved</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-400">
          <TicketCheck className="h-5 w-5" />
          <span className="text-[10px] font-medium">Pass</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-400">
          <UserRound className="h-5 w-5" />
          <span className="text-[10px] font-medium">Impact</span>
        </button>
      </nav>
    </div>
  );
}
