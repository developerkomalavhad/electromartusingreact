import dell from "../assets/images/dell.jpg";
import hp from "../assets/images/hp.jpg";
import iphone from "../assets/images/iphone.jpg";
import lenovo from "../assets/images/lenovo.jpg";
import samsung from "../assets/images/samsung.jpg";
import vivo from "../assets/images/vivo.jpg";

const products = [
  {
    id: 1,
    name: "HP Pavilion 15",
    category: "Laptop",
    price: 59999,
    rating: 4.6,
    image: hp,
    badge: "Best seller",
    description: "A dependable performance laptop for study, office, and daily multitasking.",
  },
  {
    id: 2,
    name: "iPhone 16",
    category: "Mobile",
    price: 79900,
    rating: 4.8,
    image: iphone,
    badge: "New",
    description: "A premium phone with a bright display, strong cameras, and fast performance.",
  },
  {
    id: 3,
    name: "Dell Inspiron 14",
    category: "Laptop",
    price: 52999,
    rating: 4.4,
    image: dell,
    badge: "Value pick",
    description: "Compact, practical, and ready for work from anywhere.",
  },
  {
    id: 4,
    name: "Lenovo IdeaPad Slim",
    category: "Laptop",
    price: 46999,
    rating: 4.3,
    image: lenovo,
    badge: "Student choice",
    description: "Lightweight laptop with all-day comfort for classes and projects.",
  },
  {
    id: 5,
    name: "Samsung Galaxy S Series",
    category: "Mobile",
    price: 64999,
    rating: 4.7,
    image: samsung,
    badge: "Top rated",
    description: "Smooth display, reliable battery, and versatile photography.",
  },
  {
    id: 6,
    name: "Vivo V Series",
    category: "Mobile",
    price: 28999,
    rating: 4.2,
    image: vivo,
    badge: "Budget star",
    description: "Stylish everyday phone with quick charging and crisp selfies.",
  },
];

export default products;
