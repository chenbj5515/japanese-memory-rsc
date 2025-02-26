// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
"use client"
import React, { useEffect } from "react";

interface BrandIconProps {
    size?: 'normal' | 'large';
    italic?: boolean;
}

const BrandIcon: React.FC<BrandIconProps> = ({ size = 'normal', italic = false }) => {
    
    return (
        <a
            className="relative inline-block whitespace-nowrap mx-1 px-1 cursor-pointer"
            href="/home"
        >
            {/* Logo Container */}
            <span
                className="inline-flex items-center justify-center"
            >
                {/* Text */}
                <span
                    className={`font-['Pacifico',_cursive] text-[#333333] translate-y-[1px] ${size === 'large' ? 'text-3xl' : 'text-2xl'} ${italic ? 'italic' : ''}`}
                    style={{ textShadow: '1px 1px 1px rgba(0,0,0,0.1)' }}
                >
                    bun
                </span>
            </span>
        </a>
    );
};

export default BrandIcon;
