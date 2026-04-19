import { cn } from "@/lib/cn";

interface PhoneMockupProps {
  className?: string;
  children?: React.ReactNode;
}

export default function PhoneMockup({ className, children }: PhoneMockupProps) {
  return (
    <div className={cn("relative mx-auto", className)}>
      <div className="relative w-[280px] md:w-[300px] rounded-[40px] border-[8px] border-grey-800 bg-grey-900 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.25),0_10px_30px_-10px_rgba(0,0,0,0.1)] overflow-hidden">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[30px] bg-grey-800 rounded-b-2xl z-10" />
        {/* Screen */}
        <div className="relative aspect-[9/19.5] bg-white overflow-hidden">
          {children || (
            <div className="w-full h-full bg-gradient-to-b from-brand-light to-white flex items-center justify-center">
              <span className="text-t5 text-grey-400">Screen</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
