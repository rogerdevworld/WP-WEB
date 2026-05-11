/**
 * Configuración global y traducciones para Warnfood (Barcelona).
 */

export const i18n = {
  es: {
    nav: { menu: 'Menú Semanal', savings: 'Ahorro Real', register: 'Unirse' },
    hero: {
      tag: "OFERTA DE LANZAMIENTO: CYBER-WEEK",
      title: "5 Días de Libertad Nutricional.",
      subtitle: "Hackea tu semana en Barcelona",
      priceOld: "65€",
      priceNew: "45€",
      desc: "No compres comida, compra tiempo. 5 almuerzos premium al Wok diseñados para el máximo rendimiento.",
      cta: "Activar Semana Fundador (45€)",
      urgency: "Plazas de fundador ocupadas: 18/30",
      coupon: "Usa el código WARM_DEMO_BCN para un 10% extra"
    },
    savings: {
      title: "El Ahorro Invisible",
      subtitle: "Justificación de valor basada en datos de BCN 2026",
      items: [
        { title: "Tiempo Recuperado", value: "+10h/sem", desc: "Sin colas, sin cocinar, sin fregar." },
        { title: "Eficiencia Energética", value: "-15%", desc: "Menos luz y gas al no usar vitro ni horno." },
        { title: "Ahorro de Agua", value: "Eco-Friendly", desc: "Reducción drástica de ollas y platos sucios." },
        { title: "Desperdicio Cero", value: "100% Útil", desc: "Ahorras el 15% que normalmente tiras del súper." }
      ]
    },
    menu: {
      label: "WEEKLY DEPLOYMENT",
      title: "Menú de la Semana",
      days: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"]
    },
    footer: {
      location: "Punto de recogida exclusivo: Poblenou / @22ar",
      brand: "Warnfood BCN — Bio-Optimization Hub"
    },
    panel: {
      dashboard: "Dashboard de Usuario",
      exit: "Salir al Inicio",
      settings: "Ajustes",
      logout: "Cerrar Sesión",
      edit: "Editar Perfil",
      settings_title: "Ajustes del Bio-Hacker",
      full_name: "Nombre Completo",
      phone: "Teléfono",
      height: "Altura (cm)",
      weight: "Peso (kg)",
      target_weight: "Objetivo de Peso (kg)",
      age: "Edad",
      birth_date: "Fecha de Nacimiento",
      tupper_size: "Talla de Taper (Bio-Capacity)",
      dietary_notes: "Alergias y Restricciones",
      is_vegetarian: "Régimen Vegetariano",
      save_settings: "GUARDAR_CONFIGURACION_BIO",
      minUnits: "Se requiere un mínimo de 15 platos para activar la suscripción",
      meals: {
        breakfast: "Desayuno",
        lunch: "Almuerzo (Obligatorio)",
        snack: "Snacks (Recomendado: Mañana/Tarde)",
        dinner: "Cena",
        juices: "Jugos",
        warningMultiple: "⚠️ Protocolo de sobrecarga: Se ha seleccionado más de una unidad."
      }
    }
  },
  en: {
    nav: { menu: 'Weekly Menu', savings: 'Real Savings', register: 'Join' },
    hero: {
      tag: "LAUNCH OFFER: CYBER-WEEK",
      title: "5 Days of Nutritional Freedom.",
      subtitle: "Hack your week in Barcelona",
      priceOld: "65€",
      priceNew: "45€",
      desc: "Don't buy food, buy time. 5 premium Wok lunches designed for maximum performance.",
      cta: "Activate Founder Week (€45)",
      urgency: "Founder slots occupied: 18/30",
      coupon: "Use code WARM_DEMO_BCN for 10% extra discount"
    },
    savings: {
      title: "Invisible Savings",
      subtitle: "Value justification based on BCN 2026 data",
      items: [
        { title: "Time Recovered", value: "+10h/week", desc: "No lines, no cooking, no washing." },
        { title: "Energy Efficiency", value: "-15%", desc: "Lower electricity and gas by not using stove/oven." },
        { title: "Water Savings", value: "Eco-Friendly", desc: "Drastic reduction in dirty pots and plates." },
        { title: "Zero Waste", value: "100% Useful", desc: "Save the 15% you normally throw from the supermarket." }
      ]
    },
    menu: {
      label: "WEEKLY DEPLOYMENT",
      title: "Weekly Menu",
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    },
    footer: {
      location: "Exclusive Pickup Point: Poblenou / @22ar",
      brand: "Warnfood BCN — Bio-Optimization Hub"
    },
    panel: {
      dashboard: "User Dashboard",
      exit: "Exit to Home",
      settings: "Settings",
      logout: "Logout",
      edit: "Edit Profile",
      settings_title: "Bio-Hacker Settings",
      full_name: "Full Name",
      phone: "Phone",
      height: "Height (cm)",
      weight: "Weight (kg)",
      target_weight: "Target Weight (kg)",
      age: "Age",
      birth_date: "Birth Date",
      tupper_size: "Tupper Size (Bio-Capacity)",
      dietary_notes: "Allergies & Restrictions",
      is_vegetarian: "Vegetarian Regime",
      save_settings: "SAVE_BIO_CONFIG",
      minUnits: "A minimum of 15 meals is required to activate subscription",
      meals: {
        breakfast: "Breakfast",
        lunch: "Lunch (Mandatory)",
        snack: "Snacks (Recommended: Morning/Afternoon)",
        dinner: "Dinner",
        juices: "Juices",
        warningMultiple: "⚠️ Overload Protocol: More than one unit selected."
      }
    }
  }
};

