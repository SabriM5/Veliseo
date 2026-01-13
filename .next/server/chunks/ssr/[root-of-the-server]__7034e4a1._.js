module.exports = [
"[externals]/pg [external] (pg, esm_import)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

const mod = await __turbopack_context__.y("pg");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[project]/src/lib/auth-client.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "signIn",
    ()=>signIn,
    "signOut",
    ()=>signOut,
    "signUp",
    ()=>signUp,
    "useSession",
    ()=>useSession
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$better$2d$auth$2f$dist$2f$client$2f$plugins$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/better-auth/dist/client/plugins/index.mjs [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$additional$2d$fields$2f$client$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/better-auth/dist/plugins/additional-fields/client.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$better$2d$auth$2f$dist$2f$client$2f$react$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/better-auth/dist/client/react/index.mjs [app-rsc] (ecmascript) <locals>");
;
;
const authClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$better$2d$auth$2f$dist$2f$client$2f$react$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAuthClient"])({
    baseURL: process.env.PUBLIC_URL,
    plugins: [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$additional$2d$fields$2f$client$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["inferAdditionalFields"])()
    ]
});
const { signUp, signIn, signOut, useSession } = authClient;
}),
"[project]/src/actions/register_actions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "capitalizeWords",
    ()=>capitalizeWords,
    "formatPhoneWithSpaces",
    ()=>formatPhoneWithSpaces,
    "generateUniqueEmailEseo",
    ()=>generateUniqueEmailEseo,
    "generateUniqueName",
    ()=>generateUniqueName,
    "onSubmitServer",
    ()=>onSubmitServer,
    "sanitizePhone",
    ()=>sanitizePhone
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/auth-client.ts [app-rsc] (ecmascript)");
;
function getLettrePromo(anneeScolaire, niveau) {
    const startYear = parseInt(anneeScolaire.split("-")[0], 10);
    const index = startYear - 2006 - (parseInt(niveau, 10) - 1);
    // s'incrire en 3ème année, c'est comme s'être inscrit il y a deux ans en première année  
    return String.fromCharCode("a".charCodeAt(0) + (index % 26 + 26) % 26) // +26 pour éviter les négatifs
    ;
}
function sanitizePhone(input) {
    if (!input) return null;
    // Supprime tout sauf les chiffres et +
    let phone = input.replace(/[\s./-]/g, "");
    //Numéro commençant par 0 → transforme en +33
    if (phone.startsWith("0")) {
        //console.log("catched!!!")
        phone = phone.slice(1);
    }
    // Vérification finale : +33 suivi de 9 chiffres
    //const regex = /^\+33[0-9]{9}$/;
    //if (!regex.test(phone)) return null;
    const regex = /^[0-9]{9}$/;
    if (!regex.test(phone)) return null;
    phone = phone.replace(/ /g, "");
    console.log(phone);
    return phone.replace(/ /g, ""); // "+33"+phone;
}
function capitalizeWords(input) {
    return input.replace(/-+/g, '-').split(/([ -])/g) // garde les séparateurs espace et tiret
    .map((segment)=>{
        // ne capitalise pas les séparateurs eux-mêmes
        if (segment === " " || segment === "-") return segment;
        return segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase();
    }).join("");
}
const formatPhoneWithSpaces = (value)=>{
    if (!value) return "";
    let numero = value;
    if (numero.startsWith("0")) {
        console.log("catched!!!");
        numero = numero.slice(1);
    }
    let digits = numero.replace(/\D/g, ""); // supprimer tout sauf les chiffres
    digits = digits.slice(0, 9); // limiter à 9 chiffres
    if (!digits) return ""; // pas de chiffres → retour vide
    let formatted = "";
    let addSpace = false;
    for(let i = 0; i < digits.length; i++){
        formatted += digits[i];
        if (i == 0) formatted += " ";
        if (i > 1 && addSpace) {
            formatted += " ";
            addSpace = false;
        } else {
            addSpace = true;
        }
    }
    return formatted.trim();
};
async function onSubmitServer(data) {
    // 1) Validation simple équivalente à tes checks
    const nom = data.nom?.toUpperCase();
    if (!nom) return {
        error: "Please enter your nom"
    };
    const prenom = data.prenom;
    if (!prenom) return {
        error: "Please enter your prenom"
    };
    // 2) Construction du "name"
    const tabPrenom = prenom.split(" ");
    const longu = tabPrenom.length;
    const name = `${nom[0]}${prenom.split(" ").slice(0, Math.min(2, longu)).join("")}`.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/ug, "").replace(/[^a-z]/g, "");
    const nomNorma = nom.replace(" ", "").toLowerCase().normalize("NFD").replace(/\p{Diacritic}/ug, "").replace(/[^a-z]/g, "");
    const prenomNorma = prenom.replace(" ", "").toLowerCase().normalize("NFD").replace(/\p{Diacritic}/ug, "").replace(/[^a-z]/g, "");
    const emaileseoPrefixe = `${prenomNorma}.${nomNorma}`;
    // 3) Email & password
    const email = data.email;
    if (!email) return {
        error: "Please enter your email"
    };
    const password = data.password;
    if (!password) return {
        error: "Please enter your password"
    };
    // 4) Civilité / téléphone / role / metadata
    const civilite = data.civilite;
    //const phone = data.phoneNumber
    //console.log(phone)
    let phone = data.phoneNumber;
    if (phone) {
        // 1. Nettoyage de sécurité (espaces, points...)
        phone = phone.replace(/[\s.\-\/]/g, "");
        // 2. Gestion du format
        // Si l'utilisateur a tapé "06...", on enlève le 0
        if (phone.startsWith("0")) {
            phone = phone.slice(1);
        }
        // 3. Ajout du +33 pour respecter la contrainte SQL CHECK (telephone_fixe ~ '^\+33...')
        if (!phone.startsWith("+33")) {
            phone = "+33" + phone;
        }
    }
    //toast.success(phone)
    //? formatPhoneWithSpaces(String(data.phone).trim())
    //: null;
    const role = data.role;
    const tarif = data.tarif;
    const typeContrat = data.typeContrat;
    const forma = data.forma;
    const annee = data.annee;
    const niveau = data.niveau;
    // 5) Calcul promoOrigine
    const promoOrigine = String.fromCharCode(parseInt(annee.split("-")[0]) - parseInt(niveau) + 1 - 2006 + 96);
    // 6) Metadata selon rôle
    let metadata = [];
    if (role === "ELING") metadata = [
        forma,
        promoOrigine,
        emaileseoPrefixe
    ];
    else if (role === "VACAT") metadata = [
        tarif,
        typeContrat,
        emaileseoPrefixe
    ];
    // 7) User ID final
    const id = name;
    // 8) Appel à better-auth équivalent à ton ancienne version
    const user = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["signUp"].email({
        id,
        name,
        email,
        password,
        nom,
        prenom,
        civilite,
        role,
        phoneNumber: phone || null,
        metadata
    });
    return {
        success: true,
        user
    };
}
async function generateUniqueName(name, pool) {
    const base = name;
    let username = name;
    let count = 1;
    while(true){
        try {
            // Tentative d'insertion temporaire via SELECT EXISTS pour vérifier unicité
            const result = await pool.query('SELECT 1 FROM "user" WHERE name = $1', [
                username
            ]);
            if (result.rowCount === 0) {
                return username; // unique => on retourne
            } else {
                username = `${base}${count}`; // sinon on incrémente
                count++;
            }
        } catch (err) {
            console.error("Erreur lors de la vérification du username", err);
            throw err;
        }
    }
}
async function generateUniqueEmailEseo(name, table, pool) {
    const [base, suffixe] = name.split("@");
    let prefixe = base;
    let count = 1;
    while(true){
        try {
            // Tentative d'insertion temporaire via SELECT EXISTS pour vérifier unicité
            const result = await pool.query('SELECT 1 FROM ' + table + ' WHERE emaileseo = $1', [
                prefixe + "@" + suffixe
            ]);
            if (result.rowCount === 0) {
                return prefixe; // unique => on retourne
            } else {
                prefixe = `${base}${count}`; // sinon on incrémente
                count++;
            }
        } catch (err) {
            console.error("Erreur lors de la vérification du username", err);
            throw err;
        }
    }
} // autre méthode, 
 //SELECT NOT EXISTS (
 //SELECT 1 FROM "user" WHERE maileseo = $1
 //);
}),
"[project]/src/lib/auth.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "auth",
    ()=>auth,
    "pool",
    ()=>pool
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$better$2d$auth$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/better-auth/dist/index.mjs [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$better$2d$auth$2f$dist$2f$auth$2f$auth$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/better-auth/dist/auth/auth.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/better-auth/dist/plugins/index.mjs [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$phone$2d$number$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/better-auth/dist/plugins/phone-number/index.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$better$2d$auth$2f$dist$2f$integrations$2f$next$2d$js$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/better-auth/dist/integrations/next-js.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/pg [external] (pg, esm_import)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$register_actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/actions/register_actions.ts [app-rsc] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
const JASMIN_HOST = process.env.JASMIN_HOST;
const JASMIN_USER = process.env.JASMIN_USER;
const JASMIN_PASSWORD = process.env.JASMIN_PASSWORD;
const pool = new __TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$29$__["Pool"]({
    connectionString: process.env.DATABASE_URL
});
const auth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$better$2d$auth$2f$dist$2f$auth$2f$auth$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["betterAuth"])({
    emailAndPassword: {
        enabled: true
    },
    database: pool,
    user: {
        additionalFields: {
            metadata: {
                type: "string[]",
                required: false
            },
            // id, nom, prenom sont déjà gérés ou partiels, mais on peut les forcer si besoin
            // Note: "id" est natif, pas besoin de le mettre dans additionalFields sauf cas rare
            nom: {
                type: "string",
                required: false
            },
            prenom: {
                type: "string",
                required: false
            },
            civilite: {
                type: "string",
                required: false
            },
            phoneNumber: {
                type: "string",
                required: false
            },
            role: {
                type: "string",
                required: false,
                defaultValue: "USER"
            },
            banned: {
                type: "boolean",
                required: false
            },
            ban_reason: {
                type: "string",
                required: false
            },
            ban_expires: {
                type: "date",
                required: false
            }
        }
    },
    databaseHooks: {
        user: {
            create: {
                // "context" est le 2eme argument, on ne l'utilise pas ici mais il faut respecter la signature
                before: async (user)=>{
                    // J'utilise 'any' temporairement ici pour débloquer ton rouge sur 'id'/'name'
                    // car le type inferré par BetterAuth est strict avant la création.
                    // Logique de génération de nom unique
                    const newName = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$register_actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["generateUniqueName"])(user.name, pool);
                    return {
                        data: {
                            ...user,
                            name: newName,
                            id: newName
                        }
                    };
                },
                after: async (user)=>{
                    // On caste user en "any" ou notre interface pour accéder à metadata sans erreur
                    const typedUser = user;
                    // Sécurité : si pas de metadata, on ne fait rien (évite le crash)
                    if (!typedUser.metadata || !typedUser.role) return;
                    const maxRetries = 10;
                    let attempt = 0;
                    // ========================
                    // GESTION VACATAIRE
                    // ========================
                    if (typedUser.role === "VACAT") {
                        while(attempt < maxRetries){
                            try {
                                // metadata[2] est le préfixe email
                                const prefixe = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$register_actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["generateUniqueEmailEseo"])(typedUser.metadata[2] + "@eseo.fr", "sys.prof", pool);
                                const fullEmail = `${prefixe}@eseo.fr`;
                                await pool.query(`INSERT INTO sys.prof(id, emaileseo, tarif, "typeContrat") VALUES ($1,$2,$3,$4)`, [
                                    typedUser.id,
                                    fullEmail,
                                    parseFloat(typedUser.metadata[0]),
                                    typedUser.metadata[1]
                                ]);
                                break;
                            } catch (err) {
                                if (err.code === '23505') {
                                    attempt++;
                                    continue;
                                }
                                // Rollback manuel (compensation)
                                await pool.query(`DELETE FROM sys.user WHERE id=$1`, [
                                    typedUser.id
                                ]);
                                throw err;
                            }
                        }
                    }
                    // ========================
                    // GESTION ETUDIANT
                    // ========================
                    if (typedUser.role === "ELING") {
                        attempt = 0;
                        while(attempt < maxRetries){
                            try {
                                const prefixe = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$register_actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["generateUniqueEmailEseo"])(typedUser.metadata[2] + "@reseau.eseo.fr", "sys.eling", pool);
                                const fullEmail = `${prefixe}@reseau.eseo.fr`;
                                const promoOrigine = typedUser.metadata[1] + typedUser.metadata[0].toLowerCase();
                                await pool.query(`INSERT INTO sys.eling(id, forma, "promoOrigine", promo, gr, emaileseo)
                   VALUES ($1,$2,$3,$4,$5,$6)`, [
                                    typedUser.id,
                                    typedUser.metadata[0],
                                    promoOrigine,
                                    promoOrigine,
                                    promoOrigine + "1",
                                    fullEmail
                                ]);
                                break;
                            } catch (err) {
                                if (err.code === '23505') {
                                    attempt++;
                                    continue;
                                }
                                await pool.query(`DELETE FROM sys.user WHERE id=$1`, [
                                    typedUser.id
                                ]);
                                throw err;
                            }
                        }
                    }
                }
            }
        }
    },
    plugins: [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$better$2d$auth$2f$dist$2f$integrations$2f$next$2d$js$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["nextCookies"])(),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$phone$2d$number$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["phoneNumber"])({
            sendOTP: async ({ phoneNumber, code }, request)=>{
                // Ta logique d'envoi OTP existante
                // ... (ton code Jasmin)
                console.log(`OTP envoyé à ${phoneNumber}: ${code}`);
            }
        })
    ]
});
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/actions/schedule_actions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

