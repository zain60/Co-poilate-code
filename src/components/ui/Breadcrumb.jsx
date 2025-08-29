import React from "react";
import { Icons } from '../svg/Icons'

const Breadcrumb = ({ links }) => {
  return (
    <nav aria-label="breadcrumb">
      <ol className="flex text-gray-500 space-x-2">
        {links.map((link, index) => (
          <li key={index} className="flex items-center">
            {index !== 0 && <span className="mx-2"><Icons.ArrowRightIcon /></span>}
            {link.href ? (
              <a href={link.href} className="fs-14 fw-400 text-blue-85 hover:underline">
                {link.label}
              </a>
            ) : (
              <span className="fs-14 fw-400 text-blue-39">{link.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
