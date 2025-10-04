import { DASHBOARD_STATS } from '../data'
import { DashboardCard, ThemeToggle } from '../components/export'
import { MdOutlineSell } from "react-icons/md";
import { SlDirection } from "react-icons/sl";
import { CiCircleCheck } from "react-icons/ci";
import { PiUsersThree } from "react-icons/pi";

export default function Dashboard() {
  return (
    <>
      <div className="section-header">
        <ThemeToggle />
      </div>
      <div className="dashboard-grid">
        <DashboardCard
          title="Plots Sold"
          value={DASHBOARD_STATS.plotsSold}
          icon={<MdOutlineSell />}
        />
        <DashboardCard
          title="Plots Available"
          value={DASHBOARD_STATS.plotsAvailable}
          icon={<SlDirection />}
        />
        <DashboardCard
          title="Plots Registered"
          value={DASHBOARD_STATS.plotsRegistered}
          icon={<CiCircleCheck />}
        />
        <DashboardCard
          title="Customers"
          value={DASHBOARD_STATS.totalCustomers}
          icon={<PiUsersThree />}
        />
      </div>
    </>
  );
}
