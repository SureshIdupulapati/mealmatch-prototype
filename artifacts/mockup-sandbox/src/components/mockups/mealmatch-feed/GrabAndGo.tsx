import { useMemo, useState } from "react";
import {
  ArrowDownUp,
  Bookmark,
  Check,
  Clock3,
  Compass,
  Leaf,
  MapPin,
  Search,
  TicketCheck,
  UserRound,
  X,
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
const sortOptions = ["Closest first", "Expiring soonest", "Most portions"];

export function GrabAndGo() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [saved, setSaved] = useState<string[]>([]);
  const [sort, setSort] = useState("Closest first");
  const [showSaved, setShowSaved] = useState(false);
  const [selectedDrop, setSelectedDrop] = useState<Drop | null>(null);
  const [notice, setNotice] = useState("");

  const visibleDrops = useMemo(() => {
    const query = search.trim().toLowerCase();
    const result = drops.filter((drop) => {
      const matchesFilter =
        filter === "All" || drop.tags.some((tag) => tag.toLowerCase() === filter.toLowerCase());
      const searchable = `${drop.title} ${drop.event} ${drop.location} ${drop.tags.join(" ")}`.toLowerCase();
      return matchesFilter && (!query || searchable.includes(query)) && (!showSaved || saved.includes(drop.id));
    });
    if (sort === "Expiring soonest") return [...result].sort((a, b) => a.minutesLeft - b.minutesLeft);
    if (sort === "Most portions") return [...result].sort((a, b) => b.portions - a.portions);
    return [...result].sort((a, b) => a.distance - b.distance);
  }, [filter, search, sort, showSaved, saved]);

  const toggleSaved = (id: string) => {
    setSaved((current) =>
      current.includes(id) ? current.filter((savedId) => savedId !== id) : [...current, id],
    );
  };

  return (
    <div className="meal-feed-enter mx-auto flex h-[100dvh] min-h-[720px] w-full max-w-[393px] flex-col overflow-hidden bg-[#f5f4ee] font-['Plus_Jakarta_Sans'] text-[#183333]">
      <div className="flex h-11 shrink-0 items-center justify-between bg-[#f5f4ee] px-6 text-[13px] font-bold text-[#183333]">
        <span>9:41</span>
        <span className="h-[19px] w-[76px] rounded-full bg-[#183333]" aria-hidden="true" />
        <span className="text-[10px] tracking-wide">••• 100%</span>
      </div>

      <main className="meal-scroll flex-1 overflow-y-auto pb-5">
        <header className="bg-[#f5f4ee] px-5 pb-4 pt-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#c45a37]">UC Berkeley</p>
              <h1 className="mt-0.5 text-[26px] font-extrabold leading-none tracking-[-0.06em] text-[#183333]">
                MealMatch<span className="text-[#d66b43]">.</span>
              </h1>
            </div>
            <div className="flex items-center gap-1.5 rounded-full border border-[#d9ddd2] bg-[#fbfaf6] px-3 py-2 text-[11px] font-bold text-[#385250]">
              <MapPin className="h-3.5 w-3.5 text-[#d66b43]" />
              North Campus
            </div>
          </div>

          <label className="relative mt-4 block">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#73827a]" />
            <input
              aria-label="Search food, events or places"
              className="h-11 w-full rounded-xl border border-[#e0e2d8] bg-[#fffefa] pl-10 pr-4 text-[13px] font-semibold text-[#183333] outline-none transition placeholder:font-medium placeholder:text-[#8b9790] focus:border-[#d66b43]"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Food, building, or event"
              value={search}
            />
          </label>

          <div className="meal-scroll mt-3 flex gap-2 overflow-x-auto">
            {filters.map((item) => (
              <button
                aria-pressed={filter === item}
                className={`shrink-0 rounded-lg px-3 py-2 text-[11px] font-bold transition ${
                  filter === item
                    ? "bg-[#183333] text-[#fffefa]"
                    : "border border-[#d9ddd2] bg-[#fbfaf6] text-[#586963]"
                }`}
                key={item}
                onClick={() => setFilter(item)}
                type="button"
              >
                {item}
              </button>
            ))}
          </div>
        </header>

        <section className="mx-5 mt-1 flex items-center justify-between rounded-xl border border-[#ead4c6] bg-[#f4e6da] px-3.5 py-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#d66b43] text-white">
              <Clock3 className="h-4 w-4" />
            </span>
            <div>
              <p className="text-[12px] font-extrabold leading-tight text-[#633d30]">3 drops to pick up</p>
              <p className="mt-0.5 text-[10px] font-semibold text-[#8c6453]">Closest is 0.2 mi away</p>
            </div>
          </div>
          <span className="rounded-md bg-[#fff8f1] px-2 py-1 text-[10px] font-extrabold uppercase tracking-[0.08em] text-[#ad4f31]">
            Live now
          </span>
        </section>

        <section className="px-5 pb-4 pt-5">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#78877f]">
                {showSaved ? "Your shortlist" : "Ready when you are"}
              </p>
              <h2 className="mt-0.5 text-[19px] font-extrabold tracking-[-0.04em] text-[#183333]">
                {showSaved ? "Saved drops" : "Nearby food"}
                <span className="ml-1.5 align-middle font-mono text-[11px] font-bold tracking-normal text-[#8a9890]">
                  {visibleDrops.length.toString().padStart(2, "0")}
                </span>
              </h2>
            </div>
            <label className="flex items-center gap-1.5 pb-1 text-[10px] font-bold text-[#52645c]">
              <ArrowDownUp className="h-3.5 w-3.5" />
              <span className="sr-only">Sort drops</span>
              <select
                aria-label="Sort drops"
                className="max-w-[112px] appearance-none bg-transparent text-right outline-none"
                onChange={(event) => setSort(event.target.value)}
                value={sort}
              >
                {sortOptions.map((option) => <option key={option}>{option}</option>)}
              </select>
            </label>
          </div>

          <div className="mt-3 space-y-2.5">
            {visibleDrops.map((drop, index) => (
              <article
                className="relative overflow-hidden rounded-[16px] border border-[#e1e3d9] bg-[#fffefa] shadow-[0_2px_8px_rgba(30,55,47,0.045)] transition hover:border-[#c4d0c5]"
                key={drop.id}
              >
                <button
                  aria-label={`View pickup details for ${drop.title}`}
                  className="flex w-full gap-3 p-2.5 pr-11 text-left"
                  onClick={() => setSelectedDrop(drop)}
                  type="button"
                >
                  <div className="relative h-[99px] w-[91px] shrink-0 overflow-hidden rounded-[11px] bg-[#e9e6dc]">
                    <img alt={drop.title} className="h-full w-full object-cover" src={drop.image} />
                    <span className="absolute bottom-1.5 left-1.5 rounded bg-[#183333]/90 px-1.5 py-1 text-[8px] font-extrabold uppercase tracking-[0.1em] text-white">
                      Free
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
                    <div>
                      <div className="mb-1.5 flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-[0.08em] text-[#75857d]">
                        <span className="truncate">{drop.distance.toFixed(1)} mi</span>
                        <span className="text-[#b1b8af]">/</span>
                        <span className="truncate">{drop.event}</span>
                      </div>
                      <h3 className="line-clamp-2 text-[13px] font-extrabold leading-[1.25] tracking-[-0.025em] text-[#183333]">
                        {drop.title}
                      </h3>
                      <p className="mt-1 flex items-center gap-1 text-[10px] font-semibold text-[#667770]">
                        <MapPin className="h-3 w-3 shrink-0 text-[#d66b43]" />
                        <span className="truncate">{drop.location}</span>
                      </p>
                    </div>
                    <div className="mt-2 flex items-center gap-1">
                      {drop.tags.map((tag) => (
                        <span className="rounded-md bg-[#eff1e9] px-1.5 py-1 text-[9px] font-bold leading-none text-[#52645c]" key={tag}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </button>

                <button
                  aria-label={saved.includes(drop.id) ? "Remove saved drop" : "Save drop"}
                  aria-pressed={saved.includes(drop.id)}
                  className={`absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full transition ${
                    saved.includes(drop.id) ? "bg-[#e6f0e8] text-[#26734c]" : "bg-[#f2f2eb] text-[#798880]"
                  }`}
                  onClick={() => toggleSaved(drop.id)}
                  type="button"
                >
                  <Bookmark className="h-3.5 w-3.5" fill={saved.includes(drop.id) ? "currentColor" : "none"} />
                </button>

                <div className="flex h-[37px] items-center justify-between border-t border-[#eeeee7] bg-[#fbfaf6] px-3">
                  <span className={`flex items-center gap-1.5 text-[11px] font-extrabold ${
                    drop.minutesLeft <= 35 ? "text-[#b35436]" : "text-[#667770]"
                  }`}>
                    <Clock3 className="h-3.5 w-3.5" />
                    {drop.minutesLeft} min left
                  </span>
                  <span className="text-[11px] font-extrabold text-[#294f3b]">
                    {drop.portions} <span className="font-semibold text-[#74837a]">{drop.portionType} left</span>
                  </span>
                </div>
                {index === 0 && drop.minutesLeft <= 35 && (
                  <span className="absolute right-[11px] top-[46px] rounded-full bg-[#f8e6da] px-1.5 py-0.5 text-[8px] font-extrabold uppercase tracking-[0.08em] text-[#a74e32]">
                    Pickup soon
                  </span>
                )}
              </article>
            ))}
            {visibleDrops.length === 0 && (
              <div className="rounded-2xl border border-dashed border-[#cbd3c8] bg-[#fbfaf6] px-5 py-9 text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-[#e9eee5] text-[#5b7664]">
                  {showSaved ? <Bookmark className="h-4 w-4" /> : <Search className="h-4 w-4" />}
                </div>
                <p className="mt-3 text-[13px] font-extrabold text-[#29423b]">Nothing on the list yet</p>
                <p className="mt-1 text-[11px] font-medium text-[#77857c]">
                  {showSaved ? "Save a nearby drop to find it here." : "Try another search or food filter."}
                </p>
                <button
                  className="mt-3 text-[11px] font-extrabold text-[#b35436]"
                  onClick={() => { setSearch(""); setFilter("All"); setShowSaved(false); }}
                  type="button"
                >
                  Show all nearby food
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      <nav aria-label="Main navigation" className="flex h-[70px] shrink-0 items-center justify-around border-t border-[#e0e2d9] bg-[#fbfaf6] px-2 pb-1">
        <button
          aria-current={!showSaved ? "page" : undefined}
          className={`flex min-w-[58px] flex-col items-center gap-1 ${!showSaved ? "text-[#c45a37]" : "text-[#88948c]"}`}
          onClick={() => setShowSaved(false)}
          type="button"
        >
          <Compass className="h-[19px] w-[19px]" />
          <span className="text-[9px] font-extrabold">Explore</span>
        </button>
        <button
          aria-current={showSaved ? "page" : undefined}
          className={`relative flex min-w-[58px] flex-col items-center gap-1 ${showSaved ? "text-[#c45a37]" : "text-[#88948c]"}`}
          onClick={() => setShowSaved(true)}
          type="button"
        >
          <Bookmark className="h-[19px] w-[19px]" fill={showSaved ? "currentColor" : "none"} />
          {saved.length > 0 && <span className="absolute left-[36px] top-[-3px] h-2 w-2 rounded-full bg-[#d66b43]" />}
          <span className="text-[9px] font-extrabold">Saved</span>
        </button>
        <button
          className="flex min-w-[58px] flex-col items-center gap-1 text-[#88948c]"
          onClick={() => setNotice("Your pickup pass will appear here when you claim a meal.")}
          type="button"
        >
          <TicketCheck className="h-[19px] w-[19px]" />
          <span className="text-[9px] font-bold">Pass</span>
        </button>
        <button
          className="flex min-w-[58px] flex-col items-center gap-1 text-[#88948c]"
          onClick={() => setNotice("Your rescued-meal impact will appear here.")}
          type="button"
        >
          <UserRound className="h-[19px] w-[19px]" />
          <span className="text-[9px] font-bold">Impact</span>
        </button>
      </nav>

      {selectedDrop && (
        <div className="absolute inset-0 z-20 flex items-end bg-[#122625]/35" onClick={() => setSelectedDrop(null)}>
          <section
            aria-label={`${selectedDrop.title} pickup details`}
            aria-modal="true"
            className="w-full rounded-t-[24px] bg-[#fbfaf6] px-5 pb-8 pt-3 shadow-[0_-12px_40px_rgba(18,38,37,0.15)]"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <div className="mx-auto mb-4 h-1 w-9 rounded-full bg-[#d7d9ce]" />
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#c45a37]">Pickup details</p>
                <h2 className="mt-1 text-[20px] font-extrabold leading-tight tracking-[-0.04em] text-[#183333]">{selectedDrop.title}</h2>
              </div>
              <button aria-label="Close pickup details" className="rounded-full bg-[#eff0e9] p-2 text-[#55675e]" onClick={() => setSelectedDrop(null)} type="button">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-4 overflow-hidden rounded-xl">
              <img alt={selectedDrop.title} className="h-36 w-full object-cover" src={selectedDrop.image} />
            </div>
            <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.1em] text-[#829087]">{selectedDrop.event}</p>
            <div className="mt-2 flex items-start gap-2 text-[13px] font-bold text-[#29423b]">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#d66b43]" />
              {selectedDrop.location}
            </div>
            <div className="mt-4 flex items-center justify-between rounded-xl bg-[#f2eee4] px-4 py-3">
              <span className="flex items-center gap-2 text-[12px] font-extrabold text-[#a84e32]"><Clock3 className="h-4 w-4" />{selectedDrop.minutesLeft} min to collect</span>
              <span className="text-[12px] font-extrabold text-[#294f3b]">{selectedDrop.portions} {selectedDrop.portionType} left</span>
            </div>
            <button className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#183333] text-[12px] font-extrabold text-[#fffefa]" onClick={() => setSelectedDrop(null)} type="button">
              <Check className="h-4 w-4" /> Got it
            </button>
          </section>
        </div>
      )}

      {notice && (
        <div className="absolute inset-x-4 bottom-[82px] z-30 flex items-center justify-between rounded-xl bg-[#183333] px-4 py-3 text-[11px] font-semibold text-[#fffefa] shadow-lg">
          <span className="flex items-center gap-2"><Leaf className="h-4 w-4 shrink-0 text-[#d8a17f]" />{notice}</span>
          <button aria-label="Dismiss message" className="ml-3 text-white/70" onClick={() => setNotice("")} type="button"><X className="h-4 w-4" /></button>
        </div>
      )}
    </div>
  );
}
