import '@testing-library/jest-dom'

// Mock IntersectionObserver for framer-motion whileInView
class IntersectionObserver {
    constructor() { }
    observe() { return null; }
    unobserve() { return null; }
    disconnect() { return null; }
}

window.IntersectionObserver = IntersectionObserver;
