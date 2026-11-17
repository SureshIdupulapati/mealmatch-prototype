import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  Bookmark,
  Check,
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
  host: string;
  note: string;
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
    host: "College of Engineering",
    note: "Left from this afternoon’s department gathering. The hosts saved a dozen boxed lunches for the campus community.",
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
    host: "Berkeley Sustainability",
    note: "A generous forum lunch, packed up after the last conversation. Fresh vegetables, grains, and a little less waste.",
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
    host: "ASUC Wellness",
    note: "The workshop wrapped early, so its breakfast spread is still here to share. Come by for a pastry or fruit.",
  },
];

const filters = ["All", "Vegan", "Halal", "Hot Meals", "Snacks"];

export function TableStories() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [saved, setSaved] = useState<string[]>([]);
  const [sort, setSort] = useState("Closest first");
  const [activeTab, setActiveTab] = useState("Explore");
  const [selectedDrop, setSelectedDrop] = useState<Drop | null>(null);
  const [reserved, setReserved] = useState<string[]>([]);

  const visibleDrops = useMemo(() => {
    const query = search.trim().toLowerCase();
    const result = drops.filter((drop) => {
      const matchesFilter =
        filter === "All" || drop.tags.some((tag) => tag.toLowerCase() === filter.toLowerCase());
      const searchable =
        `${drop.title} ${drop.event} ${drop.location} ${drop.tags.join(" ")} ${drop.host}`.toLowerCase();
      return (
        matchesFilter &&
        (!query || searchable.includes(query)) &&
        (activeTab !== "Saved" || saved.includes(drop.id))
      );
    });
    if (sort === "Expiring soonest") return [...result].sort((a, b) => a.minutesLeft - b.minutesLeft);
    if (sort === "Most portions") return [...result].sort((a, b) => b.portions - a.portions);
    return [...result].sort((a, b) => a.distance - b.distance);
  }, [activeTab, filter, saved, search, sort]);

  const toggleSaved = (id: string) => {
    setSaved((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };

  return (
    <div className="meal-feed-enter mx-auto flex h-[100dvh] min-h-[720px] w-full max-w-[393px] flex-col overflow-hidden bg-[#f5f2eb] font-['Plus_Jakarta_Sans'] text-[#282b26]">
      <div className="flex h-11 shrink-0 items-center justify-between bg-[#f5f2eb] px-7 text-sm font-semibold text-[#282b26]">
        <span>9:41</span>
        <span className="h-5 w-[78px] rounded-full bg-[#282b26]" aria-hidden="true" />
        <span className="text-[11px] tracking-wide">••• 100%</span>
      </div>

      <main className="meal-scroll flex-1 overflow-y-auto pb-5">
        <header className="bg-[#f5f2eb] px-5 pb-4 pt-2">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#858477]">A table for everyone</p>
              <h1 className="mt-1 font-serif text-[32px] font-semibold leading-none tracking-[-.04em] text-[#303d32]">
                MealMatch<span className="text-[#bd6948]">.</span>
              </h1>
              <button className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-[#647565]">
                <MapPin className="h-3 w-3" />
                <span>North Campus · UC Berkeley</span>
                <span aria-hidden="true">⌄</span>
              </button>
            </div>
            <div className="mt-2 flex h-10 w-10 items-center justify-center rounded-full border border-[#d9d5c8] bg-[#ebe7dc] text-[#52705a]" aria-label="Food rescue">
              <Leaf className="h-[18px] w-[18px]" />
            </div>
          </div>

          <div className="relative mt-4">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#838477]" />
            <input
              aria-label="Search food, events or places"
              className="w-full rounded-xl border border-[#dfdccf] bg-[#fbfaf6] py-3 pl-10 pr-10 text-xs font-medium text-[#303d32] outline-none transition focus:border-[#788c72] placeholder:text-[#99998d]"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Find a dish, gathering, or place"
              value={search}
            />
            <SlidersHorizontal className="absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#838477]" />
          </div>
          <div className="meal-scroll mt-3 flex gap-2 overflow-x-auto py-0.5">
            {filters.map((item) => (
              <button
                aria-pressed={filter === item}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-[11px] font-semibold transition ${
                  filter === item
                    ? "bg-[#405743] text-[#fffdf7]"
                    : "border border-[#d9d5c8] bg-transparent text-[#72766b] hover:bg-[#ebe7dc]"
                }`}
                key={item}
                onClick={() => setFilter(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </header>

        <section className="px-5 pb-1 pt-1">
          <div className="relative overflow-hidden rounded-[22px] bg-[#405743] px-4 py-4 text-[#fbf8ef]">
            <div className="absolute -right-8 -top-10 h-32 w-32 rounded-full border border-white/10" />
            <div className="absolute -right-2 -top-4 h-20 w-20 rounded-full border border-white/10" />
            <div className="relative flex items-start justify-between gap-2">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[.18em] text-[#d5c89f]">The campus table</p>
                <h2 className="mt-1 font-serif text-[22px] leading-tight">Good food, shared forward.</h2>
                <p className="mt-1.5 max-w-[250px] text-[11px] leading-relaxed text-[#e2e7d9]">
                  {drops.length} gatherings have something extra to pass along.
                </p>
              </div>
              <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#d9c994] text-[#405743]">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </div>
          </div>
        </section>

        <section className="px-5 pb-5 pt-5">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[.17em] text-[#9a785f]">
                {activeTab === "Saved" ? "Your reading list" : "From campus gatherings"}
              </p>
              <h2 className="mt-0.5 font-serif text-[23px] font-semibold leading-tight tracking-[-.025em] text-[#303d32]">
                {activeTab === "Saved" ? "Saved for later" : "Stories on the table"}
              </h2>
            </div>
            <label className="mb-1 flex items-center gap-1.5 border-b border-[#c9c6b8] pb-1 text-[10px] font-semibold text-[#656b60]">
              <span className="sr-only">Sort drops</span>
              <select
                aria-label="Sort drops"
                className="max-w-[112px] appearance-none bg-transparent outline-none"
                onChange={(event) => setSort(event.target.value)}
                value={sort}
              >
                <option>Closest first</option>
                <option>Expiring soonest</option>
                <option>Most portions</option>
              </select>
              <span aria-hidden="true">⌄</span>
            </label>
          </div>

          <div className="mt-3 space-y-4">
            {visibleDrops.map((drop, index) => (
              <article
                className="overflow-hidden rounded-[20px] border border-[#e2ded2] bg-[#fbfaf6] shadow-[0_3px_12px_rgba(58,58,42,.045)]"
                key={drop.id}
              >
                <button
                  aria-label={`Read story about ${drop.title}`}
                  className="group relative block h-[164px] w-full overflow-hidden bg-[#e6e1d4] text-left"
                  onClick={() => setSelectedDrop(drop)}
                >
                  <img alt={drop.title} className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.025]" src={drop.image} />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1d271e]/75 via-transparent to-[#1d271e]/10" />
                  <span className="absolute left-3 top-3 rounded-full bg-[#f6f0dc] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[.1em] text-[#465b45]">
                    Community share · {index + 1}
                  </span>
                  <span className="absolute bottom-3 left-3 right-3 text-left">
                    <span className="block text-[9px] font-bold uppercase tracking-[.16em] text-[#e8d9aa]">{drop.event}</span>
                    <span className="mt-1 block font-serif text-[21px] font-semibold leading-tight text-white">{drop.title}</span>
                  </span>
                </button>

                <div className="px-3.5 pb-3.5 pt-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="flex min-w-0 items-center gap-1.5 text-[10px] font-semibold text-[#536850]">
                      <UserRound className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">Shared by {drop.host}</span>
                    </p>
                    <button
                      aria-label={saved.includes(drop.id) ? "Remove saved drop" : "Save drop"}
                      aria-pressed={saved.includes(drop.id)}
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition ${
                        saved.includes(drop.id) ? "bg-[#e4eadf] text-[#405743]" : "text-[#898a7e] hover:bg-[#f0eee6]"
                      }`}
                      onClick={() => toggleSaved(drop.id)}
                    >
                      <Bookmark className="h-4 w-4" fill={saved.includes(drop.id) ? "currentColor" : "none"} />
                    </button>
                  </div>
                  <p className="mt-1.5 line-clamp-2 text-[11px] leading-[1.55] text-[#74766c]">{drop.note}</p>
                  <p className="mt-2 flex items-center gap-1 text-[10px] font-medium text-[#74766c]">
                    <MapPin className="h-3 w-3 shrink-0 text-[#a2785d]" />
                    <span className="truncate">{drop.location}</span>
                    <span className="ml-auto shrink-0 text-[#9a785f]">{drop.distance.toFixed(1)} mi</span>
                  </p>
                  <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                    {drop.tags.map((tag) => (
                      <span className="rounded-full bg-[#eeeee5] px-2 py-1 text-[9px] font-semibold text-[#586755]" key={tag}>
                        {tag}
                      </span>
                    ))}
                    <span className="ml-auto flex items-center gap-1 text-[10px] font-semibold text-[#a56443]">
                      <Clock3 className="h-3 w-3" /> {drop.minutesLeft}m left
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-[#ebe7dc] pt-2.5">
                    <span className="text-[10px] font-bold text-[#405743]">
                      {drop.portions} {drop.portionType} to share
                    </span>
                    <button
                      className="flex items-center gap-1 rounded-full bg-[#405743] px-3 py-1.5 text-[10px] font-bold text-[#fffdf7] transition hover:bg-[#304532]"
                      onClick={() => setSelectedDrop(drop)}
                    >
                      See pickup <ArrowUpRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
            {visibleDrops.length === 0 && (
              <div className="rounded-[20px] border border-[#e2ded2] bg-[#fbfaf6] px-5 py-10 text-center">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#e7e9df] text-[#536850]">
                  <Search className="h-4 w-4" />
                </div>
                <p className="mt-3 font-serif text-lg font-semibold text-[#303d32]">
                  {activeTab === "Saved" ? "Nothing saved just yet" : "No shared meals found"}
                </p>
                <p className="mt-1 text-[11px] text-[#818176]">Try another search or filter to find a gathering.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <nav aria-label="Main navigation" className="flex h-[72px] shrink-0 items-center justify-around border-t border-[#dfdccf] bg-[#fbfaf6] px-2 pb-2">
        {[
          { label: "Explore", icon: Compass },
          { label: "Saved", icon: Bookmark },
          { label: "Pass", icon: TicketCheck },
          { label: "Impact", icon: UserRound },
        ].map(({ label, icon: Icon }) => (
          <button
            aria-current={activeTab === label ? "page" : undefined}
            className={`flex min-w-[58px] flex-col items-center gap-1 transition ${activeTab === label ? "text-[#405743]" : "text-[#99998d]"}`}
            key={label}
            onClick={() => setActiveTab(label)}
          >
            <Icon className="h-[19px] w-[19px]" />
            <span className={`text-[9px] ${activeTab === label ? "font-bold" : "font-medium"}`}>{label}</span>
          </button>
        ))}
      </nav>

      {selectedDrop && (
        <div className="fixed inset-0 z-20 flex items-end justify-center bg-[#22271f]/45 p-0" onClick={() => setSelectedDrop(null)}>
          <section
            aria-label={`${selectedDrop.title} pickup details`}
            aria-modal="true"
            className="meal-feed-enter w-full max-w-[393px] overflow-hidden rounded-t-[26px] bg-[#fbfaf6] shadow-2xl"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <div className="relative h-[160px]">
              <img alt="" className="h-full w-full object-cover" src={selectedDrop.image} />
              <div className="absolute inset-0 bg-gradient-to-t from-[#20291f]/70 to-transparent" />
              <button aria-label="Close pickup details" className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#fbfaf6]/90 text-[#303d32]" onClick={() => setSelectedDrop(null)}>
                <X className="h-4 w-4" />
              </button>
              <p className="absolute bottom-4 left-5 right-5 font-serif text-[24px] font-semibold leading-tight text-white">{selectedDrop.title}</p>
            </div>
            <div className="px-5 pb-7 pt-4">
              <p className="text-[10px] font-bold uppercase tracking-[.15em] text-[#9a785f]">{selectedDrop.event}</p>
              <p className="mt-2 text-xs leading-relaxed text-[#6e7166]">{selectedDrop.note}</p>
              <div className="mt-4 space-y-2 border-y border-[#e8e4d9] py-3 text-[11px] text-[#4d584b]">
                <p className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-[#a2785d]" />{selectedDrop.location} · {selectedDrop.distance.toFixed(1)} mi</p>
                <p className="flex items-center gap-2"><Clock3 className="h-3.5 w-3.5 text-[#a2785d]" />Pickup window closes in {selectedDrop.minutesLeft} minutes</p>
                <p className="flex items-center gap-2"><Leaf className="h-3.5 w-3.5 text-[#a2785d]" />{selectedDrop.portions} {selectedDrop.portionType} available · {selectedDrop.tags.join(" · ")}</p>
              </div>
              <button
                className={`mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold transition ${
                  reserved.includes(selectedDrop.id) ? "bg-[#e4eadf] text-[#405743]" : "bg-[#405743] text-[#fffdf7] hover:bg-[#304532]"
                }`}
                onClick={() => setReserved((current) => current.includes(selectedDrop.id) ? current : [...current, selectedDrop.id])}
              >
                {reserved.includes(selectedDrop.id) ? <><Check className="h-4 w-4" /> Pickup noted</> : <>Keep this pickup in mind <ArrowUpRight className="h-4 w-4" /></>}
              </button>
              <p className="mt-2 text-center text-[9px] text-[#8b8b80]">Preview only · no reservation is sent</p>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
