import { Hono } from "hono";
import type { Env } from './core-utils';
import { UserEntity, ChatBoardEntity, MentorEntity, ConnectionEntity } from "./entities";
import { ok, bad, notFound, isStr } from './core-utils';
import { Mentor, User, Connection } from "@shared/types";
// Helper to strip password from user object
const sanitizeUser = (user: User): Omit<User, 'passwordHash'> => {
  const { passwordHash, ...sanitized } = user;
  return sanitized;
};
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  app.get('/api/test', (c) => c.json({ success: true, data: { name: 'CF Workers Demo' }}));
  // AUTH ROUTES
  app.post('/api/auth/register', async (c) => {
    const { name, email, password } = await c.req.json();
    if (!isStr(name) || !isStr(email) || !isStr(password)) {
      return bad(c, 'Name, email, and password are required.');
    }
    // Inefficient for production, but fine for a demo. A real app would use a secondary index.
    const allUsers = await UserEntity.list(c.env);
    const existingUser = allUsers.items.find(u => u.email === email);
    if (existingUser) {
      return bad(c, 'A user with this email already exists.');
    }
    const newUser: User = {
      id: crypto.randomUUID(),
      name,
      email,
      // IMPORTANT: In a real application, NEVER store plain text passwords.
      // Always hash and salt passwords using a library like bcrypt.
      passwordHash: password,
      bio: `Welcome! This is a default bio for ${name}.`,
      isMentor: false,
    };
    const created = await UserEntity.create(c.env, newUser);
    return ok(c, sanitizeUser(created));
  });
  app.post('/api/auth/login', async (c) => {
    const { email, password } = await c.req.json();
    if (!isStr(email) || !isStr(password)) {
      return bad(c, 'Email and password are required.');
    }
    const allUsers = await UserEntity.list(c.env);
    const user = allUsers.items.find(u => u.email === email);
    if (!user || user.passwordHash !== password) {
      return c.json({ success: false, error: 'Invalid credentials' }, 401);
    }
    return ok(c, sanitizeUser(user));
  });
  // MENTOR ROUTES
  app.get('/api/mentors', async (c) => {
    await MentorEntity.ensureSeed(c.env);
    const { cursor, limit, searchTerm, specialties } = c.req.query();
    let parsedSpecialties: string[] = [];
    if (specialties && typeof specialties === 'string') {
        parsedSpecialties = specialties.split(',').filter(s => s.trim() !== '');
    }
    if (!searchTerm && parsedSpecialties.length === 0) {
        // Use the more efficient direct listing if no filters are applied
        const page = await MentorEntity.list(c.env, cursor ?? null, limit ? Math.max(1, (Number(limit) | 0)) : 12);
        return ok(c, page);
    }
    const page = await MentorEntity.searchAndFilter(
        c.env,
        searchTerm ?? null,
        parsedSpecialties,
        cursor ?? null,
        limit ? Math.max(1, (Number(limit) | 0)) : 12
    );
    return ok(c, page);
  });
  app.get('/api/mentors/:id', async (c) => {
    const { id } = c.req.param();
    const mentorEntity = new MentorEntity(c.env, id);
    if (!(await mentorEntity.exists())) {
      return notFound(c, 'Mentor not found');
    }
    const mentor = await mentorEntity.getState();
    return ok(c, mentor);
  });
  app.post('/api/mentors', async (c) => {
    const mentorData = (await c.req.json()) as Omit<Mentor, 'id'>;
    if (!mentorData || !mentorData.name) {
        return bad(c, 'Mentor data is invalid');
    }
    const newMentor: Mentor = {
        id: crypto.randomUUID(),
        ...mentorData,
    };
    const created = await MentorEntity.create(c.env, newMentor);
    return ok(c, created);
  });
  app.put('/api/mentors/:id', async (c) => {
    const { id } = c.req.param();
    const mentorData = (await c.req.json()) as Partial<Omit<Mentor, 'id'>>;
    const mentorEntity = new MentorEntity(c.env, id);
    if (!(await mentorEntity.exists())) {
        return notFound(c, 'Mentor not found');
    }
    await mentorEntity.patch(mentorData);
    const updatedMentor = await mentorEntity.getState();
    return ok(c, updatedMentor);
  });
  app.delete('/api/mentors/:id', async (c) => {
    const { id } = c.req.param();
    const deleted = await MentorEntity.delete(c.env, id);
    if (!deleted) {
        return notFound(c, 'Mentor not found');
    }
    return ok(c, { id, deleted });
  });
  // USER PROFILE & MANAGEMENT
  app.get('/api/users', async (c) => {
    await UserEntity.ensureSeed(c.env);
    const cq = c.req.query('cursor');
    const lq = c.req.query('limit');
    const page = await UserEntity.list(c.env, cq ?? null, lq ? Math.max(1, (Number(lq) | 0)) : undefined);
    return ok(c, { ...page, items: page.items.map(sanitizeUser) });
  });
  app.put('/api/users/:id', async (c) => {
    const { id } = c.req.param();
    const { name, bio, isMentor } = await c.req.json();
    const userEntity = new UserEntity(c.env, id);
    if (!(await userEntity.exists())) {
      return notFound(c, 'User not found');
    }
    const updateData: Partial<User> = {};
    if (isStr(name)) updateData.name = name;
    if (typeof bio === 'string') updateData.bio = bio;
    if (typeof isMentor === 'boolean') updateData.isMentor = isMentor;
    await userEntity.patch(updateData);
    const updatedUser = await userEntity.getState();
    return ok(c, sanitizeUser(updatedUser));
  });
  // CONNECTION ROUTES
  app.post('/api/connections', async (c) => {
    const { mentorId, menteeId, initialMessage } = await c.req.json(); // Destructure initialMessage
    if (!isStr(mentorId) || !isStr(menteeId)) {
      return bad(c, 'mentorId and menteeId are required.');
    }
    const newConnection: Connection = {
      id: crypto.randomUUID(),
      mentorId,
      menteeId,
      status: 'pending',
      requestedAt: Date.now(),
      initialMessage: isStr(initialMessage) ? initialMessage : undefined, // Store initialMessage if provided
    };
    const created = await ConnectionEntity.create(c.env, newConnection);
    return ok(c, created);
  });
  app.put('/api/connections/:id', async (c) => {
    const { id } = c.req.param();
    const { status } = await c.req.json();
    if (status !== 'accepted' && status !== 'declined') {
      return bad(c, 'Invalid status. Must be "accepted" or "declined".');
    }
    const connectionEntity = new ConnectionEntity(c.env, id);
    if (!(await connectionEntity.exists())) {
      return notFound(c, 'Connection not found');
    }
    const connection = await connectionEntity.getState(); // Get current state to check chatId
    const updateData: Partial<Connection> = { status };
    if (status === 'accepted') {
      updateData.acceptedAt = Date.now();
      // If no chat exists for this connection, create one
      if (!connection.chatId) {
        const mentor = await MentorEntity.get(c.env, connection.mentorId);
        const mentee = await UserEntity.get(c.env, connection.menteeId);
        if (mentor && mentee) {
            const chatTitle = `Mentorship Chat: ${mentee.name} & ${mentor.name}`;
            const newChat = await ChatBoardEntity.create(c.env, { id: crypto.randomUUID(), title: chatTitle, messages: [] });
            updateData.chatId = newChat.id;
        } else {
            console.warn(`Could not create chat for connection ${id}: Mentor or Mentee not found.`);
        }
      }
    }
    await connectionEntity.patch(updateData);
    const updatedConnection = await connectionEntity.getState();
    return ok(c, updatedConnection);
  });
  app.get('/api/connections/mentee/:menteeId', async (c) => {
    const { menteeId } = c.req.param();
    const allConnections = await ConnectionEntity.list(c.env);
    const menteeConnections = allConnections.items.filter(conn => conn.menteeId === menteeId);
    return ok(c, menteeConnections);
  });
  app.get('/api/connections/mentor/:mentorId', async (c) => {
    const { mentorId } = c.req.param();
    const allConnections = await ConnectionEntity.list(c.env);
    const mentorConnections = allConnections.items.filter(conn => conn.mentorId === mentorId);
    return ok(c, mentorConnections);
  });
  // CHATS
  app.get('/api/chats', async (c) => {
    await ChatBoardEntity.ensureSeed(c.env);
    const cq = c.req.query('cursor');
    const lq = c.req.query('limit');
    const page = await ChatBoardEntity.list(c.env, cq ?? null, lq ? Math.max(1, (Number(lq) | 0)) : undefined);
    return ok(c, page);
  });
  app.get('/api/chats/:chatId', async (c) => { // New endpoint to get a single chat by ID
    const chatId = c.req.param('chatId');
    const chat = new ChatBoardEntity(c.env, chatId);
    if (!await chat.exists()) return notFound(c, 'Chat not found');
    const chatState = await chat.getState();
    return ok(c, { id: chatState.id, title: chatState.title });
  });
  app.post('/api/chats', async (c) => {
    const { title } = (await c.req.json()) as { title?: string };
    if (!title?.trim()) return bad(c, 'title required');
    const created = await ChatBoardEntity.create(c.env, { id: crypto.randomUUID(), title: title.trim(), messages: [] });
    return ok(c, { id: created.id, title: created.title });
  });
  // MESSAGES
  app.get('/api/chats/:chatId/messages', async (c) => {
    const chat = new ChatBoardEntity(c.env, c.req.param('chatId'));
    if (!await chat.exists()) return notFound(c, 'chat not found');
    return ok(c, await chat.listMessages());
  });
  app.post('/api/chats/:chatId/messages', async (c) => {
    const chatId = c.req.param('chatId');
    const { userId, text } = (await c.req.json()) as { userId?: string; text?: string };
    if (!isStr(userId) || !text?.trim()) return bad(c, 'userId and text required');
    const chat = new ChatBoardEntity(c.env, chatId);
    if (!await chat.exists()) return notFound(c, 'chat not found');
    return ok(c, await chat.sendMessage(userId, text.trim()));
  });
  // DELETE: Users
  app.delete('/api/users/:id', async (c) => ok(c, { id: c.req.param('id'), deleted: await UserEntity.delete(c.env, c.req.param('id')) }));
  app.post('/api/users/deleteMany', async (c) => {
    const { ids } = (await c.req.json()) as { ids?: string[] };
    const list = ids?.filter(isStr) ?? [];
    if (list.length === 0) return bad(c, 'ids required');
    return ok(c, { deletedCount: await UserEntity.deleteMany(c.env, list), ids: list });
  });
  // DELETE: Chats
  app.delete('/api/chats/:id', async (c) => ok(c, { id: c.req.param('id'), deleted: await ChatBoardEntity.delete(c.env, c.req.param('id')) }));
  app.post('/api/chats/deleteMany', async (c) => {
    const { ids } = (await c.req.json()) as { ids?: string[] };
    const list = ids?.filter(isStr) ?? [];
    if (list.length === 0) return bad(c, 'ids required');
    return ok(c, { deletedCount: await ChatBoardEntity.deleteMany(c.env, list), ids: list });
  });
}