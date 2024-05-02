import DefaultTheme from "vitepress/theme";
import "./custome.css";
  
export default {
  ...DefaultTheme,
  NotFound: () => "404", 
  enhanceApp({ app, router, siteData }) {
  },
};