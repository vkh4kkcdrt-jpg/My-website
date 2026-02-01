const { useState, useEffect, useMemo } = React;

// === DATA MANAGEMENT ===
const storage = {
  get: key => JSON.parse(localStorage.getItem(key) || '[]'),
  set: (key, data) => localStorage.setItem(key, JSON.stringify(data)),
  init: () => {
    if (!localStorage.getItem('foodItems')) {
      storage.set('foodItems', [
      { id: 1, name: 'Milk', category: 'dairy', expiry_date: '2025-05-31', status: 'active', estimated_price: 12 },
      { id: 2, name: 'Spinach', category: 'vegetables', expiry_date: '2025-05-28', status: 'active', estimated_price: 8 },
      { id: 3, name: 'Chicken', category: 'meat', expiry_date: '2025-05-29', status: 'active', estimated_price: 35 },
      { id: 4, name: 'Bread', category: 'grains', expiry_date: '2025-06-02', status: 'active', estimated_price: 10 }]);

    }
    if (!localStorage.getItem('recipes')) {
      storage.set('recipes', [
      { id: 1, name: 'Grilled Cheese', emoji: '🧀', time_minutes: 10, difficulty: 'easy', ingredients: [{ name: 'Bread', category: 'grains' }, { name: 'Cheese', category: 'dairy' }], steps: ['Butter bread slices', 'Add cheese between slices', 'Grill until golden', 'Serve hot'] },
      { id: 2, name: 'Cheese Omelette', emoji: '🍳', time_minutes: 8, difficulty: 'easy', ingredients: [{ name: 'Eggs', category: 'dairy' }, { name: 'Cheese', category: 'dairy' }], steps: ['Beat eggs', 'Heat pan with oil', 'Pour eggs and add cheese', 'Fold and serve'] },
      { id: 3, name: 'Veg Stir-Fry', emoji: '🥬', time_minutes: 15, difficulty: 'easy', ingredients: [{ name: 'Vegetables', category: 'vegetables' }], steps: ['Chop vegetables', 'Heat oil in pan', 'Stir-fry 5-7 minutes', 'Season and serve'] },
      { id: 4, name: 'Fruit Smoothie', emoji: '🍌', time_minutes: 5, difficulty: 'easy', ingredients: [{ name: 'Banana', category: 'fruits' }, { name: 'Milk', category: 'dairy', optional: true }], steps: ['Slice banana', 'Add to blender with milk', 'Blend until smooth', 'Pour and enjoy'] }]);

    }
  } };


// === HELPER FUNCTIONS ===
const getDaysLeft = expiryDate => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);
  return Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
};

const getUrgency = expiryDate => {
  const days = getDaysLeft(expiryDate);
  if (days <= 0) return 'expiring';
  if (days <= 2) return 'soon';
  return 'fresh';
};

const categoryIcons = {
  dairy: '🥛', vegetables: '🥬', fruits: '🍎', meat: '🥩',
  seafood: '🐟', grains: '🌾', beverages: '🥤', snacks: '🍪',
  frozen: '🧊', other: '📦' };


