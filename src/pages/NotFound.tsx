
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { Home, ArrowLeft, Search } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  React.useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout hideFooter>
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-carpu-gradient opacity-10 blur-[60px] rounded-full"></div>
            <h1 className="text-9xl font-bold text-gradient">404</h1>
          </div>
          <h2 className="text-2xl font-bold mb-4">Page introuvable</h2>
          <p className="text-muted-foreground mb-8">
            Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link to="/" className="flex items-center">
                <Home className="mr-2 h-4 w-4" />
                Retour à l'accueil
              </Link>
            </Button>
            <Button asChild className="w-full sm:w-auto bg-carpu-gradient hover:opacity-90 transition-opacity">
              <Link to="/search" className="flex items-center">
                <Search className="mr-2 h-4 w-4" />
                Rechercher un trajet
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
