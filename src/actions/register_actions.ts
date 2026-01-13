import { FormValues } from "@/components/register-form";
import { signUp } from "@/lib/auth-client";
import { Pool } from "pg";

function getLettrePromo(anneeScolaire:string, niveau:string){
  const startYear = parseInt(anneeScolaire.split("-")[0],10);
  const index = startYear - 2006 - (parseInt(niveau,10)-1); 
      // s'incrire en 3ème année, c'est comme s'être inscrit il y a deux ans en première année  
  return String.fromCharCode("a".charCodeAt(0)+((index%26)+26)%26) // +26 pour éviter les négatifs
}

export function sanitizePhone(input: string | null | undefined): string | null {
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

  phone=phone.replace(/ /g,"")
  console.log(phone)
  return phone.replace(/ /g,"");// "+33"+phone;
}


export function capitalizeWords(input: string): string {
  return input
    .replace(/-+/g,'-')
    .split(/([ -])/g) // garde les séparateurs espace et tiret
    .map(segment => {
      // ne capitalise pas les séparateurs eux-mêmes
      if (segment === " " || segment === "-") return segment;
      return segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase();
    })
    .join("");
}

   
// export const formatPhoneWithSpaces = (value: string | null | undefined) => {
//   if (!value) return "";

//   let numero = value;
//   if (numero.startsWith("0")) {
//     numero = numero.slice(1);
//   }

//   let digits = numero.replace(/\D/g, "").slice(0, 9);

//   // Regrouper 1 chiffre puis des groupes de 2
//   return digits
//     .replace(/(\d{1})(\d{2})(\d{2})(\d{2})(\d{0,2})?/, (_, a, b, c, d, e) =>
//       [a, b, c, d, e].filter(Boolean).join(" ")
//     )
//     .trim();
// };


export const formatPhoneWithSpaces = (value: string | null | undefined) => {  
  if (!value) return "";

  let numero=value
  if (numero.startsWith("0")) {
    console.log("catched!!!")
    numero = numero.slice(1);
  }

  let digits = numero.replace(/\D/g, ""); // supprimer tout sauf les chiffres
  digits = digits.slice(0, 9); // limiter à 9 chiffres
  

  if (!digits) return ""; // pas de chiffres → retour vide

  let formatted = "";
  let addSpace = false;
  
  for (let i = 0; i < digits.length; i++) {
    formatted += digits[i];
    if(i==0)
      formatted += " ";
    if (i > 1 && addSpace) {
      formatted += " ";
      addSpace = false;
    } else {
      addSpace = true;
    }
  }
  return formatted.trim();
};


// export async function handleSubmit(evt: React.FormEvent<HTMLFormElement>) {
//   evt.preventDefault();
//   const formData = new FormData(evt.currentTarget as HTMLFormElement);       

//   const nom = String(formData.get("nom")).toUpperCase();
//   if (!nom) return { error: "Please enter your nom" };

//   const prenom = String(formData.get("prenom"));
//   if (!prenom) return { error: "Please enter your prenom" };

//   const tabPrenom = prenom.split(" ")
//   const longu = tabPrenom.length
//   const name = `${nom[0]}${prenom.split(" ").slice(0,Math.min(2,longu)).join("")}`
//     .toLowerCase()
//     .normalize("NFD")                // décompose caractères accentués
//     .replace(/\p{Diacritic}/ug, "") // supprime diacritiques
//     .replace(/[^a-z]/g, "");

//   const email = String(formData.get("email"));
//   if (!email) return { error: "Please enter your email" };

//   const password = String(formData.get("password"));
//   if (!password) return { error: "Please enter your password" };

//   const civilite = String(formData.get("civilite"));
//   //console.log(civilite)

//   const pre_phone = formData.get("phone")
//   //const phone = pre_phone ? formatPhoneWithSpaces(String(pre_phone).trim()) : null;
//   const tarif = String(formData.get("tarif"))
//   const typeContrat = String(formData.get("typeContrat"))
//   //const emaileseo = String(formData.get("emaileseo"))
//   const role = String(formData.get("role"))

