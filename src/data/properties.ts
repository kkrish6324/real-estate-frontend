import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";
import property4 from "@/assets/property-4.jpg";
import property5 from "@/assets/property-5.jpg";
import property6 from "@/assets/property-6.jpg";

export interface Property {
  id: string;
  _id?: string;
  title: string;
  description: string;
  price: number;
  location: string;
  type: "land" | "residential" | "commercial" | "industrial";
  images: string[];
  amenities: string[];
  bedrooms?: number;
  bathrooms?: number;
  area: number;
  status?: string;
  featured?: boolean;
  createdAt: string;
}

export const sampleProperties: Property[] = [
  {
    id: "sample-ultra-luxury-villa-juhu-001",
    title: "Ultra Luxury 5 BHK Villa with Infinity Pool",
    description: "An architectural masterpiece nestled in the heart of Juhu, this ultra-luxury villa redefines opulent living. Featuring soaring double-height ceilings, Italian marble flooring, a temperature-controlled wine cellar, and a breathtaking infinity pool overlooking lush landscaped gardens. Every detail has been curated for the most discerning buyer.",
    price: 185000000,
    location: "Juhu, Mumbai",
    type: "residential",
    images: [property1, property2, property3],
    amenities: ["Infinity Pool", "Home Theatre", "Wine Cellar", "Smart Home Automation", "Landscaped Garden", "4-Car Garage", "Staff Quarters", "Gym & Spa"],
    bedrooms: 5,
    bathrooms: 6,
    area: 8500,
    status: "available",
    featured: true,
    createdAt: "2026-03-01",
  },
  {
    id: "sample-penthouse-bandra-002",
    title: "Signature Penthouse with Sea View — 4 BHK",
    description: "Perched on the 42nd floor of Mumbai's most prestigious tower, this signature penthouse offers unobstructed panoramic views of the Arabian Sea. With a private rooftop terrace, butler service, and bespoke interiors by a renowned designer, this is the pinnacle of sky-high luxury living.",
    price: 250000000,
    location: "Bandra West, Mumbai",
    type: "residential",
    images: [property2, property5, property1],
    amenities: ["Private Rooftop Terrace", "Butler Service", "Concierge", "Heated Pool", "Private Elevator", "Designer Interiors", "Gym", "Valet Parking"],
    bedrooms: 4,
    bathrooms: 5,
    area: 6200,
    status: "available",
    featured: true,
    createdAt: "2026-02-15",
  },
  {
    id: "sample-farmhouse-chattarpur-003",
    title: "Sprawling 6 BHK Farmhouse with Private Pool",
    description: "Set across 2 acres of manicured grounds in Delhi's most coveted farmhouse belt, this magnificent estate offers unparalleled privacy and grandeur. The property features a 50-ft private pool, a fully equipped outdoor kitchen, a floodlit tennis court, and a dedicated guest cottage — perfect for lavish entertaining.",
    price: 320000000,
    location: "Chattarpur, New Delhi",
    type: "residential",
    images: [property3, property6, property2],
    amenities: ["50-ft Private Pool", "Tennis Court", "Guest Cottage", "Outdoor Kitchen", "Meditation Garden", "Home Theatre", "Helipad", "Security Cabin"],
    bedrooms: 6,
    bathrooms: 7,
    area: 14000,
    status: "available",
    featured: true,
    createdAt: "2026-02-20",
  },
  {
    id: "sample-commercial-bkc-004",
    title: "Grade A Commercial Office Space — BKC",
    description: "Premium Grade A office space in Mumbai's Bandra Kurla Complex, the financial nerve centre of India. This state-of-the-art workspace features floor-to-ceiling glass facades, LEED Platinum certification, dedicated parking, and world-class amenities — ideal for MNCs and top-tier corporates.",
    price: 420000000,
    location: "BKC, Mumbai",
    type: "commercial",
    images: [property4, property6],
    amenities: ["LEED Platinum Certified", "Conference Suites", "Dedicated Parking", "24/7 Security", "Cafeteria", "High-Speed Elevators", "Power Backup", "EV Charging"],
    area: 18000,
    status: "available",
    featured: false,
    createdAt: "2026-01-10",
  },
  {
    id: "sample-luxury-apartment-dlf-005",
    title: "Luxury 4 BHK Apartment in DLF The Crest",
    description: "Nestled within the iconic DLF The Crest in Sector 54, this exquisitely designed apartment offers a seamless blend of contemporary architecture and timeless elegance. Enjoy resort-style amenities, a private club, and sweeping views of the Aravalli hills from your private balcony.",
    price: 78000000,
    location: "DLF Phase 5, Gurgaon",
    type: "residential",
    images: [property5, property3, property4],
    amenities: ["Private Club", "Olympic Pool", "Squash Court", "Concierge", "Landscaped Podium", "Yoga Deck", "Kids Play Zone", "Covered Parking"],
    bedrooms: 4,
    bathrooms: 4,
    area: 4100,
    status: "available",
    featured: true,
    createdAt: "2026-03-05",
  },
  {
    id: "sample-villa-whitefield-006",
    title: "Contemporary 3 BHK Villa — Whitefield",
    description: "A stunning contemporary villa in Bangalore's thriving Whitefield corridor, designed for the modern professional. Featuring clean architectural lines, a private plunge pool, smart home integration, and proximity to top tech parks — this is urban luxury at its finest.",
    price: 55000000,
    location: "Whitefield, Bangalore",
    type: "residential",
    images: [property6, property1, property5],
    amenities: ["Plunge Pool", "Smart Home", "Modular Kitchen", "Home Office", "Terrace Garden", "2-Car Garage", "CCTV Security", "Power Backup"],
    bedrooms: 3,
    bathrooms: 4,
    area: 3600,
    status: "available",
    featured: false,
    createdAt: "2026-03-10",
  },
];