export const mealOptions = {
  breakfast: [
    { id: 'b1', name: { es: 'Avena Protein Cyber-Bowl', en: 'Protein Oats Cyber-Bowl' }, kcal: 350, img: '/meals/avena_bowl.png' },
    { id: 'b2', name: { es: 'Tortitas de Claras y Plátano', en: 'Egg White & Banana Pancakes' }, kcal: 420, img: '/meals/tortitas.png' },
    { id: 'b3', name: { es: 'Tostada Aguacate & Pavo', en: 'Avocado & Turkey Toast' }, kcal: 380, img: '/meals/tostada_aguacate.png' }
  ],
  snack: [
    { id: 's1', name: { es: 'Mix de Frutos Secos Bio', en: 'Bio Nut Mix' }, kcal: 180, img: '/meals/frutos_secos.png', tag: 'Mañana' },
    { id: 's2', name: { es: 'Yogur Griego con Chía', en: 'Greek Yogurt with Chia' }, kcal: 150, img: '/meals/yogur_chia.png', tag: 'Tarde' },
    { id: 's3', name: { es: 'Barrita de Proteína Raw', en: 'Raw Protein Bar' }, kcal: 210, img: '/meals/barrita_proteina.png', tag: 'Mañana' },
    { id: 's4', name: { es: 'Manzana con Crema de Cacahuete', en: 'Apple with Peanut Butter' }, kcal: 190, img: '/meals/manzana_cacahuete.png', tag: 'Tarde' }
  ],
  lunch: [
    { id: 'l1', name: { es: 'Lomo Saltado Cyber-Wok', en: 'Cyber-Wok Lomo Saltado' }, kcal: 580, country: 'Perú', img: '/meals/lomo_saltado.png' },
    { id: 'l2', name: { es: 'Pollo Campero al Pimentón', en: 'Paprika Country Chicken' }, kcal: 490, country: 'España', img: '/meals/pollo_pimenton.png' },
    { id: 'l3', name: { es: 'Bowl Pabellón Power', en: 'Pabellón Power Bowl' }, kcal: 620, country: 'Venezuela', img: '/meals/pabellon_bowl.png' }
  ],
  dinner: [
    { id: 'd1', name: { es: 'Salmón Miso-Cyber', en: 'Miso-Cyber Salmon' }, kcal: 550, img: '/meals/salmon_miso.png' },
    { id: 'd2', name: { es: 'Wok de Heura & Verduras', en: 'Heura & Veggie Wok' }, kcal: 400, img: '/meals/wok_heura.png' },
    { id: 'd3', name: { es: 'Tacos de Pollo Efficiency', en: 'Efficiency Chicken Tacos' }, kcal: 480, img: '/meals/tacos_pollo.png' }
  ],
  juices: [
    { id: 'j1', name: { es: 'Green Bio-Hacker (Detox)', en: 'Green Bio-Hacker (Detox)' }, kcal: 120, img: '/meals/green_juice.png' },
    { id: 'j2', name: { es: 'Red Recovery (Antiox)', en: 'Red Recovery (Antiox)' }, kcal: 150, img: '/meals/red_juice.png' },
    { id: 'j3', name: { es: 'Cyber-Citrus (Vitamina C)', en: 'Cyber-Citrus (Vitamin C)' }, kcal: 90, img: '/meals/citrus_juice.png' }
  ]
};

export const weeklyMenu = [
  {
    day: 0,
    recipe: {
      es: { title: 'Lomo Saltado Cyber-Wok', country: 'Perú', flag: '🇵🇪', desc: 'Ternera salteada, cebolla y soja premium.' },
      en: { title: 'Cyber-Wok Lomo Saltado', country: 'Peru', flag: '🇵🇪', desc: 'Sautéed beef, onion and premium soy.' }
    },
    img: '/recipe1.png',
    kcal: 580, protein: 42, carbs: 55, fats: 18
  },
  {
    day: 1,
    recipe: {
      es: { title: 'Pollo Campero al Pimentón', country: 'España', flag: '🇪🇸', desc: 'Pollo con Pimentón de la Vera y verduras.' },
      en: { title: 'Paprika Country Chicken', country: 'Spain', flag: '🇪🇸', desc: 'Chicken with Pimentón de la Vera and veggies.' }
    },
    img: '/recipe2.png',
    kcal: 490, protein: 45, carbs: 40, fats: 12
  }
];

export const sizes = [
  { letter: 'S', grams: '350g', multiplier: 0.8 },
  { letter: 'M', grams: '450g', multiplier: 1 },
  { letter: 'L', grams: '600g', multiplier: 1.3 }
];

export const comparisonData = {
  warmfood: {
    name: "Warnfood",
    dish: "Lomo Saltado Cyber-Wok",
    price: "9,00 € (Cyber-Week)",
    protein: "45g",
    kcal: "550",
    quality: "⭐⭐⭐⭐⭐ (Fresco BCN)",
    hud: { protein: "45g", freshness: "100%" },
    img: "/comp/warmfood.png"
  },
  competitors: [
    {
      id: "wetaca",
      name: "Wetaca",
      dish: "Guiso Industrial",
      price: "8,50 € - 9,50 €",
      protein: "25g - 30g",
      kcal: "750",
      quality: "⚠️ Refrigerado/Viajado",
      hud: { process: "INDUSTRIAL", state: "REFRIGERATED" },
      img: "/comp/wetaca.png"
    },
    {
      id: "mercadona",
      name: "Mercadona",
      dish: "Pasta Refrigerada",
      price: "6,50 €",
      protein: "12g",
      kcal: "600",
      quality: "❌ Conservantes",
      hud: { sodium: "HIGH", state: "PLASTIC" },
      img: "/comp/mercadona.png"
    }
  ]
};
