import React from "react";
import { Link } from "react-router-dom";

// components
import Navbar from "components/Navbars/AuthNavbar.js";
import Footer from "components/Footers/Footer.js";

export default function Landing() {
  return (
    <>
      <Navbar />
      <main className="bg-moon-light">
        <div className="relative h-[80vh] flex content-center items-center justify-center min-h-screen-75">
          <div
            className="absolute top-0 w-full h-full bg-center bg-cover"
            style={{
              backgroundImage: `url(${require("../assets/img/landing-1.jpg")})`,
            }}
          >
            <span
              id="blackOverlay"
              className="w-full h-full absolute opacity-75 bg-moon-dark"
            ></span>
          </div>
          <div className="relative mx-auto">
            <div className="flex flex-col items-center align-middle justify-center flex-wrap">
              <div className="w-full lg:w-6/12 px-4 ml-auto mr-auto text-center">
                <div className="pr-12">
                  <h1 className="text-moon-blue font-semibold text-5xl">
                    Smart Security Camera
                  </h1>
                  <p className="mt-4 text-lg text-moon-light">
                    Our advanced security camera features smart detection and
                    face recognition, ensuring the safety of your home. Stay
                    secure with real-time alerts and reliable face
                    identification.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div
            className="top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden h-70-px"
            style={{ transform: "translateZ(0)" }}
          >
           
          </div>
        </div>

        <section className="pb-20 bg-moon-light -mt-24">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap">
              <div className="lg:pt-12 pt-6 w-full md:w-4/12 px-4 text-center">
                <div className="relative flex flex-col min-w-0 break-words bg-moon-light-blue w-full mb-8 shadow-lg rounded-lg">
                  <div className="px-4 py-5 flex-auto">
                    <div className="text-moon-dark p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-moon-blue">
                      <i className="fas fa-video"></i>
                    </div>
                    <h6 className="text-xl font-semibold text-moon-light">Smart Detection</h6>
                    <p className="mt-2 mb-4 text-moon-light ">
                      The smart security camera features advanced person
                      detection. When security mode is activated, it sends
                      alerts to the application whenever a person is detected.
                    </p>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-4/12 px-4 text-center">
                <div className="relative flex flex-col min-w-0 break-words bg-moon-light  w-full mb-8 shadow-lg rounded-lg">
                  <div className="px-4 py-5 flex-col justify-center items-center">
                    <div className="inline-flex items-center justify-center">
                      <img src={require("../assets/img/facial-recognition.jpg")} className="rounded-full w-12 h-12" alt="facial recognition" />
                    </div>
                    <h6 className="text-xl font-semibold text-moon-dark">Face Recognition</h6>
                    <p className="mt-2 mb-4 text-moon-dark">
                      The camera includes a face recognition feature that
                      accurately identifies and recognizes faces, enhancing
                      security by allowing only authorized persons.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6 w-full md:w-4/12 px-4 text-center">
                <div className="relative flex flex-col min-w-0 break-words bg-moon-light-blue w-full mb-8 shadow-lg rounded-lg">
                  <div className="px-4 py-5 flex-auto">
                    <div className="text-moon-dark p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-moon-blue">
                      <i className="fas fa-shield-alt"></i>
                    </div>
                    <h6 className="text-xl font-semibold text-moon-light">Enhanced Security</h6>
                    <p className="mt-2 mb-4 text-moon-light">
                      Combining smart detection and face recognition, this
                      camera ensures enhanced security for your home by
                      providing real-time alerts and recognizing faces
                      seamlessly.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative py-20">
          <div className="container mx-auto px-4">
            <div className="items-center flex flex-wrap">
              <div className="w-full md:w-4/12 ml-auto mr-auto px-4">
                <img
                  alt="Smart Security Camera"
                  className="max-w-full rounded-lg shadow-lg"
                  src={require("../assets/img/monitor.jpeg")}
                />
              </div>
              <div className="w-full md:w-5/12 ml-auto mr-auto px-4">
                <div className="md:pr-12">
                  <h3 className="text-3xl font-semibold leading-normal text-moon-dark">
                    Secure Your Home Today
                  </h3>
                  <p className="mt-4 text-lg text-moon-dark">
                    Invest in advanced security for your home with our smart
                    camera. Experience the peace of mind that comes with state-of-the-art
                    technology designed to keep you and your loved ones safe.
                  </p>
                  <a
                    href="#"
                    className="font-bold text-moon-blue mt-8"
                  >
                    Get Started
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
