import '@testing-library/jest-dom'

// Mock IntersectionObserver for framer-motion whileInView
class IntersectionObserver {
    constructor() { }
    observe() { return null; }
    unobserve() { return null; }
    disconnect() { return null; }
}

if (typeof window !== 'undefined') {
    window.IntersectionObserver = IntersectionObserver;
}
