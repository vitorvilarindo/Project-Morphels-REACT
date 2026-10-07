import { sql } from './db.js'

// // Alterações nas tabelas
// await sql`
//     CREATE TABLE nodes (
//                            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//                            institution_id UUID NOT NULL,
//                            type VARCHAR(50) NOT NULL,
//                            name VARCHAR(100) NOT NULL,
//                            parent_id UUID REFERENCES nodes(id)
//     );
// `
// await sql`
//     CREATE TABLE node_closure (
//                                   ancestor_id UUID REFERENCES nodes(id) ON DELETE CASCADE,
//                                   descendant_id UUID REFERENCES nodes(id) ON DELETE CASCADE,
//                                   depth INT NOT NULL,
//                                   PRIMARY KEY (ancestor_id, descendant_id)
//     );
// `
// await sql`
//     CREATE TABLE roles (
//                            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//                            institution_id UUID,
//                            name VARCHAR(100) NOT NULL
//     );
// `
// await sql`
//     CREATE TABLE role_assignments (
//                                       id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//                                       user_id UUID NOT NULL,
//                                       role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
//                                       node_id UUID REFERENCES nodes(id) ON DELETE CASCADE
//     );
// `
// await sql`
//     ALTER TABLE members
//         ADD COLUMN IF NOT EXISTS institution UUID REFERENCES institutions(id)
// `
// await sql`
//     ALTER TABLE users
//         ADD COLUMN IF NOT EXISTS institution UUID REFERENCES institutions(id)
// `