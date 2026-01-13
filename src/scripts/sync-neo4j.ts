import { Pool } from 'pg';
import neo4j from 'neo4j-driver';
import dotenv from 'dotenv';

// Charger les variables d'env (pour récupérer DATABASE_URL)
dotenv.config({ path: '.env' }); 

async function sync() {
  console.log("🚀 Démarrage de la synchronisation Postgres -> Neo4j...");

  // 1. Connexion Postgres
  const pgPool = new Pool({
    connectionString: process.env.DATABASE_URL, // Assure-toi que c'est bien défini dans .env.local
  });

  // 2. Connexion Neo4j
  const driver = neo4j.driver(
    'bolt://localhost:7687',
    neo4j.auth.basic('neo4j', 'MDP')
  );
  const session = driver.session();

  try {
    // --- PARTIE 1 : LES PROFS ---
    console.log("🔄 Synchro des Profs...");
    const profs = await pgPool.query('SELECT id, nom, prenom, emaileseo FROM sys.prof');
    
    for (const row of profs.rows) {
      await session.run(
        `
        MERGE (p:Prof {id: $id}) 
        SET p.nom = $nom, p.prenom = $prenom, p.email = $email
        `,
        { id: row.id, nom: row.nom, prenom: row.prenom, email: row.emaileseo }
      );
    }
    console.log(`✅ ${profs.rowCount} Profs synchronisés.`);

    // --- PARTIE 2 : LES UEs ---
    console.log("🔄 Synchro des UEs...");
    const ues = await pgPool.query('SELECT id, label, sem, "thematiqId" FROM scol.ue');
    
    for (const row of ues.rows) {
      await session.run(
        `
        MERGE (u:UE {id: $id})
        SET u.semestre = $sem, u.label = $label, u.thematique = $thematiqId
        `,
        { id: row.id, sem: row.sem, label: row.label, thematiqId: row.thematiqId }
      );
    }
    console.log(`✅ ${ues.rowCount} UEs synchronisées.`);

    // --- PARTIE 3 : LES ÉLÈVES ---
    console.log("🔄 Synchro des Élèves...");
    const elings = await pgPool.query('SELECT id, forma, promo FROM sys.eling');
    
    for (const row of elings.rows) {
      await session.run(
        `
        MERGE (e:Eling {id: $id})
        SET e.forma = $forma, e.promo = $promo
        `,
        { id: row.id, forma: row.forma, promo: row.promo }
      );
    }
    console.log(`✅ ${elings.rowCount} Élèves synchronisés.`);

  } catch (err) {
    console.error("❌ Erreur pendant la synchro :", err);
  } finally {
    await pgPool.end();
    await session.close();
    await driver.close();
    console.log("👋 Synchro terminée.");
  }
}

sync();