"use client"

export function ScanlineOverlay() {
    return (
        <div className="fixed inset-0 pointer-events-none z-90 overflow-hidden select-none" aria-hidden="true">
            {/* Scanlines */}
            <div
                className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0)_50%,rgba(0,0,0,0.2)_50%)] bg-size-[100%_4px] opacity-10"
                style={{ backgroundSize: '100% 4px' }}
            />

            {/* Moving scan line */}
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(190,140,40,0.03),transparent)] animate-scanline h-[20%] w-full" />

            {/* Vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.4)_100%)]" />
        </div>
    )
}