// === COMPONENTS ===
function FoodCard({ item, onUse, onWaste }) {
  const daysLeft = getDaysLeft(item.expiry_date);
  const urgency = getUrgency(item.expiry_date);
  const cardClass = urgency === 'fresh' ? 'food-card-fresh' : urgency === 'soon' ? 'food-card-soon' : 'food-card-expiring';
  const badgeClass = urgency === 'fresh' ? 'badge-green' : urgency === 'soon' ? 'badge-yellow' : 'badge-red';

  return /*#__PURE__*/(
    React.createElement("div", { className: `card ${cardClass} animate-fade` }, /*#__PURE__*/
    React.createElement("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'start' } }, /*#__PURE__*/
    React.createElement("div", { style: { display: 'flex', gap: '12px' } }, /*#__PURE__*/
    React.createElement("span", { style: { fontSize: '32px' } }, categoryIcons[item.category] || '📦'), /*#__PURE__*/
    React.createElement("div", null, /*#__PURE__*/
    React.createElement("h3", { style: { fontWeight: 600, marginBottom: '4px' } }, item.name), /*#__PURE__*/
    React.createElement("div", { style: { fontSize: '14px', color: '#6b7280' } },
    daysLeft < 0 ? 'Expired' : daysLeft === 0 ? 'Today!' : `${daysLeft} days left`))), /*#__PURE__*/



    React.createElement("span", { className: `badge ${badgeClass}` },
    urgency === 'fresh' ? '🟢' : urgency === 'soon' ? '🟡' : '🔴')), /*#__PURE__*/


    React.createElement("div", { style: { display: 'flex', gap: '8px', marginTop: '16px' } }, /*#__PURE__*/
    React.createElement("button", { className: "btn btn-primary", style: { flex: 1, fontSize: '14px', padding: '10px' }, onClick: () => onUse(item) }, "\u2705 Used"), /*#__PURE__*/
    React.createElement("button", { className: "btn btn-secondary", style: { flex: 1, fontSize: '14px', padding: '10px' }, onClick: () => onWaste(item) }, "\uD83D\uDDD1\uFE0F Wasted"))));



}

