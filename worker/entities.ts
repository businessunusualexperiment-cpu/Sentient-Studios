/**
 * Minimal real-world demo: One Durable Object instance per entity (User, ChatBoard), with Indexes for listing.
 */
import { IndexedEntity, Index, Env } from "./core-utils";
import type { User, Chat, ChatMessage, Mentor, Connection } from "@shared/types";
import { MOCK_CHAT_MESSAGES, MOCK_CHATS, MOCK_USERS, MOCK_MENTORS } from "@shared/mock-data";
// USER ENTITY: one DO instance per user
export class UserEntity extends IndexedEntity<User> {
  static readonly entityName = "user";
  static readonly indexName = "users";
  static readonly initialState: User = { id: "", name: "", email: "", passwordHash: "", bio: "", isMentor: false };
  static seedData = MOCK_USERS;
  static async get(env: Env, id: string): Promise<User | null> {
    const userEntity = new this(env, id);
    if (!(await userEntity.exists())) {
        return null;
    }
    return userEntity.getState();
  }
}
// CHAT BOARD ENTITY: one DO instance per chat board, stores its own messages
export type ChatBoardState = Chat & { messages: ChatMessage[] };
const SEED_CHAT_BOARDS: ChatBoardState[] = MOCK_CHATS.map(c => ({
  ...c,
  messages: MOCK_CHAT_MESSAGES.filter(m => m.chatId === c.id),
}));
export class ChatBoardEntity extends IndexedEntity<ChatBoardState> {
  static readonly entityName = "chat";
  static readonly indexName = "chats";
  static readonly initialState: ChatBoardState = { id: "", title: "", messages: [] };
  static seedData = SEED_CHAT_BOARDS;
  async listMessages(): Promise<ChatMessage[]> {
    const { messages } = await this.getState();
    return messages;
  }
  async sendMessage(userId: string, text: string): Promise<ChatMessage> {
    const msg: ChatMessage = { id: crypto.randomUUID(), chatId: this.id, userId, text, ts: Date.now() };
    await this.mutate(s => ({ ...s, messages: [...s.messages, msg] }));
    return msg;
  }
}
// MENTOR ENTITY: one DO instance per mentor
export class MentorEntity extends IndexedEntity<Mentor> {
    static readonly entityName = "mentor";
    static readonly indexName = "mentors";
    static readonly initialState: Mentor = {
        id: "",
        name: "",
        title: "",
        company: "",
        specialties: [],
        bio: "",
        imageUrl: "",
    };
    static seedData = MOCK_MENTORS;
    static async get(env: Env, id: string): Promise<Mentor | null> {
        const mentorEntity = new this(env, id);
        if (!(await mentorEntity.exists())) {
            return null;
        }
        return mentorEntity.getState();
    }
    static async searchAndFilter(
        env: Env,
        searchTerm: string | null,
        specialties: string[],
        cursor: string | null,
        limit: number
    ): Promise<{ items: Mentor[]; next: string | null }> {
        const idx = new Index<string>(env, this.indexName);
        const allIds = await idx.list();
        const items: Mentor[] = [];
        const lowercasedTerm = searchTerm?.toLowerCase();
        // Find where to start in the full list of IDs
        const startIndex = cursor ? allIds.indexOf(cursor) + 1 : 0;
        if (cursor && startIndex === 0) { // indexOf returns -1 if not found, so +1 is 0.
            return { items: [], next: null };
        }
        // Iterate through IDs, fetching and filtering one-by-one until we have a full page.
        // To determine if there's a next page, we fetch `limit + 1` items.
        for (let i = startIndex; i < allIds.length; i++) {
            const id = allIds[i];
            const mentor = await new this(env, id).getState();
            // Apply search term filter
            if (lowercasedTerm) {
                const isMatch =
                    mentor.name.toLowerCase().includes(lowercasedTerm) ||
                    mentor.title.toLowerCase().includes(lowercasedTerm) ||
                    mentor.company.toLowerCase().includes(lowercasedTerm) ||
                    mentor.specialties.some(s => s.toLowerCase().includes(lowercasedTerm));
                if (!isMatch) {
                    continue;
                }
            }
            // Apply specialties filter
            if (specialties.length > 0) {
                const isMatch = specialties.some(selectedSpec => mentor.specialties.includes(selectedSpec));
                if (!isMatch) {
                    continue;
                }
            }
            // If it passes all filters, add it to the list
            items.push(mentor);
            // If we have enough items for the page plus one to check for a next page, we can stop.
            if (items.length > limit) {
                break;
            }
        }
        let next: string | null = null;
        if (items.length > limit) {
            // There is a next page. The cursor is the ID of the last item on the current page.
            next = items[limit - 1].id;
            // Trim the list to the page size.
            items.splice(limit);
        }
        return { items, next };
    }
}
// CONNECTION ENTITY: one DO instance per connection
export class ConnectionEntity extends IndexedEntity<Connection> {
    static readonly entityName = "connection";
    static readonly indexName = "connections";
    static readonly initialState: Connection = {
        id: "",
        mentorId: "",
        menteeId: "",
        status: "pending",
        requestedAt: 0,
        initialMessage: "",
        chatId: undefined, // Added chatId to the initial state
    };
}