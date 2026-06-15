import type { ReactNode } from "react";

interface CodeCardChromeProps {
  filename?: string;
  children: ReactNode;
  /** Extra className applied to the outer wrapper. */
  className?: string;
}

export function TrafficLights() {
  return (
    <div className="flex gap-[8px]">
      <span className="size-[12px] rounded-full bg-[#e76764] border-[0.5px] border-[#df3733]" />
      <span className="size-[12px] rounded-full bg-[#efc944] border-[0.5px] border-[#e9b809]" />
      <span className="size-[12px] rounded-full bg-[#6bc466] border-[0.5px] border-[#3bb036]" />
    </div>
  );
}

export function CodeCardChrome({
  filename,
  children,
  className = "",
}: CodeCardChromeProps) {
  return (
    <div
      className={`w-full bg-white overflow-hidden border-[0.5px] border-[rgba(76,76,59,0.3)] rounded-[6px] shadow-[0_4px_12px_0_rgba(0,0,0,0.04)] flex flex-col ${className}`}
    >
      <div className="bg-panel h-[40px] flex items-center pl-[12px] pr-[16px] shrink-0 gap-[16px]">
        <TrafficLights />
        {filename && (
          <span className="font-mono text-[12px] font-semibold text-[#82807c]">
            {filename}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}
