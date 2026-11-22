import ServiceCard from "../../components/services/ServiceCard";
import { getServices } from "../../lib/api";

export default async function ServicesPage() {
    const services = await getServices();

    return (
        <main className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">
                All Repair Services || {services.length}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                    <ServiceCard
                        key={service._id}
                        service={service}
                    />
                ))}
            </div>
        </main>
    );
}