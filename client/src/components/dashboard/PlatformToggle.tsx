import React from 'react';
import {
    FacebookIcon,
    YouTubeIcon
    // Import other specific platform icons here if you have them
} from './IconComponents';

/**
 * PlatformToggle is a stateless toggle button for a social platform.
 * The parent component should determine 'active' by checking if the platform is in the array.
 * Example: active={platformArray.includes(label)}
 */
interface PlatformToggleProps {
    label: string;
    icon: string; // Could be actual icon component later, or simple text/emoji
    active: boolean; // true if platform is in the array, false otherwise
    onToggle: () => void; // Function to handle toggle state change
}

const PlatformToggle: React.FC<PlatformToggleProps> = ({ label, icon, active, onToggle }) => {
    const platformIconBg = 'bg-gray-200'; // Adjusted from figma slightly for better contrast bg-[#E5E7EB]
    const platformIconInnerBg = 'bg-white';
    const platformActiveIconBg = 'bg-blue-500'; // bg-[#3b82f6]
    const platformTextColor = 'text-gray-500'; // Adjusted from figma for better contrast text-[#6B7280]
    const platformActiveTextColor = 'text-black';
    const platformIconColor = 'text-gray-400';

    // Active icon colors (can be expanded)
    const instagramColor = 'text-[#C13584]';
    const twitterColor = 'text-black';
    const tikTokColor = 'text-[#69C9D0]';
    const youtubeColor = 'text-red-600';

    let IconComponent: React.ElementType | null = null;
    let iconColorClass = platformIconColor;

    if (icon === 'f') IconComponent = FacebookIcon;
    if (icon === '▶') IconComponent = YouTubeIcon;
    // Add checks for other imported icons here

    if (active) {
        switch (label) {
            case 'Instagram': iconColorClass = instagramColor; break;
            case 'X/Twitter': iconColorClass = twitterColor; break;
            case 'TikTok': iconColorClass = tikTokColor; break;
            case 'YouTube': iconColorClass = youtubeColor; break;
            // Use default active color if no specific match
            default: iconColorClass = platformActiveTextColor;
        }
    }

    return (
        <div className="flex items-center space-x-2 cursor-pointer group hover:bg-gray-100 p-1.5 rounded-md transition-colors duration-150 w-full" onClick={onToggle}>
            {/* Custom Toggle Switch - Simplified style closer to screenshot */}
            <button
                type="button"
                className={`${active ? platformActiveIconBg : platformIconBg
                    } relative inline-flex items-center h-5 rounded-full w-9 transition-colors focus:outline-none flex-shrink-0}`}
                aria-pressed={active}
            >
                <span className="sr-only">Enable {label}</span>
                <span
                    className={`${active ? 'translate-x-5' : 'translate-x-1'
                        } inline-block w-3.5 h-3.5 transform ${platformIconInnerBg} rounded-full transition-transform`}
                />
            </button>

            {/* Platform Icon */}
            <div className={`w-5 h-5 flex items-center justify-center text-xs font-bold rounded-sm flex-shrink-0 ${active ? iconColorClass : platformIconColor}`}>
                {IconComponent ? <IconComponent className="w-4 h-4" /> : <span>{icon}</span>}
            </div>

            {/* Label - removed truncate to show full text */}
            <span className={`text-sm font-medium ${active ? platformActiveTextColor : platformTextColor} group-hover:text-gray-800`}>{label}</span>
        </div>
    );
}

export default PlatformToggle;