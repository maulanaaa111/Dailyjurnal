import React, { useState, useEffect } from 'react';
import { 
  Smile, 
  Meh, 
  Frown, 
  Heart, 
  Star, 
  Plus, 
  Trash2, 
  Save, 
  Sparkles, 
  Quote, 
  Calendar,
  Sun,
  Zap,
  BookOpen
} from 'lucide-react';

/**
 * Komponen Utama Vitality Journal
 * Aplikasi ini menyimpan data di localStorage browser pengguna.
 */
const MOODS = [
  { icon: <Smile size={24} />, label: 'Luar Biasa', color: 'bg-yellow-400', textColor: 'text-yellow-700' },
  { icon: <Smile size={24} />, label: 'Senang', color: 'bg-green-400', textColor: 'text-green-700' },
  { icon: <Meh size={24} />, label: 'Biasa Saja', color: 'bg-blue-400', textColor: 'text-blue-700' },
  { icon: <Frown size={24} />, label: 'Sedih', color: 'bg-indigo-400', textColor: 'text-indigo-700' },
  { icon: <Frown size={24} />, label: 'Lelah', color: 'bg-rose-400', textColor: 'text-rose-700' },
];

export default function App() {
  // State untuk entri jurnal
  const [entries, setEntries] = useState(() => {
    const saved = localStorage.getItem('vitality_entries');
    return saved ? JSON.parse(saved) : [];
  });

  // State untuk entri yang sedang ditulis
  const [currentEntry, setCurrentEntry] = useState({
    id: Date.now(),
    date: new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
    mood: 'Biasa Saja',
    gratitude: ['', '', ''],
    thoughts: '',
    wins: ''
  });

  // State untuk kutipan motivasi
  const [quotes, setQuotes] = useState(() => {
    const saved = localStorage.getItem('vitality_quotes');
    return saved ? JSON.parse(saved) : [
      "Jangan berhenti saat lelah, berhentilah saat selesai.",
      "Setiap hari adalah kesempatan baru untuk menjadi lebih baik.",
      "Kamu lebih kuat dari yang kamu bayangkan."
    ];
  });

  const [newQuote, setNewQuote] = useState('');

  // Sinkronisasi ke localStorage setiap kali ada perubahan
  useEffect(() => {
    localStorage.setItem('vitality_entries', JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    localStorage.setItem('vitality_quotes', JSON.stringify(quotes));
  }, [quotes]);

  const saveEntry = () => {
    if (!currentEntry.thoughts.trim() && !currentEntry.wins.trim()) {
      alert("Tuliskan sesuatu sebelum menyimpan!");
      return;
    }
    setEntries([currentEntry, ...entries]);
    // Reset form setelah simpan
    setCurrentEntry({
      id: Date.now(),
      date: new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      mood: 'Biasa Saja',
      gratitude: ['', '', ''],
      thoughts: '',
      wins: ''
    });
  };

  const deleteEntry = (id) => {
    if(window.confirm("Hapus catatan ini?")) {
      setEntries(entries.filter(e => e.id !== id));
    }
  };

  const addQuote = () => {
    if (!newQuote.trim()) return;
    setQuotes([newQuote, ...quotes]);
    setNewQuote('');
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-800 p-4 md:p-8 font-sans selection:bg-rose-200">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Kolom Kiri: Form Jurnal */}
        <div className="lg:col-span-7 space-y-6">
          <header className="space-y-1">
            <h1 className="text-4xl font-black tracking-tighter text-slate-900 flex items-center gap-3">
              VITALITY <Sparkles className="text-yellow-500" fill="currentColor" />
            </h1>
            <p className="text-slate-400 font-medium">Ruang aman untuk pikiran dan semangatmu.</p>
          </header>

          <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-8 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-50 pb-6">
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Hari ini</span>
                <p className="text-lg font-bold text-slate-700">{currentEntry.date}</p>
              </div>
              <div className="flex gap-2">
                {MOODS.map((m) => (
                  <button
                    key={m.label}
                    onClick={() => setCurrentEntry({...currentEntry, mood: m.label})}
                    className={`p-3 rounded-2xl transition-all hover:scale-110 active:scale-90 ${
                      currentEntry.mood === m.label ? `${m.color} ${m.textColor} shadow-lg` : 'bg-slate-50 text-slate-300'
                    }`}
                  >
                    {m.icon}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="font-black text-xs uppercase tracking-widest flex items-center gap-2 text-rose-500">
                  <Heart size={14} fill="currentColor" /> 3 Hal Syukur
                </h3>
                {currentEntry.gratitude.map((item, idx) => (
                  <input
                    key={idx}
                    className="w-full bg-rose-50/50 border-2 border-transparent focus:border-rose-100 focus:bg-white p-4 rounded-2xl outline-none transition-all text-sm font-medium"
                    placeholder={`Syukur ke-${idx + 1}...`}
                    value={item}
                    onChange={(e) => {
                      const newG = [...currentEntry.gratitude];
                      newG[idx] = e.target.value;
                      setCurrentEntry({...currentEntry, gratitude: newG});
                    }}
                  />
                ))}
              </div>

              <div className="space-y-4">
                <h3 className="font-black text-xs uppercase tracking-widest flex items-center gap-2 text-yellow-500">
                  <Zap size={14} fill="currentColor" /> Small Wins
                </h3>
                <textarea
                  className="w-full bg-yellow-50/50 border-2 border-transparent focus:border-yellow-100 focus:bg-white p-4 rounded-2xl outline-none transition-all text-sm font-medium h-[164px] resize-none"
                  placeholder="Apa pencapaian kecilmu hari ini?"
                  value={currentEntry.wins}
                  onChange={(e) => setCurrentEntry({...currentEntry, wins: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-black text-xs uppercase tracking-widest flex items-center gap-2 text-blue-500">
                <BookOpen size={14} fill="currentColor" /> Cerita Hari Ini
              </h3>
              <textarea
                className="w-full bg-blue-50/50 border-2 border-transparent focus:border-blue-100 focus:bg-white p-6 rounded-[2rem] outline-none transition-all text-sm font-medium h-32 resize-none"
                placeholder="Tulis apapun yang ada di kepalamu..."
                value={currentEntry.thoughts}
                onChange={(e) => setCurrentEntry({...currentEntry, thoughts: e.target.value})}
              />
            </div>

            <button 
              onClick={saveEntry}
              className="w-full bg-slate-900 text-white p-5 rounded-2xl font-black tracking-widest flex items-center justify-center gap-3 hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200"
            >
              <Save size={20} /> SIMPAN CATATAN
            </button>
          </div>
        </div>

        {/* Kolom Kanan: Motivasi & Riwayat */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white space-y-6 shadow-2xl">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
              <Star size={14} fill="currentColor" /> Vision Deck
            </h2>
            <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar snap-x">
              {quotes.map((q, i) => (
                <div key={i} className="min-w-[240px] bg-white/10 p-6 rounded-3xl snap-center relative">
                  <Quote className="absolute top-4 left-4 opacity-10" size={32} />
                  <p className="text-sm font-medium leading-relaxed italic">{q}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input 
                className="flex-1 bg-white/5 border border-white/10 p-3 rounded-xl text-xs outline-none focus:border-white/30 text-white"
                placeholder="Tambah kutipan semangat..."
                value={newQuote}
                onChange={(e) => setNewQuote(e.target.value)}
              />
              <button onClick={addQuote} className="p-3 bg-white text-black rounded-xl hover:bg-yellow-400 transition-colors">
                <Plus size={18} />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 px-2 flex items-center gap-2">
              <Calendar size={14} /> Jejak Perjalanan
            </h2>
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {entries.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-100">
                  <BookOpen size={40} className="mx-auto text-slate-100 mb-2" />
                  <p className="text-xs text-slate-300 font-bold italic">Belum ada jejak tersimpan.</p>
                </div>
              ) : (
                entries.map(entry => (
                  <div key={entry.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4 relative group hover:shadow-md transition-shadow animate-in fade-in slide-in-from-top-2">
                    <button 
                      onClick={() => deleteEntry(entry.id)}
                      className="absolute top-4 right-4 text-slate-200 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        MOODS.find(m => m.label === entry.mood)?.color || 'bg-slate-100'
                      } text-white`}>
                        {MOODS.find(m => m.label === entry.mood)?.icon}
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-300 uppercase leading-none">{entry.date}</p>
                        <p className="font-bold text-slate-700">{entry.mood}</p>
                      </div>
                    </div>
                    {entry.wins && (
                      <div className="p-3 bg-yellow-50 rounded-xl">
                        <p className="text-[10px] font-black text-yellow-600 uppercase mb-1">Small Win:</p>
                        <p className="text-xs font-medium text-slate-600">{entry.wins}</p>
                      </div>
                    )}
                    <p className="text-xs text-slate-500 leading-relaxed italic">"{entry.thoughts}"</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}} />
    </div>
  );
}

