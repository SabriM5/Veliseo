"use client";


import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {  useState, useRef } from "react";
import { toast } from "sonner";
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

//import { useRouter } from "next/navigation";
//import { Error } from '@/lib/auth';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage
} from "@/components/ui/form"

import { capitalizeWords, onSubmitServer } from '@/actions/register_actions';
import AsyncSelect from "react-select/async";
import { Textarea } from "@/components/ui/textarea";

//////////////////////////////
/////////   ZOD     //////////
//////////////////////////////
const CiviliteEnum = z.enum(["Monsieur", "Madame", "Autre"])
const NiveauEnum = z.enum(["1", "2", "3", "4", "5"])
const civiliteComplet = { "Monsieur": "Monsieur", "Madame": "Madame", "Autre": "Autre/Ne souhaite pas renseigner" }
const ContraEnum = z.enum(['LDM', 'CDDU', 'Partenariat', 'Chaire et don en compétence', 'Alumni', 'Chaire', 'Don en compétence', 'Entreprise', 'CDI', 'CDD'])
const FormaEnum = z.enum(["E", "A", "B"])
const RoleEnum = z.enum(["VACAT", "PERMANENT", "ELING", "PARENT", "COMM"])
const roleComplet = { "VACAT": "Intervenant externe", "PERMANENT": "Professeur permanent", "ELING": "Elève ingénieur", "PARENT": "Parent d'élève / Responsable légal", "COMM": "Communication" }
const regexNom = /^[A-ZÀÂÄÉÊÈËÙÛÜÎÏÔÖÇ][A-ZÀÂÄÉÊÈËÙÛÜÎÏÔÖÇ -]+$/
const regexPrenom = /^([A-ZÀÂÄÉÊÈËÙÛÜÎÏÔÖÇ][a-zàâäéêèëùûüîïôöç]+[ -]?)*([A-ZÀÂÄÉÊÈËÙÛÜÎÏÔÖÇ][a-zàâäéêèëùûüîïôöç]+)$/
const regexPhone = /^[1-9][0-9]{8}$/

const UserSchema = z.object({
    nom: z.string().toUpperCase().regex(regexNom, "Le nom doit être en MAJUSCULES"),
    prenom: z.string().regex(regexPrenom, "Format prénom invalide"),
    email: z.email("Email invalide"),
    civilite: CiviliteEnum,
    role: RoleEnum,
    phoneNumber: z.string().regex(regexPhone, "Numéro de téléphone invalide"),
    forma: FormaEnum,
    password: z.string().regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
        "Le mot de passe doit contenir : une majuscule, une minuscule, un chiffre et 8 caractères minimum"
    ),
    tarif: z.number().min(0, "Le tarif doit être positif."),
    typeContrat: ContraEnum.optional(),
    annee: z.string(),
    niveau: NiveauEnum,    
    commune: z.object({
        nom_commune: z.string(),
        nom_voie: z.string().optional(),
    }).nullable(),
    voie: z.object({
        nom_voie: z.string(),
        nom_commune: z.string(),
    }).nullable(),
    numero_voie: z
        .string()
        .optional()
        .refine((v) => !v || /^[0-9]{1,4}$/.test(v), "Numéro invalide"),
    complement: z.string().optional().nullable(),
})

export type FormValues = z.infer<typeof UserSchema>

//////////////////////////////
/////   FIN  ZOD     /////////
//////////////////////////////

// interface Addrss {
//     _id: string;
//     code_postal: string;
//     nom_commune: string;
//     nom_voie: string;
//     numero: string;
//     reps: string;
// }

function getAnneeScolaire(date = new Date()) {
    let year = date.getFullYear();
    const month = date.getMonth() + 1;
    if (month < 8) year = year - 1;
    return `${year}-${year + 1}`;
}

