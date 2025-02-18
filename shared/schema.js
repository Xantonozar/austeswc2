import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const research = pgTable("research", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  author: text("author").notNull(),
  publishedDate: timestamp("published_date").notNull(),
  imageUrl: text("image_url"),
});

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  date: timestamp("date").notNull(),
  imageUrl: text("image_url"),
  type: text("type").notNull(),
});

export const team = pgTable("team", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  bio: text("bio").notNull(),
  imageUrl: text("image_url"),
});

export const contact = pgTable("contact", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertResearchSchema = createInsertSchema(research).omit({ id: true });
export const insertActivitySchema = createInsertSchema(activities).omit({ id: true });
export const insertTeamSchema = createInsertSchema(team).omit({ id: true });
export const insertContactSchema = createInsertSchema(contact).omit({ id: true, createdAt: true });