import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  BriefcaseBusiness,
  Check,
  Download,
  Edit3,
  Eye,
  ImagePlus,
  LogOut,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Plus,
  Search,
  ShieldCheck,
  ShoppingBag,
  Store,
  Tag,
  Trash2,
  Users,
  X,
} from 'lucide-react';
import './style.css';
import './enhancements.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
const types = {
  service: 'Services',
  product: 'Produits',
  business: 'Entreprises',
  job: 'Emplois',
  mission: 'Missions',
};

const moduleFields = {
  categories: ['name', 'slug', 'parent_id', 'active'],
  cities: ['name', 'province', 'country'],
  districts: ['city_id', 'name'],
  plans: ['name', 'price', 'currency', 'duration_days', 'active'],
  campaigns: ['advertiser_id', 'title', 'image_url', 'target_url', 'placement', 'status', 'starts_at', 'ends_at'],
  pages: ['slug', 'title', 'body', 'published'],
  announcements: ['title', 'body', 'published'],
  users: ['role', 'status'],
  payments: ['status', 'reference'],
  promotions: ['status', 'starts_at', 'ends_at'],
  reports: ['status'],
  messages: ['status'],
};

const adminLabels = {
  stats: 'Tableau de bord',
  listings: 'Annonces',
  users: 'Utilisateurs',
  categories: 'Catégories',
  cities: 'Villes',
  districts: 'Communes',
  plans: 'Formules',
  promotions: 'Promotions',
  campaigns: 'Publicités',
  payments: 'Paiements',
  reports: 'Signalements',
  pages: 'Pages du site',
  announcements: 'Communiqués',
  messages: 'Messages',
  finance: 'Finances',
  audit: 'Journal d’audit',
};

const fieldLabels = {
  active: 'Actif',
  address: 'Adresse',
  advertiser: 'Annonceur',
  advertiser_id: 'ID annonceur',
  amount: 'Montant',
  body: 'Contenu',
  campaign_id: 'ID campagne',
  category_id: 'Catégorie',
  city_id: 'Ville',
  clicks: 'Clics',
  country: 'Pays',
  created_at: 'Créé le',
  currency: 'Devise',
  description: 'Description',
  details: 'Détails',
  district_id: 'Commune',
  duration_days: 'Durée (jours)',
  email: 'E-mail',
  ends_at: 'Date de fin',
  featured_until: 'Mis en avant jusqu’au',
  id: 'ID',
  image_url: 'URL de l’image',
  impressions: 'Impressions',
  listing_id: 'Annonce',
  method: 'Mode de paiement',
  name: 'Nom',
  phone: 'Téléphone',
  placement: 'Emplacement',
  plan_id: 'Formule',
  price: 'Prix',
  province: 'Province',
  published: 'Publié',
  reason: 'Motif',
  reference: 'Référence',
  rejection_reason: 'Motif du rejet',
  reporter_id: 'ID signalant',
  role: 'Rôle',
  setting_key: 'Clé',
  setting_value: 'Valeur',
  slug: 'Identifiant URL',
  starts_at: 'Date de début',
  status: 'Statut',
  subject: 'Objet',
  title: 'Titre',
  total: 'Total',
  total_views: 'Vues',
  type: 'Type',
  updated_at: 'Modifié le',
  user_id: 'Utilisateur',
  verified_at: 'Vérifié le',
  verified_by: 'Vérifié par',
  views: 'Vues',
  whatsapp: 'WhatsApp',
};

const emptyDraft = () => ({
  title: '',
  description: '',
  type: 'service',
  category_id: 1,
  city_id: 1,
  price: '',
  currency: 'USD',
  phone: '',
  whatsapp: '',
  address: '',
  image_urls: [],
});

const moduleCreateFields = {
  listings: [
    { name: 'title', label: 'Titre', required: true, minLength: 5 },
    { name: 'description', label: 'Description', type: 'textarea', required: true, minLength: 15 },
    { name: 'type', label: 'Type', type: 'select', options: Object.entries(types).map(([value, label]) => ({ value, label })) },
    { name: 'category_id', label: 'Catégorie', type: 'select', source: 'categories', required: true },
    { name: 'city_id', label: 'Ville', type: 'select', source: 'cities', required: true },
    { name: 'price', label: 'Prix (facultatif)', type: 'number', min: 0 },
    { name: 'currency', label: 'Devise', type: 'select', options: [{ value: 'USD', label: 'USD' }, { value: 'CDF', label: 'CDF' }] },
    { name: 'phone', label: 'Téléphone', required: true, minLength: 6 },
    { name: 'whatsapp', label: 'WhatsApp' },
    { name: 'address', label: 'Adresse' },
  ],
  users: [
    { name: 'name', label: 'Nom complet', required: true, minLength: 2 },
    { name: 'email', label: 'Adresse e-mail', type: 'email', required: true },
    { name: 'password', label: 'Mot de passe temporaire', type: 'password', required: true, minLength: 10 },
    { name: 'role', label: 'Rôle', type: 'select', options: [{ value: 'user', label: 'Utilisateur' }, { value: 'moderator', label: 'Modérateur' }] },
    { name: 'status', label: 'Statut', type: 'select', options: [{ value: 'active', label: 'Actif' }, { value: 'suspended', label: 'Suspendu' }] },
  ],
  promotions: [
    { name: 'listing_id', label: 'Annonce', type: 'select', source: 'listings', required: true },
    { name: 'plan_id', label: 'Formule', type: 'select', source: 'plans', required: true },
  ],
  payments: [
    { name: 'user_id', label: 'Utilisateur', type: 'select', source: 'users', required: true },
    { name: 'amount', label: 'Montant', type: 'number', min: 0.01, required: true },
    { name: 'currency', label: 'Devise', type: 'select', options: [{ value: 'USD', label: 'USD' }, { value: 'CDF', label: 'CDF' }] },
    { name: 'method', label: 'Mode de paiement', defaultValue: 'manual', required: true },
    { name: 'reference', label: 'Référence' },
  ],
  reports: [
    { name: 'listing_id', label: 'Annonce', type: 'select', source: 'listings', required: true },
    { name: 'reason', label: 'Motif', required: true, minLength: 3 },
    { name: 'details', label: 'Détails', type: 'textarea' },
  ],
};

