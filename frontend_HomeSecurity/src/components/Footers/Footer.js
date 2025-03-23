import React from "react";

export default function Footer() {
  return (
    <>
      <footer className="bg-moon-light py-4 text-moon-dark">
        <div
          className="w-full absolute pointer-events-none overflow-hidden -mt-20 h-20"
          style={{ transform: "translateZ(0)" }}
        >
          {/* Optional decorative element */}
        </div>
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap text-center lg:text-left">
            <div className="w-full lg:w-6/12 px-4">
              <h4 className="text-3xl font-semibold text-moon-dark">Stay Secure with Us!</h4>
              <h5 className="text-lg mt-0 mb-2 text-moon-dark">
                Connect with us on various platforms. We’re here to assist you with any security concerns or inquiries.
              </h5>
              <div className="mt-6 lg:mb-0 mb-6">
                <button
                  className="bg-moon-light text-moon-dark-blue shadow-lg font-normal h-10 w-10 items-center justify-center align-center rounded-full outline-none focus:outline-none mr-2"
                  type="button"
                >
                  <i className="fab fa-twitter"></i>
                </button>
                <button
                  className="bg-moon-light text-moon-dark-blue shadow-lg font-normal h-10 w-10 items-center justify-center align-center rounded-full outline-none focus:outline-none mr-2"
                  type="button"
                >
                  <i className="fab fa-facebook-square"></i>
                </button>
                <button
                  className="bg-moon-light text-moon-grey shadow-lg font-normal h-10 w-10 items-center justify-center align-center rounded-full outline-none focus:outline-none mr-2"
                  type="button"
                >
                  <i className="fab fa-instagram"></i>
                </button>
                <button
                  className="bg-moon-light text-moon-dark shadow-lg font-normal h-10 w-10 items-center justify-center align-center rounded-full outline-none focus:outline-none mr-2"
                  type="button"
                >
                  <i className="fab fa-linkedin"></i>
                </button>
              </div>
            </div>
            <div className="w-full lg:w-6/12 px-4">
              <div className="flex flex-wrap items-top mb-6">
                <div className="w-full lg:w-4/12 px-4 ml-auto">
                  <span className="block uppercase text-moon-grey text-sm font-semibold mb-2">
                    Helpful Links
                  </span>
                  <ul className="list-unstyled">
                    <li>
                      <a
                        className="text-moon-dark hover:text-moon-blue font-semibold block pb-2 text-sm"
                        href="/about"
                      >
                        About Us
                      </a>
                    </li>
                    <li>
                      <a
                        className="text-moon-dark hover:text-moon-blue font-semibold block pb-2 text-sm"
                        href="/blog"
                      >
                        Blog
                      </a>
                    </li>
                    <li>
                      <a
                        className="text-moon-dark hover:text-moon-blue font-semibold block pb-2 text-sm"
                        href="/support"
                      >
                        Support
                      </a>
                    </li>
                    <li>
                      <a
                        className="text-moon-dark hover:text-moon-blue font-semibold block pb-2 text-sm"
                        href="/faq"
                      >
                        FAQ
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="w-full lg:w-4/12 px-4">
                  <span className="block uppercase text-moon-grey text-sm font-semibold mb-2">
                    Additional Resources
                  </span>
                  <ul className="list-unstyled">
                    <li>
                      <a
                        className="text-moon-dark hover:text-moon-blue font-semibold block pb-2 text-sm"
                        href="/terms"
                      >
                        Terms & Conditions
                      </a>
                    </li>
                    <li>
                      <a
                        className="text-moon-dark hover:text-moon-blue font-semibold block pb-2 text-sm"
                        href="/privacy"
                      >
                        Privacy Policy
                      </a>
                    </li>
                    <li>
                      <a
                        className="text-moon-dark hover:text-moon-blue font-semibold block pb-2 text-sm"
                        href="/contact"
                      >
                        Contact Us
                      </a>
                    </li>
                    <li>
                      <a
                        className="text-moon-dark hover:text-moon-blue font-semibold block pb-2 text-sm"
                        href="/careers"
                      >
                        Careers
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <hr className="my-6 border-moon-grey" />
          <div className="flex flex-wrap items-center md:justify-between justify-center">
            <div className="w-full md:w-4/12 px-4 mx-auto text-center">
              <div className="text-sm text-moon-dark font-semibold py-1">
                Copyright © {new Date().getFullYear()} Smart Security Home by{" "}
                <a
                  href="https://www.yourcompany.com"
                  className="text-moon-dark hover:text-moon-blue"
                >
                  Your Company
                </a>
                .
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
