import dummyLandingPage from "@/assets/images/project-images/dummy-landing-page.png";
import contactManagement from "@/assets/images/project-images/contact-management.png";
import todoList from "@/assets/images/project-images/todo-list.png";
import xClone from "@/assets/images/project-images/x-ui-clone.png";
import tomato from "@/assets/images/project-images/tomato.png";
import metube from "@/assets/images/project-images/metube.png";

const Projects = [
  {
    src: dummyLandingPage,
    alt: "Dummy Landing Page screenshot",
    name: "Dummy Landing Page",
    description: "A dummy landing page for a company",
    github: "https://github.com/arpittheslayer/dummy-landing-page",
    liveLink: "https://dummy-landing-page-alpha.vercel.app/",
  },
  {
    src: contactManagement,
    alt: "Contact Management Web App screenshot",
    name: "Contact Management Web App",
    description: "A simple contact management web app made for an assignment",
    github: "https://github.com/ArpitTheSlayer/contact-management-web-app",
    liveLink: "https://contact-management-web-app-vert.vercel.app/",
  },
  {
    src: todoList,
    alt: "Todo List App screenshot",
    name: "Todo List App",
    description: "A simple todo list web app made using React.js",
    github: "https://github.com/ArpitTheSlayer/todo-list-app",
    liveLink: "https://todo-list-app6.netlify.app/",
  },
  {
    src: xClone,
    alt: "X UI Clone screenshot",
    name: "X UI Clone",
    description: "An UI imitation of X made using TailwindCSS",
    github: "https://github.com/ArpitTheSlayer/x-clone",
    liveLink: "https://arpittheslayer.github.io/x-clone/",
  },
  {
    src: tomato,
    alt: "Tomato screenshot",
    name: "Tomato - A food delivery web app",
    description:
      "A food delivery website with cart, payment, admin panel and order tracking",
    github: "https://github.com/ArpitTheSlayer/Tomato",
    liveLink: "https://tomato-frontend-whxx.onrender.com/",
  },
  {
    src: metube,
    alt: "MeTube screenshot",
    name: "MeTube - A YouTube Clone",
    description:
      "A functional clone of YouTube that fetches videos through a YouTube API",
    github: "https://github.com/ArpitTheSlayer/7_Youtube_Clone",
    liveLink: "https://metube1.netlify.app/",
  },
];

export { Projects };
