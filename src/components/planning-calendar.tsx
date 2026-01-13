"use client";

import React, { useState, useCallback } from "react";
import { Calendar, dateFnsLocalizer, Views, View } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { fr } from "date-fns/locale";
import { X, MapPin, User, Users, Clock, BookOpen } from "lucide-react"; // Icônes pour le style

import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";

// --- 1. CONFIGURATION ---
const locales = { "fr": fr };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const DnDCalendar = withDragAndDrop(Calendar);

// --- 2. DONNÉES RICHES (MOCKS) ---
// On ajoute des champs : prof, groupes, type, salles...
const EVENTS_MOCK = [
  {
    id: 1,
    title: "Traitement du langage naturel",
    type: "Travaux Pratiques",
    groups: "E5e-Paris-BD, E5e-Paris-IA",
    prof: "TLIG Ghassen",
    salles: "S1.6 - HILBERT, S1.5 - HERTZ",
    start: new Date(2025, 3, 10, 8, 45), // 10 Avril à 08h45
    end: new Date(2025, 3, 10, 12, 45),
    resourceId: "salle_hilbert", 
    bgColor: "#ef4444", // Rouge (TP)
  },
  {
    id: 2,
    title: "Mathématiques pour l'ingénieur",
    type: "Cours Magistral",
    groups: "Promo E5",
    prof: "DUPONT Jean",
    salles: "Amphi A",
    start: new Date(2025, 3, 10, 14, 0),
    end: new Date(2025, 3, 10, 16, 0),
    resourceId: "amphi_a", 
    bgColor: "#3b82f6", // Bleu (CM)
  },
];

