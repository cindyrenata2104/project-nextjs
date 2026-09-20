--
-- PostgreSQL database dump
--

\restrict ogR7iQUwnAQg9nIi0FIacmupIu12yvd8tw9V8gxNdLriCVD7hb8tVNTGlqFAefM

-- Dumped from database version 18.6
-- Dumped by pg_dump version 18.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


--
-- Name: StatusInventory; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."StatusInventory" AS ENUM (
    'inventory',
    'dipinjam'
);


ALTER TYPE public."StatusInventory" OWNER TO postgres;

--
-- Name: StatusKerja; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."StatusKerja" AS ENUM (
    'active',
    'inactive'
);


ALTER TYPE public."StatusKerja" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Inventory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Inventory" (
    id integer NOT NULL,
    jenis_barang text NOT NULL,
    ukuran text NOT NULL,
    status public."StatusInventory" NOT NULL
);


ALTER TABLE public."Inventory" OWNER TO postgres;

--
-- Name: Inventory_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Inventory_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Inventory_id_seq" OWNER TO postgres;

--
-- Name: Inventory_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Inventory_id_seq" OWNED BY public."Inventory".id;


--
-- Name: Karyawan; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Karyawan" (
    id integer NOT NULL,
    nama text NOT NULL,
    jabatan text NOT NULL,
    periode text NOT NULL,
    status_kerja public."StatusKerja" NOT NULL
);


ALTER TABLE public."Karyawan" OWNER TO postgres;

--
-- Name: Karyawan_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Karyawan_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Karyawan_id_seq" OWNER TO postgres;

--
-- Name: Karyawan_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Karyawan_id_seq" OWNED BY public."Karyawan".id;


--
-- Name: Peminjaman; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Peminjaman" (
    id integer NOT NULL,
    karyawan_id integer NOT NULL,
    inventory_id integer NOT NULL,
    tanggal_peminjaman timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Peminjaman" OWNER TO postgres;

--
-- Name: Peminjaman_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Peminjaman_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Peminjaman_id_seq" OWNER TO postgres;

--
-- Name: Peminjaman_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Peminjaman_id_seq" OWNED BY public."Peminjaman".id;


--
-- Name: Pengembalian; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Pengembalian" (
    id integer NOT NULL,
    peminjaman_id integer NOT NULL,
    tanggal_pengembalian timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Pengembalian" OWNER TO postgres;

--
-- Name: Pengembalian_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Pengembalian_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Pengembalian_id_seq" OWNER TO postgres;

--
-- Name: Pengembalian_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Pengembalian_id_seq" OWNED BY public."Pengembalian".id;


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Name: Inventory id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Inventory" ALTER COLUMN id SET DEFAULT nextval('public."Inventory_id_seq"'::regclass);


--
-- Name: Karyawan id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Karyawan" ALTER COLUMN id SET DEFAULT nextval('public."Karyawan_id_seq"'::regclass);


--
-- Name: Peminjaman id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Peminjaman" ALTER COLUMN id SET DEFAULT nextval('public."Peminjaman_id_seq"'::regclass);


--
-- Name: Pengembalian id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Pengembalian" ALTER COLUMN id SET DEFAULT nextval('public."Pengembalian_id_seq"'::regclass);


--
-- Data for Name: Inventory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Inventory" (id, jenis_barang, ukuran, status) FROM stdin;
3	Seragam	XL	inventory
4	Seragam	XXL	inventory
5	Sepatu	39	inventory
7	Sepatu	39	inventory
8	Sepatu	40	inventory
2	Sepatu	37	inventory
9	Sepatu	37	inventory
10	Seragam	S	inventory
11	sepatu	42	inventory
12	seragam	L	inventory
13	sepatu	41	dipinjam
14	sepatu	41	inventory
1	Seragam	M	inventory
15	seragam	S	inventory
16	Seragam	S	inventory
\.


--
-- Data for Name: Karyawan; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Karyawan" (id, nama, jabatan, periode, status_kerja) FROM stdin;
2	Asep	Freelance	1-14 Agustus 2026	inactive
3	Intan	Freelance	1-14 Agustus 2026	inactive
5	Sinta	Freelance	25 September-3 Oktober 2026	active
6	Cika	Karyawan Freelance	1 - 14 September 2026	active
1	Toni	Karyawan Freelance	2 - 7 September 2026	active
7	Firda	Karyawan Freelance	1 - 14 September 2026	active
8	renata	Freelance	14 - 21 September 2026	active
9	Cinta	Freelance	1-21 September	active
\.


--
-- Data for Name: Peminjaman; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Peminjaman" (id, karyawan_id, inventory_id, tanggal_peminjaman) FROM stdin;
1	2	2	1969-12-31 17:00:00
\.


--
-- Data for Name: Pengembalian; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Pengembalian" (id, peminjaman_id, tanggal_pengembalian) FROM stdin;
5	1	1969-12-31 17:00:00
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
7bbcc72e-69bf-4aed-a23f-f137045849c2	7ade2ad12f8538a49f9cc6c73686a7946ec7b65afa8be5407c2f0194a6551990	2026-08-28 17:02:55.645304+07	20260828100255_init	\N	\N	2026-08-28 17:02:55.479481+07	1
\.


--
-- Name: Inventory_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Inventory_id_seq"', 16, true);


--
-- Name: Karyawan_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Karyawan_id_seq"', 9, true);


--
-- Name: Peminjaman_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Peminjaman_id_seq"', 1, true);


--
-- Name: Pengembalian_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Pengembalian_id_seq"', 5, true);


--
-- Name: Inventory Inventory_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Inventory"
    ADD CONSTRAINT "Inventory_pkey" PRIMARY KEY (id);


--
-- Name: Karyawan Karyawan_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Karyawan"
    ADD CONSTRAINT "Karyawan_pkey" PRIMARY KEY (id);


--
-- Name: Peminjaman Peminjaman_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Peminjaman"
    ADD CONSTRAINT "Peminjaman_pkey" PRIMARY KEY (id);


--
-- Name: Pengembalian Pengembalian_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Pengembalian"
    ADD CONSTRAINT "Pengembalian_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Pengembalian_peminjaman_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Pengembalian_peminjaman_id_key" ON public."Pengembalian" USING btree (peminjaman_id);


--
-- Name: Peminjaman Peminjaman_inventory_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Peminjaman"
    ADD CONSTRAINT "Peminjaman_inventory_id_fkey" FOREIGN KEY (inventory_id) REFERENCES public."Inventory"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Peminjaman Peminjaman_karyawan_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Peminjaman"
    ADD CONSTRAINT "Peminjaman_karyawan_id_fkey" FOREIGN KEY (karyawan_id) REFERENCES public."Karyawan"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Pengembalian Pengembalian_peminjaman_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Pengembalian"
    ADD CONSTRAINT "Pengembalian_peminjaman_id_fkey" FOREIGN KEY (peminjaman_id) REFERENCES public."Peminjaman"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict ogR7iQUwnAQg9nIi0FIacmupIu12yvd8tw9V8gxNdLriCVD7hb8tVNTGlqFAefM

