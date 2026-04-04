import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function SearchInterface() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/recipes");
      const all = (await res.json()) as any[];
      // Basic client side filter for demonstration
      const filtered = all.filter((r: any) =>
        r.ingredients.toLowerCase().includes(query.toLowerCase()),
      );
      setResults(filtered);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Reverse Recipe Search</CardTitle>
          <CardDescription>What's in my fridge?</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-4">
            <Input
              placeholder="Enter ingredients (e.g. eggs, milk, flour)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">Search</Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.length > 0 ? (
          results.map((recipe: any) => (
            <Card key={recipe.id}>
              <CardHeader>
                <CardTitle>{recipe.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3">{recipe.ingredients}</p>
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm" asChild={true as any}>
                    <a href={`/recipe/${recipe.id}`}>View Details</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-muted-foreground col-span-full">
            No results yet. Enter ingredients to search.
          </div>
        )}
      </div>
    </div>
  );
}
