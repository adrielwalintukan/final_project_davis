import React from "react";

const categories = [];

const CategoryPerformance: React.FC = () => {
  return (
    <div className="bg-[#1a1a2e] border border-purple-900/20 rounded-xl p-5 animate-fade-up h-full">
      <div className="mb-4">
        <div className="font-['Space_Grotesk'] text-[15px] font-semibold text-white">
          Performa Kategori
        </div>
        <div className="text-[11px] text-[#55556a] mt-0.5">
          Distribusi tersegmentasi di seluruh sektor
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {categories.map((cat) => (
          <div key={cat.name}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-semibold tracking-widest uppercase text-[#9090b0]">
                {cat.name}
              </span>
              <span className="text-[12px] font-semibold text-white">
                {cat.pct}%
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${cat.pct}%`,
                  background: cat.color,
                  boxShadow: `0 0 8px ${cat.glow}`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryPerformance;
