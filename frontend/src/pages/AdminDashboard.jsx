import React, { useState, useEffect, useContext, useCallback } from "react";
import api from "../utils/api";
import { AuthContext } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle, Edit2, Trash2, Users, ListCollapse, X, Loader } from "lucide-react";

const inputClass = "input w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-colors";


const EventForm = ({ form, handleChange, handleSubmit, setEditing, editing, isSubmitting }) => (
    <motion.form
        onSubmit={handleSubmit}
        key={editing ? "edit" : "create"}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.3 }}
        className="max-w-2xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/10"
    >
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 text-yellow-400">
            <PlusCircle size={28} /> {editing ? "Update Event" : "Create New Event"}
            {editing && (
                <button
                    type="button"
                    onClick={() => setEditing(null)}
                    className="ml-auto text-sm text-red-400 hover:text-red-300 transition flex items-center gap-1 p-2 border border-red-400/50 rounded-lg"
                >
                    <X size={16} /> Cancel Edit
                </button>
            )}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className={inputClass} required />
            <input name="location" value={form.location} onChange={handleChange} placeholder="Location" className={inputClass} required />
            <input name="date" type="datetime-local" value={form.date} onChange={handleChange} className={inputClass} required />
            <input name="price" type="number" step="0.01" value={form.price} onChange={handleChange} placeholder="Price" className={inputClass} required />
            <input name="total_seats" type="number" value={form.total_seats} onChange={handleChange} placeholder="Total Seats" className={inputClass} required />
            <input name="img" value={form.img} onChange={handleChange} placeholder="Image URL" className={inputClass} />
            <select name="category" value={form.category} className={`${inputClass} !text-white`} onChange={handleChange} required>
                <option value="" disabled className="text-gray-400 bg-gray-900">Select Category</option>
                {["Concert", "Workshop", "Seminar", "Conference", "Meetup", "Festival", "Sports", "Other"].map((cat) => (
                    <option key={cat} value={cat} className="bg-gray-900">{cat}</option>
                ))}
            </select>
            <div className="hidden md:block"></div> 
        </div>
        <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className={`${inputClass} mt-4 h-24`}
            required
        />
        <motion.button
            whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
            whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
            disabled={isSubmitting}
            className={`mt-6 w-full py-3 text-purple-900 font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-2 ${
                isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-yellow-400 hover:bg-yellow-300'
            }`}
        >
            {isSubmitting ? <Loader className="animate-spin" size={20} /> : null}
            {editing ? (isSubmitting ? "Updating..." : "Update Event") : (isSubmitting ? "Creating..." : "Create Event")}
        </motion.button>
    </motion.form>
);


const ManageEvents = ({ events, handleEdit, handleDelete }) => (
    <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.3 }}
        className="mt-4"
    >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
                {events.length === 0 ? (
                    <motion.p 
                        key="no-events" 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        className="col-span-full text-center text-lg text-gray-400 p-10 bg-white/5 rounded-xl"
                    >
                        No events found. Please create one using the "Create/Edit Event" tab.
                    </motion.p>
                ) : (
                    events.map((event) => (
                        <motion.div
                            key={event.id}
                            layout
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            whileHover={{ scale: 1.03, boxShadow: '0 0 20px rgba(252, 211, 77, 0.3)' }}
                            transition={{ type: "spring", stiffness: 120 }}
                            className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-lg transition"
                        >
                            {event.img && (
                                <img
                                    src={event.img}
                                    alt={event.title}
                                    className="rounded-xl w-full h-40 object-cover mb-4"
                                />
                            )}
                            <h3 className="font-bold text-xl text-yellow-300">{event.title}</h3>
                            <p className="text-sm text-gray-300 mb-2">{event.category} • {event.location}</p>
                            <p className="text-sm mb-2 font-mono text-white/80">{new Date(event.date).toLocaleString()}</p>
                            
                            <div className="text-sm mb-2">
                                Seats Available: <span className="font-semibold text-green-400">{event.available_seats}</span> / {event.total_seats}
                            </div>
                            <p className="text-sm mb-2 font-semibold">Price: ₹{event.price.toLocaleString('en-IN')}</p>
                            
                            <div className="flex justify-between mt-3 pt-3 border-t border-white/10">
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    onClick={() => handleEdit(event)}
                                    className="flex items-center gap-1 text-blue-400 hover:text-blue-300 font-medium"
                                >
                                    <Edit2 size={16} /> Edit
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    onClick={() => handleDelete(event.id)}
                                    className="flex items-center gap-1 text-red-400 hover:text-red-300 font-medium"
                                >
                                    <Trash2 size={16} /> Delete
                                </motion.button>
                            </div>
                        </motion.div>
                    ))
                )}
            </AnimatePresence>
        </div>
    </motion.div>
);


const UserManagement = () => (
    <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.3 }}
        className="max-w-xl mx-auto p-8 bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-white/10 text-center"
    >
        <Users size={48} className="text-purple-400 mx-auto mb-4" />
        <h3 className="text-2xl font-bold mb-3">User Management Section</h3>
        <p className="text-gray-300">
            This section is reserved for future implementation to view, edit, or delete user accounts and manage user roles.
        </p>
        <p className="mt-4 text-sm text-yellow-400">
            **Status:** API Integration Required for user data fetching.
        </p>
    </motion.div>
);


