import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import http from "../helper/http";

const ListProduct = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    setLoading(true);
    http
      .get("products")
      .then((response) => {
        setProducts(response.data);
        setFilteredProducts(response.data);
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const filtered = products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.color.toLowerCase().includes(search.toLowerCase());

      const matchesPriceRange =
        (!minPrice || product.price >= parseFloat(minPrice)) &&
        (!maxPrice || product.price <= parseFloat(maxPrice));

      return matchesSearch && matchesPriceRange;
    });

    setFilteredProducts(filtered);
  }, [search, minPrice, maxPrice, products]);

  const handleEdit = (row) => {
    setModalData(row);
    setModalVisible(true);
  };

  const handleCreate = () => {
    setModalData(null);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setModalData(null);
    fetchProducts();
  };

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    window.location.href = "/";
  };

  const columns = [
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
      width: "50%",
    },
    {
      name: "Price",
      selector: (row) => row.price,
      sortable: true,
      width: "20%",
    },
    {
      name: "Color",
      selector: (row) => row.color,
      sortable: true,
      width: "20%",
    },
    {
      name: "#",
      cell: (row) => (
        <button
          onClick={() => handleEdit(row)}
          className="text-xs border text-blue-500 border-blue-500 hover:bg-blue-500 hover:text-white p-2 rounded-md"
          aria-label="Edit"
        >
          Edit
        </button>
      ),
      width: "10%",
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex justify-center">
      <div className="w-full sm:w-[90%] md:w-[80%] lg:w-[50%] bg-white shadow-md rounded-lg p-4">
        <div className="flex justify-between items-center mb-6">
          <button
            type="button"
            onClick={handleCreate}
            className="text-white bg-blue-500 hover:bg-blue-800 px-4 py-2 text-sm rounded-lg"
          >
            Create
          </button>
          <h1 className="text-2xl font-bold text-gray-700">Product List</h1>
          <button
            type="button"
            onClick={handleLogout}
            className="border border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-4 py-2 text-sm rounded-lg"
          >
            Logout
          </button>
        </div>

        <Filter
          search={search}
          setSearch={setSearch}
          minPrice={minPrice}
          setMinPrice={setMinPrice}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
        />

        <DataTable
          columns={columns}
          data={filteredProducts}
          progressPending={loading}
          pagination
          highlightOnHover
          striped
          responsive
          persistTableHead
          noDataComponent={<div>No products available</div>}
        />

        {modalVisible && <Modal onClose={handleCloseModal} data={modalData} />}
      </div>
    </div>
  );
};

const Filter = ({
  search,
  setSearch,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
}) => {
  return (
    <div className="mb-4 grid grid-cols-4 gap-4">
      <input
        type="text"
        placeholder="Search by name or color"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="col-span-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="number"
        placeholder="Min price"
        value={minPrice}
        onChange={(e) => setMinPrice(e.target.value)}
        className="col-span-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="number"
        placeholder="Max price"
        value={maxPrice}
        onChange={(e) => setMaxPrice(e.target.value)}
        className="col-span-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

const Modal = ({ onClose, data }) => {
  const [name, setName] = useState(data?.name || "");
  const [price, setPrice] = useState(data?.price || "");
  const [color, setColor] = useState(data?.color || "");
  const [loading, setLoading] = useState(false);

  if (color === "-") {
    setColor(null);
  }

  if (price === "-") {
    setPrice(null);
  }

  const handleSave = () => {
    const product = { name, price, color };
    const endpoint = data?.id ? `products/${data.id}` : "products";
    const method = data?.id ? http.put : http.post;

    setLoading(true);
    method(endpoint, product)
      .then(() => onClose())
      .catch((error) => console.error("Error saving product:", error))
      .finally(() => setLoading(false));
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {data ? "Edit Product" : "Create Product"}
        </h2>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="text-gray-500 bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className={`text-white bg-blue-500 px-4 py-2 rounded-lg ${
              loading && "opacity-50 cursor-not-allowed"
            } hover:bg-blue-600`}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListProduct;