/* __next_internal_action_entry_do_not_use__ [{"609f5083cd142be32326bfd72defa2b0c9f333cfa1":"getLessons","78d72177924ee7672c912479bca8d305f803e355b9":"moveLesson"},"",""] */ __turbopack_context__.s([
    "getLessons",
    ()=>getLessons,
    "moveLesson",
    ()=>moveLesson
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/auth.ts [app-rsc] (ecmascript)"); // Ton pool Postgres existant
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
async function getLessons(start, end) {
    // On joint avec sys.prof pour avoir le nom du prof
    // On joint avec scol.ue pour le titre (si besoin)
    const result = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["pool"].query(`
    SELECT 
      l.id, 
      l.deb as start, 
      l.fin as "end", 
      l.salle as "resourceId",
      l.typec as type,
      p.nom || ' ' || p.prenom as prof,
      u.label as title
    FROM scol.lecon l
    LEFT JOIN sys.prof p ON l."profId" = p.id
    LEFT JOIN scol.ue u ON l."ueId" = u.id
    WHERE l.deb >= $1 AND l.fin <= $2
  `, [
        start,
        end
    ]);
    // Conversion des dates pour que React comprenne
    return result.rows.map((row)=>({
            ...row,
            start: new Date(row.start),
            end: new Date(row.end),
            // Couleur conditionnelle selon le type (facultatif)
            bgColor: row.type === 'TP' ? '#ef4444' : '#3b82f6'
        }));
}
async function moveLesson(lessonId, newStart, newEnd, newRoomId) {
    // 1. DÉTECTION DE CONFLIT (Ta règle d'or)
    // "Est-ce qu'il existe un AUTRE cours dans la MÊME salle qui CHEVAUCHE mes horaires ?"
    const conflict = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["pool"].query(`SELECT l.id, p.nom 
     FROM scol.lecon l
     LEFT JOIN sys.prof p ON l."profId" = p.id
     WHERE l.salle = $1 
       AND l.id != $2 -- On ne se compte pas soi-même
       AND tstzrange(l.deb, l.fin) && tstzrange($3, $4) -- L'opérateur "overlap" de Postgres
    `, [
        newRoomId,
        lessonId,
        newStart,
        newEnd
    ]);
    // S'il y a un résultat, c'est qu'il y a conflit
    if (conflict.rowCount && conflict.rowCount > 0) {
        const occupant = conflict.rows[0].nom || "un autre prof";
        return {
            success: false,
            message: `Impossible : La salle est déjà prise par ${occupant} à cette heure.`
        };
    }
    // 2. SI TOUT EST BON : UPDATE
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["pool"].query(`UPDATE scol.lecon SET deb = $1, fin = $2, salle = $3 WHERE id = $4`, [
            newStart,
            newEnd,
            newRoomId,
            lessonId
        ]);
        // On rafraîchit les données de la page pour que tout le monde voie le changement
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/admin/planning');
        return {
            success: true
        };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: "Erreur technique lors de la sauvegarde."
        };
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getLessons,
    moveLesson
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getLessons, "609f5083cd142be32326bfd72defa2b0c9f333cfa1", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(moveLesson, "78d72177924ee7672c912479bca8d305f803e355b9", null);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/.next-internal/server/app/admin/planning/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/actions/schedule_actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$schedule_actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/actions/schedule_actions.ts [app-rsc] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$schedule_actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$schedule_actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/.next-internal/server/app/admin/planning/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/actions/schedule_actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "609f5083cd142be32326bfd72defa2b0c9f333cfa1",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$schedule_actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getLessons"],
    "78d72177924ee7672c912479bca8d305f803e355b9",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$schedule_actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["moveLesson"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$admin$2f$planning$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$actions$2f$schedule_actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/admin/planning/page/actions.js { ACTIONS_MODULE0 => "[project]/src/actions/schedule_actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$schedule_actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/actions/schedule_actions.ts [app-rsc] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$admin$2f$planning$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$actions$2f$schedule_actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$schedule_actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$admin$2f$planning$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$actions$2f$schedule_actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$schedule_actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/app/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/src/components/planning-calendar.tsx [app-rsc] (ecmascript)", ((__turbopack_context__, module, exports) => {

// "use client";
// import React, { useState, useCallback } from "react";
// import { Calendar, dateFnsLocalizer, Views, View } from "react-big-calendar";
// import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
// import { format, parse, startOfWeek, getDay } from "date-fns";
// import { fr } from "date-fns/locale";
// import { X, MapPin, User, Users, Clock, BookOpen } from "lucide-react"; // Icônes pour le style
// import "react-big-calendar/lib/css/react-big-calendar.css";
// import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
// // --- 1. CONFIGURATION ---
// const locales = { "fr": fr };
// const localizer = dateFnsLocalizer({
//   format,
//   parse,
//   startOfWeek,
//   getDay,
//   locales,
// });
// const DnDCalendar = withDragAndDrop(Calendar);
// // --- 2. DONNÉES RICHES (MOCKS) ---
// // On ajoute des champs : prof, groupes, type, salles...
// const EVENTS_MOCK = [
//   {
//     id: 1,
//     title: "Traitement du langage naturel",
//     type: "Travaux Pratiques",
//     groups: "E5e-Paris-BD, E5e-Paris-IA",
//     prof: "TLIG Ghassen",
//     salles: "S1.6 - HILBERT, S1.5 - HERTZ",
//     start: new Date(2025, 3, 10, 8, 45), // 10 Avril à 08h45
//     end: new Date(2025, 3, 10, 12, 45),
//     resourceId: "salle_hilbert", 
//     bgColor: "#ef4444", // Rouge (TP)
//   },
//   {
//     id: 2,
//     title: "Mathématiques pour l'ingénieur",
//     type: "Cours Magistral",
//     groups: "Promo E5",
//     prof: "DUPONT Jean",
//     salles: "Amphi A",
//     start: new Date(2025, 3, 10, 14, 0),
//     end: new Date(2025, 3, 10, 16, 0),
//     resourceId: "amphi_a", 
//     bgColor: "#3b82f6", // Bleu (CM)
//   },
// ];
// export default function PlanningCalendar() {
//   const [events, setEvents] = useState(EVENTS_MOCK);
//   const [view, setView] = useState<View>(Views.WORK_WEEK);
//   const [date, setDate] = useState(new Date(2025, 3, 10));
//   // État pour la fenêtre de détail (Modale)
//   const [selectedEvent, setSelectedEvent] = useState<any>(null);
//   // --- GESTION DU DRAG & DROP ---
//   const onEventDrop = useCallback(
//     ({ event, start, end }: any) => {
//       setEvents((prev) => {
//         const filtered = prev.filter((e) => e.id !== event.id);
//         return [...filtered, { ...event, start, end }];
//       });
//     },
//     []
//   );
//   // --- STYLE DES ÉVÉNEMENTS SUR LE CALENDRIER ---
//   // On personnalise l'apparence de la petite brique dans le planning
//   const eventStyleGetter = (event: any) => {
//     return {
//       style: {
//         backgroundColor: event.bgColor || "#3b82f6",
//         borderRadius: "4px",
//         opacity: 0.9,
//         color: "white",
//         border: "0px",
//         display: "block",
//         fontSize: "0.80rem",
//         padding: "2px"
//       },
//     };
//   };
//   // Composant personnalisé pour l'affichage DANS la case du calendrier
//   const CustomEvent = ({ event }: any) => (
//     <div className="flex flex-col h-full overflow-hidden leading-tight">
//       <span className="font-bold text-xs">{event.title}</span>
//       <span className="text-[10px] italic">{event.type}</span>
//       <div className="mt-auto text-[10px] flex items-center gap-1">
//         <MapPin size={10} /> {event.salles?.split(',')[0]} {/* On affiche juste la 1ere salle si trop long */}
//       </div>
//     </div>
//   );
//   return (
//     <div className="relative">
//       {/* CALENDRIER */}
//       <div className="h-[700px] bg-white p-4 rounded-lg shadow-md text-black border border-gray-200">
//         <DnDCalendar
//           localizer={localizer}
//           events={events}
//           // Interaction
//           onSelectEvent={(event) => setSelectedEvent(event)} // Clic sur un cours
//           draggableAccessor={() => true}
//           resizable
//           onEventDrop={onEventDrop}
//           onEventResize={onEventDrop}
//           // Vue
//           defaultView={Views.WORK_WEEK}
//           views={[Views.DAY, Views.WORK_WEEK, Views.MONTH]}
//           step={15} // Créneaux de 15 min pour être précis (08h45)
//           showMultiDayTimes
//           date={date}
//           onNavigate={setDate}
//           onView={setView}
//           // Customisation
//           culture="fr"
//           eventPropGetter={eventStyleGetter}
//           components={{
//             event: CustomEvent // Notre design personnalisé pour la brique
//           }}
//           messages={{
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
//             noEventsInRange: "Aucun cours.",
//           }}
//         />
//       </div>
//       {/* --- FENÊTRE DE DÉTAILS (MODALE) --- */}
//       {selectedEvent && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
//           <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
//             {/* En-tête coloré */}
//             <div 
//               className="p-4 text-white flex justify-between items-start"
//               style={{ backgroundColor: selectedEvent.bgColor || '#3b82f6' }}
//             >
//               <div>
//                 <h2 className="text-lg font-bold leading-snug">{selectedEvent.title}</h2>
//                 <span className="text-sm opacity-90 block mt-1">{selectedEvent.type}</span>
//               </div>
//               <button 
//                 onClick={() => setSelectedEvent(null)}
//                 className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-1 transition"
//               >
//                 <X size={20} />
//               </button>
//             </div>
//             {/* Corps de la modale */}
//             <div className="p-6 space-y-4 text-gray-800">
//               {/* Horaires */}
//               <div className="flex items-center gap-3 text-lg font-semibold text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-100">
//                 <Clock className="text-gray-500" size={20} />
//                 <span>
//                   {format(selectedEvent.start, "HH'h'mm")} - {format(selectedEvent.end, "HH'h'mm")}
//                 </span>
//               </div>
//               {/* Groupes */}
//               <div className="flex items-start gap-3">
//                 <Users className="text-gray-400 mt-1" size={18} />
//                 <div>
//                   <p className="text-xs text-gray-500 uppercase font-semibold">Groupes</p>
//                   <p className="text-sm font-medium">{selectedEvent.groups}</p>
//                 </div>
//               </div>
//               {/* Salles */}
//               <div className="flex items-start gap-3">
//                 <MapPin className="text-gray-400 mt-1" size={18} />
//                 <div>
//                   <p className="text-xs text-gray-500 uppercase font-semibold">Salles</p>
//                   <p className="text-sm font-medium">{selectedEvent.salles}</p>
//                 </div>
//               </div>
//               {/* Professeur */}
//               <div className="flex items-start gap-3">
//                 <User className="text-gray-400 mt-1" size={18} />
//                 <div>
//                   <p className="text-xs text-gray-500 uppercase font-semibold">Enseignant</p>
//                   <p className="text-sm font-medium">{selectedEvent.prof}</p>
//                 </div>
//               </div>
//             </div>
//             {/* Pied de page */}
//             <div className="p-4 bg-gray-50 border-t flex justify-end">
//                 <span className="text-xs text-gray-400 px-2 py-1">ID: {selectedEvent.id}</span>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
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
//         // AÏE : CONFLIT !
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
}),
"[project]/src/app/admin/planning/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>PlanningPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$planning$2d$calendar$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/planning-calendar.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$schedule_actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/actions/schedule_actions.ts [app-rsc] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$schedule_actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$schedule_actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
async function PlanningPage() {
    // 1. On définit la plage de dates à charger (ex: Année 2025)
    // Dans une vraie app, on gérerait ça dynamiquement, mais pour la démo on charge large
    const start = new Date(2025, 0, 1); // 1er Janvier
    const end = new Date(2025, 11, 31); // 31 Décembre
    // 2. On récupère les VRAIS cours depuis Postgres
    const lessons = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$schedule_actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getLessons"])(start, end);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "p-6 bg-gray-50 min-h-screen",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-between items-center mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-2xl font-bold text-gray-800",
                        children: "Planning Scolaire"
                    }, void 0, false, {
                        fileName: "[project]/src/app/admin/planning/page.tsx",
                        lineNumber: 16,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-sm text-gray-500",
                        children: [
                            lessons.length,
                            " cours chargés"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/admin/planning/page.tsx",
                        lineNumber: 17,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/admin/planning/page.tsx",
                lineNumber: 15,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$planning$2d$calendar$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                initialEvents: lessons
            }, void 0, false, {
                fileName: "[project]/src/app/admin/planning/page.tsx",
                lineNumber: 23,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/admin/planning/page.tsx",
        lineNumber: 14,
        columnNumber: 5
    }, this);
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/app/admin/planning/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/admin/planning/page.tsx [app-rsc] (ecmascript)"));
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__7034e4a1._.js.map