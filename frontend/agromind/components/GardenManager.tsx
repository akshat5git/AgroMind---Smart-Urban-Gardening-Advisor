import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Sprout, Plus, Edit2, Trash2, Home, Building2, Trees, MapPin } from "lucide-react";
import { Badge } from "./ui/badge";

interface Garden {
  id: string;
  name: string;
  type: string;
  location: string;
  plants: number;
  createdAt: Date;
}

const gardenTypes = [
  { value: "balcony", label: "Balcony", icon: Home },
  { value: "terrace", label: "Terrace", icon: Building2 },
  { value: "backyard", label: "Backyard", icon: Trees },
  { value: "indoor", label: "Indoor", icon: Home },
  { value: "rooftop", label: "Rooftop", icon: Building2 },
  { value: "community", label: "Community", icon: MapPin },
];

export function GardenManager() {
  const [gardens, setGardens] = useState<Garden[]>([
    {
      id: "1",
      name: "My Balcony Garden",
      type: "balcony",
      location: "North Facing",
      plants: 8,
      createdAt: new Date(),
    },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGarden, setEditingGarden] = useState<Garden | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "balcony",
    location: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingGarden) {
      setGardens(
        gardens.map((g) =>
          g.id === editingGarden.id
            ? { ...g, ...formData }
            : g
        )
      );
    } else {
      const newGarden: Garden = {
        id: Date.now().toString(),
        ...formData,
        plants: 0,
        createdAt: new Date(),
      };
      setGardens([...gardens, newGarden]);
    }
    setIsDialogOpen(false);
    setFormData({ name: "", type: "balcony", location: "" });
    setEditingGarden(null);
  };

  const handleEdit = (garden: Garden) => {
    setEditingGarden(garden);
    setFormData({
      name: garden.name,
      type: garden.type,
      location: garden.location,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setGardens(gardens.filter((g) => g.id !== id));
  };

  const handleDialogClose = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setEditingGarden(null);
      setFormData({ name: "", type: "balcony", location: "" });
    }
  };

  return (
    <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Trees className="w-6 h-6 text-green-600" />
              My Gardens
            </CardTitle>
            <CardDescription>Manage your different growing spaces</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Garden
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingGarden ? "Edit Garden" : "Create New Garden"}
                </DialogTitle>
                <DialogDescription>
                  {editingGarden
                    ? "Update your garden details"
                    : "Add a new garden space to track your plants"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Garden Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., My Balcony Garden"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Garden Type</Label>
                  <select
                    id="type"
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  >
                    {gardenTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location/Orientation</Label>
                  <Input
                    id="location"
                    placeholder="e.g., North Facing, Sunny Spot"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleDialogClose(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">
                    {editingGarden ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {gardens.map((garden) => {
            const typeInfo = gardenTypes.find((t) => t.value === garden.type);
            const Icon = typeInfo?.icon || Trees;
            return (
              <Card
                key={garden.id}
                className="bg-white hover:shadow-lg transition-shadow border-l-4 border-green-500"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <Icon className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-base">{garden.name}</h3>
                        <p className="text-xs text-gray-600">{garden.location}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="secondary" className="text-xs">
                      {typeInfo?.label}
                    </Badge>
                    <span className="text-sm text-gray-600">
                      <Sprout className="w-4 h-4 inline mr-1" />
                      {garden.plants} plants
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleEdit(garden)}
                    >
                      <Edit2 className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:bg-red-50"
                      onClick={() => handleDelete(garden.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        {gardens.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Trees className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg mb-2">No gardens yet</p>
            <p className="text-sm">Create your first garden space to start tracking your plants</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
