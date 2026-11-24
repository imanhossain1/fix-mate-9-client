import Link from "next/link";

export default function ServiceCard({ service }) {
    console.log("Service Card Data:", service);

    return (
        <div className="card bg-base-100 shadow-xl border border-base-300">

            {/* Service Image */}
            <figure>
                <img
                    src={service.image}
                    alt={service.title}
                    className="h-48 w-full object-cover"
                />
            </figure>

            {/* Service Information */}
            <div className="card-body">

                <h2 className="card-title">
                    {service.title}
                </h2>

                <p className="text-sm">
                    {service.description}
                </p>

                <div className="space-y-2">

                    <p>
                        <strong>Category:</strong> {service.category}
                    </p>

                    <p>
                        <strong>Price:</strong> ৳{service.basePrice}
                    </p>

                    <p>
                        <strong>Duration:</strong> {service.estimatedDuration}
                    </p>

                    <p>
                        <strong>Service Area:</strong> {service.serviceArea}
                    </p>

                    <p>
                        <strong>Service Mode:</strong> {service.serviceMode}
                    </p>

                </div>

                <div className="card-actions justify-end mt-4">

                    <Link
                        href={`/services/${service._id}`}
                        className="btn btn-primary"
                    >
                        View Details
                    </Link>

                </div>

            </div>
        </div>
    );
}