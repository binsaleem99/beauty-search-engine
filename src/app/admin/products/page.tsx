'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, DollarSign, Tag } from 'lucide-react';

type Product = {
    id: string;
    name_en: string;
    name_ar: string;
    brand: string;
    category: string;
    subcategory: string;
    image_url: string;
    created_at: string;
};

type Retailer = {
    id: string;
    name_en: string;
    slug: string;
};

type Ingredient = {
    id: string;
    name_en: string;
    name_ar: string;
};

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [retailers, setRetailers] = useState<Retailer[]>([]);
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddProduct, setShowAddProduct] = useState(false);
    const [showAddPrice, setShowAddPrice] = useState(false);
    const [showLinkIngredient, setShowLinkIngredient] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    // Form states
    const [productForm, setProductForm] = useState({
        name_en: '',
        name_ar: '',
        brand: '',
        category: '',
        subcategory: '',
        image_url: '',
        description_en: '',
        description_ar: '',
        benefits_en: '',
        benefits_ar: '',
        skin_types: '',
        main_ingredients: '',
        inci_list: ''
    });

    const [priceForm, setPriceForm] = useState({
        product_id: '',
        retailer_id: '',
        price: '',
        url: '',
        in_stock: true
    });

    const [ingredientForm, setIngredientForm] = useState({
        product_id: '',
        ingredient_id: '',
        concentration_percentage: ''
    });

    // Fetch initial data
    useEffect(() => {
        fetchProducts();
        fetchRetailers();
        fetchIngredients();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/products?limit=100');
            const data = await res.json();
            setProducts(data.products || []);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
        setLoading(false);
    };

    const fetchRetailers = async () => {
        try {
            const res = await fetch('/api/admin/retailers');
            const data = await res.json();
            setRetailers(data.retailers || []);
        } catch (error) {
            console.error('Error fetching retailers:', error);
        }
    };

    const fetchIngredients = async () => {
        try {
            const res = await fetch('/api/admin/ingredients');
            const data = await res.json();
            setIngredients(data.ingredients || []);
        } catch (error) {
            console.error('Error fetching ingredients:', error);
        }
    };

    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/admin/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productForm)
            });

            if (res.ok) {
                alert('Product added successfully!');
                setShowAddProduct(false);
                setProductForm({
                    name_en: '',
                    name_ar: '',
                    brand: '',
                    category: '',
                    subcategory: '',
                    image_url: '',
                    description_en: '',
                    description_ar: '',
                    benefits_en: '',
                    benefits_ar: '',
                    skin_types: '',
                    main_ingredients: '',
                    inci_list: ''
                });
                fetchProducts();
            } else {
                const error = await res.json();
                alert(`Error: ${error.message || 'Failed to add product'}`);
            }
        } catch (error) {
            alert('Error adding product');
            console.error(error);
        }
    };

    const handleAddPrice = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/admin/prices', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...priceForm,
                    price: parseFloat(priceForm.price)
                })
            });

            if (res.ok) {
                alert('Price added successfully!');
                setShowAddPrice(false);
                setPriceForm({
                    product_id: '',
                    retailer_id: '',
                    price: '',
                    url: '',
                    in_stock: true
                });
            } else {
                const error = await res.json();
                alert(`Error: ${error.message || 'Failed to add price'}`);
            }
        } catch (error) {
            alert('Error adding price');
            console.error(error);
        }
    };

    const handleLinkIngredient = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/admin/product-ingredients', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...ingredientForm,
                    concentration_percentage: ingredientForm.concentration_percentage
                        ? parseFloat(ingredientForm.concentration_percentage)
                        : null
                })
            });

            if (res.ok) {
                alert('Ingredient linked successfully!');
                setShowLinkIngredient(false);
                setIngredientForm({
                    product_id: '',
                    ingredient_id: '',
                    concentration_percentage: ''
                });
            } else {
                const error = await res.json();
                alert(`Error: ${error.message || 'Failed to link ingredient'}`);
            }
        } catch (error) {
            alert('Error linking ingredient');
            console.error(error);
        }
    };

    const handleDeleteProduct = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            const res = await fetch(`/api/admin/products/${id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                alert('Product deleted successfully!');
                fetchProducts();
            } else {
                alert('Error deleting product');
            }
        } catch (error) {
            alert('Error deleting product');
            console.error(error);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-gray-500">Loading products...</p>
            </div>
        );
    }

    return (
        <div>
            {/* Header with Actions */}
            <div className="mb-8 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                    Products Management
                </h2>
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowAddProduct(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        <Plus size={18} />
                        Add Product
                    </button>
                    <button
                        onClick={() => setShowAddPrice(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                        <DollarSign size={18} />
                        Add Price
                    </button>
                    <button
                        onClick={() => setShowLinkIngredient(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    >
                        <Tag size={18} />
                        Link Ingredient
                    </button>
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Product
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Brand
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Category
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Created
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {products.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <img
                                            src={product.image_url}
                                            alt={product.name_en}
                                            className="w-12 h-12 rounded object-cover"
                                        />
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {product.name_en}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {product.name_ar}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {product.brand}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{product.category}</div>
                                    <div className="text-xs text-gray-500">{product.subcategory}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(product.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => {
                                            setSelectedProduct(product);
                                            setPriceForm({ ...priceForm, product_id: product.id });
                                        }}
                                        className="text-blue-600 hover:text-blue-900 mr-3"
                                    >
                                        <DollarSign size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteProduct(product.id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add Product Modal */}
            {showAddProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-bold mb-4">Add New Product</h3>
                        <form onSubmit={handleAddProduct} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder="Name (English)"
                                    required
                                    value={productForm.name_en}
                                    onChange={(e) => setProductForm({ ...productForm, name_en: e.target.value })}
                                    className="px-3 py-2 border rounded-lg"
                                />
                                <input
                                    type="text"
                                    placeholder="Name (Arabic)"
                                    required
                                    value={productForm.name_ar}
                                    onChange={(e) => setProductForm({ ...productForm, name_ar: e.target.value })}
                                    className="px-3 py-2 border rounded-lg"
                                />
                                <input
                                    type="text"
                                    placeholder="Brand"
                                    required
                                    value={productForm.brand}
                                    onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                                    className="px-3 py-2 border rounded-lg"
                                />
                                <input
                                    type="text"
                                    placeholder="Category"
                                    required
                                    value={productForm.category}
                                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                                    className="px-3 py-2 border rounded-lg"
                                />
                                <input
                                    type="text"
                                    placeholder="Subcategory"
                                    value={productForm.subcategory}
                                    onChange={(e) => setProductForm({ ...productForm, subcategory: e.target.value })}
                                    className="px-3 py-2 border rounded-lg"
                                />
                                <input
                                    type="url"
                                    placeholder="Image URL"
                                    required
                                    value={productForm.image_url}
                                    onChange={(e) => setProductForm({ ...productForm, image_url: e.target.value })}
                                    className="px-3 py-2 border rounded-lg"
                                />
                            </div>
                            <textarea
                                placeholder="Description (English)"
                                value={productForm.description_en}
                                onChange={(e) => setProductForm({ ...productForm, description_en: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg"
                                rows={3}
                            />
                            <textarea
                                placeholder="Description (Arabic)"
                                value={productForm.description_ar}
                                onChange={(e) => setProductForm({ ...productForm, description_ar: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg"
                                rows={3}
                            />
                            <input
                                type="text"
                                placeholder="Main Ingredients (comma-separated)"
                                value={productForm.main_ingredients}
                                onChange={(e) => setProductForm({ ...productForm, main_ingredients: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg"
                            />
                            <textarea
                                placeholder="INCI List (full ingredient list)"
                                value={productForm.inci_list}
                                onChange={(e) => setProductForm({ ...productForm, inci_list: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg"
                                rows={4}
                            />
                            <div className="flex gap-3 justify-end">
                                <button
                                    type="button"
                                    onClick={() => setShowAddProduct(false)}
                                    className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Add Product
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Price Modal */}
            {showAddPrice && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 max-w-lg w-full">
                        <h3 className="text-xl font-bold mb-4">Add Price</h3>
                        <form onSubmit={handleAddPrice} className="space-y-4">
                            <select
                                required
                                value={priceForm.product_id}
                                onChange={(e) => setPriceForm({ ...priceForm, product_id: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg"
                            >
                                <option value="">Select Product</option>
                                {products.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.name_en} - {p.brand}
                                    </option>
                                ))}
                            </select>
                            <select
                                required
                                value={priceForm.retailer_id}
                                onChange={(e) => setPriceForm({ ...priceForm, retailer_id: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg"
                            >
                                <option value="">Select Retailer</option>
                                {retailers.map((r) => (
                                    <option key={r.id} value={r.id}>
                                        {r.name_en}
                                    </option>
                                ))}
                            </select>
                            <input
                                type="number"
                                step="0.001"
                                placeholder="Price (KWD)"
                                required
                                value={priceForm.price}
                                onChange={(e) => setPriceForm({ ...priceForm, price: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg"
                            />
                            <input
                                type="url"
                                placeholder="Product URL"
                                required
                                value={priceForm.url}
                                onChange={(e) => setPriceForm({ ...priceForm, url: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg"
                            />
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={priceForm.in_stock}
                                    onChange={(e) => setPriceForm({ ...priceForm, in_stock: e.target.checked })}
                                />
                                <span>In Stock</span>
                            </label>
                            <div className="flex gap-3 justify-end">
                                <button
                                    type="button"
                                    onClick={() => setShowAddPrice(false)}
                                    className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                >
                                    Add Price
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Link Ingredient Modal */}
            {showLinkIngredient && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 max-w-lg w-full">
                        <h3 className="text-xl font-bold mb-4">Link Ingredient to Product</h3>
                        <form onSubmit={handleLinkIngredient} className="space-y-4">
                            <select
                                required
                                value={ingredientForm.product_id}
                                onChange={(e) => setIngredientForm({ ...ingredientForm, product_id: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg"
                            >
                                <option value="">Select Product</option>
                                {products.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.name_en} - {p.brand}
                                    </option>
                                ))}
                            </select>
                            <select
                                required
                                value={ingredientForm.ingredient_id}
                                onChange={(e) => setIngredientForm({ ...ingredientForm, ingredient_id: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg"
                            >
                                <option value="">Select Ingredient</option>
                                {ingredients.map((i) => (
                                    <option key={i.id} value={i.id}>
                                        {i.name_en} ({i.name_ar})
                                    </option>
                                ))}
                            </select>
                            <input
                                type="number"
                                step="0.1"
                                placeholder="Concentration % (optional)"
                                value={ingredientForm.concentration_percentage}
                                onChange={(e) => setIngredientForm({ ...ingredientForm, concentration_percentage: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg"
                            />
                            <div className="flex gap-3 justify-end">
                                <button
                                    type="button"
                                    onClick={() => setShowLinkIngredient(false)}
                                    className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                                >
                                    Link Ingredient
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
