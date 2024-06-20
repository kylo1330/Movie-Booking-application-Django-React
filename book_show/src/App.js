import React from "react";
import Navbar from "./components/Navbar";
import WelcomeSection from './components/WelcomeSection';
import MovieCarousel from './components/MovieCarousel';
import SocialMediaButtons from './components/SocialMediaButtons';
import checkAuth from "./components/auth/checkAuth";
import { useSelector } from "react-redux";


function App() {
  const user = useSelector((state) => state.auth.user);
  const isSuperuser = useSelector((state) => state.auth.isSuperuser);

  return (
    <div>
      <Navbar />
      <WelcomeSection />
      <MovieCarousel />
      <SocialMediaButtons />
      <div>
        {user && isSuperuser ? ( // Check if user is logged in and is admin
          <div>
        
          </div>
        ) : user ? ( // Check if user is logged in
          <div>
          
          </div>
        ) : (
          <div>
            <h1>Please log in to continue</h1>
          </div>
        )}
      </div>
    </div>
  );
}

export default checkAuth(App);




