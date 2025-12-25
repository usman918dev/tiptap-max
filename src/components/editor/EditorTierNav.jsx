'use client';

import { TIERS } from './config/extensionTiers';
import { GripVertical } from 'lucide-react';

/**
 * EditorTierNav - Navigation tabs for switching between editor tiers
 * Also includes a toggle for drag handle functionality
 */
export default function EditorTierNav({
    currentTier,
    onTierChange,
    dragHandleEnabled,
    onDragHandleToggle
}) {
    const tiers = Object.values(TIERS);

    return (
        <div className="flex items-center justify-center gap-2 p-2 rounded-xl bg-[var(--bg-surface)]/50 border border-[var(--border-secondary)] backdrop-blur-sm mb-4">
            {/* Tier Tabs */}
            <div className="flex items-center bg-[var(--bg-elevated)] rounded-lg p-1 gap-1">
                {tiers.map((tier) => (
                    <button
                        key={tier.id}
                        onClick={() => onTierChange(tier.id)}
                        className={`
                            relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
                            ${currentTier === tier.id
                                ? 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white shadow-lg shadow-[var(--color-primary)]/25'
                                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]'
                            }
                        `}
                    >
                        {tier.label}
                        {currentTier === tier.id && (
                            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white" />
                        )}
                    </button>
                ))}
            </div>

            {/* Separator */}
            <div className="w-px h-8 bg-[var(--border-secondary)]" />

            {/* Drag Handle Toggle */}
            <button
                onClick={onDragHandleToggle}
                className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
                    ${dragHandleEnabled
                        ? 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white shadow-lg shadow-[var(--color-primary)]/25'
                        : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]'
                    }
                `}
                title={dragHandleEnabled ? 'Drag & Drop enabled' : 'Drag & Drop disabled'}
            >
                <GripVertical className="w-4 h-4" />
                <span className="hidden sm:inline">Drag & Drop</span>
            </button>
        </div>
    );
}
