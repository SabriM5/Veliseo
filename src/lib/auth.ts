import { betterAuth } from "better-auth";
import { phoneNumber } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { Pool } from "pg";
import { generateUniqueEmailEseo, generateUniqueName } from "@/actions/register_actions";
import { type FormValues } from "@/components/register-form";

// 1. Définition de l'interface pour typer le "user" dans les hooks
// Cela dit à TypeScript : "T'inquiète, ces champs existent bien."
interface UserWithCustomFields {
  id?: string;
  email: string;
  name?: string;
  role?: string;
  metadata?: string[]; // Notre champ custom
  phoneNumber?: string;
  emailVerified?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const JASMIN_HOST = process.env.JASMIN_HOST;
const JASMIN_USER = process.env.JASMIN_USER;
const JASMIN_PASSWORD = process.env.JASMIN_PASSWORD;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
   options: "-c search_path=sys" // Parfois nécessaire, parfois non selon ton setup
});

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  database: pool,
  user: {
    additionalFields: {
      metadata: { type: "string[]", required: false },
      // id, nom, prenom sont déjà gérés ou partiels, mais on peut les forcer si besoin
      // Note: "id" est natif, pas besoin de le mettre dans additionalFields sauf cas rare
      nom: { type: "string", required: false },
      prenom: { type: "string", required: false },
      civilite: { type: "string", required: false },
      phoneNumber: { type: "string", required: false },
      role: { type: "string", required: false, defaultValue: "USER" },
      banned: { type: "boolean", required: false },
      ban_reason: { type: "string", required: false },
      ban_expires: { type: "date", required: false },
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user: any) => { 
          
          const newName = await generateUniqueName(user.name, pool);
          
          return {
            data: {
              ...user,
              name: newName,
              id: newName, 
            }
          };
        },
        after: async (user: any) => {
          const typedUser = user as UserWithCustomFields;
          
          // Sécurité : si pas de metadata, on ne fait rien (évite le crash)
          if (!typedUser.metadata || !typedUser.role) return;

          const maxRetries = 10;
          let attempt = 0;

          
          if (typedUser.role === "VACAT") {
            while (attempt < maxRetries) {
              try {
                const prefixe = await generateUniqueEmailEseo(typedUser.metadata[2] + "@eseo.fr", "sys.prof", pool);
                const fullEmail = `${prefixe}@eseo.fr`;

                await pool.query(
                  `INSERT INTO sys.prof(id, emaileseo, tarif, "typeContrat") VALUES ($1,$2,$3,$4)`,
                  [typedUser.id, fullEmail, parseFloat(typedUser.metadata[0]), typedUser.metadata[1]]
                );
                break; 
              } catch (err: any) {
                if (err.code === '23505') { 
                  attempt++;
                  continue;
                }
                await pool.query(`DELETE FROM sys.user WHERE id=$1`, [typedUser.id]);
                throw err;
              }
            }
          }

          
          if (typedUser.role === "ELING") {
            attempt = 0;
            while (attempt < maxRetries) {
              try {
                const prefixe = await generateUniqueEmailEseo(typedUser.metadata[2] + "@reseau.eseo.fr", "sys.eling", pool);
                const fullEmail = `${prefixe}@reseau.eseo.fr`;
                const promoOrigine = typedUser.metadata[1] + typedUser.metadata[0].toLowerCase();

                await pool.query(
                  `INSERT INTO sys.eling(id, forma, "promoOrigine", promo, gr, emaileseo)
                   VALUES ($1,$2,$3,$4,$5,$6)`,
                  [typedUser.id, typedUser.metadata[0], promoOrigine, promoOrigine, promoOrigine + "1", fullEmail]
                );
                break;
              } catch (err: any) {
                if (err.code === '23505') {
                  attempt++;
                  continue;
                }
                await pool.query(`DELETE FROM sys.user WHERE id=$1`, [typedUser.id]);
                throw err;
              }
            }
          }
        },
      },
    },
  },
  plugins: [
    nextCookies(), 
    phoneNumber({
      sendOTP: async ({ phoneNumber, code }, request) => {      
        console.log(`OTP envoyé à ${phoneNumber}: ${code}`);
      },
    }),
  ],
});

export type Session = typeof auth.$Infer.Session;