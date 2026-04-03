import React, { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function MealPlanner() {
  const [recipes, setRecipes] = useState([]);

  const fetchRecipes = async () => {
    try {
      const res = await fetch("/api/recipes");
      const data = await res.json();
      setRecipes(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const handleFeelingLucky = () => {
    if (recipes.length === 0) return;
    const shuffled = [...recipes].sort(() => 0.5 - Math.random());
    setRecipes(shuffled);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Daily Meal Planner</h2>
        <Button onClick={handleFeelingLucky} variant="outline">
          I'm Feeling Lucky
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recipes.slice(0, 3).map((recipe: any, index: number) => {
          const meals = ["Breakfast", "Lunch", "Dinner"];
          return (
            <Card key={recipe.id}>
              <CardHeader>
                <CardDescription className="uppercase tracking-widest font-bold text-xs">
                  {meals[index]}
                </CardDescription>
                <CardTitle>{recipe.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3">{recipe.ingredients}</p>
                <div className="mt-4 flex gap-2">
                  <Button variant="secondary" size="sm" asChild>
                    <a href={`/recipe/${recipe.id}`}>View Details</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      {recipes.length === 0 && (
        <div className="text-muted-foreground">No recipes available to plan.</div>
      )}
    </div>
  );
}
