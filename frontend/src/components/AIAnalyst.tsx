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

const initialMessages: Message[] = [
  {
    id: 1, role: 'ai',
    text: "Pemindaian sistem selesai. Saya telah mendeteksi ",
    boldWord: 'lonjakan pendapatan 12,5%',
    suffix: ' berkorelasi dengan peningkatan aktivitas Media Sosial di Q1.',
    time: '09:41 AM',
  },
  { id: 2, role: 'user', text: 'Mengapa pengeluaran turun di Maret?', time: '09:45 AM' },
  {
    id: 3, role: 'ai',
    text: 'Penurunan Maret terutama disebabkan oleh ',
    boldWord: 'realokasi anggaran',
    suffix: ' di Jakarta Hub, menyebabkan penurunan 15% di sektor Iklan Display.',
    chip: 'Analisis Node Jakarta',
    time: '09:46 AM',
  },
];

const probes = ['Jelaskan tren penjualan ini', 'Prakiraan Pertumbuhan Kampanye Q4'];

const AIAnalyst: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [activeTab, setActiveTab] = useState('conversation');
  const [width, setWidth] = useState(272);
  const isResizing = useRef(false);

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

  const handleSend = () => {
    if (!input.trim()) return;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [
      ...prev,
      { id: Date.now(), role: 'user', text: input, time: now },
      { id: Date.now() + 1, role: 'ai', text: 'Menganalisis data kampanye Anda... Wawasan akan dihasilkan segera.', time: now },
    ]);
    setInput('');
  };

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
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-dot shadow-[0_0_6px_rgba(74,222,128,0.7)]" />
          </div>
          <p className="text-[9px] tracking-[1.5px] uppercase text-[#55556a] mt-0.5">Asisten Neural Aktif</p>
          <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 bg-violet-500/15 border border-violet-500/30 rounded-lg text-[11px] font-semibold text-violet-300">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shadow-[0_0_6px_rgba(139,92,246,0.7)]" />
            Siap untuk Optimasi
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

        {/* Messages */}
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
                {msg.boldWord ? (
                  <>{msg.text}<strong className="text-violet-400 font-semibold">{msg.boldWord}</strong>{msg.suffix}</>
                ) : msg.text}
                {msg.chip && (
                  <div className="mt-2">
                    <button className="px-2.5 py-1 bg-violet-500/10 border border-violet-500/25 rounded-full text-[10px] text-violet-400 hover:bg-violet-500/20 transition-colors cursor-pointer">
                      {msg.chip}
                    </button>
                  </div>
                )}
              </div>
              <p className={`text-[10px] text-[#55556a] mt-1 px-1 ${msg.role === 'user' ? 'text-right' : ''}`}>{msg.time}</p>
            </div>
          ))}
        </div>

        {/* Probes */}
        <div className="px-3.5 py-3 border-t border-purple-900/20 shrink-0">
          <p className="text-[9px] font-semibold tracking-[1.2px] uppercase text-[#55556a] mb-2">Probe Contoh</p>
          {probes.map((p) => (
            <button
              key={p}
              onClick={() => setInput(p)}
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
            onClick={handleSend}
            className="w-8 h-8 shrink-0 bg-violet-600 hover:bg-violet-500 rounded-lg flex items-center justify-center text-white hover:shadow-[0_0_12px_rgba(139,92,246,0.5)] transition-all cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AIAnalyst;
