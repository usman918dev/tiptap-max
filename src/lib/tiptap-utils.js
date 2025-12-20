import { NodeSelection, Selection, TextSelection } from "@tiptap/pm/state"

export const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

export const MAC_SYMBOLS = {
    mod: "⌘",
    command: "⌘",
    meta: "⌘",
    ctrl: "⌃",
    control: "⌃",
    alt: "⌥",
    option: "⌥",
    shift: "⇧",
    backspace: "Del",
    delete: "⌦",
    enter: "⏎",
    escape: "⎋",
    capslock: "⇪"
}

export function cn(...classes) {
    return classes.filter(Boolean).join(" ");
}

/**
 * Determines if the current platform is macOS
 * @returns boolean indicating if the current platform is Mac
 */
export function isMac() {
    return (typeof navigator !== "undefined" && navigator.platform.toLowerCase().includes("mac"));
}

/**
 * Formats a shortcut key based on the platform (Mac or non-Mac)
 */
export const formatShortcutKey = (key, isMac, capitalize = true) => {
    if (isMac) {
        const lowerKey = key.toLowerCase()
        return MAC_SYMBOLS[lowerKey] || (capitalize ? key.toUpperCase() : key);
    }
    return capitalize ? key.charAt(0).toUpperCase() + key.slice(1) : key;
}

/**
 * Parses a shortcut key string into an array of formatted key symbols
 */
export const parseShortcutKeys = (props) => {
    const { shortcutKeys, delimiter = "+", capitalize = true } = props

    if (!shortcutKeys) return []

    return shortcutKeys
        .split(delimiter)
        .map((key) => key.trim())
        .map((key) => formatShortcutKey(key, isMac(), capitalize));
}

/**
 * Checks if a mark exists in the editor schema
 */
export const isMarkInSchema = (markName, editor) => {
    if (!editor?.schema) return false
    return editor.schema.spec.marks.get(markName) !== undefined;
}

/**
 * Checks if a node exists in the editor schema
 */
export const isNodeInSchema = (nodeName, editor) => {
    if (!editor?.schema) return false
    return editor.schema.spec.nodes.get(nodeName) !== undefined;
}

/**
 * Moves the focus to the next node in the editor
 */
export function focusNextNode(editor) {
    const { state, view } = editor
    const { doc, selection } = state

    const nextSel = Selection.findFrom(selection.$to, 1, true)
    if (nextSel) {
        view.dispatch(state.tr.setSelection(nextSel).scrollIntoView())
        return true
    }

    const paragraphType = state.schema.nodes.paragraph
    if (!paragraphType) {
        console.warn("No paragraph node type found in schema.")
        return false
    }

    const end = doc.content.size
    const para = paragraphType.create()
    let tr = state.tr.insert(end, para)

    const $inside = tr.doc.resolve(end + 1)
    tr = tr.setSelection(TextSelection.near($inside)).scrollIntoView()
    view.dispatch(tr)
    return true
}

/**
 * Checks if a value is a valid position
 */
export function isValidPosition(pos) {
    return typeof pos === "number" && pos >= 0
}

/**
 * Checks if one or more extensions are registered in the Tiptap editor
 */
export function isExtensionAvailable(editor, extensionNames) {
    if (!editor) return false

    const names = Array.isArray(extensionNames) ? extensionNames : [extensionNames]

    const found = names.some((name) =>
        editor.extensionManager.extensions.some((ext) => ext.name === name))

    if (!found) {
        console.warn(
            `None of the extensions [${names.join(", ")}] were found in the editor schema.`
        )
    }

    return found
}

/**
 * Finds a node at the specified position
 */
export function findNodeAtPosition(editor, position) {
    try {
        const node = editor.state.doc.nodeAt(position)
        if (!node) {
            console.warn(`No node found at position ${position}`)
            return null
        }
        return node
    } catch (error) {
        console.error(`Error getting node at position ${position}:`, error)
        return null
    }
}

/**
 * Finds the position and instance of a node in the document
 */
export function findNodePosition(props) {
    const { editor, node, nodePos } = props

    if (!editor || !editor.state?.doc) return null

    const hasValidNode = node !== undefined && node !== null
    const hasValidPos = isValidPosition(nodePos)

    if (!hasValidNode && !hasValidPos) {
        return null
    }

    if (hasValidNode) {
        let foundPos = -1
        let foundNode = null

        editor.state.doc.descendants((currentNode, pos) => {
            if (currentNode === node) {
                foundPos = pos
                foundNode = currentNode
                return false
            }
            return true
        })

        if (foundPos !== -1 && foundNode !== null) {
            return { pos: foundPos, node: foundNode }
        }
    }

    if (hasValidPos) {
        const nodeAtPos = findNodeAtPosition(editor, nodePos)
        if (nodeAtPos) {
            return { pos: nodePos, node: nodeAtPos };
        }
    }

    return null
}

/**
 * Checks if the current selection is a node selection of specified types
 */
export function isNodeTypeSelected(editor, types = []) {
    if (!editor || !editor.state.selection) return false

    const { state } = editor
    const { selection } = state

    if (selection.empty) return false

    if (selection instanceof NodeSelection) {
        const node = selection.node
        return node ? types.includes(node.type.name) : false;
    }

    return false
}

/**
 * Handles image upload with progress tracking
 */
export const handleImageUpload = async (file, onProgress, abortSignal) => {
    if (!file) {
        throw new Error("No file provided")
    }

    if (file.size > MAX_FILE_SIZE) {
        throw new Error(`File size exceeds maximum allowed (${MAX_FILE_SIZE / (1024 * 1024)}MB)`)
    }

    for (let progress = 0; progress <= 100; progress += 10) {
        if (abortSignal?.aborted) {
            throw new Error("Upload cancelled")
        }
        await new Promise((resolve) => setTimeout(resolve, 500))
        onProgress?.({ progress })
    }

    return "/images/tiptap-ui-placeholder-image.jpg"
}

const ATTR_WHITESPACE = /[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g

export function isAllowedUri(uri, protocols) {
    const allowedProtocols = [
        "http", "https", "ftp", "ftps", "mailto", "tel",
        "callto", "sms", "cid", "xmpp",
    ]

    if (protocols) {
        protocols.forEach((protocol) => {
            const nextProtocol = typeof protocol === "string" ? protocol : protocol.scheme
            if (nextProtocol) {
                allowedProtocols.push(nextProtocol)
            }
        })
    }

    return (!uri || uri.replace(ATTR_WHITESPACE, "").match(new RegExp(
        `^(?:(?:${allowedProtocols.join("|")}):|[^a-z]|[a-z0-9+.\\-]+(?:[^a-z+.\\-:]|$))`, "i")));
}

export function sanitizeUrl(inputUrl, baseUrl, protocols) {
    try {
        const url = new URL(inputUrl, baseUrl)
        if (isAllowedUri(url.href, protocols)) {
            return url.href
        }
    } catch {
        // If URL creation fails, it's considered invalid
    }
    return "#"
}
