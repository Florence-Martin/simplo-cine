"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useState, FormEvent } from "react";
import {
  FaHome,
  FaSignInAlt,
  FaSearch,
  FaBars,
  FaTimes,
  FaUserPlus,
} from "react-icons/fa";

const useAuth = () => {
  const [isAuthenticated] = useState(true); // Change à true si l'utilisateur est connecté
  const [isAdmin] = useState(true); // Change à true si l'utilisateur est admin

  // Ici, tu peux utiliser un hook réel ou une API pour récupérer ces informations
  return { isAuthenticated, isAdmin };
};

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const { isAuthenticated, isAdmin } = useAuth();

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery) {
      router.push(`/search?query=${searchQuery}`);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-gray-800 p-4 shadow-sm flex items-center justify-between">
      <div className="flex items-center">
        <Link
          href="/"
          className="flex items-center ml-2 text-white hover:underline"
        >
          <FaHome className="text-white" />
          <span className="ml-2">Accueil</span>
        </Link>
      </div>

      <div className="hidden md:flex items-center space-x-4 text-white">
        <form onSubmit={handleSearch} className="flex items-center w-auto">
          <input
            type="text"
            className="px-3 py-1 rounded-lg text-gray-800"
            placeholder="Recherche films..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="ml-2 text-white hover:underline">
            <FaSearch />
          </button>
        </form>
      </div>

      <div className="hidden md:flex space-x-4 text-white">
        <div className="flex items-center">
          <Link
            href="/authentification/signin"
            className="flex items-center text-white hover:underline"
          >
            <FaSignInAlt className="text-white" />
            <span className="ml-2">Admin</span>
          </Link>
        </div>
      </div>

      <div className="md:hidden flex items-center">
        <button onClick={toggleMobileMenu} className="text-white">
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-12 left-0 w-full bg-gray-800 text-white flex flex-col py-4 z-50">
          <form
            onSubmit={handleSearch}
            className="flex items-center w-full px-4"
          >
            <input
              type="text"
              className="px-3 py-1 rounded-lg text-gray-800 w-full"
              placeholder="Recherche films..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="ml-2 text-white hover:underline">
              <FaSearch />
            </button>
          </form>

          <div className="flex flex-col items-start space-y-4 px-4 mt-4">
            <Link
              href="/authentification/signin"
              className="flex items-center hover:underline"
            >
              <FaSignInAlt />
              <span className="ml-2">Admin</span>
            </Link>
            {/* Affichage du lien Signup dans le menu mobile */}
            {isAuthenticated && isAdmin && (
              <Link
                href="/authentification/signup"
                className="flex items-center hover:underline"
              >
                <FaUserPlus />
                <span className="ml-2">Signup</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
