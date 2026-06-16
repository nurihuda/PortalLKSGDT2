window.AdminPanelComponent = ({ db, setDb, setView, modules, setModules, pesertaList, setPesertaList, schedule, setSchedule }) => {
    const [theme, setTheme] = React.useState(db.theme);
    const [config, setConfig] = React.useState(db.config);
    const [newNama, setNewNama] = React.useState("");
    const [newLink, setNewLink] = React.useState("");
    const [schedTitle, setSchedTitle] = React.useState("");
    const [schedStart, setSchedStart] = React.useState("");
    const [schedEnd, setSchedEnd] = React.useState("");

    const handleSaveAdminCore = (e) => {
        if(e) e.preventDefault();
        const serializedSchedule = schedule.map(item => ({
            ...item,
            start: new Date(item.start).toISOString(),
            end: new Date(item.end).toISOString()
        }));
        const updatedDb = { ...db, theme, config, modules, schedule: serializedSchedule, peserta: pesertaList };
        setDb(updatedDb);
        window.LKSStore.save(updatedDb);
        alert("Konfigurasi sukses disimpan!");
        setView('dashboard');
    };

    const handleAddSchedule = (e) => {
        e.preventDefault();
        if(!schedTitle || !schedStart || !schedEnd) return;
        const newId = schedule.length > 0 ? Math.max(...schedule.map(s => s.id)) + 1 : 1;
        const newEvent = { id: newId, title: schedTitle, start: new Date(schedStart), end: new Date(schedEnd), duration: "-", pic: "-" };
        setSchedule([...schedule, newEvent].sort((a, b) => a.start - b.start));
        setSchedTitle(""); setSchedStart(""); setSchedEnd("");
    };

    const handleDeleteSchedule = (id) => {
        if(confirm("Hapus agenda ini?")) setSchedule(schedule.filter(s => s.id !== id));
    };

    const handleAddPesertaLocal = (e) => {
        e.preventDefault();
        if(!newNama || !newLink) return;
        setPesertaList([...pesertaList, { nama: newNama, link: newLink }]);
        setNewNama(""); setNewLink("");
    };

    const handleDeletePesertaLocal = (nama) => {
        if(confirm(`Hapus ${nama}?`)) setPesertaList(pesertaList.filter(p => p.nama !== nama));
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-12 p-8">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <h2 className="text-2xl font-black uppercase">CMS Control Room</h2>
                <button type="button" onClick={handleSaveAdminCore} className="px-5 py-2 bg-green-600 text-white text-xs font-black uppercase rounded-xl shadow-md">Simpan Perubahan</button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border shadow-sm h-fit">
                    <h3 className="font-bold text-xs text-slate-400 uppercase">🎨 Identitas Web</h3>
                    <div className="mt-3 space-y-3">
                        <input type="text" value={theme.eventName} onChange={e => setTheme({...theme, eventName: e.target.value})} className="w-full px-3 py-2 text-xs rounded-lg border bg-slate-50 focus:outline-none" placeholder="Nama LKS" />
                        <input type="text" value={config.spreadsheetUrl} onChange={e => setConfig({...config, spreadsheetUrl: e.target.value})} className="w-full px-3 py-2 text-xs rounded-lg border bg-slate-50 focus:outline-none" placeholder="Link Spreadsheet" />
                    </div>
                </div>

                <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-5 rounded-2xl border shadow-sm">
                    <h3 className="font-bold text-xs text-slate-400 uppercase mb-3">📅 Manajemen Jadwal</h3>
                    <form onSubmit={handleAddSchedule} className="grid grid-cols-2 gap-2 mb-4 bg-slate-50 p-3 rounded-xl border">
                        <input type="text" placeholder="Nama Acara" value={schedTitle} onChange={e => setSchedTitle(e.target.value)} className="col-span-2 px-2 py-1.5 text-xs rounded-md border focus:outline-none" />
                        <input type="datetime-local" value={schedStart} onChange={e => setSchedStart(e.target.value)} className="px-2 py-1.5 text-xs rounded-md border focus:outline-none" />
                        <input type="datetime-local" value={schedEnd} onChange={e => setSchedEnd(e.target.value)} className="px-2 py-1.5 text-xs rounded-md border focus:outline-none" />
                        <button type="submit" className="col-span-2 bg-slate-800 text-white text-xs py-1.5 rounded-md font-bold uppercase">Tambah Jadwal</button>
                    </form>
                    <div className="max-h-48 overflow-y-auto">
                        {schedule.map(s => (
                            <div key={s.id} className="flex justify-between items-center p-2 text-xs border-b">
                                <span>{s.title} ({new Date(s.start).toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'})})</span>
                                <button onClick={() => handleDeleteSchedule(s.id)} className="text-red-500"><window.IconTrash /></button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border shadow-sm">
                <h3 className="font-bold text-xs text-slate-400 uppercase mb-3">👥 Database Peserta</h3>
                <form onSubmit={handleAddPesertaLocal} className="flex gap-2 mb-4">
                    <input type="text" placeholder="Nama Peserta" value={newNama} onChange={e => setNewNama(e.target.value)} className="w-1/3 px-3 py-1.5 text-xs border rounded-lg focus:outline-none" />
                    <input type="text" placeholder="Link Folder Drive" value={newLink} onChange={e => setNewLink(e.target.value)} className="w-full px-3 py-1.5 text-xs border rounded-lg focus:outline-none" />
                    <button type="submit" className="px-4 bg-slate-800 text-white text-xs font-bold rounded-lg whitespace-nowrap">Tambah</button>
                </form>
                <div className="max-h-40 overflow-y-auto border rounded-xl divide-y">
                    {pesertaList.map(p => (
                        <div key={p.nama} className="flex justify-between p-3 text-xs">
                            <span className="font-bold">{p.nama}</span>
                            <button onClick={() => handleDeletePesertaLocal(p.nama)} className="text-red-500"><window.IconTrash /></button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
