
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import ItemDetailModal from "../components/ItemModal";
import { toast } from "sonner";

export default function ViewItems() {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/items").then((res) => setItems(res.data));
  }, []);

  const handleEnquire = async (id) => {
    try {
      const res = await API.post(`/items/${id}/enquire`);
      toast.success("Enquiry Sent ✉️", {
        description: res.data.message || "Email sent successfully!",
        duration: 3000,
      });
    } catch (err) {
      toast.error("Failed to send enquiry 😢", {
        description: err.response?.data?.error || "Something went wrong.",
        duration: 3000,
      });
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        View Items
      </h2>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-20 text-center text-gray-600">
          <p className="text-xl mb-4">No items currently available.</p>
          <button
            onClick={() => navigate("/add")}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition"
          >
            ➕ Add Item
          </button>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelected(item)}
              className="cursor-pointer bg-white rounded-xl shadow-md hover:shadow-lg transition duration-300 p-4 flex flex-col items-center"
            >
              <img
                src={`http://localhost:5000/uploads/${item.coverImage}`}
                alt={item.itemName}
                className="w-40 h-40 object-cover rounded-lg mb-4 border"
              />
              <h4 className="text-lg font-medium text-gray-700">
                {item.itemName}
              </h4>
            </div>
          ))}
        </div>
      )}

      <ItemDetailModal
        open={!!selected}
        onClose={() => setSelected(null)}
        item={selected}
        onEnquire={handleEnquire}
      />
    </div>
  );
}