//   const annee = String(formData.get("annee"))
//   console.log(annee)

//   const niveau = String(formData.get("niveau"))
//   console.log(`niveau: ${niveau}`)

//   const promoOrigine=String.fromCharCode(
//     parseInt(annee.split('-')[0])-parseInt(niveau)+1-2006+96
//   )

//   //console.log(promoOrigine)
//   //console.log(role)
//   //console.log(parseInt(annee.split('–')[0])-parseInt(niveau)+1-2006+96)

//   let metadata:string[] = []  
//   if (role=="ELING")
//     metadata = [annee,niveau]
//   else if (role=="VACAT")
//     metadata = [tarif,typeContrat]
//   const id=name
//   const user =  await signUp.email({ id ,name, email, password, nom, prenom, civilite, role, "phoneNumber":phone||null, metadata})

  
// }

export async function onSubmitServer(data: FormValues) {
  // 1) Validation simple équivalente à tes checks
  const nom = data.nom?.toUpperCase();
  if (!nom) return { error: "Please enter your nom" };

  const prenom = data.prenom;
  if (!prenom) return { error: "Please enter your prenom" };

  // 2) Construction du "name"
  const tabPrenom = prenom.split(" ");
  const longu = tabPrenom.length;

  const name = `${nom[0]}${prenom.split(" ").slice(0, Math.min(2, longu)).join("")}`
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/ug, "")
    .replace(/[^a-z]/g, "");

  const nomNorma = nom.replace(" ","").toLowerCase().normalize("NFD").replace(/\p{Diacritic}/ug, "").replace(/[^a-z]/g, "");
  const prenomNorma = prenom.replace(" ","").toLowerCase().normalize("NFD").replace(/\p{Diacritic}/ug, "").replace(/[^a-z]/g, "");
  const emaileseoPrefixe = `${prenomNorma}.${nomNorma}`
  // 3) Email & password

  const email = data.email;
  if (!email) return { error: "Please enter your email" };

  const password = data.password;
  if (!password) return { error: "Please enter your password" };

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

  const forma = data.forma
  const annee = data.annee;
  const niveau = data.niveau;
  // 5) Calcul promoOrigine
  const promoOrigine = String.fromCharCode(
    parseInt(annee.split("-")[0]) - parseInt(niveau) + 1 - 2006 + 96
  );
  

  // 6) Metadata selon rôle
  let metadata: string[] = [];
  if (role === "ELING") metadata = [forma, promoOrigine, emaileseoPrefixe];
  else if (role === "VACAT") metadata = [tarif, typeContrat, emaileseoPrefixe];

  // 7) User ID final
  const id = name;

  // 8) Appel à better-auth équivalent à ton ancienne version
  const user = await signUp.email({
    id,
    name,
    email,
    password,
    nom,
    prenom,
    civilite,
    role,
    phoneNumber: phone || null,
    metadata,
  });

  return { success: true, user };
}



export async function generateUniqueName(name: string, pool:Pool) {
  const base = name
  let username = name;
  let count = 1;
  while (true) {
    try {
      // Tentative d'insertion temporaire via SELECT EXISTS pour vérifier unicité
      const result = await pool.query(
        'SELECT 1 FROM "user" WHERE name = $1',
        [username]
      );
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


export async function generateUniqueEmailEseo(name: string, table: string, pool:Pool) {
  const [base, suffixe] = name.split("@")
  let prefixe = base;
  let count = 1;
  while (true) {
    try {
      // Tentative d'insertion temporaire via SELECT EXISTS pour vérifier unicité
      const result = await pool.query(
        'SELECT 1 FROM '+table+' WHERE emaileseo = $1',
        [prefixe+"@"+suffixe]
      );
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
}


// autre méthode, 
      //SELECT NOT EXISTS (
    //SELECT 1 FROM "user" WHERE maileseo = $1
  //);