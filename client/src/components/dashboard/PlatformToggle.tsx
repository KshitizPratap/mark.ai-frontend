import React, { useState, useEffect } from 'react';
import { FacebookIcon, YouTubeIcon } from './IconComponents';
import { PlatformType } from '@/types';

interface PlatformToggleProps {
    label: string;
    platform: PlatformType;
    onToggle: (isActive: boolean) => void;
    initialState?: boolean;
}

const platformConfig: Record<string, { icon: string; color: string; component?: React.ElementType }> = {
    'facebook': { icon: 'f', color: 'text-[#1877F2]', component: FacebookIcon },
    'instagram': { icon: 'I', color: 'text-[#C13584]' },
    'linkedin': { icon: 'L', color: 'text-[#0077B5]' },
    'threads': { icon: '@', color: 'text-black' },
    'twitter': { icon: 'X', color: 'text-black' },
    'youtube': { icon: '▶', color: 'text-red-600', component: YouTubeIcon },
    'tiktok': { icon: 'T', color: 'text-[#69C9D0]' },
    'pinterest': { icon: 'P', color: 'text-[#E60023]' },
    'reddit': { icon: 'R', color: 'text-[#FF4500]' },
    'telegram': { icon: 'T', color: 'text-[#0088CC]' },
    'bluesky': { icon: 'B', color: 'text-[#00A8E8]' },
    'gmb': { icon: 'G', color: 'text-[#4285F4]' }
};

const PlatformToggle: React.FC<PlatformToggleProps> = ({ label, platform, onToggle, initialState = false }) => {
    const [active, setActive] = useState(initialState);
    
    useEffect(() => {
        setActive(initialState);
    }, [initialState]);
    
    const config = platformConfig[platform] || { icon: '?', color: 'text-black' };
    const IconComponent = config.component;

    const handleToggle = () => {
        setActive(!active);
        onToggle(!active);
    };

    return (
        <div className="flex items-center space-x-2 cursor-pointer group hover:bg-gray-100 p-1.5 rounded-md transition-colors duration-150 w-full" onClick={handleToggle}>
            <button
                type="button"
                className={`${active ? 'bg-blue-500' : 'bg-gray-200'} relative inline-flex items-center h-5 rounded-full w-9 transition-colors focus:outline-none flex-shrink-0`}
                aria-pressed={active}
            >
                <span className="sr-only">Enable {label}</span>
                <span className={`${active ? 'translate-x-5' : 'translate-x-1'} inline-block w-3.5 h-3.5 transform bg-white rounded-full transition-transform`} />
            </button>

            <div className={`w-5 h-5 flex items-center justify-center text-xs font-bold rounded-sm flex-shrink-0 ${active ? config.color : 'text-gray-400'}`}>
                {IconComponent ? <IconComponent className="w-4 h-4" /> : <span>{config.icon}</span>}
            </div>

            <span className={`text-sm font-medium truncate ${active ? 'text-black' : 'text-gray-500'} group-hover:text-gray-800`}>{label}</span>
        </div>
    );
}

export default PlatformToggle;