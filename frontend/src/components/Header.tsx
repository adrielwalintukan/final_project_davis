import React, { useState, useEffect } from 'react';

interface HeaderProps {
  onFilterChange: (filters: { startDate: string; endDate: string; category?: string; mode: 'day' | 'month' | 'all' }) => void;
}

const Header: React.FC<HeaderProps> = ({ onFilterChange }) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filterMode, setFilterMode] = useState<'day' | 'month'>('day');
  const [selectedDate, setSelectedDate] = useState("2025-07-15");
  const [selectedMonth, setSelectedMonth] = useState("07"); 

  useEffect(() => {
    fetch("http://localhost:8000/api/metadata/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Gagal mengambil kategori:", err));
  }, []);

  const triggerUpdate = (mode: 'day' | 'month' | 'all', val: string, cat: string) => {
    let start = "";
    let end = "";

    if (mode === 'day') {
      start = val;
      end = val;
    } else if (mode === 'all') {
      start = "2025-02-01";
      end = "2025-10-31";
    } else {
      // Perhitungan bulan individu
      start = `2025-${val}-01`;
      const lastDay = new Date(2025, parseInt(val), 0).getDate();
      end = `2025-${val}-${lastDay}`;
    }

    onFilterChange({
      startDate: start,
      endDate: end,
      category: cat,
      mode: mode === 'all' ? 'month' : mode // Beritahu App bahwa ini mode agregat
    });
  };

  const months = [
    { value: "all", label: "Semua Periode (Feb - Okt)" },
    { value: "02", label: "Februari" },
    { value: "03", label: "Maret" },
    { value: "04", label: "April" },
    { value: "05", label: "Mei" },
    { value: "06", label: "Juni" },
    { value: "07", label: "Juli" },
    { value: "08", label: "Agustus" },
    { value: "09", label: "September" },
    { value: "10", label: "Oktober" }
  ];

  return (
    <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-900/20 bg-[#14141f] shrink-0">
      <div className="font-['Space_Grotesk'] text-xl font-bold leading-tight bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent whitespace-nowrap">
        Ad Campaign<br />Intelligence
      </div>

      <div className="flex items-center gap-4 ml-auto">
        {/* Toggle Mode */}
        <div className="flex bg-[#1e1e30] p-1 rounded-lg border border-purple-900/20">
          <button 
            onClick={() => { setFilterMode('day'); triggerUpdate('day', selectedDate, selectedCategory); }}
            className={`px-3 py-1 text-[10px] font-bold uppercase rounded-md transition-all ${filterMode === 'day' ? 'bg-violet-600 text-white shadow-lg' : 'text-[#55556a] hover:text-[#9090b0]'}`}
          >
            Harian
          </button>
          <button 
            onClick={() => { setFilterMode('month'); triggerUpdate('month', selectedMonth, selectedCategory); }}
            className={`px-3 py-1 text-[10px] font-bold uppercase rounded-md transition-all ${filterMode === 'month' ? 'bg-violet-600 text-white shadow-lg' : 'text-[#55556a] hover:text-[#9090b0]'}`}
          >
            Bulanan
          </button>
        </div>

        {/* Dynamic Input based on Mode */}
        <div className="flex flex-col min-w-[150px]">
          <label className="text-[9px] text-[#55556a] uppercase font-bold tracking-[1.5px] ml-1 mb-0.5">
            {filterMode === 'day' ? 'Analisis Tanggal' : 'Analisis Periode'}
          </label>
          {filterMode === 'day' ? (
            <input
              type="date"
              value={selectedDate}
              min="2025-02-13"
              max="2025-10-12"
              className="bg-[#1e1e30] border border-purple-900/20 rounded-lg px-3 py-1.5 text-[12px] text-white outline-none focus:border-violet-500 [color-scheme:dark]"
              onChange={(e) => {
                setSelectedDate(e.target.value);
                triggerUpdate('day', e.target.value, selectedCategory);
              }}
            />
          ) : (
            <select
              value={selectedMonth}
              className="bg-[#1e1e30] border border-purple-900/20 rounded-lg px-3 py-1.5 text-[12px] text-white outline-none focus:border-violet-500 cursor-pointer"
              onChange={(e) => {
                setSelectedMonth(e.target.value);
                const mode = e.target.value === 'all' ? 'all' : 'month';
                triggerUpdate(mode, e.target.value, selectedCategory);
              }}
            >
              {months.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          )}
        </div>

        {/* Category Selection */}
        <div className="flex flex-col min-w-[160px]">
          <label className="text-[9px] text-[#55556a] uppercase font-bold tracking-[1.5px] ml-1 mb-0.5">Filter Sektor</label>
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              const mode = (filterMode === 'month' && selectedMonth === 'all') ? 'all' : filterMode;
              triggerUpdate(mode, filterMode === 'day' ? selectedDate : selectedMonth, e.target.value);
            }}
            className="bg-[#1e1e30] border border-purple-900/20 rounded-lg px-3 py-1.5 text-[12px] text-white outline-none focus:border-violet-500 cursor-pointer"
          >
            <option value="">Semua Kategori</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
};

export default Header;
