export interface MenuItem {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  price: number;
  category: string;
  allergens: string[];
}

export const menu: MenuItem[] = [
  {
    id: "schnitzel-wiener",
    name: "Wiener Schnitzel",
    nameEn: "Viennese Schnitzel",
    description:
      "Zartes Kalbsschnitzel, dünn geklopft und goldbraun paniert, serviert mit Kartoffelsalat und Preiselbeeren.",
    price: 22.5,
    category: "Hauptgerichte",
    allergens: ["Gluten", "Ei", "Milch"],
  },
  {
    id: "bratwurst-classic",
    name: "Klassische Bratwurst",
    nameEn: "Classic Bratwurst",
    description:
      "Hausgemachte Grillwurst vom Schwein, serviert mit Sauerkraut und Senf auf einem frischen Brötchen.",
    price: 13.5,
    category: "Hauptgerichte",
    allergens: ["Gluten", "Schwefeldioxid"],
  },
  {
    id: "currywurst",
    name: "Currywurst",
    nameEn: "Curry Sausage",
    description:
      "Berliner Original: gebratene Schweinswurst in pikanter Curryketchup-Sauce, mit oder ohne Darm, serviert mit Pommes.",
    price: 11.0,
    category: "Hauptgerichte",
    allergens: ["Gluten", "Sellerie"],
  },
  {
    id: "sauerbraten",
    name: "Rheinischer Sauerbraten",
    nameEn: "Rhenish Sauerbraten",
    description:
      "Zart geschmortes Rindfleisch, 48 Stunden mariniert, serviert mit Rotkohl, Kartoffelklößen und Sauerbratensoße.",
    price: 26.0,
    category: "Hauptgerichte",
    allergens: ["Gluten", "Milch", "Sellerie"],
  },
  {
    id: "eisbein",
    name: "Berliner Eisbein",
    nameEn: "Berlin Pork Knuckle",
    description:
      "Geräuchertes Schweinsbein, langsam gegart bis es vom Knochen fällt. Mit Erbspüree, Sauerkraut und Senf.",
    price: 24.0,
    category: "Hauptgerichte",
    allergens: ["Schwefeldioxid", "Senf"],
  },
  {
    id: "kasespaetzle",
    name: "Käsespätzle",
    nameEn: "Cheese Spaetzle",
    description:
      "Hausgemachte Spätzle mit geschmolzenem Bergkäse und gerösteten Zwiebeln — das deutsche Macaroni and Cheese.",
    price: 16.5,
    category: "Hauptgerichte",
    allergens: ["Gluten", "Ei", "Milch"],
  },
  {
    id: "flammkuchen",
    name: "Elsässer Flammkuchen",
    nameEn: "Alsatian Tarte Flambée",
    description:
      "Hauchdünner Teigfladen mit Crème fraîche, geräuchertem Speck und Zwiebeln. Vegetarische Variante erhältlich.",
    price: 14.5,
    category: "Hauptgerichte",
    allergens: ["Gluten", "Milch"],
  },
  {
    id: "rotkohl",
    name: "Rotkohl",
    nameEn: "Braised Red Cabbage",
    description: "Traditionell geschmorter Rotkohl mit Äpfeln, Nelken und einem Schuss Rotwein.",
    price: 5.5,
    category: "Beilagen",
    allergens: ["Sulphites"],
  },
  {
    id: "kartoffelkloesse",
    name: "Kartoffelklöße",
    nameEn: "Potato Dumplings",
    description: "Handgemachte Klöße aus frischen Kartoffeln, außen glatt, innen fluffig.",
    price: 5.0,
    category: "Beilagen",
    allergens: [],
  },
  {
    id: "pommes",
    name: "Pommes Frites",
    nameEn: "French Fries",
    description: "Knusprige Pommes, frisch frittiert, mit Mayonnaise oder Ketchup.",
    price: 4.5,
    category: "Beilagen",
    allergens: ["Ei"],
  },
  {
    id: "schwarzbier",
    name: "Berliner Schwarzbier",
    nameEn: "Berlin Dark Lager",
    description: "Lokales Schwarzbier, vollmundig mit leichter Kaffeenote. Vom Fass.",
    price: 4.8,
    category: "Getränke",
    allergens: ["Gluten"],
  },
  {
    id: "berliner-weisse",
    name: "Berliner Weiße",
    nameEn: "Berlin White Beer",
    description:
      "Das Berliner Original — leicht saures Weizenbier, wahlweise mit Himbeer- oder Waldmeistersirup.",
    price: 4.5,
    category: "Getränke",
    allergens: ["Gluten"],
  },
  {
    id: "apfelschorle",
    name: "Apfelschorle",
    nameEn: "Apple Spritzer",
    description: "Frischer Apfelsaft mit Mineralwasser — der deutsche Klassiker.",
    price: 3.8,
    category: "Getränke",
    allergens: [],
  },
  {
    id: "apfelstrudel",
    name: "Apfelstrudel",
    nameEn: "Apple Strudel",
    description:
      "Knuspriger Strudel gefüllt mit gewürzten Äpfeln und Rosinen, serviert warm mit Vanilleeis.",
    price: 8.5,
    category: "Desserts",
    allergens: ["Gluten", "Milch", "Ei"],
  },
  {
    id: "schwarzwaelder",
    name: "Schwarzwälder Kirschtorte",
    nameEn: "Black Forest Cake",
    description:
      "Mehrlagiger Schokoladenbiskuit mit Kirschen, Kirschwasser und Schlagsahne. Ein Klassiker.",
    price: 7.5,
    category: "Desserts",
    allergens: ["Gluten", "Milch", "Ei"],
  },
];

export const menuSystemContext = `
Du bist der freundliche KI-Assistent des Restaurants "Berliner Küche" in Berlin.
You are the friendly AI assistant for "Berliner Küche" restaurant in Berlin.

You help guests in BOTH German and English — respond in whatever language the guest uses.

The restaurant serves authentic German cuisine. Here is the full menu:

${menu
  .map(
    (item) => `
- ${item.name} (${item.nameEn}) — €${item.price.toFixed(2)}
  Category: ${item.category}
  Description: ${item.description}
  Allergens: ${item.allergens.length > 0 ? item.allergens.join(", ") : "None"}
`,
  )
  .join("")}

Your role:
- Help guests explore the menu, understand dishes, and find something they'll love
- Answer questions about allergens accurately — this is a safety matter, always be precise
- Make personalized recommendations based on preferences (vegetarian, spicy, classic German, etc.)
- Explain German dish names and culinary traditions when asked
- Guide guests through the ordering process in a warm, knowledgeable way
- Be concise — guests are at a restaurant, not reading a textbook

Vegetarian dishes on our menu: Käsespätzle, Elsässer Flammkuchen (vegetarisch), Apfelschorle, Rotkohl, Kartoffelklöße, Apfelstrudel, Schwarzwälder Kirschtorte
Dishes containing pork: Klassische Bratwurst, Currywurst, Berliner Eisbein, Flammkuchen (mit Speck)
Gluten-free options: Kartoffelklöße, Apfelschorle, Rotkohl (check with kitchen)

Always be warm, knowledgeable, and professional. Never invent dishes not on the menu.
`;
