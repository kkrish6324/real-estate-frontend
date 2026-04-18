import { MapPin, Bed, Bath, Maximize } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import type { Property } from "@/data/properties";
import { formatINRShort, toPropertySlug } from "@/lib/utils";
import { imgUrl } from "@/hooks/useApi";

interface PropertyCardProps {
  property: Property;
}

const PropertyCard = ({ property }: PropertyCardProps) => (
  <Link
    to={`/properties/${toPropertySlug(property.title, property.id)}`}
    className="group block rounded-xl overflow-hidden border border-border bg-card hover:shadow-xl transition-all duration-300"
  >
    <div className="relative overflow-hidden aspect-[4/3]">
      <img
        src={imgUrl(property.images[0]) || property.images[0]}
        alt={property.title}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        loading="lazy"
        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
      />
      <Badge className="absolute top-3 left-3 capitalize">{property.type}</Badge>
      <div className="absolute bottom-3 right-3 bg-primary text-primary-foreground font-bold text-sm px-3 py-1 rounded-md">
        {formatINRShort(property.price)}
      </div>
    </div>
    <div className="p-4">
      <h3 className="font-display font-semibold text-lg text-card-foreground group-hover:text-primary transition-colors mb-1">
        {property.title}
      </h3>
      <div className="flex items-center gap-1 text-muted-foreground text-sm mb-3">
        <MapPin className="w-3.5 h-3.5" />
        {property.location}
      </div>
      <div className="flex items-center gap-4 text-sm text-muted-foreground border-t border-border pt-3">
        {property.bedrooms && (
          <span className="flex items-center gap-1"><Bed className="w-4 h-4" /> {property.bedrooms}</span>
        )}
        {property.bathrooms && (
          <span className="flex items-center gap-1"><Bath className="w-4 h-4" /> {property.bathrooms}</span>
        )}
        <span className="flex items-center gap-1"><Maximize className="w-4 h-4" /> {property.area} sqft</span>
      </div>
    </div>
  </Link>
);

export default PropertyCard;
