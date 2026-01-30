export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      admin_sessions: {
        Row: {
          token: string;
          username: string;
          created_at: string;
          expires_at: string;
        };
        Insert: {
          token?: string;
          username: string;
          created_at?: string;
          expires_at: string;
        };
        Update: {
          token?: string;
          username?: string;
          created_at?: string;
          expires_at?: string;
        };
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          title: string;
          slug: string;
          type: "personal" | "china";
          status: "available" | "sold" | "preorder";
          price: number;
          currency: "RUB";
          description: string;
          images: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          type: "personal" | "china";
          status: "available" | "sold" | "preorder";
          price: number;
          currency: "RUB";
          description: string;
          images: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          type?: "personal" | "china";
          status?: "available" | "sold" | "preorder";
          price?: number;
          currency?: "RUB";
          description?: string;
          images?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
