
import Link from "next/link";

export default function CustomerDashboard() {
  return (
    <div>
      {/* Dashboard Heading */}
      <h1 className="text-2xl font-bold mb-2">
        Customer Dashboard
      </h1>

      <p className="text-base-content/60 mb-6">
        Manage your repair bookings and payments.
      </p>

      {/* Booking Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

        <div className="stat bg-base-100 shadow rounded-xl">
          <div className="stat-title">Total Bookings</div>
          <div className="stat-value text-primary">08</div>
          <div className="stat-desc">Your repair requests</div>
        </div>

        <div className="stat bg-base-100 shadow rounded-xl">
          <div className="stat-title">Pending Bookings</div>
          <div className="stat-value text-warning">03</div>
          <div className="stat-desc">Waiting for approval</div>
        </div>

        <div className="stat bg-base-100 shadow rounded-xl">
          <div className="stat-title">Completed</div>
          <div className="stat-value text-success">04</div>
          <div className="stat-desc">Successfully completed</div>
        </div>

        <div className="stat bg-base-100 shadow rounded-xl">
          <div className="stat-title">Total Payments</div>
          <div className="stat-value text-info">৳ 5,500</div>
          <div className="stat-desc">Your payment history</div>
        </div>

      </div>

      {/* Quick Actions */}
      <div className="bg-base-100 rounded-xl shadow p-5 mt-6">
        <h2 className="text-lg font-bold mb-4">
          Quick Actions
        </h2>

        <div className="flex flex-wrap gap-3">
          <Link href="/services" className="btn btn-primary">
            Browse Services
          </Link>

          <Link href="/dashboard/customer/bookings" className="btn btn-outline">
            My Bookings
          </Link>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-base-100 rounded-xl shadow p-5 mt-6">
        <h2 className="text-lg font-bold mb-4">
          Recent Bookings
        </h2>

        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Service</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>Laptop Repair</td>
                <td>18 Nov 2026</td>
                <td>
                  <span className="badge badge-warning">
                    Pending
                  </span>
                </td>
              </tr>

              <tr>
                <td>Windows Installation</td>
                <td>16 Nov 2026</td>
                <td>
                  <span className="badge badge-success">
                    Completed
                  </span>
                </td>
              </tr>

              <tr>
                <td>Computer Servicing</td>
                <td>14 Nov 2026</td>
                <td>
                  <span className="badge badge-info">
                    In Progress
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
