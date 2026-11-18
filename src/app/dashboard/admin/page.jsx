
export default function AdminDashboard() {
  return (
    <div>
      {/* Dashboard Heading */}
      <h1 className="text-2xl font-bold mb-2">
        Admin Dashboard
      </h1>

      <p className="text-base-content/60 mb-6">
        Welcome to FixMate Admin Panel
      </p>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

        <div className="stat bg-base-100 shadow rounded-xl">
          <div className="stat-title">Total Users</div>
          <div className="stat-value text-primary">120</div>
          <div className="stat-desc">All registered users</div>
        </div>

        <div className="stat bg-base-100 shadow rounded-xl">
          <div className="stat-title">Customers</div>
          <div className="stat-value text-success">85</div>
          <div className="stat-desc">Registered customers</div>
        </div>

        <div className="stat bg-base-100 shadow rounded-xl">
          <div className="stat-title">Technicians</div>
          <div className="stat-value text-info">20</div>
          <div className="stat-desc">Registered technicians</div>
        </div>

        <div className="stat bg-base-100 shadow rounded-xl">
          <div className="stat-title">Total Services</div>
          <div className="stat-value text-warning">15</div>
          <div className="stat-desc">All repair services</div>
        </div>

      </div>

      {/* Recent Bookings */}
      <div className="bg-base-100 rounded-xl shadow mt-6 p-5">
        <h2 className="text-lg font-bold mb-4">
          Recent Bookings
        </h2>

        <p className="text-base-content/60">
          Booking information will appear here.
        </p>
      </div>
    </div>
  );
}