const AdminDashboard = () => {
    
    const { user, setUser } = useContext(AuthContext); 
    
    const [events, setEvents] = useState([]);
    const [activeTab, setActiveTab] = useState("manage");
    const [form, setForm] = useState({
        title: "", description: "", location: "", date: "",
        total_seats: 0, price: 0, img: "", category: "",
    });
    const [editing, setEditing] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loadingUser, setLoadingUser] = useState(true); 

    const defaultFormState = {
        title: "", description: "", location: "", date: "",
        total_seats: 0, price: 0, img: "", category: "",
    };

    const getConfig = useCallback(() => {
        const token = localStorage.getItem("token");
        if (!token) return null;
        return { headers: { Authorization: `Bearer ${token}` } };
    }, []);

    const fetchCurrentUser = useCallback(async () => {
        const config = getConfig();
        if (!config) {
            setLoadingUser(false);
            return null;
        }

        try {
            const res = await api.get("/api/users/me", config); 
            setUser(res.data);
            return res.data;
        } catch (error) {
            console.error("Failed to fetch current user (Token Invalid/Expired):", error);
            localStorage.removeItem("token");
            setUser(null);
            return null;
        } finally {
            setLoadingUser(false);
        }
    }, [getConfig, setUser]);
    
    const fetchEvents = useCallback(async (userOverride) => {
        const userToUse = userOverride || user;

        if (userToUse?.role !== "admin") return;
        
        try {
            const config = getConfig();
            if (!config) return;

            const res = await api.get("/api/events", config);
            setEvents(res.data);
        } catch (err) {
            console.error("Failed to fetch events:", err);
        }
    }, [getConfig, user]);


    useEffect(() => {
        const loadData = async () => {
            const fetchedUser = await fetchCurrentUser(); 

            if (fetchedUser?.role === 'admin') {
                fetchEvents(fetchedUser);
            }
        };

        if (!user) {
            loadData();
        } else if (user.role === 'admin') {
            setLoadingUser(false); 
            fetchEvents();
        } else {
             setLoadingUser(false);
        }
    }, [user, fetchCurrentUser, fetchEvents]);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        if (!form.title || !form.location || !form.date || Number(form.price) <= 0 || Number(form.total_seats) <= 0 || !form.category) {
            alert("Please fill all required fields correctly.");
            setIsSubmitting(false);
            return;
        }

        const config = getConfig(); 
        if (!config) {
             alert("You must be logged in to perform this action.");
             setIsSubmitting(false);
             return;
        }
        
        const eventData = {
            ...form,
            total_seats: Number(form.total_seats),
            price: Number(form.price),
            img: form.img || null,
            date: form.date ? new Date(form.date).toISOString() : null,
        };

        try {
            if (editing) await api.put(`/api/events/${editing}`, eventData, config);
            else await api.post("/api/events", eventData, config);

            setForm(defaultFormState);
            setEditing(null);
            
            await fetchEvents(user);
            setActiveTab("manage");
            
        } catch (err) {
            console.error("Event save failed:", err.response?.data || err);
            alert(`Error saving event: ${err.response?.data?.message || 'Check console for details.'}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (event) => {
        setForm({
            title: event.title,
            description: event.description,
            location: event.location,
            date: event.date ? new Date(event.date).toISOString().slice(0, 16) : "",
            total_seats: event.total_seats,
            price: event.price,
            img: event.img || "",
            category: event.category || "",
        });
        setEditing(event.id);
        setActiveTab("create"); 
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this event? This action cannot be undone.")) return;
        try {
            const config = getConfig(); 
            if (!config) return;

            await api.delete(`/api/events/${id}`, config);
            await fetchEvents(user);
        } catch (err) {
            console.error(err);
        }
    };


    if (loadingUser) {
        return (
             <div className="min-h-screen flex flex-col items-center justify-center text-white bg-black/80">
                <Loader className="w-10 h-10 animate-spin text-yellow-400" />
                <p className="text-xl mt-4">Checking Permissions...</p>
            </div>
        );
    }
    
    if (user?.role !== "admin") {
        return <div className="min-h-screen flex items-center justify-center text-white bg-black/80">
            <p className="text-xl text-red-500">Access Denied. You must be an administrator.</p>
        </div>
    }
    // --------------------------------------------------------------------------------

    const tabClasses = (tabName) => 
        `px-6 py-3 font-semibold rounded-t-xl transition-colors duration-300 flex items-center gap-2 ${
            activeTab === tabName 
                ? 'bg-white/20 text-yellow-400 border-b-2 border-yellow-400' 
                : 'bg-white/10 text-gray-300 hover:bg-white/15'
        }`;

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-black text-white p-6">
            <motion.h1
                initial={{ opacity: 0, y: -40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl font-extrabold text-center mb-8"
            >
                Admin Panel
            </motion.h1>

            <div className="max-w-6xl mx-auto mb-8 border-b border-white/20">
                <div className="flex justify-center flex-wrap">
                    <button onClick={() => setActiveTab("create")} className={tabClasses("create")}>
                        <PlusCircle size={20} /> Create/Edit Event
                    </button>
                    <button onClick={() => setActiveTab("manage")} className={tabClasses("manage")}>
                        <ListCollapse size={20} /> Manage Events
                    </button>
                    <button onClick={() => setActiveTab("users")} className={tabClasses("users")}>
                        <Users size={20} /> User Management
                    </button>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === "create" && (
                    <EventForm 
                        form={form} 
                        handleChange={handleChange} 
                        handleSubmit={handleSubmit} 
                        setEditing={setEditing} 
                        editing={editing} 
                        isSubmitting={isSubmitting}
                        key="form"
                    />
                )}
                {activeTab === "manage" && (
                    <ManageEvents 
                        events={events} 
                        handleEdit={handleEdit} 
                        handleDelete={handleDelete} 
                        key="manage"
                    />
                )}
                {activeTab === "users" && <UserManagement key="users" />}
            </AnimatePresence>
        </div>
    );
};

export default AdminDashboard;