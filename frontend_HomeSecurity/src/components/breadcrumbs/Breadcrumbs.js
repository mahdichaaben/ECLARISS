// src/components/Breadcrumbs.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x); // Split and filter out empty strings

  // Create an array of breadcrumb items
  const crumbs = pathnames.map((_, index) => {
    const href = `/${pathnames.slice(0, index + 1).join('/')}`; // Build the URL for this crumb
    const label = pathnames[index].charAt(0).toUpperCase() + pathnames[index].slice(1); // Capitalize first letter

    return { href, label };
  });

  // Add a Home breadcrumb at the beginning
  const breadcrumbItems = [{ href: '/', label: 'Home' }, ...crumbs];

  return (
    <nav className="flex items-center space-x-2 py-2 px-4 bg-moon-light">
      {breadcrumbItems.map((crumb, index) => (
        <React.Fragment key={index}>
          {index > 0 && <span className="text-moon-dark">/</span>}
          {crumb.href ? (
            <Link to={crumb.href} className=" hover:text-moon-blue text-moon-light-blue">
              {crumb.label}
            </Link>
          ) : (
            <span className="text-moon-dark">{crumb.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
