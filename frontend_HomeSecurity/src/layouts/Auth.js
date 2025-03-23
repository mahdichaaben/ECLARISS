import React from "react";
import { BrowserRouter , Routes, Route, Navigate, Outlet } from "react-router-dom";

// components
import Navbar from "components/Navbars/AuthNavbar";
import FooterSmall from "components/Footers/FooterSmall";
import { AuthProvider } from "context/authcontext";

// views
import Login from "views/auth/Login";
import Register from "views/auth/Register";

export default function Auth() {
  return (
   <>
      <Navbar />
      <main>
        <section className="relative w-full h-full py-40 min-h-screen">
          <div
            className="absolute top-0 w-full h-full bg-blueGray-800 bg-no-repeat bg-full"
            style={{
              backgroundImage:
                "url(" + require("assets/img/register_bg_2.png").default + ")",
            }}
          ></div>
            <Outlet/>
        </section>
      </main>
      </>
  );
}