function RecipeCard({ recipe, matchInfo, onClick }) {
  const { haveCount, totalRequired, matchPercent, hasExpiring } = matchInfo;
  const cardClass = matchPercent === 100 ? 'recipe-ready' : matchPercent >= 70 ? 'recipe-almost' : '';

  return /*#__PURE__*/(
    React.createElement("div", { className: `recipe-card ${cardClass} animate-fade`, onClick: onClick }, /*#__PURE__*/
    React.createElement("div", { style: { display: 'flex', justifyContent: 'space-between', marginBottom: '12px' } }, /*#__PURE__*/
    React.createElement("div", { style: { display: 'flex', gap: '12px' } }, /*#__PURE__*/
    React.createElement("span", { style: { fontSize: '36px' } }, recipe.emoji), /*#__PURE__*/
    React.createElement("div", null, /*#__PURE__*/
    React.createElement("h3", { style: { fontWeight: 600 } }, recipe.name), /*#__PURE__*/
    React.createElement("div", { style: { fontSize: '14px', color: '#6b7280', marginTop: '4px' } }, "\u23F1\uFE0F ",
    recipe.time_minutes, " min \u2022 ", recipe.difficulty))),



    matchPercent === 100 && /*#__PURE__*/React.createElement("span", { className: "badge badge-green" }, "\u2713 Ready")), /*#__PURE__*/

    React.createElement("div", null, /*#__PURE__*/
    React.createElement("div", { style: { display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#6b7280', marginBottom: '6px' } }, /*#__PURE__*/
    React.createElement("span", null, "You have ", haveCount, "/", totalRequired, " ingredients"),
    hasExpiring && /*#__PURE__*/React.createElement("span", { style: { color: '#ef4444' } }, "\u26A0\uFE0F Expiring")), /*#__PURE__*/

    React.createElement("div", { className: "progress-bar" }, /*#__PURE__*/
    React.createElement("div", { className: `progress-fill ${matchPercent < 100 ? 'progress-fill-yellow' : ''}`, style: { width: `${matchPercent}%` } })))));




}

// === MAIN APP ===
function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [foodItems, setFoodItems] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    storage.init();
    setFoodItems(storage.get('foodItems'));
    setRecipes(storage.get('recipes'));
  }, []);

  const activeItems = foodItems.filter(i => i.status === 'active');
  const usedItems = foodItems.filter(i => i.status === 'used');
  const moneySaved = usedItems.reduce((sum, i) => sum + (i.estimated_price || 15), 0);
  const co2Saved = usedItems.length * 2.5;

  const handleUse = item => {
    const updated = foodItems.map(i => i.id === item.id ? { ...i, status: 'used', used_date: new Date().toISOString().split('T')[0] } : i);
    setFoodItems(updated);
    storage.set('foodItems', updated);
  };

  const handleWaste = item => {
    const updated = foodItems.map(i => i.id === item.id ? { ...i, status: 'wasted', used_date: new Date().toISOString().split('T')[0] } : i);
    setFoodItems(updated);
    storage.set('foodItems', updated);
  };

  const handleAddFood = formData => {
    const newItem = { ...formData, id: Date.now(), status: 'active' };
    const updated = [...foodItems, newItem];
    setFoodItems(updated);
    storage.set('foodItems', updated);
    setShowAddForm(false);
  };

  // Recipe matching
  const recipesWithMatches = useMemo(() => {
    return recipes.map(recipe => {
      const availableIngredients = [];
      const missingIngredients = [];
      let hasExpiring = false;

      recipe.ingredients.forEach(ing => {
        const match = activeItems.find((food) =>
        food.name.toLowerCase().includes(ing.name.toLowerCase()) ||
        food.category === ing.category);


        if (match) {
          const isExpiring = getDaysLeft(match.expiry_date) <= 2;
          if (isExpiring) hasExpiring = true;
          availableIngredients.push({ ...ing, foodId: match.id, expiring: isExpiring });
        } else {
          missingIngredients.push(ing);
        }
      });

      const required = recipe.ingredients.filter(i => !i.optional);
      const haveCount = availableIngredients.length;
      const totalRequired = required.length;
      const matchPercent = Math.round(haveCount / recipe.ingredients.length * 100);

      return {
        recipe,
        matchInfo: { haveCount, totalRequired, matchPercent, hasExpiring, availableIngredients, missingIngredients } };

    }).sort((a, b) => b.matchInfo.matchPercent - a.matchInfo.matchPercent);
  }, [recipes, activeItems]);

  const handleCook = () => {
    const used = selectedRecipe.matchInfo.availableIngredients.
    map(ing => ing.foodId).
    filter(Boolean);

    const updated = foodItems.map((item) =>
    used.includes(item.id) ? { ...item, status: 'used', used_date: new Date().toISOString().split('T')[0] } : item);

    setFoodItems(updated);
    storage.set('foodItems', updated);
    setSelectedRecipe(null);
  };

  const urgentItems = activeItems.filter(i => getDaysLeft(i.expiry_date) <= 2).sort((a, b) => getDaysLeft(a.expiry_date) - getDaysLeft(b.expiry_date));
  const freshItems = activeItems.filter(i => getDaysLeft(i.expiry_date) > 2);

  return /*#__PURE__*/(
    React.createElement(React.Fragment, null, /*#__PURE__*/
    React.createElement("div", { style: { paddingBottom: '100px' } },

    currentPage === 'home' && /*#__PURE__*/
    React.createElement("div", { className: "container", style: { paddingTop: '60px' } }, /*#__PURE__*/
    React.createElement("div", { style: { marginBottom: '24px' } }, /*#__PURE__*/
    React.createElement("div", { style: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' } }, /*#__PURE__*/
    React.createElement("span", { style: { fontSize: '24px' } }, "\uD83C\uDF31"), /*#__PURE__*/
    React.createElement("h1", { style: { fontSize: '24px', fontWeight: 'bold' } }, "FoodSave")), /*#__PURE__*/

    React.createElement("p", { style: { color: '#6b7280' } }, "Eat Smart. Waste Less.")), /*#__PURE__*/


    React.createElement("div", { className: "stats-grid" }, /*#__PURE__*/
    React.createElement("div", { className: "stat-card", style: { background: '#d1fae5' } }, /*#__PURE__*/
    React.createElement("div", { style: { fontSize: '24px', fontWeight: 'bold', color: '#065f46' } }, usedItems.length), /*#__PURE__*/
    React.createElement("div", { style: { fontSize: '12px', color: '#065f46', marginTop: '4px' } }, "Items Saved")), /*#__PURE__*/

    React.createElement("div", { className: "stat-card", style: { background: '#fef3c7' } }, /*#__PURE__*/
    React.createElement("div", { style: { fontSize: '24px', fontWeight: 'bold', color: '#92400e' } }, moneySaved.toFixed(0)), /*#__PURE__*/
    React.createElement("div", { style: { fontSize: '12px', color: '#92400e', marginTop: '4px' } }, "AED Saved")), /*#__PURE__*/

    React.createElement("div", { className: "stat-card", style: { background: '#ccfbf1' } }, /*#__PURE__*/
    React.createElement("div", { style: { fontSize: '24px', fontWeight: 'bold', color: '#115e59' } }, co2Saved.toFixed(1)), /*#__PURE__*/
    React.createElement("div", { style: { fontSize: '12px', color: '#115e59', marginTop: '4px' } }, "kg CO\u2082"))),



    urgentItems.length > 0 && /*#__PURE__*/
    React.createElement("div", { style: { marginBottom: '24px' } }, /*#__PURE__*/
    React.createElement("h2", { style: { fontSize: '18px', fontWeight: 600, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' } }, "\u2728 Use Today ", /*#__PURE__*/
    React.createElement("span", { className: "badge badge-red" }, urgentItems.length)),

    urgentItems.map(item => /*#__PURE__*/React.createElement(FoodCard, { key: item.id, item: item, onUse: handleUse, onWaste: handleWaste }))),



    freshItems.length > 0 && /*#__PURE__*/
    React.createElement("div", null, /*#__PURE__*/
    React.createElement("h2", { style: { fontSize: '18px', fontWeight: 600, marginBottom: '12px' } }, "Your Inventory"),
    freshItems.map(item => /*#__PURE__*/React.createElement(FoodCard, { key: item.id, item: item, onUse: handleUse, onWaste: handleWaste }))),



    activeItems.length === 0 && /*#__PURE__*/
    React.createElement("div", { style: { textAlign: 'center', padding: '60px 20px' } }, /*#__PURE__*/
    React.createElement("div", { style: { fontSize: '64px', marginBottom: '16px' } }, "\uD83C\uDF31"), /*#__PURE__*/
    React.createElement("h3", { style: { fontSize: '20px', fontWeight: 600, marginBottom: '8px' } }, "No food items yet"), /*#__PURE__*/
    React.createElement("p", { style: { color: '#6b7280' } }, "Tap + to add your first item"))),






    currentPage === 'recipes' && /*#__PURE__*/
    React.createElement("div", { className: "container", style: { paddingTop: '60px' } }, /*#__PURE__*/
    React.createElement("div", { style: { marginBottom: '24px' } }, /*#__PURE__*/
    React.createElement("div", { style: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' } }, /*#__PURE__*/
    React.createElement("span", { style: { fontSize: '24px' } }, "\uD83D\uDC68\u200D\uD83C\uDF73"), /*#__PURE__*/
    React.createElement("h1", { style: { fontSize: '24px', fontWeight: 'bold' } }, "Smart Recipes")), /*#__PURE__*/

    React.createElement("p", { style: { color: '#6b7280' } }, "Cook what you have, waste less")),


    recipesWithMatches.map(({ recipe, matchInfo }) => /*#__PURE__*/
    React.createElement(RecipeCard, {
      key: recipe.id,
      recipe: recipe,
      matchInfo: matchInfo,
      onClick: () => setSelectedRecipe({ recipe, matchInfo }) }))),






    currentPage === 'stats' && /*#__PURE__*/
    React.createElement("div", { className: "container", style: { paddingTop: '60px' } }, /*#__PURE__*/
    React.createElement("div", { style: { marginBottom: '24px' } }, /*#__PURE__*/
    React.createElement("h1", { style: { fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' } }, "Your Impact"), /*#__PURE__*/
    React.createElement("p", { style: { color: '#6b7280' } }, "See how you're helping the planet")), /*#__PURE__*/


    React.createElement("div", { style: { background: 'linear-gradient(135deg, #10b981, #14b8a6)', borderRadius: '24px', padding: '24px', color: 'white', marginBottom: '24px' } }, /*#__PURE__*/
    React.createElement("div", { style: { fontSize: '48px', fontWeight: 'bold' } }, usedItems.length > 0 ? Math.round(usedItems.length / foodItems.length * 100) : 100, "%"), /*#__PURE__*/
    React.createElement("div", { style: { opacity: 0.9, marginTop: '4px' } }, "Save Rate"), /*#__PURE__*/
    React.createElement("div", { style: { opacity: 0.8, fontSize: '14px', marginTop: '8px' } }, usedItems.length, " saved \u2022 ", foodItems.filter(i => i.status === 'wasted').length, " wasted")), /*#__PURE__*/


    React.createElement("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' } }, /*#__PURE__*/
    React.createElement("div", { className: "card" }, /*#__PURE__*/
    React.createElement("div", { style: { fontSize: '36px', marginBottom: '12px' } }, "\uD83C\uDF7D\uFE0F"), /*#__PURE__*/
    React.createElement("div", { style: { fontSize: '24px', fontWeight: 'bold' } }, usedItems.length), /*#__PURE__*/
    React.createElement("div", { style: { fontSize: '14px', color: '#6b7280', marginTop: '4px' } }, "Items Saved")), /*#__PURE__*/

    React.createElement("div", { className: "card" }, /*#__PURE__*/
    React.createElement("div", { style: { fontSize: '36px', marginBottom: '12px' } }, "\uD83D\uDCB0"), /*#__PURE__*/
    React.createElement("div", { style: { fontSize: '24px', fontWeight: 'bold' } }, moneySaved.toFixed(0), " AED"), /*#__PURE__*/
    React.createElement("div", { style: { fontSize: '14px', color: '#6b7280', marginTop: '4px' } }, "Money Saved")), /*#__PURE__*/

    React.createElement("div", { className: "card" }, /*#__PURE__*/
    React.createElement("div", { style: { fontSize: '36px', marginBottom: '12px' } }, "\uD83C\uDF31"), /*#__PURE__*/
    React.createElement("div", { style: { fontSize: '24px', fontWeight: 'bold' } }, co2Saved.toFixed(1), " kg"), /*#__PURE__*/
    React.createElement("div", { style: { fontSize: '14px', color: '#6b7280', marginTop: '4px' } }, "CO\u2082 Avoided")), /*#__PURE__*/

    React.createElement("div", { className: "card" }, /*#__PURE__*/
    React.createElement("div", { style: { fontSize: '36px', marginBottom: '12px' } }, "\uD83D\uDCA7"), /*#__PURE__*/
    React.createElement("div", { style: { fontSize: '24px', fontWeight: 'bold' } }, usedItems.length * 170, " L"), /*#__PURE__*/
    React.createElement("div", { style: { fontSize: '14px', color: '#6b7280', marginTop: '4px' } }, "Water Saved"))), /*#__PURE__*/



    React.createElement("div", { className: "card", style: { background: '#f0fdf4', border: '2px solid #bbf7d0', textAlign: 'center' } }, /*#__PURE__*/
    React.createElement("p", { style: { fontWeight: 600, color: '#065f46', marginBottom: '8px' } }, "\uD83C\uDF31 You've saved ", usedItems.length, " meals this month!"), /*#__PURE__*/
    React.createElement("p", { style: { fontSize: '14px', color: '#047857' } }, "That's equivalent to ", (co2Saved / 2.3).toFixed(0), " km not driven by car")))), /*#__PURE__*/






    React.createElement("nav", { className: "nav" }, /*#__PURE__*/
    React.createElement("div", { className: "nav-item", style: { opacity: currentPage === 'home' ? 1 : 0.6 }, onClick: () => setCurrentPage('home') }, /*#__PURE__*/
    React.createElement("span", { style: { fontSize: '24px' } }, "\uD83C\uDFE0"), /*#__PURE__*/
    React.createElement("span", { style: { fontSize: '12px', fontWeight: 500 } }, "Home")), /*#__PURE__*/

    React.createElement("div", { className: "nav-item", style: { opacity: currentPage === 'recipes' ? 1 : 0.6 }, onClick: () => setCurrentPage('recipes') }, /*#__PURE__*/
    React.createElement("span", { style: { fontSize: '24px' } }, "\uD83D\uDC68\u200D\uD83C\uDF73"), /*#__PURE__*/
    React.createElement("span", { style: { fontSize: '12px', fontWeight: 500 } }, "Recipes")), /*#__PURE__*/

    React.createElement("div", { className: "nav-item main", onClick: () => setShowAddForm(true) }, /*#__PURE__*/
    React.createElement("span", { style: { fontSize: '28px' } }, "\u2795")), /*#__PURE__*/

    React.createElement("div", { className: "nav-item", style: { opacity: currentPage === 'stats' ? 1 : 0.6 }, onClick: () => setCurrentPage('stats') }, /*#__PURE__*/
    React.createElement("span", { style: { fontSize: '24px' } }, "\uD83D\uDCCA"), /*#__PURE__*/
    React.createElement("span", { style: { fontSize: '12px', fontWeight: 500 } }, "Stats"))),




    showAddForm && /*#__PURE__*/React.createElement(AddFoodModal, { onClose: () => setShowAddForm(false), onAdd: handleAddFood }),


    selectedRecipe && /*#__PURE__*/React.createElement(RecipeModal, { recipe: selectedRecipe, onClose: () => setSelectedRecipe(null), onCook: handleCook })));


}

function AddFoodModal({ onClose, onAdd }) {
  const [form, setForm] = useState({
    name: '', category: 'vegetables', expiry_date: '', estimated_price: '' });


  const categories = Object.keys(categoryIcons);

  const handleSubmit = e => {
    e.preventDefault();
    onAdd({ ...form, estimated_price: parseFloat(form.estimated_price) || 15 });
  };

  return /*#__PURE__*/(
    React.createElement("div", { className: "modal", onClick: onClose }, /*#__PURE__*/
    React.createElement("div", { className: "modal-content animate-slide", onClick: e => e.stopPropagation() }, /*#__PURE__*/
    React.createElement("div", { style: { padding: '24px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' } }, /*#__PURE__*/
    React.createElement("h2", { style: { fontSize: '20px', fontWeight: 'bold' } }, "Add Food Item"), /*#__PURE__*/
    React.createElement("button", { onClick: onClose, style: { fontSize: '24px', background: 'none', border: 'none', cursor: 'pointer' } }, "\u2715")), /*#__PURE__*/

    React.createElement("form", { onSubmit: handleSubmit, style: { padding: '24px' } }, /*#__PURE__*/
    React.createElement("div", { style: { marginBottom: '20px' } }, /*#__PURE__*/
    React.createElement("label", { style: { display: 'block', marginBottom: '8px', fontWeight: 500 } }, "Item Name"), /*#__PURE__*/
    React.createElement("input", {
      className: "input",
      placeholder: "e.g., Milk, Bread...",
      value: form.name,
      onChange: e => setForm({ ...form, name: e.target.value }),
      required: true })), /*#__PURE__*/



    React.createElement("div", { style: { marginBottom: '20px' } }, /*#__PURE__*/
    React.createElement("label", { style: { display: 'block', marginBottom: '12px', fontWeight: 500 } }, "Category"), /*#__PURE__*/
    React.createElement("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' } },
    categories.map((cat) => /*#__PURE__*/
    React.createElement("button", {
      key: cat,
      type: "button",
      className: `category-btn ${form.category === cat ? 'active' : ''}`,
      onClick: () => setForm({ ...form, category: cat }) }, /*#__PURE__*/

    React.createElement("div", { style: { fontSize: '24px', marginBottom: '4px' } }, categoryIcons[cat]), /*#__PURE__*/
    React.createElement("div", { style: { fontSize: '10px' } }, cat))))), /*#__PURE__*/





    React.createElement("div", { style: { marginBottom: '20px' } }, /*#__PURE__*/
    React.createElement("label", { style: { display: 'block', marginBottom: '8px', fontWeight: 500 } }, "Expiry Date"), /*#__PURE__*/
    React.createElement("input", {
      type: "date",
      className: "input",
      value: form.expiry_date,
      onChange: e => setForm({ ...form, expiry_date: e.target.value }),
      required: true })), /*#__PURE__*/



    React.createElement("div", { style: { marginBottom: '24px' } }, /*#__PURE__*/
    React.createElement("label", { style: { display: 'block', marginBottom: '8px', fontWeight: 500 } }, "Price (AED) - Optional"), /*#__PURE__*/
    React.createElement("input", {
      type: "number",
      className: "input",
      placeholder: "15",
      value: form.estimated_price,
      onChange: e => setForm({ ...form, estimated_price: e.target.value }) })), /*#__PURE__*/



    React.createElement("button", { type: "submit", className: "btn btn-primary", style: { width: '100%', padding: '16px', fontSize: '16px' } }, "Add Item")))));






}

function RecipeModal({ recipe, onClose, onCook }) {
  const { recipe: r, matchInfo } = recipe;

  return /*#__PURE__*/(
    React.createElement("div", { className: "modal", onClick: onClose }, /*#__PURE__*/
    React.createElement("div", { className: "modal-content animate-slide", onClick: e => e.stopPropagation() }, /*#__PURE__*/
    React.createElement("div", { style: { padding: '24px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between' } }, /*#__PURE__*/
    React.createElement("div", { style: { display: 'flex', gap: '12px' } }, /*#__PURE__*/
    React.createElement("span", { style: { fontSize: '40px' } }, r.emoji), /*#__PURE__*/
    React.createElement("div", null, /*#__PURE__*/
    React.createElement("h2", { style: { fontSize: '20px', fontWeight: 'bold' } }, r.name), /*#__PURE__*/
    React.createElement("div", { style: { color: '#6b7280', fontSize: '14px', marginTop: '4px' } }, "\u23F1\uFE0F ",
    r.time_minutes, " min \u2022 ", r.difficulty))), /*#__PURE__*/



    React.createElement("button", { onClick: onClose, style: { fontSize: '24px', background: 'none', border: 'none', cursor: 'pointer' } }, "\u2715")), /*#__PURE__*/


    React.createElement("div", { style: { padding: '24px' } }, /*#__PURE__*/
    React.createElement("h3", { style: { fontWeight: 600, marginBottom: '12px' } }, "Ingredients"),
    matchInfo.availableIngredients.map((ing, i) => /*#__PURE__*/
    React.createElement("div", { key: i, style: { background: '#f0fdf4', border: '2px solid #bbf7d0', borderRadius: '12px', padding: '12px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' } }, /*#__PURE__*/
    React.createElement("span", null, "\u2705"), /*#__PURE__*/
    React.createElement("span", null, ing.name),
    ing.expiring && /*#__PURE__*/React.createElement("span", { className: "badge badge-red", style: { marginLeft: 'auto' } }, "Use soon!"))),


    matchInfo.missingIngredients.map((ing, i) => /*#__PURE__*/
    React.createElement("div", { key: i, style: { background: '#f9fafb', border: '2px solid #e5e7eb', borderRadius: '12px', padding: '12px', marginBottom: '8px', opacity: 0.6 } }, "\u274C ",
    ing.name, " ", ing.optional && '(optional)')), /*#__PURE__*/



    React.createElement("h3", { style: { fontWeight: 600, margin: '24px 0 12px' } }, "Instructions"),
    r.steps.map((step, i) => /*#__PURE__*/
    React.createElement("div", { key: i, style: { display: 'flex', gap: '12px', marginBottom: '12px' } }, /*#__PURE__*/
    React.createElement("div", { style: { width: '28px', height: '28px', background: '#d1fae5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#065f46', flexShrink: 0 } },
    i + 1), /*#__PURE__*/

    React.createElement("p", { style: { paddingTop: '4px' } }, step))), /*#__PURE__*/



    React.createElement("div", { style: { background: '#f0fdf4', border: '2px solid #bbf7d0', borderRadius: '16px', padding: '16px', margin: '24px 0', textAlign: 'center' } }, /*#__PURE__*/
    React.createElement("p", { style: { fontWeight: 600, color: '#065f46', marginBottom: '4px' } }, "\uD83C\uDF31 Environmental Impact"), /*#__PURE__*/
    React.createElement("p", { style: { fontSize: '14px', color: '#047857' } }, "Cooking this saves ", matchInfo.availableIngredients.length, " food items!")), /*#__PURE__*/


    React.createElement("button", { className: "btn btn-primary", onClick: onCook, style: { width: '100%', padding: '16px', fontSize: '16px' } }, "I Cooked This! \uD83C\uDF89")))));






}

ReactDOM.render( /*#__PURE__*/React.createElement(App, null), document.getElementById('root'));