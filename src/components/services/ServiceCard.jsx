import Link from "next/link";

export default function ServiceCard({ service }) {
    return (
        <div className="card bg-base-100 shadow-xl">
            <figure>
                <img
                    src={service.image}
                    alt={service.title}
                    className="h-48 w-full object-cover"
                />
            </figure>

            <div className="card-body">
                <h2 className="card-title">
                    {service.title}
                </h2>

                <p>{service.description}</p>

                <p>Price: ৳{service.price}</p>

                <Link
                    href={`/services/${service._id}`}
                    className="btn btn-primary"
                >
                    View Details
                </Link>
            </div>
        </div>
    );
}