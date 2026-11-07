import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "cms"."enum_users_role" AS ENUM('user', 'admin');
  CREATE TYPE "cms"."enum_site_pages_sections_kind" AS ENUM('hero', 'editorial', 'cta', 'faq', 'source-list');
  CREATE TYPE "cms"."enum_site_pages_publication_status" AS ENUM('draft', 'review', 'published');
  CREATE TYPE "cms"."enum_verified_partners_publication_status" AS ENUM('draft', 'review', 'published');
  CREATE TYPE "cms"."enum_research_notes_publication_status" AS ENUM('draft', 'review', 'published');
  CREATE TYPE "cms"."enum_operator_reviews_review_status" AS ENUM('pending', 'requested_info', 'verified', 'rejected', 'expired');
  CREATE TYPE "cms"."enum_payload_llm_instructions_entity_type" AS ENUM('collection', 'global');
  CREATE TABLE "cms"."users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"email" varchar NOT NULL,
  	"email_verified" boolean DEFAULT false,
  	"name" varchar,
  	"image" varchar,
  	"role" "cms"."enum_users_role" DEFAULT 'user' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "cms"."users_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "cms"."site_pages_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kind" "cms"."enum_site_pages_sections_kind" NOT NULL,
  	"heading" varchar,
  	"body" varchar,
  	"action_label" varchar,
  	"action_href" varchar
  );
  
  CREATE TABLE "cms"."site_pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"publication_status" "cms"."enum_site_pages_publication_status" DEFAULT 'draft' NOT NULL,
  	"summary" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "cms"."site_pages_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "cms"."verified_partners" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"publication_status" "cms"."enum_verified_partners_publication_status" DEFAULT 'draft',
  	"public_summary" varchar,
  	"approval_evidence_reference" varchar,
  	"verified_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "cms"."verified_partners_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "cms"."research_notes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"summary" varchar NOT NULL,
  	"source_reference" varchar NOT NULL,
  	"publication_status" "cms"."enum_research_notes_publication_status" DEFAULT 'draft',
  	"licensing_cleared" boolean DEFAULT false,
  	"reviewed_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "cms"."research_notes_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "cms"."operator_reviews" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"organization_name" varchar NOT NULL,
  	"neon_facility_id" varchar NOT NULL,
  	"review_status" "cms"."enum_operator_reviews_review_status" DEFAULT 'pending',
  	"analyst_notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "cms"."operator_reviews_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "cms"."sessions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"expires_at" timestamp(3) with time zone NOT NULL,
  	"token" varchar NOT NULL,
  	"ip_address" varchar,
  	"user_agent" varchar,
  	"user_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "cms"."sessions_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "cms"."accounts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"account_id" varchar NOT NULL,
  	"provider_id" varchar NOT NULL,
  	"user_id" integer NOT NULL,
  	"access_token" varchar,
  	"refresh_token" varchar,
  	"id_token" varchar,
  	"access_token_expires_at" timestamp(3) with time zone,
  	"refresh_token_expires_at" timestamp(3) with time zone,
  	"scope" varchar,
  	"password" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "cms"."accounts_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "cms"."verifications" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"identifier" varchar NOT NULL,
  	"value" varchar NOT NULL,
  	"expires_at" timestamp(3) with time zone NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "cms"."verifications_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "cms"."payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "cms"."payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "cms"."payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"site_pages_id" integer,
  	"verified_partners_id" integer,
  	"research_notes_id" integer,
  	"operator_reviews_id" integer,
  	"sessions_id" integer,
  	"accounts_id" integer,
  	"verifications_id" integer
  );
  
  CREATE TABLE "cms"."payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "cms"."payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "cms"."payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "cms"."payload_llm_instructions" (
  	"id" varchar PRIMARY KEY NOT NULL,
  	"entity_slug" varchar NOT NULL,
  	"entity_type" "cms"."enum_payload_llm_instructions_entity_type" NOT NULL,
  	"additional_instructions" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "cms"."payload_llm_instructions_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" varchar NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  ALTER TABLE "cms"."users_rels" ADD CONSTRAINT "users_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "cms"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."users_rels" ADD CONSTRAINT "users_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "cms"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."site_pages_sections" ADD CONSTRAINT "site_pages_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."site_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."site_pages_rels" ADD CONSTRAINT "site_pages_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "cms"."site_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."site_pages_rels" ADD CONSTRAINT "site_pages_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "cms"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."verified_partners_rels" ADD CONSTRAINT "verified_partners_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "cms"."verified_partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."verified_partners_rels" ADD CONSTRAINT "verified_partners_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "cms"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."research_notes_rels" ADD CONSTRAINT "research_notes_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "cms"."research_notes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."research_notes_rels" ADD CONSTRAINT "research_notes_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "cms"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."operator_reviews_rels" ADD CONSTRAINT "operator_reviews_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "cms"."operator_reviews"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."operator_reviews_rels" ADD CONSTRAINT "operator_reviews_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "cms"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "cms"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."sessions_rels" ADD CONSTRAINT "sessions_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "cms"."sessions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."sessions_rels" ADD CONSTRAINT "sessions_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "cms"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "cms"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."accounts_rels" ADD CONSTRAINT "accounts_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "cms"."accounts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."accounts_rels" ADD CONSTRAINT "accounts_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "cms"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."verifications_rels" ADD CONSTRAINT "verifications_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "cms"."verifications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."verifications_rels" ADD CONSTRAINT "verifications_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "cms"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "cms"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "cms"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_site_pages_fk" FOREIGN KEY ("site_pages_id") REFERENCES "cms"."site_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_verified_partners_fk" FOREIGN KEY ("verified_partners_id") REFERENCES "cms"."verified_partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_research_notes_fk" FOREIGN KEY ("research_notes_id") REFERENCES "cms"."research_notes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_operator_reviews_fk" FOREIGN KEY ("operator_reviews_id") REFERENCES "cms"."operator_reviews"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_sessions_fk" FOREIGN KEY ("sessions_id") REFERENCES "cms"."sessions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_accounts_fk" FOREIGN KEY ("accounts_id") REFERENCES "cms"."accounts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_verifications_fk" FOREIGN KEY ("verifications_id") REFERENCES "cms"."verifications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "cms"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "cms"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."payload_llm_instructions_rels" ADD CONSTRAINT "payload_llm_instructions_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "cms"."payload_llm_instructions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."payload_llm_instructions_rels" ADD CONSTRAINT "payload_llm_instructions_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "cms"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "users_email_idx" ON "cms"."users" USING btree ("email");
  CREATE INDEX "users_updated_at_idx" ON "cms"."users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "cms"."users" USING btree ("created_at");
  CREATE INDEX "users_rels_order_idx" ON "cms"."users_rels" USING btree ("order");
  CREATE INDEX "users_rels_parent_idx" ON "cms"."users_rels" USING btree ("parent_id");
  CREATE INDEX "users_rels_path_idx" ON "cms"."users_rels" USING btree ("path");
  CREATE INDEX "users_rels_users_id_idx" ON "cms"."users_rels" USING btree ("users_id");
  CREATE INDEX "site_pages_sections_order_idx" ON "cms"."site_pages_sections" USING btree ("_order");
  CREATE INDEX "site_pages_sections_parent_id_idx" ON "cms"."site_pages_sections" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "site_pages_slug_idx" ON "cms"."site_pages" USING btree ("slug");
  CREATE INDEX "site_pages_updated_at_idx" ON "cms"."site_pages" USING btree ("updated_at");
  CREATE INDEX "site_pages_created_at_idx" ON "cms"."site_pages" USING btree ("created_at");
  CREATE INDEX "site_pages_rels_order_idx" ON "cms"."site_pages_rels" USING btree ("order");
  CREATE INDEX "site_pages_rels_parent_idx" ON "cms"."site_pages_rels" USING btree ("parent_id");
  CREATE INDEX "site_pages_rels_path_idx" ON "cms"."site_pages_rels" USING btree ("path");
  CREATE INDEX "site_pages_rels_users_id_idx" ON "cms"."site_pages_rels" USING btree ("users_id");
  CREATE INDEX "verified_partners_updated_at_idx" ON "cms"."verified_partners" USING btree ("updated_at");
  CREATE INDEX "verified_partners_created_at_idx" ON "cms"."verified_partners" USING btree ("created_at");
  CREATE INDEX "verified_partners_rels_order_idx" ON "cms"."verified_partners_rels" USING btree ("order");
  CREATE INDEX "verified_partners_rels_parent_idx" ON "cms"."verified_partners_rels" USING btree ("parent_id");
  CREATE INDEX "verified_partners_rels_path_idx" ON "cms"."verified_partners_rels" USING btree ("path");
  CREATE INDEX "verified_partners_rels_users_id_idx" ON "cms"."verified_partners_rels" USING btree ("users_id");
  CREATE INDEX "research_notes_updated_at_idx" ON "cms"."research_notes" USING btree ("updated_at");
  CREATE INDEX "research_notes_created_at_idx" ON "cms"."research_notes" USING btree ("created_at");
  CREATE INDEX "research_notes_rels_order_idx" ON "cms"."research_notes_rels" USING btree ("order");
  CREATE INDEX "research_notes_rels_parent_idx" ON "cms"."research_notes_rels" USING btree ("parent_id");
  CREATE INDEX "research_notes_rels_path_idx" ON "cms"."research_notes_rels" USING btree ("path");
  CREATE INDEX "research_notes_rels_users_id_idx" ON "cms"."research_notes_rels" USING btree ("users_id");
  CREATE INDEX "operator_reviews_updated_at_idx" ON "cms"."operator_reviews" USING btree ("updated_at");
  CREATE INDEX "operator_reviews_created_at_idx" ON "cms"."operator_reviews" USING btree ("created_at");
  CREATE INDEX "operator_reviews_rels_order_idx" ON "cms"."operator_reviews_rels" USING btree ("order");
  CREATE INDEX "operator_reviews_rels_parent_idx" ON "cms"."operator_reviews_rels" USING btree ("parent_id");
  CREATE INDEX "operator_reviews_rels_path_idx" ON "cms"."operator_reviews_rels" USING btree ("path");
  CREATE INDEX "operator_reviews_rels_users_id_idx" ON "cms"."operator_reviews_rels" USING btree ("users_id");
  CREATE UNIQUE INDEX "sessions_token_idx" ON "cms"."sessions" USING btree ("token");
  CREATE INDEX "sessions_user_idx" ON "cms"."sessions" USING btree ("user_id");
  CREATE INDEX "sessions_updated_at_idx" ON "cms"."sessions" USING btree ("updated_at");
  CREATE INDEX "sessions_created_at_idx" ON "cms"."sessions" USING btree ("created_at");
  CREATE INDEX "sessions_rels_order_idx" ON "cms"."sessions_rels" USING btree ("order");
  CREATE INDEX "sessions_rels_parent_idx" ON "cms"."sessions_rels" USING btree ("parent_id");
  CREATE INDEX "sessions_rels_path_idx" ON "cms"."sessions_rels" USING btree ("path");
  CREATE INDEX "sessions_rels_users_id_idx" ON "cms"."sessions_rels" USING btree ("users_id");
  CREATE INDEX "accounts_user_idx" ON "cms"."accounts" USING btree ("user_id");
  CREATE INDEX "accounts_updated_at_idx" ON "cms"."accounts" USING btree ("updated_at");
  CREATE INDEX "accounts_created_at_idx" ON "cms"."accounts" USING btree ("created_at");
  CREATE INDEX "accounts_rels_order_idx" ON "cms"."accounts_rels" USING btree ("order");
  CREATE INDEX "accounts_rels_parent_idx" ON "cms"."accounts_rels" USING btree ("parent_id");
  CREATE INDEX "accounts_rels_path_idx" ON "cms"."accounts_rels" USING btree ("path");
  CREATE INDEX "accounts_rels_users_id_idx" ON "cms"."accounts_rels" USING btree ("users_id");
  CREATE INDEX "verifications_updated_at_idx" ON "cms"."verifications" USING btree ("updated_at");
  CREATE INDEX "verifications_created_at_idx" ON "cms"."verifications" USING btree ("created_at");
  CREATE INDEX "verifications_rels_order_idx" ON "cms"."verifications_rels" USING btree ("order");
  CREATE INDEX "verifications_rels_parent_idx" ON "cms"."verifications_rels" USING btree ("parent_id");
  CREATE INDEX "verifications_rels_path_idx" ON "cms"."verifications_rels" USING btree ("path");
  CREATE INDEX "verifications_rels_users_id_idx" ON "cms"."verifications_rels" USING btree ("users_id");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "cms"."payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "cms"."payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "cms"."payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "cms"."payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "cms"."payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "cms"."payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "cms"."payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "cms"."payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_site_pages_id_idx" ON "cms"."payload_locked_documents_rels" USING btree ("site_pages_id");
  CREATE INDEX "payload_locked_documents_rels_verified_partners_id_idx" ON "cms"."payload_locked_documents_rels" USING btree ("verified_partners_id");
  CREATE INDEX "payload_locked_documents_rels_research_notes_id_idx" ON "cms"."payload_locked_documents_rels" USING btree ("research_notes_id");
  CREATE INDEX "payload_locked_documents_rels_operator_reviews_id_idx" ON "cms"."payload_locked_documents_rels" USING btree ("operator_reviews_id");
  CREATE INDEX "payload_locked_documents_rels_sessions_id_idx" ON "cms"."payload_locked_documents_rels" USING btree ("sessions_id");
  CREATE INDEX "payload_locked_documents_rels_accounts_id_idx" ON "cms"."payload_locked_documents_rels" USING btree ("accounts_id");
  CREATE INDEX "payload_locked_documents_rels_verifications_id_idx" ON "cms"."payload_locked_documents_rels" USING btree ("verifications_id");
  CREATE INDEX "payload_preferences_key_idx" ON "cms"."payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "cms"."payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "cms"."payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "cms"."payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "cms"."payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "cms"."payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "cms"."payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "cms"."payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "cms"."payload_migrations" USING btree ("created_at");
  CREATE INDEX "payload_llm_instructions_entity_slug_idx" ON "cms"."payload_llm_instructions" USING btree ("entity_slug");
  CREATE INDEX "payload_llm_instructions_updated_at_idx" ON "cms"."payload_llm_instructions" USING btree ("updated_at");
  CREATE INDEX "payload_llm_instructions_created_at_idx" ON "cms"."payload_llm_instructions" USING btree ("created_at");
  CREATE INDEX "payload_llm_instructions_rels_order_idx" ON "cms"."payload_llm_instructions_rels" USING btree ("order");
  CREATE INDEX "payload_llm_instructions_rels_parent_idx" ON "cms"."payload_llm_instructions_rels" USING btree ("parent_id");
  CREATE INDEX "payload_llm_instructions_rels_path_idx" ON "cms"."payload_llm_instructions_rels" USING btree ("path");
  CREATE INDEX "payload_llm_instructions_rels_users_id_idx" ON "cms"."payload_llm_instructions_rels" USING btree ("users_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "cms"."users" CASCADE;
  DROP TABLE "cms"."users_rels" CASCADE;
  DROP TABLE "cms"."site_pages_sections" CASCADE;
  DROP TABLE "cms"."site_pages" CASCADE;
  DROP TABLE "cms"."site_pages_rels" CASCADE;
  DROP TABLE "cms"."verified_partners" CASCADE;
  DROP TABLE "cms"."verified_partners_rels" CASCADE;
  DROP TABLE "cms"."research_notes" CASCADE;
  DROP TABLE "cms"."research_notes_rels" CASCADE;
  DROP TABLE "cms"."operator_reviews" CASCADE;
  DROP TABLE "cms"."operator_reviews_rels" CASCADE;
  DROP TABLE "cms"."sessions" CASCADE;
  DROP TABLE "cms"."sessions_rels" CASCADE;
  DROP TABLE "cms"."accounts" CASCADE;
  DROP TABLE "cms"."accounts_rels" CASCADE;
  DROP TABLE "cms"."verifications" CASCADE;
  DROP TABLE "cms"."verifications_rels" CASCADE;
  DROP TABLE "cms"."payload_kv" CASCADE;
  DROP TABLE "cms"."payload_locked_documents" CASCADE;
  DROP TABLE "cms"."payload_locked_documents_rels" CASCADE;
  DROP TABLE "cms"."payload_preferences" CASCADE;
  DROP TABLE "cms"."payload_preferences_rels" CASCADE;
  DROP TABLE "cms"."payload_migrations" CASCADE;
  DROP TABLE "cms"."payload_llm_instructions" CASCADE;
  DROP TABLE "cms"."payload_llm_instructions_rels" CASCADE;
  DROP TYPE "cms"."enum_users_role";
  DROP TYPE "cms"."enum_site_pages_sections_kind";
  DROP TYPE "cms"."enum_site_pages_publication_status";
  DROP TYPE "cms"."enum_verified_partners_publication_status";
  DROP TYPE "cms"."enum_research_notes_publication_status";
  DROP TYPE "cms"."enum_operator_reviews_review_status";
  DROP TYPE "cms"."enum_payload_llm_instructions_entity_type";`)
}
