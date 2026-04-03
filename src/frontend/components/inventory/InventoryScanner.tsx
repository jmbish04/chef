import React, { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type InventoryItem = {
  id: number;
  barcode: string;
  itemName: string;
  quantity: number;
};

export default function InventoryScanner() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [barcode, setBarcode] = useState("");
  const [itemName, setItemName] = useState("");

  const fetchInventory = async () => {
    try {
      const res = await fetch("/api/inventory");
      const data = await res.json();
      setItems(data as InventoryItem[]);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ barcode, itemName, quantity: 1 }),
      });
      setBarcode("");
      setItemName("");
      fetchInventory();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`/api/inventory/${id}`, { method: "DELETE" });
      fetchInventory();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Scanner / Entry</CardTitle>
            <CardDescription>Enter barcode or item details manually.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdd} className="flex flex-col gap-4">
              <Input
                placeholder="Barcode"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                required
              />
              <Input
                placeholder="Item Name"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                required
              />
              <Button type="submit" className="w-full">
                Add to Inventory
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Metrics</CardTitle>
            <CardDescription>Pantry Overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{items.length}</div>
            <div className="text-sm text-muted-foreground mt-2">Distinct Items</div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-xl font-bold tracking-tight mb-4">Recent Scans / Inventory</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {items.map((item) => (
            <Card key={item.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <div className="font-semibold">{item.itemName}</div>
                  <div className="text-xs text-muted-foreground">Barcode: {item.barcode}</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="font-medium text-lg">x{item.quantity}</div>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)}>
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
