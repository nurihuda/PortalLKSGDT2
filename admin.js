// Destructuring komponen dari global window agar React (Babel) tidak crash
const { useState, useEffect, useMemo } = React;
const { LogoGDT, IconLayout, IconFileText, IconCalendar, IconShare2, IconSettings, IconClock, IconTable, IconTrash, IconMenu, IconSearch, IconExternalLink } = window;

const App = () => {
    const [db, setDb] = useState(null);
    const [view, setView] = useState('dashboard'); 
    const [systemTime, setSystemTime] = useState(new Date());
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const [modules, setModules] = useState([]);
    const [schedule, setSchedule] = useState([]);
    const [pesertaList, setPesertaList] = useState([]);
    const [timeOffset, setTimeOffset] = useState(0);

    // Booting Awal Data
    useEffect(() => {
        const loadedData = window.LKSStore.load();
        setDb(loadedData);
        setModules(loadedData.modules);
        setPesertaList(loadedData.peserta);
        
        const savedOffset = localStorage.getItem('gdt_time_offset_live');
        if (savedOffset) setTimeOffset(parseInt(savedOffset));

        const processedSchedule = loadedData.schedule.map(item => ({
            ...item,
            start: new Date(item.start),
            end: new Date(item.end)
        })).sort((a, b) => a.start - b.start);
        setSchedule(processedSchedule);
    }, []);

    // Timer Ticker
    useEffect(() => {
        const clk = setInterval(() => setSystemTime(new Date()), 1000);
        return () => clearInterval(clk);
    }, []);

    // Akses Rahasia Admin via Sidebar Search
    const handleAdminAccess = (e) => {
        if(e.key === 'Enter' && searchQuery.toLowerCase() === 'admin123') {
            setView('admin');
            setSearchQuery('');
        }
    };

    // Engine Kalkulasi Sisa Waktu Interaktif
    const { activeEvent, nextEvent, countdownLeftMs } = useMemo(() => {
        let active = null; let next = null;
        for (let i = 0; i < schedule.length; i++) {
            const s = schedule[i];
            if (systemTime >= s.start && systemTime <= s.end) { active = s; break; }
            if (systemTime < s.start && !next) { next = s; }
        }
        let diff = 0;
        if (active) {
            const modifiedEnd = active.end.getTime() + (timeOffset * 60 * 1000);
            diff = modifiedEnd - systemTime.getTime();
        } else if (next) {
            diff = next.start.getTime() - systemTime.getTime();
        }
        return { activeEvent: active, nextEvent: next, countdownLeftMs: diff > 0 ? diff : 0 };
    }, [systemTime, schedule, timeOffset]);

    const { hr, min, sec } = useMemo(() => {
        const t = Math.floor(countdownLeftMs / 1000);
        return { hr: Math.floor(t / 3600), min: Math.floor((t % 3600) / 60), sec: t % 60 };
    }, [countdownLeftMs]);
    
    const pad = (n) => String(n).padStart(2, '0');

    if (!db) return <div className="h-screen flex items-center justify-center font-bold text-slate-400">Memuat Sistem...</div>;

    return (
        <div className="flex flex-col h-screen w-screen overflow-hidden bg-white text-slate-800">
            
            {/* JIKA VIEW = DASHBOARD (Sesuai Sketsa Bento High-Contrast) */}
            {view === 'dashboard' && (
                <div className="flex flex-col h-full w-full">
                    
                    {/* UPPER SECTION (Background Putih) */}
                    <div className="flex-1 flex relative">
                        
                        {/* Collapsible Sidebar Kiri (GDTLABID) */}
                        <aside className={`transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'} p-6 flex flex-col border-r border-slate-100 bg-white z-10 shrink-0`}>
                            {/* Logo & Toggle */}
                            <div className="flex items-center justify-between mb-10">
                                <div className={`flex items-center gap-3 overflow-hidden ${!isSidebarOpen && 'hidden'}`}>
                                    <LogoGDT className="w-8 h-auto text-slate-900" />
                                    <h1 className="font-bold text-lg tracking-tight uppercase">GDTLABID</h1>
                                </div>
                                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1 hover:bg-slate-100 rounded-md text-slate-400">
                                    <IconMenu />
                                </button>
                            </div>

                            {/* Navigasi Opsi */}
                            <nav className="flex-1 space-y-3">
                                <button onClick={() => setView('dashboard')} className="flex items-center gap-4 w-full text-left font-medium text-sm text-slate-900 hover:text-slate-500 transition-colors">
                                    <IconLayout /> <span className={`${!isSidebarOpen && 'hidden'}`}>Opsi 1 (Beranda)</span>
                                </button>
                                <button onClick={() => setView('modules')} className="flex items-center gap-4 w-full text-left font-medium text-sm text-slate-500 hover:text-slate-900 transition-colors">
                                    <IconFileText /> <span className={`${!isSidebarOpen && 'hidden'}`}>Opsi 2 (Modul)</span>
                                </button>
                                <button onClick={() => setView('schedule')} className="flex items-center gap-4 w-full text-left font-medium text-sm text-slate-500 hover:text-slate-900 transition-colors">
                                    <IconCalendar /> <span className={`${!isSidebarOpen && 'hidden'}`}>Opsi 3 (Jadwal)</span>
                                </button>
                                <button onClick={() => setView('submission')} className="flex items-center gap-4 w-full text-left font-medium text-sm text-slate-500 hover:text-slate-900 transition-colors">
                                    <IconShare2 /> <span className={`${!isSidebarOpen && 'hidden'}`}>Opsi 4 (Berkas)</span>
                                </button>
                            </nav>

                            {/* Pintu Masuk Admin */}
                            <div className={`mt-auto border border-slate-200 rounded-xl flex items-center px-3 py-2 bg-slate-50 ${!isSidebarOpen && 'justify-center px-0'}`}>
                                <IconSettings />
                                {isSidebarOpen && (
                                    <input type="password" placeholder="Passcode..." value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} onKeyDown={handleAdminAccess} className="w-full bg-transparent outline-none ml-2 text-xs font-mono" />
                                )}
                            </div>
                        </aside>

                        {/* Mega Timer Area Kanan */}
                        <main className="flex-1 flex flex-col justify-end p-8 md:p-14 relative bg-white">
                            <div className="absolute top-6 right-8 font-bold text-slate-300 text-sm tracking-widest flex items-center gap-2 uppercase">
                                <IconClock /> {systemTime.toLocaleTimeString('id-ID')} WIB
                            </div>
                            <div className="text-right w-full">
                                <h2 className="text-3xl sm:text-5xl md:text-6xl text-slate-400 font-medium uppercase tracking-tight mb-[-10px] md:mb-[-20px] select-none">
                                    {activeEvent ? activeEvent.title : "MASA JEDA KOMPETISI"}
                                </h2>
                                <div className="text-[120px] sm:text-[180px] md:text-[230px] leading-none font-boldonse text-slate-400 tracking-tighter select-none tabular-nums">
                                    {pad(hr)}<span className="animate-pulse-fast opacity-50">:</span>{pad(min)}<span className="animate-pulse-fast opacity-50">:</span>{pad(sec)}
                                </div>
                            </div>
                        </main>
                    </div>

                    {/* LOWER SECTION (Block Area Bawah Sketsa Bento Grid) */}
                    <div className="h-2/5 min-h-[350px] bg-slate-400 p-6 md:p-10 flex items-center justify-center border-t-8 border-black/10">
                        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 h-full">
                            
                            {/* Kiri: 2 Kotak Vertikal Raksasa */}
                            <div className="grid grid-cols-2 gap-4 h-full">
                                <button onClick={() => setView('modules')} className="bg-white rounded-xl p-4 flex flex-col justify-between hover:scale-[1.02] transition-transform shadow-lg">
                                    <div className="border-2 border-slate-200 h-24 w-24 mx-auto mt-2 rounded flex items-center justify-center text-slate-300">
                                        <IconFileText />
                                    </div>
                                    <div className="bg-slate-300 h-8 w-full rounded mt-4 text-white text-[11px] font-bold flex items-center justify-center uppercase tracking-wider">
                                        Unduh Modul
                                    </div>
                                </button>
                                <button onClick={() => setView('submission')} className="bg-white rounded-xl p-4 flex flex-col justify-between hover:scale-[1.02] transition-transform shadow-lg">
                                    <div className="border-2 border-slate-200 h-24 w-24 mx-auto mt-2 rounded flex items-center justify-center text-slate-300">
                                        <IconShare2 />
                                    </div>
                                    <div className="bg-slate-300 h-8 w-full rounded mt-4 text-white text-[11px] font-bold flex items-center justify-center uppercase tracking-wider">
                                        Cloud Folder
                                    </div>
                                </button>
                            </div>

                            {/* Tengah: Timeline Jadwal Berbaris */}
                            <div className="md:col-span-2 flex flex-col h-full bg-black/5 p-5 rounded-2xl">
                                <h3 className="font-boldonse text-4xl text-white mb-3 tracking-wide">JADWAL</h3>
                                <div className="flex-1 flex flex-col gap-2.5">
                                    {schedule.slice(0, 4).map((s, i) => (
                                        <div key={i} className="bg-white px-5 py-3 rounded flex justify-between items-center text-sm font-bold text-slate-500 shadow-sm">
                                            <span className="truncate">{s.title}</span>
                                            <span className="shrink-0">{pad(s.start.getHours())}:{pad(s.start.getMinutes())} WIB</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Kanan: 4 Kotak Status Link Horizontal */}
                            <div className="flex flex-col gap-2.5 h-full">
                                <button onClick={() => setView('submission')} className="bg-white flex-1 rounded shadow-sm flex justify-between items-center px-5 hover:bg-slate-50 transition-colors group">
                                    <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Score Board</span>
                                    <IconExternalLink />
                                </button>
                                <button className="bg-white flex-1 rounded shadow-sm flex justify-between items-center px-5 hover:bg-slate-50 transition-colors group">
                                    <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Dokumentasi</span>
                                    <IconExternalLink />
                                </button>
                                <button className="bg-white flex-1 rounded shadow-sm flex justify-between items-center px-5 hover:bg-slate-50 transition-colors group">
                                    <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Regulasi</span>
                                    <IconExternalLink />
                                </button>
                                <div className="bg-white flex-1 rounded shadow-sm flex items-center justify-between px-5">
                                    <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Sinkronisasi</span>
                                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)] animate-pulse"></span>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            )}

            {/* RUTING HALAMAN LAIN (CMS & SUBMISSION) */}
            {view === 'admin' && (
                <div className="flex-1 overflow-y-auto bg-slate-50">
                    <button onClick={() => setView('dashboard')} className="m-8 px-4 py-2 bg-slate-800 text-white text-xs font-bold rounded-xl">&larr; Kembali ke Dashboard</button>
                    <window.AdminPanelComponent db={db} setDb={setDb} setView={setView} modules={modules} setModules={setModules} pesertaList={pesertaList} setPesertaList={setPesertaList} schedule={schedule} setSchedule={setSchedule} />
                </div>
            )}

            {view !== 'dashboard' && view !== 'admin' && (
                <div className="flex-1 overflow-y-auto bg-slate-50 p-10 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-slate-200 text-slate-400 rounded-2xl flex items-center justify-center mb-6"><IconLayout /></div>
                    <h2 className="text-3xl font-black text-slate-800 mb-2 uppercase">Menu Dalam Pengembangan</h2>
                    <p className="text-slate-500 mb-8 max-w-md">Tampilan tabel peserta dan live modul belum digabungkan ke sketsa bento layout yang baru. Silakan pantau kodingan tahap selanjutnya.</p>
                    <button onClick={() => setView('dashboard')} className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl shadow-lg">Kembali ke Dashboard Utama</button>
                </div>
            )}
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
