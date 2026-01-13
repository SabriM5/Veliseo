// import PlanningCalendar from "@/components/planning-calendar";
// // import { getLessons } from "@/actions/schedule_actions";

// export default async function PlanningPage() {
//   // 1. On définit la plage de dates à charger (ex: Année 2025)
//   // Dans une vraie app, on gérerait ça dynamiquement, mais pour la démo on charge large
//   const start = new Date(2025, 0, 1); // 1er Janvier
//   const end = new Date(2025, 11, 31); // 31 Décembre

//   // 2. On récupère les VRAIS cours depuis Postgres
//   const lessons = await getLessons(start, end);

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">Planning Scolaire</h1>
//         <div className="text-sm text-gray-500">
//           {lessons.length} cours chargés
//         </div>
//       </div>
      
//       {/* 3. On passe les données au calendrier */}
//       <PlanningCalendar initialEvents={lessons} />
//     </div>
//   );
// }

import PlanningCalendar from "@/components/planning-calendar";

export default function PlanningPage() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Planning (Mode Démo)</h1>
      </div>
      
      {/* On n'envoie plus de props, le calendrier gérera ses propres données */}
      <PlanningCalendar />
    </div>
  );
}