export const RegisterForm = () => {
    //const [displayValue, setDisplayValue] = useState("") // valeur AVEC espaces
    const [isPending, setIsPending] = useState(false);
    const currentAnnee = getAnneeScolaire();
    const [selectedYear, setSelectedYear] = useState(currentAnnee);
    const annees = Array.from({ length: 10 }, (_, i) => {
        const startYear = parseInt(currentAnnee.split("-")[0], 10) + i - 5;
        return `${startYear}-${startYear + 1}`;
    });

    //const [selectedCommune, setSelectedCommune] = useState<string | null>(null);
    ///////////////////////////////////////////////////////

    const [displayPhone, setDisplayPhone] = useState("")
    const [rawValue, setRawValue] = useState("")
    const prevFormattedRef = useRef("")
    const prevDigitsRef = useRef("")

    const form = useForm<FormValues>({
        resolver: zodResolver(UserSchema),
        defaultValues: {
            nom: "",
            prenom: "",
            email: "",
            civilite: "Autre",
            role: "ELING",
            phoneNumber: "",
            forma: "E",
            password: "",
            tarif: 0.0,
            typeContrat: "LDM",
            annee: "",            
            commune: null,
            voie: null,
            numero_voie: "",
            complement: "",
        },
    })

    const role = form.watch("role")
    const selectedCommune = form.watch("commune")?.nom_commune || "";
    /////////////////////////////////////////////////////////

    const MAX_DIGITS = 9 // x + 4 groupes de 2 -> 9 chiffres

    const formatPhone = (value: string) => {
      const digits = value.replace(/\D/g, "");
  
      // 2. On limite à 9 chiffres (puisqu'on assume que le '0' initial est omis ou géré à part, 
      const limited = digits.slice(0, 9);

      // 3. Le regex magique : 1 chiffre, puis des groupes de 2
      const match = limited.match(/^(\d{1})(\d{2})?(\d{2})?(\d{2})?(\d{2})?$/);

      if (match) {
        // On recolle les morceaux existants avec des espaces
        return [match[1], match[2], match[3], match[4], match[5]]
          .filter((group) => group !== undefined) // Garde ce qui a été tapé
          .join(" ");
      }

      return digits;
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target
        const pos = input.selectionStart ?? 0
        const raw = input.value

        // 1. Récupération des anciennes valeurs pour comparaison
        const prevFormatted = prevFormattedRef.current
        
        // 2. Nettoyage : on ne garde que les chiffres
        let digits = raw.replace(/\D+/g, "")
        
        // 3. Limite à 9 chiffres (format sans le 0)
        if (digits.length > MAX_DIGITS)
            digits = digits.slice(0, MAX_DIGITS)

        // 4. On formate (ajoute les espaces)
        const formatted = formatPhone(digits)
        
        // 5. LOGIQUE DU CURSEUR (Le bloc complexe que tu as montré)
        const isDeleting = raw.length < prevFormatted.length
        let cursor = pos
        let digitsBeforeCursorCount = 0

        if (isDeleting) {
            // Si on efface, on regarde combien de chiffres il y avait avant le curseur
            const prevDigitsBeforeCursor = prevFormatted.slice(0, pos).replace(/\D+/g, "")
            digitsBeforeCursorCount = prevDigitsBeforeCursor.length
        } else {
            // Si on écrit, on regarde combien de chiffres il y a maintenant avant le curseur
            const rawDigitsBeforeCursor = raw.slice(0, pos).replace(/\D+/g, "")
            digitsBeforeCursorCount = rawDigitsBeforeCursor.length
        }

        // On recalcule la position idéale du curseur dans la nouvelle chaîne formatée
        const formattedUntilCursor = formatPhone(digits.slice(0, digitsBeforeCursorCount))
        cursor = formattedUntilCursor.length

        // 6. Mise à jour des états
        setDisplayPhone(formatted)       // Met à jour l'affichage (avec espaces)
        prevFormattedRef.current = formatted
        prevDigitsRef.current = digits
        
        // IMPORTANT : On envoie la valeur BRUTE (sans espaces) au formulaire/backend
        form.setValue("phoneNumber", digits)

        // 7. On replace le curseur au bon endroit
        requestAnimationFrame(() => {
            if(input) {
                input.selectionStart = input.selectionEnd = cursor
            }
        })
    }


    const onSubmit = async (data: FormValues) => {
        toast.success("OK ! Données valides.\n" + JSON.stringify(data, null, 2))
        const result = await onSubmitServer(data);
    };



    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-sm w-full space-y-4" >
            {/*NOM*/}
            <FormField
                control={form.control}
                name="nom"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>NOM</FormLabel>
                        <FormControl>
                            <Input {...field}
                                value={field.value?.toUpperCase() || ""}
                                onChange={(e) => field.onChange(e.target.value)}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/*Prenom*/}
            <FormField
                control={form.control}
                name="prenom"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Prénom</FormLabel>
                        <FormControl>
                            <Input {...field}
                                value={capitalizeWords(field.value?.toString() || "")}
                                onChange={(e) => field.onChange(e.target.value)}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* CIVILITE */}
            <div className="flex items-center gap-4">
                <FormLabel className="whitespace-nowrap">Civilité : </FormLabel>
                <FormField
                    control={form.control}
                    name="civilite"
                    render={({ field }) => (
                        <FormItem>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choisir ... " />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {CiviliteEnum.options.map((c) => (<SelectItem key={c} value={c}>{civiliteComplet[c]}</SelectItem>))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                >
                </FormField>
            </div>

            {/* ROLE */}
            <div className="flex items-center gap-4">
                <FormLabel>Rôle au sein de l&apos;oragnisation&nbsp;: </FormLabel>
                <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) =>
                    (<FormItem>
                      <Select value={role} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Choisir ... " />
                          </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {RoleEnum.options.map((r) => (<SelectItem key={r} value={r}>{roleComplet[r]}</SelectItem>))}
                          </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>)
                    }
                />
            </div>

            {role === "ELING" ? (
              <>
                <div className="flex flex-row items-center gap-6">
                  <FormLabel className="whitespace-nowrap">Formation&nbsp;: </FormLabel>
                    <FormField
                      control={form.control}
                      name="forma"
                      render={({ field }) => (
                        <FormItem>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-[300px]">
                                <SelectValue placeholder="Choisissez une formation" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="E">
                                FISE <span className="text-sm">(Formation initiale sous statut étudiant)</span>
                              </SelectItem>
                              <SelectItem value="A"> FISA (Formation initiale sous statut apprenti) </SelectItem>
                              <SelectItem value="B">Bachelor</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                        )}
                    />
                </div>
                <div className="flex flex-row items-center gap-4">
                  <FormLabel className="text-sm">
                    <span className="inline-block w-full max-w-xs sm:max-w-sm md:max-w-md break-words">
                      Année de première inscription&nbsp;:
                    </span>
                  </FormLabel>
                  <FormField
                    control={form.control}
                    name="annee"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Choisir ..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {annees.map((r) => (<SelectItem key={r} value={r}>{r}</SelectItem>))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                        );}}                        
                  />

                  <FormLabel className="text-sm">                  
                    <span className="inline-block w-full max-w-xs sm:max-w-sm md:max-w-md break-words">
                      Niveau demandé&nbsp;:
                    </span>
                  </FormLabel>
                  <FormField
                    control={form.control}
                    name="niveau"
                    defaultValue="1"
                    render={({ field }) => (
                      <FormItem>
                        <Select onValueChange={field.onChange} value={field.value} >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Choisir ... " />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {NiveauEnum.options.map((c) => (<SelectItem key={c} value={c}>{c}</SelectItem>))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </>) : null}

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Mot de passe */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mot de passe</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                  </FormItem>
                )}
              />

              {/* TELEPHONE */}
          <FormField
            control={form.control}
            name="phoneNumber"
            render={() => (
              <FormItem>
                <FormLabel>Téléphone</FormLabel>
                <div className="flex place-items-center border rounded-md px-3">
                  {/* L'indicatif visuel fixe */}
                  <span className="text-gray-500 mr-2 select-none">+33</span>

                  {/* L'input contrôlé */}
                  <Input
                    type="tel"
                    placeholder="6 78 92 52 67"
                    value={displayPhone}     // On affiche la version formatée (avec espaces)
                    onChange={handlePhoneChange} // On branche ta fonction complexe
                    className="border-0 shadow-none focus-visible:ring-0 px-0"
                  />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

              {role == "VACAT" ?
                (<div className="flex flex-row items-center gap-4">
                  <FormField
                    control={form.control}
                    name="tarif"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tarif</FormLabel>
                          <FormControl>
                            <Input {...field} value={field.value ?? undefined} onChange={field.onChange}/>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                  />
                  <FormField
                    control={form.control}
                    name="typeContrat"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="whitespace-nowrap">Type de contrat : </FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Choisir ... " />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {ContraEnum.options.map((c) => (<SelectItem key={c} value={c}>{c}</SelectItem>))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>) : null
              }

          {/* --------------------- */}
          {/* SELECT COMMUNE        */}
          {/* --------------------- */}
          <Controller
            name="commune"
            control={form.control}
            defaultValue={null}
            render={({ field }) => (
              <AsyncSelect
                defaultOptions
                isClearable
                placeholder="Saisir une commune…"
                value={
                  field.value
                    ? {
                      value: field.value,
                      label: field.value.nom_commune,
                    }
                    : null
                }
                loadOptions={async (inputValue) => {
                  if (inputValue.length < 2) return [];

                  const res = await fetch(
                    `/api/autocomplete?field=nom_commune&query=${inputValue}`
                  );
                  const data = await res.json();

                  return data.map((item:{nom_commune:string; code_postal:string}) => ({
                    value: item,
                    label: (
                      <>
                        {item.nom_commune}
                        <span className="text-gray-400 ml-2">
                          {item.code_postal}
                        </span>
                      </>
                    ),
                  }));
                }}
                onChange={(option) => {
                  field.onChange(option?.value ?? null);

                  form.setValue("voie", null);
                  form.setValue("numero_voie", "");
                }}
              />
            )}
          />

          {/* --------------------- */}
          {/* SELECT VOIE           */}
          {/* --------------------- */}
          <Controller
            name="voie"
            control={form.control}
            defaultValue={null}
            render={({ field }) => (
              <AsyncSelect
                isDisabled={!selectedCommune}
                defaultOptions
                isClearable
                placeholder={
                  selectedCommune
                    ? "Saisir une voie..."
                    : "Sélectionnez d'abord une commune"
                }
                value={
                  field.value
                    ? {
                      value: field.value,
                      label: field.value.nom_voie,
                    }
                    : null
                }
                loadOptions={async (inputValue) => {
                  if (inputValue.length < 2 || !selectedCommune) return [];

                  const res = await fetch(
                    `/api/autocomplete?query=${inputValue}&nom_commune=${encodeURIComponent(
                      selectedCommune
                    )}`
                  );

                  const data = await res.json();

                  return data.map((item:{nom_voie:string;nom_commune:string}) => ({
                    value: item,
                    label: (
                      <>
                        {item.nom_voie}
                        <span className="text-gray-400 ml-2">
                          {item.nom_commune}
                        </span>
                      </>
                    ),
                  }));
                }}
                onChange={(option) => {
                  field.onChange(option?.value ?? null);
                }}
              />
            )}
          />

          {/* --------------------- */}
          {/* NUMÉRO DE VOIE       */}
          {/* --------------------- */}
          <FormField
            control={form.control}
            name="numero_voie"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Numéro de voie</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Ex : 12"
                    {...field}
                    //className="input input-bordered w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* --------------------- */}
          {/* COMPLÉMENT D’ADRESSE */}
          {/* --------------------- */}
          <FormField
            control={form.control}
            name="complement"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Complément d'adresse</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Complément d&apos;adresses : bis, ter, ..."
                    {...field}
                    value={field.value ?? ""}   
                    className="textarea textarea-bordered w-full"                
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" >
            Register
          </Button>
        </form>


        </Form >


    );
};