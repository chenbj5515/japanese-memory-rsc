import React from "react";

export default function Loading() {
    return (
        <div className="relative w-6 h-6">
            {Array.from({ length: 12 }).map((_, i) => (
                <div
                    key={i}
                    className={`absolute left-1/2 top-1/2 w-1 h-3 bg-gray-500 opacity-0 rounded-full shadow-[0_0_3px_rgba(0,0,0,0.2)] animate-fade`}
                    style={{
                        transform: `rotate(${i * 30}deg) translate(0, -150%)`,
                        animationDelay: `-${(12 - i) * 0.1}s`,
                    }}
                ></div>
            ))}
        </div>
    );
};
