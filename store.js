window.LKSStore = {
    getInitialData: () => ({
        theme: {
            eventName: "LKS GDT Babel 2026",
            bgColor: "bg-slate-400"
        },
        config: {
            docLink: "https://drive.google.com",
            spreadsheetUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRFr1dH2Y34-ZSSxN-Ycasseqx4a_kU8Pja9dQeShIA6la4X5BVQo-JiSCcdZ3k7X8SXxJ8OhVr48d0/pubhtml?gid=0&single=true"
        },
        modules: [
            { id: 1, title: "Modul 1 - Product Design Sketch", releaseTime: "2026-06-10T08:30:00", link: "#", pic: "Juri" }
        ],
        schedule: [
            { id: 1, title: "Registrasi & Pembukaan", start: "2026-06-10T07:15:00", end: "2026-06-10T08:00:00", duration: "45 Menit", pic: "Panitia" },
            { id: 2, title: "Pengerjaan Modul 1", start: "2026-06-10T08:30:00", end: "2026-06-10T11:30:00", duration: "3 Jam", pic: "Peserta" },
            { id: 3, title: "ISHOMA", start: "2026-06-10T11:30:00", end: "2026-06-10T13:00:00", duration: "90 Menit", pic: "-" },
            { id: 4, title: "Pengerjaan Modul 2", start: "2026-06-10T13:00:00", end: "2026-06-10T16:00:00", duration: "3 Jam", pic: "Peserta" }
        ],
        peserta: [
            { nama: "Ahmad Khadavi", link: "#" }
        ]
    }),

    load: () => {
        const local = localStorage.getItem('lks_bento_v2_db');
        if (local) {
            try { return JSON.parse(local); } catch(e) {}
        }
        return window.LKSStore.getInitialData();
    },

    save: (data) => {
        localStorage.setItem('lks_bento_v2_db', JSON.stringify(data));
    },

    exportJSON: (data) => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", `LKS_CONFIG_${data.theme.eventName}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
    }
};
