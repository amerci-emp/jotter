import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { z } from "zod";
import axios from "axios";

// Initialize tRPC with transformer
const t = initTRPC.create({
   transformer: superjson,  // ✅ Fix: Add transformer
});

// Base URL for JSON server
const JSON_SERVER_URL = "http://localhost:4000";

export const appRouter = t.router({
   getUsers: t.procedure.query(async () => {
      console.log("Get User Call Made")
      const response = await axios.get(`${JSON_SERVER_URL}/members`);
      return response.data;
   }),

   getNotes: t.procedure.query(async () => {
      console.log("Get Notes Call Made")
      const response = await axios.get(`${JSON_SERVER_URL}/notes`);
      return response.data;
   }),

   createUser: t.procedure.input(z.object({
      firstName: z.string(),
      lastName: z.string(),
      id: z.string()
   })).mutation(async ({ input }) => {
      const response = await axios.post(`${JSON_SERVER_URL}/members`, input);
      return response.data;
   }),

   deleteUser: t.procedure.input(z.object({
      id: z.string()
   })).mutation(async ({ input }) => {
      const response = await axios.delete(`${JSON_SERVER_URL}/members/${input.id}`);
      return response.data;
   }),

   updateUser: t.procedure.input(z.object({
      id: z.string(),
      firstName: z.string(),
      lastName: z.string()
   })).mutation(async ({ input }) => {
      const response = await axios.put(`${JSON_SERVER_URL}/members/${input.id}`, input);
      return response.data;
   }),

   getUserNotes: t.procedure.input(z.object({
      userId: z.string()
   })).query(async ({ input }) => {
      const response = await axios.get(`${JSON_SERVER_URL}/notes?member=${input.userId}`);
      return response.data;
   }),

   createNote: t.procedure.input(z.object({
      member: z.string(),
      text: z.string(),
      id: z.string(),
      timestamp: z.string()
   })).mutation(async ({ input }) => {
      const response = await axios.post(`${JSON_SERVER_URL}/notes`, input);
      return response.data;
   }),

   updateNote: t.procedure.input(z.object({
      id: z.string(),
      text: z.string(),
      previousVersion: z.object({
         text: z.string(),
         timestamp: z.string()
      })
   })).mutation(async ({ input }) => {
      // First get the existing note
      const noteResponse = await axios.get(`${JSON_SERVER_URL}/notes/${input.id}`);
      const existingNote = noteResponse.data;

      // Create versions array if it doesn't exist
      const versions = existingNote.versions || [];
      
      // Add the previous version to history
      versions.push({
         text: input.previousVersion.text,
         timestamp: input.previousVersion.timestamp
      });

      // Update the note with new text and versions
      const response = await axios.put(`${JSON_SERVER_URL}/notes/${input.id}`, {
         ...existingNote,
         text: input.text,
         timestamp: new Date().toISOString(),
         versions: versions
      });
      
      return response.data;
   }),
});

export type AppRouter = typeof appRouter;