function App() {
  const [token, setToken] = useState(localStorage.getItem('joby_token') || '');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('joby_user') || 'null'));
  const [screen, setScreen] = useState('home');
  const [listings, setListings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [plans, setPlans] = useState([]);
  const [mine, setMine] = useState([]);
  const [promos, setPromos] = useState([]);
  const [selected, setSelected] = useState(null);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [q, setQ] = useState('');
  const [type, setType] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [authMode, setAuthMode] = useState('login');
  const [login, setLogin] = useState({ name: '', email: '', password: '' });
  const [draft, setDraft] = useState(emptyDraft);
  const [photoFiles, setPhotoFiles] = useState([]);
  const [photoInputKey, setPhotoInputKey] = useState(0);
  const [adminTab, setAdminTab] = useState('stats');
  const [adminRows, setAdminRows] = useState([]);
  const [adminListings, setAdminListings] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [recentAudit, setRecentAudit] = useState([]);
  const [edit, setEdit] = useState(null);
  const [sideOpen, setSideOpen] = useState(false);

  const request = async (path, options = {}) => {
    const isFormData = options.body instanceof FormData;
    const headers = {
      ...(!isFormData ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    };
    if (isFormData) delete headers['Content-Type'];
    const response = await fetch(API + path, { ...options, headers });
    const value = await response.json().catch(() => ({}));
    if (!response.ok) throw Error(value.error || 'Erreur réseau');
    return value;
  };

  const report = (exception) => {
    setError(exception.message || String(exception));
    setTimeout(() => setError(''), 6000);
  };

  const refresh = () => request(`/listings?q=${encodeURIComponent(q)}&type=${encodeURIComponent(type)}`)
    .then(setListings)
    .catch(report);

  useEffect(() => {
    refresh();
  }, [q, type]);

  useEffect(() => {
    request('/categories').then(setCategories).catch(report);
    request('/cities').then(setCities).catch(report);
    request('/plans').then(setPlans).catch(report);
  }, []);

  const loadAdmin = async (tab) => {
    setAdminTab(tab);
    setEdit(null);
    setSelectedAdmin(null);
    setAdminRows([]);
    try {
      if (tab === 'stats') {
        setStats(await request('/admin/stats'));
        if (user?.role === 'admin') {
          try {
            setRecentAudit((await request('/admin/audit')).slice(0, 5));
          } catch (exception) {
            report(exception);
          }
        } else {
          setRecentAudit([]);
        }
        return;
      }

      const endpoint = tab === 'listings'
        ? '/admin/listings'
        : tab === 'audit'
          ? '/admin/audit'
          : tab === 'finance'
            ? '/admin/finance'
            : `/admin/modules/${tab}`;
      const rows = await request(endpoint);
      setAdminRows(rows);

      if (tab === 'listings') setAdminListings(rows);
      if (['promotions', 'reports'].includes(tab)) setAdminListings(await request('/admin/listings'));
      if (tab === 'payments') setAdminUsers(await request('/admin/modules/users'));
    } catch (exception) {
      report(exception);
    }
  };

  const openAdminCreate = async (tab) => {
    await loadAdmin(tab);
    setEdit({});
  };

  const navigate = (nextScreen) => {
    setScreen(nextScreen);
    setSelected(null);
    setSelectedAdmin(null);
    setEdit(null);
    setNotice('');
    setError('');
    setSideOpen(false);
    if (nextScreen === 'user' && token) {
      request('/my/listings').then(setMine).catch(report);
      request('/my/promotions').then(setPromos).catch(report);
    }
    if (nextScreen === 'admin' && token) loadAdmin('stats');
  };

  const logged = (result) => {
    setToken(result.token);
    setUser(result.user);
    localStorage.setItem('joby_token', result.token);
    localStorage.setItem('joby_user', JSON.stringify(result.user));
    setScreen('home');
    setNotice('Connexion réussie');
  };

  const submitAuth = async (event) => {
    event.preventDefault();
    try {
      logged(await request(`/auth/${authMode}`, {
        method: 'POST',
        body: JSON.stringify(login),
      }));
    } catch (exception) {
      report(exception);
    }
  };

  const logout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('joby_token');
    localStorage.removeItem('joby_user');
    navigate('home');
  };

  const previewPhotos = useMemo(
    () => photoFiles.map((file) => ({ file, url: URL.createObjectURL(file) })),
    [photoFiles],
  );

  useEffect(() => () => {
    previewPhotos.forEach(({ url }) => URL.revokeObjectURL(url));
  }, [previewPhotos]);

  const handlePhotoSelection = (event) => {
    const files = Array.from(event.currentTarget.files || []);
    event.currentTarget.value = '';
    if (files.some((file) => !['image/jpeg', 'image/png', 'image/webp'].includes(file.type))) {
      report(new Error('Choisissez des images JPG, PNG ou WebP.'));
      return;
    }
    if (files.some((file) => file.size > 5 * 1024 * 1024)) {
      report(new Error('Chaque image doit faire 5 Mo maximum.'));
      return;
    }
    const remaining = 5 - draft.image_urls.length;
    if (files.length > remaining) {
      report(new Error('Vous pouvez joindre 5 photos au maximum au total.'));
      return;
    }
    setPhotoFiles(files.slice(0, remaining));
  };

  const uploadPhotos = async () => {
    if (!photoFiles.length) return [];
    const formData = new FormData();
    photoFiles.forEach((file) => formData.append('images', file));
    const result = await request('/my/uploads', { method: 'POST', body: formData });
    return result.image_urls;
  };

  const resetListingForm = () => {
    setDraft(emptyDraft());
    setPhotoFiles([]);
    setPhotoInputKey((key) => key + 1);
  };

  const submitListing = async (event) => {
    event.preventDefault();
    try {
      if (draft.image_urls.length + photoFiles.length > 5) {
        throw Error('Vous pouvez joindre 5 photos au maximum.');
      }
      const uploadedUrls = await uploadPhotos();
      const imageUrls = [...draft.image_urls, ...uploadedUrls];
      setDraft((current) => ({ ...current, image_urls: imageUrls }));
      setPhotoFiles([]);
      setPhotoInputKey((key) => key + 1);
      const body = {
        ...draft,
        category_id: Number(draft.category_id),
        city_id: Number(draft.city_id),
        price: draft.price === '' ? null : Number(draft.price),
        image_urls: imageUrls,
      };
      if (edit?.id) {
        await request(`/my/listings/${edit.id}`, { method: 'PUT', body: JSON.stringify(body) });
      } else {
        await request('/my/listings', { method: 'POST', body: JSON.stringify(body) });
      }
      setEdit(null);
      resetListingForm();
      navigate('user');
      setNotice('Annonce enregistrée. Elle attend la validation.');
    } catch (exception) {
      report(exception);
    }
  };

  const setStatus = async (row, status) => {
    try {
      if (adminTab === 'listings') {
        await request(`/admin/listings/${row.id}/status`, {
          method: 'PATCH',
          body: JSON.stringify({ status }),
        });
      } else {
        await request(`/admin/modules/${adminTab}/${row.id}`, {
          method: 'PATCH',
          body: JSON.stringify({ status }),
        });
      }
      await loadAdmin(adminTab);
      setNotice('Statut mis à jour.');
    } catch (exception) {
      report(exception);
    }
  };

  const saveAdmin = async (event) => {
    event.preventDefault();
    try {
      const data = Object.fromEntries(new FormData(event.currentTarget).entries());
      for (const [key, value] of Object.entries(data)) {
        if (value === '') data[key] = null;
      }

      const numericFields = ['category_id', 'city_id', 'district_id', 'duration_days', 'advertiser_id', 'listing_id', 'plan_id', 'user_id', 'parent_id'];
      numericFields.forEach((field) => {
        if (data[field] !== undefined && data[field] !== null) data[field] = Number(data[field]);
      });
      ['active', 'published'].forEach((field) => {
        if (data[field] !== undefined && data[field] !== null) data[field] = data[field] === 'true';
      });
      if (data.price !== undefined && data.price !== null && data.price !== '') data.price = Number(data.price);
      if (data.amount !== undefined && data.amount !== null && data.amount !== '') data.amount = Number(data.amount);
      if (adminTab === 'listings' && !edit?.id) {
        data.price = data.price === '' ? null : data.price;
        data.image_urls = [];
      }

      const createEndpoints = {
        listings: '/admin/listings',
        users: '/admin/users',
        promotions: '/admin/promotions',
        payments: '/admin/payments',
        reports: '/admin/reports',
      };
      const endpoint = edit?.id
        ? `/admin/modules/${adminTab}/${edit.id}`
        : createEndpoints[adminTab] || `/admin/modules/${adminTab}`;
      await request(endpoint, {
        method: edit?.id ? 'PATCH' : 'POST',
        body: JSON.stringify(data),
      });
      setEdit(null);
      await loadAdmin(adminTab);
      setNotice(edit?.id ? 'Modifications enregistrées.' : 'Élément ajouté.');
    } catch (exception) {
      report(exception);
    }
  };

  const deleteAdmin = async (row) => {
    if (!window.confirm('Supprimer cet élément ? Cette action est définitive.')) return;
    try {
      await request(`/admin/modules/${adminTab}/${row.id}`, { method: 'DELETE' });
      await loadAdmin(adminTab);
      setNotice('Élément supprimé.');
    } catch (exception) {
      report(exception);
    }
  };

  const exportFinance = () => {
    const columns = Object.keys(adminRows[0] || {});
    if (!columns.length) return report(new Error('Aucune donnée financière à exporter.'));
    const escapeCell = (value) => {
      const text = value == null ? '' : String(value);
      const safeText = /^[=+\-@\t\r]/.test(text) ? `'${text}` : text;
      return `"${safeText.replaceAll('"', '""')}"`;
    };
    const csv = [
      columns.map(escapeCell).join(','),
      ...adminRows.map((row) => columns.map((column) => escapeCell(row[column])).join(',')),
    ].join('\r\n');
    const url = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'joby-finances.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const openListingDetail = async (id) => {
    try {
      setSelected(await request(`/listings/${id}`));
    } catch (exception) {
      report(exception);
    }
  };

  const beginEditListing = (listing) => {
    setDraft({
      ...emptyDraft(),
      ...listing,
      price: listing.price ?? '',
      image_urls: listing.image_urls || [],
    });
    setPhotoFiles([]);
    setEdit(listing);
    setScreen('publish');
  };

  const newListing = () => {
    resetListingForm();
    setEdit(null);
    navigate('publish');
  };

  const moduleFieldOptions = (field) => {
    if (field === 'role') return [{ value: 'user', label: 'Utilisateur' }, { value: 'moderator', label: 'Modérateur' }, { value: 'admin', label: 'Administrateur' }];
    if (field === 'currency') return [{ value: 'USD', label: 'USD' }, { value: 'CDF', label: 'CDF' }];
    if (field === 'active') return [{ value: 'true', label: 'Oui' }, { value: 'false', label: 'Non' }];
    if (field === 'published') return [{ value: 'false', label: 'Non' }, { value: 'true', label: 'Oui' }];
    if (field === 'status') {
      const statuses = {
        users: [['active', 'Actif'], ['suspended', 'Suspendu']],
        payments: [['pending', 'En attente'], ['verified', 'Vérifié'], ['rejected', 'Rejeté']],
        promotions: [['requested', 'Demandée'], ['active', 'Active'], ['rejected', 'Rejetée'], ['expired', 'Expirée']],
        reports: [['open', 'Ouvert'], ['reviewing', 'En cours'], ['resolved', 'Résolu'], ['dismissed', 'Classé']],
        messages: [['new', 'Nouveau'], ['read', 'Lu'], ['closed', 'Clos']],
        campaigns: [['draft', 'Brouillon'], ['active', 'Active'], ['paused', 'En pause'], ['ended', 'Terminée']],
      };
      return (statuses[adminTab] || []).map(([value, label]) => ({ value, label }));
    }
    if (field === 'type' && adminTab !== 'listings') return Object.entries(types).map(([value, label]) => ({ value, label }));
    if (field === 'placement') return ['home', 'search', 'sidebar'].map((value) => ({ value, label: value }));
    return null;
  };

  const renderField = (field, current = null) => {
    const descriptor = typeof field === 'string' ? { name: field } : field;
    const { name, label = fieldLabels[name] || name, required, minLength, min, type: inputType = 'text' } = descriptor;
    let options = descriptor.options || moduleFieldOptions(name);
    if (descriptor.source === 'categories') options = categories.map((item) => ({ value: item.id, label: item.name }));
    if (descriptor.source === 'cities') options = cities.map((item) => ({ value: item.id, label: item.name }));
    if (descriptor.source === 'listings') options = adminListings.map((item) => ({ value: item.id, label: `#${item.id} — ${item.title}` }));
    if (descriptor.source === 'plans') options = plans.map((item) => ({ value: item.id, label: `${item.name} (${item.price} ${item.currency})` }));
    if (descriptor.source === 'users') options = adminUsers.map((item) => ({ value: item.id, label: `${item.name} — ${item.email}` }));

    const currentValue = current?.[name] ?? descriptor.defaultValue ?? (options?.[0]?.value ?? '');
    const defaultValue = options
      ? (options.some((option) => String(option.value) === String(currentValue))
        ? String(currentValue)
        : (currentValue === true || currentValue === 1 ? 'true' : currentValue === false || currentValue === 0 ? 'false' : ''))
      : currentValue;

    return (
      <label key={name}>
        {label}
        {options ? (
          <select name={name} defaultValue={defaultValue} required={required}>
            {options.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        ) : inputType === 'textarea' ? (
          <textarea name={name} rows={4} defaultValue={defaultValue} required={required} minLength={minLength} />
        ) : (
          <input
            name={name}
            type={inputType}
            defaultValue={defaultValue}
            required={required}
            minLength={minLength}
            min={min}
          />
        )}
      </label>
    );
  };

  const canCreate = ['listings', 'users', 'promotions', 'payments', 'reports'].includes(adminTab)
    || (moduleFields[adminTab] && !['users', 'payments', 'promotions', 'reports', 'messages'].includes(adminTab));
  const canDelete = ['categories', 'cities', 'districts', 'plans', 'campaigns', 'pages', 'announcements'].includes(adminTab);
  const createFields = moduleCreateFields[adminTab] || moduleFields[adminTab] || [];
  const cards = [
    { key: 'service', icon: BriefcaseBusiness },
    { key: 'product', icon: ShoppingBag },
    { key: 'business', icon: Store },
    { key: 'job', icon: Users },
    { key: 'mission', icon: Tag },
  ];

  return (
    <>
      <header className="topbar">
        <div className="container header">
          <button className="brand" aria-label="Retour à l’accueil Joby" onClick={() => navigate('home')}>
            <span className="brand-logo" role="img" aria-label="Logo Joby" />
          </button>
          <nav className={sideOpen ? 'open' : ''}>
            <button onClick={() => navigate('home')}>Accueil</button>
            <button onClick={() => { navigate('home'); setType('service'); }}>Services</button>
            <button onClick={() => { navigate('home'); setType('product'); }}>Produits</button>
            <button onClick={() => { navigate('home'); setType('job'); }}>Emplois</button>
            {user && <button onClick={() => navigate('user')}>Mon espace</button>}
            {['admin', 'moderator'].includes(user?.role) && <button onClick={() => navigate('admin')}>Administration</button>}
          </nav>
          <div className="header-actions">
            {user ? (
              <>
                <span className="user-chip">{user.name}</span>
                <button className="icon-btn" title="Déconnexion" onClick={logout}><LogOut size={19} /></button>
              </>
            ) : (
              <button className="button ghost" onClick={() => navigate('auth')}>Connexion</button>
            )}
            <button className="button primary" onClick={() => user ? newListing() : navigate('auth')}>
              <Plus size={17} /> Publier une annonce
            </button>
            <button className="icon-btn hamburger" aria-label="Ouvrir le menu" onClick={() => setSideOpen(!sideOpen)}><Menu /></button>
          </div>
        </div>
      </header>

      {error && <div className="toast bad" role="alert">{error}</div>}
      {notice && <div className="toast" role="status">{notice}<button onClick={() => setNotice('')}>×</button></div>}

      {screen === 'home' && (
        <>
          <section className="hero">
            <div className="container hero-grid">
              <div>
                <div className="eyebrow"><span className="online" /> La plateforme locale de Goma</div>
                <h1>Les bonnes opportunités sont <span>juste à côté.</span></h1>
                <p>Découvrez des services, des produits, des entreprises et des emplois près de chez vous. Joby vous connecte aux bonnes personnes.</p>
                <div className="searchbox">
                  <Search color="#0054cb" size={23} />
                  <input placeholder="Que recherchez-vous à Goma ?" value={q} onChange={(event) => setQ(event.target.value)} />
                  <button className="button primary" onClick={refresh}>Rechercher</button>
                </div>
                <div className="hero-notes">
                  <span><MapPin size={16} /> Goma, RD Congo</span>
                  <span>✓ Annonces gratuites</span>
                  <span>✓ Contact direct WhatsApp</span>
                </div>
              </div>
              <div className="hero-visual">
                <div className="orb one" />
                <div className="orb two" />
                <div className="visual-card big">
                  <Store size={31} />
                  <strong>Votre activité mérite d’être vue.</strong>
                  <p>Des milliers d’opportunités commencent par une rencontre.</p>
                  <button onClick={() => user ? newListing() : navigate('auth')}>Publier maintenant <ArrowRight size={16} /></button>
                </div>
                <div className="visual-card floating">
                  <span>✦</span>
                  <div><strong>Services à proximité</strong><small>Trouvez les bons professionnels</small></div>
                </div>
              </div>
            </div>
          </section>
          <main className="container">
            <div className="section-head">
              <div><span className="kicker">EXPLORER JOBY</span><h2>Qu’est-ce qui vous intéresse ?</h2></div>
            </div>
            <div className="category-grid">
              {cards.map(({ key, icon: Icon }) => (
                <button key={key} className={`category ${type === key ? 'active' : ''}`} onClick={() => setType(type === key ? '' : key)}>
                  <Icon size={29} /><b>{types[key]}</b><span>Découvrir <ArrowRight size={14} /></span>
                </button>
              ))}
            </div>
            <div className="section-head listings-header">
              <div><span className="kicker">DÉCOUVERTES LOCALES</span><h2>Les annonces à découvrir</h2><p>Parcourez les dernières publications disponibles.</p></div>
              <button className="link" onClick={() => setType('')}>Toutes les annonces <ArrowRight size={16} /></button>
            </div>
            <div className="listing-grid">
              {listings.map((item) => (
                <article className="listing-card" key={item.id}>
                  <div className="listing-photo">
                    {item.image_url ? <img src={item.image_url} alt={item.title} /> : <span>{item.type === 'product' ? '🛍️' : item.type === 'job' ? '💼' : item.type === 'business' ? '🏪' : '🔧'}</span>}
                    {item.featured_until && new Date(item.featured_until) > new Date() && <span className="sponsor">À la une</span>}
                  </div>
                  <div className="listing-body">
                    <small className="tag">{types[item.type]} · {item.category}</small>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <div className="location"><MapPin size={15} />{item.city} · {item.advertiser}</div>
                    <div className="card-bottom">
                      <strong>{item.price != null ? `${Number(item.price).toLocaleString('fr-FR')} ${item.currency}` : 'À discuter'}</strong>
                      <button className="round-btn" aria-label={`Voir ${item.title}`} onClick={() => openListingDetail(item.id)}><ArrowRight size={18} /></button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            {listings.length === 0 && <div className="empty">Aucune annonce publiée pour cette recherche. Soyez le premier à publier !</div>}
          </main>
          <section className="cta">
            <div className="container cta-inner">
              <div><span>FAITES GRANDIR VOTRE ACTIVITÉ</span><h2>Votre prochaine opportunité commence ici.</h2><p>Publiez gratuitement une annonce et faites-vous découvrir à Goma.</p></div>
              <button className="button white" onClick={() => user ? newListing() : navigate('auth')}>Publier gratuitement <ArrowRight size={19} /></button>
            </div>
          </section>
        </>
      )}

      {screen === 'auth' && (
        <main className="auth-wrap">
          <div className="auth-intro">
            <span className="brand-logo auth-brand-logo" role="img" aria-label="Logo Joby" />
            <h1>Rejoignez les opportunités de Goma.</h1>
            <p>Une plateforme, une communauté, de nouvelles possibilités.</p>
          </div>
          <form className="panel auth-panel" onSubmit={submitAuth}>
            <h2>{authMode === 'login' ? 'Bon retour sur Joby' : 'Créer mon compte'}</h2>
            <p>{authMode === 'login' ? 'Connectez-vous à votre espace personnel.' : 'Publiez des annonces et développez votre visibilité.'}</p>
            {authMode === 'register' && <label>Nom complet<input required minLength="2" value={login.name} onChange={(event) => setLogin({ ...login, name: event.target.value })} /></label>}
            <label>Adresse e-mail<input type="email" required value={login.email} onChange={(event) => setLogin({ ...login, email: event.target.value })} /></label>
            <label>Mot de passe<input type="password" minLength={authMode === 'register' ? 10 : 1} required value={login.password} onChange={(event) => setLogin({ ...login, password: event.target.value })} /></label>
            <button className="button primary block">{authMode === 'login' ? 'Se connecter' : 'S’inscrire'}</button>
            <p className="small-center">
              {authMode === 'login' ? 'Pas encore de compte ?' : 'Déjà inscrit ?'}
              {' '}
              <button type="button" className="link" onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}>
                {authMode === 'login' ? 'Créer un compte' : 'Se connecter'}
              </button>
            </p>
          </form>
        </main>
      )}

      {screen === 'publish' && (
        <main className="container inner-page">
          <div className="page-heading">
            <span className="kicker">ESPACE ANNONCEUR</span>
            <h1>{edit ? 'Modifier mon annonce' : 'Publier une annonce gratuite'}</h1>
            <p>Votre publication sera visible après validation par l’équipe Joby.</p>
          </div>
          <form className="panel publish-form" onSubmit={submitListing}>
            <label>Titre de l’annonce<input required minLength="5" value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} /></label>
            <div className="two">
              <label>Type<select value={draft.type} onChange={(event) => setDraft({ ...draft, type: event.target.value })}>{Object.entries(types).map(([key, label]) => <option value={key} key={key}>{label}</option>)}</select></label>
              <label>Catégorie<select value={draft.category_id} onChange={(event) => setDraft({ ...draft, category_id: event.target.value })}>{categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
            </div>
            <label>Description<textarea rows="5" required minLength="15" value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} /></label>
            <div className="two">
              <label>Prix (facultatif)<input type="number" min="0" step="0.01" value={draft.price} onChange={(event) => setDraft({ ...draft, price: event.target.value })} /></label>
              <label>Devise<select value={draft.currency} onChange={(event) => setDraft({ ...draft, currency: event.target.value })}><option>USD</option><option>CDF</option></select></label>
            </div>
            <div className="two">
              <label>Ville<select value={draft.city_id} onChange={(event) => setDraft({ ...draft, city_id: event.target.value })}>{cities.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}</select></label>
              <label>Quartier / Adresse<input value={draft.address || ''} onChange={(event) => setDraft({ ...draft, address: event.target.value })} /></label>
            </div>
            <div className="two">
              <label>Téléphone<input required minLength="6" value={draft.phone} onChange={(event) => setDraft({ ...draft, phone: event.target.value })} /></label>
              <label>WhatsApp<input value={draft.whatsapp || ''} onChange={(event) => setDraft({ ...draft, whatsapp: event.target.value })} /></label>
            </div>
            <label>URLs des photos (facultatif, une URL par ligne)<textarea rows="3" placeholder="https://..." value={draft.image_urls.join('\n')} onChange={(event) => {
              const urls = event.target.value.split('\n').map((url) => url.trim()).filter(Boolean);
              if (urls.length + photoFiles.length > 5) report(new Error('Vous pouvez joindre 5 photos au maximum au total.'));
              setDraft({ ...draft, image_urls: urls.slice(0, 5 - photoFiles.length) });
            }} /></label>
            <div className="photo-upload">
              <label className="file-picker" htmlFor="listing-photos"><ImagePlus size={18} /> Choisir des photos sur cet appareil</label>
              <input key={photoInputKey} id="listing-photos" className="visually-hidden" type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={handlePhotoSelection} />
              <small>JPG, PNG ou WebP · 5 Mo maximum par photo · 5 photos au total</small>
              {previewPhotos.length > 0 && (
                <div className="photo-previews">
                  {previewPhotos.map(({ file, url }, index) => (
                    <div className="photo-preview" key={`${file.name}-${index}`}>
                      <img src={url} alt={file.name} />
                      <span title={file.name}>{file.name}</span>
                      <button type="button" className="action-button action-delete" aria-label={`Retirer ${file.name}`} onClick={() => setPhotoFiles(photoFiles.filter((_, fileIndex) => fileIndex !== index))}><X size={15} /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="actioncell">
              <button className="button primary">{edit ? 'Enregistrer les modifications' : 'Soumettre pour validation'}</button>
              <button type="button" className="button ghost" onClick={() => navigate('user')}>Annuler</button>
            </div>
          </form>
        </main>
      )}

      {screen === 'user' && (
        <main className="container inner-page">
          <div className="page-heading"><span className="kicker">MON ESPACE</span><h1>Bonjour, {user?.name} 👋</h1><p>Gérez vos annonces, vos promotions et votre activité.</p></div>
          <div className="stats-grid">
            <div className="stat"><span>Annonces</span><strong>{mine.length}</strong></div>
            <div className="stat"><span>Publiées</span><strong>{mine.filter((item) => item.status === 'published').length}</strong></div>
            <div className="stat"><span>En attente</span><strong>{mine.filter((item) => item.status === 'pending').length}</strong></div>
            <div className="stat"><span>Promotions</span><strong>{promos.length}</strong></div>
          </div>
          <div className="section-head"><h2>Mes annonces</h2><button className="button primary" onClick={newListing}><Plus size={16} /> Ajouter une annonce</button></div>
          <div className="panel table-scroll">
            <table>
              <thead><tr><th>Annonce</th><th>Statut</th><th>Vues</th><th>Actions</th></tr></thead>
              <tbody>
                {mine.map((item) => (
                  <tr key={item.id}>
                    <td><b>{item.title}</b><small>{types[item.type]}</small></td>
                    <td><span className={`status ${item.status}`}>{item.status}</span></td>
                    <td>{item.views}</td>
                    <td className="actioncell">
                      <button className="action-button action-edit" title="Modifier" onClick={() => beginEditListing(item)}><Edit3 size={17} /></button>
                      <button className="action-button action-delete" title="Masquer" onClick={async () => {
                        if (!window.confirm('Masquer cette annonce ?')) return;
                        try {
                          await request(`/my/listings/${item.id}`, { method: 'DELETE' });
                          navigate('user');
                        } catch (exception) {
                          report(exception);
                        }
                      }}><Trash2 size={17} /></button>
                      <button className="action-button action-view" title="Demander une promotion" onClick={async () => {
                        try {
                          const plan = plans[0];
                          if (!plan) throw Error('Aucune formule disponible');
                          await request('/my/promotions', { method: 'POST', body: JSON.stringify({ listing_id: item.id, plan_id: plan.id }) });
                          await request('/my/listings').then(setMine);
                          await request('/my/promotions').then(setPromos);
                          setNotice('Demande de promotion envoyée : paiement manuel à confirmer.');
                        } catch (exception) {
                          report(exception);
                        }
                      }}><Tag size={17} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!mine.length && <p className="empty">Vous n’avez pas encore publié d’annonce.</p>}
          </div>
        </main>
      )}

      {screen === 'admin' && (
        <main className="container admin-layout">
          <aside className="admin-side">
            <div className="admin-label"><ShieldCheck size={20} /> Administration</div>
            {Object.entries(adminLabels)
              .filter(([key]) => user?.role === 'admin' || ['stats', 'listings', 'reports', 'messages'].includes(key))
              .map(([key, label]) => <button key={key} className={adminTab === key ? 'selected' : ''} onClick={() => loadAdmin(key)}>{label}</button>)}
          </aside>
          <div className="admin-content">
            <div className="page-heading">
              <span className="kicker">CENTRE DE CONTRÔLE</span>
              <h1>{adminTab === 'stats' ? 'Vue d’ensemble' : adminLabels[adminTab]}</h1>
              <p>Gestion des données réelles de la plateforme Joby.</p>
            </div>
            {adminTab === 'stats' ? (
              <>
                <div className="stats-grid admin-stats-grid">
                  {[
                    ['Utilisateurs', stats?.users],
                    ['Annonces', stats?.listings],
                    ['Publiées', stats?.active],
                    ['À modérer', stats?.pending],
                    ['Revenus vérifiés (USD)', stats?.revenueUSD],
                  ].map(([label, value]) => <div className="stat" key={label}><span>{label}</span><strong>{value ?? '…'}</strong></div>)}
                </div>
              <div className="dashboard-bottom">
                {user?.role === 'admin' && (
                  <section className="panel dashboard-card">
                    <div className="dashboard-card-header">
                      <div><span className="kicker">SUIVI</span><h2>Activité récente</h2></div>
                      <button className="link" onClick={() => loadAdmin('audit')}>Journal d’audit <ArrowRight size={15} /></button>
                    </div>
                    {recentAudit.length ? (
                      <ul className="audit-preview">
                        {recentAudit.map((entry) => (
                          <li key={entry.id}>
                            <span className="activity-dot" />
                            <div><b>{entry.action} · {entry.entity}</b><small>{entry.actor || 'Système'} · {new Date(entry.created_at).toLocaleString('fr-FR')}</small></div>
                          </li>
                        ))}
                      </ul>
                    ) : <p className="admin-help">Aucune action administrative récente.</p>}
                  </section>
                )}
                <section className="panel dashboard-card">
                  <div className="dashboard-card-header">
                    <div><span className="kicker">GESTION</span><h2>Actions rapides</h2></div>
                  </div>
                  <div className="quick-actions">
                    <button className="quick-action" onClick={() => openAdminCreate('listings')}><Plus size={17} /> Nouvelle annonce</button>
                    {user?.role === 'admin' && (
                      <>
                        <button className="quick-action" onClick={() => openAdminCreate('users')}><Users size={17} /> Nouvel utilisateur</button>
                        <button className="quick-action" onClick={() => openAdminCreate('payments')}><Plus size={17} /> Ajouter un paiement</button>
                        <button className="quick-action" onClick={() => openAdminCreate('reports')}><Plus size={17} /> Ajouter un signalement</button>
                        <button className="quick-action" onClick={() => loadAdmin('finance')}><ArrowRight size={17} /> Voir les finances</button>
                      </>
                    )}
                    {user?.role !== 'admin' && <button className="quick-action" onClick={() => loadAdmin('reports')}><ArrowRight size={17} /> Voir les signalements</button>}
                  </div>
                </section>
              </div>
              </>
            ) : (
              <>
                <div className="admin-toolbar">
                  <p>{adminRows.length} enregistrement(s)</p>
                  <div className="admin-toolbar-actions">
                    {adminTab === 'finance' && <button className="button secondary" onClick={exportFinance}><Download size={16} /> Exporter CSV</button>}
                    {adminTab === 'finance' && <button className="button ghost" onClick={() => openAdminCreate('payments')}><Plus size={16} /> Ajouter un paiement</button>}
                    {canCreate && <button className="button primary" onClick={() => setEdit({})}><Plus size={16} /> Nouvel élément</button>}
                  </div>
                </div>
                {adminTab === 'finance' && <p className="admin-help">Les rapports financiers sont calculés à partir des paiements vérifiés. Un nouvel encaissement se crée comme paiement manuel en attente.</p>}
                {adminTab === 'payments' && <p className="admin-help">Un paiement créé ici reste « en attente » jusqu’à sa vérification manuelle.</p>}
                {edit && (
                  <form className="panel admin-form" onSubmit={saveAdmin}>
                    <h3>{edit.id ? 'Modifier' : 'Ajouter'} — {adminLabels[adminTab]}</h3>
                    <div className="two">
                      {createFields.map((field) => renderField(field, edit))}
                    </div>
                    <div className="actioncell">
                      <button className="button primary">{edit.id ? 'Enregistrer les modifications' : 'Ajouter'}</button>
                      <button type="button" className="button ghost" onClick={() => setEdit(null)}>Annuler</button>
                    </div>
                  </form>
                )}
                <div className="panel table-scroll">
                  <table>
                    <thead>
                      <tr>
                        {Object.keys(adminRows[0] || {}).slice(0, 7).map((field) => <th key={field}>{fieldLabels[field] || field}</th>)}
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {adminRows.map((row, index) => (
                        <tr key={row.id ?? index}>
                          {Object.keys(adminRows[0] || {}).slice(0, 7).map((field) => (
                            <td key={field}>{row[field] == null ? '—' : typeof row[field] === 'object' ? JSON.stringify(row[field]) : String(row[field]).slice(0, 75)}</td>
                          ))}
                          <td className="actioncell">
                            <button className="action-button action-view" title="Voir les détails" aria-label="Voir les détails" onClick={() => setSelectedAdmin(row)}><Eye size={17} /></button>
                            {adminTab === 'listings' && (
                              <>
                                {row.status !== 'published' && <button className="action-button action-success" title="Publier" aria-label="Publier" onClick={() => setStatus(row, 'published')}><Check size={17} /></button>}
                                {row.status !== 'rejected' && <button className="action-button action-delete" title="Rejeter" aria-label="Rejeter" onClick={() => setStatus(row, 'rejected')}><X size={17} /></button>}
                              </>
                            )}
                            {adminTab === 'users' && <button className={`action-button ${row.status === 'active' ? 'action-warning' : 'action-success'}`} title={row.status === 'active' ? 'Suspendre' : 'Réactiver'} aria-label={row.status === 'active' ? 'Suspendre' : 'Réactiver'} onClick={() => setStatus(row, row.status === 'active' ? 'suspended' : 'active')}>{row.status === 'active' ? <X size={17} /> : <Check size={17} />}</button>}
                            {adminTab === 'payments' && row.status === 'pending' && (
                              <>
                                <button className="action-button action-success" title="Vérifier le paiement" aria-label="Vérifier le paiement" onClick={() => setStatus(row, 'verified')}><Check size={17} /></button>
                                <button className="action-button action-delete" title="Rejeter le paiement" aria-label="Rejeter le paiement" onClick={() => setStatus(row, 'rejected')}><X size={17} /></button>
                              </>
                            )}
                            {adminTab === 'promotions' && row.status === 'requested' && (
                              <>
                                <button className="action-button action-success" title="Activer" aria-label="Activer" onClick={() => setStatus(row, 'active')}><Check size={17} /></button>
                                <button className="action-button action-delete" title="Rejeter" aria-label="Rejeter" onClick={() => setStatus(row, 'rejected')}><X size={17} /></button>
                              </>
                            )}
                            {adminTab === 'reports' && row.status === 'open' && <button className="action-button action-success" title="Marquer comme résolu" aria-label="Marquer comme résolu" onClick={() => setStatus(row, 'resolved')}><Check size={17} /></button>}
                            {moduleFields[adminTab] && <button className="action-button action-edit" title="Modifier" aria-label="Modifier" onClick={() => setEdit(row)}><Edit3 size={17} /></button>}
                            {canDelete && <button className="action-button action-delete" title="Supprimer" aria-label="Supprimer" onClick={() => deleteAdmin(row)}><Trash2 size={17} /></button>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {adminRows.length === 0 && <div className="empty">Aucune donnée dans ce module.</div>}
                </div>
              </>
            )}
          </div>
        </main>
      )}

      {selected && (
        <div className="modal-backdrop" onClick={() => setSelected(null)}>
          <div className="modal" onClick={(event) => event.stopPropagation()}>
            <button className="modal-close" aria-label="Fermer" onClick={() => setSelected(null)}>×</button>
            <span className="kicker">{types[selected.type]} · {selected.city}</span>
            <h2>{selected.title}</h2>
            <p>{selected.description}</p>
            <p><b>Annonceur :</b> {selected.advertiser}</p>
            <p><b>Prix :</b> {selected.price ?? 'À discuter'} {selected.price != null && selected.currency}</p>
            {selected.images?.length > 0 && <img className="detail-img" src={selected.images[0].image_url} alt={selected.title} />}
            <div className="actioncell">
              <a className="button primary" href={`tel:${selected.phone}`}><Phone size={16} /> Appeler</a>
              {selected.whatsapp && <a className="button green" target="_blank" rel="noreferrer" href={`https://wa.me/${selected.whatsapp.replace(/[^0-9]/g, '')}`}><MessageCircle size={16} /> WhatsApp</a>}
            </div>
          </div>
        </div>
      )}

      {selectedAdmin && (
        <div className="modal-backdrop" onClick={() => setSelectedAdmin(null)}>
          <div className="modal admin-detail-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
            <button className="modal-close" aria-label="Fermer" onClick={() => setSelectedAdmin(null)}>×</button>
            <span className="kicker">{adminLabels[adminTab]}</span>
            <h2>{selectedAdmin.title || selectedAdmin.name || `Élément #${selectedAdmin.id ?? ''}`}</h2>
            <dl className="detail-list">
              {Object.entries(selectedAdmin).map(([field, value]) => (
                <div key={field}>
                  <dt>{fieldLabels[field] || field}</dt>
                  <dd>{value == null ? '—' : typeof value === 'object' ? <pre>{JSON.stringify(value, null, 2)}</pre> : String(value)}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      )}

      <footer>
        <div className="container foot">
          <div><strong>Joby.</strong><p>Trouvez. Vendez. Connectez.</p></div>
          <p>Goma, République démocratique du Congo</p>
          <p>© {new Date().getFullYear()} Joby. Tous droits réservés.</p>
        </div>
      </footer>
    </>
  );
}

export default App;
