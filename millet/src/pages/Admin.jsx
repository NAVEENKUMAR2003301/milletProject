import { useState } from 'react';
import { useProducts } from '../contexts/ProductContext';
import { useSound } from '../hooks/useSound';
import AdminGate from '../components/admin/AdminGate';
import AdminLayout from '../components/admin/AdminLayout';
import ProductForm from '../components/admin/ProductForm';
import ProductList from '../components/admin/ProductList';
import OrderList from '../components/admin/OrderList';
import FeedbackList from '../components/admin/FeedbackList';

function AdminInner() {
  const { products, loading, addProduct, updateProduct, removeProduct } = useProducts();
  const { play } = useSound();

  const [tab, setTab] = useState('products');
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleSave = async (payload) => {
    if (editing) {
      await updateProduct(editing.id, payload);
    } else {
      await addProduct(payload);
    }
    setEditing(null);
    setShowForm(false);
  };

  const handleEdit = (product) => {
    setEditing(product);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setEditing(null);
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    try {
      await removeProduct(id);
      play('success');
    } catch (err) {
      console.error(err);
      play('buzz');
    }
  };

  return (
    <AdminLayout activeTab={tab} onTabChange={setTab}>
      {tab === 'products' && (
        <div className="flex flex-col gap-4">
          {!showForm && (
            <button
              onClick={() => {
                play('click');
                setEditing(null);
                setShowForm(true);
              }}
              className="btn-primary self-start"
            >
              ➕ Add Product
            </button>
          )}

          {showForm && (
            <ProductForm
              editing={editing}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          )}

          <ProductList
            products={products}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      )}

      {tab === 'orders' && <OrderList />}
      {tab === 'feedback' && <FeedbackList />}
    </AdminLayout>
  );
}

export default function Admin() {
  return (
    <AdminGate>
      <AdminInner />
    </AdminGate>
  );
}