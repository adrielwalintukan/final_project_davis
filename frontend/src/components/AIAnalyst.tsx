import React, { useState, useEffect, useRef } from 'react';

interface Message {
  id: number;
  role: 'ai' | 'user';
  text: string;
  boldWord?: string;
  suffix?: string;
  chip?: string;
  time: string;
}

interface Filters {
  startDate: string;
  endDate: string;
  category?: string;
  mode: 'day' | 'month' | 'all';
}

interface Props {
  filters?: Filters;
  metrics?: any;
}

const greetingBank = [
  "Selamat datang di Pusat Intelijen Kampanye. Saya Analis AI Anda. Ada yang bisa saya bantu hari ini?",
  "Sistem Neural aktif. Mari kita bongkar data kampanye hari ini. Apa yang ingin Anda ketahui?",
  "Halo! Saya siap menganalisis metrik kampanye Anda. Silakan berikan instruksi.",
  "Koneksi stabil. Butuh insight cepat tentang performa iklan kita?"
];

const probeBank = [
  'Tolong buatkan ringkasan performa kampanye yang sedang aktif saat ini.', 
  'Berdasarkan data, platform iklan mana yang memberikan hasil paling efektif?',
  'Bagaimana tren klik (CTR) kita dibandingkan sebelumnya?',
  'Apakah ada anomali dalam pembelanjaan anggaran (budget)?',
  'Tolong bandingkan efektivitas iklan Video dengan Carousel.',
  'Kampanye mana yang mencatat konversi terburuk?'
];

const getRandomItems = (arr: string[], count: number) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// ─── Komponen Info Row ─────────────────────────────────────────────────────────
const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between items-start gap-2 py-2 border-b border-purple-900/15 last:border-0">
    <span className="text-[10px] text-[#55556a] uppercase tracking-wide shrink-0">{label}</span>
    <span className="text-[11px] text-[#c0c0d8] text-right font-mono">{value}</span>
  </div>
);

// ─── Komponen Section Header ──────────────────────────────────────────────────
const SectionHeader = ({ icon, title }: { icon: React.ReactNode; title: string }) => (
  <div className="flex items-center gap-2 mb-2 mt-4 first:mt-0">
    <span className="text-violet-400">{icon}</span>
    <span className="text-[10px] font-bold tracking-widest uppercase text-[#9090b0]">{title}</span>
  </div>
);

// ─── Render baris pesan AI ────────────────────────────────────────────────────
const renderAIText = (text: string) => (
  <div className="flex flex-col gap-1">
    {text.split('\n').map((line, i) => {
      if (line.trim() === '') return <div key={i} className="h-1" />;
      const isBullet = line.trim().startsWith('- ') || line.trim().startsWith('* ');
      if (isBullet) {
        const content = line.trim().slice(2);
        if (content.trim().endsWith(':')) {
          return <p key={i} className="text-[#c0c0d8] font-semibold mt-1">{content}</p>;
        }
        return (
          <div key={i} className="flex gap-2 items-start">
            <span className="mt-1.5 w-1 h-1 rounded-full bg-violet-400 shrink-0" />
            <span>{content}</span>
          </div>
        );
      }
      return <p key={i}>{line}</p>;
    })}
  </div>
);

