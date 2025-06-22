import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { Input } from "@/components/ui/input.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Label } from "@/components/ui/label.jsx";
import { toast } from "sonner";
import Confetti from "react-confetti";
import { useWindowSize } from "@uidotdev/usehooks";

export default function AddItem() {
  const [formData, setFormData] = useState({
    itemName: "",
    itemType: "",
    itemDescription: "",
    coverImage: null,
    additionalImages: [],
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { width, height } = useWindowSize();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setErrors((prev) => ({ ...prev, [name]: null }));

    if (name === "coverImage") {
      if (files.length > 1) {
        setErrors((prev) => ({
          ...prev,
          coverImage: "Only one cover image is allowed.",
        }));
      } else {
        setFormData({ ...formData, coverImage: files[0] });
      }
    } else if (name === "additionalImages") {
      const selected = Array.from(files);
      if (selected.length > 5) {
        setErrors((prev) => ({
          ...prev,
          additionalImages: "You can upload up to 5 additional images.",
        }));
      } else {
        setFormData({ ...formData, additionalImages: selected });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.itemName.trim()) newErrors.itemName = "Item name is required.";
    if (!formData.itemType.trim()) newErrors.itemType = "Item type is required.";
    if (!formData.itemDescription.trim()) newErrors.itemDescription = "Description is required.";
    if (!formData.coverImage) newErrors.coverImage = "Cover image is required.";
    if (formData.additionalImages.length > 5) {
      newErrors.additionalImages = "You can upload up to 5 additional images.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix the errors in the form.");
      return;
    }

    setIsSubmitting(true);
    const data = new FormData();
    data.append("itemName", formData.itemName);
    data.append("itemType", formData.itemType);
    data.append("itemDescription", formData.itemDescription);
    data.append("coverImage", formData.coverImage);
    formData.additionalImages.forEach((img) => data.append("additionalImages", img));

    try {
      const res = await API.post("/items", data);
      if (res.status === 201) {
        toast.success("🎉 Item added successfully!", {
          description: "Redirecting to View Items...",
          duration: 2500,
        });
        setShowConfetti(true);
        setTimeout(() => {
          setShowConfetti(false);
          navigate("/view-items");
        }, 2500);
      }
    } catch (e) {
      toast.error("Failed to add item.", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10 relative">
      {showConfetti && <Confetti width={width} height={height} />}
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Add New Item</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="itemName">Item Name</Label>
          <Input
            name="itemName"
            id="itemName"
            placeholder="Enter item name"
            value={formData.itemName}
            onChange={handleChange}
            className={errors.itemName ? "border-red-500" : ""}
            required
          />
          {errors.itemName && <p className="text-red-500 text-sm">{errors.itemName}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="itemType">Item Type</Label>
          <select
            name="itemType"
            id="itemType"
            value={formData.itemType}
            onChange={handleChange}
            required
            className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${
              errors.itemType ? "border-red-500" : "border-gray-300 focus:ring-blue-500"
            }`}
          >
            <option value="">-- Select Type --</option>
            <option value="Shirt">Shirt</option>
            <option value="Pant">Pant</option>
            <option value="Shoes">Shoes</option>
            <option value="Sports Gear">Sports Gear</option>
          </select>
          {errors.itemType && <p className="text-red-500 text-sm">{errors.itemType}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="itemDescription">Description</Label>
          <Textarea
            name="itemDescription"
            id="itemDescription"
            placeholder="Enter item description"
            value={formData.itemDescription}
            onChange={handleChange}
            required
            className={errors.itemDescription ? "border-red-500" : ""}
          />
          {errors.itemDescription && (
            <p className="text-red-500 text-sm">{errors.itemDescription}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="coverImage">Cover Image</Label>
          <Input
            type="file"
            name="coverImage"
            id="coverImage"
            accept="image/*"
            onChange={handleChange}
            required
            className={errors.coverImage ? "border-red-500" : ""}
          />
          {errors.coverImage && <p className="text-red-500 text-sm">{errors.coverImage}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="additionalImages">Additional Images (Max 5)</Label>
          <Input
            type="file"
            name="additionalImages"
            id="additionalImages"
            accept="image/*"
            multiple
            onChange={handleChange}
            className={errors.additionalImages ? "border-red-500" : ""}
          />
          {errors.additionalImages && (
            <p className="text-red-500 text-sm">{errors.additionalImages}</p>
          )}
        </div>

        <div className="pt-4 flex flex-col gap-3 sm:flex-row sm:justify-between">
          <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Add Item"}
          </Button>
          <Button
            variant="outline"
            type="button"
            onClick={() => navigate("/view-items")}
            className="text-white w-full sm:w-auto"
          >
            Back to View Items
          </Button>
        </div>
      </form>
    </div>
  );
}
