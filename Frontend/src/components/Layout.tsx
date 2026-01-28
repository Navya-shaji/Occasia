import { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <div
            className="min-h-screen flex items-center justify-center p-6"
            style={{
                background: 'radial-gradient(circle at top left, rgba(79, 70, 229, 0.1), #0f172a, #000000)'
            }}
        >
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                <div
                    className="absolute rounded-full"
                    style={{
                        top: '-10%',
                        left: '-10%',
                        width: '40%',
                        height: '40%',
                        backgroundColor: 'rgba(147, 51, 234, 0.1)',
                        filter: 'blur(120px)'
                    }}
                />
                <div
                    className="absolute rounded-full"
                    style={{
                        bottom: '-10%',
                        right: '-10%',
                        width: '40%',
                        height: '40%',
                        backgroundColor: 'rgba(37, 99, 235, 0.1)',
                        filter: 'blur(120px)'
                    }}
                />
            </div>
            {children}
        </div>
    );
}
