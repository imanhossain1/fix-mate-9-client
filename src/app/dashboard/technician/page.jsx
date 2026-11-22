import Link from "next/link";

export default function TechnicianDashboard() {
  return (
    <div>
      {/* Dashboard Heading */}
      <h1 className="text-2xl font-bold mb-2">
        Technician Dashboard
      </h1>

      <p className="text-base-content/60 mb-6">
        Manage your repair services and customer bookings.
      </p>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

        <div className="stat bg-base-100 shadow rounded-xl">
          <div className="stat-title">My Services</div>
          <div className="stat-value text-primary">08</div>
          <div className="stat-desc">Your listed services</div>
        </div>

        <div className="stat bg-base-100 shadow rounded-xl">
          <div className="stat-title">New Requests</div>
          <div className="stat-value text-warning">05</div>
          <div className="stat-desc">Waiting for your response</div>
        </div>

        <div className="stat bg-base-100 shadow rounded-xl">
          <div className="stat-title">In Progress</div>
          <div className="stat-value text-info">03</div>
          <div className="stat-desc">Ongoing repair jobs</div>
        </div>

        <div className="stat bg-base-100 shadow rounded-xl">
          <div className="stat-title">Completed Jobs</div>
          <div className="stat-value text-success">12</div>
          <div className="stat-desc">Successfully completed</div>
        </div>

      </div>

      {/* Quick Actions */}
      <div className="bg-base-100 rounded-xl shadow p-5 mt-6">
        <h2 className="text-lg font-bold mb-4">
          Quick Actions
        </h2>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/dashboard/technician/add-service"
            className="btn btn-primary"
          >
            Add Service
          </Link>

          <Link
            href="/dashboard/technician/my-services"
            className="btn btn-outline"
          >
            My Services
          </Link>

          <Link
            href="/dashboard/technician/requests"
            className="btn btn-outline"
          >
            Manage Requests
          </Link>

          <Link
            href="/dashboard/profile"
            className="btn btn-ghost"
          >
            Update Profile
          </Link>
        </div>
      </div>

      {/* Recent Booking Requests */}
      <div className="bg-base-100 rounded-xl shadow p-5 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">
            Recent Booking Requests
          </h2>
          <Link
            href="/dashboard/technician/requests"
            className="link link-primary text-sm"
          >
            View All Requests
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Service</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>Rahim</td>
                <td>Laptop Repair</td>
                <td>18 Nov 2026</td>
                <td>
                  <span className="badge badge-warning">
                    Requested
                  </span>
                </td>
              </tr>

              <tr>
                <td>Karim</td>
                <td>Windows Installation</td>
                <td>17 Nov 2026</td>
                <td>
                  <span className="badge badge-info">
                    In Progress
                  </span>
                </td>
              </tr>

              <tr>
                <td>Hasan</td>
                <td>PC Servicing</td>
                <td>16 Nov 2026</td>
                <td>
                  <span className="badge badge-success">
                    Completed
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}