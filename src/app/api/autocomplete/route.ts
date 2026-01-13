import { NextResponse } from "next/server";
import { client_elastic } from "@/lib/elasticsearch";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const query = searchParams.get("query") ?? "";
  const field = searchParams.get("field") ?? "nom_voie"; 
  const nomCommuneFilter = searchParams.get("nom_commune"); 

  // Construction du filtre booléen
  const must: any[] = [{
      match_phrase_prefix: { [field]: {query, max_expansions:10, slop:2} }
  }];

  if (nomCommuneFilter && nomCommuneFilter.trim() !== "") {
    must.push({ 
      match: { nom_commune: nomCommuneFilter } 
    });
  }

  const result = await client_elastic.search({
    index: "adresses",
    size: 10,
    query: {
      bool: { must }
    }
  });

  return NextResponse.json(
    result.hits.hits.map((hit: any) => ({
      _id: hit._id,
      ...hit._source,
    }))
  );
}