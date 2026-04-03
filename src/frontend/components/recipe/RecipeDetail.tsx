import React, { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function RecipeDetail({ id }: { id: string }) {
  const [recipe, setRecipe] = useState<any>(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await fetch(`/api/recipes/${id}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setRecipe(data);
      } catch (e) {
        console.error(e);
      }
    };
    if (id) fetchRecipe();
  }, [id]);

  if (!recipe) return <div className="p-8">Loading recipe...</div>;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-black tracking-tighter uppercase">{recipe.title}</h2>
        <Button asChild>
          <a href={`/print/${id}`}>Print View</a>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Ingredients</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
              {recipe.ingredients}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Generic Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
              {recipe.genericSteps}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
