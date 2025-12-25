/**
 * Extension Tier Configuration
 * Defines which Tiptap extensions and toolbar buttons are available in each tier
 */

// Tier definitions with metadata
export const TIERS = {
    essentials: {
        id: 'essentials',
        label: 'Essentials',
        description: 'Basic rich text editing',
        color: 'emerald',
    },
    enhanced: {
        id: 'enhanced',
        label: 'Enhanced',
        description: 'Advanced formatting options',
        color: 'blue',
    },
    pro: {
        id: 'pro',
        label: 'Pro',
        description: 'Full power features',
        color: 'purple',
    },
};

// Extensions available in each tier
export const TIER_EXTENSIONS = {
    essentials: [
        'starterKit',
        'underline',
        'link',
        'typography',
    ],
    enhanced: [
        // Includes all essentials
        'starterKit',
        'underline',
        'link',
        'typography',
        // Plus enhanced features
        'textStyle',
        'fontSize',
        'color',
        'fontFamily',
        'textAlign',
        'highlight',
        'subscript',
        'superscript',
        'horizontalRule',
        'customImage',
        'codeBlockLowlight',
    ],
    pro: [
        // Includes all enhanced
        'starterKit',
        'underline',
        'link',
        'typography',
        'textStyle',
        'fontSize',
        'color',
        'fontFamily',
        'textAlign',
        'highlight',
        'subscript',
        'superscript',
        'horizontalRule',
        'customImage',
        'codeBlockLowlight',
        // Plus pro features
        'table',
        'tableRow',
        'tableHeader',
        'customTableCell',
        'htmlBlock',
        'emojiPicker',
    ],
};

// Toolbar buttons visible in each tier
export const TIER_TOOLBAR = {
    essentials: [
        'undo',
        'redo',
        'bold',
        'italic',
        'underline',
        'headings',
        'lists',
        'link',
        'unlink',
        'quote',
    ],
    enhanced: [
        // All essentials
        'undo',
        'redo',
        'bold',
        'italic',
        'underline',
        'headings',
        'lists',
        'link',
        'unlink',
        'quote',
        // Plus enhanced
        'alignment',
        'highlight',
        'subscript',
        'superscript',
        'horizontalRule',
        'image',
        'code',
        'codeBlock',
        'fontFamily',
        'fontSize',
        'textColor',
    ],
    pro: [
        // All enhanced
        'undo',
        'redo',
        'bold',
        'italic',
        'underline',
        'headings',
        'lists',
        'link',
        'unlink',
        'quote',
        'alignment',
        'highlight',
        'subscript',
        'superscript',
        'horizontalRule',
        'image',
        'code',
        'codeBlock',
        'fontFamily',
        'fontSize',
        'textColor',
        // Plus pro
        'table',
        'htmlBlock',
        'emoji',
    ],
};

// Helper function to check if a feature is available
export const isFeatureAvailable = (tier, feature) => {
    return TIER_TOOLBAR[tier]?.includes(feature) || false;
};

// Helper function to check if extension is available
export const isExtensionAvailable = (tier, extension) => {
    return TIER_EXTENSIONS[tier]?.includes(extension) || false;
};

// Default tier
export const DEFAULT_TIER = 'essentials';

// Local storage key for persisting tier preference
export const TIER_STORAGE_KEY = 'tiptap-editor-tier';

// Local storage key for drag handle toggle
export const DRAG_HANDLE_STORAGE_KEY = 'tiptap-drag-handle-enabled';
