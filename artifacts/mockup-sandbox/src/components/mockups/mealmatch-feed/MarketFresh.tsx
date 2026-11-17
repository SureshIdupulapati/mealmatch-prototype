import { useMemo, useState } from "react";
import {
  Bookmark,
  Check,
  ChevronDown,
  Clock3,
  Compass,
  Leaf,
  MapPin,
  Search,
  SlidersHorizontal,
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

export function MarketFresh() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [saved, setSaved] = useState<string[]>([]);
  const [sort, setSort] = useState("Closest first");
  const [activeTab, setActiveTab] = useState("Explore");
  const [notice, setNotice] = useState("");

  const visibleDrops = useMemo(() => {
    const query = search.trim().toLowerCase();
    const result = drops.filter((drop) => {
      const matchesFilter =
        filter === "All" || drop.tags.some((tag) => tag.toLowerCase() === filter.toLowerCase());
      const searchable = `${drop.title} ${drop.event} ${drop.location} ${drop.tags.join(" ")}`.toLowerCase();
      const matchesTab = activeTab !== "Saved" || saved.includes(drop.id);
      return matchesFilter && matchesTab && (!query || searchable.includes(query));
    });
    if (sort === "Expiring soonest") return [...result].sort((a, b) => a.minutesLeft - b.minutesLeft);
    if (sort === "Most portions") return [...result].sort((a, b) => b.portions - a.portions);
    return [...result].sort((a, b) => a.distance - b.distance);
  }, [activeTab, filter, saved, search, sort]);

  const toggleSaved = (id: string) => {
    setSaved((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  const navItems = [
    { label: "Explore", icon: Compass },
    { label: "Saved", icon: Bookmark },
    { label: "Pass", icon: TicketCheck },
    { label: "Impact", icon: UserRound },
  ];

  return (
    <div className="meal-feed-enter mx-auto flex h-[100dvh] min-h-[720px] w-full max-w-[393px] flex-col overflow-hidden bg-[#f8f5eb] font-['Plus_Jakarta_Sans'] text-[#27332d]">
      <div className="flex h-11 shrink-0 items-center justify-between bg-[#f8f5eb] px-7 text-sm font-semibold text-[#27332d]">
        <span>9:41</span>
        <span className="h-5 w-[78px] rounded-full bg-[#27332d]" aria-hidden="true" />
        <span className="text-[11px] tracking-wide">••• 100%</span>
      </div>

      <main className="meal-scroll flex-1 overflow-y-auto pb-5">
        <header className="px-5 pb-4 pt-2">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#ef7049] text-white">
                  <Leaf className="h-[17px] w-[17px]" />
                </span>
                <span className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#79836f]">
                  Berkeley market
                </span>
              </div>
              <h1 className="mt-2 font-['Plus_Jakarta_Sans'] text-[27px] font-extrabold leading-none tracking-[-0.06em] text-[#25332b]">
                MealMatch
              </h1>
              <button
                className="mt-2 flex items-center gap-1.5 text-[11px] font-bold text-[#56704f]"
                onClick={() => setNotice("Showing food rescued around North Campus.")}
              >
                <MapPin className="h-3.5 w-3.5" />
                North Campus · UC Berkeley
                <ChevronDown className="h-3 w-3" />
              </button>
            </div>
            <button
              aria-label="Campus food rescue impact"
              className="mt-1 flex h-10 w-10 items-center justify-center rounded-full border border-[#d9ddc9] bg-[#e9eddc] text-[#55714b] transition hover:bg-[#dfe6cf]"
              onClick={() => setNotice("A little less waste, one campus meal at a time.")}
            >
              <Leaf className="h-[18px] w-[18px]" />
            </button>
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-[17px] border border-[#e5e3d6] bg-[#fffdf6] px-3.5 py-3 shadow-[0_3px_12px_rgba(56,60,39,0.04)]">
            <Search className="h-4 w-4 shrink-0 text-[#7e897a]" />
            <input
              aria-label="Search food, events or places"
              className="min-w-0 flex-1 bg-transparent text-[12px] font-semibold text-[#27332d] outline-none placeholder:text-[#9da397]"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Find something delicious"
              value={search}
            />
            {search && (
              <button aria-label="Clear search" onClick={() => setSearch("")}>
                <X className="h-4 w-4 text-[#899184]" />
              </button>
            )}
            <SlidersHorizontal className="h-4 w-4 text-[#ef7049]" />
          </div>

          <div className="meal-scroll mt-3.5 flex gap-2 overflow-x-auto py-0.5">
            {filters.map((item) => (
              <button
                aria-pressed={filter === item}
                className={`shrink-0 rounded-full px-3.5 py-2 text-[11px] font-extrabold transition ${
                  filter === item
                    ? "bg-[#344a37] text-[#fffdf6]"
                    : "border border-[#dedfce] bg-[#fdfbf3] text-[#687262] hover:bg-[#eff0e5]"
                }`}
                key={item}
                onClick={() => setFilter(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </header>

        <section className="px-5">
          <div className="flex items-center justify-between rounded-[15px] bg-[#e9eddb] px-3.5 py-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#d2ddba] text-[#536c47]">
                <Check className="h-4 w-4" />
              </span>
              <div>
                <p className="text-[12px] font-extrabold text-[#394a35]">3 fresh finds nearby</p>
                <p className="mt-0.5 text-[10px] font-medium text-[#74816b]">Rescued from campus events</p>
              </div>
            </div>
            <span className="rounded-full bg-[#fffdf6] px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.12em] text-[#647655]">
              Today
            </span>
          </div>
        </section>

        <section className="pb-5 pt-5">
          <div className="flex items-end justify-between px-5">
            <div>
              <p className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-[#e26b47]">
                The fresh picks
              </p>
              <h2 className="mt-1 text-[20px] font-extrabold leading-tight tracking-[-0.05em] text-[#29382e]">
                {activeTab === "Saved" ? "Your market basket" : "Good things, going fast"}
              </h2>
            </div>
            <label className="mb-0.5 flex items-center gap-1 text-[10px] font-bold text-[#687262]">
              <span className="sr-only">Sort drops</span>
              <select
                aria-label="Sort drops"
                className="max-w-[105px] appearance-none bg-transparent text-right outline-none"
                onChange={(event) => setSort(event.target.value)}
                value={sort}
              >
                <option>Closest first</option>
                <option>Expiring soonest</option>
                <option>Most portions</option>
              </select>
              <ChevronDown className="h-3 w-3 text-[#e26b47]" />
            </label>
          </div>

          <div className="meal-scroll mt-3 flex gap-3 overflow-x-auto px-5 pb-2">
            {visibleDrops.map((drop, index) => {
              const isSaved = saved.includes(drop.id);
              return (
                <article
                  className={`w-[286px] shrink-0 overflow-hidden rounded-[22px] border border-[#e5e2d5] bg-[#fffdf6] shadow-[0_7px_22px_rgba(62,61,43,0.08)] ${
                    index === 0 ? "animate-[meal-feed-enter_260ms_ease-out]" : ""
                  }`}
                  key={drop.id}
                >
                  <div className="relative h-[168px] overflow-hidden bg-[#e8e4d5]">
                    <img alt={drop.title} className="h-full w-full object-cover" src={drop.image} />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#142219]/55 via-transparent to-[#142219]/10" />
                    <span className="absolute left-3 top-3 rounded-full bg-[#fff9e9] px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.1em] text-[#4e6742]">
                      Free · rescued
                    </span>
                    <button
                      aria-label={isSaved ? "Remove saved drop" : "Save drop"}
                      aria-pressed={isSaved}
                      className={`absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-sm transition ${
                        isSaved ? "bg-[#f9edd7] text-[#e16b47]" : "bg-[#fffdf6]/90 text-[#405143]"
                      }`}
                      onClick={() => toggleSaved(drop.id)}
                    >
                      <Bookmark className="h-4 w-4" fill={isSaved ? "currentColor" : "none"} />
                    </button>
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-[#f8f3e7]/95 px-2.5 py-1.5 text-[10px] font-extrabold text-[#48543d]">
                      <Clock3 className="h-3 w-3 text-[#e16b47]" />
                      {drop.minutesLeft} min fresh
                    </div>
                    <div className="absolute bottom-3 right-3 rounded-full bg-[#e9764e] px-2.5 py-1.5 text-[10px] font-extrabold text-white">
                      {drop.portions} left
                    </div>
                  </div>
                  <div className="p-3.5">
                    <p className="truncate text-[9px] font-extrabold uppercase tracking-[0.15em] text-[#e16b47]">
                      {drop.event}
                    </p>
                    <h3 className="mt-1 text-[16px] font-extrabold leading-tight tracking-[-0.04em] text-[#29382e]">
                      {drop.title}
                    </h3>
                    <p className="mt-2 flex items-center gap-1.5 text-[10px] font-semibold text-[#758071]">
                      <MapPin className="h-3 w-3 shrink-0 text-[#879478]" />
                      <span className="truncate">{drop.location}</span>
                      <span className="ml-auto shrink-0 text-[#4e6742]">{drop.distance.toFixed(1)} mi</span>
                    </p>
                    <div className="mt-3 flex items-center justify-between border-t border-[#efede3] pt-2.5">
                      <div className="flex gap-1.5">
                        {drop.tags.map((tag) => (
                          <span
                            className="rounded-full bg-[#eef0e3] px-2.5 py-1 text-[9px] font-bold text-[#5f7055]"
                            key={tag}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <span className="text-[9px] font-bold text-[#87907e]">
                        {drop.portionType}
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
            {visibleDrops.length === 0 && (
              <div className="w-full rounded-[20px] border border-dashed border-[#d9ddca] bg-[#fffdf6] px-5 py-9 text-center">
                <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#edf0e3] text-[#68795c]">
                  <Search className="h-4 w-4" />
                </span>
                <p className="mt-3 text-[13px] font-extrabold text-[#394a35]">Nothing on this stall</p>
                <p className="mt-1 text-[11px] text-[#87907e]">Try another search or dietary filter.</p>
                <button
                  className="mt-3 text-[11px] font-extrabold text-[#df6e49]"
                  onClick={() => {
                    setSearch("");
                    setFilter("All");
                  }}
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
          <p className="px-5 pt-1 text-[9px] font-semibold uppercase tracking-[0.17em] text-[#929989]">
            {visibleDrops.length} campus finds · pickup nearby
          </p>
        </section>
      </main>

      {notice && (
        <div className="absolute bottom-[82px] left-1/2 z-10 flex w-[calc(100%-36px)] max-w-[355px] -translate-x-1/2 items-center justify-between rounded-xl bg-[#344a37] px-4 py-3 text-[11px] font-semibold text-[#fffdf6] shadow-lg">
          {notice}
          <button aria-label="Dismiss message" className="ml-3" onClick={() => setNotice("")}>
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <nav
        aria-label="Main navigation"
        className="flex h-[72px] shrink-0 items-center justify-around border-t border-[#e4e1d6] bg-[#fffdf6] px-2 pb-2"
      >
        {navItems.map(({ label, icon: Icon }) => (
          <button
            aria-current={activeTab === label ? "page" : undefined}
            className={`flex min-w-[58px] flex-col items-center gap-1 transition ${
              activeTab === label ? "text-[#df7049]" : "text-[#9a9e91]"
            }`}
            key={label}
            onClick={() => {
              if (label === "Explore" || label === "Saved") {
                setActiveTab(label);
                setNotice("");
              } else {
                setNotice(`${label} is outside this feed preview.`);
              }
            }}
          >
            <Icon className="h-[19px] w-[19px]" />
            <span className={`text-[9px] ${activeTab === label ? "font-extrabold" : "font-semibold"}`}>
              {label}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
}
