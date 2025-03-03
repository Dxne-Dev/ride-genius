
import React from 'react';
import { Star } from 'lucide-react';

interface TestimonialProps {
  content: string;
  author: string;
  role: string;
  rating: number;
  image: string;
}

const Testimonial: React.FC<TestimonialProps> = ({ content, author, role, rating, image }) => {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center space-x-1 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
      
      <p className="mb-6 text-foreground">{content}</p>
      
      <div className="flex items-center">
        <img
          src={image}
          alt={author}
          className="h-12 w-12 rounded-full object-cover mr-4"
        />
        <div>
          <p className="font-semibold">{author}</p>
          <p className="text-sm text-muted-foreground">{role}</p>
        </div>
      </div>
    </div>
  );
};

const Testimonials: React.FC = () => {
  const testimonials = [
    {
      content: "J'utilise RideGenius pour mes trajets quotidiens et c'est un véritable game-changer ! J'économise de l'argent tout en rencontrant des personnes intéressantes.",
      author: "Sophie Martin",
      role: "Utilisatrice régulière",
      rating: 5,
      image: "https://randomuser.me/api/portraits/women/12.jpg"
    },
    {
      content: "En tant que conducteur, RideGenius me permet de partager mes frais de route et de rendre service. L'application est intuitive et la mise en relation est super simple.",
      author: "Thomas Dubois",
      role: "Conducteur",
      rating: 5,
      image: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      content: "Le système de paiement en ligne est sécurisé et les itinéraires optimisés font gagner du temps. L'assistance client est également très réactive.",
      author: "Émilie Rousseau",
      role: "Voyageuse fréquente",
      rating: 4,
      image: "https://randomuser.me/api/portraits/women/44.jpg"
    }
  ];

  return (
    <section className="py-20 relative">
      <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-carpu-gradient opacity-10 blur-[120px] rounded-full -z-10" />
      
      <div className="container px-4 mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block py-1.5 px-4 rounded-full bg-carpu-purple/10 text-carpu-purple text-sm font-medium mb-4">
            Témoignages
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ce que disent nos <span className="text-gradient">utilisateurs</span></h2>
          <p className="text-muted-foreground">
            Découvrez les expériences de ceux qui utilisent RideGenius au quotidien.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Testimonial
              key={index}
              content={testimonial.content}
              author={testimonial.author}
              role={testimonial.role}
              rating={testimonial.rating}
              image={testimonial.image}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
