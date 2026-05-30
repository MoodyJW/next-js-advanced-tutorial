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
      lessons: {
        Row: {
          id: string
          slug: string
          title: string
          content_markdown: string
          phase_number: number
          is_published: boolean | null
          created_at: string | null
        }
        Insert: {
          id?: string
          slug: string
          title: string
          content_markdown: string
          phase_number: number
          is_published?: boolean | null
          created_at?: string | null
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          content_markdown?: string
          phase_number?: number
          is_published?: boolean | null
          created_at?: string | null
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          id: string
          user_id: string
          lesson_id: string
          completed_at: string
        }
        Insert: {
          id?: string
          user_id: string
          lesson_id: string
          completed_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          lesson_id?: string
          completed_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          }
        ]
      }
      comments: {
        Row: {
          id: string
          user_id: string
          lesson_id: string
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          lesson_id: string
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          lesson_id?: string
          content?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          }
        ]
      }
    };
    Views: {
      [_ in never]: never
    };
    Functions: {
      [_ in never]: never
    };
    Enums: {
      [_ in never]: never
    };
    CompositeTypes: {
      [_ in never]: never
    };
  };
}
