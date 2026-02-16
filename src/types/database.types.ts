export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            order_items: {
                Row: {
                    created_at: string | null
                    id: string
                    order_id: string
                    price: number
                    product_id: string
                    quantity: number
                }
                Insert: {
                    created_at?: string | null
                    id?: string
                    order_id: string
                    price: number
                    product_id: string
                    quantity: number
                }
                Update: {
                    created_at?: string | null
                    id?: string
                    order_id?: string
                    price?: number
                    product_id?: string
                    quantity?: number
                }
                Relationships: [
                    {
                        foreignKeyName: "order_items_order_id_fkey"
                        columns: ["order_id"]
                        isOneToOne: false
                        referencedRelation: "orders"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "order_items_product_id_fkey"
                        columns: ["product_id"]
                        isOneToOne: false
                        referencedRelation: "products"
                        referencedColumns: ["id"]
                    }
                ]
            }
            orders: {
                Row: {
                    created_at: string | null
                    id: string
                    status: string
                    total_price: number
                    user_id: string
                }
                Insert: {
                    created_at?: string | null
                    id?: string
                    status?: string
                    total_price: number
                    user_id: string
                }
                Update: {
                    created_at?: string | null
                    id?: string
                    status?: string
                    total_price?: number
                    user_id?: string
                }
                Relationships: []
            }
            products: {
                Row: {
                    category: string
                    created_at: string | null
                    id: string
                    image: string
                    name: string
                    price: number
                    tag: string | null
                }
                Insert: {
                    category: string
                    created_at?: string | null
                    id?: string
                    image: string
                    name: string
                    price: number
                    tag?: string | null
                }
                Update: {
                    category?: string
                    created_at?: string | null
                    id?: string
                    image?: string
                    name?: string
                    price?: number
                    tag?: string | null
                }
                Relationships: []
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}