// ─── Komponen Utama ───────────────────────────────────────────────────────────
const AIAnalyst: React.FC<Props> = ({ filters, metrics }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1, role: 'ai',
      text: greetingBank[0], // Sapaan awal statis, akan diacak setelah dihapus
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);
  const [currentProbes, setCurrentProbes] = useState<string[]>(probeBank.slice(0, 2));
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('percakapan');
  const [selectedModel, setSelectedModel] = useState('gemma-3-27b-it');
  const [width, setWidth] = useState(272);
  const isResizing = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing.current) return;
      let newWidth = document.body.clientWidth - e.clientX;
      if (newWidth < 250) newWidth = 250;
      if (newWidth > 600) newWidth = 600;
      setWidth(newWidth);
    };
    const handleMouseUp = () => {
      isResizing.current = false;
      document.body.style.cursor = 'default';
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const handleMouseDown = () => {
    isResizing.current = true;
    document.body.style.cursor = 'col-resize';
  };

  const handleSend = async (textToSend: string = input) => {
    if (!textToSend.trim() || loading) return;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: Message = { id: Date.now(), role: 'user', text: textToSend, time: now };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    // Auto-pindah ke tab percakapan saat mengirim pesan
    setActiveTab('percakapan');
    try {
      const response = await fetch('http://localhost:8000/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend, model: selectedModel }),
      });
      const data = await response.json();
      const aiMsg: Message = {
        id: Date.now() + 1, role: 'ai',
        text: data.response,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      const errorMsg: Message = {
        id: Date.now() + 1, role: 'ai',
        text: 'Maaf, sistem mengalami gangguan koneksi neural. Silakan coba lagi.',
        time: now
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  // ─── Tab: Konteks ────────────────────────────────────────────────────────────
  const TabKonteks = () => (
    <div className="flex-1 overflow-y-auto scrollbar-hide p-3.5 flex flex-col text-[11px] text-[#9090b0]">
      <SectionHeader
        icon={<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M4 7h16M4 12h16M4 17h10"/></svg>}
        title="Skema Database"
      />
      <div className="bg-[#1a1a2e] border border-purple-900/20 rounded-lg p-3 flex flex-col gap-0">
        {[
          { label: 'campaigns', value: 'id, name, start_date, end_date, budget' },
          { label: 'ads', value: 'id, campaign_id, platform, type, target' },
          { label: 'ad_events', value: 'id, ad_id, user_id, timestamp, type' },
          { label: 'users', value: 'id, gender, age, country, interests' },
        ].map(t => (
          <div key={t.label} className="py-1.5 border-b border-purple-900/15 last:border-0">
            <span className="text-violet-400 font-mono font-bold">{t.label}</span>
            <span className="text-[#55556a]"> → </span>
            <span className="text-[10px] text-[#6b6b8a]">{t.value}</span>
          </div>
        ))}
      </div>

      <SectionHeader
        icon={<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>}
        title="Fitur Dashboard"
      />
      <div className="bg-[#1a1a2e] border border-purple-900/20 rounded-lg p-3 flex flex-col gap-0">
        {[
          { name: 'Command Deck', desc: 'Metrik utama, tren penjualan & distribusi' },
          { name: 'Campaign Insights', desc: 'Detail performa & metrik per kampanye spesifik' },
          { name: 'Archives', desc: 'Tabel lengkap riwayat semua kampanye' },
        ].map(f => (
          <div key={f.name} className="py-1.5 border-b border-purple-900/15 last:border-0">
            <span className="text-[#c0c0d8] font-semibold">{f.name}</span>
            <span className="block text-[10px] text-[#55556a]">{f.desc}</span>
          </div>
        ))}
      </div>

      <SectionHeader
        icon={<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>}
        title="Kemampuan AI"
      />
      <div className="bg-[#1a1a2e] border border-purple-900/20 rounded-lg p-3 flex flex-col gap-1.5">
        {[
          'Analisis performa kampanye',
          'Perbandingan platform iklan',
          'Penjelasan metrik CTR & CVR',
          'Insight tren penjualan',
          'Saran optimasi anggaran',
        ].map(k => (
          <div key={k} className="flex gap-2 items-start">
            <span className="mt-1.5 w-1 h-1 rounded-full bg-emerald-400 shrink-0" />
            <span className="text-[10px]">{k}</span>
          </div>
        ))}
      </div>
    </div>
  );

  // ─── Tab: Variabel ───────────────────────────────────────────────────────────
  const TabVariabel = () => {
    const modeLabel = filters?.mode === 'day' ? 'Harian' : filters?.mode === 'month' ? 'Bulanan' : 'Semua Waktu';
    const categoryLabel = filters?.category || 'Semua Kategori';
    const sameDate = filters?.startDate === filters?.endDate;
    const dateRange = sameDate ? filters?.startDate : `${filters?.startDate} s/d ${filters?.endDate}`;

    return (
      <div className="flex-1 overflow-y-auto scrollbar-hide p-3.5 flex flex-col text-[11px] text-[#9090b0]">
        <SectionHeader
          icon={<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M3 4h18M3 8h18M3 12h12"/></svg>}
          title="Filter Aktif"
        />
        <div className="bg-[#1a1a2e] border border-purple-900/20 rounded-lg p-3">
          <InfoRow label="Mode" value={modeLabel} />
          <InfoRow label="Rentang Tanggal" value={dateRange || '-'} />
          <InfoRow label="Kategori" value={categoryLabel} />
        </div>

        {metrics ? (
          <>
            <SectionHeader
              icon={<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>}
              title="KPI Periode Ini"
            />
            <div className="bg-[#1a1a2e] border border-purple-900/20 rounded-lg p-3">
              <InfoRow label="Total Kampanye" value={metrics.summary.total_campaigns.toLocaleString()} />
              <InfoRow label="Total Budget" value={`$${metrics.summary.total_budget.toLocaleString()}`} />
              <InfoRow label="Audiens Unik" value={metrics.summary.unique_users_reached.toLocaleString()} />
              <InfoRow label="CTR" value={`${metrics.performance.ctr_percent}%`} />
              <InfoRow label="CVR" value={`${metrics.performance.cvr_percent}%`} />
              <InfoRow label="Total Klik" value={metrics.performance.clicks.toLocaleString()} />
              <InfoRow label="Konversi" value={metrics.performance.purchases.toLocaleString()} />
            </div>
          </>
        ) : (
          <div className="mt-4 p-3 bg-[#1a1a2e] border border-purple-900/20 rounded-lg text-center text-[10px] text-[#55556a]">
            Memuat data metrik...
          </div>
        )}

        <SectionHeader
          icon={<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14"/></svg>}
          title="Model AI"
        />
        <div className="bg-[#1a1a2e] border border-purple-900/20 rounded-lg p-3">
          <InfoRow label="Model" value={selectedModel} />
          <InfoRow label="Provider" value="Google AI" />
          <InfoRow label="Bahasa" value="Bahasa Indonesia" />
          <InfoRow label="Status" value="Aktif" />
        </div>
      </div>
    );
  };

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <aside
      style={{ width: `${width}px` }}
      className="bg-[#14141f] border-l border-purple-900/20 flex flex-col relative shrink-0"
    >
      {/* Resizer Handle */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1.5 cursor-col-resize hover:bg-violet-500/80 active:bg-violet-500 z-50 transition-colors"
        onMouseDown={handleMouseDown}
      />

      <div className="flex flex-col h-full w-full overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-purple-900/20 shrink-0">
          <div className="flex items-center justify-between">
            <span className="font-['Space_Grotesk'] text-[15px] font-bold text-white">Analis AI</span>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => {
                  setMessages([{
                    id: Date.now(), role: 'ai',
                    text: greetingBank[Math.floor(Math.random() * greetingBank.length)],
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  }]);
                  setCurrentProbes(getRandomItems(probeBank, 2));
                }}
                className="text-[#55556a] hover:text-red-400 transition-colors cursor-pointer"
                title="Hapus Obrolan"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
              </button>
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-dot shadow-[0_0_6px_rgba(74,222,128,0.7)]" />
            </div>
          </div>
          <p className="text-[9px] tracking-[1.5px] uppercase text-[#55556a] mt-0.5">Asisten Neural Aktif</p>
          <div className={`mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-colors duration-300
            ${loading 
              ? 'bg-amber-500/15 border border-amber-500/30 text-amber-300' 
              : 'bg-violet-500/15 border border-violet-500/30 text-violet-300'
            }`}>
            <span className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${loading ? 'bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.7)] animate-pulse' : 'bg-violet-400 shadow-[0_0_6px_rgba(139,92,246,0.7)]'}`} />
            {loading ? 'Sedang Menganalisis...' : 'Siap untuk Optimasi'}
          </div>
          
          <div className="mt-2 relative">
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              disabled={loading}
              className="w-full appearance-none bg-[#1a1a2e] border border-purple-900/30 rounded-lg px-2.5 py-1.5 text-[10px] text-[#c0c0d8] font-mono outline-none focus:border-violet-500 cursor-pointer disabled:opacity-50"
            >
              <option value="gemini-2.5-flash-lite">gemini-2.5-flash-lite</option>
              <option value="gemma-3-27b-it">gemma-3-27b</option>
              <option value="gemma-3-12b-it">gemma-3-12b</option>
              <option value="gemma-3-4b-it">gemma-3-4b</option>
              <option value="gemma-3-1b-it">gemma-3-1b</option>
            </select>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[#55556a]">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-purple-900/20 shrink-0">
          {['Percakapan', 'Konteks', 'Variabel'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={`flex-1 py-2.5 text-[10px] font-semibold tracking-widest uppercase transition-all cursor-pointer border-b-2
                ${activeTab === tab.toLowerCase()
                  ? 'text-violet-400 border-violet-500'
                  : 'text-[#55556a] border-transparent hover:text-[#9090b0]'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ── Tab Percakapan ── */}
        {activeTab === 'percakapan' && (
          <>
            <div className="flex-1 overflow-y-auto scrollbar-hide p-3.5 flex flex-col gap-3.5">
              {messages.map((msg) => (
                <div key={msg.id} className={`animate-fade-up ${msg.role === 'user' ? 'flex flex-col items-end' : ''}`}>
                  <div
                    className={`px-3 py-2.5 rounded-lg text-[12px] leading-relaxed
                      ${msg.role === 'user'
                        ? 'bg-gradient-to-br from-violet-500/20 to-purple-700/15 border border-violet-500/30 text-white ml-5'
                        : 'bg-[#1a1a2e] border border-purple-900/20 text-[#9090b0]'
                      }`}
                  >
                    {msg.role === 'ai' ? renderAIText(msg.text) : <>{msg.text}</>}
                  </div>
                  <p className={`text-[10px] text-[#55556a] mt-1 px-1 ${msg.role === 'user' ? 'text-right' : ''}`}>{msg.time}</p>
                </div>
              ))}

              {/* Bubble "AI sedang berpikir" */}
              {loading && (
                <div className="animate-fade-up">
                  <div className="px-3 py-2.5 rounded-lg bg-[#1a1a2e] border border-purple-900/20 inline-flex items-center gap-2">
                    <span className="text-[11px] text-[#9090b0] italic">AI sedang berpikir</span>
                    <span className="flex gap-1 items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Probes */}
            <div className="px-3.5 py-3 border-t border-purple-900/20 shrink-0">
              <p className="text-[9px] font-semibold tracking-[1.2px] uppercase text-[#55556a] mb-2">Probe Contoh</p>
              {currentProbes.map((p) => (
                <button
                  key={p}
                  onClick={() => handleSend(p)}
                  className="w-full text-left px-3 py-2 mb-1.5 bg-[#1a1a2e] border border-purple-900/20 rounded-lg text-[11px] text-[#9090b0] hover:border-violet-500 hover:text-white hover:bg-[#1e1e35] transition-all cursor-pointer"
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="px-3.5 pb-3.5 flex items-center gap-2 border-t border-purple-900/20 pt-3 shrink-0">
              <input
                className="flex-1 bg-[#1a1a2e] border border-purple-900/20 rounded-lg px-3 py-2 text-[12px] text-white placeholder-[#55556a] outline-none focus:border-violet-500 transition-colors"
                placeholder="Tanyakan pertanyaan tentang data Anda..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <button
                onClick={() => handleSend()}
                className="w-8 h-8 shrink-0 bg-violet-600 hover:bg-violet-500 rounded-lg flex items-center justify-center text-white hover:shadow-[0_0_12px_rgba(139,92,246,0.5)] transition-all cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            </div>
          </>
        )}

        {/* ── Tab Konteks ── */}
        {activeTab === 'konteks' && <TabKonteks />}

        {/* ── Tab Variabel ── */}
        {activeTab === 'variabel' && <TabVariabel />}
      </div>
    </aside>
  );
};

export default AIAnalyst;