export default function PlanningCalendar() {
  const [events, setEvents] = useState(EVENTS_MOCK);
  const [view, setView] = useState<View>(Views.WORK_WEEK);
  const [date, setDate] = useState(new Date(2025, 3, 10));
  
  // État pour la fenêtre de détail (Modale)
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  // --- GESTION DU DRAG & DROP ---
  const onEventDrop = useCallback(
    ({ event, start, end }: any) => {
      setEvents((prev) => {
        const filtered = prev.filter((e) => e.id !== event.id);
        return [...filtered, { ...event, start, end }];
      });
    },
    []
  );

  // --- STYLE DES ÉVÉNEMENTS SUR LE CALENDRIER ---
  // On personnalise l'apparence de la petite brique dans le planning
  const eventStyleGetter = (event: any) => {
    return {
      style: {
        backgroundColor: event.bgColor || "#3b82f6",
        borderRadius: "4px",
        opacity: 0.9,
        color: "white",
        border: "0px",
        display: "block",
        fontSize: "0.80rem",
        padding: "2px"
      },
    };
  };

  // Composant personnalisé pour l'affichage DANS la case du calendrier
  const CustomEvent = ({ event }: any) => (
    <div className="flex flex-col h-full overflow-hidden leading-tight">
      <span className="font-bold text-xs">{event.title}</span>
      <span className="text-[10px] italic">{event.type}</span>
      <div className="mt-auto text-[10px] flex items-center gap-1">
        <MapPin size={10} /> {event.salles?.split(',')[0]} {/* On affiche juste la 1ere salle si trop long */}
      </div>
    </div>
  );

  return (
    <div className="relative">
      {/* CALENDRIER */}
      <div className="h-[700px] bg-white p-4 rounded-lg shadow-md text-black border border-gray-200">
        <DnDCalendar
          localizer={localizer}
          events={events}
          
          // Interaction
          onSelectEvent={(event) => setSelectedEvent(event)} // Clic sur un cours
          draggableAccessor={() => true}
          resizable
          onEventDrop={onEventDrop}
          onEventResize={onEventDrop}

          // Vue
          defaultView={Views.WORK_WEEK}
          views={[Views.DAY, Views.WORK_WEEK, Views.MONTH]}
          step={15} // Créneaux de 15 min pour être précis (08h45)
          showMultiDayTimes
          
          date={date}
          onNavigate={setDate}
          onView={setView}
          
          // Customisation
          culture="fr"
          eventPropGetter={eventStyleGetter}
          components={{
            event: CustomEvent // Notre design personnalisé pour la brique
          }}
          
          messages={{
            next: "Suivant",
            previous: "Précédent",
            today: "Aujourd'hui",
            month: "Mois",
            week: "Semaine",
            day: "Jour",
            agenda: "Agenda",
            date: "Date",
            time: "Heure",
            event: "Cours",
            noEventsInRange: "Aucun cours.",
          }}
        />
      </div>

      {/* --- FENÊTRE DE DÉTAILS (MODALE) --- */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            
            {/* En-tête coloré */}
            <div 
              className="p-4 text-white flex justify-between items-start"
              style={{ backgroundColor: selectedEvent.bgColor || '#3b82f6' }}
            >
              <div>
                <h2 className="text-lg font-bold leading-snug">{selectedEvent.title}</h2>
                <span className="text-sm opacity-90 block mt-1">{selectedEvent.type}</span>
              </div>
              <button 
                onClick={() => setSelectedEvent(null)}
                className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-1 transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Corps de la modale */}
            <div className="p-6 space-y-4 text-gray-800">
              
              {/* Horaires */}
              <div className="flex items-center gap-3 text-lg font-semibold text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-100">
                <Clock className="text-gray-500" size={20} />
                <span>
                  {format(selectedEvent.start, "HH'h'mm")} - {format(selectedEvent.end, "HH'h'mm")}
                </span>
              </div>

              {/* Groupes */}
              <div className="flex items-start gap-3">
                <Users className="text-gray-400 mt-1" size={18} />
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Groupes</p>
                  <p className="text-sm font-medium">{selectedEvent.groups}</p>
                </div>
              </div>

              {/* Salles */}
              <div className="flex items-start gap-3">
                <MapPin className="text-gray-400 mt-1" size={18} />
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Salles</p>
                  <p className="text-sm font-medium">{selectedEvent.salles}</p>
                </div>
              </div>

              {/* Professeur */}
              <div className="flex items-start gap-3">
                <User className="text-gray-400 mt-1" size={18} />
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Enseignant</p>
                  <p className="text-sm font-medium">{selectedEvent.prof}</p>
                </div>
              </div>

            </div>

            {/* Pied de page */}
            <div className="p-4 bg-gray-50 border-t flex justify-end">
                <span className="text-xs text-gray-400 px-2 py-1">ID: {selectedEvent.id}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
// "use client";

// import React, { useState, useCallback, useEffect } from "react";
// import { Calendar, dateFnsLocalizer, Views, View } from "react-big-calendar";
// import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
// import { format, parse, startOfWeek, getDay } from "date-fns";
// import { fr } from "date-fns/locale";
// import { toast } from "sonner"; // Pour afficher les erreurs
// import { moveLesson } from "@/actions/schedule_actions"; // Notre Server Action

// import "react-big-calendar/lib/css/react-big-calendar.css";
// import "react-big-calendar/lib/addons/dragAndDrop/styles.css";

// const locales = { "fr": fr };
// const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });
// const DnDCalendar = withDragAndDrop(Calendar);

// // Props : Le composant reçoit désormais les cours depuis le serveur
// interface PlanningProps {
//   initialEvents: any[];
// }

// export default function PlanningCalendar({ initialEvents }: PlanningProps) {
//   const [events, setEvents] = useState(initialEvents);
//   const [view, setView] = useState<View>(Views.WORK_WEEK);
//   const [date, setDate] = useState(new Date()); // Date d'aujourd'hui par défaut

//   // Mettre à jour si les props changent (ex: après un refresh serveur)
//   useEffect(() => {
//     setEvents(initialEvents);
//   }, [initialEvents]);

//   // --- QUAND ON LÂCHE LA SOURIS (DROP) ---
//   const onEventDrop = useCallback(async ({ event, start, end, resourceId }: any) => {
//       // 1. Sauvegarde l'ancien état (pour annuler si erreur)
//       const oldEvents = [...events];
      
//       // 2. Mise à jour Optimiste (On bouge tout de suite pour que ce soit fluide)
//       const updatedEvent = { ...event, start, end, resourceId };
//       setEvents((prev) => prev.map(e => e.id === event.id ? updatedEvent : e));

//       // 3. Appel au Serveur (Postgres)
//       // Si resourceId est undefined (pas changé de salle), on garde l'ancienne
//       const targetRoom = resourceId || event.resourceId; 
      
//       const result = await moveLesson(event.id, start, end, targetRoom);

//       if (!result.success) {
//         toast.error(result.message); // Affiche "Impossible : Salle prise par..."
//         setEvents(oldEvents); // On remet le cours à sa place d'origine (Rollback)
//       } else {
//         toast.success("Cours déplacé avec succès");
//       }
//     },
//     [events]
//   );

//   // Style (identique à avant)
//   const eventStyleGetter = (event: any) => ({
//     style: {
//       backgroundColor: event.bgColor || "#3b82f6",
//       borderRadius: "4px",
//       fontSize: "0.80rem",
//       border: "0px",
//       display: "block",
//     },
//   });

//   return (
//     <div className="h-[700px] bg-white p-4 rounded-lg shadow-md border border-gray-200">
//       <DnDCalendar
//         localizer={localizer}
//         events={events}
//         draggableAccessor={() => true}
//         resizable
//         onEventDrop={onEventDrop}
//         onEventResize={onEventDrop} // Gère aussi le redimensionnement
        
//         defaultView={Views.WORK_WEEK}
//         views={[Views.DAY, Views.WORK_WEEK, Views.MONTH]}
//         step={15}
//         showMultiDayTimes
        
//         date={date}
//         onNavigate={setDate}
//         onView={setView}
        
//         culture="fr"
//         eventPropGetter={eventStyleGetter}
        
//         // Configuration des ressources (Salles) pour la vue Journée si besoin
//         // resources={...} 
        
//         messages={{
//             next: "Suivant",
//             previous: "Précédent",
//             today: "Aujourd'hui",
//             month: "Mois",
//             week: "Semaine",
//             day: "Jour",
//             agenda: "Agenda",
//             date: "Date",
//             time: "Heure",
//             event: "Cours",
//         }}
//       />
//     </div>
//   );
// }