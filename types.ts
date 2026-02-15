export interface Product {
    id: number;
    name: string;
    category: 'Clothing' | 'Electronics' | 'Home';
    price: number;
    image: string;
    tag?: string;
}

export interface NavItem {
    label: string;
    href: string;
}

export interface Category {
    id: string;
    title: string;
    description: string;
    image: string;
}