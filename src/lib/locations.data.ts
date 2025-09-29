export type Location = {
  id: string;
  name: string;
  address: string;
  phone?: string;
  hours: Record<string, string>;
  services: string[];
  mapUrl?: string;
  queueUrl?: string;
};

export const LOCATIONS: Location[] = [
  {
    id: "ft-pierce",
    name: "Main Office – Ft. Pierce",
    address: "2300 Virginia Avenue, Ft. Pierce, FL 34982",
    phone: "772-462-1650",
    hours: {
      Monday: "8:00 AM – 5:00 PM",
      Tuesday: "8:00 AM – 5:00 PM",
      Wednesday: "8:00 AM – 5:00 PM",
      Thursday: "8:00 AM – 5:00 PM",
      Friday: "8:00 AM – 5:00 PM"
    },
    services: ["Property Tax", "Driver License", "Motor Vehicle", "Business Tax"],
    mapUrl: "https://maps.google.com/?q=2300+Virginia+Ave+Ft+Pierce+FL",
    queueUrl: ""
  },
  {
    id: "tradition",
    name: "Tradition Office – Port St. Lucie",
    address: "10264 SW Village Parkway, Port St. Lucie, FL 34987",
    phone: "772-462-1650",
    hours: {
      Monday: "8:00 AM – 5:00 PM",
      Tuesday: "8:00 AM – 5:00 PM",
      Wednesday: "8:00 AM – 5:00 PM",
      Thursday: "8:00 AM – 5:00 PM",
      Friday: "8:00 AM – 5:00 PM"
    },
    services: ["Property Tax", "Driver License", "Motor Vehicle", "Hunting & Fishing"],
    mapUrl: "https://maps.google.com/?q=10264+SW+Village+Pkwy+Port+St+Lucie+FL",
    queueUrl: ""
  }
];
