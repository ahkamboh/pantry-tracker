"use client"

import { useState, useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeftFromLine, Camera } from "lucide-react";

type PantryItem = {
  id: number;
  name: string;
  quantity: number;
  expirationDate: string;
  imageUrl: string;
};

type NewItem = {
  name: string;
  quantity: number;
  expirationDate: string;
  imageUrl: string;
  imageFile: Blob | null;
};

export function Component() {
  const [pantryItems, setPantryItems] = useState<PantryItem[]>([
    {
      id: 1,
      name: "Whole Wheat Flour",
      quantity: 3,
      expirationDate: "2024-06-30",
      imageUrl: "/placeholder.svg",
    },
    {
      id: 2,
      name: "Canned Tomatoes",
      quantity: 6,
      expirationDate: "2024-03-15",
      imageUrl: "/placeholder.svg",
    },
    {
      id: 3,
      name: "Oats",
      quantity: 1,
      expirationDate: "2024-09-01",
      imageUrl: "/placeholder.svg",
    },
    {
      id: 4,
      name: "Olive Oil",
      quantity: 2,
      expirationDate: "2025-01-01",
      imageUrl: "/placeholder.svg",
    },
    {
      id: 5,
      name: "Canned Beans",
      quantity: 4,
      expirationDate: "2024-05-31",
      imageUrl: "/placeholder.svg",
    },
    {
      id: 6,
      name: "Brown Rice",
      quantity: 1,
      expirationDate: "2024-11-30",
      imageUrl: "/placeholder.svg",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState<keyof PantryItem>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [newItem, setNewItem] = useState<NewItem>({
    name: "",
    quantity: 0,
    expirationDate: "",
    imageUrl: "",
    imageFile: null
  });

  const [stream, setStream] = useState<MediaStream | null>(null);

  const filteredAndSortedItems = useMemo(() => {
    return pantryItems
      .filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => {
        if (sortOrder === "asc") {
          return typeof a[sortBy] === "string"
            ? (a[sortBy] as string).localeCompare(b[sortBy] as string)
            : (a[sortBy] as number) - (b[sortBy] as number);
        } else {
          return typeof b[sortBy] === "string"
            ? (b[sortBy] as string).localeCompare(a[sortBy] as string)
            : (b[sortBy] as number) - (a[sortBy] as number);
        }
      });
  }, [pantryItems, searchTerm, sortBy, sortOrder]);

  const handleAddItem = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setNewItem({
      name: "",
      quantity: 0,
      expirationDate: "",
      imageUrl: "",
      imageFile: null
    });
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const handleSubmit = () => {
    setPantryItems((prevItems) => [
      ...prevItems,
      {
        id: Date.now(),
        ...newItem,
        imageUrl: newItem.imageUrl || (newItem.imageFile ? URL.createObjectURL(newItem.imageFile) : "/placeholder.svg")
      }
    ]);
    handleModalClose();
  };

  const handleImageUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewItem((prev) => ({ ...prev, imageUrl: e.target.value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewItem((prev) => ({ ...prev, imageFile: file }));
    }
  };

  const handleAddItemQuantity = (id: number) => {
    setPantryItems((prevItems) =>
      prevItems.map((item) => item.id === id ? { ...item, quantity: item.quantity + 1 } : item)
    );
  };

  const handleRemoveItemQuantity = (id: number) => {
    setPantryItems((prevItems) =>
      prevItems.map((item) => item.id === id ? { ...item, quantity: item.quantity - 1 } : item)
    );
  };

  const handleMarkAsUsed = (id: number) => {
    setPantryItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (key: keyof PantryItem, order: "asc" | "desc") => {
    setSortBy(key);
    setSortOrder(order);
  };

  const handleCameraAccess = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const handleCameraCapture = () => {
    if (stream) {
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();

      video.onloadedmetadata = () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d')!.drawImage(video, 0, 0);

        canvas.toBlob((blob) => {
          setNewItem((prev) => ({ ...prev, imageFile: blob }));
        }, 'image/jpeg');

        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      };
    }
  };

  const upcomingExpiration = useMemo(() => {
    return pantryItems
      .filter((item) => new Date(item.expirationDate) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))
      .sort((a, b) => new Date(a.expirationDate).getTime() - new Date(b.expirationDate).getTime());
  }, [pantryItems]);

  const lowInventory = useMemo(() => {
    return pantryItems.filter((item) => item.quantity <= 2);
  }, [pantryItems]);

  return (
    <div className="grid grid-cols-1 gap-8 p-4 md:grid-cols-[1fr_300px] md:p-8">
      <div>
        <div className="flex flex-col items-start justify-between mb-6 md:flex-row md:items-center">
          <h1 className="text-2xl font-bold ClashDisplay-Bold flex justify-center items-center gap-1"><a href="/"><ArrowLeftFromLine /> </a>Pantry Tracker</h1>
          <Button className=" bg-[#445f5c]" onClick={handleAddItem}>Add Item</Button>
        </div>
        <div className="flex flex-col items-start mb-6 text-[#445f5c] gap-4 md:flex-row md:items-center ">
          <Input placeholder="Search items..." className="flex-1" value={searchTerm} onChange={handleSearch} />
          <DropdownMenu >
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-[#445f5c] text-white">
                Sort by: {sortBy} {sortOrder === "asc" ? "\u2191" : "\u2193"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-[#445f5c7d]">
              <DropdownMenuRadioGroup value={sortBy} onValueChange={(key:any) => handleSort(key, sortOrder)}>
                <DropdownMenuRadioItem className="cursor-pointer" value="name">Name</DropdownMenuRadioItem>
                <DropdownMenuRadioItem className="cursor-pointer" value="quantity">Quantity</DropdownMenuRadioItem>
                <DropdownMenuRadioItem className="cursor-pointer" value="expirationDate">Expiration Date</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={sortOrder} onValueChange={(order:any) => handleSort(sortBy, order)}>
                <DropdownMenuRadioItem className="cursor-pointer" value="asc">Ascending</DropdownMenuRadioItem>
                <DropdownMenuRadioItem className="cursor-pointer" value="desc">Descending</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] ClashDisplay-Medium ">
          {filteredAndSortedItems.map((item) => (
            <Card key={item.id} className="bg-[#445f5c]">
              <img
                src={item.imageUrl || "/placeholder.svg"}
                alt={item.name}
                width={200}
                height={200}
                className="w-full h-40 object-cover rounded-t-lg"
              />
              <CardContent className="p-4">
                <div className="font-medium mb-2">{item.name}</div>
                <div className="flex justify-between items-center mb-2">
                  <div>Quantity: {item.quantity}</div>
                </div>
                <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleAddItemQuantity(item.id)}>
                      +
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleRemoveItemQuantity(item.id)} disabled={item.quantity <= 0}>
                      -
                    </Button>
                    <Button className="w-full " variant="outline" size="sm" onClick={() => handleMarkAsUsed(item.id)}>
                       Used
                    </Button>
                  </div>
                <div className="text-sm text-gray-400 mt-3">Expires: {item.expirationDate}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="space-y-6 ClashDisplay-Regular ">
        <h2 className="text-xl font-semibold ClashDisplay-Semibold">Upcoming Expirations</h2>
        {upcomingExpiration.length ? (
          <ul className="list-disc ">
            {upcomingExpiration.map((item) => (
              <li key={item.id} className="mb-2">
                <div className="font-medium">{item.name}</div>
                <div>Expires: {item.expirationDate}</div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No items are expiring soon.</p>
        )}
        
        <h2 className="text-xl font-semibold">Low Inventory</h2>
        {lowInventory.length ? (
          <ul className="list-disc  ">
            {lowInventory.map((item) => (
              <li key={item.id} className="mb-2">
                <div className="font-medium">{item.name}</div>
                <div>Quantity: {item.quantity}</div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No items with low inventory.</p>
        )}
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-gray-500 text-black bg-opacity-75 flex flex-col items-center justify-center z-50">
<div className=" space-y-2">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full border  max-h-[80vh] overflow-y-auto  ClashDisplay-Medium">
            <h2 className="text-lg font-semibold mb-4">Add New Item</h2>
            <div className="mb-4">
              <label htmlFor="name" className="block mb-2">Name</label>
              <Input
                id="name"
                type="text"
                placeholder="Brown Rice"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="quantity" className="block mb-2">Quantity</label>
              <Input
                id="quantity"
                type="number"
                value={newItem.quantity}
                onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value, 10) })}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="expirationDate" className="block mb-2">Expiration Date</label>
              <Input
                id="expirationDate"
                type="date"
                value={newItem.expirationDate}
                onChange={(e) => setNewItem({ ...newItem, expirationDate: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="imageUrl" className="block mb-2">Image URL</label>
              <Input
                id="imageUrl"
                type="text"
                placeholder="Optional image URL"
                value={newItem.imageUrl}
                onChange={handleImageUrl}
              />
            </div>
            <div className="mb-4 ">
              <label className="block mb-2">Image Upload</label>
              <div className="flex w-full justify-center items-center">
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />  
              <Button onClick={handleCameraAccess}>
              <Camera />
              </Button>
              </div>
              {stream && (
                <div className="mt-2">
                  <video className="rounded-md"
                    ref={(videoRef) => {
                      if (videoRef) {
                        videoRef.srcObject = stream;
                        videoRef.play();
                      }
                    }}
                  
                  />
                  <Button onClick={handleCameraCapture}  className="mt-2 bg-[#445f5c] text-white border w-full">
                    Capture
                  </Button>
                </div>
              )}
              {newItem.imageFile && (
                <div className="mt-2">
                  <img
                    src={URL.createObjectURL(newItem.imageFile)}
                    alt="Preview"
                    className="w-32 h-32 object-cover border border-gray-300 rounded"
                  />
                </div>
              )}
              {newItem.imageUrl && !newItem.imageFile && (
                <div className="mt-2">
                  <img
                    src={newItem.imageUrl}
                    alt="Preview"
                    className="w-32 h-32 object-cover border border-gray-300 rounded"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex w-full text-white  space-x-2 ">
              <Button className="w-full bg-[#445f5c] " variant="outline" onClick={handleModalClose}>Cancel</Button>
              <Button className="w-full bg-[#445f5c] " variant="outline" onClick={handleSubmit}>Add Item</Button>
            </div>
            </div>
        </div>
        
      )}
    </div>
  )
}