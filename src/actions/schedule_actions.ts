// VERSION BDD
//'use server'

// import { pool } from "@/lib/auth"; // Ton pool Postgres existant
// import { revalidatePath } from "next/cache";

// // Récupérer tous les cours pour le calendrier
// export async function getLessons(start: Date, end: Date) {
//   // On joint avec sys.prof pour avoir le nom du prof
//   // On joint avec scol.ue pour le titre (si besoin)
//   const result = await pool.query(`
//     SELECT 
//       l.id, 
//       l.deb as start, 
//       l.fin as "end", 
//       l.salle as "resourceId",
//       l.typec as type,
//       p.nom || ' ' || p.prenom as prof,
//       u.label as title
//     FROM scol.lecon l
//     LEFT JOIN sys.prof p ON l."profId" = p.id
//     LEFT JOIN scol.ue u ON l."ueId" = u.id
//     WHERE l.deb >= $1 AND l.fin <= $2
//   `, [start, end]);

//   // Conversion des dates pour que React comprenne
//   return result.rows.map(row => ({
//     ...row,
//     start: new Date(row.start),
//     end: new Date(row.end),
//     // Couleur conditionnelle selon le type (facultatif)
//     bgColor: row.type === 'TP' ? '#ef4444' : '#3b82f6'
//   }));
// }

// // Déplacer un cours (Drag & Drop)
// export async function moveLesson(lessonId: string, newStart: Date, newEnd: Date, newRoomId: string) {
  
//   // 1. DÉTECTION DE CONFLIT (Ta règle d'or)
//   // "Est-ce qu'il existe un AUTRE cours dans la MÊME salle qui CHEVAUCHE mes horaires ?"
//   const conflict = await pool.query(
//     `SELECT l.id, p.nom 
//      FROM scol.lecon l
//      LEFT JOIN sys.prof p ON l."profId" = p.id
//      WHERE l.salle = $1 
//        AND l.id != $2 -- On ne se compte pas soi-même
//        AND tstzrange(l.deb, l.fin) && tstzrange($3, $4) -- L'opérateur "overlap" de Postgres
//     `,
//     [newRoomId, lessonId, newStart, newEnd]
//   );

//   // S'il y a un résultat, c'est qu'il y a conflit
//   if (conflict.rowCount && conflict.rowCount > 0) {
//     const occupant = conflict.rows[0].nom || "un autre prof";
//     return { 
//       success: false, 
//       message: `Impossible : La salle est déjà prise par ${occupant} à cette heure.` 
//     };
//   }

//   // 2. SI TOUT EST BON : UPDATE
//   try {
//     await pool.query(
//       `UPDATE scol.lecon SET deb = $1, fin = $2, salle = $3 WHERE id = $4`,
//       [newStart, newEnd, newRoomId, lessonId]
//     );
    
//     // On rafraîchit les données de la page pour que tout le monde voie le changement
//     revalidatePath('/admin/planning'); 
//     return { success: true };
    
//   } catch (error) {
//     console.error(error);
//     return { success: false, message: "Erreur technique lors de la sauvegarde." };
//   }
// }